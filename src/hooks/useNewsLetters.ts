/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useNewsLetters.ts
import { useEffect, useState, useCallback } from 'react';
import { newsLettersService, NewsLetter } from '@/services/newsLetters.service';

interface UseNewsLettersReturn {
  newsLetters: NewsLetter[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNewsLetters = (options?: {
  perPage?: number;
  page?: number;
  autoFetch?: boolean;
}): UseNewsLettersReturn => {
  const [newsLetters, setNewsLetters] = useState<NewsLetter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsLetters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await newsLettersService.getActiveNewsLetters({
        perPage: options?.perPage || 20,
        page: options?.page || 1,
      });
      
      setNewsLetters(data);
      
    } catch (err: any) {
      console.error('Error fetching news letters:', err);
      setError(err?.message || 'فشل في تحميل الأخبار');
      setNewsLetters([]);
    } finally {
      setLoading(false);
    }
  }, [options?.perPage, options?.page]);

  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchNewsLetters();
    }
  }, [fetchNewsLetters, options?.autoFetch]);

  return {
    newsLetters,
    loading,
    error,
    refetch: fetchNewsLetters,
  };
};

// Hook لجلب خبر واحد بالـ ID
export const useNewsLetterById = (id: number) => {
  const [newsLetter, setNewsLetter] = useState<NewsLetter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsLetter = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await newsLettersService.getNewsLetterById(id);
        setNewsLetter(data);
        
      } catch (err: any) {
        console.error('Error fetching news letter:', err);
        setError(err?.message || 'فشل في تحميل الخبر');
        setNewsLetter(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsLetter();
    }
  }, [id]);

  return {
    newsLetter,
    loading,
    error,
  };
};