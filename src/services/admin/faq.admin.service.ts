// src/services/admin/faq.admin.service.ts
import { BaseAdminService } from './base.admin.service';

// نوع البيانات
export interface FAQType {
  id: number;
  name: string;      // السؤال
  des: string;       // الإجابة
  active: boolean;
  deleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// نوع بيانات النموذج
export interface FAQFormData {
  name: string;
  des: string;
  active?: boolean;
}

export class FAQAdminService extends BaseAdminService<FAQType, FAQFormData, FAQFormData> {
  protected endpoint = 'faq';
  protected resourceName = 'FAQ';
}

export const faqAdminService = new FAQAdminService();