
'use server';

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
