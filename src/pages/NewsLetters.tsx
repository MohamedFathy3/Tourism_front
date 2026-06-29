// src/pages/NewsLetters.tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNewsLetters } from "@/hooks/useNewsLetters";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@/assets/news.jpeg"
import { 
  Calendar, 
  ArrowRight, 
  Eye,
  Clock,
  User,
  Tag,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const NewsLetters = () => {
  const { lang, dir } = useLanguage();
  const { isDark } = useTheme();
  const { newsLetters, loading, error } = useNewsLetters({ perPage: 20 });
  const navigate = useNavigate();
  const isRTL = dir === "rtl";
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // حساب عدد الصفحات
  const totalPages = Math.ceil(newsLetters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = newsLetters.slice(startIndex, endIndex);

  // أول خبر في القائمة (للـ Hero)
  const firstNews = newsLetters.length > 0 ? newsLetters[0] : null;

  // التنقل بين الصفحات
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // حالة التحميل
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen py-20 px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <Skeleton className="h-12 w-64 mx-auto bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-4 w-96 mx-auto mt-4 bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Skeleton className="h-56 w-full bg-gray-300 dark:bg-gray-700" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700" />
                  </div>
                </div>
              ))}
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
          <div className="container mx-auto max-w-7xl text-center">
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

  // لو مفيش أخبار
  if (newsLetters.length === 0) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen py-20 px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="container mx-auto max-w-7xl text-center">
            <div className={`rounded-2xl p-12 ${isDark ? 'bg-gray-800/50' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {lang === 'ar' ? '📰 لا توجد أخبار' : '📰 No News Available'}
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {lang === 'ar' ? 'سيتم إضافة الأخبار قريباً' : 'News will be added soon'}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // صورة الـ Hero من أول خبر

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        
        {/* Hero Section مع صورة أول خبر */}
        <div className="relative h-[70vh] min-h-[350px] md:min-h-[450px] overflow-hidden">
          {/* صورة الخلفية */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>
          
          {/* المحتوى فوق الصورة */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                {lang === 'ar' ? ' الأخبار' : ' News'}
              </h1>
              <div className="w-20 h-1 bg-[#e0b277] mx-auto mb-4 rounded-full" />
              <p className="text-base md:text-lg max-w-2xl mx-auto text-gray-200">
                {lang === 'ar' 
                  ? 'آخر الأخبار والتحديثات من شركتنا'
                  : 'Latest news and updates from our company'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* قائمة الأخبار */}
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer ${
                  isDark 
                    ? 'bg-gray-800 hover:shadow-2xl hover:shadow-[#e0b277]/10' 
                    : 'bg-white hover:shadow-2xl hover:shadow-gray-300/30'
                }`}
                onClick={() => navigate(`/news/${news.id}`)}
              >
                {/* صورة الخبر */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img
                    src={news.image?.fullUrl || news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x300/1a1a1a/e0b277?text=News";
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isDark 
                      ? 'from-black/80 via-black/30 to-transparent'
                      : 'from-black/60 via-black/20 to-transparent'
                  }`} />
                  
                  {/* رقم الخبر */}
                  <div className="absolute top-4 right-4 bg-[#e0b277] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                    {String(news.id).padStart(2, '0')}
                  </div>
                </div>

                {/* محتوى الخبر */}
                <div className="p-5 md:p-6">
                  <h3 className={`text-xl md:text-2xl font-bold mb-2 transition-colors line-clamp-2 ${
                    isDark ? 'text-white group-hover:text-[#e0b277]' : 'text-gray-800 group-hover:text-[#e0b277]'
                  }`}>
                    {news.title}
                  </h3>
                  
                  <p className={`text-sm md:text-base line-clamp-3 mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {news.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-[#e0b277]" />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-[#e0b277] font-semibold transition-all duration-300 group-hover:gap-4 ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}>
                      <span className="text-sm">
                        {lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                      </span>
                      {isRTL ? (
                        <ChevronLeft className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-[#e0b277] text-white'
                      : isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewsLetters;