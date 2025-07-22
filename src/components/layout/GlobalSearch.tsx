'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CoinGeckoAPI } from '@/lib/api-clients/crypto/coinGecko'
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Search, Compass, CandlestickChart } from 'lucide-react'

interface CoinSuggestion {
  id: string
  name: string
  symbol: string
  thumb: string;
}

const isContractAddress = (query: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(query);
};

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [coinSuggestions, setCoinSuggestions] = React.useState<CoinSuggestion[]>([])
  const [dexPairs, setDexPairs] = React.useState<DexScreenerPair[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  React.useEffect(() => {
    if (!query) {
      setCoinSuggestions([])
      setDexPairs([])
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const coinGecko = new CoinGeckoAPI()
        const dexScreener = new DexScreenerClient()

        if (isContractAddress(query)) {
          // It's a contract address, use getTokens from DexScreener
          const tokenResults = await dexScreener.getTokens(query).catch(() => ({ pairs: [] }));
          setDexPairs(tokenResults.pairs?.slice(0, 10) || []);
          setCoinSuggestions([]); // Clear coin suggestions
        } else {
          // It's a text query, use search from both
          const [coinResults, dexResults] = await Promise.all([
            coinGecko.search(query).catch(() => ({ coins: [] })),
            dexScreener.search(query).catch(() => ({ pairs: [] })),
          ])
  
          setCoinSuggestions(coinResults.coins?.slice(0, 5) || [])
          setDexPairs(dexResults.pairs?.slice(0, 5) || [])
        }

      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])
  
  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search for a coin or pair by name or address..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && <CommandEmpty>Loading...</CommandEmpty>}
          
          {coinSuggestions.length === 0 && dexPairs.length === 0 && !loading && query.length > 2 && (
             <CommandEmpty>No results found.</CommandEmpty>
          )}

          {coinSuggestions.length > 0 && (
            <CommandGroup heading="Coins">
              {coinSuggestions.map((coin) => (
                <CommandItem
                  key={coin.id}
                  value={`coin-${coin.id}`}
                  onSelect={() => runCommand(() => router.push(`/coins/${coin.id}`))}
                >
                  <Compass className="mr-2 h-4 w-4" />
                  {coin.name} ({coin.symbol})
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {dexPairs.length > 0 && (
            <CommandGroup heading="DEX Pairs">
              {dexPairs.map((pair) => (
                <CommandItem
                  key={pair.pairAddress}
                  value={`pair-${pair.pairAddress}`}
                  onSelect={() => runCommand(() => router.push(`/degen/tokens/${pair.baseToken.address}`))}
                >
                  <CandlestickChart className="mr-2 h-4 w-4" />
                  {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                  <span className='ml-2 text-xs text-muted-foreground'>({pair.dexId})</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
