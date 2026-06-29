import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Eye, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "@/assets/13a1f55a4c1c5ac1592960c5af0be1dfeeab1a7e.png";
import section from "@/assets/bdf801b1fc1cfc95f3230188d73bf989e5b386cc.png";
import { useTheme } from "@/contexts/ThemeContext";

const About = () => {
  const { t, dir } = useLanguage();  // t هو object وليس function
  const { isDark } = useTheme();
  const isRTL = dir === "rtl";

  return (
    <div className="min-h-screen">
      <Navbar />

     <section className="relative w-full h-screen">
        <img
          src={Hero}
          alt="About"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <h1
            className="text-[60px] md:text-[70px] font-bold text-white "
          
          >
            {t.projects?.page3}
          </h1>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={section}
                  alt="Engineering"
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-[#e0b277]/20"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-2xl">
                {t.projects.section3}  {/* استخدام ككائن */}
              </p>


      
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default About;