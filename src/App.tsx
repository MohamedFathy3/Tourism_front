// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppProvider } from "@/contexts/AppContext";

// Pages - Public
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Projects from "./pages/Projects.tsx";
import Services from "./pages/Services.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import Service from "./pages/service.tsx";
import ServiceDetails from "@/pages/ServiceDetails";
import ProjectDetails from "@/pages/ProjectDetails";
import NewsLetters from "./pages/NewsLetters.tsx";
import NewsLetterDetails from "@/pages/NewsLetterDetails";
import JobApplication from "@/pages/JobApplication";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin.tsx";
import Dashboard from "@/pages/admin/Dashboard.tsx";
import AdminSlider from "@/pages/admin/AdminSlider.tsx";
import AdminAbout from "@/pages/admin/AdminAbout.tsx";
import AdminProjects from "@/pages/admin/AdminProjects.tsx";
import AdminCompany from "@/pages/admin/AdminCompany.tsx";
import AdminProfile from "@/pages/admin/AdminProfile.tsx";
import AdminNewsletter from "@/pages/admin/AdminNewsletter.tsx";
import AdminContact from "@/pages/admin/AdminContact.tsx";
import AdminJobs from "@/pages/admin/AdminJobs.tsx";
import AdminSettings from "@/pages/admin/AdminSettings.tsx";
import FAQ from "@/pages/FAQ";

// Components
import ScrollToTop from "@/components/ScrollToTop";
import AdminLayout from "@/components/AdminLayout";
import FloatingButtons from "@/components/FloatingButtons"; // 👈 أضف هذا

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* 🔥 Admin Login - بدون AppProvider */}
              <Route path="/login/admin" element={<AdminLogin />} />
              
              {/* 🔥 Admin Dashboard - محاط بـ AppProvider */}
              <Route 
                path="/admin" 
                element={
                  <AppProvider>
                    <AdminLayout />
                  </AppProvider>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="slider" element={<AdminSlider />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="our-project" element={<AdminProjects />} />
                <Route path="our-company" element={<AdminCompany />} />
                <Route path="profile-company" element={<AdminProfile />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="contact-us" element={<AdminContact />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>

              {/* 🔥 Routes العامة */}
              <Route path="/" element={<Index />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/news" element={<NewsLetters />} />
              <Route path="/news/:id" element={<NewsLetterDetails />} />
              <Route path="/careers" element={<JobApplication />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
                        <FloatingButtons />

          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;