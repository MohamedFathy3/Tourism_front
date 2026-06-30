// src/services/about.service.ts
import { BaseService } from './base.service';

export interface AboutImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

export interface About {
  id: number;
  title: string;
  description: string;
  long_description: string;
  imageUrl: string;
  image: AboutImage;
}

export class AboutService extends BaseService<About> {
  constructor() {
    super('about');
  }

  // جلب بيانات About الأولى (عادة تكون واحدة)
  async getAbout(): Promise<About | null> {
    const response = await this.getAll({
      perPage: 1,
      page: 1,
      paginate: true,
      filters: {},
    });

    const data = response.data || [];
    return data.length > 0 ? data[0] : null;
  }

  // جلب كل بيانات About (لو في أكثر من واحدة)
  async getAllAbout(params?: {
    perPage?: number;
    page?: number;
  }): Promise<About[]> {
    const response = await this.getAll({
      perPage: params?.perPage || 10,
      page: params?.page || 1,
      paginate: true,
       filters: { active: true },
    });

    return response.data || [];
  }
}

export const aboutService = new AboutService();