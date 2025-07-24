
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, AlertCircle, DollarSign, Activity, BarChart3, PieChart, Globe, Zap, Building } from 'lucide-react';
import { fetchFredData, type MetricData } from './actions';
import { indicatorGroups, type Indicator } from '@/config/fred-indicators';


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

const MetricCard = ({ title, data, icon: Icon, loading = false }: {
    title: string;
    data?: MetricData;
    icon: React.ComponentType<any>;
    loading?: boolean;
}) => {
    if (loading || !data) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium"><Skeleton className="h-4 w-24" /></CardTitle>
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-4 w-16 mt-1" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.value}</div>
                <div className={`flex items-center text-xs ${getTrendColor(data.trend)}`}>
                    {getTrendIcon(data.trend)}
                    <span className="ml-1">from {new Date(data.date).toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    );
};

const IndicatorTable = ({ data, loading }: { data?: MetricData[], loading: boolean }) => {
    if (loading) {
        return (
            <div className="space-y-2">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
        );
    }

    if (!data) {
        return <div className="text-sm text-muted-foreground">Could not load data for this category.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium text-sm">Indicator</th>
                        <th className="text-right py-2 px-3 font-medium text-sm">Value</th>
                        <th className="text-right py-2 px-3 font-medium text-sm">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.seriesId} className="border-b last:border-b-0 hover:bg-muted/50">
                            <td className="py-2 px-3 font-medium text-sm">{item.title}</td>
                            <td className="text-right py-2 px-3 font-mono text-sm">{item.value}</td>
                            <td className="text-right py-2 px-3 font-mono text-xs">{item.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Main Dashboard Component
export default function MacroDashboardPage() {
    const [error, setError] = useState<string | null>(null);
    const [kpiData, setKpiData] = useState<Record<string, MetricData>>({});
    const [categoryData, setCategoryData] = useState<Record<string, MetricData[]>>({});
    const [loadingKpis, setLoadingKpis] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState<Record<string, boolean>>({});
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        setLastUpdated(new Date().toLocaleString());
    }, []);

    const fetchKpiData = useCallback(async () => {
        const kpiIndicators = [
            { id: 'A191RL1Q225SBEA', title: 'GDP Growth (YoY)', units: 'Percent' },
            { id: 'UNRATE', title: 'Unemployment Rate', units: 'Percent' },
            { id: 'CPIAUCSL', title: 'Inflation Rate', units: 'Percent' },
            { id: 'FEDFUNDS', title: 'Fed Funds Rate', units: 'Percent' },
        ];
        try {
            setLoadingKpis(true);
            const data = await fetchFredData(kpiIndicators);
            setKpiData(data);
        } catch (err) {
            setError('Failed to load key indicators.');
            console.error(err);
        } finally {
            setLoadingKpis(false);
        }
    }, []);

    useEffect(() => {
        fetchKpiData();
    }, [fetchKpiData]);
    
    const handleAccordionChange = async (value: string) => {
        // value is the title of the group
        if (!value || categoryData[value] || loadingCategories[value]) {
            return;
        }

        const group = indicatorGroups.find(g => g.title === value);
        if (!group) return;

        setLoadingCategories(prev => ({ ...prev, [value]: true }));
        try {
            const data = await fetchFredData(group.indicators);
            // Convert the record to an array for the table component
            setCategoryData(prev => ({ ...prev, [value]: Object.values(data) }));
        } catch (err) {
            console.error(`Failed to load data for ${value}:`, err);
            // You might want to set an error state for this specific category
        } finally {
            setLoadingCategories(prev => ({ ...prev, [value]: false }));
        }
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Dasbor Ekonomi Makro</h1>
                <p className="text-muted-foreground">
                    Indikator kunci yang membentuk pasar keuangan.
                </p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Pertumbuhan PDB (YoY)" data={kpiData['A191RL1Q225SBEA']} icon={BarChart3} loading={loadingKpis} />
                <MetricCard title="Tingkat Pengangguran" data={kpiData['UNRATE']} icon={Activity} loading={loadingKpis} />
                <MetricCard title="Tingkat Inflasi (CPI)" data={kpiData['CPIAUCSL']} icon={TrendingUp} loading={loadingKpis} />
                <MetricCard title="Suku Bunga Fed" data={kpiData['FEDFUNDS']} icon={DollarSign} loading={loadingKpis} />
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4" onValueChange={handleAccordionChange}>
                {indicatorGroups.map((group) => (
                    <AccordionItem value={group.title} key={group.title} className="border rounded-lg bg-card">
                        <AccordionTrigger className="px-6 text-lg font-semibold">
                            <div className="flex items-center gap-4">
                               <span className="text-2xl">{group.icon}</span> 
                               <div>
                                   {group.title}
                                   <p className="text-sm font-normal text-muted-foreground text-left">{group.description}</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6">
                           <IndicatorTable 
                                data={categoryData[group.title]} 
                                loading={loadingCategories[group.title] || false} 
                            />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>Sumber data: FRED API</p>
                {lastUpdated && <p>Terakhir diperbarui: {lastUpdated}</p>}
            </div>
        </div>
    );
}
