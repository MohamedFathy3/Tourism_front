// src/contexts/AppContext.tsx
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/auth.types';
import { useLanguage } from '@/i18n/LanguageContext';

type Theme = "light" | "dark";
type UserRole = "admin" | "teacher" | "student";

interface AppContextType {
  // Auth related
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<{ role: string }>;
  logout: () => void;
  error: string | null;
  
  // UI Role switcher
  setRole: (role: UserRole) => void;
  
  // Theme related
  theme: Theme;
  toggleTheme: () => void;
  
  // 🔥 Translation - t هتكون object مش function
  t: any; // 👈 أي حاجة (object) عشان متكسرش الـ components
  lang: string;
  setLang: (lang: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

const AppProviderInner = ({ children }: AppProviderProps) => {
  const { user, token, isLoading, isAuthenticated, login, logout, error } = useAuth();
  const { t, lang, setLang } = useLanguage(); // 👈 t object من LanguageContext
  
  const [uiRole, setUiRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem("lms-ui-role") as UserRole;
    return savedRole || user?.role || "admin";
  });
  
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("lms-theme") as Theme) || "dark");
  
  const role = uiRole || user?.role || null;
  const isAdmin = role === 'admin';
  const isInstructor = role === 'teacher';
  const isStudent = role === 'student';

  // 🔥 دالة مساعدة للترجمة - بتستخدم الـ t object
  const translate = (key: string): string => {
    // لو الـ t object ومحتوي على المفتاح
    if (t && typeof t === 'object') {
      // جرب توصل للـ key باستخدام dot notation
      const keys = key.split('.');
      let result: any = t;
      
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          return key; // لو مش موجود رجع الـ key نفسه
        }
      }
      
      return typeof result === 'string' ? result : key;
    }
    
    return key; // Fallback
  };

  useEffect(() => {
    localStorage.setItem("lms-ui-role", uiRole);
  }, [uiRole]);

  useEffect(() => {
    if (user?.role) {
      setUiRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("lms-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value: AppContextType = {
    user,
    role,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    isInstructor,
    isStudent,
    login,
    logout,
    error,
    setRole: setUiRole,
    theme,
    toggleTheme,
    t: translate, // 👈 دالة الترجمة الجديدة
    lang,
    setLang,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return <AppProviderInner>{children}</AppProviderInner>;
};