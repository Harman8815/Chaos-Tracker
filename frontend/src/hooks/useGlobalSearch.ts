"use client";

import { useMemo } from 'react';
import { search, groupByCategory } from '../lib/search';
import type { SearchResult, SearchableData } from '../lib/search';

export function useGlobalSearch(data: SearchableData, query: string, limit = 20) {
  return useMemo(() => {
    if (!query.trim()) return { results: [] as SearchResult[], grouped: {} as Record<string, SearchResult[]> };
    const results = search(data, query, limit);
    return { results, grouped: groupByCategory(results) };
  }, [data, query, limit]);
}
