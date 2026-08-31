import { client as apiClient } from '../api/client';
import { QuoteSource, Quote } from '../types';

/**
 * Quote Service - Handles all API calls for quote management
 */

// ==================== QUOTE SOURCES ====================

/**
 * Get all quote sources for the authenticated user
 */
export const getAllQuoteSources = async (params?: {
  type?: 'Movie' | 'Web Series' | 'Book';
  include_quotes?: boolean;
}): Promise<QuoteSource[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.type) {
    queryParams.append('type', params.type);
  }
  
  if (params?.include_quotes !== undefined) {
    queryParams.append('include_quotes', params.include_quotes.toString());
  }
  
  const url = `/quotes/sources/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await apiClient.get<{ sources: QuoteSource[] }>(url);
  return response.sources;
};

/**
 * Get a specific quote source by ID
 */
export const getQuoteSource = async (sourceId: string): Promise<QuoteSource> => {
  const response = await apiClient.get<{ source: QuoteSource }>(`/quotes/sources/${sourceId}/`);
  return response.source;
};

/**
 * Create a new quote source
 */
export const createQuoteSource = async (
  sourceData: Omit<QuoteSource, 'created_at' | 'updated_at'>
): Promise<QuoteSource> => {
  const response = await apiClient.post<{ source: QuoteSource }>('/quotes/sources/', {
    id: sourceData.id,
    title: sourceData.title,
    type: sourceData.type,
    cover_image: sourceData.coverImage,
    quotes: sourceData.quotes?.map(quote => ({
      id: quote.id,
      text: quote.text,
      author: quote.author,
      tags: quote.tags,
      image: quote.image,
    })) || [],
  });
  
  return transformQuoteSourceFromAPI(response.source);
};

/**
 * Update a quote source
 */
export const updateQuoteSource = async (
  sourceId: string,
  updates: Partial<Omit<QuoteSource, 'id' | 'quotes' | 'created_at' | 'updated_at'>>
): Promise<QuoteSource> => {
  const payload: any = {};
  
  if (updates.title) payload.title = updates.title;
  if (updates.type) payload.type = updates.type;
  if (updates.coverImage) payload.cover_image = updates.coverImage;
  
  const response = await apiClient.put<{ source: QuoteSource }>(`/quotes/sources/${sourceId}/`, payload);
  return transformQuoteSourceFromAPI(response.source);
};

/**
 * Delete a quote source
 */
export const deleteQuoteSource = async (sourceId: string): Promise<void> => {
  await apiClient.delete(`/quotes/sources/${sourceId}/`);
};

// ==================== QUOTES ====================

/**
 * Get all quotes for a specific source
 */
export const getQuotesForSource = async (
  sourceId: string,
  tag?: string
): Promise<Quote[]> => {
  const url = tag 
    ? `/quotes/sources/${sourceId}/quotes/?tag=${encodeURIComponent(tag)}`
    : `/quotes/sources/${sourceId}/quotes/`;
  
  const response = await apiClient.get<{ quotes: Quote[] }>(url);
  return response.quotes.map(transformQuoteFromAPI);
};

/**
 * Get a specific quote by ID
 */
export const getQuote = async (quoteId: string): Promise<Quote> => {
  const response = await apiClient.get<{ quote: Quote }>(`/quotes/${quoteId}/`);
  return transformQuoteFromAPI(response.quote);
};

/**
 * Create a new quote for a source
 */
export const createQuote = async (
  sourceId: string,
  quoteData: Omit<Quote, 'created_at' | 'updated_at'>
): Promise<Quote> => {
  const response = await apiClient.post<{ quote: Quote }>(`/quotes/sources/${sourceId}/quotes/`, {
    id: quoteData.id,
    text: quoteData.text,
    author: quoteData.author,
    tags: quoteData.tags,
    image: quoteData.image,
  });
  
  return transformQuoteFromAPI(response.quote);
};

/**
 * Update a quote
 */
export const updateQuote = async (
  quoteId: string,
  updates: Partial<Omit<Quote, 'id' | 'created_at' | 'updated_at'>>
): Promise<Quote> => {
  const payload: any = {};
  
  if (updates.text) payload.text = updates.text;
  if (updates.author) payload.author = updates.author;
  if (updates.tags) payload.tags = updates.tags;
  if (updates.image !== undefined) payload.image = updates.image;
  
  const response = await apiClient.put<{ quote: Quote }>(`/quotes/${quoteId}/`, payload);
  return transformQuoteFromAPI(response.quote);
};

/**
 * Delete a quote
 */
export const deleteQuote = async (quoteId: string): Promise<void> => {
  await apiClient.delete(`/quotes/${quoteId}/`);
};

// ==================== SEARCH ====================

export interface SearchResult {
  source: QuoteSource;
  matched_quotes: Quote[];
  relevance_score: number;
  match_type: string;
}

/**
 * Fuzzy search across all quote sources and quotes
 */
export const fuzzySearchQuotes = async (
  query: string,
  limit: number = 20
): Promise<SearchResult[]> => {
  if (!query || query.trim().length < 2) {
    throw new Error('Search query must be at least 2 characters');
  }
  
  const response = await apiClient.get<{ results: SearchResult[] }>(
    `/quotes/search/?q=${encodeURIComponent(query.trim())}&limit=${limit}`
  );
  
  return response.results.map((result: any) => ({
    source: transformQuoteSourceFromAPI(result.source),
    matched_quotes: result.matched_quotes.map(transformQuoteFromAPI),
    relevance_score: result.relevance_score,
    match_type: result.match_type,
  }));
};

// ==================== TAGS ====================

/**
 * Get all unique tags used by the user
 */
export const getAllTags = async (): Promise<string[]> => {
  const response = await apiClient.get<{ tags: string[] }>('/quotes/tags/');
  return response.tags;
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Transform API quote source response to frontend format
 */
function transformQuoteSourceFromAPI(apiSource: any): QuoteSource {
  return {
    id: apiSource.id,
    title: apiSource.title,
    type: apiSource.type,
    coverImage: apiSource.cover_image,
    quotes: apiSource.quotes?.map(transformQuoteFromAPI) || [],
  };
}

/**
 * Transform API quote response to frontend format
 */
function transformQuoteFromAPI(apiQuote: any): Quote {
  return {
    id: apiQuote.id,
    text: apiQuote.text,
    author: apiQuote.author,
    tags: apiQuote.tags || [],
    image: apiQuote.image || undefined,
  };
}

// ==================== EXPORTS ====================

const quoteService = {
  // Sources
  getAllQuoteSources,
  getQuoteSource,
  createQuoteSource,
  updateQuoteSource,
  deleteQuoteSource,
  
  // Quotes
  getQuotesForSource,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  
  // Search
  fuzzySearchQuotes,
  
  // Tags
  getAllTags,
};

export default quoteService;
