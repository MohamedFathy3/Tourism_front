// src/services/admin/profile.admin.service.ts
import { BaseAdminService } from './base.admin.service';
import { ProfileType, ProfileFormData } from '@/types/admin';

export class ProfileAdminService extends BaseAdminService<ProfileType, ProfileFormData, ProfileFormData> {
  protected endpoint = 'expo-company';
  protected resourceName = 'Profile';
}

export const profileAdminService = new ProfileAdminService();