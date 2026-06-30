// src/pages/FAQ.tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircle
} from "lucide-react";
import api from "@/lib/api";
import faqHeroImage from "@/assets/faq-hero.jpeg"; // ← استورد الصورة

// Interface للـ FAQ
interface FAQItem {
  id: number;
  name: string;      // السؤال
  des: string;       // الإجابة
  active: boolean;
  deleted: boolean;
}

const FAQ = () => {
  const { lang, dir } = useLanguage();
  const { isDark } = useTheme();
  const isRTL = dir === "rtl";
  
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // جلب البيانات
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await api.post('faq/index',{
        
filters
: 
{active: true}
      });
      console.log('FAQ Response:', response.data); // للتأكد من البيانات
      
      if (response.data.status === 200 && response.data.result === 'Success') {
        setFaqs(response.data.data);
      } else {
        setError('Failed to load FAQs');
      }
    } catch (err) {
      setError('Error loading FAQs');
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };
  // جلب البيانات عند تحميل المكون
  useState(() => {
    fetchFAQs();
  }, []);

  // حالة التحميل
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen py-20 px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Skeleton className="h-12 w-64 mx-auto bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-4 w-96 mx-auto mt-4 bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800/50' : 'bg-white'} shadow-lg`}>
                  <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700" />
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
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg max-w-2xl mx-auto">
              <p className="font-semibold">⚠️ {error}</p>
              <button 
                onClick={() => fetchFAQs()}
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

  // لو مفيش أسئلة
  if (faqs.length === 0) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen py-20 px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="container mx-auto max-w-4xl text-center">
            <div className={`rounded-2xl p-12 ${isDark ? 'bg-gray-800/50' : 'bg-white'} shadow-lg`}>
              <HelpCircle className={`w-20 h-20 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {lang === 'ar' ? ' لا توجد أسئلة شائعة' : ' No FAQs Available'}
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {lang === 'ar' ? 'سيتم إضافة الأسئلة قريباً' : 'FAQs will be added soon'}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // تبديل فتح/غلق السؤال
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        
        {/* Hero Section مع صورة خلفية - نفس ستايل NewsLetters */}
        <div className="relative h-[50vh] min-h-[300px] md:min-h-[600px] overflow-hidden">
          {/* صورة الخلفية */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${faqHeroImage})` }}
          >
            {/* overlay داكن عشان النص يبان */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          </div>
          
          {/* المحتوى فوق الصورة */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                  {lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                </h1>
              </div>
              <div className="w-20 h-1 bg-[#e0b277] mx-auto mb-4 rounded-full" />
              <p className="text-base md:text-lg max-w-2xl mx-auto text-gray-200">
                {lang === 'ar' 
                  ? 'أجوبة على أكثر الأسئلة شيوعاً'
                  : 'Answers to the most frequently asked questions'}
              </p>
            </motion.div>
          </div>
        </div>


        {/* قائمة الأسئلة */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800/50 hover:shadow-2xl hover:shadow-[#e0b277]/5' 
                    : 'bg-white hover:shadow-2xl hover:shadow-gray-300/20'
                } ${openIndex === index ? 'ring-2 ring-[#e0b277]' : ''}`}
              >
                {/* السؤال - زر الضغط */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 md:p-6 text-left flex items-start justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      <MessageCircle className={`w-5 h-5 ${isDark ? 'text-[#e0b277]' : 'text-[#e0b277]'}`} />
                    </div>
                    <h3 className={`text-lg md:text-xl font-semibold transition-colors ${
                      isDark 
                        ? 'text-white group-hover:text-[#e0b277]' 
                        : 'text-gray-800 group-hover:text-[#e0b277]'
                    }`}>
                      {faq.name}
                    </h3>
                  </div>
                  
                  <div className={`flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}>
                    {openIndex === index ? (
                      <ChevronUp className={`w-6 h-6 ${isDark ? 'text-[#e0b277]' : 'text-[#e0b277]'}`} />
                    ) : (
                      <ChevronDown className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                    )}
                  </div>
                </button>

                {/* الإجابة - تظهر عند الضغط */}
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className={`px-5 md:px-6 pb-5 md:pb-6 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className={`pt-2 border-t ${
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-full min-h-[20px] bg-[#e0b277] rounded-full flex-shrink-0" />
                        <p className="text-sm md:text-base leading-relaxed">
                          {faq.des}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* إحصائيات */}
          <div className="mt-12 text-center">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
              isDark ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg`}>
              <HelpCircle className={`w-5 h-5 ${isDark ? 'text-[#e0b277]' : 'text-[#e0b277]'}`} />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                {lang === 'ar' 
                  ? `لدينا ${faqs.length} سؤال شائع`
                  : `We have ${faqs.length} frequently asked questions`}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;