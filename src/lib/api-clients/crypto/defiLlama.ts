// DefiLlama TypeScript Client - FREE ENDPOINTS ONLY
// Documentation: https://defillama.com/docs/api
// 
// FREE PLAN LIMITATIONS:
// - Rate limit: 300 requests/5 minutes per IP
// - Monthly limit: Unlimited for free endpoints
// - Only includes endpoints available without API key

interface Protocol {
    id: string;
    name: string;
    address?: string;
    symbol: string;
    url: string;
    description: string;
    chain: string;
    logo: string;
    audits?: string;
    audit_note?: string;
    gecko_id?: string;
    cmcId?: string;
    category: string;
    chains: string[];
    module: string;
    twitter?: string;
    forkedFrom?: string[];
    oracles?: string[];
    listedAt?: number;
    methodology?: string;
    slug: string;
    tvl: number;
    chainTvls: Record<string, number>;
    change_1h?: number;
    change_1d?: number;
    change_7d?: number;
    tokenBreakdowns?: Record<string, number>;
    mcap?: number;
  }
  
  interface ProtocolDetails {
    id: string;
    name: string;
    symbol: string;
    category: string;
    chains: string[];
    currentChainTvls: Record<string, number>;
    chainTvls: Record<string, {
      tvl: Array<{
        date: number;
        totalLiquidityUSD: number;
      }>;
      tokens: Array<{
        date: number;
        tokens: Record<string, number>;
      }>;
    }>;
  }
  
  export interface ChainTVL {
    date: number;
    tvl: number;
  }
  
  interface Chain {
    gecko_id?: string;
    tvl: number;
    tokenSymbol?: string;
    cmcId?: string;
    name: string;
    chainId?: number;
  }
  
  interface StablecoinData {
    id: number;
    name: string;
    address?: string;
    symbol: string;
    url?: string;
    description?: string;
    mintRedeemDescription?: string;
    onCoinGecko?: string;
    gecko_id?: string;
    cmcId?: string;
    pegType: string;
    pegMechanism: string;
    priceSource?: string;
    auditLinks?: string[];
    twitter?: string;
    wiki?: string;
    pegDeviationInfo?: any;
    price?: number;
    circulating: Record<string, any>;
    unreleased: Record<string, any>;
    circulatingPrevDay: Record<string, any>;
    circulatingPrevWeek: Record<string, any>;
    circulatingPrevMonth: Record<string, any>;
    chains: string[];
  }
  
  interface YieldPool {
    chain: string;
    project: string;
    symbol: string;
    tvlUsd: number;
    apy?: number;
    apyBase?: number;
    apyReward?: number;
    rewardTokens?: string[];
    pool: string;
    apyPct1D?: number;
    apyPct7D?: number;
    apyPct30D?: number;
    stablecoin?: boolean;
    ilRisk?: string;
    exposure?: string;
    predictions?: {
      predictedClass: string;
      predictedProbability: number;
      binnedConfidence: number;
    };
    poolMeta?: string;
    mu?: number;
    sigma?: number;
    count?: number;
    outlier?: boolean;
    underlyingTokens?: string[];
    il7d?: number;
    apyBase7d?: number;
    apyMean30d?: number;
    volumeUsd1d?: number;
    volumeUsd7d?: number;
  }
  
  interface BridgeVolume {
    date: string;
    depositUSD: number;
    withdrawUSD: number;
    netUSD: number;
  }
  
  interface CoinPrice {
    decimals?: number;
    price: number;
    symbol: string;
    timestamp: number;
  }
  
  interface CoinHistory {
    coins: Record<string, {
      decimals?: number;
      price: number;
      symbol: string;
      timestamp: number;
    }>;
  }
  
  interface FeeData {
    total24h: number;
    total7d: number;
    total30d: number;
    totalAllTime: number;
    breakdown24h: Record<string, number>;
  }
  
  interface VolumeData {
    totalVolume24h: number;
    totalVolume7d: number;
    chains: Record<string, {
      total24h: number;
      total7d: number;
    }>;
  }
  
  export class DefiLlamaClient {
    private baseURL = 'https://api.llama.fi';
    private coinsURL = 'https://coins.llama.fi';
    private yieldsURL = 'https://yields.llama.fi';
    private bridgesURL = 'https://bridges.llama.fi';
    private volumeURL = 'https://api.llama.fi';
  
    private async request<T>(url: string): Promise<T> {
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`DefiLlama API Error: ${error}`);
        throw error;
      }
    }
  
    // =================
    // TVL ENDPOINTS
    // =================
  
    /**
     * Get all protocols with their TVL data
     */
    async getProtocols(): Promise<Protocol[]> {
      return this.request<Protocol[]>(`${this.baseURL}/protocols`);
    }
  
    /**
     * Get historical TVL of a protocol
     */
    async getProtocolTVL(protocol: string): Promise<ProtocolDetails> {
      return this.request<ProtocolDetails>(`${this.baseURL}/protocol/${protocol}`);
    }
  
    /**
     * Get current TVL of all chains
     */
    async getChains(): Promise<Chain[]> {
      return this.request<Chain[]>(`${this.baseURL}/v2/chains`);
    }
  
    /**
     * Get historical TVL of a chain
     */
    async getChainTVL(chain: string): Promise<ChainTVL[]> {
      return this.request<ChainTVL[]>(`${this.baseURL}/v2/historicalChainTvl/${chain}`);
    }
  
    /**
     * Get historical TVL across all protocols
     */
    async getTotalTVL(): Promise<ChainTVL[]> {
      return this.request<ChainTVL[]>(`${this.baseURL}/v2/historicalChainTvl`);
    }
  
    /**
     * Get protocols by chain
     */
    async getProtocolsByChain(chain: string): Promise<Protocol[]> {
      return this.request<Protocol[]>(`${this.baseURL}/protocols/${chain}`);
    }
  
    // =================
    // COINS & PRICES
    // =================
  
    /**
     * Get current prices for multiple tokens
     * @param coins Array of token identifiers (chain:address format)
     */
    async getCurrentPrices(coins: string[]): Promise<Record<string, CoinPrice>> {
      const coinsParam = coins.join(',');
      return this.request(`${this.coinsURL}/prices/current/${coinsParam}`);
    }
  
    /**
     * Get historical prices for multiple tokens
     * @param coins Array of token identifiers
     * @param timestamp Unix timestamp
     */
    async getHistoricalPrices(coins: string[], timestamp: number): Promise<CoinHistory> {
      const coinsParam = coins.join(',');
      return this.request(`${this.coinsURL}/prices/historical/${timestamp}/${coinsParam}`);
    }
  
    /**
     * Get first recorded prices for tokens
     * @param coins Array of token identifiers
     */
    async getFirstPrices(coins: string[]): Promise<Record<string, CoinPrice>> {
      const coinsParam = coins.join(',');
      return this.request(`${this.coinsURL}/prices/first/${coinsParam}`);
    }
  
    /**
     * Get price chart for a token
     * @param coin Token identifier (chain:address)
     * @param period Time period ('1h', '4h', '12h', '1d', '1w')
     */
    async getPriceChart(coin: string, period: string = '1d'): Promise<{ timestamp: number; price: number }[]> {
      return this.request(`${this.coinsURL}/chart/${coin}?period=${period}`);
    }
  
    /**
     * Get percentage change in price
     * @param coins Array of token identifiers
     * @param period Time period ('1h', '1d', '7d', '30d')
     */
    async getPriceChange(coins: string[], period: string = '1d'): Promise<Record<string, { price: number; change: number }>> {
      const coinsParam = coins.join(',');
      return this.request(`${this.coinsURL}/percentage/${coinsParam}?period=${period}`);
    }
  
    // =================
    // STABLECOINS
    // =================
  
    /**
     * Get all stablecoins data
     */
    async getStablecoins(): Promise<{ peggedAssets: StablecoinData[] }> {
      return this.request(`${this.baseURL}/stablecoins`);
    }
  
    /**
     * Get stablecoin market cap chart
     * @param stablecoin Stablecoin ID
     */
    async getStablecoinChart(stablecoin: string): Promise<any[]> {
      return this.request(`${this.baseURL}/stablecoincharts/all?stablecoin=${stablecoin}`);
    }
  
    /**
     * Get stablecoins by chain
     * @param chain Chain name
     */
    async getStablecoinsByChain(chain: string): Promise<any> {
      return this.request(`${this.baseURL}/stablecoins/${chain}`);
    }
  
    // =================
    // YIELDS
    // =================
  
    /**
     * Get all yield farming pools
     */
    async getYieldPools(): Promise<{ status: string; data: YieldPool[] }> {
      return this.request(`${this.yieldsURL}/pools`);
    }
  
    /**
     * Get yield pool by ID
     * @param poolId Pool identifier
     */
    async getYieldPool(poolId: string): Promise<{ status: string; data: YieldPool[] }> {
      return this.request(`${this.yieldsURL}/chart/${poolId}`);
    }
  
    // =================
    // BRIDGES
    // =================
  
    /**
     * Get all bridges
     */
    async getBridges(): Promise<any[]> {
      return this.request(`${this.bridgesURL}/bridges?includeChains=true`);
    }
  
    /**
     * Get bridge volume data
     * @param bridgeId Bridge identifier
     */
    async getBridgeVolume(bridgeId: string): Promise<BridgeVolume[]> {
      return this.request(`${this.bridgesURL}/bridge/${bridgeId}`);
    }
  
    /**
     * Get bridge day stats
     * @param timestamp Unix timestamp (optional)
     */
    async getBridgeDayStats(timestamp?: number): Promise<any> {
      const url = timestamp 
        ? `${this.bridgesURL}/bridgedaystats/${timestamp}`
        : `${this.bridgesURL}/bridgedaystats`;
      return this.request(url);
    }
  
    // =================
    // FEES & REVENUE
    // =================
  
    /**
     * Get protocol fees summary
     */
    async getProtocolFees(): Promise<any[]> {
      return this.request(`${this.baseURL}/overview/fees`);
    }
  
    /**
     * Get fees for a specific protocol
     * @param protocol Protocol name
     */
    async getProtocolFeesData(protocol: string): Promise<FeeData> {
      return this.request(`${this.baseURL}/summary/fees/${protocol}`);
    }
  
    // =================
    // DEX VOLUME
    // =================
  
    /**
     * Get DEX volume overview
     */
    async getDexVolume(): Promise<any[]> {
      return this.request(`${this.volumeURL}/overview/dexs`);
    }
  
    /**
     * Get volume for specific DEX
     * @param protocol DEX protocol name
     */
    async getDexVolumeData(protocol: string): Promise<VolumeData> {
      return this.request(`${this.volumeURL}/summary/dexs/${protocol}`);
    }
  
    // =================
    // LIQUIDATIONS
    // =================
  
    /**
     * Get liquidations data
     */
    async getLiquidations(): Promise<any[]> {
      return this.request(`${this.baseURL}/liquidations`);
    }
  
    // =================
    // NFT VOLUME
    // =================
  
    /**
     * Get NFT collections overview
     */
    async getNFTCollections(): Promise<any[]> {
      return this.request(`${this.baseURL}/overview/nfts`);
    }
  
    // =================
    // OPTIONS VOLUME
    // =================
  
    /**
     * Get options volume overview
     */
    async getOptionsVolume(): Promise<any[]> {
      return this.request(`${this.baseURL}/overview/options`);
    }
  
    // =================
    // UTILITY METHODS
    // =================
  
    /**
     * Search for protocols by name
     * @param query Search query
     */
    async searchProtocols(query: string): Promise<Protocol[]> {
      const protocols = await this.getProtocols();
      return protocols.filter(protocol => 
        protocol.name.toLowerCase().includes(query.toLowerCase()) ||
        protocol.symbol.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    /**
     * Get top protocols by TVL
     * @param limit Number of protocols to return
     */
    async getTopProtocols(limit: number = 10): Promise<Protocol[]> {
      const protocols = await this.getProtocols();
      return protocols
        .sort((a, b) => b.tvl - a.tvl)
        .slice(0, limit);
    }
  
    /**
     * Get protocol info by name or slug
     * @param identifier Protocol name or slug
     */
    async getProtocolInfo(identifier: string): Promise<Protocol | null> {
      const protocols = await this.getProtocols();
      return protocols.find(p => 
        p.name.toLowerCase() === identifier.toLowerCase() ||
        p.slug === identifier
      ) || null;
    }
  
    // =================
    // BATCH OPERATIONS
    // =================
  
    /**
     * Get comprehensive DeFi overview
     */
    async getDeFiOverview(): Promise<{
      totalTVL: any[];
      topProtocols: Protocol[];
      chains: Chain[];
      stablecoins: any;
      yields: any;
    }> {
      const [totalTVL, topProtocols, chains, stablecoins, yields] = await Promise.all([
        this.getTotalTVL(),
        this.getTopProtocols(20),
        this.getChains(),
        this.getStablecoins(),
        this.getYieldPools()
      ]);
  
      return {
        totalTVL,
        topProtocols,
        chains,
        stablecoins,
        yields
      };
    }
  
    /**
     * Get multi-chain protocol data
     * @param protocolName Protocol name
     */
    async getMultiChainProtocolData(protocolName: string): Promise<{
      info: Protocol | null;
      tvlHistory: ProtocolDetails;
      fees?: FeeData;
    }> {
      const info = await this.getProtocolInfo(protocolName);
      if (!info) {
        throw new Error(`Protocol ${protocolName} not found`);
      }
  
      const [tvlHistory, fees] = await Promise.allSettled([
        this.getProtocolTVL(info.slug),
        this.getProtocolFeesData(protocolName).catch(() => null)
      ]);
  
      return {
        info,
        tvlHistory: tvlHistory.status === 'fulfilled' ? tvlHistory.value : {} as ProtocolDetails,
        fees: fees.status === 'fulfilled' && fees.value !== null ? fees.value : undefined
      };
    }
  }
  
  // =================
  // USAGE EXAMPLES
  // =================
  
  /*
  // Initialize client
  const defiLlama = new DefiLlamaClient();
  
  // Basic usage examples:
  
  // Get all protocols
  const protocols = await defiLlama.getProtocols();
  console.log(`Found ${protocols.length} protocols`);
  
  // Get top 10 protocols by TVL
  const topProtocols = await defiLlama.getTopProtocols(10);
  console.log('Top 10 Protocols:', topProtocols.map(p => ({ name: p.name, tvl: p.tvl })));
  
  // Get current token prices
  const prices = await defiLlama.getCurrentPrices([
    'ethereum:0xa0b86a33e6409d7e7b0e470e19d3ced6d9e2d6e0', // USDC
    'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7'  // USDT
  ]);
  console.log('Current prices:', prices);
  
  // Get comprehensive DeFi overview
  const overview = await defiLlama.getDeFiOverview();
  console.log('DeFi Overview:', {
    totalTVL: overview.totalTVL.slice(-1)[0], // Latest TVL
    topProtocols: overview.topProtocols.slice(0, 5).map(p => p.name),
    chainCount: overview.chains.length,
    stablecoinCount: overview.stablecoins.peggedAssets.length
  });
  
  // Search for Uniswap
  const uniswapProtocols = await defiLlama.searchProtocols('uniswap');
  console.log('Uniswap protocols:', uniswapProtocols.map(p => p.name));
  
  // Get detailed protocol info
  const aaveData = await defiLlama.getMultiChainProtocolData('aave');
  console.log('Aave data:', {
    name: aaveData.info?.name,
    currentTVL: aaveData.info?.tvl,
    chains: aaveData.info?.chains,
    latestTVL: aaveData.tvlHistory.chainTvls.Ethereum.tvl.slice(-1)[0]
  });
  
  // Get yield farming opportunities
  const yields = await defiLlama.getYieldPools();
  const highYieldPools = yields.data
    .filter(pool => pool.apy && pool.apy > 10 && pool.tvlUsd > 1000000)
    .sort((a, b) => (b.apy || 0) - (a.apy || 0))
    .slice(0, 10);
  console.log('High yield pools:', highYieldPools);
  
  // Get chain TVL data
  const ethereum = await defiLlama.getChainTVL('ethereum');
  console.log('Ethereum TVL history (last 7 days):', ethereum.slice(-7));
  
  // Get stablecoin data
  const stablecoins = await defiLlama.getStablecoins();
  const topStablecoins = stablecoins.peggedAssets
    .sort((a, b) => {
      const aTotal = Object.values(a.circulating || {}).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
      const bTotal = Object.values(b.circulating || {}).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
      return bTotal - aTotal;
    })
    .slice(0, 10);
  console.log('Top stablecoins:', topStablecoins.map(s => s.name));
  
  */
  
  export default DefiLlamaClient;