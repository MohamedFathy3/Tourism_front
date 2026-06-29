// src/services/newsLetters.service.ts
import { BaseService } from './base.service';

export interface NewsLetterImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

export interface NewsLetter {
  id: number;
  title: string;
  description: string;
  active: boolean;
  imageUrl: string;
  image: NewsLetterImage;
  sliderImageUrl: string;
  sliderImage: NewsLetterImage;
}

export class NewsLettersService extends BaseService<NewsLetter> {
  constructor() {
    super('knews-letters');
  }

  // جلب الأخبار النشطة
  async getActiveNewsLetters(params?: {
    perPage?: number;
    page?: number;
  }): Promise<NewsLetter[]> {
    const response = await this.getAll({
      filters: { active: true },
      perPage: params?.perPage || 20,
      page: params?.page || 1,
      paginate: true,
      orderBy: 'id',
      orderByDirection: 'desc',
    });

    return response.data || [];
  }

  // جلب خبر واحد بالـ ID
  async getNewsLetterById(id: number): Promise<NewsLetter | null> {
    try {
      const news = await this.getById(id);
      return news;
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      return null;
    }
  }
}

export const newsLettersService = new NewsLettersService();