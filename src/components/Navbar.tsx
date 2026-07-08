// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Mail, Phone, Globe, Sun, Moon, Menu, X, ChevronDown, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 🔥 استيراد الشعارات حسب الوضع
import logoWhite from "@/assets/logodark.png";
import logoDark from "@/assets/logowhite.png";
import { useServices } from "@/hooks/useServices";
import { useCompany } from "@/hooks/useCompany";
import { useContact } from "@/hooks/useContact";

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // 🔥 جلب البيانات
  const { services } = useServices({ perPage: 10 });
  const { companies } = useCompany({ perPage: 10 });
  const { contactData } = useContact();

  // 🔥 حالة الفتح للـ Dropdown
  const [openDropdown, setOpenDropdown] = useState<'services' | 'company' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔥 اختيار الشعار المناسب حسب الوضع
  const logoSrc = isDark ? logoWhite : logoDark;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // 🔥 إغلاق الـ Dropdown عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (type: 'services' | 'company') => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const isRTL = lang === "ar";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const textMuted = isDark ? "text-white/70" : "text-gray-600";
  const borderColor = isDark ? "border-white/10" : "border-gray-200";
  const hoverBg = "hover:bg-[#e0b277] hover:text-black transition-colors duration-300";

  // روابط الـ Nav
  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/projects", label: t.nav.projects },
    { to: "/services", label: t.nav.services },
    { to: "/contact", label: t.nav.contact },
    { to: "/news", label: t.nav.news },
    { to: "/careers", label: t.nav.careers },
    { to: "/faq", label: t.nav.faq },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${bgColor}/50 backdrop-blur-sm shadow-lg`} 
      dir={isRTL ? "rtl" : "ltr"}
    >
      
      <div className={`hidden md:block border-b ${borderColor}`}>
        <div className="container mt-2 mx-auto px-4 sm:px-6 h-[80px] relative">
          
          {/* اللوجو - مكبر */}
          <Link to="/" className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex items-center" dir="ltr">
            <img src={logoSrc} alt="logo" className="h-14 md:h-16 lg:h-16 object-contain" />
          </Link>

          {/* البيانات - إزالة الإيميل والموبايل وإضافة زر تواصل معنا */}
          <div className={`flex items-center h-full gap-3 text-xs md:text-sm ${textMuted} ${isRTL ? "justify-start " : "justify-end pl-28"}`}>
            
            {/* 🔥 زر تواصل معنا - من الـ API */}
            <Link
              to="/contact"
              style={{borderRadius:"10px"}}
              className={`flex items-center gap-2 px-4 py-2  transition-all duration-300 font-medium ${
                isDark 
                  ? 'bg-[#e0b277] hover:bg-[#b88d2e] text-black' 
                  : 'bg-[#e0b277] hover:bg-[#b88d2e] text-black'
              } shadow-lg hover:shadow-[#e0b277]/30 hover:scale-105`}
            >
              <MessageCircle size={16} />
              <span>{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span>
            </Link>
            
            {/* أزرار اللغة والثيم */}
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className={`flex items-center gap-1 px-2 py-1 rounded-full transition text-xs ${isDark ? "bg-white/10" : "bg-gray-100"} ${hoverBg}`}>
              <Globe size={12} />{lang === "ar" ? "EN" : "عربي"}
            </button>
            
            <button onClick={toggle} className={`p-1.5 rounded-full transition ${isDark ? "bg-white/10" : "bg-gray-100"} ${hoverBg}`}>
              {isDark ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* الصف الثاني - الروابط مع Dropdown */}
      <div className={`hidden md:block ${bgColor}/50`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-x-8 lg:gap-x-12 py-3">
            
            {/* الروابط العادية */}
            {links.map((l) => {
              // 🔥 استثناء خدمات وشركات عشان نضيف لهم Dropdown
              if (l.to === "/services") {
                return (
                  <div key={l.to} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => toggleDropdown('services')}
                      className={`relative flex items-center gap-1 text-sm md:text-base font-medium transition duration-300 ${
                        location.pathname === l.to || location.pathname.startsWith('/services/')
                          ? "text-[#e0b277]"
                          : isDark
                          ? "text-white/80 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {l.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* 🔥 Dropdown الخدمات */}
                    <AnimatePresence>
                      {openDropdown === 'services' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl shadow-2xl overflow-hidden ${
                            isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="py-2 max-h-72 overflow-y-auto">
                            {services.length > 0 ? (
                              services.slice(0, 10).map((service) => (
                                <Link
                                  key={service.id}
                                  to={`/services/${service.id}`}
                                  onClick={() => setOpenDropdown(null)}
                                  className={`block px-4 py-2 text-sm transition-colors ${
                                    isDark 
                                      ? 'text-gray-300 hover:bg-gray-800 hover:text-[#e0b277]' 
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#e0b277]'
                                  }`}
                                >
                                  {service.title}
                                </Link>
                              ))
                            ) : (
                              <div className={`px-4 py-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {lang === 'ar' ? 'لا توجد خدمات' : 'No services'}
                              </div>
                            )}
                            <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} mt-2 pt-2`}>
                              <Link
                                to="/services"
                                onClick={() => setOpenDropdown(null)}
                                className={`block px-4 py-2 text-sm font-semibold text-[#e0b277] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                              >
                                {lang === 'ar' ? 'عرض جميع المشاريع →' : 'View all projects →'}
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // 🔥 استثناء الشركات
              if (l.to === "/projects") {
                return (
                  <div key={l.to} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => toggleDropdown('company')}
                      className={`relative flex items-center gap-1 text-sm md:text-base font-medium transition duration-300 ${
                        location.pathname === l.to || location.pathname.startsWith('/projects/')
                          ? "text-[#e0b277]"
                          : isDark
                          ? "text-white/80 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {l.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === 'company' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* 🔥 Dropdown الشركات */}
                   {/* 🔥 Dropdown الشركات - التعديل */}
{/* 🔥 Dropdown الشركات - عرض كل الشركات */}
<AnimatePresence>
  {openDropdown === 'company' && (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl shadow-2xl overflow-hidden ${
        isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}
    >
      <div className="py-2 max-h-72 overflow-y-auto">
        {companies.length > 0 ? (
          // 🔥 عرض كل الشركات (أو أول 10)
          companies.slice(0, 10).map((company) => (
            <Link
              key={company.id}
              to={`/projects/${company.id}`}
              onClick={() => setOpenDropdown(null)}
              className={`block px-4 py-2 text-sm transition-colors ${
                isDark 
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-[#e0b277]' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#e0b277]'
              }`}
            >
              {company.title}
            </Link>
          ))
        ) : (
          <div className={`px-4 py-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {lang === 'ar' ? 'لا توجد شركات' : 'No companies'}
          </div>
        )}
        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} mt-2 pt-2`}>
          <Link
            to="/projects"
            onClick={() => setOpenDropdown(null)}
            className={`block px-4 py-2 text-sm font-semibold text-[#e0b277] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
          >
            {lang === 'ar' ? 'عرض جميع الشركات →' : 'View all companies →'}
          </Link>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
                  </div>
                );
              }

              // الروابط العادية - تم إزالة الخط السفلي
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative text-sm md:text-base font-medium transition duration-300 ${
                    location.pathname === l.to
                      ? "text-[#e0b277]"
                      : isDark
                      ? "text-white/80 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🔹 الموبايل */}
      <div className="md:hidden">
        {/* الصف الأول في الموبايل */}
        <div className={`px-3 py-2 flex items-center justify-between ${bgColor}/${scrolled ? "95" : "90"} backdrop-blur-sm border-b ${borderColor}`}>
          <Link to="/" className="flex items-center gap-1.5" dir="ltr">
            <img src={logoSrc} alt="logo" className="h-7 object-contain" />
            <h2 className={`text-[9px] font-semibold ${textColor}`}>{t.nav.name}</h2>
          </Link>
          
          <div className={`flex items-center gap-2 ${textMuted}`}>
            {/* زر تواصل معنا في الموبايل */}
            <Link
              to="/contact"
              className={`p-1.5 rounded-full ${isDark ? 'bg-[#e0b277]' : 'bg-[#e0b277]'} text-white`}
            >
              <MessageCircle size={16} />
            </Link>
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="p-1">
              <Globe size={15} />
            </button>
            <button onClick={toggle} className="p-1">
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* القائمة المنسدلة للموبايل - تم إزالة الخط السفلي */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`${bgColor}/95 backdrop-blur-md border-t ${borderColor}`}
            >
              <div className="px-3 py-2 space-y-0.5">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`block py-2.5 text-sm font-medium transition duration-300 ${
                      location.pathname === l.to
                        ? "text-[#e0b277]"
                        : isDark
                        ? "text-white/80 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;