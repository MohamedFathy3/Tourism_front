// src/pages/About.tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { 
  Building2, 
  ArrowRight,
  FileText,
  AlignJustify
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAbout } from "@/hooks/useAbout";
import { Skeleton } from "@/components/ui/skeleton";

const About = () => {
  const { lang, dir } = useLanguage();
  const { isDark } = useTheme();
  const { about, loading, error } = useAbout();

  // حالة التحميل
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-[40vh] w-full rounded-2xl bg-gray-300 dark:bg-gray-700" />
            <div className="max-w-4xl mx-auto mt-8 space-y-6">
              <Skeleton className="h-12 w-3/4 bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // حالة الخطأ
  if (error || !about) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="text-center px-4">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg max-w-md mx-auto">
              <p className="font-semibold text-lg">⚠️ {error || (lang === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data')}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const data = about;

  return (
    <>
      <Navbar />
      
      {/* الصفحة كاملة - صورة خلفية مع نص في المنتصف */}
      <div 
        className="min-h-screen relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${data.image?.fullUrl || data.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* طبقة التعتيم */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        {/* المحتوى في المنتصف */}
        <div className="relative z-10 mt-20 container mx-auto px-4 py-12 md:py-20 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* العنوان */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {lang === 'ar' ? 'من نحن' : 'About Us'}
              </h1>
              <div className="w-24 h-1 bg-[#e0b277] mx-auto rounded-full" />
            </div>

            {/* وصف مختصر - description */}
            {data.description && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {lang === 'ar' ? 'نبذة مختصرة' : 'Brief'}
                  </h2>
                </div>
                
                <p className="text-base md:text-lg leading-relaxed text-white/90">
                  {data.description}
                </p>
              </div>
            )}

            {/* وصف تفصيلي - long_description */}
            {data.long_description && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {lang === 'ar' ? 'قصتنا' : 'Our Story'}
                  </h2>
                </div>
                
                <div className="space-y-4 text-white/90">
                  {data.long_description.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-base md:text-lg leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* زر التواصل - كرت شفاف */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                {lang === 'ar' ? ' لنعمل معاً' : ' Let\'s Work Together'}
              </h3>
              <p className="text-sm md:text-base text-white/70 mb-6">
                {lang === 'ar' 
                  ? 'تواصل معنا اليوم لبدء مشروعك القادم' 
                  : 'Contact us today to start your next project'}
              </p>
              <Link
                to="/contact"
                style={{borderRadius:"10px"}}
                className="inline-flex items-center gap-2 bg-[#e0b277] hover:bg-[#b88d2e] text-white px-8 py-3  font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#e0b277]/50"
              >
                {lang === 'ar' ? ' تواصل معنا' : ' Contact Us'}
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default About;