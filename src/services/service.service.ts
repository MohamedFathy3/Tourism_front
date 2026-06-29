// src/services/service.service.ts
import { BaseService } from './base.service';

export interface ServiceImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

export interface Service {
  id: number;
  title: string;
  location: string;
  description: string;
  active: boolean;
  imageUrl: string;
  image: ServiceImage;
  sliderImageUrl: string;
  sliderImage: ServiceImage;
  gallery: ServiceImage[];
}

export class ServiceService extends BaseService<Service> {
  constructor() {
    super('service');
  }

  // جلب الخدمات النشطة
  async getActiveServices(params?: {
    perPage?: number;
    page?: number;
  }): Promise<Service[]> {
    const response = await this.getAll({
      filters: { active: true },
      perPage: params?.perPage || 20,
      page: params?.page || 1,
      paginate: true,
      orderBy: 'position',
      orderByDirection: 'asc',
    });

    return response.data || [];
  }

  // جلب خدمة واحدة بالـ ID
  async getServiceById(id: number): Promise<Service | null> {
    try {
      const service = await this.getById(id);
      return service;
    } catch (error) {
      console.error('Error fetching service by ID:', error);
      return null;
    }
  }
}

export const serviceService = new ServiceService();