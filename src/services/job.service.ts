/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/job.service.ts
import api from '@/lib/api';
import { BaseService } from './base.service';

export interface JobApplication {
  id?: number;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  job_title: string;
  cv: number; // ID الملف المرفوع
}

export interface JobApplicationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class JobService extends BaseService<any> {
  constructor() {
    super('job');
  }

  // تقديم طلب وظيفة
  async submitApplication(data: JobApplication): Promise<JobApplicationResponse> {
    try {
      const response = await api.post('/job', data);
      return {
        success: true,
        message: response.data?.message || 'تم تقديم طلبك بنجاح',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error submitting job application:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'فشل في تقديم الطلب',
        data: error?.response?.data,
      };
    }
  }
}

export const jobService = new JobService();