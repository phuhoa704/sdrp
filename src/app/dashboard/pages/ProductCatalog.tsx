'use client';

import { Fragment, useMemo, useState, useEffect } from 'react';
import {
  Package,
  Search,
  Plus,
  ShoppingCart,
  ChevronDown,
  Edit3,
  Trash2,
  AlertCircle,
  TrendingUp,
  Layers,
  Zap,
  Globe,
  Layers3,
  Info,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-react';
import { Breadcrumb, Card, Button, ConfirmModal, AlertModal } from '@/components';
import { ProductModal } from '@/components/product/ProductModal';
import { ProductForm } from '@/components/form/product/ProductForm';
import { ProductVariantsModal } from '@/components/product/ProductVariantsModal';
import { Product, ProductVariant } from '@/types/product';
import { productService } from '@/lib/api/medusa/productService';
import { uploadService } from '@/lib/api/medusa/uploadService';
import { useCategories, useMedusaProducts, useProductTags } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPagination } from '@/store/slices/productsSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { cn, formatCurrency } from '@/lib/utils';
import { selectSelectedSalesChannelId } from '@/store/selectors';
import { matchProductStatus, matchProductStatusColor } from '@/lib/helpers';

interface Props {
  onRestockProduct?: (p: Product) => void;
  onGoToWholesale?: () => void;
}

export default function ProductCatalog({ onRestockProduct, onGoToWholesale }: Props) {

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedModalProduct, setSelectedModalProduct] = useState<Product | null>(null);

  const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);
  const [variantsList, setVariantsList] = useState<ProductVariant[]>([]);
  const [selectedVariantProduct, setSelectedVariantProduct] = useState<Product | null>(null);

  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info'
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPagination({ offset: 0 }));
  }, [searchTerm, selectedCategory, selectedTag, dispatch]);
  const { pagination, currencyCode } = useAppSelector(state => state.products);
  const { limit, offset } = pagination;

  const getVariantPrice = (variant: any) => {
    const priceObj = variant?.prices?.find((p: any) => p.currency_code === currencyCode);
    return priceObj ? priceObj.amount : (variant?.metadata?.price as number) || 0;
  };

  const getAttributeColor = (index: number) => {
    const colors = [
      'text-blue-500 border-blue-500',
      'text-green-500 border-green-500',
      'text-yellow-500 border-yellow-500',
      'text-orange-500 border-orange-500',
      'text-red-500 border-red-500',
      'text-purple-500 border-purple-500',
      'text-pink-500 border-pink-500',
      'text-teal-500 border-teal-500',
      'text-indigo-500 border-indigo-500',
      'text-cyan-500 border-cyan-500',
    ];
    return colors[index % colors.length];
  }

  const getAttributeBgColor = (index: number) => {
    const colors = [
      'bg-blue-500/20',
      'bg-green-500/20',
      'bg-yellow-500/20',
      'bg-orange-500/20',
      'bg-red-500/20',
      'bg-purple-500/20',
      'bg-pink-500/20',
      'bg-teal-500/20',
      'bg-indigo-500/20',
      'bg-cyan-500/20',
    ];
    return colors[index % colors.length];
  }

  const handleEdit = async (p: Product) => {
    setIsFetchingDetail(true);
    try {
      const { product } = await productService.getProduct(p.id, {
        fields: "*categories,*sales_channels,*variants.prices"
      });
      setEditingProduct(product);
      setIsProductFormOpen(true);
    } catch (err) {
      console.error("Failed to fetch product detail:", err);
      // Fallback to list data if fetch fails
      setEditingProduct(p);
      setIsProductFormOpen(true);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleRestock = async (p: Product) => {
    setIsFetchingDetail(true);
    try {
      // Fetch variants for this product
      const response = await productService.getVariants(p.id, {
        order: 'variant_rank',
        limit: 10,
        fields: 'title,sku,thumbnail,*options,created_at,*inventory_items.inventory.location_levels,inventory_quantity,manage_inventory'
      });
      setVariantsList(response.variants || []);
      setSelectedVariantProduct(p);
      setIsVariantsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch product variants:", err);
      setAlertConfig({
        isOpen: true,
        title: 'Lỗi',
        message: 'Không thể tải danh sách biến thể',
        variant: 'danger'
      });
    } finally {
      setIsFetchingDetail(false);
    }
  };
  const handleUpdateVariants = async () => {
    if (!selectedVariantProduct) return;
    try {
      const { product } = await productService.getProduct(selectedVariantProduct.id, {
        fields: "*categories,*sales_channels,*variants.prices,*options"
      });
      setSelectedVariantProduct(product);

      const response = await productService.getVariants(product.id, {
        order: 'variant_rank',
        limit: 10,
        fields: 'title,sku,thumbnail,*options,created_at,*inventory_items.inventory.location_levels,inventory_quantity,manage_inventory'
      });
      setVariantsList(response.variants || []);
    } catch (err) {
      console.error("Failed to refresh variants:", err);
    }
  };

  const selectedSalesChannelId = useAppSelector(selectSelectedSalesChannelId);

  // hooks
  const {
    products: medusaProducts,
    count: medusaCount,
    loading: medusaLoading,
    error: medusaError,
    deleteProduct,
    refresh
  } = useMedusaProducts({
    q: debouncedSearch,
    category_id: selectedCategory || undefined,
    tags: selectedTag || undefined,
    sales_channel_id: selectedSalesChannelId || undefined,
    limit: limit,
    offset: offset,
    autoFetch: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const { tags } = useProductTags();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  const processedProducts = useMemo(() => {
    // We already filtered via API for medusaProducts
    // If there were localProducts, we'd handle them here too, but medusaProducts is the main focus
    return medusaProducts;
  }, [medusaProducts]);

  const totalPages = Math.ceil(medusaCount / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (newPage: number) => {
    dispatch(setPagination({ offset: (newPage - 1) * limit }));
  };

  const toggleProductExpand = (id: string) => {
    setExpandedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSaveProduct = async (data: any) => {
    setIsSaving(true);
    try {
      let currentThumbnail: string | undefined = undefined;

      if (data.imageFile) {
        const uploadResponse = await uploadService.upload(data.imageFile);
        if (uploadResponse.uploads && uploadResponse.uploads.length > 0) {
          currentThumbnail = uploadResponse.uploads[0].url;
        }
      } else if (data.thumbnail && !data.thumbnail.startsWith('data:')) {
        currentThumbnail = data.thumbnail;
      }

      const productOptions = data.has_variants
        ? data.options.map((o: any) => ({
          title: o.title,
          values: o.values
        }))
        : [{ title: 'Dung tích', values: ['Mặc định'] }];

      const payload: any = {
        title: data.title,
        subtitle: data.subtitle || data.title,
        description: data.description || "",
        status: "published",
        is_giftcard: false,
        discountable: true,
        images: currentThumbnail ? [{ url: currentThumbnail }] : [],
        thumbnail: currentThumbnail || undefined,
        handle: data.handle || undefined,
        mid_code: data.mid_code || undefined,
        hs_code: data.hs_code || undefined,
        origin_country: data.origin_country || undefined,
        material: data.material || undefined,
        metadata: data.metadata || {},
        categories: data.category_id ? [{ id: data.category_id }] : [],
        tags: data.tag_ids?.map((id: string) => ({ id })) || [],
        sales_channels: data.sales_channel_ids?.map((id: string) => ({ id })) || [],
        options: productOptions,
        variants: data.variants.map((v: any, index: number) => {
          const variantOptions: Record<string, string> = {};

          if (data.has_variants) {
            const values = v.title.split(' / ');
            data.options.forEach((opt: any, idx: number) => {
              variantOptions[opt.title] = values[idx] || '-';
            });
          } else {
            variantOptions["Dung tích"] = "Mặc định";
          }

          return {
            title: v.title === 'Default' ? 'Mặc định' : v.title,
            sku: v.sku || undefined,
            manage_inventory: true,
            allow_backorder: false,
            variant_rank: index,
            options: variantOptions,
            prices: [
              {
                currency_code: 'vnd',
                amount: v.price
              }
            ]
          };
        })
      };

      if (editingProduct?.id) {
        await productService.updateProduct(editingProduct.id, payload);
      } else {
        await productService.createProduct(payload);
      }

      setIsProductFormOpen(false);
      setEditingProduct(null);
      refresh();
    } catch (err: any) {
      console.error("Failed to save product:", err);
      setAlertConfig({
        isOpen: true,
        title: 'Lỗi hệ thống',
        message: err.message || "Không thể lưu sản phẩm. Vui lòng thử lại sau.",
        variant: 'danger'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (isProductFormOpen) {
      return (
        <ProductForm
          onCancel={() => setIsProductFormOpen(false)}
          onSave={handleSaveProduct}
          initialData={editingProduct as any}
          loading={isSaving}
        />
      )
    }
  }

  return (
    <Fragment>
      {!isProductFormOpen && (
        <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
          <Breadcrumb
            items={[
              { label: 'KHO HÀNG', href: '#' },
              { label: 'DANH MỤC HÀNG', href: '#' }
            ]}
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
            <div className="shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                  INVENTORY MANAGEMENT
                </span>
                <Zap size={12} className='text-amber-500 animate-pulse' />
              </div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
                Danh mục <span className="text-emerald-600 font-black">Hàng hóa</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Button className="h-14 rounded-2xl bg-white text-primary border-2 border-primary" icon={<Plus size={20} />} onClick={() => { setEditingProduct(null); setIsProductFormOpen(true); }}>THÊM MỚI</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Package size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng mã hàng</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{processedProducts.length}</p>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sắp hết hàng</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">
                  {processedProducts.filter(p => ((p.variants?.[0]?.metadata?.stock as number) || 0) < 20).length}
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Giá trị tồn kho</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">1.2 tỷ</p>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Layers size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng biến thể</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">
                  {processedProducts.reduce((acc, p) => acc + (p.variants?.length || 0), 0)}
                </p>
              </div>
            </Card>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Tìm sản phẩm, hoạt chất..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-sm dark:text-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full xl:w-auto">
              <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl items-center gap-1 shadow-inner">
                <span className="text-[10px] font-black text-slate-400 uppercase px-3 hidden xl:block">NHÃN:</span>

                <button
                  onClick={() => setSelectedTag("")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all ${selectedTag === ""
                    ? 'bg-slate-200 dark:bg-slate-700 text-emerald-600 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  <Layers size={14} className={selectedTag === "" ? 'text-emerald-500' : 'text-slate-400'} />
                  <span>Tất cả nhãn</span>
                </button>

                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all ${selectedTag === tag.id
                      ? 'bg-slate-200 dark:bg-slate-700 text-emerald-600 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    <Tag size={14} className={selectedTag === tag.id ? 'text-emerald-500' : 'text-slate-400'} />
                    <span>{tag.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {medusaError && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-6 rounded-3xl flex items-center gap-4 text-rose-600">
              <AlertCircle className="shrink-0" />
              <p className="text-sm font-bold">Lỗi kết nối: {medusaError}</p>
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
            <button onClick={() => setSelectedCategory("")} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === ""
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'
              }`}>
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === category.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800">
                  <th className="w-12 py-5 pl-8"></th>
                  <th className="py-5 px-4">Sản phẩm / Hoạt chất</th>
                  <th className="py-5 px-4 text-center">Phân loại</th>
                  <th className="py-5 px-4 text-right">Giá bán</th>
                  <th className="py-5 px-4 text-center">Trạng thái</th>
                  <th className="py-5 pr-8 text-right">Quản lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(medusaLoading && processedProducts.length === 0) ? (
                  <tr>
                    <td colSpan={8} className="py-20">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    </td>
                  </tr>
                ) : (processedProducts.length > 0 ? (
                  processedProducts.map((p) => {
                    const isExpanded = expandedProducts.includes(p.id);
                    const firstVariant = p.variants?.[0];
                    const price = getVariantPrice(firstVariant);
                    const activeIngredient = (p as any).metadata?.active_ingredient || firstVariant?.metadata?.active_ingredient || "N/A";

                    return (
                      <Fragment key={p.id}>
                        <tr className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all cursor-pointer ${isExpanded ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`} onClick={() => toggleProductExpand(p.id)}>
                          <td className="px-6 py-5 text-center"><div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-primary text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}><ChevronDown size={18} /></div></td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              {p.thumbnail ? (
                                <img src={p.thumbnail} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm" alt={p.title} />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                  <Zap size={20} className='text-white fill-white' />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">{p.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{firstVariant?.barcode || activeIngredient}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="text-[9px] xl:text-xs font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">
                              {p.categories?.map(c => c.name).join(', ') || "Khác"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right font-black text-primary">{formatCurrency(price, currencyCode)}</td>
                          <td className="px-6 py-5 text-center font-black">
                            <div className="flex justify-center items-center gap-2 text-xs xl:text-sm">
                              <div className={cn("w-2 h-2 rounded-full", matchProductStatusColor(p.status))}></div>
                              {matchProductStatus(p.status)}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right pr-8">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
                                disabled={isFetchingDetail}
                                className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-500 disabled:opacity-50"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setProductToDelete(p);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="px-10 py-10 bg-slate-50/40 dark:bg-slate-900/40 border-t border-b dark:border-slate-800">
                              <div className="animate-slide-up space-y-8">
                                <div className="flex flex-wrap gap-6 items-start">
                                  <Card className="p-5 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><Info size={20} /></div>
                                    <div>
                                      <p className="text-[10px] font-bold dark:text-slate-400 text-slate-800 uppercase mb-0.5">Giá vốn (Tham khảo)</p>
                                      <p className="text-base font-black dark:text-white text-slate-800">{formatCurrency(Math.round(price * 0.7), currencyCode)}</p>
                                    </div>
                                  </Card>
                                  <Card className="p-5 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center"><MapPin size={20} /></div>
                                    <div>
                                      <p className="text-[10px] font-bold dark:text-slate-400 text-slate-800 uppercase mb-0.5">Vị trí lưu kho</p>
                                      <p className="text-base font-black dark:text-white text-slate-800">{(p as any).location || 'Chưa thiết lập'}</p>
                                    </div>
                                  </Card>
                                  <Card className="p-5 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center"><Globe size={20} /></div>
                                    <div>
                                      <p className="text-[10px] font-bold dark:text-slate-400 text-slate-800 uppercase mb-0.5">Kênh phân phối</p>
                                      <p className="text-base font-black dark:text-white text-slate-800">{p.sales_channels?.map(sc => sc.name).join(', ') || 'Global'}</p>
                                    </div>
                                  </Card>
                                  <div className="ml-auto">
                                    <Button
                                      className="h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                                      icon={<ShoppingCart size={20} />}
                                      onClick={(e) => { e.stopPropagation(); handleRestock(p); }}
                                      disabled={isFetchingDetail}
                                    >
                                      {isFetchingDetail ? 'ĐANG TẢI...' : 'NHẬP THÊM HÀNG SỈ'}
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center gap-3">
                                    <Layers3 size={18} className="text-primary" />
                                    <h4 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Danh sách biến thể & Quy cách ({p.variants?.length || 0})</h4>
                                  </div>
                                  {p.variants && p.variants.length > 0 ? (
                                    <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-inner-glow">
                                      <table className="w-full text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-700">
                                          <tr>
                                            <th className="px-6 py-4">SKU</th>
                                            <th className="px-6 py-4">Biến thể / Quy cách</th>
                                            <th className="px-6 py-4">Thông tin chi tiết (Dynamic Specs)</th>
                                            <th className="px-6 py-4 text-right pr-10">Đơn giá bán</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                          {p.variants.map(v => (
                                            <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                              <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{v.sku || "--"}</p>
                                              </td>
                                              <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{v.title}</p>
                                              </td>
                                              <td className="px-6 py-4 text-center">
                                                <div className="flex gap-1.5 items-center">
                                                  {v.options.map((opt, index) => (
                                                    <span key={index} className={cn("text-[10px] font-black px-2 py-1 rounded-xl border", getAttributeBgColor(index), getAttributeColor(index))}>{opt.value}</span>
                                                  ))}
                                                </div>
                                              </td>
                                              <td className="px-6 py-4 text-right pr-10">
                                                <p className="text-sm font-black text-primary">{formatCurrency(getVariantPrice(v), currencyCode)}</p>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="p-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center opacity-40">
                                      <Layers size={48} className="mb-4" />
                                      <p className="text-sm font-bold italic">Sản phẩm này không có biến thể</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-40">
                        <div className="w-20 h-20 rounded-[32px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <Package size={40} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">
                            Kho hàng trống
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {medusaCount > limit && (
            <div className="flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 rounded-b-[32px]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Showing {offset + 1} - {Math.min(offset + limit, medusaCount)} of {medusaCount}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, i, arr) => (
                    <Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && <span className="text-slate-300">...</span>}
                      <button
                        onClick={() => handlePageChange(p)}
                        className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${p === currentPage
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                          : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        {p}
                      </button>
                    </Fragment>
                  ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {renderContent()}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={async () => {
          if (productToDelete) {
            await deleteProduct(productToDelete.id);
          }
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        isLoading={medusaLoading}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete?.title}"? Hành động này không thể hoàn tác.`}
        variant="danger"
        confirmText="Xóa sản phẩm"
        cancelText="Quay lại"
      />

      {isProductModalOpen && (
        <ProductModal
          product={selectedModalProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedModalProduct(null);
          }}
          mode="WHOLESALE"
          onAddToCart={(product, config) => {
            dispatch(addToCart({
              product,
              quantity: config.quantity,
              variant: config.variant,
              unit: config.unit,
              price: config.price,
              techSpecs: config.tech_specs
            }));
          }}
        />
      )}

      {isVariantsModalOpen && (
        <ProductVariantsModal
          isOpen={isVariantsModalOpen}
          onClose={() => {
            setIsVariantsModalOpen(false);
            setVariantsList([]);
            setSelectedVariantProduct(null);
          }}
          product={selectedVariantProduct}
          variants={variantsList}
          onUpdate={handleUpdateVariants}
        />
      )}

      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
      />
    </Fragment>
  );
}
