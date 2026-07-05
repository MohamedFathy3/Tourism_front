/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/admin/contact-message.admin.service.ts
import { BaseAdminService } from './base.admin.service';
import api from '@/lib/api';

// نوع بيانات الرسالة - مطابق للـ API Response
export interface ContactMessageType {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  subject: string;
  message: string;
  deleted: boolean;
  deletedAt: string | null;
  sentSince: string;
  createdAt: string;
  updatedAt: string;
}

// نوع بيانات النموذج (للقراءة فقط)
export interface ContactMessageFormData {
  // لا يوجد editable fields - للقراءة فقط
}

export class ContactMessageAdminService extends BaseAdminService<ContactMessageType, ContactMessageFormData, ContactMessageFormData> {
  protected endpoint = 'contactus';
  protected resourceName = 'Contact Message';

  // ✅ Override للـ getAll - نستخدم POST مع body
  async getAll(params: any = {}): Promise<any> {
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

  // ✅ قراءة فقط - ممنوع الإضافة
  async create(data: any): Promise<any> {
    throw new Error('Cannot create contact messages from admin');
  }

  // ✅ قراءة فقط - ممنوع التعديل
  async update(id: number, data: any): Promise<any> {
    throw new Error('Cannot update contact messages from admin');
  }

  // ✅ حذف رسالة واحدة
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/${this.endpoint}/${id}`);
    return {
      success: response.data.status === 200,
      message: response.data.message || 'Message deleted successfully',
    };
  }

  // ✅ حذف عدة رسائل
  async deleteMultiple(ids: number[]): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/${this.endpoint}/delete`, {
      data: { items: ids }
    });
    return {
      success: response.data.status === 200,
      message: response.data.message || 'Messages deleted successfully',
    };
  }
}

export const contactMessageAdminService = new ContactMessageAdminService();