// src/services/admin/company.admin.service.ts
import { BaseAdminService } from './base.admin.service';
import { CompanyType, CompanyFormData } from '@/types/admin';

export class CompanyAdminService extends BaseAdminService<CompanyType, CompanyFormData, CompanyFormData> {
  protected endpoint = 'company';
  protected resourceName = 'Company';
}

export const companyAdminService = new CompanyAdminService();