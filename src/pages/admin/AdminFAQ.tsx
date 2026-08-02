// src/pages/admin/AdminFAQ.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAdminResource } from "@/hooks/admin";
import { faqAdminService } from "@/services/admin";
import { AdminTable, TableConfigs } from "@/components/admin/AdminTable";
import { AdminForm } from "@/components/admin/AdminForm";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { X } from "lucide-react";

const AdminFAQ = () => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const {
    data: faqs,
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
  } = useAdminResource(faqAdminService, { 
    perPage: 5,
    initialFilters: {},
    orderBy: 'id',
    orderByDirection: 'desc'
  });

  const handleEdit = (item: any) => {
    console.log('📝 Edit clicked:', item);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    console.log('➕ Add clicked');
    setEditingItem(null);
    setShowModal(true);
  };

  const handleDelete = async (item: any) => {
    if (confirm(lang === 'ar' ? `حذف "${item.name}"؟` : `Delete "${item.name}"?`)) {
      console.log('🗑️ Deleting:', item.id);
      await deleteItem(item.id);
    }
  };

  const handleToggleStatus = async (id: number, active: boolean) => {
    console.log(`🔄 Toggling status for ${id} to ${active}`);
    await updateItem(id, { active });
    await refresh();
  };

// في AdminFAQ.tsx - handleSubmit
const handleSubmit = async (data: any) => {
  console.log('📤 1. Form submitted with raw data:', data);
  
  // ✅ نبعت كل البيانات للـ API (زي ما هي)
  const formData = {
    name: data.name || '',
    name_en: data.name_en || '',  // ✅ أضف هذا
    des: data.des || '',
    des_en: data.des_en || '',    // ✅ أضف هذا
    active: data.active ?? true,
  };
  
  console.log('📤 2. Sending to API:', formData);
  
  try {
    if (editingItem) {
      console.log(`📤 Updating item ${editingItem.id}...`);
      await updateItem(editingItem.id, formData);
    } else {
      console.log('📤 Creating new item...');
      await createItem(formData);
    }
    
    await refresh();
    setShowModal(false);
    setEditingItem(null);
    toast.success(editingItem ? 'تم التحديث بنجاح' : 'تم الإضافة بنجاح');
  } catch (error: any) {
    console.error('❌ Error:', error);
    toast.error(error?.response?.data?.message || 'فشل الحفظ');
  }
};

  const actions = [
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
        data={faqs}
        columns={TableConfigs.faq.columns}
        actions={actions}
        loading={loading}
        error={error}
        onRefresh={refresh}
        onAdd={handleAdd}
        addLabel={lang === 'ar' ? 'إضافة سؤال جديد' : 'Add New FAQ'}
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
        searchPlaceholder={lang === 'ar' ? 'بحث عن سؤال...' : 'Search for a question...'}
        onToggleStatus={handleToggleStatus}
      />

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
                    ? (lang === 'ar' ? '✏️ تعديل السؤال' : '✏️ Edit FAQ')
                    : (lang === 'ar' ? '➕ إضافة سؤال جديد' : '➕ Add New FAQ')}
                </h2>
                <button
                  onClick={() => {
                    console.log('❌ Modal closed');
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
              
              <AdminForm
                type="faq"
                initialData={editingItem ? {
                  name: editingItem.name,
                  name_en: editingItem.name,
                  des: editingItem.des,
                  des_en: editingItem.des,
                  active: editingItem.active ?? true,
                } : { 
                  active: true,
                  name: '',
                  name_en: '',
                  des: '',
                  des_en: ''
                }}
                onSubmit={handleSubmit}
                onCancel={() => {
                  console.log('❌ Form cancelled');
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

export default AdminFAQ;