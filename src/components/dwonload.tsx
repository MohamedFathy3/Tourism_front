// src/components/DownloadSection.tsx

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Shield, Zap, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { useCompanyDownload } from "@/hooks/useCompanyDownload";
import dwonaldo from "@/assets/logowhite.png";

const DownloadSection = () => {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const isRTL = lang === "ar";
  const [isDownloading, setIsDownloading] = useState(false);
  
  // ✅ استخدام الـ Hook
  const { company, loading, error, refetch } = useCompanyDownload();

  // ✅ استخدام linkDrive من الـ API
  const driveLink = company?.linkDrive || "https://drive.google.com/file/d/19DWru85m_WtAfLFfuxLdjo2FQDXwnDVp/view";
  
  // ✅ استخدام الصورة من الـ API
  const companyImage = company?.image?.fullUrl || company?.imageUrl || dwonaldo;

  // دالة فتح الرابط
  const handleOpenDrive = () => {
    if (!driveLink) {
      alert(isRTL ? 'رابط التحميل غير متوفر' : 'Download link not available');
      return;
    }
    
    setIsDownloading(true);
    window.open(driveLink, "_blank", "noopener,noreferrer");
    
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
  };

  // ✅ عرض حالة التحميل
  if (loading) {
    return (
      <section className={`py-20 md:py-28 transition-all duration-500 overflow-hidden ${
        isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-[#e0b277] mx-auto mb-4" />
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {isRTL ? 'جاري تحميل البيانات...' : 'Loading data...'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ✅ عرض حالة الخطأ
  if (error) {
    return (
      <section className={`py-20 md:py-28 transition-all duration-500 overflow-hidden ${
        isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg max-w-md mx-auto">
              <p className="font-semibold">⚠️ {error}</p>
              <button 
                onClick={() => refetch()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors"
              >
                {isRTL ? 'إعادة المحاولة' : 'Retry'}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 md:py-28 transition-all duration-500 overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* الجانب الأيمن - المحتوى النصي */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-start"
          >
            {/* الشارة الصغيرة */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              isDark ? 'bg-[#e0b277]/20' : 'bg-[#e0b277]/10'
            }`}>
              <FileText className="w-4 h-4 text-[#e0b277]" />
              <span className="text-sm font-medium text-[#e0b277]">
                {company?.title || (isRTL ? "ملف تعريف الشركة" : "Company Profile")}
              </span>
            </div>

            {/* العنوان */}
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-[1.3] ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {company?.subTitle || t.download?.title || (isRTL ? 'تحميل ملف الشركة' : 'Download Company Profile')}
            </h2>
            
            {/* العنوان الفرعي */}
            <p className={`text-lg md:text-xl mb-8 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {company?.long_description || t.download?.subtitle || (isRTL ? 'احصل على ملف التعريف الكامل للشركة' : 'Get the complete company profile')}
            </p>

            {/* زر فتح الرابط على Drive */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenDrive}
              disabled={isDownloading}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                isDark 
                  ? 'bg-[#e0b277] hover:bg-[#b88d2e] text-gray-900' 
                  : 'bg-gray-800 hover:bg-gray-900 text-white'
              } ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isRTL ? "جاري التحويل..." : "Redirecting..."}</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5" />
                  <span>{isRTL ? "عرض الملف على Drive" : "View on Drive"}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* الجانب الأيسر - صورة الشركة */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <a 
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <div className={`relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-3xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                isDark ? 'bg-gradient-to-br from-[#e0b277]/20 to-transparent' : 'bg-gradient-to-br from-[#e0b277]/10 to-transparent'
              }`}>
                <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-[#e0b277]/30 animate-spin-slow"></div>
                
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img 
                    src={companyImage}
                    alt={company?.title || "Company Profile"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // ✅ Fallback لو الصورة مش موجودة
                      e.currentTarget.src = dwonaldo;
                    }}
                  />
                </div>

                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-[#e0b277]/20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#e0b277]/10 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 -right-8 w-8 h-8 rounded-full bg-[#e0b277]/30 animate-bounce"></div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>

      {/* CSS إضافي */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default DownloadSection;