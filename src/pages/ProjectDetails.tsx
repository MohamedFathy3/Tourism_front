// src/pages/CompanyDetails.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCompanyById } from "@/hooks/useCompany";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ArrowRight,
  Share2,
  Heart,
  Eye,
  Building,
  Award,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Home,
  Hotel,
  Castle,
  Warehouse,
  Briefcase,
  Building2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ استيراد Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// ✅ صور احتياطية
const fallbackImages = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
];

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company, loading, error } = useCompanyById(Number(id));
  const { lang, dir } = useLanguage();
  const { isDark } = useTheme();
  const isRTL = dir === "rtl";
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ دالة مساعدة لجلب النص حسب اللغة
  const getLocalizedText = (item: any, field: 'title' | 'long_description' | 'description' | 'location') => {
    if (!item) return '';

    const isEnglish = lang === 'en';
    const enField = `${field}_en`;

    if (isEnglish && item[enField]) {
      return item[enField];
    }

    return item[field] || '';
  };

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
  if (error || !company) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="text-center px-4">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg max-w-md mx-auto">
              <p className="font-semibold text-lg">⚠️ {error || (lang === 'ar' ? 'الشركة غير موجودة' : 'Company not found')}</p>
              <button
                onClick={() => navigate('/projects')}
                className="mt-4 bg-[#e0b277] hover:bg-[#b88d2e] text-white px-6 py-2 rounded-full transition-colors"
              >
                {lang === 'ar' ? 'العودة للشركات' : 'Back to Companies'}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ بناء بيانات الشركة مع دعم اللغات
  const companyData = {
    id: company.id,
    name: getLocalizedText(company, 'title') || company.title || company.name || `شركة ${company.id}`,
    description: getLocalizedText(company, 'long_description') ||
      getLocalizedText(company, 'description') ||
      company.long_description ||
      company.description ||
      "شركة رائدة في مجالها",
    image: company.image?.fullUrl || company.imageUrl || fallbackImages[0],
    gallery: company.gallery || [],
    location: getLocalizedText(company, 'location') || company.location || "غير محدد",
    yearFounded: company.year_founded || "غير محدد",
    active: company.active ?? true,
  };

  // تجهيز صور المعرض
  const galleryImages = companyData.gallery.length > 0
    ? companyData.gallery.map((img: any) => img.fullUrl)
    : [companyData.image, companyData.image, companyData.image, companyData.image];

  // دوال التحكم في الـ Swiper
  const goPrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const goNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>

        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] md:min-h-[500px]">
          <img
            src={companyData.image}
            alt={companyData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* زر العودة */}
          <button
            onClick={() => navigate('/projects')}
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
                    title: companyData.name,
                    text: companyData.description,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* ✅ معلومات الشركة */}
          <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              {/* ✅ العنوان - حسب اللغة */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3">
                {companyData.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-4 text-gray-200 text-sm md:text-base">
                {/* ✅ الموقع - حسب اللغة */}
                {companyData.location && companyData.location !== "غير محدد" && (
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4" />
                    <span>{companyData.location}</span>
                  </div>
                )}


              </div>
            </motion.div>
          </div>
        </div>

        {/* المحتوى */}
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* بطاقة المعلومات السريعة */}
            <div
              className={`rounded-2xl p-6 md:p-8 mb-8 ${isDark ? 'bg-gray-800/50' : 'bg-white'
                } shadow-lg`}
            >
              {/* الموقع */}
              <div
                className={`flex items-center gap-3 p-4 rounded-xl w-full ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
              >
                <div
                  className={`p-2 rounded-full ${isDark ? 'bg-[#e0b277]/20' : 'bg-[#e0b277]/10'
                    }`}
                >
                </div>

                <div className="flex-1">
                  <p
                    className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                  >
                    {lang === 'ar' ? 'الموقع' : 'Location'}
                  </p>

                  <p
                    className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'
                      }`}
                  >
                    {companyData.location}
                  </p>
                </div>
              </div>
            </div>

            {/* وصف الشركة */}
            <div
              className={`rounded-2xl p-6 md:p-8 mb-8 ${isDark ? 'bg-gray-800/50' : 'bg-white'
                } shadow-lg`}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'
                  }`}
              >
                {lang === 'ar' ? 'عن الشركة' : 'About Company'}
              </h2>

              <div
                className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
              >
                {companyData.description.split('\n').map(
                  (paragraph: string, index: number) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph.trim()}
                    </p>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal لعرض الصور بتفصيل */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full size"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
              <button
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default CompanyDetails;