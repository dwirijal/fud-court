'use client';

import { useEffect, useState, useCallback } from 'react';
import { indicatorGroups, Indicator } from '@/config/fred-indicators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { HeroSection } from '@/components/shared/HeroSection';
import { fetchFredData, MetricData } from './actions';

const formatValue = (value: string, units: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    
    if (units.toLowerCase().includes('percent')) return `${num.toFixed(2)}%`;
    if (units.toLowerCase().includes('billions')) return `${num.toFixed(2)}B`;
    if (units.toLowerCase().includes('thousands of persons')) return `${(num/1000).toFixed(2)}M`;
    return num.toLocaleString(undefined, {maximumFractionDigits: 2});
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

const IndicatorTable = ({ indicators, data, isLoading }: { indicators: Indicator[], data: Record<string, MetricData>, isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
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
                                {metric && metric.change !== null ? formatValue(metric.change.toString(), metric.units) : 'N/A'}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );
};

export default function MacroDashboardPage() {
    const [kpiData, setKpiData] = useState<Record<string, MetricData | null>>({});
    const [loadingKpis, setLoadingKpis] = useState(true);
    const [accordionData, setAccordionData] = useState<Record<string, Record<string, MetricData>>>({});
    const [loadingAccordions, setLoadingAccordions] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    const kpiIndicators: Indicator[] = [
        { id: 'A191RL1Q225SBEA', title: 'GDP Growth (YoY)', units: 'Percent' },
        { id: 'UNRATE', title: 'Unemployment Rate', units: 'Percent' },
        { id: 'CPIAUCSL', title: 'Inflation (CPI)', units: 'Index' },
        { id: 'FEDFUNDS', title: 'Fed Funds Rate', units: 'Percent' }
    ];

    const handleFetchData = useCallback(async (indicators: Indicator[], groupTitle?: string) => {
        try {
            const data = await fetchFredData(indicators);
            if (groupTitle) {
                setAccordionData(prev => ({ ...prev, [groupTitle]: data }));
            } else {
                setKpiData(data);
            }
        } catch (err) {
            console.error("Failed to fetch FRED data:", err);
            setError("Failed to load economic data. The API might be temporarily unavailable.");
        } finally {
            if (groupTitle) {
                setLoadingAccordions(prev => ({ ...prev, [groupTitle]: false }));
            } else {
                setLoadingKpis(false);
            }
        }
    }, []);

    useEffect(() => {
        handleFetchData(kpiIndicators);
    }, [handleFetchData]);

    const handleAccordionChange = (value: string) => {
        const group = indicatorGroups.find(g => g.title === value);
        if (group && !accordionData[group.title] && !loadingAccordions[group.title]) {
            setLoadingAccordions(prev => ({ ...prev, [group.title]: true }));
            handleFetchData(group.indicators, group.title);
        }
    };

    if (error) {
         return (
            <div className="p-4 md:p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error}
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

                <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
                    {indicatorGroups.map(group => (
                        <AccordionItem value={group.title} key={group.title}>
                            <AccordionTrigger className="text-xl font-semibold">{group.icon} {group.title}</AccordionTrigger>
                            <AccordionContent>
                               <Card>
                                    <CardHeader>
                                        <CardTitle>{group.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{group.description}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <IndicatorTable 
                                            indicators={group.indicators} 
                                            data={accordionData[group.title] || {}}
                                            isLoading={loadingAccordions[group.title] !== false}
                                        />
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </>
    );
}