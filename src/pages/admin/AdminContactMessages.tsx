// src/pages/admin/AdminContactMessages.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AdminTable } from '@/components/admin/AdminTable';
import { contactMessageAdminService, ContactMessageType } from '@/services/admin/contact-message.admin.service';
import { toast } from 'sonner';
import { 
  Eye, 
  Trash2, 
  Mail, 
  Phone, 
  User, 
  MapPin,
  MessageSquare,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminContactMessages = () => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<ContactMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageType | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // جلب البيانات
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactMessageAdminService.getAll({
        page: currentPage,
        perPage: perPage,
        filters: filters,
        orderBy: 'id',
        orderByDirection: 'desc',
      });
      
      setMessages(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, perPage, filters]);

  // معالج عرض التفاصيل
  const handleViewDetails = (item: ContactMessageType) => {
    setSelectedMessage(item);
    setShowDetails(true);
  };

  // معالج حذف
  const handleDelete = async (item: ContactMessageType) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الرسالة؟' : 'Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      await contactMessageAdminService.delete(item.id);
      toast.success(lang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
      fetchMessages();
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل الحذف' : 'Delete failed');
      console.error('Error deleting message:', err);
    }
  };

  // معالج حذف متعدد
  const handleDeleteMultiple = async (ids: number[]) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الرسائل؟' : 'Are you sure you want to delete these messages?')) {
      return;
    }
    
    try {
      await contactMessageAdminService.deleteMultiple(ids);
      toast.success(lang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
      fetchMessages();
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل الحذف' : 'Delete failed');
      console.error('Error deleting messages:', err);
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
      label: lang === 'ar' ? 'عرض التفاصيل' : 'View Details',
      icon: Eye,
      onClick: handleViewDetails,
      color: 'info' as const,
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
        data={messages}
        columns={[
          { key: 'id', label: '#', type: 'number', width: 'w-16' },
          { key: 'name', label: lang === 'ar' ? 'المرسل' : 'Name', filterable: true },
          { key: 'email', label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email', filterable: true },
          { key: 'phone', label: lang === 'ar' ? 'الهاتف' : 'Phone', filterable: true },
        
          { 
            key: 'message', 
            label: lang === 'ar' ? 'الرسالة' : 'Message',
            render: (item) => (
              <div className="max-w-xs truncate">
                {item.message}
              </div>
            )
          },
        ]}
        actions={actions}
        loading={loading}
        error={error}
        onRefresh={fetchMessages}
        addLabel={lang === 'ar' ? 'لا يمكن الإضافة' : 'Cannot add'}
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
        searchPlaceholder={lang === 'ar' ? 'بحث عن مرسل...' : 'Search for sender...'}
      />

      {/* ✅ Modal عرض التفاصيل */}
      <AnimatePresence>
        {showDetails && selectedMessage && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDetails(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`
                relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl
                ${isDark ? 'bg-gray-900' : 'bg-white'}
                border ${isDark ? 'border-gray-700' : 'border-gray-200'}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`
                flex items-center justify-between px-6 py-4 border-b
                ${isDark ? 'border-gray-700' : 'border-gray-200'}
              `}>
                <div className="flex items-center gap-3">
                  <Mail className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {lang === 'ar' ? 'تفاصيل الرسالة' : 'Message Details'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className={`
                    p-2 rounded-full transition-colors
                    ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                  `}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-4">
                  {/* المرسل */}
                  <div className="flex items-start gap-3">
                    <User className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {lang === 'ar' ? 'المرسل' : 'Sender'}
                      </p>
                      <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {selectedMessage.name}
                      </p>
                    </div>
                  </div>

                  {/* البريد الإلكتروني */}
                  <div className="flex items-start gap-3">
                    <Mail className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </p>
                      <a href={`mailto:${selectedMessage.email}`} className={`text-lg font-semibold text-[#e0b277] hover:underline`}>
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  {/* الهاتف */}
                  <div className="flex items-start gap-3">
                    <Phone className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                      </p>
                      <a href={`tel:${selectedMessage.phone}`} className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {selectedMessage.phone || '-'}
                      </a>
                    </div>
                  </div>

                  {/* العنوان */}
                  {selectedMessage.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {lang === 'ar' ? 'العنوان' : 'Address'}
                        </p>
                        <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {selectedMessage.address}
                        </p>
                      </div>
                    </div>
                  )}

                 

                  {/* الرسالة */}
                  <div className="flex items-start gap-3">
                    <MessageSquare className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {lang === 'ar' ? 'الرسالة' : 'Message'}
                      </p>
                      <div className={`
                        mt-2 p-4 rounded-xl
                        ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
                        border ${isDark ? 'border-gray-700' : 'border-gray-200'}
                      `}>
                        <p className={`text-base whitespace-pre-wrap leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>
                  </div>

                
                </div>
              </div>

              {/* Footer */}
              <div className={`
                flex justify-end px-6 py-4 border-t
                ${isDark ? 'border-gray-700' : 'border-gray-200'}
              `}>
                <button
                  onClick={() => setShowDetails(false)}
                  className={`
                    px-6 py-2 rounded-lg transition-colors
                    ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                  `}
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminContactMessages;