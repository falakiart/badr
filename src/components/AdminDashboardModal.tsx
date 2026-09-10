import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, Image as ImageIcon, Tag, Palette, Check, Trash2, 
  Search, Filter, Plus, Phone, MapPin, DollarSign, Download, Sparkles, Eye, RefreshCw,
  Lock, User, KeyRound, LogOut, ShieldCheck, MessageSquare, Star, CheckCircle2, MessageSquarePlus, Edit3, Save,
  Video, Play, Film, ExternalLink, Repeat, Volume2, Upload, FolderUp, FileVideo, FileImage, ArrowUpRight,
  Package, Type, FileText, Flame, Copy, Scan, Maximize2
} from 'lucide-react';
import { BundleOffer, CODOrder, Currency, GalleryImage, Review, ThemeConfig, ThemePreset } from '../types';
import { formatPrice } from '../data/productData';
import { parseVideoUrl } from './ProductVideo';
import { compressImageFile, storeMediaBlob } from '../utils/mediaStorage';
import { uploadMediaToServer } from '../utils/apiSync';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CODOrder[];
  onUpdateOrderStatus: (orderId: string, status: CODOrder['status']) => void;
  onUpdateOrder?: (updatedOrder: CODOrder) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddSampleOrder: () => void;
  onClearAllOrders: () => void;
  galleryImages: GalleryImage[];
  onUpdateGalleryImages: (images: GalleryImage[]) => void;
  bundles: BundleOffer[];
  onUpdateBundles: (bundles: BundleOffer[]) => void;
  theme: ThemeConfig;
  onUpdateTheme: (newTheme: Partial<ThemeConfig>) => void;
  currency: Currency;
  reviewsList: Review[];
  onAddReview: (review: Review) => void;
  onDeleteReview: (reviewId: string) => void;
  onUpdateReviews?: (reviews: Review[]) => void;
}

const PRESET_PHOTOS = [
  {
    title: 'Bottle Product Shot 1',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: 'Product Bottle Shot 2',
    url: 'https://images.unsplash.com/photo-1608248597260-24959146f3a3?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: 'Foam Texture Closeup',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: 'Natural Aloe Vera & Cactus',
    url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: 'Hydrated Shiny Hair Waves',
    url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: 'Natural Botanical Ingredients',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
  },
];

const THEME_PRESETS: Record<ThemePreset, { name: string; primary: string; accent: string; bg: string; cardBg: string }> = {
  botanical: {
    name: 'Clean Beige & Verdant (Default)',
    primary: '#2F3E30',
    accent: '#8AA48A',
    bg: '#FDFCFB',
    cardBg: '#F4F1ED',
  },
  organic: {
    name: 'Warm Olive & Sand',
    primary: '#4d7c0f',
    accent: '#c2410c',
    bg: '#fefce8',
    cardBg: '#ffffff',
  },
  rosegold: {
    name: 'Rose Gold & Luxe Pink',
    primary: '#be185d',
    accent: '#b45309',
    bg: '#fff1f2',
    cardBg: '#ffffff',
  },
  darkvelvet: {
    name: 'Dark Forest Velvet',
    primary: '#059669',
    accent: '#f59e0b',
    bg: '#0f172a',
    cardBg: '#1e293b',
  },
};

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onUpdateOrder,
  onDeleteOrder,
  onAddSampleOrder,
  onClearAllOrders,
  galleryImages,
  onUpdateGalleryImages,
  bundles,
  onUpdateBundles,
  theme,
  onUpdateTheme,
  currency,
  reviewsList = [],
  onAddReview,
  onDeleteReview,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'product' | 'photos' | 'prices' | 'theme' | 'reviews' | 'video'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<CODOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<CODOrder | null>(null);

  // Product Name & Info state
  const [productTitleInput, setProductTitleInput] = useState(theme.productTitle || 'موس الشعر بالصبار وزيت التين الشوكي – بدون غسل');
  const [productSubtitleInput, setProductSubtitleInput] = useState(theme.productSubtitle || 'رغوة نباتية خفيفة ترطب وتفك التشابك وتمنح لمعاناً حريرياً بدون أي دهون أو قشور');
  const [productBadgeInput, setProductBadgeInput] = useState(theme.productBadge || 'الأكثر طلباً ومبيعاً في المغرب 🇲🇦');
  const [stockAlertInput, setStockAlertInput] = useState(theme.stockAlertText || 'فقط 14 عبوة متبقية في المخزون!');
  const [productSaveNotice, setProductSaveNotice] = useState<string | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  useEffect(() => {
    if (theme.productTitle !== undefined) setProductTitleInput(theme.productTitle);
    if (theme.productSubtitle !== undefined) setProductSubtitleInput(theme.productSubtitle);
    if (theme.productBadge !== undefined) setProductBadgeInput(theme.productBadge);
    if (theme.stockAlertText !== undefined) setStockAlertInput(theme.stockAlertText);
  }, [theme.productTitle, theme.productSubtitle, theme.productBadge, theme.stockAlertText]);

  // Media Center Sub-tab state & upload state
  const [mediaSubTab, setMediaSubTab] = useState<'photos' | 'video'>('photos');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadNotice, setPhotoUploadNotice] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<string | null>(null);
  const [videoUploadNotice, setVideoUploadNotice] = useState<string | null>(null);
  const [uploadedVideoFileName, setUploadedVideoFileName] = useState<string | null>(null);

  // Video state
  const [videoUrlInput, setVideoUrlInput] = useState(theme.videoUrl || '');
  const [videoTitleInput, setVideoTitleInput] = useState(theme.videoTitle || '');
  const [videoSubtitleInput, setVideoSubtitleInput] = useState(theme.videoSubtitle || '');
  const [showVideoInput, setShowVideoInput] = useState(theme.showVideoSection !== false);
  const [videoLoopInput, setVideoLoopInput] = useState(theme.videoLoop !== false);
  const [videoAutoplayInput, setVideoAutoplayInput] = useState(theme.videoAutoplay !== false);
  const [videoShowcaseInput, setVideoShowcaseInput] = useState(theme.videoShowcaseMode !== false);
  const [videoSaveNotice, setVideoSaveNotice] = useState(false);
  const [bundleSaveNotice, setBundleSaveNotice] = useState<string | null>(null);
  const [themeSaveNotice, setThemeSaveNotice] = useState<string | null>(null);

  // Admin Review form state
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [adminRevAuthor, setAdminRevAuthor] = useState('');
  const [adminRevCity, setAdminRevCity] = useState('Casablanca');
  const [adminRevRating, setAdminRevRating] = useState(5);
  const [adminRevHairType, setAdminRevHairType] = useState('Curly 3B');
  const [adminRevComment, setAdminRevComment] = useState('');
  const [adminRevImageUrl, setAdminRevImageUrl] = useState('');
  const [adminRevDate, setAdminRevDate] = useState('Aujourd\'hui');
  const [adminRevVerified, setAdminRevVerified] = useState(true);

  const [adminReviewSearch, setAdminReviewSearch] = useState('');
  const [adminReviewRatingFilter, setAdminReviewRatingFilter] = useState<number | 'all'>('all');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === 'badr' && passwordInput === 'Raja@1949') {
      setIsAuthenticated(true);
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Nom d\'utilisateur ou mot de passe incorrect!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
        <div className="bg-slate-900 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-800 relative space-y-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            {theme.logoUrl ? (
              <div className="flex justify-center">
                <img 
                  src={theme.logoUrl} 
                  alt={theme.logoText || "Store Logo"} 
                  className="h-14 max-w-[200px] object-contain rounded-xl border border-slate-700 bg-slate-800 p-1" 
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
                🌿
              </div>
            )}
            <h2 className="text-xl font-black tracking-tight text-white">
              {theme.logoText || 'vola.ma'}
            </h2>
            <p className="text-xs text-slate-400">تسجيل الدخول / Admin Login (Espace sécurisé)</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-center">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Nom d'utilisateur (Username)
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Username / اسم المستخدم"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" /> Mot de passe (Password)
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>الدخول إلى لوحة التحكم / Se Connecter</span>
            </button>
          </form>

          <div className="text-center pt-2 text-[11px] text-slate-500">
            PhytoBotanica Admin Protected Area
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesQuery = 
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.phone.includes(searchQuery) ||
      ord.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totalRevenueMAD = orders.reduce((acc, curr) => acc + curr.totalMAD, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const handleUpdateImage = (index: number, field: keyof GalleryImage, value: string) => {
    const updated = [...galleryImages];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateGalleryImages(updated);
  };

  const handleSaveAllGalleryPhotos = async () => {
    setIsSavingGallery(true);
    try {
      await onUpdateGalleryImages(galleryImages);
      setPhotoUploadNotice('✅ تم حفظ جميع الصور وتعميمها بنجاح على السيرفر لجميع الزوار الجدد والحاليين!');
      setTimeout(() => setPhotoUploadNotice(null), 5000);
    } catch (e) {
      setPhotoUploadNotice('حدث خطأ أثناء الحفظ، يرجى المحاولة ثانية');
      setTimeout(() => setPhotoUploadNotice(null), 4000);
    } finally {
      setIsSavingGallery(false);
    }
  };

  const handleAddBlankPhoto = () => {
    const newImg: GalleryImage = {
      id: `img-${Date.now()}`,
      title: 'صورة جديدة',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1000',
      alt: 'صورة المنتج',
    };
    const updated = [...galleryImages, newImg];
    onUpdateGalleryImages(updated);
    setPhotoUploadNotice('تمت إضافة خانة صورة جديدة، يمكنك تعديل عنوانها أو رابطها أو استبدالها من جهازك ثم الضغط على حفظ.');
    setTimeout(() => setPhotoUploadNotice(null), 4000);
  };

  const handlePhotoFileUpload = async (files: FileList | null, targetIndex?: number) => {
    if (!files || files.length === 0) return;
    setIsUploadingPhoto(true);
    try {
      if (targetIndex !== undefined) {
        // Replacing a specific gallery photo
        const file = files[0];
        let photoUrl: string;
        try {
          photoUrl = await uploadMediaToServer(file);
        } catch (upErr) {
          console.warn('Server upload fallback to compressed base64:', upErr);
          photoUrl = await compressImageFile(file, 1280, 0.88);
        }

        const updated = [...galleryImages];
        updated[targetIndex] = {
          ...updated[targetIndex],
          url: photoUrl,
          title: updated[targetIndex].title || file.name.replace(/\.[^/.]+$/, ''),
        };
        await onUpdateGalleryImages(updated);
        setPhotoUploadNotice(`✅ تم رفع واستبدال الصورة #${targetIndex + 1} وحفظها في السيرفر لجميع الزوار بنجاح!`);
      } else {
        // Adding new photo(s) to the gallery
        const newImages: GalleryImage[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          let photoUrl: string;
          try {
            photoUrl = await uploadMediaToServer(file);
          } catch (upErr) {
            console.warn('Server upload fallback to compressed base64:', upErr);
            photoUrl = await compressImageFile(file, 1280, 0.88);
          }
          newImages.push({
            id: `uploaded-${Date.now()}-${i}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            url: photoUrl,
            alt: file.name,
          });
        }
        await onUpdateGalleryImages([...galleryImages, ...newImages]);
        setPhotoUploadNotice(`✅ تم رفع ${newImages.length} صورة وحفظها في السيرفر لجميع الزوار بنجاح!`);
      }
      setTimeout(() => setPhotoUploadNotice(null), 5000);
    } catch (err) {
      console.error(err);
      setPhotoUploadNotice('حدث خطأ أثناء معالجة الصورة، يرجى المحاولة مرة أخرى.');
      setTimeout(() => setPhotoUploadNotice(null), 4000);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDeleteGalleryImage = (indexToDelete: number) => {
    if (galleryImages.length <= 1) {
      alert('يجب أن تحتوي الصفحة على صورة واحدة على الأقل للمنتج');
      return;
    }
    const updated = galleryImages.filter((_, idx) => idx !== indexToDelete);
    onUpdateGalleryImages(updated);
    setPhotoUploadNotice('تم حذف الصورة من المعرض وتحديث السيرفر');
    setTimeout(() => setPhotoUploadNotice(null), 3000);
  };

  const handleSetMainPhoto = (indexToMain: number) => {
    if (indexToMain === 0) return;
    const target = galleryImages[indexToMain];
    const filtered = galleryImages.filter((_, idx) => idx !== indexToMain);
    onUpdateGalleryImages([target, ...filtered]);
    setPhotoUploadNotice('تم تعيين الصورة كصورة رئيسية أولى وتحديث السيرفر لجميع الزوار!');
    setTimeout(() => setPhotoUploadNotice(null), 3000);
  };

  const handleVideoFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('video/')) {
      alert('يرجى اختيار ملف فيديو صالح بصيغة MP4 أو WebM أو MOV');
      return;
    }
    setIsUploadingVideo(true);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setVideoUploadProgress(`جاري رفع الفيديو إلى السيرفر (${sizeInMB} MB)...`);
    setUploadedVideoFileName(`${file.name} (${sizeInMB} MB)`);

    try {
      const serverUrl = await uploadMediaToServer(file);
      setVideoUrlInput(serverUrl);

      onUpdateTheme({
        videoUrl: serverUrl,
        videoTitle: videoTitleInput.trim() || 'شاهد روعة المنتج والنتيجة الفورية',
        videoSubtitle: videoSubtitleInput.trim(),
        showVideoSection: true,
        videoLoop: videoLoopInput,
        videoAutoplay: videoAutoplayInput,
        videoShowcaseMode: videoShowcaseInput,
      });

      storeMediaBlob('uploaded_product_video', file).catch(() => {});

      setVideoUploadNotice(`تم رفع وتثبيت الفيديو على السيرفر بنجاح (${file.name})! سيظهر الآن لأي زائر جديد يدخل إلى الموقع.`);
      setTimeout(() => setVideoUploadNotice(null), 6000);
    } catch (err) {
      console.error('Video upload error:', err);
      const blobUrl = await storeMediaBlob('uploaded_product_video', file);
      setVideoUrlInput(blobUrl);
      onUpdateTheme({
        videoUrl: blobUrl,
        showVideoSection: true,
      });
      setVideoUploadNotice('تم حفظ الفيديو محلياً!');
      setTimeout(() => setVideoUploadNotice(null), 4000);
    } finally {
      setIsUploadingVideo(false);
      setVideoUploadProgress(null);
    }
  };

  const handleUpdateBundleField = (index: number, field: keyof BundleOffer, value: any) => {
    const updated = [...bundles];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateBundles(updated);
  };

  const handleSaveAllBundles = () => {
    onUpdateBundles(bundles);
    setBundleSaveNotice('✅ تم حفظ وتعميم جميع الأسعار والعروض بنجاح على المتجر لجميع الزوار!');
    setTimeout(() => setBundleSaveNotice(null), 4000);
  };

  const handleSaveTheme = () => {
    onUpdateTheme(theme);
    setThemeSaveNotice('✅ تم حفظ وتعميم إعدادات المظهر والشعار بنجاح على المتجر لجميع الزوار!');
    setTimeout(() => setThemeSaveNotice(null), 4000);
  };

  const handleSaveProductInfo = async () => {
    setIsSavingProduct(true);
    try {
      const updatedTheme: ThemeConfig = {
        ...theme,
        productTitle: productTitleInput.trim(),
        productSubtitle: productSubtitleInput.trim(),
        productBadge: productBadgeInput.trim(),
        stockAlertText: stockAlertInput.trim(),
      };
      await onUpdateTheme(updatedTheme);
      setProductSaveNotice('✅ تم حفظ وتعميم اسم المنتج وتفاصيله بنجاح لجميع الزوار على الموقع!');
      setTimeout(() => setProductSaveNotice(null), 5000);
    } catch (e) {
      setProductSaveNotice('حدث خطأ أثناء الحفظ، يرجى المحاولة مرة أخرى');
      setTimeout(() => setProductSaveNotice(null), 4000);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order #', 'Customer Name', 'Phone', 'City', 'Address', 'Bundle', 'Total (MAD)', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.orderNumber,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.city}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${o.bundle.title}"`,
      o.totalMAD,
      o.status,
      o.fullDate || o.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `verdant_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderVideoSectionContent = () => {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-950 flex items-start gap-3">
          <Film className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-emerald-900">
              رفع وتغيير فيديو المنتج / Upload Product Video
            </h4>
            <p className="text-emerald-800 leading-relaxed">
              يمكنك رفع فيديو استعراضي مباشر من هاتفك أو حاسوبك (MP4 / WebM / MOV)، أو وضع رابط من يوتيوب/فيميو. يعمل الفيديو بتنسيق استعراضي فوري (Showcase Reel) سلس وتكرار تلقائي ليجذب الزبائن ويعزز المبيعات.
            </p>
          </div>
        </div>

        {/* Success / Alert notice */}
        {videoUploadNotice && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              {videoUploadNotice}
            </span>
            <button
              onClick={() => setVideoUploadNotice(null)}
              className="text-emerald-700 hover:text-emerald-950 font-black px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Video Upload Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleVideoFileUpload(e.dataTransfer.files);
          }}
          className="bg-white p-6 rounded-3xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40 transition text-center space-y-3 relative group"
        >
          <input
            type="file"
            id="admin-video-file-picker"
            accept="video/mp4,video/webm,video/quicktime,video/*"
            className="hidden"
            onChange={(e) => handleVideoFileUpload(e.target.files)}
          />

          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition">
            <FileVideo className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900">
              رفع فيديو جديد من هاتفك أو حاسوبك (Télécharger la vidéo)
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              اضغط على الزر لاختيار ملف فيديو (MP4, WebM, MOV) أو اسحبه هنا مباشرة. سيتم حفظه وتشغيله فوراً على الموقع!
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <label
              htmlFor="admin-video-file-picker"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs cursor-pointer shadow-md transition"
            >
              <FolderUp className="w-4 h-4" />
              <span>اختيار ملف فيديو من الجهاز (Upload Video MP4)</span>
            </label>
          </div>

          {isUploadingVideo && (
            <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-2 animate-pulse pt-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{videoUploadProgress || 'جاري معالجة وتثبيت الفيديو...'}</span>
            </div>
          )}

          {uploadedVideoFileName && !isUploadingVideo && (
            <div className="text-[11px] font-bold text-slate-600 bg-slate-100/90 border border-slate-200 py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>الملف المرفوع حالياً: {uploadedVideoFileName}</span>
            </div>
          )}
        </div>

        {/* Video Settings Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                إعدادات عرض الفيديو والنصوص
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-bold text-slate-600">إظهار قسم الفيديو على الموقع:</span>
              <input
                type="checkbox"
                checked={showVideoInput}
                onChange={(e) => setShowVideoInput(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-1">
                رابط الفيديو الحالي / Video URL (أو مسار الملف المرفوع)
              </label>
              <input
                type="text"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="https://... أو رابط يوتيوب أو ملف MP4"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs font-mono text-slate-800 outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                ملاحظة: يمكنك إما رفع ملف فيديو من جهازك أعلاه أو كتابة رابط فيديو مباشر (MP4, YouTube, Vimeo).
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800 block">
                  عنوان قسم الفيديو / Video Title
                </label>
                <input
                  type="text"
                  value={videoTitleInput}
                  onChange={(e) => setVideoTitleInput(e.target.value)}
                  placeholder="شاهد طريقة الاستعمال والنتيجة الفورية على الشعر"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs font-medium text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800 block">
                  وصف تحت العنوان / Subtitle
                </label>
                <input
                  type="text"
                  value={videoSubtitleInput}
                  onChange={(e) => setVideoSubtitleInput(e.target.value)}
                  placeholder="شاهدي كيف تمنح رغوة الماوس ترطيباً عميقاً..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs font-medium text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Video Playback Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={videoShowcaseInput}
                  onChange={(e) => setVideoShowcaseInput(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-emerald-600 rounded"
                />
                <div className="text-xs space-y-0.5">
                  <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>فيديو استعراضي (Showcase)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    مظهر سينمائي نقي بدون أشرطة تحكم مزعجة مع أزرار لمس ناعمة.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={videoLoopInput}
                  onChange={(e) => setVideoLoopInput(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-emerald-600 rounded"
                />
                <div className="text-xs space-y-0.5">
                  <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تشغيل مستمر متكرر (Loop)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    يعيد تشغيل الفيديو تلقائياً وبشكل مستمر دون توقف.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={videoAutoplayInput}
                  onChange={(e) => setVideoAutoplayInput(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-emerald-600 rounded"
                />
                <div className="text-xs space-y-0.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تشغيل فوري تلقائي (Autoplay)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    يبدأ تشغيل الفيديو تلقائياً فور نزول الزائر للقسم.
                  </p>
                </div>
              </label>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">نماذج سريعة جاهزة:</span>
              <button
                type="button"
                onClick={() => {
                  setVideoUrlInput('https://assets.mixkit.co/videos/preview/mixkit-woman-brushing-her-long-shiny-hair-41126-large.mp4');
                }}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                💆 فيديو تجريبي لشعر انسيابي (MP4)
              </button>
              <button
                type="button"
                onClick={() => {
                  setVideoUrlInput('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                }}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                ▶️ تجربة رابط YouTube
              </button>
            </div>

            {/* Save Button */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onUpdateTheme({
                    videoUrl: videoUrlInput.trim(),
                    videoTitle: videoTitleInput.trim(),
                    videoSubtitle: videoSubtitleInput.trim(),
                    showVideoSection: showVideoInput,
                    videoLoop: videoLoopInput,
                    videoAutoplay: videoAutoplayInput,
                    videoShowcaseMode: videoShowcaseInput,
                  });
                  setVideoSaveNotice(true);
                  setTimeout(() => setVideoSaveNotice(false), 3500);
                }}
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition"
              >
                <Save className="w-4 h-4" />
                <span>حفظ وتطبيق الفيديو على الموقع / Save Video</span>
              </button>

              {videoSaveNotice && (
                <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" /> تم حفظ وتطبيق الفيديو على الموقع بنجاح!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-600" /> معاينة مباشرة لمشغل الفيديو على الموقع / Live Preview
            </h4>
            <span className="text-[11px] text-slate-400">
              {videoShowcaseInput ? '✨ وضع استعراضي (Showcase)' : 'مشغل قياسي'} • {videoLoopInput ? '🔁 Loop' : ''}
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-inner max-w-2xl mx-auto border-2 border-slate-200">
            {(() => {
              const previewParsed = parseVideoUrl(
                videoUrlInput || 'https://assets.mixkit.co/videos/preview/mixkit-woman-brushing-her-long-shiny-hair-41126-large.mp4',
                videoLoopInput,
                videoAutoplayInput,
                videoShowcaseInput
              );
              if (previewParsed.type === 'youtube') {
                return (
                  <iframe
                    src={previewParsed.src}
                    title="Preview Video"
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }
              if (previewParsed.type === 'vimeo') {
                return (
                  <iframe
                    src={previewParsed.src}
                    title="Preview Video"
                    className="w-full h-full border-0 absolute inset-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                );
              }
              if (previewParsed.type === 'html5') {
                return (
                  <video
                    src={previewParsed.src}
                    controls={!videoShowcaseInput}
                    loop={videoLoopInput}
                    autoPlay={videoAutoplayInput}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover sm:object-contain"
                  />
                );
              }
              return (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <Video className="w-10 h-10 mb-2 text-slate-600" />
                  <span className="text-xs font-bold">يرجى رفع فيديو أو إدخال رابط فيديو صالح</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header Bar */}
        <div className="p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">لوحة التحكم والإدارة / Store Admin Space</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE EDIT
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage customer orders, product photos, prices, and theme styling</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition flex items-center gap-1.5 text-xs font-bold border border-slate-700"
              title="Logout from Admin Space"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout (خروج)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Close Admin Space"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="bg-slate-800/90 text-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-medium border-b border-slate-700">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Orders</span>
              <span className="text-sm font-extrabold text-white">{orders.length} orders</span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Revenue</span>
              <span className="text-sm font-extrabold text-emerald-400">{formatPrice(totalRevenueMAD, currency)}</span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Pending Delivery</span>
              <span className="text-sm font-extrabold text-amber-400">{pendingOrdersCount} orders</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAddSampleOrder}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" /> + Add Sample Order
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 px-6 py-2.5 flex flex-wrap gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>1. الطلبات / Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('product')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'product'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span>2. اسم وتفاصيل المنتج / Product Info ✍️</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'photos'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>3. الصور والوسائط / Media</span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'prices'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>4. الأسعار والعروض / Prices</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'theme'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>5. المظهر والشعار / Theme</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>6. تقييمات الزبائن / Reviews ({reviewsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'video'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>7. الفيديو / Video</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">

          {/* TAB 1: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              
              {/* Search & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-1 items-center gap-2 max-w-md bg-slate-100 px-3 py-2 rounded-xl">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Name, Phone, City, Order #..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs w-full text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl text-xs">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent outline-none text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending ⏳</option>
                      <option value="confirmed">Confirmed ✅</option>
                      <option value="shipped">Shipped 🚚</option>
                      <option value="cancelled">Cancelled ❌</option>
                    </select>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    disabled={orders.length === 0}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>

                  {orders.length > 0 && (
                    <button
                      onClick={onClearAllOrders}
                      className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Orders Table */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl font-bold">
                    📦
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800">No Orders Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When customers submit orders on the COD form, they will appear here instantly!
                  </p>
                  <button
                    onClick={onAddSampleOrder}
                    className="mt-2 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Create Test Order Now
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-100 font-extrabold uppercase tracking-wider text-[10px] text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Order #</th>
                          <th className="p-3.5">Customer Name</th>
                          <th className="p-3.5">Phone</th>
                          <th className="p-3.5">City & Address</th>
                          <th className="p-3.5">Selected Offer</th>
                          <th className="p-3.5">Total MAD</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50 transition">
                            <td className="p-3.5 font-mono font-bold text-slate-900">
                              {ord.orderNumber}
                              <span className="block text-[10px] text-slate-400 font-sans">{ord.createdAt}</span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-900">
                              {ord.customerName}
                            </td>
                            <td className="p-3.5 font-mono text-slate-800 dir-ltr">
                              <a href={`tel:${ord.phone}`} className="hover:underline text-emerald-700 font-bold flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {ord.phone}
                              </a>
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-900 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-600" /> {ord.city}
                              </span>
                              <span className="text-[11px] text-slate-500 line-clamp-1">{ord.address}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-1 rounded bg-slate-100 font-bold text-[11px] text-slate-800">
                                {ord.bundle.title}
                              </span>
                            </td>
                            <td className="p-3.5 font-extrabold text-slate-900">
                              {formatPrice(ord.totalMAD, currency)}
                            </td>
                            <td className="p-3.5">
                              <select
                                value={ord.status}
                                onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as CODOrder['status'])}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold cursor-pointer border ${
                                  ord.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : ord.status === 'shipped'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : ord.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800 border-red-300'
                                    : 'bg-amber-100 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="pending">Pending ⏳</option>
                                <option value="confirmed">Confirmed ✅</option>
                                <option value="shipped">Shipped 🚚</option>
                                <option value="cancelled">Cancelled ❌</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-right space-x-1">
                              <button
                                onClick={() => setSelectedOrderDetails(ord)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition inline-flex items-center"
                                title="View Order Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingOrder(ord)}
                                className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition inline-flex items-center gap-1 font-bold text-xs"
                                title="Edit Order / تعديل الطلب"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteOrder(ord.id)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition inline-flex items-center"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PRODUCT TITLE & DETAILS MANAGEMENT */}
          {activeTab === 'product' && (
            <div className="space-y-6">
              {/* Header Action Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-3xl shadow-md border border-emerald-800">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <span>إدارة اسم ومعلومات المنتج الرئيسي</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                        Product Info
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      اكتب هنا اسم المنتج ديالك، الوصف القصير، والشارة الترويجية. أي تغيير كيتحفظ في السيرفر وتشوفوه فوراً لجميع الزوار.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSavingProduct}
                    onClick={handleSaveProductInfo}
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-2 shrink-0 active:scale-95"
                  >
                    {isSavingProduct ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري الحفظ...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>💾 حفظ وتعميم لجميع الزوار</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Notification Banner */}
              {productSaveNotice && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-extrabold text-xs flex items-center gap-2 shadow-sm animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{productSaveNotice}</span>
                </div>
              )}

              {/* Grid: Inputs Form on the Left, Live Customer Preview on the Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form Fields: 7 Columns */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <Type className="w-4 h-4 text-emerald-600" />
                      <span>بيانات وتسمية المنتج (Détails du produit)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      املأ الحقول التالية لتخصيص عنوان وهوية المنتج في صفحة البيع
                    </p>
                  </div>

                  {/* 1. Main Product Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-emerald-600" />
                        <span>اسم المنتج الرئيسي (Titre du produit) *</span>
                      </span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        H1 Title
                      </span>
                    </label>
                    <input
                      type="text"
                      value={productTitleInput}
                      onChange={(e) => setProductTitleInput(e.target.value)}
                      placeholder="مثال: موس الشعر بالصبار وزيت التين الشوكي – بدون غسل"
                      className="w-full p-3.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-sm font-bold text-slate-900 bg-white transition shadow-sm"
                    />
                    <p className="text-[11px] text-slate-500">
                      هذا هو العنوان الأكبر والأكثر وضوحاً في أعلى صفحة الهبوط للزبون.
                    </p>
                  </div>

                  {/* 2. Product Subtitle */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>الوصف الترويجي القصير تحت الاسم (Sous-titre / Accroche)</span>
                      </span>
                      <span className="text-[10px] text-slate-400">سطر أو سطرين</span>
                    </label>
                    <textarea
                      rows={3}
                      value={productSubtitleInput}
                      onChange={(e) => setProductSubtitleInput(e.target.value)}
                      placeholder="رغوة نباتية خفيفة ترطب وتفك التشابك وتمنح لمعاناً حريرياً بدون أي دهون أو قشور..."
                      className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-xs font-medium text-slate-800 bg-white transition shadow-sm leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-500">
                      جملة تلخص أبرز فائدة للمنتج وتظهر تحت الاسم مباشرة.
                    </p>
                  </div>

                  {/* 3. Product Badge */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>شارة التمييز الترويجية (Badge / Highlight Tag)</span>
                    </label>
                    <input
                      type="text"
                      value={productBadgeInput}
                      onChange={(e) => setProductBadgeInput(e.target.value)}
                      placeholder="مثال: الأكثر طلباً ومبيعاً في المغرب 🇲🇦"
                      className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs font-bold text-slate-900 bg-white transition shadow-sm"
                    />
                    <p className="text-[11px] text-slate-500">
                      تظهر كشارة مميزة باللون الأخضر والذهبي أعلى اسم المنتج لزيادة ثقة المشتري.
                    </p>
                  </div>

                  {/* 4. Stock Urgency Text */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-red-500" />
                      <span>نص تنبيه المخزون المتبقي (Urgency / Stock Scarcity)</span>
                    </label>
                    <input
                      type="text"
                      value={stockAlertInput}
                      onChange={(e) => setStockAlertInput(e.target.value)}
                      placeholder="مثال: فقط 14 عبوة متبقية في المخزون!"
                      className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs font-bold text-slate-900 bg-white transition shadow-sm"
                    />
                    <p className="text-[11px] text-slate-500">
                      يخلق عنصر الإلحاح والطلب السريع عند الزائر.
                    </p>
                  </div>

                  {/* One-click Presets */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-extrabold text-slate-700 block uppercase tracking-wider">
                      💡 اقتراحات سريعة لمنتجات شائعة (اضغط لتجربة الاسم):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProductTitleInput("موس الشعر بالصبار وزيت التين الشوكي – بدون غسل");
                          setProductSubtitleInput("رغوة نباتية خفيفة ترطب وتفك التشابك وتمنح لمعاناً حريرياً بدون أي دهون أو قشور");
                          setProductBadgeInput("الأكثر طلباً ومبيعاً في المغرب 🇲🇦");
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 text-[11px] font-bold text-slate-700 transition"
                      >
                        موس الشعر بالصبار
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProductTitleInput("سيروم زيت الأركان الملكي لتغذية وتكثيف الشعر");
                          setProductSubtitleInput("تركيبة مغربية أصيلة غنية بفيتامين E لمنع التساقط وإصلاح أطراف الشعر المتقصفة");
                          setProductBadgeInput("طبيعي 100% معتمد وعضوي 🌿");
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 text-[11px] font-bold text-slate-700 transition"
                      >
                        سيروم زيت الأركان
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProductTitleInput("كريم الكولاجين البحري الطبيعي لنضارة وشد البشرة");
                          setProductSubtitleInput("ترطيب فائق ومقاومة لعلامات التقدم في السن مع إشراقة فورية ونعومة تدوم 24 ساعة");
                          setProductBadgeInput("نتائج مضمونة من أول أسبوع ⭐");
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 text-[11px] font-bold text-slate-700 transition"
                      >
                        كريم الكولاجين البحري
                      </button>
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isSavingProduct}
                      onClick={handleSaveProductInfo}
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
                    >
                      {isSavingProduct ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>جاري الحفظ والتعميم في السيرفر...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>💾 حفظ وتعميم اسم المنتج الآن لجميع الزوار</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Live Preview Card: 5 Columns */}
                <div className="lg:col-span-5 space-y-4 sticky top-6">
                  <div className="bg-white p-5 rounded-3xl shadow-sm border-2 border-emerald-300 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          معاينة حية للمتجر (Live Preview)
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">
                        كما يظهر للزبون
                      </span>
                    </div>

                    {/* Storefront Mockup Box */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      {/* Rating & Stock */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-xs font-extrabold text-slate-900">4.9 / 5.0</span>
                        </div>

                        {stockAlertInput && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            <span>{stockAlertInput}</span>
                          </div>
                        )}
                      </div>

                      {/* Product Badge */}
                      {productBadgeInput && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <Sparkles className="w-3 h-3 text-emerald-700" />
                          <span>{productBadgeInput}</span>
                        </div>
                      )}

                      {/* Main Title Mock */}
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                        {productTitleInput || 'اكتب اسم المنتج هنا...'}
                      </h2>

                      {/* Subtitle Mock */}
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {productSubtitleInput || 'اكتب الوصف الترويجي هنا...'}
                      </p>

                      {/* Price Strip Sample */}
                      <div className="p-2.5 rounded-xl bg-emerald-100/60 border border-emerald-200 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-emerald-800 font-bold">باقة 2 عبوات الأكثر طلباً</div>
                          <div className="text-sm font-black text-emerald-950">329 درهم</div>
                        </div>
                        <span className="text-[10px] bg-amber-500 text-white font-extrabold px-2 py-1 rounded-md">
                          وفر 45% اليوم
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-slate-700 text-xs flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">
                        بمجرد الضغط على <strong>"حفظ وتعميم لجميع الزوار"</strong>، يتم تحديث الاسم فوراً في الواجهة العلوية، ونماذج الطلب، لجميع الهواتف والحواسيب.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: PHOTOS & MEDIA MANAGEMENT */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              
              {/* Media Sub-Tabs Switcher */}
              <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMediaSubTab('photos')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                    mediaSubTab === 'photos'
                      ? 'bg-white text-emerald-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>📸 صور المعرض والمنتج ({galleryImages.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaSubTab('video')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                    mediaSubTab === 'video'
                      ? 'bg-white text-emerald-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Film className="w-4 h-4 text-emerald-600" />
                  <span>🎬 فيديو المنتج الاستعراضي (Showcase Video)</span>
                </button>
              </div>

              {mediaSubTab === 'photos' ? (
                <div className="space-y-6">
                  {/* Photo Upload Notice */}
                  {photoUploadNotice && (
                    <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        {photoUploadNotice}
                      </span>
                      <button
                        onClick={() => setPhotoUploadNotice(null)}
                        className="text-emerald-700 hover:text-emerald-950 font-black px-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Dropzone for Uploading New Photos from Phone/PC */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handlePhotoFileUpload(e.dataTransfer.files);
                    }}
                    className="bg-white p-6 rounded-3xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40 transition text-center space-y-3 relative group"
                  >
                    <input
                      type="file"
                      id="admin-new-photos-input"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePhotoFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-slate-800">
                        رفع صور جديدة للمنتج من الهاتف أو الحاسوب (Télécharger les photos)
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        اسحب الصور هنا أو اضغط لاختيار ملفات من جهازك (JPG, PNG, WEBP). يتم ضغطها وتحسين جودتها تلقائياً لتسريع تحميل المتجر.
                      </p>
                    </div>
                    <div className="pt-1">
                      <label
                        htmlFor="admin-new-photos-input"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs cursor-pointer shadow-md transition"
                      >
                        <FolderUp className="w-4 h-4" />
                        <span>تصفح واختيار صور من الجهاز</span>
                      </label>
                    </div>
                    {isUploadingPhoto && (
                      <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-2 animate-pulse pt-2">
                        <RefreshCw className="w-4 h-4 animate-spin" /> جاري معالجة ورفع الصور إلى الموقع...
                      </div>
                    )}
                  </div>

                  {/* GitHub / Vercel deployment helper info card */}
                  <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-emerald-500/20 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
                          ⚡
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-1.5">
                            <span>نشر الصور تلقائياً لـ GitHub & Vercel لجميع الزوار</span>
                            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">مهم للـ Deployment</span>
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                            جميع الصور المرفوعة هنا تُحفظ فوراً داخل مجلد <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-[10px]">public/uploads/</code> وملف <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-[10px]">public/site-data.json</code>.
                            لكي تظهر لـ أي زائر جديد في Vercel، يكفي أن ترفع التعديلات إلى مستودع GitHub الخاص بك.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('git add . && git commit -m "Update store media & data" && git push');
                          setCopiedGitCmd(true);
                          setTimeout(() => setCopiedGitCmd(false), 3000);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow"
                      >
                        {copiedGitCmd ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>تم نسخ الأمر! ✅</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ أمر التحديث لـ GitHub</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Image Aspect Ratio & Display Mode Controls */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                          <Scan className="w-4 h-4 text-emerald-600" />
                          <span>أبعاد وحجم عرض صور المنتج (Aspect Ratio & Image Fit)</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          اختر المقاس المناسب لصورك لمنع قص الصورة وإظهار البوتيك والإنفوجرافيك كاملاً
                        </p>
                      </div>

                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full w-fit">
                        الحالي: {theme.imageAspectRatio || '9:16'} ({theme.imageFit === 'cover' ? 'ملء الإطار' : 'كاملة 100%'})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Aspect Ratio Picker */}
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-700 block">
                          1. مقاس الإطار (Aspect Ratio):
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: '9:16', label: '9:16 (طولي كامل)', sub: 'مثالي للإنفوجرافيك وصور الهاتف' },
                            { value: '4:5', label: '4:5 (بورتريه متوازن)', sub: 'مقاس إنستغرام الكلاسيكي' },
                            { value: '1:1', label: '1:1 (مربع)', sub: 'مقاس متساوي الأضلاع' },
                            { value: '16:9', label: '16:9 (عرضي)', sub: 'مقاس الشاشات الأفقية' },
                          ].map((item) => {
                            const isSelected = (theme.imageAspectRatio || '9:16') === item.value;
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => onUpdateTheme({ imageAspectRatio: item.value as any })}
                                className={`p-2.5 rounded-xl border-2 text-right transition flex flex-col justify-between ${
                                  isSelected
                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-sm ring-1 ring-emerald-500'
                                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                                }`}
                              >
                                <div className="text-xs font-black flex items-center justify-between">
                                  <span>{item.label}</span>
                                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1">{item.sub}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Image Fit Mode Picker */}
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-700 block">
                          2. طريقة ملاءمة الصورة (Image Fit Mode):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => onUpdateTheme({ imageFit: 'contain' })}
                            className={`p-3 rounded-xl border-2 text-right transition flex flex-col justify-between ${
                              (theme.imageFit || 'contain') === 'contain'
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-sm ring-1 ring-emerald-500'
                                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                            }`}
                          >
                            <div className="text-xs font-black flex items-center justify-between">
                              <span>✅ إظهار الصورة كاملة (Contain)</span>
                              {(theme.imageFit || 'contain') === 'contain' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">
                              بدون أي قص إطلاقاً! تظهر القنينة وكل النصوص بوضوح مع خلفية ضبابية أنيقة
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => onUpdateTheme({ imageFit: 'cover' })}
                            className={`p-3 rounded-xl border-2 text-right transition flex flex-col justify-between ${
                              theme.imageFit === 'cover'
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-sm ring-1 ring-emerald-500'
                                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                            }`}
                          >
                            <div className="text-xs font-black flex items-center justify-between">
                              <span>🔲 ملء كامل الإطار (Cover)</span>
                              {theme.imageFit === 'cover' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">
                              تمدد الصورة لملء كل المساحة (قد يتم قص أطراف الصورة الرأسية)
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Gallery Images with direct change buttons */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl">
                      <div>
                        <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-emerald-700" />
                          <span>صور المنتج المعروضة في المتجر ({galleryImages.length})</span>
                        </h3>
                        <p className="text-xs text-emerald-800/80 mt-0.5">
                          أي تغيير في الصور أو الروابط يمكنك حفظه فوراً ليظهر لجميع الزوار على أي جهاز أو متصفح
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleAddBlankPhoto}
                          className="px-3 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ صورة جديدة</span>
                        </button>
                        
                        <button
                          type="button"
                          disabled={isSavingGallery}
                          onClick={handleSaveAllGalleryPhotos}
                          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-black text-xs shadow-md transition flex items-center gap-1.5"
                        >
                          {isSavingGallery ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>جاري الحفظ...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>💾 حفظ وتعميم لجميع الزوار</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {galleryImages.map((img, idx) => (
                        <div key={img.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg ${
                                idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {idx === 0 ? '⭐ الصورة الرئيسية #1' : `صورة #${idx + 1}`}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{img.title}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetMainPhoto(idx)}
                                  className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold transition flex items-center gap-1"
                                  title="تعيين هذه الصورة في الواجهة الأولى"
                                >
                                  ⭐ الأولى
                                </button>
                              )}
                              {galleryImages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGalleryImage(idx)}
                                  className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                                  title="حذف هذه الصورة من المعرض"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3 items-start">
                            <div className="w-24 h-24 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative group/thumb">
                              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                              <label
                                htmlFor={`replace-img-${idx}`}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer transition p-1 text-center"
                              >
                                <Upload className="w-4 h-4 mb-0.5" />
                                <span>تغيير من الجهاز</span>
                              </label>
                              <input
                                type="file"
                                id={`replace-img-${idx}`}
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handlePhotoFileUpload(e.target.files, idx)}
                              />
                            </div>

                            <div className="flex-1 space-y-2 text-xs">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">عنوان / وصف الصورة</label>
                                <input
                                  type="text"
                                  value={img.title}
                                  onChange={(e) => handleUpdateImage(idx, 'title', e.target.value)}
                                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">رابط الصورة (URL أو مسار الصورة)</label>
                                <input
                                  type="text"
                                  value={img.url}
                                  onChange={(e) => handleUpdateImage(idx, 'url', e.target.value)}
                                  placeholder="https://... أو /uploads/..."
                                  className="w-full p-2 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-700 bg-slate-50 focus:bg-white"
                                />
                              </div>

                              <div className="pt-1 flex items-center gap-2">
                                <label
                                  htmlFor={`replace-img-btn-${idx}`}
                                  className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-[11px] text-center cursor-pointer border border-emerald-200 transition flex items-center justify-center gap-1.5"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>تغيير الصورة من الجهاز</span>
                                </label>
                                <input
                                  type="file"
                                  id={`replace-img-btn-${idx}`}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handlePhotoFileUpload(e.target.files, idx)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Save Bar */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        disabled={isSavingGallery}
                        onClick={handleSaveAllGalleryPhotos}
                        className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-black text-xs shadow-md transition flex items-center gap-2"
                      >
                        {isSavingGallery ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>جاري الحفظ في السيرفر...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>💾 حفظ وتعميم جميع الصور الآن لجميع الزوار</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Preset Gallery Photos Picker */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-700" />
                      <span>اختيار من مكتبة الصور الجاهزة / Curated Presets</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      اضغط على أي صورة جاهزة لتطبيقها فوراً كصورة رئيسية للمنتج:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {PRESET_PHOTOS.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleUpdateImage(0, 'url', preset.url)}
                          className="group text-left space-y-1.5 focus:outline-none"
                        >
                          <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 group-hover:border-emerald-600 transition group-hover:shadow-md">
                            <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                          </div>
                          <span className="block text-[10px] font-bold text-slate-700 group-hover:text-emerald-700 truncate">
                            {preset.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Video Sub-tab view inside Media tab */
                renderVideoSectionContent()
              )}

            </div>
          )}

          {/* TAB 3: PRICES & BUNDLES MANAGEMENT */}
          {activeTab === 'prices' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs text-amber-950">إدارة الأسعار والعروض / Instant Price & Offer Manager</h4>
                    <p className="mt-0.5 text-[11px] text-amber-800">
                      تعديل أسعار الباقات والعروض. يتم حفظها في السيرفر وتعميمها فوراً على جميع زوار الموقع.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAllBundles}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>💾 حفظ وتعميم الأسعار لجميع الزوار</span>
                </button>
              </div>

              {bundleSaveNotice && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{bundleSaveNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {bundles.map((bundle, bIdx) => (
                  <div key={bundle.id} className="bg-white p-5 rounded-2xl border-2 border-slate-200 space-y-4 shadow-sm relative">
                    {bundle.popular && (
                      <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase shadow">
                        Popular Choice
                      </span>
                    )}

                    <div className="border-b border-slate-100 pb-3">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">Offer Pack #{bIdx + 1}</span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-1">{bundle.title}</h3>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Offer Title</label>
                        <input
                          type="text"
                          value={bundle.title}
                          onChange={(e) => handleUpdateBundleField(bIdx, 'title', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 font-bold text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Original Price (MAD)</label>
                          <input
                            type="number"
                            value={bundle.originalPriceMAD}
                            onChange={(e) => handleUpdateBundleField(bIdx, 'originalPriceMAD', Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-slate-200 font-mono text-slate-500 line-through"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-emerald-700 mb-1">Selling Price (MAD)</label>
                          <input
                            type="number"
                            value={bundle.priceMAD}
                            onChange={(e) => handleUpdateBundleField(bIdx, 'priceMAD', Number(e.target.value))}
                            className="w-full p-2 rounded-lg border-2 border-emerald-500 font-mono font-black text-emerald-800 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Badge Text</label>
                        <input
                          type="text"
                          value={bundle.badge || ''}
                          onChange={(e) => handleUpdateBundleField(bIdx, 'badge', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Free Gift Included</label>
                        <input
                          type="text"
                          value={bundle.gift || ''}
                          onChange={(e) => handleUpdateBundleField(bIdx, 'gift', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: THEME & COLOR CUSTOMIZER */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              
              {themeSaveNotice && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{themeSaveNotice}</span>
                </div>
              )}

              {/* STORE LOGO & BRAND IDENTITY */}
              <div className="bg-emerald-950/90 text-white p-5 rounded-2xl border border-emerald-800/80 shadow-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-sm text-emerald-300 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-emerald-400" />
                      <span>شعار المتجر والهوية / Store Logo & Identity</span>
                    </h3>
                    <p className="text-xs text-emerald-200/80 mt-1">
                      قم بتغيير اسم المتجر أو رابط صورة الشعار لتظهر في الهيدر وصفحة تسجيل الدخول (Sign In)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveTheme}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>💾 حفظ وتعميم الهوية لجميع الزوار</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                        اسم/نص المتجر (Store Brand Name)
                      </label>
                      <input
                        type="text"
                        value={theme.logoText || 'vola.ma'}
                        onChange={(e) => onUpdateTheme({ logoText: e.target.value })}
                        placeholder="Ex: vola.ma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-800 text-white placeholder-slate-500 text-xs font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                        رابط صورة الشعار (Logo Image URL - Optional)
                      </label>
                      <input
                        type="text"
                        value={theme.logoUrl || ''}
                        onChange={(e) => onUpdateTheme({ logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400"
                      />
                      <span className="text-[10px] text-emerald-300/70 mt-1 block">
                        اتركه فارغاً للاعتماد على اسم الشعار النصي (vola.ma)
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        رقم الواتساب / الهاتف الخاص بك (WhatsApp / Phone Number)
                      </label>
                      <input
                        type="text"
                        value={theme.whatsappNumber || '212600000000'}
                        onChange={(e) => onUpdateTheme({ whatsappNumber: e.target.value })}
                        placeholder="212600000000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-800 text-emerald-300 placeholder-slate-500 text-xs font-mono font-bold focus:outline-none focus:border-emerald-400"
                      />
                      <span className="text-[10px] text-emerald-300/70 mt-1 block">
                        أدخل رقم هاتفك بترميز الدولة بدون (+) لتلقي الطلبات والاستفسارات عبر الواتساب (مثلاً: 212612345678)
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-emerald-300/90 uppercase tracking-wider mb-1.5">
                        نماذج شعارات جاهزة للتجربة (Sample Logos)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateTheme({ logoUrl: '', logoText: 'vola.ma' })}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-[11px] font-bold text-emerald-200 border border-emerald-700 transition"
                        >
                          🌿 Text Logo (vola.ma)
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateTheme({ 
                            logoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=200',
                            logoText: 'vola.ma' 
                          })}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-[11px] font-bold text-emerald-200 border border-emerald-700 transition"
                        >
                          🍃 Botanical Sample
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateTheme({ 
                            logoUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=200',
                            logoText: 'vola.ma' 
                          })}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-[11px] font-bold text-emerald-200 border border-emerald-700 transition"
                        >
                          🌵 Organic Stamp
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Logo Live Preview Panel */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-emerald-800/60 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block mb-2">
                        معاينة الشعار في الهيدر وصفحة الدخول (Live Preview)
                      </span>
                      
                      {/* Light Preview (Header) */}
                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-slate-400">Header Preview:</span>
                        {theme.logoUrl ? (
                          <img src={theme.logoUrl} alt="Logo Preview" className="h-8 max-w-[140px] object-contain" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white text-xs flex items-center justify-center font-bold">🌿</span>
                            <span className="font-black text-slate-900 text-sm">{theme.logoText || 'vola.ma'}</span>
                          </div>
                        )}
                      </div>

                      {/* Dark Preview (Sign In Screen) */}
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-500">Sign In Modal Preview:</span>
                        {theme.logoUrl ? (
                          <img src={theme.logoUrl} alt="Logo Preview" className="h-8 max-w-[140px] object-contain rounded bg-slate-900 p-0.5" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">🌿</span>
                            <span className="font-black text-white text-sm">{theme.logoText || 'vola.ma'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-emerald-300/80 bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-800/50 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>يتم حفظ التغييرات تلقائياً في المتجر!</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 shadow-md">
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <Palette className="w-5 h-5 text-emerald-400" />
                  <span>Color Theme Presets</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Select a ready-made color scheme or customize individual brand colors below:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
                    const preset = THEME_PRESETS[key];
                    const isSelected = theme.preset === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onUpdateTheme({
                            preset: key,
                            primaryColor: preset.primary,
                            accentColor: preset.accent,
                            bgColor: preset.bg,
                            cardBg: preset.cardBg,
                          });
                        }}
                        className={`p-3 rounded-xl border-2 text-left transition flex flex-col justify-between h-24 ${
                          isSelected
                            ? 'border-emerald-400 bg-slate-800 ring-2 ring-emerald-400/30'
                            : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                        }`}
                      >
                        <span className="text-xs font-extrabold text-white">{preset.name}</span>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.primary }} />
                          <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.accent }} />
                          <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.bg }} />
                          <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.cardBg }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">Custom Colors</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Primary Color (Buttons/Header)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                      />
                      <input
                        type="text"
                        value={theme.primaryColor}
                        onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                        className="flex-1 p-2 rounded-lg border border-slate-200 font-mono text-xs uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Accent Color (Badges/Highlights)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => onUpdateTheme({ accentColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                      />
                      <input
                        type="text"
                        value={theme.accentColor}
                        onChange={(e) => onUpdateTheme({ accentColor: e.target.value })}
                        className="flex-1 p-2 rounded-lg border border-slate-200 font-mono text-xs uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Page Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.bgColor}
                        onChange={(e) => onUpdateTheme({ bgColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                      />
                      <input
                        type="text"
                        value={theme.bgColor}
                        onChange={(e) => onUpdateTheme({ bgColor: e.target.value })}
                        className="flex-1 p-2 rounded-lg border border-slate-200 font-mono text-xs uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Component Toggles */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">Layout Component Toggles</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <span className="font-bold text-slate-800">Show Direct COD Form Section</span>
                    <input
                      type="checkbox"
                      checked={theme.showCodForm}
                      onChange={(e) => onUpdateTheme({ showCodForm: e.target.checked })}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <span className="font-bold text-slate-800">Show Live Sales Notifications Toast</span>
                    <input
                      type="checkbox"
                      checked={theme.showLiveSales}
                      onChange={(e) => onUpdateTheme({ showLiveSales: e.target.checked })}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <span className="font-bold text-slate-800">Show Floating Mobile Order Bar</span>
                    <input
                      type="checkbox"
                      checked={theme.showStickyBar}
                      onChange={(e) => onUpdateTheme({ showStickyBar: e.target.checked })}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <div>
                      <span className="font-bold text-slate-800 block">إظهار قسم قبل وبعد (Before & After Slider)</span>
                      <span className="text-[10px] text-slate-400">ميزة مقارنة النتيجة قبل وبعد استخدام المنتج</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={theme.showBeforeAfter || false}
                      onChange={(e) => onUpdateTheme({ showBeforeAfter: e.target.checked })}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: CUSTOMER REVIEWS MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Reviews Overview Header */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">إدارة آراء وتقييمات الزبناء (Manage Customer Reviews)</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {reviewsList.length} آراء معروضة
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    يمكنك إضافة، تعديل، أو حذف آراء الزبناء التي تظهر على الصفحة الرئيسية للموقع لتعزيز ثقة المشترين.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddReviewForm ? 'إغلاق الاستمارة' : 'إضافة رأي جديد (Add Review)'}</span>
                </button>
              </div>

              {/* Add New Review Form */}
              {showAddReviewForm && (
                <div className="bg-emerald-950 text-white p-6 rounded-3xl border border-emerald-700 shadow-xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                    <h4 className="font-extrabold text-sm text-emerald-200 flex items-center gap-2">
                      <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
                      إضافة رأي زبون جديد إلى الموقع (Add New Review)
                    </h4>
                    <button
                      onClick={() => setShowAddReviewForm(false)}
                      className="text-emerald-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!adminRevAuthor.trim() || !adminRevComment.trim()) return;
                      const newRev: Review = {
                        id: 'rev-' + Date.now(),
                        author: adminRevAuthor.trim(),
                        city: adminRevCity.trim() || 'Casablanca',
                        rating: adminRevRating,
                        date: adminRevDate.trim() || 'Aujourd\'hui',
                        comment: adminRevComment.trim(),
                        hairType: adminRevHairType.trim() || 'Curly 3B',
                        verified: adminRevVerified,
                        imageUrl: adminRevImageUrl.trim() || undefined,
                        helpfulCount: 0,
                      };
                      if (onAddReview) onAddReview(newRev);
                      setAdminRevAuthor('');
                      setAdminRevComment('');
                      setAdminRevImageUrl('');
                      setShowAddReviewForm(false);
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs"
                  >
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-200 mb-1">اسم الزبونة (Customer Name) *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: سناء التاهيري"
                        value={adminRevAuthor}
                        onChange={(e) => setAdminRevAuthor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-200 mb-1">المدينة (City)</label>
                      <input
                        type="text"
                        placeholder="مثال: Casablanca / Rabat / Marrakech"
                        value={adminRevCity}
                        onChange={(e) => setAdminRevCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-200 mb-1">التقييم (Rating Stars)</label>
                      <select
                        value={adminRevRating}
                        onChange={(e) => setAdminRevRating(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white font-bold focus:outline-none focus:border-emerald-400"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5 Stars)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5 Stars)</option>
                        <option value={3}>⭐⭐⭐ (3/5 Stars)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-200 mb-1">نوع الشعر (Hair Type)</label>
                      <input
                        type="text"
                        placeholder="Curly 3B / Ondulé / Lisse"
                        value={adminRevHairType}
                        onChange={(e) => setAdminRevHairType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-200 mb-1">تاريخ المراجعة (Date Display)</label>
                      <input
                        type="text"
                        placeholder="Aujourd'hui / Hier / il y a 2 jours"
                        value={adminRevDate}
                        onChange={(e) => setAdminRevDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-200 mb-1">رابط صورة التجربة (Photo URL - اختياري)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={adminRevImageUrl}
                        onChange={(e) => setAdminRevImageUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-xs font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2 md:col-span-3">
                      <label className="block text-[11px] font-bold text-emerald-200 mb-1">نص المراجعة والتعليق (Review Comment) *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="كتب رأي الزبونة هنا... (مثلاً: المنتج رائع جداً وكيرطب الشعر من أول استعمال)"
                        value={adminRevComment}
                        onChange={(e) => setAdminRevComment(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-3 sm:col-span-2 md:col-span-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-emerald-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adminRevVerified}
                          onChange={(e) => setAdminRevVerified(e.target.checked)}
                          className="w-4 h-4 accent-emerald-500 rounded"
                        />
                        <span>علامة طلب مؤكد (Verified Buyer Badge)</span>
                      </label>

                      <button
                        type="submit"
                        className="ml-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>حفظ ونشر الرأي (Save Review)</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-100 px-3 py-2 rounded-xl">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="بحث بالاسم، المدينة، نوع الشعر، أو النص..."
                    value={adminReviewSearch}
                    onChange={(e) => setAdminReviewSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs w-full text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">تصفية بالتقييم:</span>
                  <select
                    value={adminReviewRatingFilter}
                    onChange={(e) => setAdminReviewRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="all">جميع التقييمات (All Ratings)</option>
                    <option value={5}>⭐⭐⭐⭐⭐ (5 نجوم)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 نجوم)</option>
                    <option value={3}>⭐⭐⭐ (3 نجوم)</option>
                  </select>
                </div>
              </div>

              {/* Reviews Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewsList
                  .filter((r) => {
                    const matchesSearch =
                      r.author.toLowerCase().includes(adminReviewSearch.toLowerCase()) ||
                      r.city.toLowerCase().includes(adminReviewSearch.toLowerCase()) ||
                      r.comment.toLowerCase().includes(adminReviewSearch.toLowerCase()) ||
                      r.hairType.toLowerCase().includes(adminReviewSearch.toLowerCase());
                    const matchesRating = adminReviewRatingFilter === 'all' || r.rating === adminReviewRatingFilter;
                    return matchesSearch && matchesRating;
                  })
                  .map((rev) => (
                    <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 relative">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                              <span>{rev.author}</span>
                              <span className="text-[10px] text-slate-500 font-normal">({rev.city})</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                              {rev.verified && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Verified
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (confirm('هل أنت متأكد من حذف هذا الرأي؟')) {
                                onDeleteReview(rev.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-200"
                            title="حذف هذا الرأي (Delete Review)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                          "{rev.comment}"
                        </p>

                        {rev.imageUrl && (
                          <div className="pt-1">
                            <img src={rev.imageUrl} alt="Customer photo" className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-100 pt-2">
                        <span>ID: {rev.id}</span>
                        <span>نوع الشعر: {rev.hairType}</span>
                      </div>
                    </div>
                  ))}
              </div>

            </div>
          )}

          {/* TAB 6: PRODUCT VIDEO MANAGER */}
          {activeTab === 'video' && renderVideoSectionContent()}

        </div>

      </div>

      {/* View Order Modal Sub-Dialog */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">Order Detail Modal</span>
              <h3 className="text-xl font-black text-slate-900">Order #{selectedOrderDetails.orderNumber}</h3>
              <p className="text-xs text-slate-500">Submitted at {selectedOrderDetails.createdAt}</p>
            </div>

            <div className="space-y-3 text-xs text-slate-800">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Customer Info</span>
                <div className="font-extrabold text-sm">{selectedOrderDetails.customerName}</div>
                <div className="font-mono text-emerald-700 font-bold">{selectedOrderDetails.phone}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Delivery Address</span>
                <div className="font-bold text-slate-900">{selectedOrderDetails.city}</div>
                <div className="text-slate-600">{selectedOrderDetails.address}</div>
                {selectedOrderDetails.notes && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded mt-1">
                    Note: {selectedOrderDetails.notes}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Ordered Offer</span>
                  <span className="font-extrabold text-slate-900">{selectedOrderDetails.bundle.title}</span>
                </div>
                <div className="text-right font-black text-lg text-emerald-800">
                  {formatPrice(selectedOrderDetails.totalMAD, currency)}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setEditingOrder(selectedOrderDetails);
                  setSelectedOrderDetails(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span>تعديل الطلب / Edit Order</span>
              </button>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal Sub-Dialog */}
      {editingOrder && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setEditingOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    تعديل معلومات الطلب #{editingOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-slate-500">Edit customer info, address, bundle, and status</p>
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateOrder) {
                  onUpdateOrder(editingOrder);
                } else if (onUpdateOrderStatus) {
                  onUpdateOrderStatus(editingOrder.id, editingOrder.status);
                }
                setEditingOrder(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">اسم الزبون / Customer Name</label>
                <input
                  type="text"
                  required
                  value={editingOrder.customerName}
                  onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">رقم الهاتف / Phone</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.phone}
                    onChange={(e) => setEditingOrder({ ...editingOrder, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-bold text-slate-900 dir-ltr"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">المدينة / City</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.city}
                    onChange={(e) => setEditingOrder({ ...editingOrder, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">العنوان الكامل / Delivery Address</label>
                <textarea
                  rows={2}
                  required
                  value={editingOrder.address}
                  onChange={(e) => setEditingOrder({ ...editingOrder, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">العرض المحدد / Bundle</label>
                  <select
                    value={editingOrder.bundle.id}
                    onChange={(e) => {
                      const selectedB = bundles.find(b => b.id === e.target.value) || editingOrder.bundle;
                      setEditingOrder({
                        ...editingOrder,
                        bundle: selectedB,
                        totalMAD: selectedB.priceMAD
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-bold text-slate-900"
                  >
                    {bundles.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.priceMAD} MAD)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">الثمن الإجمالي / Total (MAD)</label>
                  <input
                    type="number"
                    required
                    value={editingOrder.totalMAD}
                    onChange={(e) => setEditingOrder({ ...editingOrder, totalMAD: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-extrabold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">حالة الطلب / Order Status</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as CODOrder['status'] })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-extrabold text-slate-900"
                  >
                    <option value="pending">Pending ⏳ (قيد الانتظار)</option>
                    <option value="confirmed">Confirmed ✅ (مؤكد)</option>
                    <option value="shipped">Shipped 🚚 (تم الشحن)</option>
                    <option value="cancelled">Cancelled ❌ (ملغى)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">ملاحظات / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Call before arrival"
                    value={editingOrder.notes || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات / Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                >
                  إلغاء / Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
