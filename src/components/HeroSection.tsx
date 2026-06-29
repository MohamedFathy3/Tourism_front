// src/components/HeroSection.tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useHeroSlider } from "@/hooks/useHeroSlider";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const { t } = useLanguage();
  const { 
    sliders, 
    currentSlider, 
    loading, 
    error, 
    currentIndex,
    goToNext,
    goToPrev,
    goToSlide 
  } = useHeroSlider();
  const [mediaError, setMediaError] = useState(false);

  // التنقل التلقائي كل 5 ثواني
  useEffect(() => {
    if (sliders.length <= 1) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 5000); // 5 seconds
    
    return () => clearInterval(interval);
  }, [sliders.length, goToNext]);

  // إعادة تعيين خطأ الميديا عند تغيير السلايدر
  useEffect(() => {
    setMediaError(false);
  }, [currentIndex]);

  // لو لسه بتحمل
  if (loading) {
    return (
      <section className="relative min-h-screen sm:h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4" />
          <p className="text-lg">جاري تحميل السلايدرات...</p>
        </div>
      </section>
    );
  }

  // لو في خطأ أو مفيش سلايدرات
  if (error || sliders.length === 0) {
    return (
      <section className="relative min-h-screen sm:h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t.hero.title}
          </h1>
          <Link
            to="/about"
            className="inline-block mt-4 px-8 py-3 border-2 border-white text-white rounded-full hover:bg-primary hover:border-primary transition-all duration-300"
          >
            {t.hero.cta}
          </Link>
        </div>
      </section>
    );
  }

  // تحديد الخلفية (فيديو أو صورة)
  const renderBackground = () => {
    if (mediaError || !currentSlider) {
      // خلفية احتياطية
      return <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />;
    }

    const mediaUrl = currentSlider.image?.fullUrl || currentSlider.imageUrl;
    const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.webm') || mediaUrl?.includes('.mov');

    if (isVideo) {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={currentSlider.image?.previewUrl || "https://via.placeholder.com/1920x1080"}
          onError={() => setMediaError(true)}
          key={mediaUrl}
        >
          <source src={mediaUrl} type="video/mp4" />
          <source src={mediaUrl} type="video/webm" />
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      );
    }

    // صورة خلفية
    return (
      <img
        src={mediaUrl}
        alt={currentSlider.title || "Hero background"}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setMediaError(true)}
      />
    );
  };

  return (
    <section className="relative min-h-screen sm:h-[90vh] flex items-center justify-center overflow-hidden">
      {/* خلفية الصفحة مع AnimatePresence للحركة */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {renderBackground()}
        </motion.div>
      </AnimatePresence>
      
      {/* طبقة التعتيم المحسنة */}
      <div className="absolute inset-0 bg-black/50 md:bg-[hsl(var(--hero-overlay)/0.55)]" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-0">
        {/* المحتوى الأساسي مع AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* عنوان - من API */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
              {currentSlider?.title || t.hero.title}
              <br className="hidden sm:block" />
            </h1>
            
            {/* وصف - من API */}
            {currentSlider?.description && (
              <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-4 sm:mb-6 px-4">
                {currentSlider.description}
              </p>
            )}
            
            {/* زر CTA متجاوب */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/about"
                className="inline-block mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white text-white rounded-full text-sm sm:text-base font-semibold hover:bg-primary hover:border-primary transition-all duration-300 hover:scale-105 transform"
              >
                {t.hero.cta}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* أزرار التنقل - تظهر فقط لو في أكثر من سلايدر */}
        {sliders.length > 1 && (
          <>
            {/* زر السابق */}
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 p-2 rounded-full transition-all duration-300 text-white backdrop-blur-sm"
              aria-label="السابق"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* زر التالي */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 p-2 rounded-full transition-all duration-300 text-white backdrop-blur-sm"
              aria-label="التالي"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </>
        )}

        {/* مؤشر التمرير للأسفل */}
     
      </div>
    </section>
  );
};

export default HeroSection;