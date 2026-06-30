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
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    const timer = setTimeout(() => setIsLoading(false), 300);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <>

      <div className="min-h-screen overflow-x-hidden bg-background">
        <Navbar />
        
        <main>
          <HeroSection />

          {/* About Preview Section */}
        

          <About />
          <ServicesSection />
            <DownloadSection />
          <ProjectsPreview />
        </main>

        <Footer />
        <FloatingButtons />

        {/* Scroll to Top Button */}
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
    </>
  );
};

export default Index;