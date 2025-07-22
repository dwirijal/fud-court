'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Table components implemented inline since they're not available
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Info, Activity, Target, BarChart3, Brain } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

import { FearGreedClient, FearGreedData } from '@/lib/api-clients/alternative/fearGreed';

// Enhanced data with calculated metrics
interface EnhancedFearGreedData extends FearGreedData {
  numericValue: number;
  volatility: number;
  momentum: number;
  rsi: number;
  movingAverage: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  date: string;
}

// Mathematical models and calculations
const calculateVolatility = (values: number[], period = 7): number => {
  if (values.length < period) return 0;
  const mean = values.slice(-period).reduce((sum, val) => sum + val, 0) / period;
  const variance = values.slice(-period).reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
  return Math.sqrt(variance);
};

const calculateRSI = (values: number[], period = 14): number => {
  if (values.length < period) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const change = values[values.length - i] - values[values.length - i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / (avgLoss || 0.01);
  return 100 - (100 / (1 + rs));
};

const calculateMomentum = (values: number[], period = 3): number => {
  if (values.length < period) return 0;
  return values[values.length - 1] - values[values.length - period];
};

const calculateMovingAverage = (values: number[], period = 7): number => {
  if (values.length < period) return values[values.length - 1] || 0;
  return values.slice(-period).reduce((sum, val) => sum + val, 0) / period;
};

  useEffect(() => {
    const fetchFearGreedData = async () => {
      try {
        const client = new FearGreedClient();
        const data = await client.getFearGreedIndex(30);
        
        // Process and enhance the data
        const values = data.map(item => parseInt(item.value));
        const enhancedData: EnhancedFearGreedData[] = data.map((item, index) => {
          const numericValue = parseInt(item.value);
          const historicalValues = values.slice(0, index + 1);
          
          return {
            ...item,
            numericValue,
            volatility: calculateVolatility(historicalValues),
            momentum: calculateMomentum(historicalValues),
            rsi: calculateRSI(historicalValues),
            movingAverage: calculateMovingAverage(historicalValues),
            trend: calculateMomentum(historicalValues) > 2 ? 'bullish' : 
                   calculateMomentum(historicalValues) < -2 ? 'bearish' : 'neutral',
            date: new Date(parseInt(item.timestamp) * 1000).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })
          };
        });
        
        setFearGreedData(enhancedData);
      } catch (err) {
        setError('Failed to fetch Fear & Greed Index data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFearGreedData();
  }, []);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Extreme Fear': return { bg: 'bg-red-700', text: 'text-white', border: 'border-red-500' };
      case 'Fear': return { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-400' };
      case 'Neutral': return { bg: 'bg-yellow-500', text: 'text-black', border: 'border-yellow-400' };
      case 'Greed': return { bg: 'bg-green-500', text: 'text-white', border: 'border-green-400' };
      case 'Extreme Greed': return { bg: 'bg-green-700', text: 'text-white', border: 'border-green-600' };
      default: return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-400' };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-yellow-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-64 lg:col-span-1" />
            <Skeleton className="h-64 lg:col-span-2" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Alert className="max-w-md border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (!fearGreedData || fearGreedData.length === 0) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-slate-600 dark:text-slate-400">No Fear & Greed Index data available.</p>
      </motion.div>
    );
  }

  const latestIndex = fearGreedData[fearGreedData.length - 1];
  const colors = getClassificationColor(latestIndex.value_classification);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-2">
            Fear & Greed Index
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Real-time market sentiment analysis with advanced mathematical modeling
          </p>
        </motion.div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Index Card */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <motion.div variants={pulseVariants} animate="pulse">
              <Card className={cn("relative overflow-hidden", colors.bg, colors.text)}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <CardHeader className="relative z-10 text-center pb-2">
                  <CardTitle className="text-2xl md:text-3xl font-bold">
                    {latestIndex.value_classification}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {getTrendIcon(latestIndex.trend)}
                    <Badge variant="outline" className="border-white/30 text-current">
                      {latestIndex.trend.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 text-center pb-6">
                  <motion.p 
                    className="text-5xl md:text-6xl font-bold mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                  >
                    {latestIndex.value}
                  </motion.p>
                  <div className="space-y-2 text-sm opacity-90">
                    <p>Last updated: {new Date(parseInt(latestIndex.timestamp) * 1000).toLocaleString()}</p>
                    {latestIndex.time_until_update && (
                      <p>Next update: {Math.floor(parseInt(latestIndex.time_until_update) / 3600)}h {Math.floor((parseInt(latestIndex.time_until_update) % 3600) / 60)}m</p>
                    )}
                  </div>
                  <Progress 
                    value={latestIndex.numericValue} 
                    className="mt-4 h-3 bg-white/20" 
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{latestIndex.volatility.toFixed(1)}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Volatility</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">{latestIndex.momentum.toFixed(1)}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Momentum</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">{latestIndex.rsi.toFixed(0)}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">RSI</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{latestIndex.movingAverage.toFixed(0)}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">MA(7)</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Detailed Analysis Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="historical">Historical</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="explanation">Guide</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="overview" className="space-y-6">
                  <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Trend Analysis (30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={fearGreedData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis 
                            dataKey="date" 
                            fontSize={12}
                            tickMargin={5}
                          />
                          <YAxis 
                            domain={[0, 100]}
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(15, 23, 42, 0.9)',
                              border: 'none',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="numericValue"
                            stroke="#3b82f6"
                            fill="url(#colorGradient)"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="movingAverage"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={false}
                            strokeDasharray="5 5"
                          />
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="historical">
                  <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Historical Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead>Classification</TableHead>
                              <TableHead className="hidden md:table-cell">Trend</TableHead>
                              <TableHead className="hidden lg:table-cell">Volatility</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {fearGreedData.slice().reverse().map((item, index) => {
                              const colors = getClassificationColor(item.value_classification);
                              return (
                                <motion.tr
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                >
                                  <TableCell>{new Date(parseInt(item.timestamp) * 1000).toLocaleDateString()}</TableCell>
                                  <TableCell className="font-bold">{item.value}</TableCell>
                                  <TableCell>
                                    <Badge className={cn(colors.bg, colors.text)}>
                                      {item.value_classification}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    <div className="flex items-center gap-1">
                                      {getTrendIcon(item.trend)}
                                      <span className="text-sm">{item.trend}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden lg:table-cell">
                                    {item.volatility.toFixed(1)}
                                  </TableCell>
                                </motion.tr>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Volatility Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={fearGreedData.slice(-14)}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="date" fontSize={10} />
                            <YAxis fontSize={10} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="volatility" 
                              stroke="#ef4444" 
                              strokeWidth={2}
                              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>RSI Momentum</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={fearGreedData.slice(-14)}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="date" fontSize={10} />
                            <YAxis domain={[0, 100]} fontSize={10} />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="rsi"
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="explanation">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          What is Fear & Greed Index?
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-600 dark:text-slate-400">
                          The Fear & Greed Index measures market sentiment on a scale of 0-100, where extreme fear (0-25) often presents buying opportunities, and extreme greed (75-100) may signal market tops.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-red-700 rounded"></div>
                            <span className="text-sm">0-25: Extreme Fear</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-orange-500 rounded"></div>
                            <span className="text-sm">25-45: Fear</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            <span className="text-sm">45-55: Neutral</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm">55-75: Greed</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-green-700 rounded"></div>
                            <span className="text-sm">75-100: Extreme Greed</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5" />
                          Mathematical Models
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3 text-sm">
                          <div>
                            <strong>Volatility:</strong>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                              σ = √(Σ(xi - μ)² / n) - Standard deviation of 7-day price movements
                            </p>
                          </div>
                          <div>
                            <strong>RSI (14-period):</strong>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                              RSI = 100 - (100 / (1 + RS)) where RS = Average Gain / Average Loss
                            </p>
                          </div>
                          <div>
                            <strong>Momentum:</strong>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                              M = Current Value - Value n-periods ago (3-day momentum)
                            </p>
                          </div>
                          <div>
                            <strong>Moving Average:</strong>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                              MA = (P1 + P2 + ... + Pn) / n (7-day simple moving average)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Data refreshed every hour • Mathematical models calculated in real-time
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}