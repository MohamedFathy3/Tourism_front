// src/services/admin/project.admin.service.ts
import { BaseAdminService } from './base.admin.service';
import { ProjectType, ProjectFormData } from '@/types/admin';

export class ProjectAdminService extends BaseAdminService<ProjectType, ProjectFormData, ProjectFormData> {
  protected endpoint = 'service';
  protected resourceName = 'service';
}

export const projectAdminService = new ProjectAdminService();