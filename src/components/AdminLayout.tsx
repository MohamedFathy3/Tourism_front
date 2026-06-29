// src/components/AdminLayout.tsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/lms/DashboardLayout";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // 🔥 التحقق من المصادقة
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login/admin');
    }
  }, [isAuthenticated, navigate]);

  // 🔥 استخراج الـ active من الـ URL
  const getActiveFromPath = () => {
    const path = location.pathname.replace('/admin/', '');
    return path || 'dashboard';
  };

  const handleNavigate = (to: string) => {
    navigate(`/admin/${to}`);
  };

  // لو مش authenticated, اعرض nothing (هيتعمل redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout 
      active={getActiveFromPath()} 
      onNavigate={handleNavigate}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminLayout;