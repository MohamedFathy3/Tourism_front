// src/pages/NewsLetterDetails.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useNewsLetterById } from "@/hooks/useNewsLetters";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Share2, 
  Heart, 
  Clock,
  User,
  Tag,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const NewsLetterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { newsLetter, loading, error } = useNewsLetterById(Number(id));
  const { lang, dir } = useLanguage();
  const { isDark } = useTheme();
  const isRTL = dir === "rtl";
  const [isLiked, setIsLiked] = useState(false);

  // حالة التحميل
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-[50vh] w-full rounded-2xl bg-gray-300 dark:bg-gray-700" />
            <div className="max-w-4xl mx-auto mt-8 space-y-6">
              <Skeleton className="h-12 w-3/4 bg-gray-300 dark:bg-gray-700" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-32 bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-6 w-32 bg-gray-300 dark:bg-gray-700" />
              </div>
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
  if (error || !newsLetter) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="text-center px-4">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg max-w-md mx-auto">
              <p className="font-semibold text-lg">⚠️ {error || (lang === 'ar' ? 'الخبر غير موجود' : 'News not found')}</p>
              <button 
                onClick={() => navigate('/news')}
                className="mt-4 bg-[#e0b277] hover:bg-[#b88d2e] text-white px-6 py-2 rounded-full transition-colors"
              >
                {lang === 'ar' ? 'العودة للأخبار' : 'Back to News'}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // صورة الخبر
  const newsImage = newsLetter.image?.fullUrl || newsLetter.imageUrl || 'https://via.placeholder.com/1200x600/1a1a1a/e0b277?text=News';

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        
        {/* Hero Section مع الصورة */}
        <div className="relative h-[50vh] min-h-[350px] md:min-h-[450px] overflow-hidden">
          <img
            src={newsImage}
            alt={newsLetter.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/1200x600/1a1a1a/e0b277?text=News";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          
          {/* زر العودة */}
          <button
            onClick={() => navigate('/news')}
            className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} z-20 bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110`}
            aria-label={lang === 'ar' ? 'العودة' : 'Back'}
          >
            <ArrowLeft className={`w-5 h-5 md:w-6 md:h-6 text-white ${isRTL ? 'rotate-180' : ''}`} />
          </button>

          {/* أزرار المشاركة */}
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 flex gap-2`}>
            <button 
              className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </button>
            <button 
              className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: newsLetter.title,
                    text: newsLetter.description,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* معلومات الخبر */}
          <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              {/* رقم الخبر */}
              <div className="inline-block bg-[#e0b277] text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                #{String(newsLetter.id).padStart(3, '0')}
              </div>
              
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3">
                {newsLetter.title}
              </h1>
              
          
            </motion.div>
          </div>
        </div>

        {/* المحتوى */}
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* وصف الخبر */}
            <div className={`rounded-2xl p-6 md:p-8 mb-8 ${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg`}>
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {lang === 'ar' ? ' عن الخبر' : ' About'}
              </h2>
              <div className={`text-base md:text-lg leading-relaxed whitespace-pre-line ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {newsLetter.description}
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className={`rounded-2xl p-6 md:p-8 mb-8 ${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#e0b277]/20 p-3 rounded-full">
                    <User className="w-6 h-6 text-[#e0b277]" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {lang === 'ar' ? 'الناشر' : 'Publisher'}
                    </p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {lang === 'ar' ? 'فريق التحرير' : 'Editorial Team'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-[#e0b277]/20 p-3 rounded-full">
                    <Tag className="w-6 h-6 text-[#e0b277]" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {lang === 'ar' ? 'التصنيف' : 'Category'}
                    </p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {lang === 'ar' ? 'أخبار الشركة' : 'Company News'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-[#e0b277]/20 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-[#e0b277]" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {lang === 'ar' ? 'تاريخ النشر' : 'Published'}
                    </p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار التنقل */}
            <div className={`rounded-2xl p-6 md:p-8 ${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button
                  onClick={() => navigate('/news')}
                  className={`flex items-center gap-2 text-[#e0b277] hover:text-[#b88d2e] transition-colors font-semibold ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  {lang === 'ar' ? 'العودة للأخبار' : 'Back to News'}
                </button>
                
                <Link
                  to="/contact"
                  className="bg-[#e0b277] hover:bg-[#b88d2e] text-white px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-[#e0b277]/30"
                >
                  {lang === 'ar' ? ' تواصل معنا' : ' Contact Us'}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewsLetterDetails;