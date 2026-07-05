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
  Globe,
  Building,
  Award,
  Users,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import Marquee from "react-marquee-slider";

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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
                onClick={() => navigate('/companies')}
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

  // ✅ بناء بيانات الشركة - نضيف year_founded و location
  const companyData = {
    id: company.id,
    name: company.title || company.name || `شركة ${company.id}`,
    description: company.long_description || company.description || "شركة رائدة في مجالها",
    image: company.image?.fullUrl || company.imageUrl || fallbackImages[0],
    gallery: company.gallery || [],
    location: company.location || "غير محدد", // ✅ من الـ API
    founded: company.year_founded || "غير محدد", // ✅ من الـ API
    year_founded: company.year_founded || "غير محدد",
    website: company.website || "",
    active: company.active ?? true,
  };

  // تجهيز صور المعرض المتحرك
  const galleryImages = companyData.gallery.length > 0 
    ? companyData.gallery.map(img => img.fullUrl)
    : [companyData.image, companyData.image, companyData.image, companyData.image];

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
            onClick={() => navigate('/companies')}
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

          {/* معلومات الشركة */}
          <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
             
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3">
                {companyData.name}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-gray-200 text-sm md:text-base">
                {/* ✅ الموقع */}
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4" />
                  <span>{companyData.location}</span>
                </div>
                
                {/* ✅ سنة التأسيس */}
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تأسست: ' : 'Founded: '}{companyData.founded}</span>
                </div>
                
                {/* ✅ حالة النشاط */}
              
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
            {/* ✅ بطاقة المعلومات السريعة */}
            <div className={`rounded-2xl p-6 md:p-8 mb-8 ${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* الموقع */}
                <div className={`flex items-center gap-3 p-4 rounded-xl ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <MapPin className={`w-8 h-8 text-[#e0b277]`} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {lang === 'ar' ? 'الموقع' : 'Location'}
                    </p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {companyData.location}
                    </p>
                  </div>
                </div>

                {/* سنة التأسيس */}
                <div className={`flex items-center gap-3 p-4 rounded-xl ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <Calendar className={`w-8 h-8 text-[#e0b277]`} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {lang === 'ar' ? 'سنة التأسيس' : 'Founded'}
                    </p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {companyData.founded}
                    </p>
                  </div>
                </div>

                {/* حالة الشركة */}
                <div className={`flex items-center gap-3 p-4 rounded-xl ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <Award className={`w-8 h-8 text-[#e0b277]`} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {lang === 'ar' ? 'الحالة' : 'Status'}
                    </p>
                    <p className={`font-semibold ${
                      companyData.active ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {companyData.active 
                        ? (lang === 'ar' ? '✅ نشطة' : '✅ Active')
                        : (lang === 'ar' ? '❌ غير نشطة' : '❌ Inactive')
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* وصف الشركة */}
            <div className={`rounded-2xl p-6 md:p-8 mb-8 ${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg`}>
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {lang === 'ar' ? '📋 عن الشركة' : '📋 About Company'}
              </h2>
              <p className={`text-base md:text-lg leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {companyData.description}
              </p>
            </div>

            {/* معرض الصور المتحرك - Marquee */}
            {isClient && galleryImages.length > 0 && (
              <div className={`rounded-2xl p-6 md:p-8 mb-8 ${
                isDark ? 'bg-gray-800/50' : 'bg-white'
              } shadow-lg overflow-hidden`}>
                <h3 className={`text-2xl md:text-3xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {lang === 'ar' ? '🖼️ معرض الصور' : '🖼️ Gallery'}
                </h3>
                
                <div className="relative w-full overflow-hidden">
                  <Marquee
                    velocity={8}
                    direction={isRTL ? "rtl" : "ltr"}
                    resetAfterTries={200}
                    scatterRandomly={false}
                    onInit={() => {}}
                    onFinish={() => {}}
                  >
                    {galleryImages.map((imageUrl, index) => (
                      <div 
                        key={index} 
                        className="marquee-item cursor-pointer"
                        onClick={() => setSelectedImage(imageUrl)}
                      >
                        <div className="relative group rounded-xl overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={`${companyData.name} - ${index + 1}`}
                            className="marquee-image"
                            loading="lazy"
                            onError={(e) => {
                              const fallbackIndex = index % fallbackImages.length;
                              e.currentTarget.src = fallbackImages[fallbackIndex];
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </Marquee>
                </div>
              </div>
            )}

            {/* أزرار التنقل */}
            <div className={`rounded-2xl p-6 md:p-8 ${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button
                  onClick={() => navigate('/companies')}
                  className={`flex items-center gap-2 text-[#e0b277] hover:text-[#b88d2e] transition-colors font-semibold ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  {lang === 'ar' ? 'العودة للشركات' : 'Back to Companies'}
                </button>
                
                <Link
                  to="/contact"
                  className="bg-[#e0b277] hover:bg-[#b88d2e] text-white px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-[#e0b277]/30"
                >
                  {lang === 'ar' ? '📞 تواصل معنا' : '📞 Contact Us'}
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

      <style jsx>{`
        .marquee-item {
          padding: 0 15px;
          display: inline-block;
        }
        
        .marquee-image {
          height: 200px;
          width: 320px;
          padding: 8px;
          border-radius: 12px;
          transition: all 0.3s ease;
          object-fit: cover;
          background: ${isDark ? '#1f2937' : '#f3f4f6'};
        }
        
        .marquee-image:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        }
        
        :global(.dark) .marquee-image {
          background: #1f2937;
          filter: brightness(0.9);
        }
        
        :global(.dark) .marquee-image:hover {
          filter: brightness(1);
          background: #374151;
        }
        
        @media (max-width: 768px) {
          .marquee-item {
            padding: 0 10px;
          }
          .marquee-image {
            height: 150px;
            width: 240px;
            padding: 6px;
          }
        }
        
        @media (max-width: 480px) {
          .marquee-image {
            height: 120px;
            width: 180px;
            padding: 4px;
          }
        }
      `}</style>
    </>
  );
};

export default CompanyDetails;