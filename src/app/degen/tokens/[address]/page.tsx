'use client';

import { useEffect, useState, use } from 'react';
import { DexScreenerClient, DexScreenerPair } from '@/lib/api-clients/crypto/dexScreener';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Activity, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';

interface TokenDetailPageProps {
  params: { address: string };
}

interface TokenAnalysis {
  riskScore: number;
  liquidityRating: 'Low' | 'Medium' | 'High';
  volatilityRating: 'Low' | 'Medium' | 'High';
  trendStrength: number;
  marketCapEstimate?: number;
  volumeToMarketCapRatio?: number;
  priceStability: number;
  arbitrageOpportunities: Array<{
    pair1: string;
    pair2: string;
    priceDiff: number;
    percentage: number;
  }>;
}

export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { address } = use(params);
  const [tokenPairs, setTokenPairs] = useState<DexScreenerPair[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TokenAnalysis | null>(null);

  const calculateTokenAnalysis = (pairs: DexScreenerPair[]): TokenAnalysis => {
    if (!pairs.length) return {
      riskScore: 100,
      liquidityRating: 'Low',
      volatilityRating: 'High',
      trendStrength: 0,
      priceStability: 0,
      arbitrageOpportunities: []
    };

    // Calculate total volume and liquidity
    const totalVolume = pairs.reduce((sum, pair) => sum + (pair.volume?.h24 || 0), 0);
    const totalLiquidity = pairs.reduce((sum, pair) => sum + (pair.liquidity?.usd || 0), 0);
    const avgPrice = pairs.reduce((sum, pair) => sum + parseFloat(pair.priceUsd || '0'), 0) / pairs.length;

    // Price changes analysis
    const priceChanges = pairs.map(pair => pair.priceChange?.h24 || 0);
    const avgPriceChange = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
    const priceVolatility = Math.sqrt(priceChanges.reduce((sum, change) => sum + Math.pow(change - avgPriceChange, 2), 0) / priceChanges.length);

    // Market cap estimation (using largest pair)
    const mainPair = pairs.reduce((max, pair) => 
      (pair.volume?.h24 || 0) > (max.volume?.h24 || 0) ? pair : max
    );
    const marketCapEstimate = mainPair.fdv || (parseFloat(mainPair.priceUsd || '0') * 1000000000); // Rough estimate

    // Risk Score Calculation (0-100, lower is better)
    let riskScore = 50; // Base score
    
    // Liquidity factor
    if (totalLiquidity < 10000) riskScore += 30;
    else if (totalLiquidity < 100000) riskScore += 15;
    else if (totalLiquidity > 1000000) riskScore -= 10;

    // Volume factor
    if (totalVolume < 1000) riskScore += 25;
    else if (totalVolume < 10000) riskScore += 10;
    else if (totalVolume > 100000) riskScore -= 5;

    // Volatility factor
    if (priceVolatility > 20) riskScore += 20;
    else if (priceVolatility > 10) riskScore += 10;
    else if (priceVolatility < 5) riskScore -= 5;

    // Number of pairs factor (more pairs = less risk)
    if (pairs.length < 3) riskScore += 15;
    else if (pairs.length > 10) riskScore -= 10;

    riskScore = Math.max(0, Math.min(100, riskScore));

    // Liquidity Rating
    let liquidityRating: 'Low' | 'Medium' | 'High' = 'Low';
    if (totalLiquidity > 500000) liquidityRating = 'High';
    else if (totalLiquidity > 50000) liquidityRating = 'Medium';

    // Volatility Rating
    let volatilityRating: 'Low' | 'Medium' | 'High' = 'Low';
    if (priceVolatility > 15) volatilityRating = 'High';
    else if (priceVolatility > 8) volatilityRating = 'Medium';

    // Trend Strength (based on consistency of price movement)
    const positiveTrends = priceChanges.filter(change => change > 0).length;
    const trendStrength = Math.abs((positiveTrends / priceChanges.length) - 0.5) * 200;

    // Volume to Market Cap Ratio
    const volumeToMarketCapRatio = marketCapEstimate ? (totalVolume / marketCapEstimate) * 100 : 0;

    // Price Stability (inverse of volatility, normalized)
    const priceStability = Math.max(0, 100 - (priceVolatility * 2));

    // Arbitrage Opportunities
    const arbitrageOpportunities: TokenAnalysis['arbitrageOpportunities'] = [];
    for (let i = 0; i < pairs.length - 1; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        const price1 = parseFloat(pairs[i].priceUsd || '0');
        const price2 = parseFloat(pairs[j].priceUsd || '0');
        if (price1 > 0 && price2 > 0) {
          const priceDiff = Math.abs(price1 - price2);
          const percentage = (priceDiff / Math.min(price1, price2)) * 100;
          if (percentage > 0.5) { // Only show significant differences
            arbitrageOpportunities.push({
              pair1: `${pairs[i].dexId}`,
              pair2: `${pairs[j].dexId}`,
              priceDiff,
              percentage
            });
          }
        }
      }
    }

    return {
      riskScore,
      liquidityRating,
      volatilityRating,
      trendStrength,
      marketCapEstimate,
      volumeToMarketCapRatio,
      priceStability,
      arbitrageOpportunities: arbitrageOpportunities.slice(0, 5) // Limit to top 5
    };
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-500';
    if (score <= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskLevel = (score: number) => {
    if (score <= 30) return 'Low Risk';
    if (score <= 60) return 'Medium Risk';
    return 'High Risk';
  };

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        const dexScreener = new DexScreenerClient();
        const response = await dexScreener.getTokens(address);
        setTokenPairs(response.pairs);
        
        if (response.pairs && response.pairs.length > 0) {
          const analysisResult = calculateTokenAnalysis(response.pairs);
          setAnalysis(analysisResult);
        }
      } catch (err) {
        setError('Failed to fetch token details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchTokenDetails();
    }
  }, [address]);

  if (loading) {
    return <div className="p-4">Loading comprehensive token analysis...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!tokenPairs || tokenPairs.length === 0) {
    return <div className="p-4">No data found for this token address.</div>;
  }

  const tokenInfo = tokenPairs[0].baseToken.address.toLowerCase() === address.toLowerCase()
    ? tokenPairs[0].baseToken
    : tokenPairs[0].quoteToken;

  const totalVolume = tokenPairs.reduce((sum, pair) => sum + (pair.volume?.h24 || 0), 0);
  const totalLiquidity = tokenPairs.reduce((sum, pair) => sum + (pair.liquidity?.usd || 0), 0);
  const avgPrice = tokenPairs.reduce((sum, pair) => sum + parseFloat(pair.priceUsd || '0'), 0) / tokenPairs.length;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{tokenInfo.name} ({tokenInfo.symbol})</h1>
          <p className="text-muted-foreground">Address: {address}</p>
        </div>
        {analysis && (
          <Badge variant={analysis.riskScore <= 30 ? 'default' : analysis.riskScore <= 60 ? 'secondary' : 'destructive'} className="text-lg px-4 py-2">
            {getRiskLevel(analysis.riskScore)}
          </Badge>
        )}
      </div>

      {/* Investment Analysis Dashboard */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", getRiskColor(analysis.riskScore))}>
                {analysis.riskScore.toFixed(0)}/100
              </div>
              <p className="text-xs text-muted-foreground">
                Lower is better
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price Stability</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysis.priceStability.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                24h consistency metric
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liquidity Rating</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysis.liquidityRating}</div>
              <p className="text-xs text-muted-foreground">
                ${totalLiquidity.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volume/MCap Ratio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysis.volumeToMarketCapRatio ? `${analysis.volumeToMarketCapRatio.toFixed(2)}%` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Trading activity ratio
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Key Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Investment Metrics Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Market Data</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Average Price:</span>
                  <span className="font-mono">${avgPrice.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total 24h Volume:</span>
                  <span className="font-mono">${totalVolume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Liquidity:</span>
                  <span className="font-mono">${totalLiquidity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Pairs:</span>
                  <span className="font-mono">{tokenPairs.length}</span>
                </div>
              </div>
            </div>

            {analysis && (
              <>
                <div>
                  <h4 className="font-semibold mb-2">Risk Assessment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Volatility:</span>
                      <Badge variant={analysis.volatilityRating === 'Low' ? 'default' : analysis.volatilityRating === 'Medium' ? 'secondary' : 'destructive'}>
                        {analysis.volatilityRating}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Trend Strength:</span>
                      <span className="font-mono">{analysis.trendStrength.toFixed(1)}%</span>
                    </div>
                    {analysis.marketCapEstimate && (
                      <div className="flex justify-between">
                        <span>Est. Market Cap:</span>
                        <span className="font-mono">${(analysis.marketCapEstimate / 1000000).toFixed(2)}M</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Trading Insights</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Liquidity Grade:</span>
                      <Badge variant={analysis.liquidityRating === 'High' ? 'default' : analysis.liquidityRating === 'Medium' ? 'secondary' : 'outline'}>
                        {analysis.liquidityRating}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Arbitrage Ops:</span>
                      <span className="font-mono">{analysis.arbitrageOpportunities.length}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Arbitrage Opportunities */}
      {analysis && analysis.arbitrageOpportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Arbitrage Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Trading Opportunity Alert</AlertTitle>
              <AlertDescription>
                Price differences detected across exchanges. Consider transaction fees and slippage.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              {analysis.arbitrageOpportunities.map((arb, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <span className="font-medium">{arb.pair1}</span> vs <span className="font-medium">{arb.pair2}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{arb.percentage.toFixed(2)}% difference</div>
                    <div className="text-xs text-muted-foreground">${arb.priceDiff.toFixed(6)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Pairs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Pairs Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pair</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>DEX</TableHead>
                  <TableHead className="text-right">Price (USD)</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right">24h Volume</TableHead>
                  <TableHead className="text-right">Liquidity</TableHead>
                  <TableHead className="text-right">FDV</TableHead>
                  <TableHead className="text-center">Health</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenPairs.map((pair) => {
                  const volume = pair.volume?.h24 || 0;
                  const liquidity = pair.liquidity?.usd || 0;
                  const pairHealth = liquidity > 50000 && volume > 1000 ? 'Good' : 
                                   liquidity > 10000 && volume > 100 ? 'Fair' : 'Poor';
                  
                  return (
                    <TableRow key={pair.pairAddress}>
                      <TableCell className="font-medium">
                        <Link href={`/degen/tokens/${pair.baseToken.address}`} className="flex items-center gap-2">
                          {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                        </Link>
                      </TableCell>
                      <TableCell>{pair.chainId}</TableCell>
                      <TableCell>{pair.dexId}</TableCell>
                      <TableCell className="text-right font-mono">${parseFloat(pair.priceUsd || '0').toFixed(6)}</TableCell>
                      <TableCell className={cn(
                        "text-right font-mono",
                        pair.priceChange?.h24 >= 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        <div className="flex items-center justify-end gap-1">
                          {pair.priceChange?.h24 >= 0 ? 
                            <TrendingUp className="h-3 w-3" /> : 
                            <TrendingDown className="h-3 w-3" />
                          }
                          {pair.priceChange?.h24?.toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">${volume.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">${liquidity.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">
                        {pair.fdv ? `$${(pair.fdv / 1000000).toFixed(2)}M` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={pairHealth === 'Good' ? 'default' : pairHealth === 'Fair' ? 'secondary' : 'outline'}>
                          {pairHealth}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Investment Recommendations */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Investment Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={analysis.riskScore <= 30 ? 'border-green-500' : analysis.riskScore <= 60 ? 'border-yellow-500' : 'border-red-500'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Risk Assessment: {getRiskLevel(analysis.riskScore)}</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <div>
                  <strong>Key Factors:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Liquidity: {analysis.liquidityRating} (${totalLiquidity.toLocaleString()} total)</li>
                    <li>Volatility: {analysis.volatilityRating} based on 24h price movements</li>
                    <li>Market Pairs: {tokenPairs.length} active pairs across exchanges</li>
                    <li>Price Stability: {analysis.priceStability.toFixed(0)}% consistency score</li>
                    {analysis.volumeToMarketCapRatio && (
                      <li>Trading Activity: {analysis.volumeToMarketCapRatio.toFixed(2)}% volume-to-market-cap ratio</li>
                    )}
                  </ul>
                </div>
                <div className="mt-3">
                  <strong>Recommendation:</strong> {
                    analysis.riskScore <= 30 ? 
                      "Token shows good liquidity and stability metrics. Suitable for moderate position sizes." :
                    analysis.riskScore <= 60 ?
                      "Medium risk token. Consider smaller position sizes and monitor closely." :
                      "High risk token. Only suitable for speculative trading with proper risk management."
                  }
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
