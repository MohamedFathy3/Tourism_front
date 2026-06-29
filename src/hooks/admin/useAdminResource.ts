/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/admin/useAdminResource.ts
import { useState, useEffect, useCallback } from 'react';
import { BaseAdminService, PaginationParams } from '@/services/admin/base.admin.service';
import { toast } from '@/hooks/use-toast';

interface UseAdminResourceOptions {
  perPage?: number;
  initialPage?: number;
  initialFilters?: Record<string, any>;
  autoFetch?: boolean;
  orderBy?: string;
  orderByDirection?: 'asc' | 'desc';
}

interface UseAdminResourceReturn<T> {
  // Data
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  
  // Status
  loading: boolean;
  error: string | null;
  
  // Filters
  filters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  applyFilters: (filters: Record<string, any>) => void;
  
  // Actions
  fetchData: (params?: Partial<PaginationParams>) => Promise<void>;
  createItem: (data: any) => Promise<T>;
  updateItem: (id: number, data: any) => Promise<T>;
  deleteItem: (id: number) => Promise<void>;
  deleteMultiple: (ids: number[]) => Promise<void>;
  toggleStatus: (id: number, active: boolean) => Promise<T>;
  goToPage: (page: number) => void;
  refresh: () => Promise<void>;
  changePerPage: (perPage: number) => void;
}

/**
 * 🔥 Generic Hook لإدارة أي Resource في الـ Admin
 * مع دعم Filtering و Pagination
 */
export function useAdminResource<T>(
  service: BaseAdminService<T, any, any>,
  options: UseAdminResourceOptions = {}
): UseAdminResourceReturn<T> {
  const {
    perPage: defaultPerPage = 10,
    initialPage = 1,
    initialFilters = {},
    autoFetch = true,
    orderBy = 'id',
    orderByDirection = 'desc',
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📥 جلب البيانات مع الفلاتر والـ Pagination
  const fetchData = useCallback(async (params?: Partial<PaginationParams>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await service.getAll({
        page: params?.page || currentPage,
        perPage: params?.perPage || perPage,
        filters: params?.filters || filters,
        orderBy: params?.orderBy || orderBy,
        orderByDirection: params?.orderByDirection || orderByDirection,
        delete: params?.delete || false,
      });
      
      setData(response.data || []);
      setTotal(response.meta?.total || 0);
      setCurrentPage(response.meta?.current_page || currentPage);
      setTotalPages(response.meta?.last_page || 1);
      
    } catch (err: any) {
      setError(err?.message || 'فشل في تحميل البيانات');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [service, currentPage, perPage, filters, orderBy, orderByDirection]);

  // 🔍 تعيين فلتر
  const setFilter = useCallback((key: string, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // حذف الفلتر لو القيمة فاضية
      if (value === '' || value === null || value === undefined) {
        delete newFilters[key];
      }
      return newFilters;
    });
  }, []);

  // 🧹 مسح الفلاتر
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // 📋 تطبيق فلاتر جديدة
  const applyFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
  }, []);

  // 📄 تغيير عدد العناصر في الصفحة
  const changePerPage = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // ارجع للصفحة الأولى
  }, []);

  // 📄 الانتقال لصفحة معينة
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  // ➕ إنشاء عنصر جديد
  const createItem = useCallback(async (formData: any): Promise<T> => {
    try {
      setLoading(true);
      const response = await service.create(formData);
      
      toast({
        title: '✅ تم الإضافة',
        description: 'تم إضافة العنصر بنجاح',
      });
      
      await fetchData();
      return response.data;
      
    } catch (err: any) {
      toast({
        title: '❌ خطأ',
        description: err?.message || 'فشل في الإضافة',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, fetchData]);

  // ✏️ تحديث عنصر
  const updateItem = useCallback(async (id: number, formData: any): Promise<T> => {
    try {
      setLoading(true);
      const response = await service.update(id, formData);
      
      toast({
        title: '✅ تم التحديث',
        description: 'تم تحديث العنصر بنجاح',
      });
      
      await fetchData();
      return response.data;
      
    } catch (err: any) {
      toast({
        title: '❌ خطأ',
        description: err?.message || 'فشل في التحديث',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, fetchData]);

  // 🗑️ حذف عنصر
  const deleteItem = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await service.delete(id);
      
      toast({
        title: '✅ تم الحذف',
        description: 'تم حذف العنصر بنجاح',
      });
      
      await fetchData();
      
    } catch (err: any) {
      toast({
        title: '❌ خطأ',
        description: err?.message || 'فشل في الحذف',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, fetchData]);

  // 🗑️ حذف عدة عناصر
  const deleteMultiple = useCallback(async (ids: number[]): Promise<void> => {
    try {
      setLoading(true);
      await service.deleteMultiple(ids);
      
      toast({
        title: '✅ تم الحذف',
        description: 'تم حذف العناصر بنجاح',
      });
      
      await fetchData();
      
    } catch (err: any) {
      toast({
        title: '❌ خطأ',
        description: err?.message || 'فشل في حذف العناصر',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, fetchData]);

  // 🔄 تغيير حالة العنصر
  const toggleStatus = useCallback(async (id: number, active: boolean): Promise<T> => {
    try {
      setLoading(true);
      const response = await service.toggleStatus(id, active);
      
      toast({
        title: '✅ تم التحديث',
        description: active ? 'تم تفعيل العنصر' : 'تم إلغاء تفعيل العنصر',
      });
      
      await fetchData();
      return response.data;
      
    } catch (err: any) {
      toast({
        title: '❌ خطأ',
        description: err?.message || 'فشل في تغيير الحالة',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, fetchData]);

  // 🔄 تحديث البيانات
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // 🚀 تحميل البيانات عند تغيير الصفحة أو الفلاتر
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [currentPage, perPage, filters]);

  return {
    data,
    total,
    currentPage,
    totalPages,
    perPage,
    loading,
    error,
    filters,
    setFilter,
    clearFilters,
    applyFilters,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    deleteMultiple,
    toggleStatus,
    goToPage,
    refresh,
    changePerPage,
  };
}