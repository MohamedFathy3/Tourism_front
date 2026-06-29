// src/services/company.service.ts
import { BaseService } from './base.service';

export interface CompanyImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

export interface Company {
  id: number;
  title: string;
  long_description: string;
  active: boolean;
  imageUrl: string;
  image: CompanyImage;
  sliderImageUrl: string;
  sliderImage: CompanyImage;
  gallery: CompanyImage[];
  location?: string;
}

export class CompanyService extends BaseService<Company> {
  constructor() {
    super('company');
  }

  // 🔥 جلب كل الشركات (مصفوفة)
  async getCompanies(params?: {
    perPage?: number;
    page?: number;
  }): Promise<Company[]> {
    const response = await this.getAll({
      perPage: params?.perPage || 10,
      page: params?.page || 1,
      paginate: true,
      filters: { active: true },
    });

    return response.data || [];
  }

  // جلب شركة محددة بالـ ID
  async getCompanyById(id: number): Promise<Company | null> {
    try {
      const company = await this.getById(id);
      return company;
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      return null;
    }
  }
}

export const companyService = new CompanyService();