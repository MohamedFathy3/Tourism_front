/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/admin/base.admin.service.ts
import api from '@/lib/api';
import { ApiListResponse, ApiResponse } from '@/types/admin';

export interface FilterParams {
  [key: string]: any;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  filters?: FilterParams;
  orderBy?: string;
  orderByDirection?: 'asc' | 'desc';
  delete?: boolean;
}

/**
 * 🔥 Base Admin Service - يطبق Design Pattern Factory Method
 */
export abstract class BaseAdminService<T, CreateDto = any, UpdateDto = any> {
  protected abstract endpoint: string;
  protected abstract resourceName: string;

  /**
   * 📥 جلب كل البيانات مع Pagination و Filtering
   */
  async getAll(params: PaginationParams = {}): Promise<ApiListResponse<T>> {
    const response = await api.post(`/${this.endpoint}/index`, {
      filters: params.filters || {},
      orderBy: params.orderBy || 'id',
      orderByDirection: params.orderByDirection || 'desc',
      perPage: params.perPage || 10,
      paginate: true,
      delete: params.delete || false,
      ...(params.page && { page: params.page }),
    });
    return response.data;
  }

  /**
   * 📥 جلب عنصر واحد بالـ ID (GET)
   */
  async getById(id: number): Promise<ApiResponse<T>> {
    const response = await api.get(`/${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * ➕ إنشاء عنصر جديد (POST)
   */
  async create(data: CreateDto): Promise<ApiResponse<T>> {
    const response = await api.post(`/${this.endpoint}`, data);
    return response.data;
  }

  /**
   * ✏️ تحديث عنصر (PUT)
   */
  async update(id: number, data: UpdateDto): Promise<ApiResponse<T>> {
    const response = await api.put(`/${this.endpoint}/${id}`, data);
    return response.data;
  }

  /**
   * 🗑️ حذف عنصر (POST - Soft Delete)
   */
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/${this.endpoint}/delete`, {
      data:{ items: [id],}
    });
    return {
      success: response.data.status === 200,
      message: response.data.message || `${this.resourceName} deleted successfully`,
    };
  }

  /**
   * 🗑️ حذف عدة عناصر (POST)
   */
  async deleteMultiple(ids: number[]): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/${this.endpoint}/delete`, {
      data:{ items: [ids],}
    });
    return {
      success: response.data.status === 200,
      message: response.data.message || `${this.resourceName}s deleted successfully`,
    };
  }

  /**
   * 🔄 تغيير حالة العنصر (تفعيل/إلغاء تفعيل)
   */
  async toggleStatus(id: number, active: boolean): Promise<ApiResponse<T>> {
    return this.update(id, { active } as any);
  }
}