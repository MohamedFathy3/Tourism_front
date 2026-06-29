// src/services/admin/contact.admin.service.ts
import { BaseAdminService } from './base.admin.service';
import { ContactType, ContactFormData } from '@/types/admin';

export class ContactAdminService extends BaseAdminService<ContactType, ContactFormData, ContactFormData> {
  protected endpoint = 'page-contact-us';
  protected resourceName = 'Contact';
}

export const contactAdminService = new ContactAdminService();