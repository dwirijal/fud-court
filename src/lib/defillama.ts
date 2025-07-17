
'use server';

import type { DefiLlamaProtocol, DefiLlamaStablecoin, DefiLlamaChain } from '@/types';
import { supabase } from './supabase';

const DEFILLAMA_API_BASE_URL = 'https://api.llama.fi';
const DEFILLAMA_STABLECOINS_API_BASE_URL = 'https://stablecoins.llama.fi';

/**
 * Fetches and syncs all DefiLlama data (Protocols, Stablecoins, Historical TVL).
 */
export async function syncDefiLlamaData() {
    console.log("Starting sync: All DefiLlama Data");
    try {
        await Promise.all([
            syncDefiLlamaProtocols(),
            syncDefiLlamaStablecoins(),
            syncDefiLlamaChains(),
        ]);
        console.log("Sync finished: All DefiLlama Data");
    } catch (error) {
        console.error("Error during DefiLlama data synchronization:", error);
        throw error;
    }
}

<<<<<<< HEAD
async function syncDefiLlamaProtocols(): Promise<void> {
    console.log("Starting sync: DefiLlama Protocols");
    const response = await fetch(`${DEFILLAMA_API_BASE_URL}/protocols`);
    if (!response.ok) throw new Error(`DefiLlama Protocols API error: ${response.status}`);
    
    const protocolsData: any[] = await response.json();
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
    }));

    const { error } = await supabase.from('defillama_protocols').upsert(protocolsToUpsert, { onConflict: 'id' });
    if (error) {
        console.error('Error upserting DefiLlama protocols into cache:', error.message);
        throw error;
    }
    console.log("Sync finished: DefiLlama Protocols");
}

async function syncDefiLlamaStablecoins(): Promise<void> {
    console.log("Starting sync: DefiLlama Stablecoins");
    const response = await fetch(`${DEFILLAMA_STABLECOINS_API_BASE_URL}/stablecoins`);
    if (!response.ok) throw new Error(`DefiLlama Stablecoins API error: ${response.status}`);
    
    const data = await response.json();
    const stablecoinsData = data.peggedAssets as any[];

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
    }));

    const { error } = await supabase.from('defillama_stablecoins').upsert(stablecoinsToUpsert, { onConflict: 'id' });
    if (error) {
        console.error('Error upserting DefiLlama stablecoins into cache:', error.message);
        throw error;
    }
    console.log("Sync finished: DefiLlama Stablecoins");
}

async function syncDefiLlamaChains(): Promise<void> {
    console.log("Starting sync: DefiLlama Chains TVL");
    const response = await fetch(`${DEFILLAMA_API_BASE_URL}/v2/chains`);
    if (!response.ok) throw new Error(`DefiLlama Chains API error: ${response.status}`);
    
    const chainsData: any[] = await response.json();
    // Filter out invalid entries and map to the correct schema
    const chainsToUpsert = chainsData
        .filter(c => c.name && typeof c.tvl === 'number' && c.tvl >= 0)
        .map(c => ({
            id: c.name, // Use name as the primary key
            name: c.name,
            gecko_id: c.gecko_id,
            tvl: c.tvl,
            token_symbol: c.tokenSymbol,
            cmc_id: c.cmcId,
            chain_id: c.chainId,
        }));

    const { error } = await supabase.from('defillama_chains').upsert(chainsToUpsert, { onConflict: 'id' });
    if (error) {
        console.error('Error upserting DefiLlama chains into cache:', error.message);
        throw error;
    }
    console.log(`Sync finished: DefiLlama Chains TVL. Upserted ${chainsToUpsert.length} chains.`);
}

export async function getDefiLlamaProtocols(): Promise<DefiLlamaProtocol[]> {
    const { data, error } = await supabase.from('defillama_protocols').select('*');
    
    if (error || !data || data.length === 0) {
        console.warn('Cache for DefiLlama protocols is empty or failed to load. Fetching from API.');
        try {
            await syncDefiLlamaProtocols();
            const { data: newData, error: newError } = await supabase.from('defillama_protocols').select('*');
            if (newError) {
                console.error('Failed to fetch from cache after sync:', newError);
                return [];
            }
            return (newData as DefiLlamaProtocol[]) || [];
        } catch (syncError) {
            console.error('Failed to sync and fetch DefiLlama protocols:', syncError);
            return [];
        }
    }
    return data as DefiLlamaProtocol[];
}

export async function getDefiLlamaStablecoins(): Promise<DefiLlamaStablecoin[]> {
    const { data, error } = await supabase.from('defillama_stablecoins').select('*');

    if (error || !data || data.length === 0) {
        console.warn('Cache for DefiLlama stablecoins is empty or failed to load. Fetching from API.');
        try {
            await syncDefiLlamaStablecoins();
            const { data: newData, error: newError } = await supabase.from('defillama_stablecoins').select('*');
            if (newError) {
                console.error('Failed to fetch stablecoins from cache after sync:', newError);
                return [];
            }
            return (newData as DefiLlamaStablecoin[]) || [];
        } catch (syncError) {
            console.error('Failed to sync and fetch DefiLlama stablecoins:', syncError);
            return [];
        }
    }
    return data as DefiLlamaStablecoin[];
}


export async function getDefiLlamaChains(): Promise<DefiLlamaChain[]> {
    const { data, error } = await supabase.from('defillama_chains').select('*');

    if (error || !data || data.length === 0) {
        console.warn('Cache for DefiLlama chains is empty or failed to load. Fetching from API.');
        try {
            await syncDefiLlamaChains();
            const { data: newData, error: newError } = await supabase.from('defillama_chains').select('*');
            if (newError) {
                console.error('Failed to fetch chains from cache after sync:', newError);
                return [];
            }
            return (newData as DefiLlamaChain[]) || [];
        } catch (syncError) {
            console.error('Failed to sync and fetch DefiLlama chains:', syncError);
            return [];
        }
    }
    return data as DefiLlamaChain[];
=======
export async function getDefiLlamaProtocols(): Promise<DefiLlamaProtocol[] | null> {
  let cachedData: DefiLlamaProtocol[] | null = null;
  if (supabase) {
    try {
      const { data, error: cacheError } = await supabase
        .from('defillama_protocols')
        .select('*');

      if (data && data.length > 0) {
        const lastUpdated = new Date(data[0].last_updated).getTime();
        const now = new Date().getTime();
        
        if ((now - lastUpdated) / 1000 < CACHE_DURATION_SECONDS) {
          console.log('Serving DefiLlama protocols from fresh Supabase cache.');
          return data; // Data is already in the correct format
        }
        cachedData = data;
        console.log('Supabase DefiLlama protocols cache is stale. Will fetch from API.');
      }

      if (cacheError && cacheError.code !== 'PGRST116') {
        console.error('Supabase DefiLlama protocols cache read error:', cacheError);
      }
    } catch (e) {
      console.error('An unexpected error occurred during DefiLlama protocols cache fetch:', e);
    }
  }

  try {
    console.log('Fetching DefiLlama protocols from API.');
    const response = await fetch(`${DEFILLAMA_API_BASE_URL}/protocols`, { cache: 'no-store' });
    if (!response.ok) {
        console.error(`DefiLlama Protocols API error: ${response.status} ${response.statusText}`);
        if (cachedData) {
            console.warn('DefiLlama Protocols API failed, serving stale data from Supabase cache.');
            return cachedData;
        }
        return null;
    }
    const protocolsData: DefiLlamaProtocol[] = await response.json();

    if (supabase) {
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
            last_updated: new Date().toISOString()
        }));

        const { error: upsertError } = await supabase.from('defillama_protocols').upsert(protocolsToUpsert, { onConflict: 'id' });
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
  if (supabase) {
      try {
        const { data, error: cacheError } = await supabase
            .from('defillama_stablecoins')
            .select('*')
            .order('circulating_pegged_usd', { ascending: false, nullsFirst: false });

        if (data && data.length > 0) {
            const lastUpdated = new Date(data[0].last_updated).getTime();
            const now = new Date().getTime();
            if ((now - lastUpdated) / 1000 < CACHE_DURATION_SECONDS) {
                console.log('Serving DefiLlama stablecoins from fresh Supabase cache.');
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
                return limit ? cachedData.slice(0, limit) : cachedData;
            }
            console.log('Supabase DefiLlama stablecoins cache is stale. Will fetch from API.');
        }

        if (cacheError && cacheError.code !== 'PGRST116') {
            console.error('Supabase DefiLlama stablecoins cache read error:', cacheError);
        }
      } catch (e) {
        console.error('An unexpected error occurred during DefiLlama stablecoins cache fetch:', e);
      }
  }

  try {
    console.log('Fetching DefiLlama stablecoins from API.');
    const response = await fetch(`${DEFILLAMA_STABLECOINS_API_BASE_URL}/stablecoins?includePrices=true`, { next: { revalidate: CACHE_DURATION_SECONDS }});
    if (!response.ok) {
      console.error(`DefiLlama Stablecoins API error: ${response.status} ${response.statusText}`);
      if (cachedData) {
        console.warn('DefiLlama Stablecoins API failed, serving stale data from Supabase cache.');
        return limit ? cachedData.slice(0, limit) : cachedData;
      }
      return null;
    }
    const data = await response.json();
    const stablecoinsData: DefiLlamaStablecoin[] = data.peggedAssets;
    
    if (supabase) {
        const stablecoinsToUpsert = stablecoinsData.map(sc => ({
            id: sc.id,
            name: sc.name,
            symbol: sc.symbol,
            peg_type: sc.pegType,
            peg_mechanism: sc.pegMechanism,
            circulating_pegged_usd: sc.circulating?.peggedUSD,
            chains: sc.chains,
            chain_circulating: sc.chainCirculating,
            price: sc.price,
            last_updated: new Date().toISOString()
        }));

        const { error: upsertError } = await supabase.from('defillama_stablecoins').upsert(
            stablecoinsToUpsert, 
            { onConflict: 'id' }
        );
        
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
        return limit ? cachedData.slice(0, limit) : cachedData;
    }
    return null;
  }
}

export async function getDefiLlamaHistoricalTvl(): Promise<DefiLlamaHistoricalTvl[] | null> {
  let cachedData: DefiLlamaHistoricalTvl[] | null = null;
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

        if (cacheError && cacheError.code !== 'PGRST116') {
            console.error('Supabase DefiLlama historical TVL cache read error:', cacheError);
        }
    } catch(e) {
        console.error('An unexpected error occurred during DefiLlama historical TVL cache fetch:', e);
    }
  }

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
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
}
