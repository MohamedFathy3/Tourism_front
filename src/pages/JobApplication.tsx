/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/JobApplication.tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUploader from "@/components/FileUploader";
import { 
  Send, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import { jobService } from "@/services/job.service";
import heroImage from "@/assets/project.jpeg";

const JobApplication = () => {
  const { lang, dir } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const isRTL = dir === "rtl";

  // 🔥 Ref لإعادة تعيين FileUploader
  const fileUploaderKeyRef = useRef(0);

  // حالة النموذج
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    job_title: '',
    cv: null as number | null,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // التحقق من صحة النموذج
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = lang === 'ar' ? 'الاسم مطلوب' : 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = lang === 'ar' ? 'بريد إلكتروني غير صحيح' : 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    }

    if (!formData.job_title.trim()) {
      errors.job_title = lang === 'ar' ? 'المسمى الوظيفي مطلوب' : 'Job title is required';
    }

    if (!formData.cv) {
      errors.cv = lang === 'ar' ? 'السيرة الذاتية مطلوبة' : 'CV is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 🔥 دالة إعادة تعيين النموذج بالكامل
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      job_title: '',
      cv: null,
    });
    setFormErrors({});
    // 🔥 تغيير الـ key لإعادة تعيين FileUploader
    fileUploaderKeyRef.current += 1;
  };

  // معالجة إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(false);
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await jobService.submitApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        linkedin: formData.linkedin,
        job_title: formData.job_title,
        cv: formData.cv!,
      });

      if (result.success) {
        setFormSuccess(true);
        // 🔥 إعادة تعيين النموذج بالكامل
        resetForm();
        
        // إخفاء رسالة النجاح بعد 5 ثواني
        setTimeout(() => {
          setFormSuccess(false);
        }, 5000);
      } else {
        setFormError(result.message || (lang === 'ar' ? 'فشل في تقديم الطلب' : 'Failed to submit application'));
      }
    } catch (error: any) {
      setFormError(error?.message || (lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // معالجة تغيير الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // معالجة رفع السيرة الذاتية
  const handleCvUpload = (fileId: number) => {
    setFormData(prev => ({ ...prev, cv: fileId }));
    if (formErrors.cv) {
      setFormErrors(prev => ({ ...prev, cv: '' }));
    }
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        
        {/* Hero Section - مع صورة الخلفية */}
        <div className="relative h-[70vh] min-h-[250px] flex items-center justify-center overflow-hidden">
          {/* صورة الخلفية */}
          <img
            src={heroImage}
            alt="Job Application"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* طبقة التعتيم */}
          <div className="absolute inset-0 bg-black/60 " />
          
          {/* المحتوى */}
          <div className="relative z-10 flex flex-col items-center justify-center text-white px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              {lang === 'ar' ? ' تقديم طلب وظيفة' : ' Job Application'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg max-w-2xl text-gray-200"
            >
              {lang === 'ar' 
                ? 'انضم إلى فريقنا - قدم طلبك الآن'
                : 'Join our team - Apply now'}
            </motion.p>
            <div className="w-20 h-1 bg-white mx-auto mt-4 rounded-full" />
          </div>
        </div>

        {/* نموذج التقديم */}
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`rounded-2xl p-6 md:p-8 ${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg`}
          >
            <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {lang === 'ar' ? ' املأ البيانات' : ' Fill in the details'}
            </h2>

            {/* رسالة النجاح */}
            {formSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{lang === 'ar' ? '✅ تم تقديم طلبك بنجاح' : '✅ Your application has been submitted successfully'}</span>
              </motion.div>
            )}

            {/* رسالة الخطأ */}
            {formError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{formError}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* الاسم الكامل */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                      formErrors.name
                        ? 'border-red-500 dark:border-red-500'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e0b277]'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                    }`}
                    placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                      formErrors.email
                        ? 'border-red-500 dark:border-red-500'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e0b277]'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                    }`}
                    placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                      formErrors.phone
                        ? 'border-red-500 dark:border-red-500'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e0b277]'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                    }`}
                    placeholder={lang === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* المسمى الوظيفي */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                      formErrors.job_title
                        ? 'border-red-500 dark:border-red-500'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e0b277]'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                    }`}
                    placeholder={lang === 'ar' ? 'أدخل المسمى الوظيفي' : 'Enter job title'}
                  />
                </div>
                {formErrors.job_title && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.job_title}</p>
                )}
              </div>

              {/* LinkedIn (اختياري) */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === 'ar' ? 'رابط LinkedIn' : 'LinkedIn URL'}
                  <span className="text-xs text-gray-400 ml-1">({lang === 'ar' ? 'اختياري' : 'Optional'})</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                      isDark
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e0b277]'
                        : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                    }`}
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>
              </div>

              {/* 🔥 رفع السيرة الذاتية مع Key لإعادة التعيين */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === 'ar' ? 'السيرة الذاتية' : 'CV / Resume'} *
                </label>
                <FileUploader
                  key={fileUploaderKeyRef.current} // 🔥 مفتاح لإعادة التعيين
                  label={lang === 'ar' ? '📄 ارفع سيرتك الذاتية (PDF, DOC, DOCX)' : '📄 Upload your CV (PDF, DOC, DOCX)'}
                  onUploadSuccess={handleCvUpload}
                  multiple={false}
                  accept=".pdf,.doc,.docx"
                  preview={true}
                  maxFiles={1}
                  maxVideoSize={0}
                />
                {formErrors.cv && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.cv}</p>
                )}
                {formData.cv && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {lang === 'ar' ? '✅ تم رفع السيرة الذاتية' : '✅ CV uploaded successfully'}
                  </p>
                )}
              </div>

              {/* زر الإرسال */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#e0b277] hover:bg-[#b88d2e] text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] shadow-lg hover:shadow-[#e0b277]/30'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {lang === 'ar' ? 'جاري التقديم...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {lang === 'ar' ? 'تقديم الطلب' : 'Submit Application'}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobApplication;