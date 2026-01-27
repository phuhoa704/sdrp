'use client';

import { Fragment, useMemo, useState } from 'react';
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
  MapPin
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProductForm } from '@/components/form/product/ProductForm';
import { Product } from '@/types/product';
import { useProducts } from '@/hooks';

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

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'stock', direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

  //hooks
  const { products, loading, error } = useProducts();
  console.log("products", products)

  const processedProducts = useMemo(() => {
    let result = localProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.active_ingredient.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = categoryFilter === "Tất cả" || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
    result.sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        const stockA = a.current_stock || a.stockLevel || 0;
        const stockB = b.current_stock || b.stockLevel || 0;
        return sortConfig.direction === 'asc' ? stockA - stockB : stockB - stockA;
      }
    });
    return result;
  }, [searchTerm, categoryFilter, sortConfig, localProducts]);

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
          initialData={editingProduct as Product | null}
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
                <p className="text-2xl font-black text-slate-800 dark:text-white">5</p>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sắp hết hàng</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">1</p>
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
                <p className="text-2xl font-black text-slate-800 dark:text-white">16</p>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
              <Filter size={16} className="text-emerald-500" />
              Bộ lọc
            </button>
            <button className="flex items-center gap-2 px-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
              <ArrowUpDown size={16} className="text-emerald-500" />
              Sắp xếp
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800">
                  <th className="w-12 py-5 pl-8"></th>
                  <th className="py-5 px-4">Sản phẩm / Hoạt chất</th>
                  <th className="py-5 px-4 text-center">Phân loại</th>
                  <th className="py-5 px-4 text-center">Tồn kho</th>
                  <th className="py-5 px-4 text-right">Giá bán</th>
                  <th className="py-5 pr-8 text-right">Quản lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {processedProducts.map((p) => {
                  const isExpanded = expandedProducts.includes(p.id);
                  const stock = p.current_stock || p.stockLevel || 0;
                  const isLowStock = stock < (p.min_stock || 20);
                  return (
                    <Fragment key={p.id}>
                      <tr className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all cursor-pointer ${isExpanded ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`} onClick={() => toggleProductExpand(p.id)}>
                        <td className="px-6 py-5 text-center"><div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-primary text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}><ChevronDown size={18} /></div></td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <img src={p.image_style} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm" alt={p.name} />
                            <div><p className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">{p.name}</p><p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{p.barcode || p.active_ingredient}</p></div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center"><span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">{p.category}</span></td>
                        <td className="px-6 py-5 text-center font-black"><span className={isLowStock ? 'text-rose-600' : ''}>{stock} {p.weight_unit || 'đv'}</span></td>
                        <td className="px-6 py-5 text-right font-black text-primary">{p.price.toLocaleString()}đ</td>
                        <td className="px-6 py-5 text-right pr-8">
                          <div className="flex justify-end gap-2">
                            <button onClick={(e) => { e.stopPropagation(); setEditingProduct(p); setIsProductFormOpen(true); }} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-500"><Edit3 size={16} /></button>
                            <button onClick={(e) => { e.stopPropagation(); if (confirm('Xóa sản phẩm này?')) setLocalProducts(localProducts.filter(item => item.id !== p.id)); }} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-10 py-10 bg-slate-50/40 dark:bg-slate-900/40 border-t border-b dark:border-slate-800">
                            <div className="animate-slide-up space-y-8">
                              <div className="flex flex-wrap gap-6 items-start">
                                <Card className="p-5 bg-white dark:bg-slate-800 border-none shadow-sm flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><Info size={20} /></div>
                                  <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Giá vốn (Tham khảo)</p><p className="text-base font-black">{(p.cost_price || Math.round(p.price * 0.7)).toLocaleString()}đ</p></div>
                                </Card>
                                <Card className="p-5 bg-white dark:bg-slate-800 border-none shadow-sm flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center"><MapPin size={20} /></div>
                                  <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Vị trí lưu kho</p><p className="text-base font-black">{p.location || 'Chưa thiết lập'}</p></div>
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
                                          <th className="px-6 py-4 text-center">Xuất xứ</th>
                                          <th className="px-6 py-4 text-center">Tồn kho lẻ</th>
                                          <th className="px-6 py-4 text-right pr-10">Đơn giá bán</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {p.variants.map(v => (
                                          <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{v.label}</p>
                                              <p className="text-[10px] text-slate-400 font-medium">{v.id}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full w-fit mx-auto">
                                                <Globe size={12} className="text-blue-500" /> {v.origin}
                                              </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                              <span className={`text-sm font-black ${v.stock < 10 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {v.stock} {p.weight_unit || 'đv'}
                                              </span>
                                            </td>
                                            <td className="px-6 py-4 text-right pr-10">
                                              <p className="text-sm font-black text-primary">{(p.price * v.price_modifier).toLocaleString()}đ</p>
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {renderContent()}
    </Fragment>
  );
}
