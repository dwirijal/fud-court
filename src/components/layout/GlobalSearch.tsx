'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { GeckoTerminalAPI, Pool, Token } from '@/lib/api-clients/crypto/geckoterminal';
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

type SearchResult = (Pool | Token) & { network: string };

const isContractAddress = (query: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(query);
};

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
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
      setSearchResults([])
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const api = new GeckoTerminalAPI();
        const response = await api.search({ query, include: ['network'] });
        const resultsWithNetwork = response.data.map((item: any) => ({
          ...item,
          network: item.relationships?.network?.data?.id ?? 'unknown'
        }));
        setSearchResults(resultsWithNetwork.slice(0, 10)); // Limit to 10 results
      } catch (error) {
        console.error("Search failed:", error)
        setSearchResults([]);
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

  const renderItem = (item: SearchResult) => {
    if (item.type === 'token') {
      const token = item as Token;
      return (
        <CommandItem
          key={item.id}
          value={`token-${item.id}`}
          onSelect={() => runCommand(() => router.push(`/degen/tokens/${token.attributes.address}`))}
        >
          <Compass className="mr-2 h-4 w-4" />
          {token.attributes.name} ({token.attributes.symbol})
          <span className='ml-2 text-xs text-muted-foreground'>on {item.network}</span>
        </CommandItem>
      );
    }
    if (item.type === 'pool') {
      const pool = item as Pool;
      return (
        <CommandItem
          key={item.id}
          value={`pool-${item.id}`}
          onSelect={() => runCommand(() => router.push(`/degen/tokens/${pool.relationships.base_token.data.id.split('_')[1]}`))}
        >
          <CandlestickChart className="mr-2 h-4 w-4" />
          {pool.attributes.name}
          <span className='ml-2 text-xs text-muted-foreground'>on {item.network}</span>
        </CommandItem>
      );
    }
    return null;
  }

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
          placeholder="Search for a token or pair by name or address..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && <CommandEmpty>Loading...</CommandEmpty>}
          
          {searchResults.length === 0 && !loading && query.length > 2 && (
             <CommandEmpty>No results found.</CommandEmpty>
          )}

          {searchResults.length > 0 && (
            <CommandGroup heading="Results">
              {searchResults.map(item => renderItem(item))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
