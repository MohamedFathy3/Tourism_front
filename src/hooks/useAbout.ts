/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAbout.ts
import { useEffect, useState, useCallback } from 'react';
import { aboutService, About } from '@/services/about.service';

interface UseAboutReturn {
  about: About | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAbout = (): UseAboutReturn => {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await aboutService.getAbout();
      setAbout(data);
      
    } catch (err: any) {
      console.error('Error fetching about data:', err);
      setError(err?.message || 'فشل في تحميل بيانات عن الشركة');
      setAbout(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  return {
    about,
    loading,
    error,
    refetch: fetchAbout,
  };
};

// Hook لجلب كل بيانات About (لو في أكثر من واحدة)
export const useAllAbout = (options?: {
  perPage?: number;
  page?: number;
  autoFetch?: boolean;
}) => {
  const [aboutList, setAboutList] = useState<About[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllAbout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await aboutService.getAllAbout({
        perPage: options?.perPage || 10,
        page: options?.page || 1,
      });
      
      setAboutList(data);
    } catch (err: any) {
      console.error('Error fetching about list:', err);
      setError(err?.message || 'فشل في تحميل بيانات عن الشركة');
      setAboutList([]);
    } finally {
      setLoading(false);
    }
  }, [options?.perPage, options?.page]);

  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchAllAbout();
    }
  }, [fetchAllAbout, options?.autoFetch]);

  return {
    aboutList,
    loading,
    error,
    refetch: fetchAllAbout,
  };
};