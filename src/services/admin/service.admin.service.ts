// src/services/admin/service.admin.service.ts
import { BaseAdminService } from './base.admin.service';
import { ServiceType, ServiceFormData } from '@/types/admin';

export class ServiceAdminService extends BaseAdminService<ServiceType, ServiceFormData, ServiceFormData> {
  protected endpoint = 'service';
  protected resourceName = 'Service';
}

export const serviceAdminService = new ServiceAdminService();