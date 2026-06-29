// src/services/admin/newsletter.admin.service.ts
import { BaseAdminService } from './base.admin.service';
import { NewsletterType, NewsletterFormData } from '@/types/admin';

export class NewsletterAdminService extends BaseAdminService<NewsletterType, NewsletterFormData, NewsletterFormData> {
  protected endpoint = 'knews-letters';
  protected resourceName = 'Newsletter';
}

export const newsletterAdminService = new NewsletterAdminService();