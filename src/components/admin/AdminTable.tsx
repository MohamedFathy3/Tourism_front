// src/components/admin/AdminTable.tsx - كامل مع تحسينات الفلاتر
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { 
  Edit, 
  Trash2, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Image as ImageIcon,
  X,
  Filter,
} from "lucide-react";

// ============================================
// 🔥 أنواع الـ Table
// ============================================

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'image' | 'badge' | 'date' | 'actions' | 'status' | 'number' | 'switch';
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: any) => React.ReactNode;
}

export interface TableAction {
  label: string;
  icon?: any;
  onClick: (item: any) => void;
  color?: 'primary' | 'danger' | 'success' | 'warning' | 'info';
  show?: (item: any) => boolean;
}

export interface TableProps {
  data: any[];
  columns: TableColumn[];
  actions?: TableAction[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onAdd?: () => void;
  addLabel?: string;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPage?: number;
  // Filters
  filters?: Record<string, any>;
  onFilterChange?: (key: string, value: any) => void;
  onClearFilters?: () => void;
  // Search
  searchable?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  // Switch
  onToggleStatus?: (id: number, active: boolean) => Promise<void>;
}

// ============================================

export const AdminTable = ({
  data,
  columns,
  actions = [],
  loading = false,
  error = null,
  onRefresh,
  onAdd,
  addLabel,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onPerPageChange,
  perPage = 10,
  filters = {},
  onFilterChange,
  onClearFilters,
  searchable = false,
  onSearch,
  searchPlaceholder,
  onToggleStatus,
}: TableProps) => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const cardBg = isDark ? 'bg-gray-800/50' : 'bg-white';
  const cardBorder = isDark ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  // عدد الفلاتر النشطة
  const activeFiltersCount = Object.keys(filters).filter(key => {
    const val = filters[key];
    return val !== '' && val !== null && val !== undefined;
  }).length;

  // معالج الـ Switch
  const handleToggle = async (id: number, currentStatus: boolean) => {
    if (onToggleStatus) {
      setTogglingId(id);
      try {
        await onToggleStatus(id, !currentStatus);
      } catch (error) {
        console.error('Error toggling status:', error);
      } finally {
        setTogglingId(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className={`text-xl font-bold ${textPrimary}`}>
            {lang === 'ar' ? 'البيانات' : 'Data'}
          </h2>
          <span className={`text-sm ${textSecondary}`}>
            ({data.length} {lang === 'ar' ? 'عنصر' : 'items'})
          </span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          {searchable && (
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchPlaceholder || (lang === 'ar' ? 'بحث...' : 'Search...')}
                className={`w-48 sm:w-64 pl-10 pr-4 py-2 rounded-lg border ${cardBorder} ${inputBg} ${textPrimary} placeholder:${textSecondary} focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50 text-sm`}
              />
            </div>
          )}
          
          {/* Filter Button */}
          {onFilterChange && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border ${cardBorder} ${activeFiltersCount > 0 ? 'bg-[#e0b277]/10 text-[#e0b277] border-[#e0b277]' : textSecondary} hover:${textPrimary} transition-colors relative`}
            >
              <Filter className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e0b277] text-white text-[10px] rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          )}
          
          {/* Refresh */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className={`p-2 rounded-lg ${cardBg} border ${cardBorder} ${textSecondary} hover:${textPrimary} transition-colors`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
          
          {/* Add */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="px-4 py-2 rounded-lg bg-[#e0b277] hover:bg-[#b88d2e] text-white transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              {addLabel || (lang === 'ar' ? 'إضافة جديد' : 'Add New')}
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel - إخفاء الصور من الفلاتر */}
      {showFilters && onFilterChange && (
        <div className={`p-4 rounded-xl ${cardBg} border ${cardBorder}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-sm font-semibold ${textPrimary}`}>
              {lang === 'ar' ? 'تصفية البيانات' : 'Filter Data'}
            </h3>
            <button
              onClick={onClearFilters}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              {lang === 'ar' ? 'مسح الكل' : 'Clear All'}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {columns
              .filter(col => col.filterable !== false && col.type !== 'image' && col.type !== 'switch')
              .map(col => (
                <div key={col.key}>
                  <label className={`text-xs ${textSecondary} block mb-1`}>
                    {col.label}
                  </label>
                  <input
                    type="text"
                    value={filters[col.key] || ''}
                    onChange={(e) => onFilterChange(col.key, e.target.value)}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border ${cardBorder} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50`}
                    placeholder={`${lang === 'ar' ? 'بحث' : 'Filter'}...`}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e0b277]"></div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className={`p-4 rounded-xl ${isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'} border text-red-600 dark:text-red-400`}>
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className={`rounded-xl ${cardBg} border ${cardBorder} overflow-hidden`}>
          {data.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className={`w-16 h-16 mx-auto ${textSecondary} mb-4`} />
              <p className={`text-lg ${textPrimary}`}>
                {lang === 'ar' ? 'لا توجد بيانات' : 'No data'}
              </p>
              <p className={`text-sm ${textSecondary}`}>
                {lang === 'ar' ? 'لم يتم العثور على أي بيانات' : 'No data found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${cardBorder}`}>
                  <tr className={`text-xs uppercase tracking-wider ${textSecondary}`}>
                    {columns.map((col) => (
                      <th key={col.key} className={`px-4 py-3 text-left ${col.width || ''}`}>
                        {col.label}
                      </th>
                    ))}
                    {actions.length > 0 && (
                      <th className="px-4 py-3 text-center">
                        {lang === 'ar' ? 'إجراءات' : 'Actions'}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3">
                          {col.render ? (
                            col.render(item)
                          ) : col.type === 'image' ? (
                            <img
                              src={item[col.key]?.fullUrl || item[col.key] || item.imageUrl}
                              alt={item.title || item.name}
                              className="w-16 h-12 object-cover rounded-lg"
                              loading="lazy"
                            
                            />
                          ) : col.type === 'badge' ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              item[col.key] 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {item[col.key] 
                                ? (lang === 'ar' ? 'نشط' : 'Active')
                                : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                            </span>
                          ) : col.type === 'switch' ? (
                            <div className="flex items-center">
                              <button
                                onClick={() => handleToggle(item.id, item[col.key])}
                                disabled={togglingId === item.id}
                                className={`relative w-12 h-6 rounded-full transition-colors ${
                                  item[col.key] ? 'bg-[#e0b277]' : 'bg-gray-400 dark:bg-gray-600'
                                } ${togglingId === item.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <span
                                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                    item[col.key] ? 'translate-x-6' : 'translate-x-0.5'
                                  }`}
                                />
                                {togglingId === item.id && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                  </div>
                                )}
                              </button>
                              <span className={`ml-2 text-xs ${textSecondary}`}>
                                {item[col.key] 
                                  ? (lang === 'ar' ? 'نشط' : 'Active')
                                  : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                              </span>
                            </div>
                          ) : col.type === 'date' ? (
                            <span className={`text-sm ${textSecondary}`}>
                              {new Date(item[col.key]).toLocaleDateString()}
                            </span>
                          ) : col.type === 'status' ? (
                            <span className={`text-sm ${item[col.key] ? 'text-green-500' : 'text-gray-400'}`}>
                              {item[col.key] 
                                ? (lang === 'ar' ? '✅ نشط' : '✅ Active')
                                : (lang === 'ar' ? '❌ غير نشط' : '❌ Inactive')}
                            </span>
                          ) : col.type === 'number' ? (
                            <span className={`text-sm font-medium ${textPrimary}`}>
                              {item[col.key] || 0}
                            </span>
                          ) : (
                            <span className={`text-sm ${textPrimary}`}>
                              {item[col.key] || '-'}
                            </span>
                          )}
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            {actions.map((action, idx) => {
                              const Icon = action.icon;
                              const show = action.show ? action.show(item) : true;
                              
                              if (!show) return null;
                              
                              const colorClass = action.color === 'danger' 
                                ? 'text-red-500 hover:bg-red-500/20'
                                : action.color === 'success'
                                ? 'text-green-500 hover:bg-green-500/20'
                                : action.color === 'warning'
                                ? 'text-yellow-500 hover:bg-yellow-500/20'
                                : action.color === 'info'
                                ? 'text-blue-500 hover:bg-blue-500/20'
                                : 'text-blue-500 hover:bg-blue-500/20';
                              
                              return (
                                <button
                                  key={idx}
                                  onClick={() => action.onClick(item)}
                                  className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} ${colorClass} transition-colors`}
                                  title={action.label}
                                >
                                  {Icon && <Icon className="w-4 h-4" />}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-between px-4 py-3 border-t ${cardBorder}`}>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${textSecondary}`}>
                  {lang === 'ar' 
                    ? `الصفحة ${currentPage} من ${totalPages}`
                    : `Page ${currentPage} of ${totalPages}`}
                </span>
                {/* Per Page */}
                <select
                  value={perPage}
                  onChange={(e) => onPerPageChange?.(Number(e.target.value))}
                  className={`text-sm rounded-lg border ${cardBorder} ${inputBg} ${textPrimary} px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50`}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${cardBorder} ${textSecondary} ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${cardBorder} ${textSecondary} ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// 🔥 TableConfigs - إعدادات الجداول لكل نوع
// ============================================

// src/components/admin/AdminTable.tsx - أضف profile في TableConfigs

export const TableConfigs = {
  slider: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'image', label: 'الصورة', type: 'image', width: 'w-24' },
      { key: 'title', label: 'العنوان', filterable: true },
      { key: 'description', label: 'الوصف', filterable: true },
      { key: 'active', label: 'الحالة', type: 'switch', width: 'w-32', filterable: false },
    ] as TableColumn[],
  },
  about: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'image', label: 'الصورة', type: 'image', width: 'w-24' },
      { key: 'title', label: 'العنوان', filterable: true },
      { key: 'description', label: 'الوصف', filterable: true },
    ] as TableColumn[],
  },
   company: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'image', label: 'الصورة', type: 'image', width: 'w-24' },
      { key: 'title', label: 'اسم الشركة', filterable: true },
      { key: 'active', label: 'الحالة', type: 'switch', width: 'w-32', filterable: false },
    ] as TableColumn[],
  },
  project: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'image', label: 'الصورة', type: 'image', width: 'w-24' },
      { key: 'title', label: 'العنوان', filterable: true },
      { key: 'location', label: 'الموقع', filterable: true },
      { key: 'active', label: 'الحالة', type: 'switch', width: 'w-32', filterable: false },
    ] as TableColumn[],
  },
  service: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'image', label: 'الصورة', type: 'image', width: 'w-24' },
      { key: 'title', label: 'العنوان', filterable: true },
      { key: 'location', label: 'الموقع', filterable: true },
      { key: 'active', label: 'الحالة', type: 'switch', width: 'w-32', filterable: false },
    ] as TableColumn[],
  },
  contact: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'phone_one', label: 'الهاتف الأول', filterable: true },
      { key: 'phone_two', label: 'الهاتف الثاني', filterable: true },
      { key: 'email', label: 'البريد', filterable: true },
      { key: 'active', label: 'الحالة', type: 'switch', width: 'w-32', filterable: false },
    ] as TableColumn[],
  },
  newsletter: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'image', label: 'الصورة', type: 'image', width: 'w-24' },
      { key: 'title', label: 'العنوان', filterable: true },
      { key: 'createdAt', label: 'التاريخ', type: 'date' },
      { key: 'active', label: 'الحالة', type: 'switch', width: 'w-32', filterable: false },
    ] as TableColumn[],
  },
  job: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'name', label: 'الاسم', filterable: true },
      { key: 'email', label: 'البريد', filterable: true },
      { key: 'job_title', label: 'المسمى الوظيفي', filterable: true },
      { key: 'createdAt', label: 'التاريخ', type: 'date' },
    ] as TableColumn[],
  },
  user: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'name', label: 'الاسم', filterable: true },
      { key: 'email', label: 'البريد', filterable: true },
      { key: 'role', label: 'الدور', filterable: true },
      { key: 'created_at', label: 'التاريخ', type: 'date' },
    ] as TableColumn[],
  },
  contact_messages: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'name', label: 'المرسل', filterable: true },
      { key: 'email', label: 'البريد', filterable: true },
      { key: 'subject', label: 'الموضوع', filterable: true },
      { key: 'createdAt', label: 'التاريخ', type: 'date' },
    ] as TableColumn[],
  },
  // 👇 أضف هذا
  profile: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'image', label: 'الصورة', type: 'image', width: 'w-24' },
      { key: 'title', label: 'العنوان', filterable: true },
      { key: 'subTitle', label: 'العنوان الفرعي', filterable: true }, // 👈 أضف هذا
      { key: 'linkDrive', label: 'رابط Drive', filterable: true }, // 👈 أضف هذا
      { key: 'active', label: 'الحالة', type: 'switch', width: 'w-32', filterable: false },
    ] as TableColumn[],
  },
};

export default AdminTable;