// src/hooks/useCompany.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { companyService, Company, CompanyImage } from '@/services/company.service';

interface UseCompanyOptions {
  perPage?: number;
  page?: number;
  autoFetch?: boolean;
}

interface UseCompanyReturn {
  companies: Company[]; // 🔥 مصفوفة دلوقتي
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// 🔥 Hook بيرجع مصفوفة من الشركات
export const useCompany = (options?: UseCompanyOptions): UseCompanyReturn => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🔥 استخدم getCompanies عشان تجيب مصفوفة
      const data = await companyService.getCompanies({
        perPage: options?.perPage || 10,
        page: options?.page || 1,
      });
      
      setCompanies(data);
      
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      setError(err?.message || 'فشل في تحميل بيانات الشركات');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [options?.perPage, options?.page]);

  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchCompanies();
    }
  }, [fetchCompanies, options?.autoFetch]);

  return {
    companies, // 🔥 مصفوفة
    loading,
    error,
    refetch: fetchCompanies,
  };
};

// Hook لجلب شركة محددة بالـ ID
export const useCompanyById = (id: number) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await companyService.getCompanyById(id);
        setCompany(data);
        
      } catch (err: any) {
        console.error('Error fetching company:', err);
        setError(err?.message || 'فشل في تحميل بيانات الشركة');
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  return {
    company,
    loading,
    error,
  };
};