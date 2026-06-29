import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ServicesSection from "@/components/ServicesSection";
import { useLanguage } from "@/i18n/LanguageContext";
import Hero from "@/assets/2.jpeg";

const Services = () => {
  const { t, lang, dir } = useLanguage();
  const isRTL = dir === "rtl";

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center">
        {/* الصورة */}
        <img
          src={Hero}
          alt="Services"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* طبقة التعتيم */}
        <div className="absolute inset-0 bg-black/60 "></div>
        
        {/* المحتوى */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wider">
            {t.projects?.title || (lang === 'ar' ? 'خدماتنا' : 'Our Services')}
          </h1>
          
          <div className="w-20 h-1 bg-[#e0b277] mx-auto mb-6 rounded-full" />
          
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ar' 
              ? 'نفخر بتقديم أفضل المشاريع التي تعكس جودة عملنا واحترافيتنا'
              : 'We are proud to present the best projects that reflect our quality and professionalism'}
          </p>
        </div>
      </section>
      
      <ServicesSection />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Services;