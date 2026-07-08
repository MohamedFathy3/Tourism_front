// src/pages/Contact.tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useContact } from "@/hooks/useContact";
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  MapPin,
  ExternalLink,
  Maximize2
} from "lucide-react";

const Contact = () => {
  const { lang, dir } = useLanguage();
  const { isDark } = useTheme();
  const { contactData, loading, error, sendMessage, isSending } = useContact();
  const isRTL = dir === "rtl";

  // حالة النموذج
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

    if (!formData.message.trim()) {
      errors.message = lang === 'ar' ? 'الرسالة مطلوبة' : 'Message is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // معالجة إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(false);
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    const result = await sendMessage(formData);

    if (result.success) {
      setFormSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        subject: '',
        message: '',
      });
      setFormErrors({});
      
      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);
    } else {
      setFormError(result.message || (lang === 'ar' ? 'فشل في إرسال الرسالة' : 'Failed to send message'));
    }
  };

  // معالجة تغيير الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // دالة فتح الخريطة في تبويب جديد
  const openMap = (address: string) => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  // استخراج عنوان الـ iframe من الـ API
  const getIframeSrc = (iframeString: string): string => {
    if (!iframeString) return '';
    
    const srcMatch = iframeString.match(/src="([^"]*)"/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
    
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contactData?.address || '')}`;
  };

  // استخراج البيانات من contactData
  const heroImage = contactData?.image?.fullUrl || contactData?.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=600&fit=crop';
  const address = contactData?.address || (lang === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt');
  const phoneOne = contactData?.phone_one || '';
  const phoneTwo = contactData?.phone_two || '';
  const email = contactData?.email || '';
  const workHours = contactData?.work_hours || '9 AM TO 5 PM';
  
  const iframeSrc = contactData?.address_iframe 
    ? getIframeSrc(contactData.address_iframe)
    : `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}`;

  // حالة التحميل
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen py-20 px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Skeleton className="h-12 w-48 mx-auto bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-4 w-96 mx-auto mt-4 bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <Skeleton className="h-32 w-full bg-gray-300 dark:bg-gray-700 rounded-2xl" />
                <Skeleton className="h-32 w-full bg-gray-300 dark:bg-gray-700 rounded-2xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-32 w-full bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen py-20 px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="container mx-auto max-w-6xl text-center">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg max-w-2xl mx-auto">
              <p className="font-semibold">⚠️ {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors"
              >
                {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        
        {/* Hero Section مع الصورة من الـ API */}
        <div className="relative h-[50vh] min-h-[350px] md:min-h-[450px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </h1>
              <div className="w-20 h-1 bg-[#e0b277] mx-auto mb-4 rounded-full" />
              <p className="text-base md:text-lg max-w-2xl mx-auto text-gray-200">
                {lang === 'ar' 
                  ? 'نحن هنا لخدمتك - تواصل معنا لأي استفسار'
                  : 'We are here to serve you - Contact us for any inquiry'}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* معلومات الاتصال */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className={`rounded-2xl p-6 md:p-8 ${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              } shadow-lg`}>
                <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {lang === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                </h2>
                
                <div className="space-y-6">
                  {/* الهاتف الأول */}
                  {phoneOne && (
                    <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300">
                      <div className="bg-[#e0b277]/20 p-3 rounded-full flex-shrink-0 group-hover:bg-[#e0b277]/30 transition-colors">
                        <Phone className="w-6 h-6 text-[#e0b277]" />
                      </div>
                      <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {lang === 'ar' ? 'الهاتف' : 'Phone'}
                        </p>
                        <a 
                          href={`tel:${phoneOne}`}
                          className={`font-semibold hover:text-[#e0b277] transition-colors ${
                            isDark ? 'text-white' : 'text-gray-800'
                          }`}
                        >
                          {phoneOne}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* الهاتف الثاني */}
                  {phoneTwo && (
                    <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300">
                      <div className="bg-[#e0b277]/20 p-3 rounded-full flex-shrink-0 group-hover:bg-[#e0b277]/30 transition-colors">
                        <Phone className="w-6 h-6 text-[#e0b277]" />
                      </div>
                      <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {lang === 'ar' ? 'هاتف آخر' : 'Phone 2'}
                        </p>
                        <a 
                          href={`tel:${phoneTwo}`}
                          className={`font-semibold hover:text-[#e0b277] transition-colors ${
                            isDark ? 'text-white' : 'text-gray-800'
                          }`}
                        >
                          {phoneTwo}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* البريد الإلكتروني */}
                  {email && (
                    <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300">
                      <div className="bg-[#e0b277]/20 p-3 rounded-full flex-shrink-0 group-hover:bg-[#e0b277]/30 transition-colors">
                        <Mail className="w-6 h-6 text-[#e0b277]" />
                      </div>
                      <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                        </p>
                        <a 
                          href={`mailto:${email}`}
                          className={`font-semibold hover:text-[#e0b277] transition-colors ${
                            isDark ? 'text-white' : 'text-gray-800'
                          }`}
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* ساعات العمل */}
                  {workHours && (
                    <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300">
                      <div className="bg-[#e0b277]/20 p-3 rounded-full flex-shrink-0 group-hover:bg-[#e0b277]/30 transition-colors">
                        <Clock className="w-6 h-6 text-[#e0b277]" />
                      </div>
                      <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {lang === 'ar' ? 'ساعات العمل' : 'Working Hours'}
                        </p>
                        <p className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                          {workHours}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* العنوان */}
                  {address && (
                    <div 
                      className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                      onClick={() => openMap(address)}
                    >
                      <div className="bg-[#e0b277]/20 p-3 rounded-full flex-shrink-0 group-hover:bg-[#e0b277]/30 transition-colors">
                        <MapPin className="w-6 h-6 text-[#e0b277]" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {lang === 'ar' ? '📍 العنوان' : '📍 Address'}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold hover:text-[#e0b277] transition-colors ${
                            isDark ? 'text-white' : 'text-gray-800'
                          }`}>
                            {address}
                          </p>
                          <ExternalLink className="w-4 h-4 text-[#e0b277] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-[#e0b277] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {lang === 'ar' ? '👆 اضغط لفتح الخريطة' : '👆 Click to open map'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* الخريطة */}
              <div className={`rounded-2xl overflow-hidden shadow-lg ${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              }`}>
                <div className="relative">
                  {iframeSrc ? (
                    <iframe
                      title="Location Map"
                      src={iframeSrc}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full"
                    />
                  ) : (
                    <div className={`h-[300px] flex items-center justify-center ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {lang === 'ar' ? 'لا توجد خريطة' : 'No map available'}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => openMap(address)}
                    className="absolute bottom-3 right-3 bg-[#e0b277] hover:bg-[#b88d2e] text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    title={lang === 'ar' ? 'تكبير الخريطة' : 'Expand map'}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <div className={`p-3 text-center ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {lang === 'ar' ? '📍 موقعنا على الخريطة' : '📍 Our location on map'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* نموذج الاتصال */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`rounded-2xl p-6 md:p-8 ${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              } shadow-lg`}
            >
              <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {lang === 'ar' ? '📧 أرسل رسالة' : '📧 Send a Message'}
              </h2>

              {/* رسالة النجاح */}
              {formSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{lang === 'ar' ? '✅ تم إرسال رسالتك بنجاح' : '✅ Your message has been sent successfully'}</span>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* الاسم */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      formErrors.name
                        ? 'border-red-500 dark:border-red-500'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e0b277]'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                    }`}
                  />
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
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      formErrors.email
                        ? 'border-red-500 dark:border-red-500'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e0b277]'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                    }`}
                  />
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
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      formErrors.phone
                        ? 'border-red-500 dark:border-red-500'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e0b277]'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {/* الرسالة */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {lang === 'ar' ? 'الرسالة' : 'Message'} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
                      formErrors.message
                        ? 'border-red-500 dark:border-red-500'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e0b277]'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                    }`}
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                  )}
                </div>

                {/* زر الإرسال */}
                <button
                  type="submit"
                  disabled={isSending}
                  className={`w-full bg-[#e0b277] hover:bg-[#b88d2e] text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSending ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] shadow-lg hover:shadow-[#e0b277]/30'
                  }`}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {lang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;