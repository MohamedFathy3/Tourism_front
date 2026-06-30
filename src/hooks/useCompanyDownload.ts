/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useCompanyDownload.ts

import { useEffect, useState, useCallback } from 'react';
import { companyService, Company } from '@/services/companyprofile.service';

interface UseCompanyDownloadReturn {
  company: Company | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCompanyDownload = (): UseCompanyDownloadReturn => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🔥 جلب أول شركة من profile-company
      const companies = await companyService.getCompanies({
        perPage: 1,
        page: 1,
      });
      
      if (companies && companies.length > 0) {
        setCompany(companies[0]);
      } else {
        setCompany(null);
        setError('No company data found');
      }
      
    } catch (err: any) {
      console.error('Error fetching company:', err);
      setError(err?.message || 'فشل في تحميل بيانات الشركة');
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return {
    company,
    loading,
    error,
    refetch: fetchCompany,
  };
};