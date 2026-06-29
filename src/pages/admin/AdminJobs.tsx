// src/pages/admin/AdminJobs.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAdminResource } from "@/hooks/admin";
import { jobAdminService } from "@/services/admin";
import { AdminTable, TableConfigs } from "@/components/admin/AdminTable";
import { AdminForm } from "@/components/admin/AdminForm";
import { Edit, Trash2, Eye, Download } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { X } from "lucide-react";

const AdminJobs = () => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const {
    data: jobs,
    loading,
    error,
    currentPage,
    totalPages,
    filters,
    setFilter,
    clearFilters,
    createItem,
    updateItem,
    deleteItem,
    goToPage,
    refresh,
    changePerPage,
  } = useAdminResource(jobAdminService, { 
    perPage: 5,
    initialFilters: {},
    orderBy: 'id',
    orderByDirection: 'desc'
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleDelete = async (item: any) => {
    if (confirm(lang === 'ar' ? `حذف طلب "${item.name}"؟` : `Delete application from "${item.name}"?`)) {
      await deleteItem(item.id);
    }
  };

  const handleSubmit = async (data: any) => {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await createItem(data);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleViewCV = (item: any) => {
    if (item.cv?.fullUrl) {
      window.open(item.cv.fullUrl, '_blank');
    }
  };

  const actions = [
    { 
      label: lang === 'ar' ? 'عرض السيرة' : 'View CV', 
      icon: Eye, 
      onClick: handleViewCV, 
      color: 'info' as const,
      show: (item: any) => !!item.cv?.fullUrl,
    },
    { 
      label: lang === 'ar' ? 'تعديل' : 'Edit', 
      icon: Edit, 
      onClick: handleEdit, 
      color: 'primary' as const 
    },
    { 
      label: lang === 'ar' ? 'حذف' : 'Delete', 
      icon: Trash2, 
      onClick: handleDelete, 
      color: 'danger' as const 
    },
  ];

  return (
    <>
      <AdminTable
        data={jobs}
        columns={TableConfigs.job.columns}
        actions={actions}
        loading={loading}
        error={error}
        onRefresh={refresh}
        onAdd={handleAdd}
        addLabel={lang === 'ar' ? 'إضافة طلب وظيفة' : 'Add Job Application'}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onPerPageChange={changePerPage}
        perPage={5}
        filters={filters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        searchable={true}
        onSearch={(query) => setFilter('name', query)}
        searchPlaceholder={lang === 'ar' ? 'بحث في طلبات الوظائف...' : 'Search job applications...'}
      />

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-2xl rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} p-6 max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {editingItem 
                    ? (lang === 'ar' ? '✏️ تعديل طلب الوظيفة' : '✏️ Edit Job Application')
                    : (lang === 'ar' ? '➕ إضافة طلب وظيفة جديد' : '➕ Add New Job Application')}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
              <AdminForm
                type="job"
                initialData={editingItem || {}}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                loading={loading}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminJobs;