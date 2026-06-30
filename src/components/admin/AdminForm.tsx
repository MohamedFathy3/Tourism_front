// src/components/admin/AdminForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormConfigs, FormField } from "@/types/admin";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import FileUploader from "@/components/FileUploader";
import { X } from "lucide-react";
import api from "@/lib/api";

interface AdminFormProps {
  type: keyof typeof FormConfigs;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
  isOpen?: boolean;
  title?: string;
}

// 🔥 دالة مساعدة لاستخراج رابط الصورة
const getImageUrl = (data: any, fieldName: string): string | null => {
  if (!data) return null;
  
  const value = data[fieldName];
  if (!value) return null;
  
  if (typeof value === 'object' && value !== null) {
    return value.fullUrl || value.previewUrl || null;
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  return null;
};

// 🔥 دالة مساعدة لاستخراج ID الصورة
const getImageId = (data: any, fieldName: string): number | null => {
  if (!data) return null;
  
  const value = data[fieldName];
  if (!value) return null;
  
  if (typeof value === 'object' && value !== null) {
    return value.id || null;
  }
  
  if (typeof value === 'number') {
    return value;
  }
  
  return null;
};

// 🔥 دالة مساعدة لاستخراج معرض الصور
const getGallery = (data: any, fieldName: string): any[] => {
  if (!data) return [];
  
  const value = data[fieldName];
  if (!value) return [];
  
  if (Array.isArray(value)) {
    return value;
  }
  
  if (typeof value === 'object' && value !== null) {
    return [value];
  }
  
  return [];
};

// 🔥 دالة تنظيف الـ gallery من التكرار وإصلاح الـ URLs
const cleanGallery = async (gallery: any[]): Promise<any[]> => {
  if (!gallery || !Array.isArray(gallery)) return [];
  
  const uniqueMap = new Map();
  
  // 🔥 نجيب الـ URLs لكل صورة
  for (const item of gallery) {
    const id = item.id || item.imageId;
    if (id) {
      // 🔥 لو الـ URL موجود نستخدمه
      if (item.fullUrl || item.previewUrl || item.url) {
        const url = item.fullUrl || item.previewUrl || item.url;
        uniqueMap.set(id, {
          ...item,
          fullUrl: url,
          previewUrl: url,
          url: url,
        });
      } else {
        // 🔥 لو مفيش URL، نجيبها من الـ API
        try {
          const response = await api.get(`/media/${id}`);
          const url = response.data?.data?.fullUrl || 
                      response.data?.data?.previewUrl || 
                      `/storage/media/files/${id}`;
          uniqueMap.set(id, {
            ...item,
            fullUrl: url,
            previewUrl: url,
            url: url,
          });
        } catch (error) {
          console.error(`❌ Failed to fetch media ${id}:`, error);
          uniqueMap.set(id, {
            ...item,
            fullUrl: `/storage/media/files/${id}`,
            previewUrl: `/storage/media/files/${id}`,
            url: `/storage/media/files/${id}`,
          });
        }
      }
    }
  }
  
  return Array.from(uniqueMap.values());
};

export const AdminForm = ({ 
  type, 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  loading,
  isOpen = true,
  title
}: AdminFormProps) => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  
  const config = FormConfigs[type];
  
  const defaultConfig = {
    title: lang === 'ar' ? 'نموذج' : 'Form',
    sections: [
      {
        title: lang === 'ar' ? 'البيانات الأساسية' : 'Basic Data',
        fields: [] as FormField[]
      }
    ]
  };
  
  const safeConfig = config || defaultConfig;
  
  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // ✅ تحديث الفورم لما تتغير initialData
  useEffect(() => {
    const loadGallery = async () => {
      console.log('🔄 AdminForm - initialData changed:', initialData);
      
      const cleanedData = { ...initialData };
      
      // 🔥 تنظيف الـ gallery من التكرار وإصلاح الـ URLs
      if (cleanedData.gallery && Array.isArray(cleanedData.gallery)) {
        setIsLoadingGallery(true);
        try {
          cleanedData.gallery = await cleanGallery(cleanedData.gallery);
          console.log('🧹 Cleaned gallery with fixed URLs:', cleanedData.gallery);
        } catch (error) {
          console.error('❌ Error cleaning gallery:', error);
        } finally {
          setIsLoadingGallery(false);
        }
      }
      
      if (Array.isArray(cleanedData.image) && cleanedData.image.length === 0) {
        cleanedData.image = null;
      }
      
      setFormData(cleanedData || {});
    };
    
    loadGallery();
  }, [initialData]);

  // منع التمرير خلف المودال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (name: string, value: any) => {
    console.log(`📝 Field changed: ${name} =`, value);
    
    if (name === 'gallery') {
      if (Array.isArray(value) && value.length > 0) {
        // 🔥 نضمن الفريدة باستخدام Set
        const uniqueIds = [...new Set(value)];
        
        const galleryObjects = uniqueIds.map(id => ({
          id: id,
          fullUrl: `/storage/media/files/${id}`,
          previewUrl: `/storage/media/files/${id}`,
          url: `/storage/media/files/${id}`,
        }));
        
        setFormData(prev => ({ ...prev, [name]: galleryObjects }));
      } else {
        setFormData(prev => ({ ...prev, [name]: [] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!safeConfig.sections || safeConfig.sections.length === 0) {
      onSubmit(formData);
      setIsSubmitting(false);
      return;
    }
    
    const newErrors: Record<string, string> = {};
    safeConfig.sections.forEach(section => {
      if (section.fields) {
        section.fields.forEach(field => {
          if (field.required && !formData[field.name]) {
            newErrors[field.name] = `${field.label} مطلوب`;
          }
        });
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    const submitData = { ...formData };
    
    // 🔥 معالجة الـ image
    if (Array.isArray(submitData.image) && submitData.image.length > 0) {
      const firstImage = submitData.image[0];
      if (typeof firstImage === 'number') {
        submitData.image = firstImage;
      } else if (typeof firstImage === 'object' && firstImage?.id) {
        submitData.image = firstImage.id;
      } else {
        submitData.image = null;
      }
    } else if (Array.isArray(submitData.image) && submitData.image.length === 0) {
      submitData.image = null;
    }
    
    // 🔥 معالجة الـ gallery - نضمن الفريدة
    if (Array.isArray(submitData.gallery) && submitData.gallery.length > 0) {
      const galleryIds = submitData.gallery
        .map(img => {
          if (typeof img === 'number') return img;
          if (typeof img === 'object' && img?.id) return img.id;
          return null;
        })
        .filter(id => id !== null);
      
      // 🔥 إزالة التكرار باستخدام Set
      const uniqueIds = [...new Set(galleryIds)];
      
      if (uniqueIds.length > 0) {
        submitData.gallery = uniqueIds;
      } else {
        submitData.gallery = [];
      }
    } else {
      submitData.gallery = [];
    }
    
    console.log('📤 Submitting data (cleaned):', submitData);
    onSubmit(submitData);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      <div 
        className={`
          relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl
          ${isDark ? 'bg-gray-900' : 'bg-white'}
          animate-in fade-in zoom-in duration-300
          border ${isDark ? 'border-gray-700' : 'border-gray-200'}
          mt-0 md:mt-4 lg:mt-8
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`
          flex items-center justify-between px-6 py-4 border-b
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
          bg-inherit
        `}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {title || safeConfig.title || (lang === 'ar' ? 'نموذج' : 'Form')}
          </h2>
          <button
            onClick={onCancel}
            className={`
              p-2 rounded-full transition-colors
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            `}
            type="button"
          >
            <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-140px)]">
          {isLoadingGallery ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e0b277]"></div>
              <p className={`ml-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {lang === 'ar' ? 'جاري تحميل الصور...' : 'Loading images...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {safeConfig.sections && safeConfig.sections.map((section, idx) => (
                <div key={idx}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {section.title}
                  </h3>
                  <div className="space-y-4">
                    {section.fields && section.fields.map((field) => (
                      <div key={field.name}>
                        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {field.label}
                          {field.required && <span className="text-red-500"> *</span>}
                        </label>
                        
                        {field.type === 'text' || field.type === 'email' || field.type === 'phone' || field.type === 'number' ? (
                          <input
                            type={field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className={`
                              w-full px-4 py-2 rounded-lg border transition-colors
                              ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                              focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50
                            `}
                            placeholder={field.placeholder}
                          />
                        ) : field.type === 'textarea' ? (
                          <textarea
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            rows={field.rows || 4}
                            className={`
                              w-full px-4 py-2 rounded-lg border transition-colors
                              ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                              focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50 resize-none
                            `}
                            placeholder={field.placeholder}
                          />
                        ) : field.type === 'toggle' ? (
                          <button
                            type="button"
                            onClick={() => handleChange(field.name, !formData[field.name])}
                            className={`relative w-12 h-6 rounded-full transition-colors ${formData[field.name] ? 'bg-[#e0b277]' : 'bg-gray-400'}`}
                          >
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData[field.name] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                          </button>
                        ) : field.type === 'select' ? (
                          <select
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className={`
                              w-full px-4 py-2 rounded-lg border transition-colors
                              ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                              focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50
                            `}
                          >
                            <option value="">اختر...</option>
                            {field.options?.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : field.type === 'file' ? (
                          <FileUploader
                            label={lang === 'ar' ? '📤 اختر ملف' : '📤 Choose file'}
                            onUploadSuccess={(fileId) => handleChange(field.name, fileId)}
                            multiple={false}
                            accept="image/*"
                            preview={true}
                            maxFiles={1}
                            defaultImageUrl={getImageUrl(formData, field.name)}
                            defaultImageId={getImageId(formData, field.name)}
                            onRemoveImage={() => handleChange(field.name, null)}
                            key={`file-${field.name}-${JSON.stringify(formData[field.name])}`}
                          />
                        ) : field.type === 'gallery' ? (
                          <FileUploader
                            label={lang === 'ar' ? '📤 اختر صور متعددة' : '📤 Choose multiple images'}
                            onUploadSuccess={(fileIds) => {
                              console.log('📸 Gallery IDs received:', fileIds);
                              handleChange(field.name, fileIds);
                            }}
                            multiple={true}
                            accept="image/*"
                            preview={true}
                            maxFiles={10}
                            appendMode={true}
                            defaultGallery={getGallery(formData, field.name)}
                            onRemoveImage={() => handleChange(field.name, [])}
                            key={`gallery-${field.name}-${JSON.stringify(formData[field.name])}`}
                          />
                        ) : null}
                        
                        {errors[field.name] && (
                          <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-inherit">
                <button
                  type="button"
                  onClick={onCancel}
                  className={`
                    px-4 py-2 rounded-lg transition-colors
                    ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                  `}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading || isSubmitting || isLoadingGallery}
                  className={`
                    px-6 py-2 rounded-lg bg-[#e0b277] hover:bg-[#b88d2e] text-white transition-colors flex items-center gap-2
                    ${(loading || isSubmitting || isLoadingGallery) ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  {(loading || isSubmitting) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                      {lang === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    lang === 'ar' ? 'حفظ' : 'Save'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminForm;