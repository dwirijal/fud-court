
'use server';

import { FredClient } from '@/lib/api-clients/economics/fred';
import { Indicator } from '@/config/fred-indicators';

export interface MetricData {
  seriesId: string;
  title: string;
  value: string;
  rawValue: number;
  date: string;
  change: number | null;
  trend: 'up' | 'down' | 'stable';
  units: string;
}

const formatValue = (value: string, units: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    
    const lowerUnits = units.toLowerCase();
    if (lowerUnits.includes('percent')) {
        return `${num.toFixed(2)}%`;
    }
    if (lowerUnits.includes('billions')) {
        return `${(num).toFixed(2)}B`;
    }
    if (lowerUnits.includes('millions')) {
        return `${(num).toFixed(2)}M`;
    }
    if (lowerUnits.includes('thousands')) {
        return `${(num / 1000).toFixed(2)}M`;
    }
    if (lowerUnits.includes('dollars')) {
        return `${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return num.toLocaleString(undefined, {maximumFractionDigits: 2});
};

export async function fetchFredData(indicators: Indicator[], limit: number = 2): Promise<Record<string, MetricData[]>> {
  const fredApiKey = process.env.NEXT_PUBLIC_FRED_API_KEY;

  if (!fredApiKey) {
    throw new Error('FRED API Key is not configured on the server.');
  }

  const fredClient = new FredClient({ apiKey: fredApiKey });
  const fetchedData: Record<string, MetricData[]> = {};

  const promises = indicators.map(indicator => {
      const units = 'lin'; // Request linear/level data for all indicators
      return fredClient.getSeriesObservations(indicator.id, { 
        limit: limit, 
        sort_order: 'desc',
        units: units
      })
        .then(response => ({ indicator, response }))
        .catch(error => ({ indicator, error }))
  });

  const results = await Promise.allSettled(promises);

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { indicator, response, error } = result.value;

      if (error || !response) {
        console.error(`Failed to fetch data for ${indicator.id}:`, error);
        fetchedData[indicator.id] = [];
        continue;
      }

      if (response.observations && response.observations.length > 0) {
        const seriesData: MetricData[] = response.observations
            .filter(o => o.value !== '.')
            .map((obs, index, arr) => {
                const latestValue = parseFloat(obs.value);
                let change: number | null = null;
                let trend: 'up' | 'down' | 'stable' = 'stable';

                if (index < arr.length - 1) {
                    const previousValue = parseFloat(arr[index + 1].value);
                    if (!isNaN(latestValue) && !isNaN(previousValue)) {
                        change = latestValue - previousValue;
                        if (change > 0.01) trend = 'up';
                        if (change < -0.01) trend = 'down';
                    }
                }

                return {
                    seriesId: indicator.id, 
                    title: indicator.title,
                    value: formatValue(obs.value, indicator.units),
                    rawValue: latestValue,
                    date: obs.date, 
                    change, 
                    trend, 
                    units: indicator.units
                };
            });

        fetchedData[indicator.id] = seriesData;
      }
    } else {
        console.error('A promise was rejected in fetchFredData:', result.reason);
    }
  }
  
  return fetchedData;
}
