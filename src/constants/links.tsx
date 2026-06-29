// src/constants/links.js

export const ROUTES = {
  // الخدمات
  ENGINEERING_CONSULTING: "/EngineeringConsulting",
  WAFI_OFF_PLAN_SALES: "/Wafi-Off-PlanSales",
  SEI_PER_SERVICE: "/seiperserivece",
  SERVICE: "/Service",
  
  // المشاريع
  PROJECTS: "/projects",
  DESIGN_PROJECT: "/designproject",
  PLANE_PROJECT: "/Plane",
  DESIGN_PRIVATE: "/Designprivet",
  MANAGE_PROJECT: "/manageproject",
  
  HOME: "/",
};

export const SERVICE_LINKS = [
  ROUTES.DESIGN_PROJECT,          // الخدمة 5
  ROUTES.PLANE_PROJECT,           // الخدمة 6
  ROUTES.SERVICE,                 // الخدمة 4
  ROUTES.DESIGN_PRIVATE,          // الخدمة 7
                                  // الخدمة 8
                                  ROUTES.MANAGE_PROJECT,  
                                  ROUTES.SEI_PER_SERVICE,         // الخدمة 3
                                  ROUTES.ENGINEERING_CONSULTING,  // الخدمة 1
                                  ROUTES.WAFI_OFF_PLAN_SALES,     // الخدمة 2
];