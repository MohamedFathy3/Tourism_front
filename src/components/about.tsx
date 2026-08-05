/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/About.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Eye, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import { useAbout } from "@/hooks/useAbout";
import { useTheme } from "@/contexts/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";

// صور احتياطية (fallback)
import section from "@/assets/about/e2f9bad7e3d21af8906f8741cafa70f86c77cdfd.png";

const About = () => {
  const { t, dir, lang } = useLanguage(); // ✅ أضف lang
  const { isDark } = useTheme();
  const { about, loading, error } = useAbout();
  const isRTL = dir === "rtl";

  // ✅ دالة مساعدة لجلب النص حسب اللغة
  const getLocalizedText = (item: any, field: 'title' | 'description' | 'long_description') => {
    if (!item) return '';
    
    const isEnglish = lang === 'en';
    const enField = `${field}_en`;
    
    // لو اللغة إنجليزية والـ API مدعوم
    if (isEnglish && item[enField]) {
      return item[enField];
    }
    
    // غير كده استخدم العربية
    return item[field] || '';
  };

  // حالة تحميل
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Skeleton className="h-16 w-64 mx-auto bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Skeleton className="w-full h-[400px] rounded-2xl bg-gray-300 dark:bg-gray-700" />
              </div>
              <div className="order-1 lg:order-2 space-y-4">
                <Skeleton className="h-12 w-3/4 bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-12 w-32 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <FloatingButtons />
      </div>
    );
  }

  // حالة خطأ
  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              <p className="font-semibold">⚠️ {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
        <Footer />
        <FloatingButtons />
      </div>
    );
  }

  // استخدام البيانات من API أو fallback
  const aboutData = about || {
    title: t.about.title,
    description: t.about.desc,
    long_description: t.about.desc,
    imageUrl: section,
    image: {
      fullUrl: section,
      previewUrl: section,
    }
  };

  return (
    <div className="min-h-40">
      <Navbar />

      <section className="py-20 px-4">
        {/* ✅ العنوان - حسب اللغة */}
        <h1 className="text-center font-bold mb-12 text-4xl md:text-5xl lg:text-6xl text-gray-800 dark:text-white">
          {getLocalizedText(aboutData, 'title') || t.about.pageTitle}
        </h1>
        
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* الصورة - من API أو fallback */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src={aboutData.image?.fullUrl || aboutData.imageUrl || section}
                  alt={getLocalizedText(aboutData, 'title') || "About"}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            </motion.div>

            {/* المحتوى النصي - حسب اللغة */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              {/* ✅ العنوان - حسب اللغة */}
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                {getLocalizedText(aboutData, 'title') || t.about.title}
              </h2>
              
              {/* ✅ الوصف المختصر - حسب اللغة */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
                {getLocalizedText(aboutData, 'description') || t.about.desc}
              </p>

              {/* ✅ الوصف الطويل - حسب اللغة (لو موجود) */}
              {/* {getLocalizedText(aboutData, 'long_description') && (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 whitespace-pre-line">
                  {getLocalizedText(aboutData, 'long_description')}
                </p>
              )} */}

              <Link to="/about" className="inline-block">
                <button 
                  className="bg-[#e0b277] hover:bg-[#b58a2e] text-black px-8 py-3 font-semibold transition-colors duration-300"
                  style={{borderRadius: '10px'}}
                >
                  {t.hero.cta}
                </button>
              </Link> 
            </motion.div>
          </div>
        </div>
      </section>
 
      <FloatingButtons />
    </div>
  );
};

export default About;