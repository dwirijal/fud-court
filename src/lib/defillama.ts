'use server';

interface DefiLlamaCoinData {
  tvl: number | null;
  chains: string[];
  protocols: { name: string; id: string }[];
}

export async function getDefiLlamaCoinData(coinId: string): Promise<DefiLlamaCoinData | null> {
  try {
    // Fetch TVL data for the coin
    const tvlResponse = await fetch(`https://api.llama.fi/v2/coins/${coinId}`, { next: { revalidate: 3600 }});
    if (!tvlResponse.ok) {
      console.warn(`DefiLlama TVL API error for ${coinId}: ${tvlResponse.status} ${tvlResponse.statusText}`);
      return null;
    }
    const tvlData = await tvlResponse.json();

    let tvl: number | null = null;
    let chains: string[] = [];
    let protocols: { name: string; id: string }[] = [];

    if (tvlData && tvlData.tvl) {
      // Find the latest TVL entry
      const latestTvlEntry = tvlData.tvl[tvlData.tvl.length - 1];
      tvl = latestTvlEntry ? latestTvlEntry.totalLiquidityUSD : null;

      // Extract chains and protocols
      const uniqueChains = new Set<string>();
      const uniqueProtocols = new Map<string, { name: string; id: string }>();

      for (const chainTvl of tvlData.chainTvls) {
        uniqueChains.add(chainTvl.chain);
        if (chainTvl.protocols) {
          for (const protocol of chainTvl.protocols) {
            uniqueProtocols.set(protocol.id, { name: protocol.name, id: protocol.id });
          }
        }
      }
      chains = Array.from(uniqueChains);
      protocols = Array.from(uniqueProtocols.values());
    }

    return {
      tvl,
      chains,
      protocols,
    };
  } catch (error) {
    console.error(`An error occurred while fetching DefiLlama data for ${coinId}:`, error);
    return null;
  }
}
