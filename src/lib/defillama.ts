'use server';

import type { DefiLlamaProtocol, DefiLlamaStablecoin, DefiLlamaHistoricalTvl } from '@/types';
import { supabase } from './supabase'; // Import Supabase client

interface DefiLlamaCoinData {
  tvl: number | null;
  chains: string[];
  protocols: { name: string; id: string }[];
}

const DEFILLAMA_API_BASE_URL = 'https://api.llama.fi';
const DEFILLAMA_STABLECOINS_API_BASE_URL = 'https://stablecoins.llama.fi';
const CACHE_DURATION_SECONDS = 3600; // 1 hour cache duration for DefiLlama data

export async function getDefiLlamaCoinData(coinId: string): Promise<DefiLlamaCoinData | null> {
  try {
    const protocols = await getDefiLlamaProtocols();
    if (!protocols) return null;

    const protocol = protocols.find(p => p.id === coinId || p.symbol?.toLowerCase() === coinId.toLowerCase() || p.name?.toLowerCase() === coinId.toLowerCase());

    if (protocol) {
      return {
        tvl: protocol.tvl,
        chains: protocol.chains,
        protocols: [{ name: protocol.name, id: protocol.id }],
      };
    } else {
      console.warn(`DefiLlama protocol not found for coinId: ${coinId}`);
      return null;
    }
  } catch (error) {
    console.error(`An error occurred while fetching DefiLlama data for ${coinId}:`, error);
    return null;
  }
}

export async function getDefiLlamaProtocols(): Promise<DefiLlamaProtocol[] | null> {
  let cachedData: DefiLlamaProtocol[] | null = null;
  // 1. Try to fetch from Supabase cache, if client is available
  if (supabase) {
    try {
      const { data, error: cacheError } = await supabase
        .from('defillama_protocols')
        .select('protocols')
        .order('last_updated', { ascending: false })
        .limit(1);

      if (data && data.length > 0 && data[0].protocols) {
        // Assuming 'protocols' column stores the array
        const protocolArray = data[0].protocols as DefiLlamaProtocol[]; 
        const { data: timestampData } = await supabase.from('defillama_protocols').select('last_updated').limit(1).single();
        const lastUpdated = new Date(timestampData?.last_updated).getTime();
        const now = new Date().getTime();
        
        if ((now - lastUpdated) / 1000 < CACHE_DURATION_SECONDS) {
          console.log('Serving DefiLlama protocols from fresh Supabase cache.');
          return protocolArray;
        }
        cachedData = protocolArray;
        console.log('Supabase DefiLlama protocols cache is stale. Will fetch from API.');
      }

      if (cacheError) {
        console.error('Supabase DefiLlama protocols cache read error:', cacheError);
      }
    } catch (e) {
      console.error('An unexpected error occurred during DefiLlama protocols cache fetch:', e);
    }
  }

  // 2. If cache is stale or empty, fetch from API
  try {
    console.log('Fetching DefiLlama protocols from API.');
    const response = await fetch(`${DEFILLAMA_API_BASE_URL}/protocols`, { next: { revalidate: CACHE_DURATION_SECONDS }});
    if (!response.ok) {
        console.error(`DefiLlama Protocols API error: ${response.status} ${response.statusText}`);
        if (cachedData) {
            console.warn('DefiLlama Protocols API failed, serving stale data from Supabase cache.');
            return cachedData;
        }
        return null;
    }
    const protocolsData: DefiLlamaProtocol[] = await response.json();

    // 3. Store/Update cache in Supabase, if client is available
    if (supabase) {
        const { error: upsertError } = await supabase.from('defillama_protocols').upsert({ 
            id: 'all-protocols', // Use a static ID for this singleton row
            protocols: protocolsData, 
            last_updated: new Date().toISOString()
        }, { onConflict: 'id' });

        if (upsertError) {
            console.error('Error upserting DefiLlama protocols into cache:', upsertError.message);
        } else {
            console.log('Successfully updated Supabase cache with new DefiLlama protocols data.');
        }
    }

    return protocolsData;
  } catch (error) {
    console.error("An error occurred while fetching DefiLlama protocols:", error);
    if (cachedData) {
        console.warn('DefiLlama Protocols API failed, serving stale data from Supabase cache as fallback.');
        return cachedData;
    }
    return null;
  }
}

export async function getDefiLlamaStablecoins(limit?: number): Promise<DefiLlamaStablecoin[] | null> {
  let cachedData: DefiLlamaStablecoin[] | null = null;
  // 1. Try to fetch from Supabase cache, if client is available
  if (supabase) {
      try {
        const { data, error: cacheError } = await supabase
            .from('defillama_stablecoins')
            .select('*')
            .order('last_updated', { ascending: false })
            .limit(1);

        if (data && data.length > 0) {
            const lastUpdated = new Date(data[0].last_updated).getTime();
            const now = new Date().getTime();
            if ((now - lastUpdated) / 1000 < CACHE_DURATION_SECONDS) {
                console.log('Serving DefiLlama stablecoins from fresh Supabase cache.');
                // Here we need to map the supabase data to our type
                cachedData = data.map(sc => ({
                    id: sc.id,
                    name: sc.name,
                    symbol: sc.symbol,
                    pegType: sc.peg_type,
                    pegMechanism: sc.peg_mechanism,
                    circulating: { peggedUSD: sc.circulating_pegged_usd },
                    chains: sc.chains,
                    chainCirculating: sc.chain_circulating,
                    price: sc.price,
                }));
                return cachedData.slice(0, limit);
            }
            console.log('Supabase DefiLlama stablecoins cache is stale. Will fetch from API.');
        }

        if (cacheError) {
            console.error('Supabase DefiLlama stablecoins cache read error:', cacheError);
        }
      } catch (e) {
        console.error('An unexpected error occurred during DefiLlama stablecoins cache fetch:', e);
      }
  }

  // 2. If cache is stale or empty, fetch from DefiLlama API
  try {
    console.log('Fetching DefiLlama stablecoins from API.');
    const response = await fetch(`${DEFILLAMA_STABLECOINS_API_BASE_URL}/stablecoins?includePrices=true`, { next: { revalidate: CACHE_DURATION_SECONDS }});
    if (!response.ok) {
      console.error(`DefiLlama Stablecoins API error: ${response.status} ${response.statusText}`);
      if (cachedData) {
        console.warn('DefiLlama Stablecoins API failed, serving stale data from Supabase cache.');
        return cachedData.slice(0, limit);
      }
      return null;
    }
    const data = await response.json();
    const stablecoinsData = data.peggedAssets as DefiLlamaStablecoin[];

    // 3. Store/Update cache in Supabase, if client is available
    if (supabase) {
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
    }

    return limit ? stablecoinsData.slice(0, limit) : stablecoinsData;
  } catch (error) {
    console.error("An error occurred while fetching DefiLlama stablecoins:", error);
    if (cachedData) {
        console.warn('DefiLlama Stablecoins API failed, serving stale data from Supabase cache as fallback.');
        return cachedData.slice(0, limit);
    }
    return null;
  }
}

export async function getDefiLlamaHistoricalTvl(): Promise<DefiLlamaHistoricalTvl[] | null> {
  let cachedData: DefiLlamaHistoricalTvl[] | null = null;
  // 1. Try to fetch from Supabase cache, if client is available
  if (supabase) {
    try {
        const { data, error: cacheError } = await supabase
        .from('defillama_historical_tvl')
        .select('*')
        .order('date', { ascending: false });

        if (data && data.length > 0) {
            const lastUpdated = new Date(data[0].last_updated).getTime();
            const now = new Date().getTime();
            if ((now - lastUpdated) / 1000 < CACHE_DURATION_SECONDS) {
                console.log('Serving DefiLlama historical TVL from fresh Supabase cache.');
                cachedData = data.map(item => ({ date: item.date, tvl: item.tvl }));
                return cachedData;
            }
            console.log('Supabase DefiLlama historical TVL cache is stale. Will fetch from API.');
        }

        if (cacheError) {
            console.error('Supabase DefiLlama historical TVL cache read error:', cacheError);
        }
    } catch(e) {
        console.error('An unexpected error occurred during DefiLlama historical TVL cache fetch:', e);
    }
  }

  // 2. If cache is stale or empty, fetch from DefiLlama API
  try {
    console.log('Fetching DefiLlama historical TVL from API.');
    const response = await fetch(`${DEFILLAMA_API_BASE_URL}/v2/historicalChainTvl`, { next: { revalidate: CACHE_DURATION_SECONDS }});
    if (!response.ok) {
      console.error(`DefiLlama Historical TVL API error: ${response.status} ${response.statusText}`);
      if (cachedData) {
        console.warn('DefiLlama Historical TVL API failed, serving stale data from Supabase cache.');
        return cachedData;
      }
      return null;
    }
    const data: DefiLlamaHistoricalTvl[] = await response.json();

    // 3. Store/Update cache in Supabase, if client is available
    if (supabase) {
        const historicalTvlToUpsert = data.map(tvl => ({
            date: tvl.date, // 'date' is the primary key
            tvl: tvl.tvl,
            last_updated: new Date().toISOString(),
        }));

        const { error: upsertError } = await supabase.from('defillama_historical_tvl').upsert(historicalTvlToUpsert, { onConflict: 'date' });
        if (upsertError) {
            console.error('Error upserting DefiLlama historical TVL into cache:', upsertError.message);
        } else {
            console.log('Successfully updated Supabase cache with new DefiLlama historical TVL data.');
        }
    }

    return data;
  } catch (error) {
    console.error("An error occurred while fetching DefiLlama historical TVL:", error);
    if (cachedData) {
        console.warn('DefiLlama Historical TVL API failed, serving stale data from Supabase cache as fallback.');
        return cachedData;
    }
    return null;
  }
}
