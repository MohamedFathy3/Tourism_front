// components/FileUploader.tsx
import { useState, useRef, useEffect } from "react";
import { UploadCloud, X, Loader2, Eye } from "lucide-react";
import api from "@/lib/api";

type Props = {
  label?: string;
  onUploadSuccess: (id: number | number[]) => void;
  multiple?: boolean;
  accept?: string;
  preview?: boolean;
  uniqueId?: string;
  maxFiles?: number;
  maxVideoSize?: number;
  defaultImageUrl?: string | null;
  defaultImageId?: number | null;
  defaultGallery?: any[] | null;
  onRemoveImage?: () => void;
  appendMode?: boolean;
};

export default function FileUploader({
  label = "Upload File",
  onUploadSuccess,
  multiple = true,
  accept = "image/*,video/*",
  preview = true,
  uniqueId = "file-upload",
  maxVideoSize = 5,
  maxFiles = 10,
  defaultImageUrl,
  defaultImageId,
  defaultGallery = null,
  onRemoveImage,
  appendMode = true,
}: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<{ id: number; name: string; url?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewTypes, setPreviewTypes] = useState<string[]>([]);
  const [showDefaultImage, setShowDefaultImage] = useState(!!defaultImageUrl);
  
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [existingIds, setExistingIds] = useState<number[]>([]);
  const [isExternalUpdate, setIsExternalUpdate] = useState(false);
  const [imageUrls, setImageUrls] = useState<Map<number, string>>(new Map());

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 دالة لجلب الـ URL الحقيقي من الـ API
  const fetchMediaUrl = async (id: number): Promise<string> => {
    // 🔥 نرجع من الـ Cache لو موجود
    if (imageUrls.has(id)) {
      return imageUrls.get(id)!;
    }

    try {
      const response = await api.get(`/media/${id}`);
      console.log(`📸 Fetched media ${id}:`, response.data);
      
      const url = response.data?.data?.fullUrl || 
                  response.data?.data?.previewUrl || 
                  response.data?.data?.url ||
                  `/storage/media/files/${id}`;
      
      // 🔥 نخزن في الـ Cache
      setImageUrls(prev => new Map(prev).set(id, url));
      
      return url;
    } catch (error) {
      console.error(`❌ Failed to fetch media ${id}:`, error);
      return `/storage/media/files/${id}`;
    }
  };

  // 🔥 دالة لجلب URLs متعددة بالتوازي
  const fetchMultipleMediaUrls = async (ids: number[]): Promise<Map<number, string>> => {
    const urlMap = new Map<number, string>();
    
    // 🔥 نجيب الـ IDs اللي مش في الـ Cache
    const idsToFetch = ids.filter(id => !imageUrls.has(id));
    
    if (idsToFetch.length === 0) {
      // 🔥 كل الـ IDs موجودة في الـ Cache
      ids.forEach(id => {
        if (imageUrls.has(id)) {
          urlMap.set(id, imageUrls.get(id)!);
        }
      });
      return urlMap;
    }
    
    // 🔥 نجيب الـ URLs بالتوازي
    const promises = idsToFetch.map(async (id) => {
      const url = await fetchMediaUrl(id);
      urlMap.set(id, url);
    });
    
    await Promise.all(promises);
    
    // 🔥 نضيف الـ IDs اللي كانت في الـ Cache
    ids.forEach(id => {
      if (imageUrls.has(id) && !urlMap.has(id)) {
        urlMap.set(id, imageUrls.get(id)!);
      }
    });
    
    return urlMap;
  };

  // 🔥 دالة للحصول على URL الصورة (متزامنة)
  const getImageUrlSync = (id: number): string => {
    if (imageUrls.has(id)) {
      return imageUrls.get(id)!;
    }
    // 🔥 نرجع placeholder مؤقت
    return `/storage/media/files/${id}`;
  };

  // 🔥 دالة لاستخراج الـ ID من الصورة
  const getImageId = (img: any): number | null => {
    return img?.id || img?.imageId || null;
  };

  // 🔥 عند تغيير defaultGallery
  useEffect(() => {
    const loadGallery = async () => {
      console.log('🔄 FileUploader - defaultGallery changed:', defaultGallery);
      
      if (defaultGallery && defaultGallery.length > 0) {
        // 🔥 نستخرج الـ IDs
        const ids = defaultGallery
          .map(img => getImageId(img))
          .filter(id => id !== null) as number[];
        
        // 🔥 نزيل التكرار
        const uniqueIds = [...new Set(ids)];
        
        // 🔥 نجيب الـ URLs من الـ API
        const urlMap = await fetchMultipleMediaUrls(uniqueIds);
        
        // 🔥 نبني مصفوفة الصور مع الـ URLs
        const uniqueMap = new Map();
        defaultGallery.forEach(item => {
          const id = getImageId(item);
          if (id && uniqueIds.includes(id)) {
            const url = urlMap.get(id) || `/storage/media/files/${id}`;
            uniqueMap.set(id, {
              ...item,
              fullUrl: url,
              previewUrl: url,
              url: url,
            });
          }
        });
        
        const uniqueImages = Array.from(uniqueMap.values());
        setGalleryImages(uniqueImages);
        setExistingIds(uniqueIds);
        setShowDefaultImage(false);
        setIsExternalUpdate(true);
        
        console.log('📸 Gallery updated with URLs:', uniqueImages);
        console.log('📸 IDs:', uniqueIds);
      } else if (defaultGallery && defaultGallery.length === 0) {
        setGalleryImages([]);
        setExistingIds([]);
        setShowDefaultImage(true);
        setIsExternalUpdate(true);
      }
    };
    
    loadGallery();
  }, [defaultGallery]);

  // 🔥 تنظيف الـ URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  // 🔥 عند تغيير defaultImageUrl
  useEffect(() => {
    if (defaultImageUrl && !uploadedFiles.length && !galleryImages.length) {
      setShowDefaultImage(true);
    } else {
      setShowDefaultImage(false);
    }
  }, [defaultImageUrl, uploadedFiles.length, galleryImages.length]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const validateVideoSize = (file: File): boolean => {
    if (file.type.startsWith('video/')) {
      const maxSizeInBytes = maxVideoSize * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert(`Video size cannot exceed ${maxVideoSize}MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return false;
      }
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    if (files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at once`);
      return;
    }

    for (const file of files) {
      if (!validateVideoSize(file)) {
        return;
      }
    }

    setLoading(true);

    if (preview) {
      const newPreviewUrls: string[] = [];
      const newPreviewTypes: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviewUrls[i] = e.target?.result as string;
            newPreviewTypes[i] = 'image';
            setPreviewUrls([...newPreviewUrls]);
            setPreviewTypes([...newPreviewTypes]);
          };
          reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          const videoUrl = URL.createObjectURL(file);
          newPreviewUrls[i] = videoUrl;
          newPreviewTypes[i] = 'video';
          setPreviewUrls([...newPreviewUrls]);
          setPreviewTypes([...newPreviewTypes]);
        }
      }
    }

    try {
      const uploadedIds: number[] = [];
      const uploadedFilesData: { id: number; name: string; url?: string; fullUrl?: string }[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post("/media", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const data = res.data;
        if (data?.data?.id) {
          const fileId = data.data.id;
          const fileUrl = data.data.fullUrl || data.data.previewUrl || data.data.url;
          
          uploadedIds.push(fileId);
          uploadedFilesData.push({
            id: fileId,
            name: file.name,
            url: fileUrl,
            fullUrl: fileUrl,
          });
          
          // 🔥 نخزن الـ URL في الـ Cache
          if (fileUrl) {
            setImageUrls(prev => new Map(prev).set(fileId, fileUrl));
          }
        } else {
          console.error("Upload failed for file:", file.name);
        }
      }

      if (uploadedIds.length > 0) {
        setShowDefaultImage(false);
        
        let allIds: number[] = [];
        let allImages: any[] = [];
        
        if (appendMode) {
          const combinedIds = [...existingIds, ...uploadedIds];
          allIds = [...new Set(combinedIds)];
          
          const newImages = uploadedIds.map((id, index) => {
            const fileData = uploadedFilesData[index];
            const url = fileData?.fullUrl || fileData?.url || getImageUrlSync(id);
            return {
              id: id,
              fullUrl: url,
              previewUrl: url,
              url: url,
              name: files[index]?.name || `image-${id}`,
            };
          });
          
          const combinedImages = [...galleryImages, ...newImages];
          const uniqueMap = new Map();
          
          combinedImages.forEach(item => {
            const id = item.id || item.imageId;
            if (id) {
              const url = item.fullUrl || item.previewUrl || item.url || getImageUrlSync(id);
              uniqueMap.set(id, {
                ...item,
                fullUrl: url,
                previewUrl: url,
                url: url,
              });
            }
          });
          
          allImages = Array.from(uniqueMap.values());
        } else {
          allIds = uploadedIds;
          allImages = uploadedIds.map((id, index) => {
            const fileData = uploadedFilesData[index];
            const url = fileData?.fullUrl || fileData?.url || getImageUrlSync(id);
            return {
              id: id,
              fullUrl: url,
              previewUrl: url,
              url: url,
              name: files[index]?.name || `image-${id}`,
            };
          });
        }
        
        setGalleryImages(allImages);
        setExistingIds(allIds);
        setUploadedFiles(prev => [...prev, ...uploadedFilesData]);
        
        onUploadSuccess(allIds);
        
        console.log(`✅ ${uploadedIds.length} file(s) uploaded successfully`);
        console.log('📸 All IDs (unique):', allIds);
      }

    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Error uploading files");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...galleryImages];
    newGallery.splice(index, 1);
    
    const ids = newGallery
      .map(img => img.id || img.imageId)
      .filter(id => id !== null && id !== undefined);
    
    const uniqueIds = [...new Set(ids)];
    
    setGalleryImages(newGallery);
    setExistingIds(uniqueIds);
    
    setUploadedFiles(prev => {
      return prev.filter(f => uniqueIds.includes(f.id));
    });
    
    if (uniqueIds.length > 0) {
      onUploadSuccess(uniqueIds);
    } else {
      onUploadSuccess([]);
      if (onRemoveImage) {
        onRemoveImage();
      }
    }
    
    console.log('🗑️ Removed image at index:', index);
    console.log('📸 Remaining IDs (unique):', uniqueIds);
  };

  const removeFile = (index: number) => {
    if (previewTypes[index] === 'video' && previewUrls[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setPreviewTypes(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveDefaultImage = () => {
    setShowDefaultImage(false);
    setGalleryImages([]);
    setExistingIds([]);
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  const isDefaultVideo = defaultImageUrl?.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i);

  const getImageSrc = (img: any): string => {
    if (typeof img === 'string') return img;
    if (img?.fullUrl) return img.fullUrl;
    if (img?.previewUrl) return img.previewUrl;
    if (img?.url) return img.url;
    if (img?.id) {
      // 🔥 نجيب من الـ Cache أو نرجع placeholder
      return getImageUrlSync(img.id);
    }
    return '/placeholder-image.png';
  };

  return (
    <div className="mb-4" onClick={(e) => e.stopPropagation()}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      {/* 🔥 عرض معرض الصور الحالي (Gallery) */}
      {galleryImages.length > 0 && !uploadedFiles.length && !previewUrls.length && (
        <div className="mb-3">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {galleryImages.map((img, index) => {
              const uniqueKey = img.id || img.imageId || `img-${index}`;
              const imageSrc = getImageSrc(img);
              
              return (
                <div key={`${uniqueKey}-${index}`} className="relative group">
                  <img
                    src={imageSrc}
                    alt={`Gallery ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      console.error(`❌ Failed to load image ${index + 1}:`, imageSrc);
                      e.currentTarget.src = '/placeholder-image.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => window.open(imageSrc, '_blank')}
                      className="bg-white text-gray-700 p-1 rounded-full hover:bg-gray-100"
                      title="View full size"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="absolute -top-1 -right-1 bg-[#e0b277] text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 text-center">
            {galleryImages.length} images in gallery
          </p>
        </div>
      )}

      {/* 🔥 عرض الملف الحالي */}
      {showDefaultImage && defaultImageUrl && !uploadedFiles.length && !previewUrls.length && !galleryImages.length && (
        <div className="mb-3 relative group">
          <div className="relative">
            {isDefaultVideo ? (
              <video
                src={defaultImageUrl}
                className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                controls
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={defaultImageUrl}
                alt="Current media"
                className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.png';
                }}
              />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => window.open(defaultImageUrl, '_blank')}
                className="bg-white text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                title="View full size"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemoveDefaultImage}
                className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                title="Remove media"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 text-center">
            Current {isDefaultVideo ? 'video' : 'image'} (ID: {defaultImageId})
          </p>
        </div>
      )}

      {/* Upload Button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#e0b277] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="text-[#e0b277] mb-2 animate-spin" size={28} />
            <p className="text-gray-600 dark:text-gray-400 text-sm">Uploading...</p>
          </>
        ) : (
          <>
            <UploadCloud className="text-gray-500 dark:text-gray-400 mb-2" size={28} />
            <p className="text-gray-600 dark:text-gray-400 text-sm">Click to upload or drag & drop</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              {accept.includes("video") && accept.includes("image")
                ? "📷 Images: PNG, JPG, GIF up to 10MB | 🎥 Videos: MP4, WebM, MOV up to 5MB"
                : accept === "image/*"
                  ? "PNG, JPG, GIF up to 10MB"
                  : "PDF, DOC, DOCX up to 10MB"}
            </p>
            {multiple && (
              <p className="text-gray-400 dark:text-gray-500 text-xs">Max {maxFiles} files</p>
            )}
          </>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
        className="hidden"
        id={uniqueId}
        multiple={multiple}
      />

      {/* 🔥 معاينة الملفات الجديدة */}
      {preview && previewUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              {previewTypes[index] === 'video' ? (
                <video
                  src={url}
                  className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  controls
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* قائمة الملفات المرفوعة */}
      {uploadedFiles.length > 0 && !loading && (
        <ul className="mt-2 space-y-1">
          {uploadedFiles.map((file, index) => (
            <li key={file.id || index} className="flex items-center justify-between text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
              <span className="flex items-center gap-2">
                <span>✓</span>
                <span className="truncate max-w-[200px]">{file.name}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}