// src/components/admin/AdminTable.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch"; // 🔥 استيراد الـ Switch

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
// 🔥 دالة مساعدة لاستخراج رابط الصورة
// ============================================

const getImageUrl = (item: any): string => {
  if (item.image?.fullUrl) return item.image.fullUrl;
  if (item.image?.previewUrl) return item.image.previewUrl;
  if (item.imageUrl) return item.imageUrl;
  if (item.image) return item.image;
  if (item.sliderImage?.fullUrl) return item.sliderImage.fullUrl;
  if (item.sliderImageUrl) return item.sliderImageUrl;
  
  if (item.gallery && item.gallery.length > 0) {
    const firstImage = item.gallery[0];
    if (firstImage.fullUrl) return firstImage.fullUrl;
    if (firstImage.previewUrl) return firstImage.previewUrl;
    if (typeof firstImage === 'string') return firstImage;
  }
  
  if (item.files && item.files.length > 0) {
    const firstFile = item.files[0];
    if (firstFile.fullUrl) return firstFile.fullUrl;
    if (firstFile.previewUrl) return firstFile.previewUrl;
    if (typeof firstFile === 'string') return firstFile;
  }
  
  if (item.images && item.images.length > 0) {
    const firstImage = item.images[0];
    if (firstImage.fullUrl) return firstImage.fullUrl;
    if (firstImage.previewUrl) return firstImage.previewUrl;
    if (typeof firstImage === 'string') return firstImage;
  }
  
  if (item.avatar?.fullUrl) return item.avatar.fullUrl;
  if (item.avatar) return item.avatar;
  if (item.profileImage?.fullUrl) return item.profileImage.fullUrl;
  if (item.profileImage) return item.profileImage;
  if (item.logo?.fullUrl) return item.logo.fullUrl;
  if (item.logo) return item.logo;
  
  return '/placeholder-image.png';
};

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
  
  // 🔥 STATE للـ Switch المحلي
  const [localData, setLocalData] = useState(data);

  // 🔥 تحديث الـ localData لما تتغير الـ data من الـ API
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const isRTL = lang === 'ar';
  const cardBg = isDark ? 'bg-gray-800/50' : 'bg-white';
  const cardBorder = isDark ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const val = filters[key];
    return val !== '' && val !== null && val !== undefined;
  }).length;

  // 🔥 معالج الـ Switch باستخدام الـ Component بتاعك
  const handleToggle = async (id: number, currentStatus: boolean) => {
    if (!onToggleStatus) return;
    
    setTogglingId(id);
    try {
      // 🔥 نغير الحالة محلياً أولاً
      setLocalData(prevData => 
        prevData.map(item => 
          item.id === id ? { ...item, active: !currentStatus } : item
        )
      );
      
      // 🔥 نرسل الـ API
      await onToggleStatus(id, !currentStatus);
    } catch (error) {
      console.error('Error toggling status:', error);
      // 🔥 لو فيه خطأ نرجع الحالة القديمة
      setLocalData(prevData => 
        prevData.map(item => 
          item.id === id ? { ...item, active: currentStatus } : item
        )
      );
    } finally {
      setTogglingId(null);
    }
  };

  const displayData = localData;

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-xl font-bold ${textPrimary}`}>
            {lang === 'ar' ? 'البيانات' : 'Data'}
          </h2>
          <span className={`text-sm ${textSecondary}`}>
            ({displayData.length} {lang === 'ar' ? 'عنصر' : 'items'})
          </span>
        </div>
        
        <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          {searchable && (
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchPlaceholder || (lang === 'ar' ? 'بحث...' : 'Search...')}
                className={`w-48 sm:w-64 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 rounded-lg border ${cardBorder} ${inputBg} ${textPrimary} placeholder:${textSecondary} focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50 text-sm`}
              />
            </div>
          )}
          
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
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              className={`p-2 rounded-lg ${cardBg} border ${cardBorder} ${textSecondary} hover:${textPrimary} transition-colors`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
          
          {onAdd && (
            <button
              onClick={onAdd}
              className="px-4 py-2 rounded-lg bg-[#e0b277] hover:bg-[#b88d2e] text-white transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              {addLabel || (lang === 'ar' ? 'إضافة جديد' : 'Add New')}
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && onFilterChange && (
        <div className={`p-4 rounded-xl ${cardBg} border ${cardBorder}`}>
          <div className={`flex justify-between items-center mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${isRTL ? 'text-right' : ''}`}>
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
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border ${cardBorder} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50 ${isRTL ? 'text-right' : ''}`}
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
          {displayData.length === 0 ? (
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
              <table className="w-full min-w-[600px]">
                <thead className={`border-b ${cardBorder}`}>
                  <tr className={`text-xs uppercase tracking-wider ${textSecondary}`}>
                    {columns.map((col) => (
                      <th key={col.key} className={`px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} ${col.width || ''} whitespace-nowrap`}>
                        {col.label}
                      </th>
                    ))}
                    {actions.length > 0 && (
                      <th className={`px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} whitespace-nowrap`}>
                        {lang === 'ar' ? 'إجراءات' : 'Actions'}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {displayData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}
                    >
                      {columns.map((col) => {
                        const value = item[col.key];
                        
                        return (
                          <td key={col.key} className={`px-4 py-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {col.render ? (
                              col.render(item)
                            ) : col.type === 'image' ? (
                              <div className={`relative group ${isRTL ? 'flex justify-end' : ''}`}>
                                <img
                                  src={getImageUrl(item)}
                                  alt={item.title || item.name || 'Image'}
                                  className="w-16 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder-image.png';
                                  }}
                                />
                                {item.gallery && item.gallery.length > 1 && (
                                  <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} bg-[#e0b277] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold`}>
                                    {item.gallery.length}
                                  </span>
                                )}
                              </div>
                            ) : col.type === 'badge' ? (
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                value 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {value 
                                  ? (lang === 'ar' ? 'نشط' : 'Active')
                                  : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                              </span>
                            ) : col.type === 'switch' ? (
                              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Switch
                                  checked={value}
                                  onCheckedChange={() => handleToggle(item.id, value)}
                                  disabled={togglingId === item.id}
                                  className={`${isRTL ? 'flex-row-reverse' : ''}`}
                                />
                                {togglingId === item.id && (
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#e0b277]"></div>
                                )}
                                <span className={`text-xs ${textSecondary} whitespace-nowrap`}>
                                  {value 
                                    ? (lang === 'ar' ? 'نشط' : 'Active')
                                    : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                                </span>
                              </div>
                            ) : col.type === 'date' ? (
                              <span className={`text-sm ${textSecondary} whitespace-nowrap`}>
                                {new Date(value).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                              </span>
                            ) : col.type === 'status' ? (
                              <span className={`text-sm ${value ? 'text-green-500' : 'text-gray-400'} whitespace-nowrap`}>
                                {value 
                                  ? (lang === 'ar' ? '✅ نشط' : '✅ Active')
                                  : (lang === 'ar' ? '❌ غير نشط' : '❌ Inactive')}
                              </span>
                            ) : col.type === 'number' ? (
                              <span className={`text-sm font-medium ${textPrimary}`}>
                                {value || 0}
                              </span>
                            ) : (
                              <span className={`text-sm ${textPrimary} break-words`}>
                                {value || '-'}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {actions.length > 0 && (
                        <td className={`px-4 py-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
            <div className={`flex items-center justify-between px-4 py-3 border-t ${cardBorder} ${isRTL ? 'flex-row-reverse' : ''} flex-wrap gap-2`}>
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''} flex-wrap`}>
                <span className={`text-sm ${textSecondary} whitespace-nowrap`}>
                  {lang === 'ar' 
                    ? `الصفحة ${currentPage} من ${totalPages}`
                    : `Page ${currentPage} of ${totalPages}`}
                </span>
                <select
                  value={perPage}
                  onChange={(e) => onPerPageChange?.(Number(e.target.value))}
                  className={`text-sm rounded-lg border ${cardBorder} ${inputBg} ${textPrimary} px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#e0b277]/50 ${isRTL ? 'text-right' : ''}`}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${cardBorder} ${textSecondary} ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors`}
                >
                  {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${cardBorder} ${textSecondary} ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors`}
                >
                  {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
// 🔥 TableConfigs
// ============================================

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
  profile: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'image', label: 'الصورة', type: 'image', width: 'w-24' },
      { key: 'title', label: 'العنوان', filterable: true },
      { key: 'subTitle', label: 'العنوان الفرعي', filterable: true },
      { key: 'linkDrive', label: 'رابط Drive', filterable: true },
      { key: 'active', label: 'الحالة', type: 'switch', width: 'w-32', filterable: false },
    ] as TableColumn[],
  },
  faq: {
    columns: [
      { key: 'id', label: '#', width: 'w-16', type: 'number' },
      { key: 'name', label: 'السؤال', filterable: true },
      { key: 'des', label: 'الإجابة', filterable: true },
      { key: 'createdAt', label: 'التاريخ', type: 'date' },
      { key: 'active', label: 'الحالة', type: 'switch', width: 'w-32', filterable: false },
    ] as TableColumn[],
  },
};

export default AdminTable;