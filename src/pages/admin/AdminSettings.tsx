// src/pages/admin/AdminSettings.tsx
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const AdminSettings = () => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();

  return (
    <div className={`p-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">
        {lang === 'ar' ? 'الإعدادات' : 'Settings'}
      </h1>
      <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
        {lang === 'ar' ? 'هنا يمكنك تعديل الإعدادات' : 'Here you can modify settings'}
      </p>
    </div>
  );
};

export default AdminSettings;