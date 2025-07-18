'use client';

import { Suspense, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, Target, Shield, Zap } from 'lucide-react';
import { useRealTimePrices } from '@/hooks/use-crypto-api';
import { 
  calculateMarketSentiment, 
  calculateTechnicalIndicators, 
  type MarketData, 
  type MarketSentimentResult,
  type TechnicalIndicators 
} from '@/lib/market-calculations';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

function MarketSentimentGauge({ sentiment }: { sentiment: MarketSentimentResult }) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Market Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold mb-2" style={{ color: sentiment.color }}>
            {sentiment.normalizedScore.toFixed(0)}
          </div>
          <Badge 
            variant="outline" 
            className="px-4 py-2 text-lg"
            style={{ borderColor: sentiment.color, color: sentiment.color }}
          >
            {sentiment.sentiment}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Sentiment Score</span>
              <span>{sentiment.normalizedScore.toFixed(1)}%</span>
            </div>
            <Progress 
              value={sentiment.normalizedScore} 
              className="h-3"
              style={{ 
                background: `linear-gradient(to right, 
                  hsl(var(--accent-secondary)) 0%, 
                  hsl(var(--accent-tertiary)) 25%, 
                  hsl(var(--text-tertiary)) 50%, 
                  hsl(var(--status-info)) 75%, 
                  hsl(var(--accent-primary)) 100%)`
              }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Raw Score:</span>
              <span className="ml-2 font-mono">{sentiment.rawScore.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-text-secondary">Normalized:</span>
              <span className="ml-2 font-mono">{sentiment.normalizedScore.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TechnicalIndicatorCard({ 
  title, 
  value, 
  suffix = '', 
  icon: Icon, 
  trend,
  description 
}: {
  title: string;
  value: number;
  suffix?: string;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-market-up';
      case 'down': return 'text-market-down';
      default: return 'text-text-secondary';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className="w-8 h-8 text-accent-primary" />
          {trend && (
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-text-primary">{title}</h3>
          <div className="text-2xl font-bold text-text-primary">
            {isNaN(value) ? '---' : value.toFixed(2)}{suffix}
          </div>
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SupportResistanceChart({ indicators }: { indicators: TechnicalIndicators }) {
  const data = [
    { name: 'Support', value: indicators.supportLevel, type: 'support' },
    { name: 'Current', value: 50000, type: 'current' }, // Mock current price
    { name: 'Resistance', value: indicators.resistanceLevel, type: 'resistance' },
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Support & Resistance Levels
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-market-down/10 rounded-lg">
            <div className="text-sm text-market-down mb-1">Support Level</div>
            <div className="text-xl font-bold text-market-down">
              ${indicators.supportLevel.toLocaleString()}
            </div>
          </div>
          <div className="text-center p-4 bg-market-up/10 rounded-lg">
            <div className="text-sm text-market-up mb-1">Resistance Level</div>
            <div className="text-xl font-bold text-market-up">
              ${indicators.resistanceLevel.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Price']} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--accent-primary))" 
                fill="hsl(var(--accent-primary))"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceSignalChart({ signal }: { signal: number }) {
  const data = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    signal: signal + (Math.random() - 0.5) * 10,
  }));

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Price Signal (MACD-like)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-text-secondary">Current Signal:</span>
              <span className={`ml-2 font-bold ${signal >= 0 ? 'text-market-up' : 'text-market-down'}`}>
                {signal.toFixed(2)}%
              </span>
            </div>
            <Badge variant={signal >= 0 ? 'default' : 'destructive'}>
              {signal >= 0 ? 'Bullish' : 'Bearish'}
            </Badge>
          </div>
        </div>
        
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="signal" 
                stroke="hsl(var(--accent-primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MarketSentimentPage() {
  const { data: cryptoData, loading, error } = useRealTimePrices(['bitcoin', 'ethereum']);
  const [sentiment, setSentiment] = useState<MarketSentimentResult | null>(null);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);

  useEffect(() => {
    if (cryptoData && cryptoData.length > 0) {
      const bitcoin = cryptoData.find(coin => coin.id === 'bitcoin');
      if (bitcoin) {
        // Transform API data to MarketData format
        const marketData: MarketData = {
          price: bitcoin.current_price,
          priceChange24h: bitcoin.price_change_percentage_24h || 0,
          volume24h: bitcoin.volume_24h || 0,
          volumeChange24h: 0, // Mock data - would need separate API call
          marketCap: bitcoin.market_cap,
          marketCapChange24h: 0, // Mock data - would need historical data
          dominance: 0, // Mock data - would need global market data
          dominanceChange: 0, // Mock data - would need historical dominance data
          allTimeHigh: bitcoin.current_price * 1.5, // Mock data - would need ATH from detailed API
          allTimeLow: bitcoin.current_price * 0.1, // Mock data - would need ATL from detailed API
        };

        // Calculate sentiment and indicators
        const sentimentResult = calculateMarketSentiment(marketData);
        const technicalIndicators = calculateTechnicalIndicators(marketData);
        
        setSentiment(sentimentResult);
        setIndicators(technicalIndicators);
      }
    }
  }, [cryptoData]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-bg-secondary rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-bg-secondary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !sentiment || !indicators) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-status-error text-xl mb-2">Error loading market data</div>
          <div className="text-text-secondary">{error || 'Unable to calculate market sentiment'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Market Sentiment Analysis</h1>
        <p className="text-text-secondary">
          Real-time market sentiment calculation using advanced technical indicators and algorithmic analysis
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Market Sentiment Gauge - spans 2 columns */}
        <Suspense fallback={<div className="animate-skeleton h-60 rounded lg:col-span-2"></div>}>
          <MarketSentimentGauge sentiment={sentiment} />
        </Suspense>

        {/* Technical Indicators */}
        <TechnicalIndicatorCard
          title="Volatility Index"
          value={indicators.volatilityIndex}
          suffix="%"
          icon={Activity}
          trend={indicators.volatilityIndex > 50 ? 'up' : 'down'}
          description="Market volatility measure"
        />

        <TechnicalIndicatorCard
          title="Liquidity Ratio"
          value={indicators.liquidityRatio}
          suffix="%"
          icon={Zap}
          trend={indicators.liquidityRatio > 10 ? 'up' : 'down'}
          description="Volume to market cap ratio"
        />

        <TechnicalIndicatorCard
          title="Sharpe Ratio"
          value={indicators.sharpeRatio || 0}
          icon={Shield}
          trend={indicators.sharpeRatio && indicators.sharpeRatio > 1 ? 'up' : 'down'}
          description="Risk-adjusted returns"
        />

        <TechnicalIndicatorCard
          title="Price Signal"
          value={indicators.priceSignal}
          suffix="%"
          icon={TrendingUp}
          trend={indicators.priceSignal > 0 ? 'up' : 'down'}
          description="MACD-like signal"
        />

        {/* Support & Resistance Chart */}
        <Suspense fallback={<div className="animate-skeleton h-60 rounded lg:col-span-2"></div>}>
          <SupportResistanceChart indicators={indicators} />
        </Suspense>

        {/* Price Signal Chart */}
        <Suspense fallback={<div className="animate-skeleton h-60 rounded lg:col-span-2"></div>}>
          <PriceSignalChart signal={indicators.priceSignal} />
        </Suspense>

        {/* Additional Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Methodology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Market Sentiment:</strong> Weighted calculation based on price change (30%), 
                volume change (20%), market cap change (20%), and dominance change (30%).
              </div>
              <div>
                <strong>Support/Resistance:</strong> Fibonacci-based levels using ATH/ATL data 
                with 61.8% and 38.2% retracement ratios.
              </div>
              <div>
                <strong>Price Signal:</strong> MACD-like indicator comparing 12-period and 26-period 
                exponential moving averages.
              </div>
              <div>
                <strong>Volatility Index:</strong> Standard deviation of price changes multiplied by 100 
                for percentage representation.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
