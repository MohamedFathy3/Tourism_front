/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/contact.service.ts
import { BaseService } from './base.service';
import api from '@/lib/api';

export interface ContactImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

export interface ContactData {
  id: number;
  phone_one: string;
  phone_two: string;
  work_hours: string;
  email: string;
  active: boolean;
  imageUrl: string;
  image: ContactImage;
}

export interface ContactPageResponse {
  data: ContactData[];
  links: any;
  meta: any;
  result: string;
  message: string;
  status: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  subject: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class ContactService extends BaseService<ContactData> {
  constructor() {
    super('page-contact-us');
  }

  // جلب بيانات صفحة الاتصال
  async getContactPage(): Promise<ContactPageResponse | null> {
    try {
      const response = await api.post('/page-contact-us/index', {
     filters: { active: true },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching contact page:', error);
      return null;
    }
  }

  // إرسال نموذج الاتصال
  async sendContactForm(data: ContactFormData): Promise<ContactFormResponse> {
    try {
      const response = await api.post('/contact-us-public', data);
      return {
        success: true,
        message: response.data?.message || 'تم إرسال رسالتك بنجاح',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error sending contact form:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'فشل في إرسال الرسالة',
        data: error?.response?.data,
      };
    }
  }
}

export const contactService = new ContactService();