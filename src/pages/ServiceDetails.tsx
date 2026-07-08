// src/pages/ProjectDetails.tsx
import { useParams } from "react-router-dom";
import { useServiceById } from "@/hooks/useServices";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Share2,
  Heart,
  Eye,
  Building2,
  Home,
  PaintRoller,
  Fuel,
  Coffee,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useState, useRef, useEffect } from "react";

// ✅ استيراد Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProjectDetails = () => {
  const { id } = useParams();
  const { service, loading, error } = useServiceById(Number(id));
  const { lang, dir } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const isRTL = dir === "rtl";
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // حالة التحميل
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#e0b277] mx-auto mb-4"></div>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {lang === 'ar' ? 'جاري تحميل المشروع...' : 'Loading project...'}
            </p>
          </div>
        </div>
      </>
    );
  }

  // حالة الخطأ
  if (error || !service) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="text-center px-4">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg max-w-md mx-auto">
              <p className="font-semibold text-lg">⚠️ {error || (lang === 'ar' ? 'المشروع غير موجود' : 'Project not found')}</p>
              <button 
                onClick={() => navigate('/projects')}
                className="mt-4 bg-[#e0b277] hover:bg-[#b88d2e] text-white px-6 py-2 rounded-full transition-colors"
              >
                {lang === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // معرض الصور
  const galleryImages = service.gallery || [];
  const hasGallery = galleryImages.length > 0;

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

  // أيقونة حسب نوع المشروع
  const getProjectIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('بنزين') || titleLower.includes('gas')) return Fuel;
    if (titleLower.includes('قهوة') || titleLower.includes('cafe') || titleLower.includes('مقهى')) return Coffee;
    if (titleLower.includes('فيلا') || titleLower.includes('villa')) return Home;
    if (titleLower.includes('داخلي') || titleLower.includes('interior')) return PaintRoller;
    if (titleLower.includes('مجمع') || titleLower.includes('complex')) return Building2;
    return Building2;
  };

  const ProjectIcon = getProjectIcon(service.title);

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] md:min-h-[500px]">
          <img
            src={service.image?.fullUrl || service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/1920x1080/1a1a1a/e0b277?text=Project";
            }}
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
                    title: service.title,
                    text: service.description,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* معلومات المشروع */}
          <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              {/* رقم المشروع */}
              <div className="inline-block bg-[#e0b277] text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                #{String(service.id).padStart(3, '0')}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3">
                {service.title}
              </h1>
              
              {service.location && (
                <div className="flex items-center justify-center gap-2 text-gray-200 text-sm md:text-base">
                  <MapPin className="w-4 h-4" />
                  <span>{service.location}</span>
                </div>
              )}
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
            {/* وصف المشروع */}
            <div className={`rounded-2xl p-6 md:p-8 mb-8 ${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg`}>
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {lang === 'ar' ? 'وصف المشروع' : 'Project Description'}
              </h2>
              <p className={`text-base md:text-lg leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {service.description || service.location || (lang === 'ar' ? 'لا يوجد وصف لهذا المشروع' : 'No description available')}
              </p>
            </div>

            {/* ✅ معرض الصور - Swiper مع تحكم كامل */}
            {isClient && hasGallery && (
              <div className={`rounded-2xl p-6 md:p-8 mb-8 ${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              } shadow-lg`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-2xl md:text-3xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {lang === 'ar' ? 'معرض الصور' : 'Gallery'}
                  </h3>
                  
                  {/* ✅ أزرار التحكم */}
                  <div className="flex gap-2">
                    <button
                      onClick={goPrev}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                      aria-label="Previous"
                    >
                      <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                      onClick={goNext}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                      aria-label="Next"
                    >
                      <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={false}
                    pagination={{ 
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    autoplay={false}
                    speed={500}
                    loop={galleryImages.length > 1}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }}
                    className="gallery-swiper"
                    breakpoints={{
                      640: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                      },
                    }}
                  >
                    {galleryImages.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div 
                          className="relative group rounded-xl overflow-hidden cursor-pointer aspect-[4/3]"
                          onClick={() => setSelectedImage(image.fullUrl)}
                        >
                          <img
                            src={image.fullUrl}
                            alt={`${service.title} - ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/400x400/2a2a2a/e0b277?text=Image";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Eye className="w-10 h-10 text-white" />
                            <span className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                              {index + 1} / {galleryImages.length}
                            </span>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* ✅ Pagination مخصصة */}
                  <style jsx>{`
                    .gallery-swiper :global(.swiper-pagination) {
                      position: relative;
                      margin-top: 20px;
                      display: flex;
                      justify-content: center;
                      gap: 8px;
                    }
                    
                    .gallery-swiper :global(.swiper-pagination-bullet) {
                      width: 10px;
                      height: 10px;
                      background: ${isDark ? '#4a4a4a' : '#d1d5db'};
                      opacity: 1;
                      border-radius: 50%;
                      transition: all 0.3s ease;
                    }
                    
                    .gallery-swiper :global(.swiper-pagination-bullet-active) {
                      background: #e0b277;
                      transform: scale(1.2);
                      width: 14px;
                      height: 14px;
                    }
                    
                    .gallery-swiper :global(.swiper-pagination-bullet):hover {
                      transform: scale(1.1);
                    }
                  `}</style>
                </div>
              </div>
            )}

            {/* أزرار التنقل */}
            <div className={`rounded-2xl p-6 md:p-8 ${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button
                  onClick={() => navigate('/projects')}
                  className={`flex items-center gap-2 text-[#e0b277] hover:text-[#b88d2e] transition-colors font-semibold ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  {lang === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
                </button>
                
                <Link
                  to="/contact"
                  className="bg-[#e0b277] hover:bg-[#b88d2e] text-white px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-[#e0b277]/30"
                >
                  {lang === 'ar' ? 'استفسر عن المشروع' : 'Inquire About Project'}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
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
              className="relative max-w-4xl w-full"
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
    </>
  );
};

export default ProjectDetails;