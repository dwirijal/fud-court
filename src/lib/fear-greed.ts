
'use server';

import { supabase } from './supabase';
import type { FearGreedData } from '@/types';

/**
 * Fetches the latest Fear & Greed Index from the API.
 */
export async function getFearAndGreedIndexFromApi(): Promise<FearGreedData | null> {
  try {
    const response = await fetch('https://api.alternative.me/fng/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const latestData = data.data[0];
    return {
      value: parseInt(latestData.value, 10),
      value_classification: latestData.value_classification,
    };
  } catch (error) {
    console.error("Error fetching Fear & Greed Index from API:", error);
    return null;
  }
}

/**
 * Syncs the latest Fear & Greed Index to the Supabase database.
 */
export async function syncFearAndGreedData() {
  console.log("Starting sync: Fear & Greed Index");
  const data = await getFearAndGreedIndexFromApi();
  if (data) {
    const { error } = await supabase.from('fear_and_greed').upsert({
      id: 1, // Always upsert the same row
      value: data.value,
      value_classification: data.value_classification,
      last_updated: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) {
      console.error("Error syncing Fear & Greed data to Supabase:", error);
      throw error;
    }
    console.log("Sync finished: Fear & Greed Index");
    return data;
  }
  return null;
}

/**
 * Fetches the Fear & Greed Index from the Supabase cache.
 * If the cache is empty, it fetches from the API and populates the cache.
 * Throws an error if both cache and API fail.
 */
export async function getFearAndGreedIndexFromCache(): Promise<FearGreedData> {
  const { data: cachedData, error: cacheError } = await supabase
    .from('fear_and_greed')
    .select('*')
    .single();

  if (!cacheError && cachedData) {
    return {
      value: cachedData.value,
      value_classification: cachedData.value_classification as FearGreedData['value_classification'],
    };
  }

  // If cache is empty or there was an error, fetch from API
  console.log("Fear & Greed cache is empty or failed to load. Fetching from API as fallback.");
  const apiData = await syncFearAndGreedData(); // sync also returns the data

  if (apiData) {
    return apiData;
  }
  
  // If both cache and API fail, throw an error
  throw new Error("Fear & Greed data not available. Both cache and API failed.");
}
