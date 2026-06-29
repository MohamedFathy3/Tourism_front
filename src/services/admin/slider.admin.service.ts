// src/services/admin/slider.admin.service.ts
import { BaseAdminService } from './base.admin.service';
import { SliderType, SliderFormData } from '@/types/admin';

export class SliderAdminService extends BaseAdminService<SliderType, SliderFormData, SliderFormData> {
  protected endpoint = 'slider';
  protected resourceName = 'Slider';

  // 🔥 أي دوال خاصة بالسلايدر فقط
  async getActiveSliders(params?: { perPage?: number }): Promise<SliderType[]> {
    const response = await this.getAll({
      filters: { active: true },
      perPage: params?.perPage || 20,
    });
    return response.data || [];
  }
}

export const sliderAdminService = new SliderAdminService();