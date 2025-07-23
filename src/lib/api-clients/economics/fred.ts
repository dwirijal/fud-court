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
    tag_group_id?: 'freq' | 'gen' | 'geo' | 'geot' | 'rls' | 'seas' | 'src';
    search_text?: string;
    limit?: number;
    offset?: number;
    order_by?: 'name' | 'group_id' | 'popularity' | 'created' | 'series_count';
    sort_order?: 'asc' | 'desc';
  }): Promise<TagResponse> {
    return this.makeRequest<TagResponse>('tags', params);
  }

  /**
   * Get the related FRED tags for one or more FRED tags
   * https://fred.stlouisfed.org/docs/api/fred/related_tags.html
   */
  async getRelatedTags(
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
  ): Promise<TagRelatedTagsResponse> {
    return this.makeRequest<TagRelatedTagsResponse>('related_tags', {
      tag_names: tagNames,
      ...params,
    });
  }

  /**
   * Get the series for a FRED tag
   * https://fred.stlouisfed.org/docs/api/fred/tags_series.html
   */
  async getTagsSeries(
    tagNames: string,
    params?: {
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

  // ============================================================================
  // MAPS ENDPOINTS
  // ============================================================================

  /**
   * Get data for a FRED map
   * https://fred.stlouisfed.org/docs/api/fred/map_geoseries.html
   */
  async getMapGeoSeries(
    seriesId: string,
    params?: {
      date?: string;
      start_date?: string;
    }
  ): Promise<GeoSeriesResponse> {
    this.validateSeriesId(seriesId);
    return this.makeRequest<GeoSeriesResponse>('map/geoseries', {
      series_id: seriesId,
      ...params,
    });
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================
/*
const fred = new FredClient({ apiKey: 'YOUR_API_KEY' });

// Get GDP data
fred.getSeriesObservations('GDP')
  .then(data => console.log('GDP Data:', data.observations))
  .catch(error => console.error(error));

// Search for unemployment series
fred.searchSeries('unemployment rate')
  .then(data => console.log('Search Results:', data.series))
  .catch(error => console.error(error));

// Get releases for today
fred.getReleases({ realtime_start: new Date().toISOString().split('T')[0] })
  .then(data => console.log('Today\'s Releases:', data.releases))
  .catch(error => console.error(error));
*/
