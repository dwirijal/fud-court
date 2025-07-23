
export class BitqueryClient {
  private readonly endpoint = 'https://graphql.bitquery.io';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.BITQUERY_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Bitquery API key is not set. Requests may fail.');
    }
  }

  private async request<T>(query: string, variables: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`Bitquery API error: ${response.status} ${response.statusText}`);
      }
      const jsonResponse = await response.json();
      if(jsonResponse.errors) {
        throw new Error(`Bitquery GraphQL error: ${JSON.stringify(jsonResponse.errors)}`);
      }
      return jsonResponse.data;
    } catch (error) {
      console.error('Error fetching data from Bitquery:', error);
      throw error;
    }
  }

  public async getHourlyPriceData(tokenAddress: string, network: string): Promise<any[]> {
    const query = `
      query GetHourlyPrice($network: SolanaNetwork!, $token: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
        solana(network: $network) {
          dexTrades(
            options: {desc: "block.timestamp.iso8601", limit: 100}
            date: {since: $from, till: $till}
            buyCurrency: {is: $token}
          ) {
            block {
              timestamp {
                iso8601
              }
            }
            trade: buy {
              price
            }
          }
        }
      }
    `;
    
    const now = new Date();
    const from = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString(); // 24 hours ago
    const till = now.toISOString();

    const variables = {
      network: network, // e.g., "solana"
      token: tokenAddress,
      from: from,
      till: till,
    };

    const result = await this.request<any>(query, variables);
    return result.solana.dexTrades || [];
  }
}
