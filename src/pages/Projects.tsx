// src/components/ProjectsPreview.tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, Fuel, Coffee, Building2, Home, PaintRoller, Building } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "@/hooks/useCompany";
import { Skeleton } from "@/components/ui/skeleton";
import Nav from '@/components/Navbar'
import Footer from '@/components/Footer'
const projectIcons = [Fuel, Coffee, Building2, Home, Home, PaintRoller, PaintRoller, Building];
import heroImage from "@/assets/1.jpeg";

const ProjectsPreview = () => {
  const { dir, lang } = useLanguage();
  const { isDark } = useTheme();
  const { companies, loading, error } = useCompany({ perPage: 10 }); // 🔥 companies مصفوفة
  const isRTL = dir === "rtl";
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);

  // مراقبة حجم الشاشة
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔥 بناء بيانات المشاريع من الشركات (مصفوفة)
  const buildProjectsData = () => {
    if (companies.length > 0) {
      return companies.map((company) => ({
        id: company.id,
        title: { 
          ar: company.title || 'شركتنا', 
          en: company.title || 'Our Company' 
        },
        image: company.image?.fullUrl || company.imageUrl,
        description: { 
          ar: company.long_description || "شركة رائدة في مجالها", 
          en: company.long_description || "A leading company in its field" 
        },
        location: { 
          ar: company.location || "مدينة القاهره", 
          en: company.location || "JEDDAH CITY" 
        },
      }));
    }

    // Fallback
    return [{
      id: 1,
      title: { ar: "شركة OEC", en: "OEC Company" },
      location: { ar: "مدينة القاهره", en: "JEDDAH CITY" },
      image: "/placeholder-company.jpg",
      description: { 
        ar: "شركة رائدة في مجال المقاولات والتطوير العقاري",
        en: "A leading company in contracting and real estate development"
      },
    }];
  };

  const projectsData = buildProjectsData();
  const totalItems = projectsData.length;

  // دالة التنقل التالي
  const nextSlide = useCallback(() => {
    if (totalItems === 0) return;
    setActiveIndex((prev) => (prev + 1) % totalItems);
    setShowDetails(false);
  }, [totalItems]);

  // دالة التنقل السابق
  const prevSlide = useCallback(() => {
    if (totalItems === 0) return;
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    setShowDetails(false);
  }, [totalItems]);

  // تشغيل الحركة التلقائية
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (totalItems <= 1) return;
    
    autoPlayRef.current = setInterval(() => {
      if (isAutoPlaying && !isDragging) {
        nextSlide();
      }
    }, 5000);
  }, [isAutoPlaying, isDragging, nextSlide, totalItems]);

  // إيقاف الحركة التلقائية
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // إعادة تشغيل الحركة التلقائية
  const resetAutoPlay = useCallback(() => {
    if (isAutoPlaying && totalItems > 1) {
      stopAutoPlay();
      startAutoPlay();
    }
  }, [isAutoPlaying, stopAutoPlay, startAutoPlay, totalItems]);

  // بدء الحركة التلقائية عند تحميل المكون
  useEffect(() => {
    if (totalItems > 1 && isAutoPlaying) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [totalItems, isAutoPlaying, startAutoPlay, stopAutoPlay]);

  // 🔥 دالة التنقل لصفحة التفاصيل مع الـ ID
  const navigateToProjectDetails = (projectId: number) => {
    stopAutoPlay();
    navigate(`/projects/${projectId}`);
    resetAutoPlay();
  };

  // عند الضغط على الكارد
  const handleCardClick = (idx: number, projectId: number) => {
    stopAutoPlay();
    
    if (idx === activeIndex && showDetails) {
      navigateToProjectDetails(projectId);
    } else if (idx === activeIndex) {
      setShowDetails(true);
    } else {
      setActiveIndex(idx);
      setShowDetails(true);
    }
    
    resetAutoPlay();
  };

  // 🔥 دالة الضغط على زر "عرض التفاصيل"
  const handleViewDetails = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    navigateToProjectDetails(projectId);
  };

  // التعامل مع السهمين
  const handleNextSlide = () => {
    if (totalItems <= 1) return;
    stopAutoPlay();
    nextSlide();
    resetAutoPlay();
  };

  const handlePrevSlide = () => {
    if (totalItems <= 1) return;
    stopAutoPlay();
    prevSlide();
    resetAutoPlay();
  };

  // التنقل بالماوس
  const handleMouseDown = (e: React.MouseEvent) => {
    if (totalItems <= 1) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    stopAutoPlay();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || totalItems <= 1) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        handlePrevSlide();
      } else {
        handleNextSlide();
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    resetAutoPlay();
  };

  // دالة حساب مواقع العناصر
  const getItemStyle = (index: number) => {
    if (totalItems === 1) {
      return {
        transform: `translateX(0px) translateZ(0px) scale(1) translateY(0px)`,
        opacity: 1,
        filter: "blur(0px) brightness(1)",
        zIndex: 50,
        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
      };
    }

    let position = index - activeIndex;
    
    if (position > totalItems / 2) position -= totalItems;
    if (position < -totalItems / 2) position += totalItems;
    
    const angle = position * (360 / totalItems);
    
    let radius = 320;
    if (windowWidth < 640) radius = 200;
    else if (windowWidth < 768) radius = 250;
    else if (windowWidth < 1024) radius = 300;
    else radius = 350;
    
    const radian = (angle * Math.PI) / 180;
    
    let x = Math.sin(radian) * radius;
    let z = Math.cos(radian) * radius;
    
    return {
      transform: `translateX(${x}px) translateZ(${z}px) scale(1) translateY(0px)`,
      opacity: 1,
      filter: "blur(0px) brightness(1)",
      zIndex: position === 0 ? 50 : 20,
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
    };
  };

  // التحكم في لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevSlide();
      } else if (e.key === "ArrowRight") {
        handleNextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevSlide, handleNextSlide]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.direction = isRTL ? "rtl" : "ltr";
    }
  }, [isRTL]);

  const getText = (item: any, field: string) => {
    if (!item) return '';
    if (typeof item[field] === 'object') {
      return item[field][lang] || item[field].en || '';
    }
    return item[field] || '';
  };

  // لو لسه بتحمل
  if (loading) {
    return (
      <section className={`py-12 sm:py-16 md:py-20 min-h-screen transition-all duration-500 overflow-hidden ${
        isDark ? 'bg-black' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <Skeleton className="h-12 w-48 mx-auto bg-gray-300 dark:bg-gray-700" />
            <div className="w-20 sm:w-24 h-1 bg-[#e0b277] mx-auto mt-4 sm:mt-6 rounded-full"></div>
          </div>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#e0b277]"></div>
          </div>
        </div>
      </section>
    );
  }

  // لو في خطأ
  if (error) {
    return (
      <section className={`py-12 sm:py-16 md:py-20 min-h-screen transition-all duration-500 overflow-hidden ${
        isDark ? 'bg-black' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
      </section>
    );
  }

  return (
    <>
    <Nav/>
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
              {lang === 'ar' ? ' شركتنا' : ' Our Company'}
            </h1>
            <div className="w-20 h-1 bg-[#c9a03d] mx-auto mb-4 rounded-full" />
            <p className="text-base md:text-lg max-w-2xl mx-auto text-gray-200">
              {lang === 'ar' 
                ? 'نفخر بتقديم أفضل المشاريع التي تعكس جودة عملنا واحترافيتنا'
                : 'We are proud to present the best projects that reflect our quality and professionalism'}
            </p>
          </motion.div>
        </div>
      </div>
    <section className={`py-12 sm:py-16 md:py-20 min-h-screen transition-all duration-500 overflow-hidden ${
      isDark 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - نفس تصميم ServicesSection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
         
       
        </motion.div>

        {/* Carousel 3D Container - نفس تصميم ServicesSection */}
        <div 
          ref={containerRef}
          className="relative flex items-center justify-center min-h-[450px] sm:min-h-[550px] md:min-h-[650px]"
          style={{ perspective: windowWidth < 640 ? "800px" : "1200px" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseEnter={stopAutoPlay}
        >
          <div 
            className="relative w-full h-[400px] sm:h-[480px] md:h-[550px] flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {projectsData.map((project, idx) => {
              const Icon = projectIcons[idx % projectIcons.length];
              const isActive = idx === activeIndex;
              const style = getItemStyle(idx);
              
              return (
                <motion.div
                  key={project.id || idx}
                  className="absolute cursor-pointer"
                  style={style}
                  onClick={() => handleCardClick(idx, project.id)}
                >
                  <div className={`
                    relative w-[180px] sm:w-[220px] md:w-[260px] lg:w-[280px] rounded-2xl overflow-hidden
                    transition-all duration-500 shadow-xl
                    ${isDark 
                      ? 'bg-gray-800 shadow-gray-900/50' 
                      : 'bg-white shadow-gray-300/50'
                    }
                    ${isActive 
                      ? `ring-2 sm:ring-3 ring-[#e0b277] shadow-[0_0_30px_rgba(201,160,61,0.4)] 
                         ${isDark ? 'shadow-[#e0b277]/20' : 'shadow-[#e0b277]/30'}`
                      : ''
                    }
                  `}>
                    {/* الصورة */}
                    <div className="relative h-[160px] sm:h-[200px] md:h-[240px] lg:h-[260px] overflow-hidden">
                      <img
                        src={project.image}
                        alt={getText(project, 'title')}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-company.jpg';
                        }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${
                        isDark 
                          ? 'from-black/80 via-black/30 to-transparent'
                          : 'from-black/60 via-black/20 to-transparent'
                      }`} />

                      {/* أيقونة المشروع */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                        <div className={`p-2 sm:p-2.5 rounded-full ${
                          isDark ? 'bg-black/60' : 'bg-white/90'
                        } backdrop-blur-sm`}>
                          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            isDark ? 'text-[#e0b277]' : 'text-gray-700'
                          }`} />
                        </div>
                      </div>
                    </div>

                    {/* المحتوى */}
                    <div className={`p-3 sm:p-4 md:p-5 transition-all duration-500 ${
                      isActive && showDetails 
                        ? (isDark ? 'bg-gray-800' : 'bg-white')
                        : ''
                    }`}>
                      <h3 className={`font-bold transition-all duration-500 text-center
                        ${isActive 
                          ? `text-base sm:text-lg md:text-xl ${isDark ? 'text-[#e0b277]' : 'text-gray-800'} mb-2 sm:mb-3` 
                          : `text-sm sm:text-base md:text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`
                        }`}
                      >
                        {getText(project, 'title')}
                      </h3>
                      
                      {/* عرض التفاصيل للعنصر النشط */}
                      <AnimatePresence>
                        {isActive && showDetails && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className={`text-xs sm:text-sm text-center ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {getText(project, 'description')}
                            </p>
                            
                            {/* زر عرض التفاصيل */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToProjectDetails(project.id);
                              }}
                              className={`mt-2 text-xs sm:text-sm font-semibold ${
                                isDark ? 'text-[#e0b277]' : 'text-[#e0b277]'
                              } hover:underline`}
                            >
                              {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'} →
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* أزرار التنقل - نفس تصميم ServicesSection */}
          {totalItems > 1 && (
            <>
              <button
                onClick={handlePrevSlide}
                className={`absolute left-2 sm:left-4 md:left-8 lg:left-10 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full 
                  transition-all duration-300 hover:scale-110 z-20 flex items-center justify-center shadow-xl
                  ${isDark 
                    ? 'bg-[#e0b277] hover:bg-[#b88d2e] text-white' 
                    : 'bg-gray-800 hover:bg-gray-900 text-white'
                  }`}
                aria-label={lang === 'ar' ? 'السابق' : 'Previous'}
              >
                <ChevronLeft className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={handleNextSlide}
                className={`absolute right-2 sm:right-4 md:right-8 lg:right-10 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full 
                  transition-all duration-300 hover:scale-110 z-20 flex items-center justify-center shadow-xl
                  ${isDark 
                    ? 'bg-[#e0b277] hover:bg-[#b88d2e] text-white' 
                    : 'bg-gray-800 hover:bg-gray-900 text-white'
                  }`}
                aria-label={lang === 'ar' ? 'التالي' : 'Next'}
              >
                <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </>
          )}

          {/* مؤشر التشغيل التلقائي - نفس تصميم ServicesSection */}
          {totalItems > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isAutoPlaying ? 'bg-[#e0b277] w-4' : 'bg-white/50'}`} />
              <div className="w-2 h-2 rounded-full bg-white/50" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
            </div>
          )}
        </div>
      </div>
    </section>
    <Footer/>
    </>
    
  );
};

export default ProjectsPreview;