// src/services/slider.service.ts
import { BaseService } from './base.service';

export interface SliderImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

export interface Slider {
  id: number;
  title: string;
  description: string;
  active: boolean;
  imageUrl: string;
  image: SliderImage;
}

export class SliderService extends BaseService<Slider> {
  constructor() {
    super('slider');
  }

  // جلب السلايدرات النشطة فقط
  async getActiveSliders(params?: {
    perPage?: number;
    page?: number;
  }): Promise<Slider[]> {
    const response = await this.getAll({
      filters: { active: true },
      perPage: params?.perPage || 20,
      page: params?.page || 1,
      paginate: true,
    });

    return response.data || [];
  }

  // جلب أول سلايدر نشط للـ Hero
  async getHeroSlider(): Promise<Slider | null> {
    const sliders = await this.getActiveSliders({ perPage: 20 });
    return sliders.length > 0 ? sliders[0] : null;
  }
}

export const sliderService = new SliderService();