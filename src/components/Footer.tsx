// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Globe, Clock } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaInstagram, FaSnapchat } from "react-icons/fa";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useContact } from "@/hooks/useContact";
import logoWhite from "@/assets/logodark.png";
import logoDark from "@/assets/logowhite.png";
import barkcodeImage from "@/assets/barkcode.png";

const Footer = () => {
  const { lang, dir } = useLanguage();
  const { isDark } = useTheme();
  const { contactPage, loading } = useContact();
  const isRTL = dir === "rtl";

  // 🔥 اختيار الشعار المناسب حسب الوضع
  const logoSrc = isDark ? logoWhite : logoDark;

  // جلب بيانات التواصل من الـ API
  const contactData = contactPage?.data?.[0] || null;

  const quickLinks = [
    { to: "/", label: lang === 'ar' ? "الرئيسية" : "Home" },
    { to: "/about", label: lang === 'ar' ? "من نحن" : "About Us" },
    { to: "/services", label: lang === 'ar' ? "خدماتنا" : "Services" },
    { to: "/projects", label: lang === 'ar' ? "مشاريعنا" : "Projects" },
    { to: "/contact", label: lang === 'ar' ? "تواصل معنا" : "Contact Us" },
  ];

  // const socialLinks = [
  //   { icon: FaFacebook, href: "https://www.facebook.com/osusaletqan/?locale=ar_AR" },
  //   { icon: FaTwitter, href: "https://twitter.com" },
  //   { icon: FaLinkedin, href: "https://www.linkedin.com/company/111157927/admin/dashboard/" },
  //   { icon: FaYoutube, href: "https://www.youtube.com/@osusaletqan" },
  //   { icon: FaInstagram, href: "https://www.instagram.com/oecaletqan/" },
  //   { icon: FaSnapchat, href: "https://www.snapchat.com/@oecaletqan" },
  // ];

  return (
    <footer className={`${isDark ? 'bg-black' : 'bg-white'} text-gray-300 pt-12 sm:pt-16 pb-6 sm:pb-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* الأعمدة المتجاوبة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          
          {/* العمود الأول: اللوجو والشعار */}
          <div className="text-center">
            <div className="flex flex-col items-center mb-4">
              <img 
                src={logoSrc} 
                alt="logo" 
                className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div className="text-center">
            <h3 className={`${isDark ? 'text-white' : 'text-gray-800'} font-bold text-base sm:text-lg mb-4 pb-2 border-b-2 border-[#e0b277] inline-block`}>
              {lang === 'ar' ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.to} 
                    className={`${isDark ? 'text-gray-400 hover:text-[#e0b277]' : 'text-gray-600 hover:text-[#e0b277]'} transition-colors duration-300 text-sm sm:text-base block py-1`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الثالث: بيانات التواصل - من API */}
          <div className="text-center">
            <h3 className={`${isDark ? 'text-white' : 'text-gray-800'} font-bold text-base sm:text-lg mb-4 pb-2 border-b-2 border-[#e0b277] inline-block`}>
              {lang === 'ar' ? "بيانات التواصل" : "Contact Info"}
            </h3>
            
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              </div>
            ) : contactData ? (
              <div className="space-y-3 sm:space-y-4">
                
                {/* رقم الهاتف الأول */}
                {contactData.phone_one && (
                  <div className="flex gap-3 items-center justify-center">
                    <Phone className="text-[#e0b277] shrink-0" size={18} />
                    <a 
                      href={`tel:${contactData.phone_one}`} 
                      className={`${isDark ? 'text-gray-400 hover:text-[#e0b277]' : 'text-gray-600 hover:text-[#e0b277]'} transition-colors duration-300 text-sm sm:text-base`}
                      dir="ltr"
                    >
                      {contactData.phone_one}
                    </a>
                  </div>
                )}

                {/* رقم الهاتف الثاني */}
                {contactData.phone_two && (
                  <div className="flex gap-3 items-center justify-center">
                    <Phone className="text-[#e0b277] shrink-0" size={18} />
                    <a 
                      href={`tel:${contactData.phone_two}`} 
                      className={`${isDark ? 'text-gray-400 hover:text-[#e0b277]' : 'text-gray-600 hover:text-[#e0b277]'} transition-colors duration-300 text-sm sm:text-base`}
                      dir="ltr"
                    >
                      {contactData.phone_two}
                    </a>
                  </div>
                )}
                
                {/* البريد الإلكتروني */}
                {contactData.email && (
                  <div className="flex gap-3 items-center justify-center">
                    <Mail className="text-[#e0b277] shrink-0" size={18} />
                    <a 
                      href={`mailto:${contactData.email}`} 
                      className={`${isDark ? 'text-gray-400 hover:text-[#e0b277]' : 'text-gray-600 hover:text-[#e0b277]'} transition-colors duration-300 text-sm sm:text-base break-all`}
                    >
                      {contactData.email}
                    </a>
                  </div>
                )}

                {/* ساعات العمل */}
                {contactData.work_hours && (
                  <div className="flex gap-3 items-center justify-center">
                    <Clock className="text-[#e0b277] shrink-0" size={18} />
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>
                      {contactData.work_hours}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                {lang === 'ar' ? 'لا توجد بيانات' : 'No data available'}
              </p>
            )}

            {/* أيقونات السوشيال ميديا */}
            {/* <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8 justify-center">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'} flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:bg-[#e0b277] hover:text-black transition-all duration-300 hover:scale-110`}
                    aria-label={`Social media link ${idx + 1}`}
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div> */}
          </div>

          {/* العمود الرابع: الباركود */}
          {/* <div className="text-center">
            <h3 className={`${isDark ? 'text-white' : 'text-gray-800'} font-bold text-base sm:text-lg mb-4 pb-2 border-b-2 border-[#e0b277] inline-block`}>
              {lang === 'ar' ? "تابعنا" : "Follow Us"}
            </h3>
            <div className="flex justify-center">
              <div className={`${isDark ? 'bg-white' : 'bg-gray-100'} p-3 rounded-xl inline-block`}>
                <img 
                  src={barkcodeImage} 
                  alt="Barcode" 
                  className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 object-contain"
                  loading="lazy"
                />
              </div>
            </div>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mt-3`}>
              {lang === 'ar' ? 'امسح الرمز لمتابعتنا' : 'Scan the code to follow us'}
            </p>
          </div> */}
        </div>

        {/* حقوق النشر */}
        <div className="text-center pt-6 sm:pt-8 mt-6 sm:mt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}">
          <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-[10px] sm:text-xs`}>
            © {new Date().getFullYear()} {lang === 'ar' ? 'شركة ' : ' Company'} - 
            {lang === 'ar' ? ' جميع الحقوق محفوظة' : ' All Rights Reserved'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;