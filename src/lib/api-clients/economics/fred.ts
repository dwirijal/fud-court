/**
 * FRED API TypeScript Client
 * Federal Reserve Economic Data (FRED) API Client
 * 
 * Documentation: https://fred.stlouisfed.org/docs/api/fred/
 * API Key: Required - Get one at https://fred.stlouisfed.org/docs/api/api_key.html
 * 
 * Free Plan Limitations:
 * - 120 requests per 60 seconds
 * - Public endpoints only (no private/premium data)
 * - All endpoints return public economic data
 * 
 * This client includes ALL publicly available FRED API endpoints
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface FredConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface FredRequestParams {
  [key: string]: string | number | boolean | undefined;
}

export interface FredResponse<T = any> {
  realtime_start: string;
  realtime_end: string;
  count?: number;
  offset?: number;
  limit?: number;
  order_by?: string;
  sort_order?: string;
  [key: string]: any;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  parent_id: number;
  notes?: string;
}

export interface CategoryResponse extends FredResponse {
  categories: Category[];
}

export interface CategoryChildrenResponse extends FredResponse {
  categories: Category[];
}

export interface CategoryRelatedResponse extends FredResponse {
  categories: Category[];
}

export interface CategorySeriesResponse extends FredResponse {
  series: Series[];
}

export interface CategoryTagsResponse extends FredResponse {
  tags: Tag[];
}

export interface CategoryRelatedTagsResponse extends FredResponse {
  tags: Tag[];
}

// Release Types
export interface Release {
  id: number;
  realtime_start: string;
  realtime_end: string;
  name: string;
  press_release: boolean;
  link?: string;
  notes?: string;
}

export interface ReleaseResponse extends FredResponse {
  releases: Release[];
}

export interface ReleaseDatesResponse extends FredResponse {
  release_dates: ReleaseDate[];
}

export interface ReleaseDate {
  release_id: number;
  date: string;
}

export interface ReleaseSeriesResponse extends FredResponse {
  series: Series[];
}

export interface ReleaseSourcesResponse extends FredResponse {
  sources: Source[];
}

export interface ReleaseTagsResponse extends FredResponse {
  tags: Tag[];
}

export interface ReleaseRelatedTagsResponse extends FredResponse {
  tags: Tag[];
}

export interface ReleaseTablesResponse extends FredResponse {
  elements: ReleaseTable[];
}

export interface ReleaseTable {
  element_id: number;
  release_id: number;
  parent_id: number;
  line: number;
  type: string;
  name: string;
  level: number;
  children?: ReleaseTable[];
}

// Series Types
export interface Series {
  id: string;
  realtime_start: string;
  realtime_end: string;
  title: string;
  observation_start: string;
  observation_end: string;
  frequency: string;
  frequency_short: string;
  units: string;
  units_short: string;
  seasonal_adjustment: string;
  seasonal_adjustment_short: string;
  last_updated: string;
  popularity: number;
  group_popularity?: number;
  notes?: string;
}

export interface SeriesResponse extends FredResponse {
  series: Series[];
}

export interface SeriesCategoriesResponse extends FredResponse {
  categories: Category[];
}

export interface SeriesObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
}

export interface SeriesObservationsResponse extends FredResponse {
  observations: SeriesObservation[];
}

export interface SeriesSearchResponse extends FredResponse {
  series: Series[];
}

export interface SeriesTagsResponse extends FredResponse {
  tags: Tag[];
}

export interface SeriesUpdatesResponse extends FredResponse {
  series: Series[];
}

export interface SeriesVintageDatesResponse extends FredResponse {
  vintage_dates: string[];
}

// Source Types
export interface Source {
  id: number;
  realtime_start: string;
  realtime_end: string;
  name: string;
  link?: string;
  notes?: string;
}

export interface SourceResponse extends FredResponse {
  sources: Source[];
}

export interface SourceReleasesResponse extends FredResponse {
  releases: Release[];
}

// Tag Types
export interface Tag {
  name: string;
  group_id: string;
  notes?: string;
  created: string;
  popularity: number;
  series_count: number;
}

export interface TagResponse extends FredResponse {
  tags: Tag[];
}

export interface TagSeriesResponse extends FredResponse {
  series: Series[];
}

export interface TagRelatedTagsResponse extends FredResponse {
  tags: Tag[];
}

// Maps API Types
export interface GeoSeries {
  series_id: string;
  title: string;
  region_type: string;
  seasonality: string;
  units: string;
  frequency: string;
  min_date: string;
  max_date: string;
}

export interface GeoSeriesResponse extends FredResponse {
  meta: {
    title: string;
    region: string;
    seasonality: string;
    units: string;
    frequency: string;
    min_date: string;
    max_date: string;
  };
  data: Record<string, any>;
}

// ============================================================================
// MAIN CLIENT CLASS
// ============================================================================

export class FredClient {
  private config: Required<FredConfig>;
  private rateLimitQueue: Array<() => Promise<any>> = [];
  private rateLimitActive = false;

  constructor(config: FredConfig) {
    this.config = {
      baseUrl: 'https://api.stlouisfed.org/fred',
      timeout: 10000,
      retryAttempts: 3,
      ...config,
    };

    if (!this.config.apiKey) {
      throw new Error('API key is required. Get one at https://fred.stlouisfed.org/docs/api/api_key.html');
    }
  }

  // ============================================================================
  // PRIVATE UTILITY METHODS
  // ============================================================================

  private async makeRequest<T>(endpoint: string, params: FredRequestParams = {}): Promise<T> {
    const url = new URL(`${this.config.baseUrl}/${endpoint}`);
    
    // Add API key and default parameters
    const searchParams = new URLSearchParams({
      api_key: this.config.apiKey,
      file_type: 'json',
      ...Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    });

    url.search = searchParams.toString();

    return this.executeWithRateLimit(async () => {
      for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

          const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.text();
            
            if (response.status === 429) {
              throw new Error(`Rate limit exceeded. Status: ${response.status}`);
            }
            
            if (response.status === 400) {
              throw new Error(`Bad request: ${errorData}`);
            }
            
            if (response.status === 404) {
              throw new Error(`Not found: ${endpoint}`);
            }

            throw new Error(`HTTP ${response.status}: ${errorData}`);
          }

          const data = await response.json();
          
          if (data.error_code) {
            throw new Error(`FRED API Error ${data.error_code}: ${data.error_message}`);
          }

          return data as T;
        } catch (error) {
          if (attempt === this.config.retryAttempts) {
            throw error;
          }
          
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      throw new Error('Max retry attempts reached');
    });
  }

  private async executeWithRateLimit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.rateLimitQueue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processRateLimitQueue();
    });
  }

  private async processRateLimitQueue(): Promise<void> {
    if (this.rateLimitActive || this.rateLimitQueue.length === 0) {
      return;
    }

    this.rateLimitActive = true;

    while (this.rateLimitQueue.length > 0) {
      const request = this.rateLimitQueue.shift();
      if (request) {
        await request();
        // Rate limit: 120 requests per 60 seconds = ~500ms between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    this.rateLimitActive = false;
  }

  private validateSeriesId(seriesId: string): void {
    if (!seriesId || typeof seriesId !== 'string') {
      throw new Error('Series ID is required and must be a string');
    }
  }

  private validateCategoryId(categoryId: number): void {
    if (!categoryId || typeof categoryId !== 'number' || categoryId <= 0) {
      throw new Error('Category ID is required and must be a positive number');
    }
  }

  private validateReleaseId(releaseId: number): void {
    if (!releaseId || typeof releaseId !== 'number' || releaseId <= 0) {
      throw new Error('Release ID is required and must be a positive number');
    }
  }

  private validateSourceId(sourceId: number): void {
    if (!sourceId || typeof sourceId !== 'number' || sourceId <= 0) {
      throw new Error('Source ID is required and must be a positive number');
    }
  }

  // ============================================================================
  // CATEGORY ENDPOINTS
  // ============================================================================

  /**
   * Get a category
   * https://fred.stlouisfed.org/docs/api/fred/category.html
   */
  async getCategory(categoryId: number): Promise<CategoryResponse> {
    this.validateCategoryId(categoryId);
    return this.makeRequest<CategoryResponse>('category', { category_id: categoryId });
  }

  /**
   * Get the child categories for a specified parent category
   * https://fred.stlouisfed.org/docs/api/fred/category_children.html
   */
  async getCategoryChildren(
    categoryId: number,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
    }
  ): Promise<CategoryChildrenResponse> {
    this.validateCategoryId(categoryId);
    return this.makeRequest<CategoryChildrenResponse>('category/children', {
      category_id: categoryId,
      ...params,
    });
  }

  /**
   * Get the related categories for a category
   * https://fred.stlouisfed.org/docs/api/fred/category_related.html
   */
  async getCategoryRelated(
    categoryId: number,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
    }
  ): Promise<CategoryRelatedResponse> {
    this.validateCategoryId(categoryId);
    return this.makeRequest<CategoryRelatedResponse>('category/related', {
      category_id: categoryId,
      ...params,
    });
  }

  /**
   * Get the series in a category
   * https://fred.stlouisfed.org/docs/api/fred/category_series.html
   */
  async getCategorySeries(
    categoryId: number,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      limit?: number;
      offset?: number;
      order_by?: 'series_id' | 'title' | 'units' | 'frequency' | 'seasonal_adjustment' | 'realtime_start' | 'realtime_end' | 'last_updated' | 'observation_start' | 'observation_end' | 'popularity' | 'group_popularity';
      sort_order?: 'asc' | 'desc';
      filter_variable?: 'frequency' | 'units' | 'seasonal_adjustment';
      filter_value?: string;
      tag_names?: string;
      exclude_tag_names?: string;
    }
  ): Promise<CategorySeriesResponse> {
    this.validateCategoryId(categoryId);
    return this.makeRequest<CategorySeriesResponse>('category/series', {
      category_id: categoryId,
      ...params,
    });
  }

  /**
   * Get the FRED tags for a category
   * https://fred.stlouisfed.org/docs/api/fred/category_tags.html
   */
  async getCategoryTags(
    categoryId: number,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      tag_names?: string;
      tag_group_id?: string;
      search_text?: string;
      limit?: number;
      offset?: number;
      order_by?: 'name' | 'group_id' | 'popularity' | 'created' | 'series_count';
      sort_order?: 'asc' | 'desc';
    }
  ): Promise<CategoryTagsResponse> {
    this.validateCategoryId(categoryId);
    return this.makeRequest<CategoryTagsResponse>('category/tags', {
      category_id: categoryId,
      ...params,
    });
  }

  /**
   * Get the related FRED tags for one or more FRED tags within a category
   * https://fred.stlouisfed.org/docs/api/fred/category_related_tags.html
   */
  async getCategoryRelatedTags(
    categoryId: number,
    tagNames: string,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      exclude_tag_names?: string;
      tag_group_id?: string;
      search_text?: string;
      limit?: number;
      offset?: number;
      order_by?: 'name' | 'group_id' | 'popularity' | 'created' | 'series_count';
      sort_order?: 'asc' | 'desc';
    }
  ): Promise<CategoryRelatedTagsResponse> {
    this.validateCategoryId(categoryId);
    return this.makeRequest<CategoryRelatedTagsResponse>('category/related_tags', {
      category_id: categoryId,
      tag_names: tagNames,
      ...params,
    });
  }

  // ============================================================================
  // RELEASE ENDPOINTS
  // ============================================================================

  /**
   * Get all releases of economic data
   * https://fred.stlouisfed.org/docs/api/fred/releases.html
   */
  async getReleases(params?: {
    realtime_start?: string;
    realtime_end?: string;
    limit?: number;
    offset?: number;
    order_by?: 'release_id' | 'name' | 'press_release' | 'realtime_start' | 'realtime_end';
    sort_order?: 'asc' | 'desc';
  }): Promise<ReleaseResponse> {
    return this.makeRequest<ReleaseResponse>('releases', params);
  }

  /**
   * Get release dates for all releases of economic data
   * https://fred.stlouisfed.org/docs/api/fred/releases_dates.html
   */
  async getReleasesDates(params?: {
    realtime_start?: string;
    realtime_end?: string;
    limit?: number;
    offset?: number;
    order_by?: 'release_date' | 'release_id' | 'release_name';
    sort_order?: 'asc' | 'desc';
    include_release_dates_with_no_data?: boolean;
  }): Promise<ReleaseDatesResponse> {
    return this.makeRequest<ReleaseDatesResponse>('releases/dates', params);
  }

  /**
   * Get a release of economic data
   * https://fred.stlouisfed.org/docs/api/fred/release.html
   */
  async getRelease(releaseId: number): Promise<ReleaseResponse> {
    this.validateReleaseId(releaseId);
    return this.makeRequest<ReleaseResponse>('release', { release_id: releaseId });
  }

  /**
   * Get release dates for a release of economic data
   * https://fred.stlouisfed.org/docs/api/fred/release_dates.html
   */
  async getReleaseDates(
    releaseId: number,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      limit?: number;
      offset?: number;
      sort_order?: 'asc' | 'desc';
      include_release_dates_with_no_data?: boolean;
    }
  ): Promise<ReleaseDatesResponse> {
    this.validateReleaseId(releaseId);
    return this.makeRequest<ReleaseDatesResponse>('release/dates', {
      release_id: releaseId,
      ...params,
    });
  }

  /**
   * Get the series on a release of economic data
   * https://fred.stlouisfed.org/docs/api/fred/release_series.html
   */
  async getReleaseSeries(
    releaseId: number,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      limit?: number;
      offset?: number;
      order_by?: 'series_id' | 'title' | 'units' | 'frequency' | 'seasonal_adjustment' | 'realtime_start' | 'realtime_end' | 'last_updated' | 'observation_start' | 'observation_end' | 'popularity' | 'group_popularity';
      sort_order?: 'asc' | 'desc';
      filter_variable?: 'frequency' | 'units' | 'seasonal_adjustment';
      filter_value?: string;
      tag_names?: string;
      exclude_tag_names?: string;
    }
  ): Promise<ReleaseSeriesResponse> {
    this.validateReleaseId(releaseId);
    return this.makeRequest<ReleaseSeriesResponse>('release/series', {
      release_id: releaseId,
      ...params,
    });
  }

  /**
   * Get the sources for a release of economic data
   * https://fred.stlouisfed.org/docs/api/fred/release_sources.html
   */
  async getReleaseSources(releaseId: number): Promise<ReleaseSourcesResponse> {
    this.validateReleaseId(releaseId);
    return this.makeRequest<ReleaseSourcesResponse>('release/sources', { release_id: releaseId });
  }

  /**
   * Get the FRED tags for a release
   * https://fred.stlouisfed.org/docs/api/fred/release_tags.html
   */
  async getReleaseTags(
    releaseId: number,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      tag_names?: string;
      tag_group_id?: string;
      search_text?: string;
      limit?: number;
      offset?: number;
      order_by?: 'name' | 'group_id' | 'popularity' | 'created' | 'series_count';
      sort_order?: 'asc' | 'desc';
    }
  ): Promise<ReleaseTagsResponse> {
    this.validateReleaseId(releaseId);
    return this.makeRequest<ReleaseTagsResponse>('release/tags', {
      release_id: releaseId,
      ...params,
    });
  }

  /**
   * Get the related FRED tags for one or more FRED tags within a release
   * https://fred.stlouisfed.org/docs/api/fred/release_related_tags.html
   */
  async getReleaseRelatedTags(
    releaseId: number,
    tagNames: string,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      exclude_tag_names?: string;
      tag_group_id?: string;
      search_text?: string;
      limit?: number;
      offset?: number;
      order_by?: 'name' | 'group_id' | 'popularity' | 'created' | 'series_count';
      sort_order?: 'asc' | 'desc';
    }
  ): Promise<ReleaseRelatedTagsResponse> {
    this.validateReleaseId(releaseId);
    return this.makeRequest<ReleaseRelatedTagsResponse>('release/related_tags', {
      release_id: releaseId,
      tag_names: tagNames,
      ...params,
    });
  }

  /**
   * Get release table trees for a given release
   * https://fred.stlouisfed.org/docs/api/fred/release_tables.html
   */
  async getReleaseTables(
    releaseId: number,
    params?: {
      element_id?: number;
      include_observation_values?: boolean;
      observation_date?: string;
    }
  ): Promise<ReleaseTablesResponse> {
    this.validateReleaseId(releaseId);
    return this.makeRequest<ReleaseTablesResponse>('release/tables', {
      release_id: releaseId,
      ...params,
    });
  }

  // ============================================================================
  // SERIES ENDPOINTS
  // ============================================================================

  /**
   * Get an economic data series
   * https://fred.stlouisfed.org/docs/api/fred/series.html
   */
  async getSeries(seriesId: string): Promise<SeriesResponse> {
    this.validateSeriesId(seriesId);
    return this.makeRequest<SeriesResponse>('series', { series_id: seriesId });
  }

  /**
   * Get the categories for an economic data series
   * https://fred.stlouisfed.org/docs/api/fred/series_categories.html
   */
  async getSeriesCategories(seriesId: string): Promise<SeriesCategoriesResponse> {
    this.validateSeriesId(seriesId);
    return this.makeRequest<SeriesCategoriesResponse>('series/categories', { series_id: seriesId });
  }

  /**
   * Get the observations or data values for an economic data series
   * https://fred.stlouisfed.org/docs/api/fred/series_observations.html
   */
  async getSeriesObservations(
    seriesId: string,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      limit?: number;
      offset?: number;
      sort_order?: 'asc' | 'desc';
      observation_start?: string;
      observation_end?: string;
      units?: 'lin' | 'chg' | 'ch1' | 'pch' | 'pc1' | 'pca' | 'cch' | 'cca' | 'log';
      frequency?: 'd' | 'w' | 'bw' | 'm' | 'q' | 'sa' | 'a';
      aggregation_method?: 'avg' | 'sum' | 'eop';
      output_type?: number;
      vintage_dates?: string;
    }
  ): Promise<SeriesObservationsResponse> {
    this.validateSeriesId(seriesId);
    return this.makeRequest<SeriesObservationsResponse>('series/observations', {
      series_id: seriesId,
      ...params,
    });
  }

  /**
   * Get economic data series that match search text
   * https://fred.stlouisfed.org/docs/api/fred/series_search.html
   */
  async searchSeries(
    searchText: string,
    params?: {
      search_type?: 'full_text' | 'series_id';
      realtime_start?: string;
      realtime_end?: string;
      limit?: number;
      offset?: number;
      order_by?: 'search_rank' | 'series_id' | 'title' | 'units' | 'frequency' | 'seasonal_adjustment' | 'realtime_start' | 'realtime_end' | 'last_updated' | 'observation_start' | 'observation_end' | 'popularity' | 'group_popularity';
      sort_order?: 'asc' | 'desc';
      filter_variable?: 'frequency' | 'units' | 'seasonal_adjustment';
      filter_value?: string;
      tag_names?: string;
      exclude_tag_names?: string;
    }
  ): Promise<SeriesSearchResponse> {
    return this.makeRequest<SeriesSearchResponse>('series/search', {
      search_text: searchText,
      ...params,
    });
  }

  /**
   * Get the FRED tags for a series
   * https://fred.stlouisfed.org/docs/api/fred/series_tags.html
   */
  async getSeriesTags(
    seriesId: string,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      order_by?: 'name' | 'group_id' | 'popularity' | 'created' | 'series_count';
      sort_order?: 'asc' | 'desc';
    }
  ): Promise<SeriesTagsResponse> {
    this.validateSeriesId(seriesId);
    return this.makeRequest<SeriesTagsResponse>('series/tags', {
      series_id: seriesId,
      ...params,
    });
  }

  /**
   * Get economic data series sorted by when observations were updated on the FRED server
   * https://fred.stlouisfed.org/docs/api/fred/series_updates.html
   */
  async getSeriesUpdates(params?: {
    realtime_start?: string;
    realtime_end?: string;
    limit?: number;
    offset?: number;
    filter_value?: string;
    start_time?: string;
    end_time?: string;
  }): Promise<SeriesUpdatesResponse> {
    return this.makeRequest<SeriesUpdatesResponse>('series/updates', params);
  }

  /**
   * Get the dates in history when a series' data values were revised or new data values were released
   * https://fred.stlouisfed.org/docs/api/fred/series_vintagedates.html
   */
  async getSeriesVintageDates(
    seriesId: string,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      limit?: number;
      offset?: number;
      sort_order?: 'asc' | 'desc';
    }
  ): Promise<SeriesVintageDatesResponse> {
    this.validateSeriesId(seriesId);
    return this.makeRequest<SeriesVintageDatesResponse>('series/vintagedates', {
      series_id: seriesId,
      ...params,
    });
  }

  // ============================================================================
  // SOURCE ENDPOINTS
  // ============================================================================

  /**
   * Get all sources of economic data
   * https://fred.stlouisfed.org/docs/api/fred/sources.html
   */
  async getSources(params?: {
    realtime_start?: string;
    realtime_end?: string;
    limit?: number;
    offset?: number;
    order_by?: 'source_id' | 'name' | 'realtime_start' | 'realtime_end';
    sort_order?: 'asc' | 'desc';
  }): Promise<SourceResponse> {
    return this.makeRequest<SourceResponse>('sources', params);
  }

  /**
   * Get a source of economic data
   * https://fred.stlouisfed.org/docs/api/fred/source.html
   */
  async getSource(sourceId: number): Promise<SourceResponse> {
    this.validateSourceId(sourceId);
    return this.makeRequest<SourceResponse>('source', { source_id: sourceId });
  }

  /**
   * Get the releases for a source
   * https://fred.stlouisfed.org/docs/api/fred/source_releases.html
   */
  async getSourceReleases(
    sourceId: number,
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      limit?: number;
      offset?: number;
      order_by?: 'release_id' | 'name' | 'press_release' | 'realtime_start' | 'realtime_end';
      sort_order?: 'asc' | 'desc';
    }
  ): Promise<SourceReleasesResponse> {
    this.validateSourceId(sourceId);
    return this.makeRequest<SourceReleasesResponse>('source/releases', {
      source_id: sourceId,
      ...params,
    });
  }

  // ============================================================================
  // TAG ENDPOINTS
  // ============================================================================

  /**
   * Get FRED tags
   * https://fred.stlouisfed.org/docs/api/fred/tags.html
   */
  async getTags(params?: {
    realtime_start?: string;
    realtime_end?: string;
    tag_names?: string;
    tag_group_id?: string;
    search_text?: string;
    limit?: number;
    offset?: number;
    order_by?: 'name' | 'group_id' | 'popularity' | 'created' | 'series_count';
    sort_order?: 'asc' | 'desc';
  }): Promise<TagResponse> {
    return this.makeRequest<TagResponse>('tags', params);
  }

  /**
   * Get the series matching tags
   * https://fred.stlouisfed.org/docs/api/fred/tags_series.html
   */
  async getTagSeries(
    tagNames: string,
    params?: {
      exclude_tag_names?: string;
      realtime_start?: string;
      realtime_end?: string;
      limit?: number;
      offset?: number;
      order_by?: 'series_id' | 'title' | 'units' | 'frequency' | 'seasonal_adjustment' | 'realtime_start' | 'realtime_end' | 'last_updated' | 'observation_start' | 'observation_end' | 'popularity' | 'group_popularity';
      sort_order?: 'asc' | 'desc';
    }
  ): Promise<TagSeriesResponse> {
    return this.makeRequest<TagSeriesResponse>('tags/series', {
      tag_names: tagNames,
      ...params,
    });
  }

  /**
   * Get the related FRED tags for one or more FRED tags
   * https://fred.stlouisfed.org/docs/api/fred/related_tags.html
   */
  async getRelatedTags(
    tagNames: string,
    params?: {
      exclude_tag_names?: string;
      realtime_start?: string;
      realtime_end?: string;
      tag_group_id?: string;
      search_text?: string;
      limit?: number;
      offset?: number;
      order_by?: 'name' | 'group_id' | 'popularity' | 'created' | 'series_count';
      sort_order?: 'asc' | 'desc';
    }
  ): Promise<TagRelatedTagsResponse> {
    return this.makeRequest<TagRelatedTagsResponse>('related_tags', {
      tag_names: tagNames,
      ...params,
    });
  }

  // ============================================================================
  // MAPS (GeoFRED) ENDPOINTS
  // ============================================================================

  /**
   * Get the meta information for a GeoFRED series group
   * https://fred.stlouisfed.org/docs/api/geofred/series_group.html
   */
  async getGeoSeriesGroup(
    seriesGroup: string,
    params?: {
      season?: string;
      units?: string;
      frequency?: string;
    }
  ): Promise<any> {
    return this.makeRequest<any>('geofred/series/group', {
      series_group: seriesGroup,
      ...params,
    });
  }

  /**
   * Get data for a GeoFRED series group
   * https://fred.stlouisfed.org/docs/api/geofred/series_data.html
   */
  async getGeoSeriesData(
    seriesGroup: string,
    params?: {
      season?: string;
      units?: string;
      frequency?: string;
      date?: string;
      region_type?: string;
      transformation?: string;
    }
  ): Promise<GeoSeriesResponse> {
    return this.makeRequest<GeoSeriesResponse>('geofred/series/data', {
      series_group: seriesGroup,
      ...params,
    });
  }

  /**
   * Get meta information for a GeoFRED regional series
   * https://fred.stlouisfed.org/docs/api/geofred/regional_data.html
   */
  async getGeoRegionalData(
    seriesGroup: string,
    region: string,
    params?: {
      season?: string;
      units?: string;
      frequency?: string;
      start_date?: string;
      end_date?: string;
    }
  ): Promise<any> {
    return this.makeRequest<any>('geofred/regional/data', {
      series_group: seriesGroup,
      region: region,
      ...params,
    });
  }

  // ============================================================================
  // CONVENIENCE METHODS
  // ============================================================================

  /**
   * Get multiple series data in a single call (batched)
   */
  async getMultipleSeries(seriesIds: string[]): Promise<SeriesResponse[]> {
    const results = await Promise.all(
      seriesIds.map(id => this.getSeries(id))
    );
    return results;
  }

  /**
   * Get multiple series observations in a single call (batched)
   */
  async getMultipleSeriesObservations(
    seriesIds: string[],
    params?: {
      realtime_start?: string;
      realtime_end?: string;
      limit?: number;
      offset?: number;
      sort_order?: 'asc' | 'desc';
      observation_start?: string;
      observation_end?: string;
      units?: 'lin' | 'chg' | 'ch1' | 'pch' | 'pc1' | 'pca' | 'cch' | 'cca' | 'log';
      frequency?: 'd' | 'w' | 'bw' | 'm' | 'q' | 'sa' | 'a';
      aggregation_method?: 'avg' | 'sum' | 'eop';
    }
  ): Promise<SeriesObservationsResponse[]> {
    const results = await Promise.all(
      seriesIds.map(id => this.getSeriesObservations(id, params))
    );
    return results;
  }

  /**
   * Get popular economic indicators
   */
  async getPopularIndicators(): Promise<SeriesSearchResponse> {
    return this.searchSeries('GDP unemployment inflation', {
      order_by: 'popularity',
      sort_order: 'desc',
      limit: 50,
    });
  }

  /**
   * Get latest GDP data
   */
  async getLatestGDP(): Promise<SeriesObservationsResponse> {
    return this.getSeriesObservations('GDP', {
      limit: 10,
      sort_order: 'desc',
    });
  }

  /**
   * Get latest unemployment rate
   */
  async getLatestUnemploymentRate(): Promise<SeriesObservationsResponse> {
    return this.getSeriesObservations('UNRATE', {
      limit: 10,
      sort_order: 'desc',
    });
  }

  /**
   * Get latest inflation data (CPI)
   */
  async getLatestInflation(): Promise<SeriesObservationsResponse> {
    return this.getSeriesObservations('CPIAUCSL', {
      limit: 10,
      sort_order: 'desc',
    });
  }

  /**
   * Get federal funds rate
   */
  async getFederalFundsRate(): Promise<SeriesObservationsResponse> {
    return this.getSeriesObservations('FEDFUNDS', {
      limit: 10,
      sort_order: 'desc',
    });
  }

  /**
   * Get 10-Year Treasury rate
   */
  async getTreasuryRate10Year(): Promise<SeriesObservationsResponse> {
    return this.getSeriesObservations('GS10', {
      limit: 10,
      sort_order: 'desc',
    });
  }

  /**
   * Get S&P 500 data
   */
  async getSP500(): Promise<SeriesObservationsResponse> {
    return this.getSeriesObservations('SP500', {
      limit: 10,
      sort_order: 'desc',
    });
  }

  /**
   * Get housing price index
   */
  async getHousingPriceIndex(): Promise<SeriesObservationsResponse> {
    return this.getSeriesObservations('CSUSHPISA', {
      limit: 10,
      sort_order: 'desc',
    });
  }

  /**
   * Get consumer confidence index
   */
  async getConsumerConfidence(): Promise<SeriesObservationsResponse> {
    return this.getSeriesObservations('CSCICP03USM665S', {
      limit: 10,
      sort_order: 'desc',
    });
  }

  /**
   * Search series by keyword with common economic terms
   */
  async searchEconomicSeries(
    keyword: string,
    params?: {
      limit?: number;
      tags?: string[];
      exclude_tags?: string[];
    }
  ): Promise<SeriesSearchResponse> {
    const searchParams: any = {
      limit: params?.limit || 25,
      order_by: 'popularity',
      sort_order: 'desc',
    };

    if (params?.tags) {
      searchParams.tag_names = params.tags.join(';');
    }

    if (params?.exclude_tags) {
      searchParams.exclude_tag_names = params.exclude_tags.join(';');
    }

    return this.searchSeries(keyword, searchParams);
  }

  /**
   * Get series data for a specific date range
   */
  async getSeriesForDateRange(
    seriesId: string,
    startDate: string,
    endDate: string,
    frequency?: 'd' | 'w' | 'bw' | 'm' | 'q' | 'sa' | 'a'
  ): Promise<SeriesObservationsResponse> {
    return this.getSeriesObservations(seriesId, {
      observation_start: startDate,
      observation_end: endDate,
      frequency: frequency,
      limit: 10000, // Get all data in range
    });
  }

  /**
   * Get the most recent observation for a series
   */
  async getLatestObservation(seriesId: string): Promise<SeriesObservation | null> {
    this.validateSeriesId(seriesId);
    const response = await this.getSeriesObservations(seriesId, {
      limit: 1,
      sort_order: 'desc',
    });

    return response.observations && response.observations.length > 0 
      ? response.observations[0] 
      : null;
  }

  /**
   * Get series data transformed to specific units
   */
  async getSeriesTransformed(
    seriesId: string,
    units: 'lin' | 'chg' | 'ch1' | 'pch' | 'pc1' | 'pca' | 'cch' | 'cca' | 'log',
    params?: {
      observation_start?: string;
      observation_end?: string;
      frequency?: 'd' | 'w' | 'bw' | 'm' | 'q' | 'sa' | 'a';
      limit?: number;
    }
  ): Promise<SeriesObservationsResponse> {
    return this.getSeriesObservations(seriesId, {
      units,
      ...params,
    });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Check API connection and key validity
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getCategory(0); // Root category
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get API usage info (rate limit status)
   */
  getConnectionInfo(): {
    apiKey: string;
    baseUrl: string;
    queueLength: number;
    rateLimitActive: boolean;
  } {
    return {
      apiKey: this.config.apiKey.substring(0, 8) + '...',
      baseUrl: this.config.baseUrl,
      queueLength: this.rateLimitQueue.length,
      rateLimitActive: this.rateLimitActive,
    };
  }

  /**
   * Format date for FRED API (YYYY-MM-DD)
   */
  static formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }
    return date.toISOString().split('T')[0];
  }

  /**
   * Parse FRED date string to Date object
   */
  static parseDate(dateString: string): Date {
    return new Date(dateString + 'T00:00:00.000Z');
  }

  /**
   * Get common series IDs for quick reference
   */
  static getCommonSeriesIds(): Record<string, string> {
    return {
      // Economic Growth
      GDP: 'GDP', // Gross Domestic Product
      GDPC1: 'GDPC1', // Real GDP
      GDPPOT: 'GDPPOT', // Real Potential GDP
      
      // Employment
      UNRATE: 'UNRATE', // Unemployment Rate
      PAYEMS: 'PAYEMS', // Nonfarm Payrolls
      CIVPART: 'CIVPART', // Labor Force Participation Rate
      
      // Inflation
      CPIAUCSL: 'CPIAUCSL', // Consumer Price Index
      CPILFESL: 'CPILFESL', // Core CPI
      PCEPI: 'PCEPI', // PCE Price Index
      PCEPILFE: 'PCEPILFE', // Core PCE Price Index
      
      // Interest Rates
      FEDFUNDS: 'FEDFUNDS', // Federal Funds Rate
      GS10: 'GS10', // 10-Year Treasury Rate
      GS2: 'GS2', // 2-Year Treasury Rate
      GS30: 'GS30', // 30-Year Treasury Rate
      
      // Money Supply
      M1SL: 'M1SL', // M1 Money Stock
      M2SL: 'M2SL', // M2 Money Stock
      BASE: 'BASE', // Monetary Base
      
      // Stock Market
      SP500: 'SP500', // S&P 500
      NASDAQCOM: 'NASDAQCOM', // NASDAQ Composite
      DJIA: 'DJIA', // Dow Jones Industrial Average
      
      // Housing
      CSUSHPISA: 'CSUSHPISA', // Case-Shiller Home Price Index
      HOUST: 'HOUST', // Housing Starts
      HSNGOV: 'HSNGOV', // New Home Sales
      
      // International Trade
      BOPGEXP: 'BOPGEXP', // Exports of Goods and Services
      BOPGIMP: 'BOPGIMP', // Imports of Goods and Services
      BOPGTB: 'BOPGTB', // Trade Balance
      
      // Business & Manufacturing
      INDPRO: 'INDPRO', // Industrial Production Index
      TCU: 'TCU', // Capacity Utilization
      UMCSENT: 'UMCSENT', // Consumer Sentiment
      
      // Demographics
      POP: 'POP', // Total Population
      EMRATIO: 'EMRATIO', // Employment-Population Ratio
      
      // Energy
      DCOILWTICO: 'DCOILWTICO', // Crude Oil Prices (WTI)
      DHHNGSP: 'DHHNGSP', // Natural Gas Price
      
      // Currency
      DEXUSEU: 'DEXUSEU', // US/Euro Exchange Rate
      DEXJPUS: 'DEXJPUS', // Japan/US Exchange Rate
      DEXCHUS: 'DEXCHUS', // China/US Exchange Rate
    };
  }

  /**
   * Get series description by ID
   */
  static getSeriesDescription(seriesId: string): string {
    const descriptions: Record<string, string> = {
      GDP: 'Gross Domestic Product, Seasonally Adjusted Annual Rate',
      GDPC1: 'Real Gross Domestic Product, Chained 2012 Dollars',
      UNRATE: 'Unemployment Rate, Seasonally Adjusted',
      CPIAUCSL: 'Consumer Price Index for All Urban Consumers: All Items',
      FEDFUNDS: 'Effective Federal Funds Rate',
      GS10: '10-Year Treasury Constant Maturity Rate',
      SP500: 'S&P 500 Stock Price Index',
      PAYEMS: 'All Employees, Total Nonfarm, Seasonally Adjusted',
      M2SL: 'M2 Money Stock, Seasonally Adjusted',
      CSUSHPISA: 'S&P/Case-Shiller U.S. National Home Price Index',
      INDPRO: 'Industrial Production Index, Seasonally Adjusted',
      UMCSENT: 'University of Michigan Consumer Sentiment Index',
      DCOILWTICO: 'Crude Oil Prices: West Texas Intermediate (WTI)',
    };
    
    return descriptions[seriesId] || 'Economic data series';
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a FRED client instance
 */
export function createFredClient(apiKey: string, config?: Partial<FredConfig>): FredClient {
  return new FredClient({
    apiKey,
    ...config,
  });
}

/**
 * Validate FRED API key format
 */
export function isValidApiKey(apiKey: string): boolean {
  return typeof apiKey === 'string' && apiKey.length === 32 && /^[a-f0-9]+$/i.test(apiKey);
}

/**
 * Format number for display
 */
export function formatValue(value: string | number, units?: string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return 'N/A';
  }

  // Format based on units
  if (units) {
    const lowerUnits = units.toLowerCase();
    if (lowerUnits.includes('percent') || lowerUnits.includes('rate')) {
      return `${numValue.toFixed(2)}%`;
    }
    if (lowerUnits.includes('billions')) {
      return `${(numValue / 1000).toFixed(1)}T`;
    }
    if (lowerUnits.includes('millions')) {
      return `${(numValue / 1000).toFixed(1)}B`;
    }
    if (lowerUnits.includes('dollars')) {
      return `${numValue.toLocaleString()}`;
    }
  }

  // Default formatting
  if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M`;
  }
  if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(1)}K`;
  }
  
  return numValue.toLocaleString();
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Get trending direction for a series
 */
export function getTrend(observations: SeriesObservation[]): 'up' | 'down' | 'stable' {
  if (observations.length < 2) return 'stable';
  
  const recent = parseFloat(observations[0].value);
  const previous = parseFloat(observations[1].value);
  
  if (isNaN(recent) || isNaN(previous)) return 'stable';
  
  const change = recent - previous;
  const threshold = Math.abs(previous * 0.001); // 0.1% threshold
  
  if (change > threshold) return 'up';
  if (change < -threshold) return 'down';
  return 'stable';
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default FredClient;
```
- `/src/lib/api-clients/economics/index.ts`:
```typescript
export * from './fred';
```

Done! I have created the `fred.ts` file in the correct directory and exported its contents.