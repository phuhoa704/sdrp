import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '@/types/product';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';
import { ArrowLeft, CheckCircle2, Check, Search } from 'lucide-react';
import { categoryService } from '@/lib/api/medusa/categoryService';
import { noImage } from '@/configs';
import { TableView } from '@/components/TableView';
import { productService } from '@/lib/api/medusa/productService';

interface CategoryFormProps {
  initialData?: ProductCategory | null;
  onSave: () => void;
  onBack: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSave, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [initialProductIds, setInitialProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    is_internal: false,
  });

  useEffect(() => {
    if (initialData) {
      fetchCategoryProducts(initialData.id);
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        is_active: initialData.is_active || true,
        is_internal: initialData.is_internal || false,
      });
    }
  }, [initialData]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, limit]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * limit;
      const data = await productService.getProducts({
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

  const fetchCategoryProducts = async (id: string) => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        category_id: id,
        fields: "id,title,handle,status,*collection,*sales_channels,variants.id,thumbnail,-type,-tags,-variants"
      });
      setSelectedProductIds(data.products.map((p: any) => p.id));
      setInitialProductIds(data.products.map((p: any) => p.id));
    } catch (error) {
      console.error('Failed to fetch products for category:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let categoryId: string;

      if (initialData) {
        await categoryService.updateCategory(initialData.id, {
          ...formData
        });
        categoryId = initialData.id;
      } else {
        const result = await categoryService.createCategory({
          ...formData
        });
        categoryId = result.product_category.id;
      }

      const add = selectedProductIds.filter(id => !initialProductIds.includes(id));
      const remove = initialProductIds.filter(id => !selectedProductIds.includes(id));

      if (add.length > 0 || remove.length > 0) {
        await categoryService.updateProductsToCategory(categoryId, { add, remove });
      }

      onSave();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Không thể lưu danh mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === products.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map(p => p.id));
    }
  };

  const toggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(prev => prev.filter(pId => pId !== id));
    } else {
      setSelectedProductIds(prev => [...prev, id]);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSaveClick = () => {
    handleSubmit(new Event('submit') as any);
  };
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-20">
      <div className="-mx-6 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-800">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Thiết lập Loại hàng</h1>
            {initialData && (
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">{initialData.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant='secondary'
            onClick={onBack}
          >
            Hủy bỏ
          </Button>
          <Button
            variant='primary'
            onClick={handleSaveClick}
            loading={loading}
            disabled={loading}
          >
            <CheckCircle2 size={16} />
            Lưu thay đổi
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-6 pl-3 border-l-4 border-primary">Cấu hình thông tin</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Tên hiển thị</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#00B074]/50 outline-none transition-all font-bold text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Mô tả mục đích</label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#00B074]/50 outline-none transition-all font-medium text-slate-600 dark:text-slate-300 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card>
            <div className="relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Lọc nhanh danh sách sản phẩm..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-10 text-sm pl-14 pr-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-[#00B074]/20 outline-none shadow-sm transition-all font-bold text-slate-700 dark:text-slate-200"
              />
            </div>
          </Card>
          <TableView
            columns={[
              {
                title: (
                  <div className="flex items-center justify-center">
                    <div
                      onClick={handleSelectAll}
                      className={cn(
                        "w-5 h-5 rounded-md border-2 border-white/50 cursor-pointer flex items-center justify-center transition-all",
                        selectedProductIds.length === products.length && products.length > 0 ? "bg-white border-white" : ""
                      )}
                    >
                      {selectedProductIds.length === products.length && products.length > 0 && <Check size={14} className="text-[#00B074]" />}
                    </div>
                  </div>
                ),
                width: '60px',
                className: 'text-center'
              },
              { title: 'PRODUCT' },
              { title: 'PHÂN LOẠI' },
              { title: 'SALES CHANNELS', className: 'text-center' },
              { title: 'VARIANTS' },
              { title: 'STATUS', className: 'text-right' },
            ]}
            pagination={{
              currentPage,
              totalPages: Math.ceil(productsCount / limit),
              onPageChange: handlePageChange,
              totalItems: productsCount,
              itemsPerPage: limit
            }}
            data={products}
            renderRow={(product, index) => {
              const isSelected = selectedProductIds.includes(product.id);
              return (
                <tr
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={cn(
                    "group transition-all cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-none",
                    isSelected ? "bg-emerald-50/30 dark:bg-emerald-900/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <td className="py-5 px-4 text-center">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border-2 cursor-pointer flex items-center justify-center transition-all mx-auto",
                        isSelected ? "bg-[#00B074] border-[#00B074]" : "border-slate-300 dark:border-slate-600 group-hover:border-[#00B074]"
                      )}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <img src={product.thumbnail || noImage} className="w-12 h-12 rounded-xl shadow-sm object-cover" alt={product.title} />
                      <div>
                        <p className={cn("text-sm font-black transition-colors", isSelected ? "text-[#00B074]" : "text-slate-800 dark:text-white")}>{product.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{product.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide">{product?.categories?.map(category => category.name).join(', ') || "Global"}</p>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <div className="flex justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                      {product?.sales_channels?.map(channel => channel.name).join(', ') || "Global"}
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {product.variants.length} variants
                    </span>
                  </td>
                  <td className="py-5 px-4 text-right pr-8">
                    <div className="flex justify-end items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00B074] animate-pulse"></div>
                      <span className="text-[10px] font-black text-[#00B074] uppercase tracking-widest">{product.status}</span>
                    </div>
                  </td>
                </tr>
              )
            }}
          />
        </div>
      </div>
    </div>
  );
};
