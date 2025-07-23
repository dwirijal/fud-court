
'use client';

import { useEffect, useState, useCallback } from 'react';
import { FredClient, SeriesObservation } from '@/lib/api-clients/economics/fred';
import { indicatorGroups, Indicator } from '@/config/fred-indicators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { HeroSection } from '@/components/shared/HeroSection';

const fredApiKey = process.env.NEXT_PUBLIC_FRED_API_KEY;

const fredClient = fredApiKey ? new FredClient({ apiKey: fredApiKey }) : null;

interface MetricData {
  seriesId: string;
  title: string;
  value: string;
  date: string;
  change: number | null;
  trend: 'up' | 'down' | 'stable';
}

const formatValue = (value: string, units: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    
    if (units.toLowerCase().includes('percent')) return `${num.toFixed(2)}%`;
    if (units.toLowerCase().includes('thousands')) return `${(num / 1000).toFixed(2)}M`;
    if (units.toLowerCase().includes('billions')) return `${num.toFixed(2)}B`;
    return num.toLocaleString();
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
        case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
        case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
        default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
};

const KpiCard = ({ data, isLoading }: { data: MetricData | null; isLoading: boolean }) => {
    if (isLoading || !data) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-7 w-1/2" />
                    <Skeleton className="h-4 w-1/4 mt-1" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
                {getTrendIcon(data.trend)}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.value}</div>
                <p className="text-xs text-muted-foreground">as of {new Date(data.date).toLocaleDateString()}</p>
            </CardContent>
        </Card>
    );
};


const IndicatorTable = ({ indicators }: { indicators: Indicator[] }) => {
    const [data, setData] = useState<Record<string, MetricData>>({});
    const [loading, setLoading] = useState(true);

    const fetchIndicatorData = useCallback(async () => {
        if (!fredClient) return;

        setLoading(true);
        const promises = indicators.map(indicator => 
            fredClient.getSeriesObservations(indicator.id, { limit: 2, sort_order: 'desc' })
        );

        const results = await Promise.allSettled(promises);
        const fetchedData: Record<string, MetricData> = {};

        results.forEach((result, index) => {
            const indicator = indicators[index];
            if (result.status === 'fulfilled' && result.value.observations.length > 0) {
                const observations = result.value.observations;
                const latest = observations[0];
                const previous = observations[1];
                
                let change = null;
                let trend: 'up' | 'down' | 'stable' = 'stable';

                if (previous) {
                    const latestValue = parseFloat(latest.value);
                    const previousValue = parseFloat(previous.value);
                    if (!isNaN(latestValue) && !isNaN(previousValue)) {
                       change = latestValue - previousValue;
                       if (change > 0) trend = 'up';
                       if (change < 0) trend = 'down';
                    }
                }
                
                fetchedData[indicator.id] = {
                    seriesId: indicator.id,
                    title: indicator.title,
                    value: formatValue(latest.value, indicator.units),
                    date: latest.date,
                    change,
                    trend
                };
            }
        });

        setData(fetchedData);
        setLoading(false);
    }, [indicators]);

    useEffect(() => {
        fetchIndicatorData();
    }, [fetchIndicatorData]);

    if (loading) {
        return (
            <div className="space-y-2">
                {[...Array(indicators.length)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
        );
    }
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Indicator</TableHead>
                    <TableHead className="text-right">Latest Value</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {indicators.map(indicator => {
                    const metric = data[indicator.id];
                    return (
                        <TableRow key={indicator.id}>
                            <TableCell className="font-medium">{indicator.title}</TableCell>
                            <TableCell className="text-right">{metric ? metric.value : 'N/A'}</TableCell>
                            <TableCell className="text-right">{metric ? new Date(metric.date).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell className={`text-right ${metric && metric.change && metric.change > 0 ? 'text-green-500' : metric && metric.change && metric.change < 0 ? 'text-red-500' : ''}`}>
                                {metric && metric.change !== null ? metric.change.toFixed(2) : 'N/A'}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );
};

export default function MacroDashboardPage() {
    const [kpiData, setKpiData] = useState<Record<string, MetricData | null>>({
        'A191RL1Q225SBEA': null,
        'UNRATE': null,
        'CPIAUCSL': null,
        'FEDFUNDS': null,
    });
    const [loadingKpis, setLoadingKpis] = useState(true);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        if (!fredClient) {
            console.error("FRED API Key is not configured.");
            setLoadingKpis(false);
            return;
        }

        const fetchKpis = async () => {
            const kpiIds = ['A191RL1Q225SBEA', 'UNRATE', 'CPIAUCSL', 'FEDFUNDS'];
            const kpiTitles: Record<string, string> = {
                'A191RL1Q225SBEA': 'GDP Growth (YoY)',
                'UNRATE': 'Unemployment Rate',
                'CPIAUCSL': 'Inflation (CPI)',
                'FEDFUNDS': 'Fed Funds Rate'
            };
            const kpiUnits: Record<string, string> = {
                'A191RL1Q225SBEA': 'Percent',
                'UNRATE': 'Percent',
                'CPIAUCSL': 'Index',
                'FEDFUNDS': 'Percent'
            };

            const promises = kpiIds.map(id => fredClient.getSeriesObservations(id, { limit: 2, sort_order: 'desc' }));

            const results = await Promise.allSettled(promises);
            const fetchedData: Record<string, MetricData> = {};

            results.forEach((result, index) => {
                const id = kpiIds[index];
                if (result.status === 'fulfilled' && result.value.observations.length > 0) {
                    const obs = result.value.observations;
                    const latest = obs[0];
                    const previous = obs[1];
                    let trend: 'up' | 'down' | 'stable' = 'stable';
                    
                    if (previous) {
                        const change = parseFloat(latest.value) - parseFloat(previous.value);
                        if(change > 0.01) trend = 'up';
                        if(change < -0.01) trend = 'down';
                    }
                    
                    fetchedData[id] = {
                        seriesId: id,
                        title: kpiTitles[id],
                        value: formatValue(latest.value, kpiUnits[id]),
                        date: latest.date,
                        change: previous ? parseFloat(latest.value) - parseFloat(previous.value) : null,
                        trend
                    };
                }
            });
            setKpiData(fetchedData);
            setLoadingKpis(false);
        };

        fetchKpis();
    }, []);

    if (!fredClient) {
        return (
            <div className="p-4 md:p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        FRED API Key is not configured. Please set the NEXT_PUBLIC_FRED_API_KEY environment variable.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <>
        <HeroSection title="Dasbor Makro Ekonomi" description="Indikator ekonomi kunci dari Federal Reserve Economic Data (FRED)." />
        <div className="p-4 md:p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard isLoading={loadingKpis} data={kpiData['A191RL1Q225SBEA']} />
                <KpiCard isLoading={loadingKpis} data={kpiData['UNRATE']} />
                <KpiCard isLoading={loadingKpis} data={kpiData['CPIAUCSL']} />
                <KpiCard isLoading={loadingKpis} data={kpiData['FEDFUNDS']} />
            </div>

            <Accordion type="single" collapsible className="w-full" onValueChange={setOpenAccordion}>
                {indicatorGroups.map(group => (
                    <AccordionItem value={group.title} key={group.title}>
                        <AccordionTrigger className="text-xl font-semibold">{group.icon} {group.title}</AccordionTrigger>
                        <AccordionContent>
                           {openAccordion === group.title && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{group.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{group.description}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <IndicatorTable indicators={group.indicators} />
                                    </CardContent>
                                </Card>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
        </>
    );
}
