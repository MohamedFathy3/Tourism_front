/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/AdminForm.tsx
import { FormConfigs, FormField } from "@/types/admin";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import FileUploader from "@/components/FileUploader";
import { X } from "lucide-react";

interface AdminFormProps {
  type: keyof typeof FormConfigs;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
  isOpen?: boolean;
  title?: string;
}

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
  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    config.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = `${field.label} مطلوب`;
        }
      });
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    // 🔥 خلفية المودال - full screen مع تعتيم
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* خلفية معتمة */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* 🔥 محتوى المودال - في المنتصف مع ميل للتحت شوية */}
      <div 
        className={`
          relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl
          ${isDark ? 'bg-gray-900' : 'bg-white'}
          animate-in fade-in zoom-in duration-300
          border ${isDark ? 'border-gray-700' : 'border-gray-200'}
          mt-10 md:mt-16 lg:mt-20
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس المودال */}
        <div className={`
          flex items-center justify-between px-6 py-4 border-b
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
          bg-inherit
        `}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {title || config.title || (lang === 'ar' ? 'نموذج' : 'Form')}
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

        {/* محتوى النموذج - قابل للتمرير */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {config.sections.map((section, idx) => (
              <div key={idx}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.fields.map((field) => (
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
                        />
                      ) : field.type === 'gallery' ? (
                        <FileUploader
                          label={lang === 'ar' ? '📤 اختر صور متعددة' : '📤 Choose multiple images'}
                          onUploadSuccess={(fileIds) => handleChange(field.name, fileIds)}
                          multiple={true}
                          accept="image/*"
                          preview={true}
                          maxFiles={10}
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
            
            {/* أزرار التحكم في أسفل المودال */}
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
                disabled={loading}
                className={`
                  px-6 py-2 rounded-lg bg-[#e0b277] hover:bg-[#b88d2e] text-white transition-colors flex items-center gap-2
                  ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {loading ? (
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
        </div>
      </div>
    </div>
  );
};