
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, AlertCircle, DollarSign, Activity, BarChart3, Building, Droplets, ShoppingCart, LineChart } from 'lucide-react';
import { fetchFredData, type MetricData } from './actions';
import { indicatorGroups } from '@/config/fred-indicators';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateSMA, calculateRSI, calculateMACD } from '@/lib/utils/financialCalculations';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
};
  
const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
        case 'up': return 'text-green-500';
        case 'down': return 'text-red-500';
        default: return 'text-gray-500';
    }
};

const kpiIndicators = [
    { id: 'A191RL1Q225SBEA', title: 'GDP Growth (YoY)', units: 'Percent', icon: BarChart3 },
    { id: 'UNRATE', title: 'Unemployment Rate', units: 'Percent', icon: Activity },
    { id: 'CPIAUCSL', title: 'Inflation Rate (CPI)', units: 'Percent Change from Year Ago', icon: TrendingUp },
    { id: 'FEDFUNDS', title: 'Fed Funds Rate', units: 'Percent', icon: DollarSign },
];

const MetricCard = ({ title, data, icon: Icon, loading = false }: {
    title: string;
    data?: MetricData;
    icon: React.ComponentType<any>;
    loading?: boolean;
}) => {
    if (loading || !data) {
        return (
            <Card className="flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium"><Skeleton className="h-4 w-3/4" /></CardTitle>
                    <Skeleton className="h-6 w-6 rounded-full" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.value}</div>
                <div className={`flex items-center text-xs ${getTrendColor(data.trend)}`}>
                    {getTrendIcon(data.trend)}
                    <span className="ml-1">as of {new Date(data.date).toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    );
};

const IndicatorChart = ({ data, loading }: { data?: MetricData[], loading: boolean }) => {
    if (loading) return <Skeleton className="h-60 w-full" />;
    if (!data || data.length === 0) return <div className="text-sm text-muted-foreground h-60 flex items-center justify-center">No historical data available.</div>;

    // Dummy historical data for charting demonstration
    const chartData = data.map(d => ({
        date: d.date,
        value: parseFloat(d.value.replace(/[^0-9.-]+/g,""))
    })).reverse(); // Assuming data is sorted desc

    return (
        <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

const IndicatorTable = ({ data, loading, onRowClick, selectedIndicator }: {
    data?: MetricData[];
    loading: boolean;
    onRowClick: (seriesId: string) => void;
    selectedIndicator: string | null;
}) => {
    if (loading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return <div className="text-sm text-muted-foreground p-4 text-center">Could not load data for this category.</div>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Indicator</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map(item => (
                    <TableRow 
                        key={item.seriesId} 
                        onClick={() => onRowClick(item.seriesId)}
                        className={cn(
                            "cursor-pointer",
                            selectedIndicator === item.seriesId && "bg-muted/50"
                        )}
                    >
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="text-right font-mono">{item.value}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{item.date}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

const AdvancedIndicatorChart = ({ historicalData, loading }: { historicalData: MetricData[] | null, loading: boolean }) => {
    if (loading) return <Skeleton className="h-[500px] w-full" />;
    if (!historicalData || historicalData.length < 20) {
        return (
            <div className="h-[500px] w-full flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                    <LineChart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Select an Indicator</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Click on a row in the table to view its historical data and technical analysis.</p>
                </div>
            </div>
        );
    }

    const chartData = historicalData.map(d => d.rawValue).reverse();
    const dates = historicalData.map(d => d.date).reverse();

    const sma20 = calculateSMA(chartData, 20);
    const rsi = calculateRSI(chartData, 14);
    const macd = calculateMACD(chartData);

    const combinedData = dates.map((date, i) => ({
        date,
        value: chartData[i],
        sma20: sma20[i],
        rsi: rsi[i],
        macd: macd[i]?.macd,
        macdSignal: macd[i]?.signal,
        macdHistogram: macd[i]?.histogram,
    }));

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">{historicalData[0].title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" name="Price" />
                    <Area type="monotone" dataKey="sma20" stroke="#facc15" fill="transparent" name="SMA(20)" />
                </AreaChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" hide />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="rsi" stroke="#82ca9d" fill="#82ca9d" name="RSI" />
                </AreaChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" hide />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="macd" stroke="#ffc658" name="MACD" />
                    <Area type="monotone" dataKey="macdSignal" stroke="#ff8042" name="Signal" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

import { cn } from '@/lib/utils/utils';

const SidebarNav = ({ groups, selected, onSelect }: {
    groups: typeof indicatorGroups;
    selected: string;
    onSelect: (title: string) => void;
}) => (
    <aside className="flex flex-col space-y-1">
        {groups.map((group) => {
            const Icon = group.icon;
            return (
                <button
                    key={group.title}
                    onClick={() => onSelect(group.title)}
                    className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        selected === group.title
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                    )}
                >
                    <Icon className="h-5 w-5" />
                    <span>{group.title}</span>
                </button>
            );
        })}
    </aside>
);


export default function GlobalMarketOverviewPage() {
    const [error, setError] = useState<string | null>(null);
    const [allData, setAllData] = useState<Record<string, MetricData[]>>({});
    const [loading, setLoading] = useState(true);
    const [clientLoaded, setClientLoaded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>(indicatorGroups[0].title);
    const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
    const [loadingHistorical, setLoadingHistorical] = useState(false);

    useEffect(() => {
        setClientLoaded(true);

        const loadInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                const previewIndicators = [...kpiIndicators, ...indicatorGroups.flatMap(g => g.indicators)];
                const uniquePreviewIndicators = Array.from(new Map(previewIndicators.map(item => [item.id, item])).values());
                const previewData = await fetchFredData(uniquePreviewIndicators, 2);
                
                const firstIndicator = indicatorGroups[0]?.indicators[0];
                if (firstIndicator) {
                    setSelectedIndicator(firstIndicator.id);
                    const historicalData = await fetchFredData([firstIndicator], 200);
                    setAllData({ ...previewData, ...historicalData });
                } else {
                    setAllData(previewData);
                }

            } catch (err) {
                setError('Failed to load global economic data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleIndicatorSelect = useCallback(async (seriesId: string) => {
        setSelectedIndicator(seriesId);
        if (allData[seriesId] && allData[seriesId].length >= 200) {
            return; // Already have enough data
        }

        setLoadingHistorical(true);
        try {
            const indicator = indicatorGroups.flatMap(g => g.indicators).find(i => i.id === seriesId) || kpiIndicators.find(i => i.id === seriesId);
            if (indicator) {
                const data = await fetchFredData([indicator], 200);
                setAllData(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error(`Failed to load historical data for ${seriesId}:`, err);
        } finally {
            setLoadingHistorical(false);
        }
    }, [allData]);

    const selectedGroup = indicatorGroups.find(g => g.title === selectedCategory);
    const groupData = selectedGroup?.indicators.map(ind => allData[ind.id]?.[0]).filter(Boolean) as MetricData[] ?? [];
    const SelectedIcon = selectedGroup?.icon;

    const historicalData = selectedIndicator ? allData[selectedIndicator] : null;

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Global Economic Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                    A comprehensive overview of key indicators shaping the financial markets.
                </p>
            </header>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Key Performance Indicators</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {kpiIndicators.map(kpi => (
                        <MetricCard 
                            key={kpi.id}
                            title={kpi.title} 
                            data={allData[kpi.id]?.[0]} 
                            icon={kpi.icon} 
                            loading={loading} 
                        />
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                <SidebarNav 
                    groups={indicatorGroups} 
                    selected={selectedCategory} 
                    onSelect={(title) => {
                        setSelectedCategory(title);
                        const firstIndicatorInNewCategory = indicatorGroups.find(g => g.title === title)?.indicators[0];
                        if(firstIndicatorInNewCategory) {
                            handleIndicatorSelect(firstIndicatorInNewCategory.id);
                        }
                    }} 
                />
                
                <main className="space-y-6">
                    {selectedGroup && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    {SelectedIcon && <SelectedIcon className="h-7 w-7 text-muted-foreground" />}
                                    {selectedGroup.title}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground pt-1">{selectedGroup.description}</p>
                            </CardHeader>
                            <CardContent>
                                <IndicatorTable 
                                    data={groupData} 
                                    loading={loading} 
                                    onRowClick={handleIndicatorSelect}
                                    selectedIndicator={selectedIndicator}
                                />
                            </CardContent>
                        </Card>
                    )}
                    <AdvancedIndicatorChart historicalData={historicalData} loading={loadingHistorical || loading} />
                </main>
            </div>
            
            <footer className="mt-12 text-center text-sm text-gray-500">
                <p>Source: FRED, Federal Reserve Economic Data.</p>
                {clientLoaded && <p>Last updated: {new Date().toLocaleString()}</p>}
            </footer>
        </div>
    );
}
