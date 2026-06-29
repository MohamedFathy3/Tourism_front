// src/services/admin/job.admin.service.ts
import { BaseAdminService } from './base.admin.service';
import { JobApplicationType, JobApplicationFormData } from '@/types/admin';

export class JobAdminService extends BaseAdminService<JobApplicationType, JobApplicationFormData, JobApplicationFormData> {
  protected endpoint = 'job';
  protected resourceName = 'Job';
}

export const jobAdminService = new JobAdminService();