// src/pages/admin/AdminAbout.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAdminResource } from "@/hooks/admin";
import { aboutAdminService } from "@/services/admin";
import { AdminTable, TableConfigs } from "@/components/admin/AdminTable";
import { AdminForm } from "@/components/admin/AdminForm";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { X } from "lucide-react";

const AdminAbout = () => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const {
    data: aboutData,
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
  } = useAdminResource(aboutAdminService, { 
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
    if (confirm(lang === 'ar' ? `حذف "${item.title}"؟` : `Delete "${item.title}"?`)) {
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

  const actions = [
    { label: 'Edit', icon: Edit, onClick: handleEdit, color: 'primary' as const },
    { label: 'Delete', icon: Trash2, onClick: handleDelete, color: 'danger' as const },
  ];
  const hasData = aboutData && aboutData.length > 0;

  return (
    <>
      <AdminTable
        data={aboutData}
        columns={TableConfigs.about.columns}
        actions={actions}
        loading={loading}
        error={error}
        onRefresh={refresh}
        onAdd={!hasData ? handleAdd : undefined}
        addLabel={lang === 'ar' ? 'إضافة عن من نحن' : 'Add About'}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onPerPageChange={changePerPage}
        perPage={5}
        filters={filters}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
        searchable={true}
        onSearch={(query) => setFilter('title', query)}
        searchPlaceholder={lang === 'ar' ? 'بحث في من نحن...' : 'Search about...'}
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
                  {editingItem ? '✏️ تعديل' : '➕ إضافة جديد'}
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
                type="about"
                initialData={editingItem || { active: true }}
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

export default AdminAbout;