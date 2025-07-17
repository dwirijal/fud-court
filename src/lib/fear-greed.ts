
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
  }
}

/**
 * Fetches the Fear & Greed Index from the Supabase cache.
 * Throws an error if no data is found in the cache.
 */
export async function getFearAndGreedIndexFromCache(): Promise<FearGreedData> {
  const { data, error } = await supabase
    .from('fear_and_greed')
    .select('*')
    .single();

  if (error || !data) {
    console.error("Could not fetch Fear & Greed data from cache:", error);
    throw new Error("Fear & Greed data not available in cache.");
  }
  
  return {
      value: data.value,
      value_classification: data.value_classification as FearGreedData['value_classification'],
  };
}
