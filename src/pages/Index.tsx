import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsPreview from "@/components/ProjectsPreview";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import About from "@/components/about";
import DownloadSection from "@/components/dwonload";

const Index = () => {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من اكتمال تحميل الصفحة
    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      const handleLoad = () => setIsLoading(false);
      window.addEventListener('load', handleLoad);
      
      // مهلة أمان في حالة تعطل حدث load
      const timeout = setTimeout(() => setIsLoading(false), 1000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeout);
      };
    }
  }, []);

  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 500);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // لا نعرض شاشة تحميل، نعرض المحتوى فوراً
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      
      <main>
        <HeroSection />
        <About />
        <ServicesSection />
        <ProjectsPreview />
      </main>

      <Footer />
      <FloatingButtons />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="العودة للأعلى"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Index;