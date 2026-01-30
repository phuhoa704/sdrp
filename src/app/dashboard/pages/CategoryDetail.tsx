import React, { useState, useEffect } from 'react';
import { ProductCategory, Product } from '@/types/product';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { productService } from '@/lib/api/medusa/productService';
import { categoryService } from '@/lib/api/medusa/categoryService';
import {
  ArrowLeft,
  MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  Layers,
  Database,
  Code,
  Plus
} from 'lucide-react';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ProductSelectModal } from '@/components/modals/ProductSelectModal';
import { matchCategoryStatus, matchCategoryStatusColor, matchCategoryType, matchCategoryTypeColor, matchProductStatus, matchProductStatusColor } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface CategoryDetailProps {
  category: ProductCategory;
  onBack: () => void;
  onEdit: (category: ProductCategory) => void;
  refreshCategories: () => void;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({
  category: initialCategory,
  onBack,
  onEdit,
  refreshCategories
}) => {
  const [category, setCategory] = useState<ProductCategory>(initialCategory);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsCount, setProductsCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProductSelectModalOpen, setIsProductSelectModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchCategoryDetail();
    fetchProducts();
  }, [category.id, offset]);

  const fetchCategoryDetail = async () => {
    try {
      const data = await categoryService.getCategory(initialCategory.id, {
        include_descendants_tree: true
      });
      setCategory(data.product_category);
    } catch (error) {
      console.error('Failed to fetch category detail:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        category_id: initialCategory.id,
        limit,
        offset,
        fields: "id,title,handle,status,*collection,*sales_channels,variants.id,thumbnail,-type,-tags,-variants"
      });
      setProducts(data.products);
      setProductsCount(data.count);
    } catch (error) {
      console.error('Failed to fetch products for category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(products.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleRemoveProductsFromCategory = async () => {
    setIsDeleting(true);
    try {
      await categoryService.removeProductsFromCategory(initialCategory.id, selectedProductIds);
      setSelectedProductIds([]);
      setIsDeleteModalOpen(false);
      fetchProducts();
      refreshCategories();
    } catch (error) {
      console.error('Failed to remove products:', error);
      alert('Không thể gỡ sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddProductsToCategory = async (productIds: string[]) => {
    setIsAdding(true);
    try {
      await categoryService.addProductsToCategory(initialCategory.id, productIds);
      fetchProducts();
      refreshCategories();
    } catch (error) {
      console.error('Failed to add products:', error);
      alert('Không thể thêm sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsAdding(false);
    }
  };

  const labelClass = "text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block";
  const valueClass = "text-sm font-bold text-slate-300";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{category.name}</h1>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
              <div className={cn("w-2 h-2 rounded-full", matchCategoryStatusColor(category))}></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{matchCategoryStatus(category)}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
              <div className={cn("w-2 h-2 rounded-full", matchCategoryTypeColor(category))}></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{matchCategoryType(category)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onEdit(category)}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all shadow-sm active:scale-95"
          title="Chỉnh sửa danh mục"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800 p-8 space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div>
                <label className={labelClass}>Mô tả</label>
                <p className={cn(valueClass, !category.description && "text-slate-600 italic")}>
                  {category.description || '-'}
                </p>
              </div>
              <div>
                <label className={labelClass}>Handle</label>
                <p className="text-sm font-bold text-emerald-500 bg-emerald-500/5 px-3 py-1.5 rounded-lg inline-block">
                  /{category.handle}
                </p>
              </div>
            </div>
          </Card>

          {/* Products Section */}
          <Card className="bg-slate-900/50 border-slate-800 p-0 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-black text-white tracking-tight">Sản phẩm</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProductSelectModalOpen(true)}
                  className="p-2 text-slate-500 hover:text-white transition-all hover:bg-slate-800 rounded-xl"
                  title="Thêm sản phẩm vào danh mục"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/30 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                    <th className="w-12 py-4 pl-8">
                      <input
                        type="checkbox"
                        className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-emerald-500/20"
                        checked={products.length > 0 && selectedProductIds.length === products.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="py-4 px-4">Sản phẩm</th>
                    <th className="py-4 px-4 text-center">Bộ sưu tập</th>
                    <th className="py-4 px-4 text-center">Kênh bán hàng</th>
                    <th className="py-4 px-4 text-center">Biến thể</th>
                    <th className="py-4 pr-8 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </td>
                    </tr>
                  ) : products.length > 0 ? (
                    products.map((p) => (
                      <tr
                        key={p.id}
                        className={cn(
                          "group hover:bg-slate-800/30 transition-colors cursor-pointer",
                          selectedProductIds.includes(p.id) && "bg-emerald-500/5 hover:bg-emerald-500/10"
                        )}
                        onClick={() => handleSelectProduct(p.id)}
                      >
                        <td className="py-4 pl-8" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-emerald-500/20"
                            checked={selectedProductIds.includes(p.id)}
                            onChange={() => handleSelectProduct(p.id)}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.thumbnail || "https://via.placeholder.com/40"}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-800 shadow-sm"
                              alt={p.title}
                            />
                            <span className="text-xs font-bold text-slate-300 group-hover:text-primary transition-colors">{p.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-[10px] font-bold text-slate-500">{p.collection?.title}</td>
                        <td className="py-4 px-4 text-center text-[10px] font-bold text-slate-500">{p.sales_channels?.map((sc) => sc.name).join(", ")}</td>
                        <td className="py-4 px-4 text-center text-[10px] font-bold text-slate-300">
                          {p.variants?.length || 0} biến thể
                        </td>
                        <td className="py-4 pr-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className={cn("w-1.5 h-1.5 rounded-full", matchProductStatusColor(p.status))}></div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{matchProductStatus(p.status)}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <Package size={40} className="text-slate-500" />
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Không tìm thấy sản phẩm</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {productsCount > limit && (
              <div className="px-8 py-4 bg-slate-800/30 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {offset + 1} – {Math.min(offset + limit, productsCount)} của {productsCount} kết quả
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {Math.floor(offset / limit) + 1} của {Math.ceil(productsCount / limit)} trang
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={offset === 0}
                      onClick={() => setOffset(Math.max(0, offset - limit))}
                      className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      disabled={offset + limit >= productsCount}
                      onClick={() => setOffset(offset + limit)}
                      className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-black text-white uppercase tracking-[0.1em]">Thiết lập</h3>
              <button className="p-1 text-slate-600 hover:text-white transition-all">
                <MoreHorizontal size={14} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Đường dẫn</label>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-lg">{category.name}</p>
                </div>
              </div>
              <div>
                <label className={labelClass}>Danh mục con</label>
                {category.category_children && category.category_children.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {category.category_children.map(child => (
                      <span key={child.id} className="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md border border-slate-800">
                        {child.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-bold text-slate-600 italic">-</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-0 overflow-hidden cursor-pointer group hover:border-slate-700 transition-all">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-primary transition-colors">
                  <Database size={16} />
                </div>
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Metadata</span>
              </div>
              <span className="text-[10px] font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">0 keys</span>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 p-0 overflow-hidden cursor-pointer group hover:border-slate-700 transition-all">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-primary transition-colors">
                  <Code size={16} />
                </div>
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">JSON</span>
              </div>
              <span className="text-[10px] font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                {Object.keys(category).length} keys
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Action Bar */}
      {selectedProductIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex items-center overflow-hidden">
            <div className="px-6 py-4 border-r border-slate-800 bg-slate-900/50">
              <span className="text-xs font-bold text-slate-300">
                <span className="text-white font-black mr-2">{selectedProductIds.length}</span>
                selected
              </span>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-6 py-4 flex items-center gap-2 hover:bg-rose-500 group transition-all"
            >
              <span className="text-xs font-black text-slate-300 group-hover:text-white uppercase tracking-widest">Xóa</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleRemoveProductsFromCategory}
        isLoading={isDeleting}
        title="Xác nhận gỡ sản phẩm"
        message={`Bạn có chắc chắn muốn gỡ ${selectedProductIds.length} sản phẩm đã chọn khỏi danh mục này? Sản phẩm vẫn sẽ tồn tại trong hệ thống.`}
        variant="danger"
        confirmText="Gỡ sản phẩm"
      />

      {/* Product Selection Modal */}
      <ProductSelectModal
        isOpen={isProductSelectModalOpen}
        onClose={() => setIsProductSelectModalOpen(false)}
        onAdd={handleAddProductsToCategory}
        excludedProductIds={products.map(p => p.id)}
      />
    </div>
  );
};
