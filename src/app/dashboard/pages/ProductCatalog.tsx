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
  Filter,
  ArrowUpDown,
  Globe,
  Layers3,
  Info,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Store,
  ShoppingBag
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProductForm } from '@/components/form/product/ProductForm';
import { Product } from '@/types/product';
import { useCategories, useMedusaProducts, useSalesChannels } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPagination } from '@/store/slices/productsSlice';
import { formatCurrency } from '@/lib/utils';

interface Props {
  onRestockProduct?: (p: Product) => void;
  localProducts: Product[];
  setLocalProducts: (p: Product[]) => void;
  onGoToWholesale?: () => void;
}

export default function ProductCatalog({ onRestockProduct, localProducts, setLocalProducts, onGoToWholesale }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSalesChannel, setSelectedSalesChannel] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [sortConfig, setSortConfig] = useState<{ key: 'title' | 'stock', direction: 'asc' | 'desc' }>({ key: 'title', direction: 'asc' });

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPagination({ offset: 0 }));
  }, [searchTerm, selectedCategory, selectedSalesChannel, dispatch]);
  const { pagination, currencyCode } = useAppSelector(state => state.products);
  const { limit, offset } = pagination;

  const getVariantPrice = (variant: any) => {
    const priceObj = variant?.prices?.find((p: any) => p.currency_code === currencyCode);
    return priceObj ? priceObj.amount : (variant?.metadata?.price as number) || 0;
  };

  // hooks
  const { products: medusaProducts, count: medusaCount, loading: medusaLoading, error: medusaError } = useMedusaProducts({
    q: debouncedSearch,
    category_id: selectedCategory || undefined,
    sales_channel_id: selectedSalesChannel || undefined,
    limit: limit,
    offset: offset,
    autoFetch: true
  });
  const { salesChannels } = useSalesChannels();
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

  const renderContent = () => {
    if (isProductFormOpen) {
      return (
        <ProductForm
          onCancel={() => setIsProductFormOpen(false)}
          onSave={() => console.log("abc")}
          initialData={editingProduct as any}
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
              <Button
                className="h-14 rounded-2xl bg-amber-500 text-white"
                icon={<ShoppingCart size={20} />}
                onClick={onGoToWholesale}
              >
                NHẬP HÀNG SỈ
              </Button>
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
                <span className="text-[10px] font-black text-slate-400 uppercase px-3 hidden xl:block">KÊNH:</span>

                <button
                  onClick={() => setSelectedSalesChannel("")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all ${selectedSalesChannel === ""
                    ? 'bg-slate-200 dark:bg-slate-700 text-emerald-600 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  <Layers size={14} className={selectedSalesChannel === "" ? 'text-emerald-500' : 'text-slate-400'} />
                  <span>Tất cả kênh</span>
                </button>

                {salesChannels.map((sc) => {
                  let Icon = Globe;
                  if (sc.name.toLowerCase().includes('cửa hàng')) Icon = Store;
                  if (sc.name.toLowerCase().includes('tmđt') || sc.name.toLowerCase().includes('sàn')) Icon = ShoppingBag;

                  return (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedSalesChannel(sc.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all ${selectedSalesChannel === sc.id
                        ? 'bg-slate-200 dark:bg-slate-700 text-emerald-600 shadow-sm shadow-emerald-500/10'
                        : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                      <Icon size={14} className={selectedSalesChannel === sc.id ? 'text-emerald-500' : 'text-slate-400'} />
                      <span>{sc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {medusaError && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-6 rounded-3xl flex items-center gap-4 text-rose-600">
              <AlertCircle className="shrink-0" />
              <p className="text-sm font-bold">Lỗi kết nối Medusa: {medusaError}</p>
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
                  <th className="py-5 px-4 text-center">Kênh bán</th>
                  <th className="py-5 px-4 text-center">Phân loại</th>
                  <th className="py-5 px-4 text-center">Tồn kho</th>
                  <th className="py-5 px-4 text-right">Giá bán</th>
                  <th className="py-5 pr-8 text-right">Quản lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(medusaLoading && processedProducts.length === 0) && (
                  <tr>
                    <td colSpan={7} className="flex justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </td>
                  </tr>
                )}
                {processedProducts.length > 0 ? (
                  processedProducts.map((p) => {
                    const isExpanded = expandedProducts.includes(p.id);
                    const firstVariant = p.variants?.[0];
                    const stock = (firstVariant?.metadata?.stock as number) || 0;
                    const price = getVariantPrice(firstVariant);
                    const activeIngredient = (p as any).metadata?.active_ingredient || firstVariant?.metadata?.active_ingredient || "N/A";
                    const isLowStock = stock < 20;

                    return (
                      <Fragment key={p.id}>
                        <tr className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all cursor-pointer ${isExpanded ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`} onClick={() => toggleProductExpand(p.id)}>
                          <td className="px-6 py-5 text-center"><div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-primary text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}><ChevronDown size={18} /></div></td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <img src={p.thumbnail || "https://via.placeholder.com/150"} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm" alt={p.title} />
                              <div>
                                <p className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">{p.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{firstVariant?.barcode || activeIngredient}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                              {p.sales_channels?.map(sc => sc.name).join(', ') || 'Global'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">
                              {p.categories?.map(c => c.name).join(', ') || (p.type as any)?.value || "Khác"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center font-black"><span className={isLowStock ? 'text-rose-600' : ''}>{stock} g</span></td>
                          <td className="px-6 py-5 text-right font-black text-primary">{formatCurrency(price, currencyCode)}</td>
                          <td className="px-6 py-5 text-right pr-8">
                            <div className="flex justify-end gap-2">
                              <button onClick={(e) => { e.stopPropagation(); setEditingProduct(p); setIsProductFormOpen(true); }} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-500"><Edit3 size={16} /></button>
                              <button onClick={(e) => { e.stopPropagation(); if (confirm('Xóa sản phẩm này?')) setLocalProducts(localProducts.filter(item => item.id !== p.id)); }} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={7} className="px-10 py-10 bg-slate-50/40 dark:bg-slate-900/40 border-t border-b dark:border-slate-800">
                              <div className="animate-slide-up space-y-8">
                                <div className="flex flex-wrap gap-6 items-start">
                                  <Card className="p-5 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><Info size={20} /></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Giá vốn (Tham khảo)</p><p className="text-base font-black">{formatCurrency(Math.round(price * 0.7), currencyCode)}</p></div>
                                  </Card>
                                  <Card className="p-5 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center"><MapPin size={20} /></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Vị trí lưu kho</p><p className="text-base font-black">{(p as any).location || 'Chưa thiết lập'}</p></div>
                                  </Card>
                                  <Card className="p-5 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center"><Globe size={20} /></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Kênh phân phối</p><p className="text-base font-black">{p.sales_channels?.map(sc => sc.name).join(', ') || 'Global'}</p></div>
                                  </Card>
                                  <div className="ml-auto">
                                    <Button className="h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20" icon={<ShoppingCart size={20} />} onClick={(e) => { e.stopPropagation(); onRestockProduct?.(p); }}>NHẬP THÊM HÀNG SỈ</Button>
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
                                            <th className="px-6 py-4">Biến thể / Quy cách</th>
                                            <th className="px-6 py-4 text-center">Thuộc tính</th>
                                            <th className="px-6 py-4 text-center">Tồn kho lẻ</th>
                                            <th className="px-6 py-4 text-right pr-10">Đơn giá bán</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                          {p.variants.map(v => (
                                            <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                              <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{v.title}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{v.sku || v.id}</p>
                                              </td>
                                              <td className="px-6 py-4 text-center">
                                                {/* <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full w-fit mx-auto">
                                                  <Globe size={12} className="text-blue-500" /> {v.origin_country || 'N/A'}
                                                </div> */}
                                                <div className="flex flex-col">
                                                  {v.options.map((opt, index) => (
                                                    <span key={index} className="text-[10px] font-black text-slate-800 dark:text-slate-100">{opt.option.title}: {opt.value}</span>
                                                  ))}
                                                </div>
                                              </td>
                                              <td className="px-6 py-4 text-center">
                                                <span className={`text-sm font-black ${((v.metadata?.stock as number) || 0) < 10 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                                  {(v.metadata?.stock as number) || 0} g
                                                </span>
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
                    <td colSpan={7} className="py-32 text-center">
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
                )}
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
    </Fragment>
  );
}
