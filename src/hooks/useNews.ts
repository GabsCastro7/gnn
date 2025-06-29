import { useState, useEffect, useCallback } from 'react';
import { newsService, NewsItem } from '../services/newsService';

interface UseNewsOptions {
  category?: string;
  query?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  pageSize?: number;
}

interface UseNewsReturn {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  clearCache: () => void;
}

export const useNews = (options: UseNewsOptions = {}): UseNewsReturn => {
  const {
    category,
    query,
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutos
    pageSize = 12
  } = options;

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);

  const fetchNews = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
        setError(null);
      }

      let newsData: NewsItem[] = [];

      if (query) {
        newsData = await newsService.searchNews(query, category);
      } else if (category && category !== 'all') {
        newsData = await newsService.getTopHeadlines(category);
      } else {
        newsData = await newsService.getAllNews();
      }

      // Simular paginação com dados existentes
      if (pageNum === 1) {
        setAllNews(newsData);
        const paginatedNews = newsData.slice(0, pageSize);
        setNews(paginatedNews);
        setHasMore(newsData.length > pageSize);
      } else if (append) {
        const startIndex = (pageNum - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const newItems = allNews.slice(startIndex, endIndex);
        
        if (newItems.length > 0) {
          setNews(prev => [...prev, ...newItems]);
          setHasMore(endIndex < allNews.length);
        } else {
          setHasMore(false);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notícias');
      console.error('Error fetching news:', err);
    } finally {
      if (pageNum === 1) {
        setLoading(false);
      }
    }
  }, [category, query, pageSize, allNews]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchNews(nextPage, true);
  }, [page, hasMore, loading, fetchNews]);

  const refresh = useCallback(async () => {
    setPage(1);
    setHasMore(true);
    await fetchNews(1, false);
  }, [fetchNews]);

  const clearCache = useCallback(() => {
    newsService.clearCache();
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchNews(1, false);
  }, [category, query]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        if (page === 1) {
          fetchNews(1, false);
        }
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchNews, page]);

  return {
    news,
    loading,
    error,
    refresh,
    loadMore,
    hasMore,
    clearCache
  };
};

export const useBreakingNews = (): UseNewsReturn => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreakingNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const newsData = await newsService.getBreakingNews();
      setNews(newsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notícias urgentes');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchBreakingNews();
  }, [fetchBreakingNews]);

  const clearCache = useCallback(() => {
    newsService.clearCache();
  }, []);

  useEffect(() => {
    fetchBreakingNews();
    
    // Auto refresh breaking news every 2 minutes
    const interval = setInterval(fetchBreakingNews, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchBreakingNews]);

  return {
    news,
    loading,
    error,
    refresh,
    loadMore: async () => {},
    hasMore: false,
    clearCache
  };
};

export const useInternationalNews = (): UseNewsReturn => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInternationalNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const newsData = await newsService.getInternationalNews();
      setNews(newsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notícias internacionais');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchInternationalNews();
  }, [fetchInternationalNews]);

  const clearCache = useCallback(() => {
    newsService.clearCache();
  }, []);

  useEffect(() => {
    fetchInternationalNews();
  }, [fetchInternationalNews]);

  return {
    news,
    loading,
    error,
    refresh,
    loadMore: async () => {},
    hasMore: false,
    clearCache
  };
};