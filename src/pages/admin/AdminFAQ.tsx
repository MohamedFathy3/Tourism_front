/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/AdminFAQ.tsx
import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminForm } from '@/components/admin/AdminForm';
import { faqAdminService, FAQType } from '@/services/admin/faq.admin.service';
import { toast } from 'sonner';
import { 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

const AdminFAQ = () => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // جلب البيانات
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await faqAdminService.getAll({
        page: currentPage,
        perPage: perPage,
        filters: filters,
        orderBy: 'id',
        orderByDirection: 'desc',
      });
      
      setFaqs(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load FAQs');
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [currentPage, perPage, filters]);

  // معالج إضافة جديد
  const handleAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  // ✅ معالج تعديل - تأكد من وجود البيانات
  const handleEdit = (item: FAQType) => {
    console.log('📝 Editing FAQ:', item); // للتأكد
    setEditingItem(item);
    setFormOpen(true);
  };

  // معالج حذف
  const handleDelete = async (item: FAQType) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Are you sure you want to delete this FAQ?')) {
      return;
    }
    
    try {
      await faqAdminService.delete(item.id);
      toast.success(lang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
      fetchFAQs();
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل الحذف' : 'Delete failed');
      console.error('Error deleting FAQ:', err);
    }
  };

  // معالج تبديل الحالة
  const handleToggleStatus = async (id: number, active: boolean) => {
    try {
      await faqAdminService.toggleStatus(id, active);
      toast.success(lang === 'ar' ? 'تم تغيير الحالة' : 'Status updated');
      fetchFAQs();
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل تغيير الحالة' : 'Status update failed');
      console.error('Error toggling status:', err);
    }
  };

  // معالج حفظ النموذج
  const handleSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      
      console.log('📤 Submitting data:', data); // للتأكد
      console.log('📝 Editing item:', editingItem); // للتأكد
      
      // تحويل البيانات للشكل المطلوب
      const formData = {
        name: data.name,
        des: data.des,
        active: data.active ?? true,
      };
      
      if (editingItem) {
        // ✅ تأكد من الـ ID
        console.log('🔄 Updating FAQ ID:', editingItem.id);
        await faqAdminService.update(editingItem.id, formData);
        toast.success(lang === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully');
      } else {
        await faqAdminService.create(formData);
        toast.success(lang === 'ar' ? 'تم الإضافة بنجاح' : 'Added successfully');
      }
      
      setFormOpen(false);
      setEditingItem(null);
      fetchFAQs();
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل الحفظ' : 'Save failed');
      console.error('Error saving FAQ:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // معالج الفلترة
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // معالج مسح الفلاتر
  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  // معالج تغيير عدد العناصر في الصفحة
  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  // أزرار الإجراءات
  const actions = [
    {
      label: lang === 'ar' ? 'تعديل' : 'Edit',
      icon: Edit,
      onClick: handleEdit,
      color: 'primary' as const,
    },
    {
      label: lang === 'ar' ? 'حذف' : 'Delete',
      icon: Trash2,
      onClick: handleDelete,
      color: 'danger' as const,
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <AdminTable
        data={faqs}
        columns={[
          { key: 'id', label: '#', type: 'number', width: 'w-16' },
          { key: 'name', label: lang === 'ar' ? 'السؤال' : 'Question', filterable: true },
          { 
            key: 'des', 
            label: lang === 'ar' ? 'الإجابة' : 'Answer',
            render: (item) => (
              <div className="max-w-xs truncate">
                {item.des}
              </div>
            )
          },
          { key: 'createdAt', label: lang === 'ar' ? 'التاريخ' : 'Date', type: 'date' },
          { 
            key: 'active', 
            label: lang === 'ar' ? 'الحالة' : 'Status', 
            type: 'switch',
            filterable: false 
          },
        ]}
        actions={actions}
        loading={loading}
        error={error}
        onRefresh={fetchFAQs}
        onAdd={handleAdd}
        addLabel={lang === 'ar' ? 'إضافة سؤال جديد' : 'Add New FAQ'}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onPerPageChange={handlePerPageChange}
        perPage={perPage}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        searchable={true}
        onSearch={(query) => handleFilterChange('name', query)}
        searchPlaceholder={lang === 'ar' ? 'بحث عن سؤال...' : 'Search for a question...'}
        onToggleStatus={handleToggleStatus}
      />

      {/* ✅ نموذج الإضافة والتعديل - تأكد من تمرير البيانات صح */}
      <AdminForm
        type="faq"
        isOpen={formOpen}
        initialData={editingItem ? {
          name: editingItem.name,
          des: editingItem.des,
          active: editingItem.active ?? true,
        } : { active: true }}
        onSubmit={handleSubmit}
        onCancel={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        loading={submitting}
        title={
          editingItem
            ? lang === 'ar' ? 'تعديل السؤال' : 'Edit FAQ'
            : lang === 'ar' ? 'إضافة سؤال جديد' : 'Add New FAQ'
        }
      />
    </div>
  );
};

export default AdminFAQ;