
'use server';

import type { DefiLlamaProtocol, DefiLlamaStablecoin, DefiLlamaHistoricalTvl } from '@/types';
import { supabase } from './supabase'; // Import Supabase client

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
            syncDefiLlamaHistoricalTvl(),
        ]);
        console.log("Sync finished: All DefiLlama Data");
    } catch (error) {
        console.error("Error during DefiLlama data synchronization:", error);
        throw error;
    }
}


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

async function syncDefiLlamaHistoricalTvl(): Promise<void> {
    console.log("Starting sync: DefiLlama Historical TVL");
    const response = await fetch(`${DEFILLAMA_API_BASE_URL}/v2/historicalChainTvl`);
    if (!response.ok) throw new Error(`DefiLlama Historical TVL API error: ${response.status}`);
    
    const data: DefiLlamaHistoricalTvl[] = await response.json();
    const historicalTvlToUpsert = data.map(tvl => ({
      date: tvl.date,
      tvl: tvl.tvl,
    }));

    const { error } = await supabase.from('defillama_historical_tvl').upsert(historicalTvlToUpsert, { onConflict: 'date' });
    if (error) {
      console.error('Error upserting DefiLlama historical TVL into cache:', error.message);
      throw error;
    }
    console.log("Sync finished: DefiLlama Historical TVL");
}


// --- Functions to get data from cache ---

export async function getDefiLlamaProtocols(): Promise<DefiLlamaProtocol[] | null> {
    const { data, error } = await supabase.from('defillama_protocols').select('*');
    if (error) {
        console.error('Error fetching protocols from cache:', error);
        return null;
    }
    return data;
}

export async function getDefiLlamaStablecoins(): Promise<DefiLlamaStablecoin[] | null> {
    const { data, error } = await supabase.from('defillama_stablecoins').select('*');
    if (error) {
        console.error('Error fetching stablecoins from cache:', error);
        return null;
    }
    return data;
}

export async function getDefiLlamaHistoricalTvl(): Promise<DefiLlamaHistoricalTvl[] | null> {
    const { data, error } = await supabase.from('defillama_historical_tvl').select('date, tvl');
    if (error) {
        console.error('Error fetching historical TVL from cache:', error);
        return null;
    }
    return data as DefiLlamaHistoricalTvl[];
}


