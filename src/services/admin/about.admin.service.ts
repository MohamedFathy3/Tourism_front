// src/services/admin/about.admin.service.ts
import { BaseAdminService } from './base.admin.service';
import { AboutType, AboutFormData } from '@/types/admin';

export class AboutAdminService extends BaseAdminService<AboutType, AboutFormData, AboutFormData> {
  protected endpoint = 'about';
  protected resourceName = 'About';
}

export const aboutAdminService = new AboutAdminService();