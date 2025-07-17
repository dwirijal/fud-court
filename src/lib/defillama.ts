
'use server';

import type { DefiLlamaProtocol, DefiLlamaStablecoin, DefiLlamaChain, DefiLlamaHistoricalTvl } from '@/types';
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
    const response = await fetch(`${DEFILLAMA_STABLECOINS_API_BASE_URL}/stablecoins?includePrices=true`);
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
}


export async function getDefiLlamaHistoricalTvl(): Promise<DefiLlamaHistoricalTvl[] | null> {
    try {
        console.log('Fetching DefiLlama historical TVL from API.');
        const response = await fetch(`${DEFILLAMA_API_BASE_URL}/v2/historicalChainTvl`);
        if (!response.ok) {
        console.error(`DefiLlama Historical TVL API error: ${response.status} ${response.statusText}`);
        return null;
        }
        const data: DefiLlamaHistoricalTvl[] = await response.json();
        return data;
    } catch (error) {
        console.error("An error occurred while fetching DefiLlama historical TVL:", error);
        return null;
    }
}

export async function getDefiLlamaCoinData(symbol: string) {
    if (!symbol) return null;
    try {
        const { data: protocolData, error: protocolError } = await supabase
            .from('defillama_protocols')
            .select('tvl, chains, name')
            .ilike('symbol', symbol)
            .order('tvl', { ascending: false, nullsFirst: false })
            .limit(10); // Fetch a few to find the best match

        if (protocolError) {
            console.error(`Error fetching defi llama data for ${symbol}`, protocolError);
            return null;
        }

        if (!protocolData || protocolData.length === 0) return null;

        // Simple heuristic: find the protocol with the highest TVL that matches the symbol
        const bestMatch = protocolData.reduce((prev, current) => (prev.tvl > current.tvl) ? prev : current);

        return {
            tvl: bestMatch.tvl,
            chains: bestMatch.chains,
            protocols: protocolData.map(p => ({ name: p.name })),
        };

    } catch (error) {
        console.error(`Unexpected error fetching DefiLlama data for ${symbol}:`, error);
        return null;
    }
}
