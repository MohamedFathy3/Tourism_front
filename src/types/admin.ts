// src/types/admin.ts

// ============================================
// 🔥 أنواع الاستجابة العامة من API
// ============================================

export interface ApiResponse<T = any> {
  data: T;
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    links: any[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  result: string;
  message: string;
  status: number;
}
export interface ProfileType {
  id: number;
  title: string;
  subTitle: string; // 👈 أضف هذا
  active: boolean;
  linkDrive: string; // 👈 أضف هذا
  imageUrl: string;
  image: ImageType;
}

export interface ProfileFormData {
  title: string;
  subTitle: string; // 👈 أضف هذا
  active: boolean;
  linkDrive: string; // 👈 أضف هذا
  image: number | null;
}

export interface ProfileResponse extends ApiResponse<ProfileType> {}
export interface ProfileListResponse extends ApiListResponse<ProfileType> {}
export interface ApiListResponse<T = any> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: any[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  result: string;
  message: string;
  status: number;
}

// ============================================
// 🔥 أنواع الصور
// ============================================

export interface ImageType {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

// ============================================
// 🔥 1. SLIDER (السلايدر)
// ============================================

export interface SliderType {
  id: number;
  title: string;
  description: string;
  active: boolean;
  imageUrl: string;
  image: ImageType;
}

export interface SliderFormData {
  title: string;
  description: string;
  active: boolean;
  image: number | null; // file ID
}

export interface SliderResponse extends ApiResponse<SliderType> {}
export interface SliderListResponse extends ApiListResponse<SliderType> {}

// ============================================
// 🔥 2. ABOUT (من نحن)
// ============================================

export interface AboutType {
  id: number;
  title: string;
  description: string;
  long_description: string;
  imageUrl: string;
  image: ImageType;
}

export interface AboutFormData {
  title: string;
  description: string;
  long_description: string;
  image: number | null;
}

export interface AboutResponse extends ApiResponse<AboutType> {}
export interface AboutListResponse extends ApiListResponse<AboutType> {}

// ============================================
// 🔥 3. COMPANY (الشركة)
// ============================================

export interface CompanyType {
  id: number;
  title: string;
  long_description: string;
  active: boolean;
  imageUrl: string;
  image: ImageType;
  sliderImageUrl: string;
  sliderImage: ImageType;
  gallery: ImageType[];
}

export interface CompanyFormData {
  title: string;
  long_description: string;
  active: boolean;
  image: number | null;
  sliderImage: number | null;
  gallery: number[];
}

export interface CompanyResponse extends ApiResponse<CompanyType> {}
export interface CompanyListResponse extends ApiListResponse<CompanyType> {}

// ============================================
// 🔥 4. PROJECT (المشروع)
// ============================================

export interface ProjectType {
  id: number;
  title: string;
  description: string;
  long_description: string;
  location: string;
  active: boolean;
  imageUrl: string;
  image: ImageType;
  gallery: ImageType[];
}

export interface ProjectFormData {
  title: string;
  description: string;
  long_description: string;
  location: string;
  active: boolean;
  image: number | null;
  gallery: number[];
}

export interface ProjectResponse extends ApiResponse<ProjectType> {}
export interface ProjectListResponse extends ApiListResponse<ProjectType> {}

// ============================================
// 🔥 5. SERVICE (الخدمة)
// ============================================

export interface ServiceType {
  id: number;
  title: string;
  description: string;
  long_description: string;
  location: string;
  active: boolean;
  imageUrl: string;
  image: ImageType;
  gallery: ImageType[];
}

export interface ServiceFormData {
  title: string;
  description: string;
  long_description: string;
  location: string;
  active: boolean;
  image: number | null;
  gallery: number[];
}

export interface ServiceResponse extends ApiResponse<ServiceType> {}
export interface ServiceListResponse extends ApiListResponse<ServiceType> {}

// ============================================
// 🔥 6. CONTACT (بيانات التواصل)
// ============================================

export interface ContactType {
  id: number;
  phone_one: string;
  phone_two: string;
  work_hours: string;
  email: string;
  active: boolean;
  imageUrl: string;
  image: ImageType;
}

export interface ContactFormData {
  phone_one: string;
  phone_two: string;
  work_hours: string;
  email: string;
  active: boolean;
  image: number | null;
}

export interface ContactResponse extends ApiResponse<ContactType> {}
export interface ContactListResponse extends ApiListResponse<ContactType> {}

// ============================================
// 🔥 7. CONTACT MESSAGE (رسائل التواصل)
// ============================================

export interface ContactMessageType {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  subject: string;
  message: string;
  deleted: boolean;
  deletedAt: string | null;
  sentSince: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageListResponse extends ApiListResponse<ContactMessageType> {}

// ============================================
// 🔥 8. JOB APPLICATION (طلبات الوظائف)
// ============================================

export interface JobApplicationType {
  id: number;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  job_title: string;
  cv: ImageType;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicationFormData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  job_title: string;
  cv: number | null;
}

export interface JobApplicationListResponse extends ApiListResponse<JobApplicationType> {}
export interface JobApplicationResponse extends ApiResponse<JobApplicationType> {}

// ============================================
// 🔥 9. NEWSLETTER (النشرة البريدية)
// ============================================

export interface NewsletterType {
  id: number;
  title: string;
  content: string;
  active: boolean;
  imageUrl: string;
  image: ImageType;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterFormData {
  title: string;
  content: string;
  active: boolean;
  image: number | null;
}

export interface NewsletterListResponse extends ApiListResponse<NewsletterType> {}
export interface NewsletterResponse extends ApiResponse<NewsletterType> {}

// ============================================
// 🔥 10. USER (المستخدم)
// ============================================

export interface UserType {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'editor' | 'user';
}

export interface UserListResponse extends ApiListResponse<UserType> {}
export interface UserResponse extends ApiResponse<UserType> {}

// ============================================
// 🔥 11. STATS (الإحصائيات)
// ============================================

export interface StatsType {
  total_users: number;
  total_projects: number;
  total_services: number;
  total_messages: number;
  total_jobs: number;
  total_newsletters: number;
  active_sliders: number;
}

export interface StatsResponse extends ApiResponse<StatsType> {}

// ============================================
// 🔥 أنواع مفيدة للـ Forms
// ============================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'select' | 'file' | 'toggle' | 'gallery';
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  rows?: number;
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

// ============================================
// 🔥 مابينج الـ Forms حسب النوع
// ============================================

export const FormConfigs = {
  slider: {
    title: 'السلايدر',
    sections: [
      {
        title: 'معلومات السلايدر',
        fields: [
          { name: 'title', label: 'العنوان', type: 'text', required: true },
          { name: 'description', label: 'الوصف', type: 'textarea', required: true, rows: 3 },
          { name: 'active', label: 'نشط', type: 'toggle' },
          { name: 'image', label: 'الصورة', type: 'file', required: true },
        ]
      }
    ]
  },
  about: {
    title: 'من نحن',
    sections: [
      {
        title: 'معلومات الصفحة',
        fields: [
          { name: 'title', label: 'العنوان', type: 'text', required: true },
          { name: 'description', label: 'الوصف المختصر', type: 'textarea', required: true, rows: 3 },
          { name: 'long_description', label: 'الوصف التفصيلي', type: 'textarea', required: true, rows: 6 },
          { name: 'image', label: 'الصورة', type: 'file', required: true },
        ]
      }
    ]
  },
  company: {
    title: 'الشركة',
    sections: [
      {
        title: 'المعلومات الأساسية',
        fields: [
          { name: 'title', label: 'اسم الشركة', type: 'text', required: true },
          { name: 'description', label: 'الوصف المختصر', type: 'textarea', required: true, rows: 3 },
          { name: 'long_description', label: 'الوصف التفصيلي', type: 'textarea', required: true, rows: 6 },
          { name: 'location', label: 'الموقع', type: 'text', required: true },
          { name: 'founded', label: 'سنة التأسيس', type: 'text' },
          { name: 'website', label: 'الموقع الإلكتروني', type: 'text' },
          { name: 'email', label: 'البريد الإلكتروني', type: 'email' },
          { name: 'phone', label: 'الهاتف', type: 'phone' },
          { name: 'teamSize', label: 'حجم الفريق', type: 'text' },
          { name: 'type', label: 'نوع الشركة', type: 'text' },
          { name: 'status', label: 'الحالة', type: 'text' },
          { name: 'active', label: 'نشط', type: 'toggle' },
          { name: 'image', label: 'الصورة الرئيسية', type: 'file' },
          { name: 'gallery', label: 'معرض الصور', type: 'gallery' },
        ]
      }
    ]
  },
  project: {
    title: 'المشروع',
    sections: [
      {
        title: 'معلومات المشروع',
        fields: [
          { name: 'title', label: 'العنوان', type: 'text', required: true },
          { name: 'description', label: 'الوصف المختصر', type: 'textarea', required: true, rows: 3 },
          { name: 'long_description', label: 'الوصف التفصيلي', type: 'textarea', required: true, rows: 6 },
          { name: 'location', label: 'الموقع', type: 'text', required: true },
          { name: 'active', label: 'نشط', type: 'toggle' },
          { name: 'image', label: 'الصورة الرئيسية', type: 'file', required: true },
          { name: 'gallery', label: 'معرض الصور', type: 'gallery' },
        ]
      }
    ]
  },
  service: {
    title: 'الخدمة',
    sections: [
      {
        title: 'معلومات الخدمة',
        fields: [
          { name: 'title', label: 'العنوان', type: 'text', required: true },
          { name: 'description', label: 'الوصف المختصر', type: 'textarea', required: true, rows: 3 },
          { name: 'long_description', label: 'الوصف التفصيلي', type: 'textarea', required: true, rows: 6 },
          { name: 'location', label: 'الموقع', type: 'text', required: true },
          { name: 'active', label: 'نشط', type: 'toggle' },
          { name: 'image', label: 'الصورة الرئيسية', type: 'file', required: true },
          { name: 'gallery', label: 'معرض الصور', type: 'gallery' },
        ]
      }
    ]
  },
  contact: {
    title: 'بيانات التواصل',
    sections: [
      {
        title: 'معلومات التواصل',
        fields: [
          { name: 'phone_one', label: 'الهاتف الأول', type: 'phone', required: true },
          { name: 'phone_two', label: 'الهاتف الثاني', type: 'phone' },
          { name: 'work_hours', label: 'ساعات العمل', type: 'text', required: true },
          { name: 'email', label: 'البريد الإلكتروني', type: 'email', required: true },
          { name: 'active', label: 'نشط', type: 'toggle' },
          { name: 'image', label: 'الصورة', type: 'file' },
        ]
      }
    ]
  },
  newsletter: {
    title: 'النشرة البريدية',
    sections: [
      {
        title: 'معلومات النشرة',
        fields: [
          { name: 'title', label: 'العنوان', type: 'text', required: true },
          { name: 'content', label: 'المحتوى', type: 'textarea', required: true, rows: 8 },
          { name: 'active', label: 'نشط', type: 'toggle' },
          { name: 'image', label: 'الصورة', type: 'file' },
        ]
      }
    ]
  },
  job: {
    title: 'الوظيفة',
    sections: [
      {
        title: 'معلومات الوظيفة',
        fields: [
          { name: 'name', label: 'الاسم', type: 'text', required: true },
          { name: 'email', label: 'البريد الإلكتروني', type: 'email', required: true },
          { name: 'phone', label: 'الهاتف', type: 'phone', required: true },
          { name: 'linkedin', label: 'رابط LinkedIn', type: 'text' },
          { name: 'job_title', label: 'المسمى الوظيفي', type: 'text', required: true },
          { name: 'cv', label: 'السيرة الذاتية', type: 'file', required: true },
        ]
      }
    ]
  },
  user: {
    title: 'المستخدم',
    sections: [
      {
        title: 'معلومات المستخدم',
        fields: [
          { name: 'name', label: 'الاسم', type: 'text', required: true },
          { name: 'email', label: 'البريد الإلكتروني', type: 'email', required: true },
          { name: 'password', label: 'كلمة المرور', type: 'text' },
          { name: 'role', label: 'الدور', type: 'select', required: true, options: [
            { value: 'admin', label: 'مدير' },
            { value: 'editor', label: 'محرر' },
            { value: 'user', label: 'مستخدم' },
          ]},
        ]
      }
    ]
  }
};

// ============================================
// 🔥 نوع عام للـ Form
// ============================================

export type FormDataType = 
  | SliderFormData
  | AboutFormData
  | CompanyFormData
  | ProjectFormData
  | ServiceFormData
  | ContactFormData
  | NewsletterFormData
  | JobApplicationFormData
  | UserFormData;

export type AdminResourceType = 
  | 'slider'
  | 'about'
  | 'company'
  | 'project'
  | 'service'
  | 'contact'
  | 'newsletter'
  | 'job'
  | 'user';