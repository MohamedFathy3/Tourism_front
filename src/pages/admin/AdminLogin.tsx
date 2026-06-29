/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff,
  Building2,
  AlertCircle
} from "lucide-react";
import logoWhite from "@/assets/logodark.png";
import logoDark from "@/assets/logowhite.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { isDark } = useTheme();

  // اختيار الشعار المناسب
  const logoSrc = isDark ? logoWhite : logoDark;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // التحقق من صحة البيانات
    if (!email || !password) {
      setError(lang === 'ar' ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError(lang === 'ar' ? 'غير مصرح لك بالدخول إلى لوحة التحكم' : 'You are not authorized to access the dashboard');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || (lang === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} p-4`}>
      {/* الخلفية */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e0b277]/10 to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl ${
          isDark ? 'bg-gray-900/90 border border-gray-800' : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        {/* اللوجو */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoSrc} alt="Logo" className="h-16 w-auto object-contain" />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {lang === 'ar' ? 'تسجيل الدخول' : 'Admin Login'}
          </h1>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {lang === 'ar' ? 'الوصول إلى لوحة التحكم' : 'Access to the dashboard'}
          </p>
          <div className="w-20 h-1 bg-[#e0b277] mx-auto mt-3 rounded-full" />
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* البريد الإلكتروني */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors ${
                  isDark 
                    ? 'border-gray-700 bg-gray-800 text-white focus:border-[#e0b277]' 
                    : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                } focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50`}
                placeholder={lang === 'ar' ? 'admin@example.com' : 'admin@example.com'}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-2.5 rounded-lg border transition-colors ${
                  isDark 
                    ? 'border-gray-700 bg-gray-800 text-white focus:border-[#e0b277]' 
                    : 'border-gray-300 bg-white text-gray-900 focus:border-[#e0b277]'
                } focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50`}
                placeholder={lang === 'ar' ? '••••••••' : '••••••••'}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className={`w-5 h-5 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} />
                ) : (
                  <Eye className={`w-5 h-5 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} />
                )}
              </button>
            </div>
          </div>

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#e0b277] hover:bg-[#b88d2e] text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] shadow-lg hover:shadow-[#e0b277]/30'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                {lang === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...'}
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </>
            )}
          </button>

          {/* معلومات المسؤول */}
          <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
              {lang === 'ar' ? 'بيانات الدخول التجريبية:' : 'Demo Credentials:'}
            </p>
            <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'} text-center mt-1 space-y-0.5`}>
              <p><span className="font-semibold">Email:</span> adam@wsa-network.com</p>
              <p><span className="font-semibold">Password:</span> password</p>
            </div>
          </div>

          {/* زر العودة للرئيسية */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
            >
              {lang === 'ar' ? '← العودة للرئيسية' : '← Back to Home'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;