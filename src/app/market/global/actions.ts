
'use server';

import { FredClient } from '@/lib/api-clients/economics/fred';
import { Indicator } from '@/config/fred-indicators';

export interface MetricData {
  seriesId: string;
  title: string;
  value: string;
  date: string;
  change: number | null;
  trend: 'up' | 'down' | 'stable';
  units: string;
}

const formatValue = (value: string, units: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    
    if (units.toLowerCase().includes('percent') || units.toLowerCase().includes('rate')) return `${num.toFixed(2)}%`;
    if (units.toLowerCase().includes('billions')) return `${num.toFixed(2)}B`;
    if (units.toLowerCase().includes('thousands')) return `${(num/1000).toFixed(2)}M`;
    return num.toLocaleString(undefined, {maximumFractionDigits: 2});
};

export async function fetchFredData(indicators: Indicator[]): Promise<Record<string, MetricData>> {
  const fredApiKey = process.env.NEXT_PUBLIC_FRED_API_KEY;

  if (!fredApiKey) {
    throw new Error('FRED API Key is not configured on the server.');
  }

  const fredClient = new FredClient({ apiKey: fredApiKey });
  const fetchedData: Record<string, MetricData> = {};

  const promises = indicators.map(indicator => 
      fredClient.getSeriesObservations(indicator.id, { 
        limit: 2, 
        sort_order: 'desc',
        units: indicator.units.includes('Growth Rate') ? 'pc1' : 'lin'
      })
        .then(response => ({ indicator, response }))
        .catch(error => ({ indicator, error }))
  );

  const results = await Promise.allSettled(promises);

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { indicator, response, error } = result.value;

      if (error || !response) {
        console.error(`Failed to fetch data for ${indicator.id}:`, error);
        continue;
      }

      if (response.observations && response.observations.length > 0) {
        const obs = response.observations.filter(o => o.value !== '.');
        if (obs.length === 0) continue;

        const latest = obs[0];
        const previous = obs.length > 1 ? obs[1] : null;
        let change: number | null = null;
        let trend: 'up' | 'down' | 'stable' = 'stable';

        if (previous) {
            const latestValue = parseFloat(latest.value);
            const previousValue = parseFloat(previous.value);
            if (!isNaN(latestValue) && !isNaN(previousValue)) {
                change = latestValue - previousValue;
                if (change > 0.01) trend = 'up';
                if (change < -0.01) trend = 'down';
            }
        }
        
        let displayValue = latest.value;
        // The API returns the direct percent change value when units=pc1
        if (indicator.units.includes('Growth Rate')) {
          const numVal = parseFloat(latest.value);
          displayValue = isNaN(numVal) ? 'N/A' : `${numVal.toFixed(2)}%`;
        } else {
          displayValue = formatValue(latest.value, indicator.units);
        }


        fetchedData[indicator.id] = {
            seriesId: indicator.id, 
            title: indicator.title,
            value: displayValue,
            date: latest.date, 
            change, 
            trend, 
            units: indicator.units
        };
      }
    } else {
        console.error('A promise was rejected in fetchFredData:', result.reason);
    }
  }
  
  return fetchedData;
}
