/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useServices.ts
import { useEffect, useState, useCallback } from 'react';
import { serviceService, Service } from '@/services/service.service';

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useServices = (options?: {
  perPage?: number;
  page?: number;
  autoFetch?: boolean;
}): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await serviceService.getActiveServices({
        perPage: options?.perPage || 20,
        page: options?.page || 1,
      });
      
      setServices(data);
      
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err?.message || 'فشل في تحميل الخدمات');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [options?.perPage, options?.page]);

  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchServices();
    }
  }, [fetchServices, options?.autoFetch]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
};

// Hook لجلب خدمة واحدة بالـ ID
export const useServiceById = (id: number) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await serviceService.getServiceById(id);
        setService(data);
        
      } catch (err: any) {
        console.error('Error fetching service:', err);
        setError(err?.message || 'فشل في تحميل الخدمة');
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  return {
    service,
    loading,
    error,
  };
};