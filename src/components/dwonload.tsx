import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Download, FileText, CheckCircle, Shield, Zap, ArrowRight, ExternalLink } from "lucide-react";

import dwonaldo  from "@/assets/downalod.png";

const DownloadSection = () => {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const isRTL = lang === "ar";
  const [isDownloading, setIsDownloading] = useState(false);

  // رابط Google Drive (استبدله برابطك)
  const driveLink = "https://drive.google.com/file/d/19DWru85m_WtAfLFfuxLdjo2FQDXwnDVp/view";

  // دالة فتح الرابط
  const handleOpenDrive = () => {
    setIsDownloading(true);
    
    // فتح الرابط في تبويب جديد
    window.open(driveLink, "_blank", "noopener,noreferrer");
    
    // إعادة تعيين حالة التحميل بعد ثانية
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
  };

  // بيانات المميزات
  const features = [
    {
      icon: CheckCircle,
      title: t.download.features.quality,
      color: "#10b981"
    },
    {
      icon: Shield,
      title: t.download.features.secure,
      color: "#3b82f6"
    },
    {
      icon: Zap,
      title: t.download.features.free,
      color: "#f59e0b"
    }
  ];

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
                {isRTL ? "ملف تعريف الشركة" : "Company Profile"}
              </span>
            </div>

            {/* العنوان */}
            <h2 className={`text-3xl   sm:text-2xl md:text-5xl font-bold mb-10 leading-[1.3] md:leading-[1.6] ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {t.download.title}
            </h2>
            
            {/* العنوان الفرعي */}
            <p className={`text-lg md:text-xl mt-4 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t.download.subtitle}
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
          
            </div>

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

          {/* الجانب الأيسر - صورة أو أيقونة كبيرة */}
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
    src={dwonaldo}
      alt="Download Icon"
    className="w-full h-full object-cover"
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

      {/* أضف الـ CSS الإضافي */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
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