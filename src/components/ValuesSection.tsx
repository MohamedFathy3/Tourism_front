// components/ValuesSection.jsx
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Award, Clock, Lightbulb, Eye } from "lucide-react";

// صور للكروت - استبدلها بصورك
import value1 from "@/assets/ايقون .png";
import value2 from "@/assets/ايقون -.png";
import value3 from "@/assets/ايقون ٣.png";
import value4 from "@/assets/ايقون ٨.png";

const icons = [Award, Clock, Lightbulb, Eye];

const valueImages = [value1, value2, value3, value4];

const ValuesSection = () => {
  const { t, lang, dir } = useLanguage();
  const { isDark } = useTheme();
  const isRTL = dir === "rtl";

  const values = t.values?.items || [];
  const title = t.values?.title || "قيمنا";
  const subtitle = t.values?.subtitle || "نؤمن بهذه القيم التي توجه عملنا";

  // تنسيقات الحركة
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className={`py-20 px-4 transition-all duration-500 ${
      isDark 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="container mx-auto max-w-6xl">
  

        {/* الكروت */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((item, index) => {
            const Icon = icons[index % icons.length];
            const imageUrl = valueImages[index % valueImages.length];
            
            return (
              <motion.div
                key={item.id || index}
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`group rounded-xl overflow-hidden transition-all duration-500 ${
                  isDark 
                    ? 'bg-gray-800  ' 
                    : 'bg-white '
                }`}
              >
                <div className="relative h-68 ">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full  object-cover transition-transform duration-700 group-hover:scale-110 bg-black dark:bg-transparent"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isDark 
                      ? 'from-gray-900 via-gray-900/50 to-transparent' 
                      : 'from-black/60 via-black/20 to-transparent'
                  }`} />
                  
                
                </div>

                {/* المحتوى */}
                <div className="p-5 pt-8">
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 text-center ${
                    isDark ? 'text-white group-hover:text-[#e0b277]' : 'text-gray-800 group-hover:text-[#e0b277]'
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed text-center transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.desc}
                  </p>
                  
                  {/* رقم الكارت */}
                  <div className="mt-4 text-center">
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                      isDark 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;