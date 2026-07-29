import React, { useState } from 'react';
import { 
  X, ShoppingBag, Image as ImageIcon, Tag, Palette, Check, Trash2, 
  Search, Filter, Plus, Phone, MapPin, DollarSign, Download, Sparkles, Eye, RefreshCw,
  Lock, User, KeyRound, LogOut, ShieldCheck, MessageSquare, Star, CheckCircle2, MessageSquarePlus, Edit3, Save
} from 'lucide-react';
import { BundleOffer, CODOrder, Currency, GalleryImage, Review, ThemeConfig, ThemePreset } from '../types';
import { formatPrice } from '../data/productData';

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
  const [activeTab, setActiveTab] = useState<'orders' | 'photos' | 'prices' | 'theme' | 'reviews'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<CODOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<CODOrder | null>(null);

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

  const handleUpdateBundleField = (index: number, field: keyof BundleOffer, value: any) => {
    const updated = [...bundles];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateBundles(updated);
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
            <span>1. Orders / الطلبات ({orders.length})</span>
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
            <span>2. Photos & Gallery / الصور</span>
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
            <span>3. Prices & Bundles / الأسعار</span>
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
            <span>4. Theme & Colors / الألوان</span>
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
            <span>5. Reviews / إدارة الآراء ({reviewsList.length})</span>
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

          {/* TAB 2: PHOTOS & GALLERY MANAGEMENT */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold">Instant Photo & Gallery Manager</h4>
                  <p className="mt-0.5 text-emerald-800">
                    Update the main product hero gallery photos live on the page! You can paste any image URL or select from our curated hair mousse library presets below.
                  </p>
                </div>
              </div>

              {/* Editable Hero Gallery Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {galleryImages.map((img, idx) => (
                  <div key={img.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        Gallery Image #{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {img.title}
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 space-y-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Image Title / Caption</label>
                          <input
                            type="text"
                            value={img.title}
                            onChange={(e) => handleUpdateImage(idx, 'title', e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={img.url}
                            onChange={(e) => handleUpdateImage(idx, 'url', e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preset Gallery Photos Picker */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span>Choose from Curated Preset Photos Library</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Click any preset image below to apply it to your main product image (Gallery #1):
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
          )}

          {/* TAB 3: PRICES & BUNDLES MANAGEMENT */}
          {activeTab === 'prices' && (
            <div className="space-y-6">
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
                <Tag className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold">Instant Product Price & Offer Manager</h4>
                  <p className="mt-0.5 text-amber-800">
                    Edit pricing for single bottles, duo pack, or buy 2 get 1 free bundle offers. Changes apply live across the whole landing page.
                  </p>
                </div>
              </div>

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
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Logo Customization
                  </span>
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
