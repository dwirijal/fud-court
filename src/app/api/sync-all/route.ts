
import { NextResponse } from 'next/server';
import { CoinGeckoAPI, DefiLlamaClient } from '@/lib/api-clients/crypto';
import { FearGreedClient } from '@/lib/api-clients/alternative';

// This endpoint can be triggered by a cron job to keep the database fresh.
export async function GET() {
  console.log("Starting all data synchronization jobs...");
  try {
    const coinGeckoClient = new CoinGeckoAPI();
    const defiLlamaClient = new DefiLlamaClient();
    const fearGreedClient = new FearGreedClient();

    // Run all sync jobs concurrently for efficiency
    const [
      coinsResult,
      globalResult,
      fearGreedResult,
      defiLlamaResult,
    ] = await Promise.allSettled([
      coinGeckoClient.getCoinsMarkets({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        sparkline: false,
        price_change_percentage: '24h',
      }),
      coinGeckoClient.getGlobal(),
      fearGreedClient.getFearAndGreedIndex(),
      defiLlamaClient.getProtocols(),
    ]);

    const results = {
        syncTopCoins: coinsResult.status === 'fulfilled' ? 'Success' : `Failed: ${coinsResult.reason}`,
        syncGlobalMarketData: globalResult.status === 'fulfilled' ? 'Success' : `Failed: ${globalResult.reason}`,
        syncFearAndGreedData: fearGreedResult.status === 'fulfilled' ? 'Success' : `Failed: ${fearGreedResult.reason}`,
        syncDefiLlamaData: defiLlamaResult.status === 'fulfilled' ? 'Success' : `Failed: ${defiLlamaResult.reason}`,
    };

    console.log("Synchronization jobs finished.", results);
    
    // Check if any of the jobs failed to return the correct status code
    const hasFailedJobs = Object.values(results).some(res => typeof res === 'string' && res.startsWith('Failed'));

    if (hasFailedJobs) {
      return NextResponse.json({ message: 'One or more synchronization jobs failed.', results }, { status: 500 });
    }

    return NextResponse.json({ message: 'All data synchronized successfully.', results }, { status: 200 });

  } catch (error) {
    console.error('A critical error occurred during the sync process:', error);
    return NextResponse.json({ message: 'A critical error occurred during the sync process' }, { status: 500 });
  }
}
