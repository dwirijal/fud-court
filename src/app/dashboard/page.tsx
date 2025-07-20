'use client';

import {
  Card,
  CardHeader,
  CardContent,
  Heading,
  Text,
  Button,
  Skeleton,
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Command,
  CommandPalette,
  CommandItem,
  CommandInput,
  CommandList,
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Form,
  FormControl,
  FormLabel,
  Input,
} from "@/components/ui";
import { useState, useEffect } from "react";
import { useRealTimePrices, usePortfolioTracker, useGasTracker, useTopMovers, useTVLTracker, useTokenSearch } from "@/hooks/use-crypto-api";
import { fetchMarketData } from "@/lib/coingecko";
import { CombinedMarketData } from "@/types";
import type { SearchResult } from "@/hooks/use-crypto-api";

export default function DashboardPage() {
  const [marketData, setMarketData] = useState<CombinedMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { data: portfolioData, loading: portfolioLoading, error: portfolioError } = usePortfolioTracker([]);
  const { data: gasData, loading: gasLoading, error: gasError } = useGasTracker();
  const { data: topMoversData, loading: topMoversLoading, error: topMoversError } = useTopMovers();
  const { data: tvlData, loading: tvlLoading, error: tvlError } = useTVLTracker();
  const { searchTokens, loading: searchLoading, error: searchError } = useTokenSearch();
  const { data: prices, loading: pricesLoading, error: pricesError } = useRealTimePrices([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMarketData();
        setMarketData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(true);
  };

  const handleSelectToken = (token: string) => {
    setSelectedToken(token);
    setIsSearchOpen(false);
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
    setAlertMessage("");
  };

  return (
    <div className="flex h-full">
      <Navbar>
        <NavbarContent>
          <NavbarBrand>
            <Heading>Crypto Dashboard</Heading>
          </NavbarBrand>
          <NavbarItem>
            <Button onClick={() => setIsAlertOpen(true)}>Create Alert</Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex-grow p-4">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : (
          <>
            <Command>
              <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
                <CommandInput placeholder="Search tokens..." onChange={handleSearch} />
                <CommandList>
                  {searchLoading ? (
                    <CommandItem disabled>Loading...</CommandItem>
                  ) : searchError ? (
                    <CommandItem disabled>Error: {searchError}</CommandItem>
                  ) : (
                    searchTokens().then((tokens) =>
                      tokens.map((token: SearchResult) => (
                        <CommandItem key={token.id} onClick={() => handleSelectToken(token.id)}>
                          {token.name} ({token.symbol})
                        </CommandItem>
                      ))
                    )
                  )}
                </CommandList>
              </CommandPalette>
            </Command>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <Heading>Portfolio</Heading>
                </CardHeader>
                <CardContent>
                  {portfolioLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : portfolioError ? (
                    <Text>Error: {portfolioError}</Text>
                  ) : portfolioData ? (
                    <>
                      <Text>Total Value: ${portfolioData.totalValue.toFixed(2)}</Text>
                      <Text>Total Change (24h): ${portfolioData.totalChange24h.toFixed(2)}</Text>
                    </>
                  ) : (
                    <Text>No portfolio data available.</Text>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Heading>Gas Prices</Heading>
                </CardHeader>
                <CardContent>
                  {gasLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : gasError ? (
                    <Text>Error: {gasError}</Text>
                  ) : gasData ? (
                    gasData.map((gas) => (
                      <div key={gas.chainId}>
                        <Text>Chain ID: {gas.chainId}</Text>
                        <Text>Standard: {gas.standard}</Text>
                        <Text>Fast: {gas.fast}</Text>
                        <Text>Instant: {gas.instant}</Text>
                      </div>
                    ))
                  ) : (
                    <Text>No gas data available.</Text>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Heading>Top Movers</Heading>
                </CardHeader>
                <CardContent>
                  {topMoversLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : topMoversError ? (
                    <Text>Error: {topMoversError}</Text>
                  ) : topMoversData ? (
                    <>
                      <Heading size={3}>Gainers</Heading>
                      {topMoversData.gainers.map((coin) => (
                        <div key={coin.id}>
                          <Text>{coin.id}: ${coin.current_price.toFixed(2)}</Text>
                        </div>
                      ))}
                      <Heading size={3}>Losers</Heading>
                      {topMoversData.losers.map((coin) => (
                        <div key={coin.id}>
                          <Text>{coin.id}: ${coin.current_price.toFixed(2)}</Text>
                        </div>
                      ))}
                    </>
                  ) : (
                    <Text>No top movers data available.</Text>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <Heading>TVL</Heading>
                </CardHeader>
                <CardContent>
                  {tvlLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : tvlError ? (
                    <Text>Error: {tvlError}</Text>
                  ) : tvlData ? (
                    tvlData.map((tvl) => (
                      <div key={tvl.name}>
                        <Text>{tvl.name}: ${tvl.tvl.toFixed(2)}</Text>
                      </div>
                    ))
                  ) : (
                    <Text>No TVL data available.</Text>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Heading>Real-time Prices</Heading>
                </CardHeader>
                <CardContent>
                  {pricesLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : pricesError ? (
                    <Text>Error: {pricesError}</Text>
                  ) : prices ? (
                    prices.map((price) => (
                      <div key={price.id}>
                        <Text>{price.id}: ${price.current_price.toFixed(2)}</Text>
                      </div>
                    ))
                  ) : (
                    <Text>No real-time prices available.</Text>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      <Dialog open={isAlertOpen} onClose={handleCloseAlert}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>Create Alert</DialogHeader>
          <DialogBody>
            <Form>
              <FormControl>
                <FormLabel>Message</FormLabel>
                <Input type="text" value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)} />
              </FormControl>
            </Form>
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleCloseAlert}>Cancel</Button>
            <Button type="submit" onClick={handleCloseAlert}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
