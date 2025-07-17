
'use server';

import type { DefiLlamaProtocol, DefiLlamaStablecoin, DefiLlamaHistoricalTvl } from '@/types';
import { supabase } from './supabase'; // Import Supabase client

const DEFILLAMA_API_BASE_URL = 'https://api.llama.fi';
const DEFILLAMA_STABLECOINS_API_BASE_URL = 'https://stablecoins.llama.fi';
const CACHE_DURATION_SECONDS = 3600; // 1 hour cache duration

export async function getDefiLlamaProtocols(): Promise<DefiLlamaProtocol[] | null> {
    try {
        const { data: cachedData, error: cacheError } = await supabase
            .from('defillama_protocols')
            .select('last_updated')
            .order('last_updated', { ascending: false })
            .limit(1);

        if (cacheError) {
            console.error('Supabase DefiLlama protocols cache check error:', cacheError);
        }

        if (cachedData && cachedData.length > 0) {
            const lastUpdated = new Date(cachedData[0].last_updated).getTime();
            const now = new Date().getTime();
            if ((now - lastUpdated) / 1000 < CACHE_DURATION_SECONDS) {
                console.log('Serving DefiLlama protocols from fresh Supabase cache.');
                const { data: protocols, error } = await supabase.from('defillama_protocols').select('*');
                if (error) {
                    console.error('Error fetching protocols from cache after check:', error);
                    return null;
                }
                return protocols;
            }
            console.log('Supabase DefiLlama protocols cache is stale. Fetching from API.');
        }

        // Fetch from API if cache is empty or stale
        console.log('Fetching DefiLlama protocols from API.');
        const response = await fetch(`${DEFILLAMA_API_BASE_URL}/protocols`);
        if (!response.ok) {
            throw new Error(`DefiLlama Protocols API error: ${response.status} ${response.statusText}`);
        }

        const protocolsData: DefiLlamaProtocol[] = await response.json();

        // Map API data to match Supabase schema
        const protocolsToUpsert = protocolsData.map(p => ({
            id: p.id,
            name: p.name,
            symbol: p.symbol,
            category: p.category,
            chains: p.chains,
            tvl: p.tvl,
            chain_tvls: p.chainTvls,
            change_1d: p.change_1d,
            change_7d: p.change_7d,
            last_updated: new Date().toISOString(),
        }));

        const { error: upsertError } = await supabase.from('defillama_protocols').upsert(protocolsToUpsert, { onConflict: 'id' });

        if (upsertError) {
            console.error('Error upserting DefiLlama protocols into cache:', upsertError.message);
        } else {
            console.log('Successfully updated Supabase cache with new DefiLlama protocols data.');
        }
        
        return protocolsData;

    } catch (error) {
        console.error("An error occurred in getDefiLlamaProtocols:", error);
        // Fallback to cache if API fails
        const { data: protocols, error: fallbackError } = await supabase.from('defillama_protocols').select('*');
        if (fallbackError) {
            console.error('Error fetching protocols from cache as fallback:', fallbackError);
            return null;
        }
        if (protocols && protocols.length > 0) {
            console.warn('DefiLlama API failed, serving data from Supabase cache.');
            return protocols;
        }
        return null;
    }
}

export async function getDefiLlamaStablecoins(): Promise<DefiLlamaStablecoin[] | null> {
    try {
        const { data: cachedData, error: cacheError } = await supabase
            .from('defillama_stablecoins')
            .select('last_updated')
            .order('last_updated', { ascending: false })
            .limit(1);

        if (cacheError) {
            console.error('Supabase DefiLlama stablecoins cache check error:', cacheError);
        }

        if (cachedData && cachedData.length > 0) {
            const lastUpdated = new Date(cachedData[0].last_updated).getTime();
            const now = new Date().getTime();
            if ((now - lastUpdated) / 1000 < CACHE_DURATION_SECONDS) {
                console.log('Serving DefiLlama stablecoins from fresh Supabase cache.');
                const { data: stablecoins, error } = await supabase.from('defillama_stablecoins').select('*');
                 if (error) {
                    console.error('Error fetching stablecoins from cache after check:', error);
                    return null;
                }
                return stablecoins;
            }
             console.log('Supabase DefiLlama stablecoins cache is stale. Fetching from API.');
        }

        console.log('Fetching DefiLlama stablecoins from API.');
        const response = await fetch(`${DEFILLAMA_STABLECOINS_API_BASE_URL}/stablecoins`);
        if (!response.ok) {
            throw new Error(`DefiLlama Stablecoins API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const stablecoinsData = data.peggedAssets as DefiLlamaStablecoin[];

        const stablecoinsToUpsert = stablecoinsData.map(sc => ({
            id: sc.id,
            name: sc.name,
            symbol: sc.symbol,
            peg_type: sc.pegType,
            peg_mechanism: sc.pegMechanism,
            circulating_pegged_usd: sc.circulating?.peggedUSD ?? 0,
            chains: sc.chains,
            chain_circulating: sc.chainCirculating,
            price: sc.price,
            last_updated: new Date().toISOString(),
        }));

        const { error: upsertError } = await supabase.from('defillama_stablecoins').upsert(stablecoinsToUpsert, { onConflict: 'id' });
        if (upsertError) {
            console.error('Error upserting DefiLlama stablecoins into cache:', upsertError.message);
        } else {
            console.log('Successfully updated Supabase cache with new DefiLlama stablecoins data.');
        }

        return stablecoinsData;

    } catch (error) {
        console.error("An error occurred in getDefiLlamaStablecoins:", error);
         // Fallback to cache if API fails
        const { data: stablecoins, error: fallbackError } = await supabase.from('defillama_stablecoins').select('*');
        if (fallbackError) {
            console.error('Error fetching stablecoins from cache as fallback:', fallbackError);
            return null;
        }
        if (stablecoins && stablecoins.length > 0) {
            console.warn('DefiLlama API failed, serving data from Supabase cache.');
            return stablecoins;
        }
        return null;
    }
}

export async function getDefiLlamaHistoricalTvl(): Promise<DefiLlamaHistoricalTvl[] | null> {
  try {
    const { data: cachedData, error: cacheError } = await supabase
      .from('defillama_historical_tvl')
      .select('last_updated')
      .order('date', { ascending: false })
      .limit(1);

    if (cacheError) {
      console.error('Supabase DefiLlama historical TVL cache check error:', cacheError);
    }
    
    if (cachedData && cachedData.length > 0 && cachedData[0].last_updated) {
      const lastUpdated = new Date(cachedData[0].last_updated).getTime();
      const now = new Date().getTime();
      if ((now - lastUpdated) / 1000 < CACHE_DURATION_SECONDS) {
        console.log('Serving DefiLlama historical TVL from fresh Supabase cache.');
        const { data: tvl, error } = await supabase.from('defillama_historical_tvl').select('date, tvl');
         if (error) {
            console.error('Error fetching historical TVL from cache after check:', error);
            return null;
        }
        return tvl as DefiLlamaHistoricalTvl[];
      }
      console.log('Supabase DefiLlama historical TVL cache is stale. Fetching from API.');
    }

    console.log('Fetching DefiLlama historical TVL from API.');
    const response = await fetch(`${DEFILLAMA_API_BASE_URL}/v2/historicalChainTvl`);
    if (!response.ok) {
      throw new Error(`DefiLlama Historical TVL API error: ${response.status} ${response.statusText}`);
    }
    const data: DefiLlamaHistoricalTvl[] = await response.json();

    const historicalTvlToUpsert = data.map(tvl => ({
      date: tvl.date,
      tvl: tvl.tvl,
      last_updated: new Date().toISOString(),
    }));

    const { error: upsertError } = await supabase.from('defillama_historical_tvl').upsert(historicalTvlToUpsert, { onConflict: 'date' });
    if (upsertError) {
      console.error('Error upserting DefiLlama historical TVL into cache:', upsertError.message);
    } else {
      console.log('Successfully updated Supabase cache with new DefiLlama historical TVL data.');
    }

    return data;
  } catch (error) {
    console.error("An error occurred in getDefiLlamaHistoricalTvl:", error);
    const { data: tvl, error: fallbackError } = await supabase.from('defillama_historical_tvl').select('date, tvl');
    if (fallbackError) {
        console.error('Error fetching historical TVL from cache as fallback:', fallbackError);
        return null;
    }
    if (tvl && tvl.length > 0) {
        console.warn('DefiLlama API failed, serving data from Supabase cache.');
        return tvl as DefiLlamaHistoricalTvl[];
    }
    return null;
  }
}
