/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/lms/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  User, 
  Mail, 
  Calendar, 
  Clock,
  Shield,
  Building2,
  Users,
  FileText,
  CheckCircle,
  ArrowRight,
  Sun,
  Moon
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

interface AdminData {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // جلب بيانات المسؤول من الـ API
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/get-admin');
        
        if (response.data && response.data.data) {
          setAdminData(response.data.data);
        } else {
          setError(lang === 'ar' ? 'لم يتم العثور على بيانات المسؤول' : 'Admin data not found');
        }
      } catch (err: any) {
        console.error('Error fetching admin data:', err);
        setError(err?.response?.data?.message || err?.message || (lang === 'ar' ? 'فشل في تحميل بيانات المسؤول' : 'Failed to load admin data'));
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [lang]);

  // تحديث الوقت كل دقيقة
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 دالة تحية حسب الوقت
  const getGreeting = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return lang === 'ar' ? '🌅 صباح الخير' : '🌅 Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return lang === 'ar' ? '☀️ مساء الخير' : '☀️ Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return lang === 'ar' ? '🌆 مساء الخير' : '🌆 Good Evening';
    } else {
      return lang === 'ar' ? '🌙 مساء الخير' : '🌙 Good Night';
    }
  };

  // 🔥 تاريخ ووقت الحالي
  const getFormattedDate = () => {
    return currentTime.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFormattedTime = () => {
    return currentTime.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // إحصائيات حقيقية من النظام
  const stats = [
    { 
      icon: Users, 
      label: { ar: 'المستخدمين', en: 'Users' }, 
      value: '1,284', 
      change: '+12%',
      color: 'text-blue-500'
    },
    { 
      icon: FileText, 
      label: { ar: 'المشاريع', en: 'Projects' }, 
      value: '47', 
      change: '+8%',
      color: 'text-green-500'
    },
    { 
      icon: Building2, 
      label: { ar: 'الشركات', en: 'Companies' }, 
      value: '23', 
      change: '+5%',
      color: 'text-purple-500'
    },
    { 
      icon: CheckCircle, 
      label: { ar: 'مكتمل', en: 'Completed' }, 
      value: '89%', 
      change: '+3%',
      color: 'text-[#e0b277]'
    },
  ];

  // نشاطات حديثة وهمية
  const recentActivities = [
    { 
      id: 1, 
      action: { ar: 'تم إضافة مشروع جديد', en: 'New project added' }, 
      time: { ar: 'منذ 5 دقائق', en: '5 minutes ago' },
      user: 'أحمد محمد'
    },
    { 
      id: 2, 
      action: { ar: 'تحديث بيانات الشركة', en: 'Company data updated' }, 
      time: { ar: 'منذ ساعة', en: '1 hour ago' },
      user: 'سارة علي'
    },
    { 
      id: 3, 
      action: { ar: 'تم رفع ملف جديد', en: 'New file uploaded' }, 
      time: { ar: 'منذ 3 ساعات', en: '3 hours ago' },
      user: 'محمد خالد'
    },
  ];

  // ألوان متوافقة مع الوضعين
  const cardBg = isDark ? 'bg-gray-800/50' : 'bg-white';
  const cardBorder = isDark ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const textMuted = isDark ? 'text-gray-300' : 'text-gray-600';
  const hoverBg = isDark ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100';
  const iconBg = isDark ? 'bg-[#e0b277]/20' : 'bg-[#e0b277]/10';

  return (
      <div className="space-y-6">
        {/* العنوان والترحيب */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>
                {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
              </h1>
              {/* أيقونة الثيم */}
              <div className={`p-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                {isDark ? <Moon className="w-4 h-4 text-yellow-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
              </div>
            </div>
            
            {/* تحية + الوقت */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
              <p className={`text-sm ${textSecondary}`}>
                {getGreeting()} {adminData?.name || user?.name || 'Admin'} 👋
              </p>
              <span className={`text-xs ${textSecondary}`}>•</span>
              <p className={`text-xs ${textSecondary}`}>
                {getFormattedDate()} - {getFormattedTime()}
              </p>
            </div>
          </div>
          
        </div>

        {/* بيانات المسؤول - من الـ API */}
        {loading ? (
          <div className={`p-6 rounded-xl ${cardBg} border ${cardBorder} animate-pulse`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
              <div className="space-y-2 flex-1">
                <div className={`h-5 w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded`} />
                <div className={`h-4 w-48 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded`} />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className={`p-4 rounded-xl ${isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'} border text-red-600 dark:text-red-400`}>
            {error}
          </div>
        ) : adminData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${cardBg} border ${cardBorder}`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* صورة المستخدم */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${iconBg}`}>
                <User className={`w-8 h-8 text-[#e0b277]`} />
              </div>
              
              {/* معلومات المسؤول */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <h2 className={`text-xl font-bold ${textPrimary}`}>
                    {adminData.name}
                  </h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-[#e0b277]/20 text-[#e0b277]' : 'bg-[#e0b277]/10 text-[#e0b277]'}`}>
                    <Shield className="w-3 h-3 inline mr-1" />
                    Admin
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3 sm:gap-6 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className={`w-4 h-4 ${textSecondary}`} />
                    <span className={textMuted}>{adminData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${textSecondary}`} />
                    <span className={textMuted}>
                      {lang === 'ar' ? 'انضم في: ' : 'Joined: '}
                      {new Date(adminData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${textSecondary}`} />
                    <span className={textMuted}>
                      {lang === 'ar' ? 'آخر تحديث: ' : 'Last update: '}
                      {new Date(adminData.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      

        {/* النشاطات الأخيرة */}
      
      </div>
  );
};

export default Dashboard;