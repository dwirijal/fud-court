/**
 * Fear and Greed Index API Client - FREE ENDPOINTS ONLY
 * Documentation: https://alternative.me/crypto/fear-and-greed-index/
 *
 * Rules:
 * - You may not use our data to impersonate us or to create a service that could be confused with our offering.
 * - You must properly acknowledge the source of the data and prominently reference it accordingly.
 * - Commercial use is allowed as long as the attribution is given right next to the display of the data.
 */

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string; // Only returned for the latest value
}

export interface FearGreedMetadata {
  error: string | null;
}

export interface FearGreedResponse {
  name: string;
  data: FearGreedData[];
  metadata: FearGreedMetadata;
}

export interface FearGreedQueryParams {
  limit?: number; // Default: 1, use 0 for all available data
  format?: 'json' | 'csv'; // Default: 'json'
  date_format?: 'us' | 'cn' | 'kr' | 'world'; // Default: unixtime, unless format is csv
}

export class FearGreedClient {
  private readonly baseURL = 'https://api.alternative.me';

  private async request<T>(endpoint: string, params?: FearGreedQueryParams): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'FudCourtt-FearGreedClient/1.0'
        },
      });

      if (!response.ok) {
        throw new Error(`Fear and Greed API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Fear and Greed Index:', error);
      throw error;
    }
  }

  /**
   * Get the latest data of the Fear and Greed Index.
   * @param params Optional query parameters (limit, format, date_format).
   * @returns Promise<FearGreedResponse>
   */
  async getFearAndGreedIndex(params?: FearGreedQueryParams): Promise<FearGreedResponse> {
    return this.request<FearGreedResponse>('/fng/', params);
  }
}
