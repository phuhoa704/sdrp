
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Search, CheckCircle2, Zap } from 'lucide-react';
import { TableView } from '@/components/TableView';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Product } from '@/types/product';
import { productService } from '@/lib/api/medusa/productService';
import { noImage } from '@/configs';
import { ProductType } from '@/types/product-type';
import { productTypeService } from '@/lib/api/medusa/productTypeService';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedSalesChannelId } from '@/store/selectors';

interface ProductTypeProps {
  onCancel?: () => void;
  onSave?: (data: any) => void;
  initialData?: ProductType | null;
}

export const ProductTypeForm: React.FC<ProductTypeProps> = ({ onCancel, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.value || '',
    description: ''
  });
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [initialProductIds, setInitialProductIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const selectedSalesChannelId = useAppSelector(selectSelectedSalesChannelId);

  useEffect(() => {
    if (initialData) {
      fetchProductTypeProducts(initialData.id);
      setFormData({
        name: initialData.value || '',
        description: ''
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
        sales_channel_id: selectedSalesChannelId,
        limit,
        offset,
        fields: "id,title,handle,status,*categories,*sales_channels,variants.id,thumbnail,-type,-tags,-variants"
      });
      setProducts(data.products);
      setProductsCount(data.count);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductTypeProducts = async (typeId: string) => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        type_id: [typeId],
        sales_channel_id: selectedSalesChannelId,
        fields: "id,title,handle,status,*categories,*sales_channels,variants.id,thumbnail,-type,-tags,-variants"
      });
      setSelectedProductIds(data.products.map((p: any) => p.id));
      setInitialProductIds(data.products.map((p: any) => p.id));
    } catch (error) {
      console.error('Failed to fetch products for type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let productTypeId: string;
      if (initialData) {
        await productTypeService.updateProductType(initialData.id, { value: formData.name });
        productTypeId = initialData.id;
      } else {
        const data = await productTypeService.createProductType({ value: formData.name });
        productTypeId = data.data.id;
      }

      const productsToUpdate = selectedProductIds.filter(id => !initialProductIds.includes(id));
      const productsToRemove = initialProductIds.filter(id => !selectedProductIds.includes(id));

      if (productsToUpdate.length > 0 && initialData) {
        await Promise.all(
          productsToUpdate.map(productId =>
            productService.updateProduct(productId, { type_id: initialData.id })
          )
        );
      }

      if (productsToRemove.length > 0) {
        await Promise.all(
          productsToRemove.map(productId =>
            productService.updateProduct(productId, { type_id: null })
          )
        );
      }

      onSave?.(formData);
    } catch (error) {
      console.error('Failed to update products:', error);
      alert('Không thể cập nhật sản phẩm. Vui lòng thử lại.');
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

  return (
    <div className="min-h-screen px-4 animate-fade-in relative z-50">
      <div className="sticky top-0 z-40 -mx-6 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-800">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Thiết lập Phân loại</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WORKSPACE / CAT-947</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant='secondary'
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
          <Button
            variant='primary'
            onClick={handleSubmit}
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
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-6 pl-3 border-l-4 border-[#00B074]">Cấu hình thông tin</p>

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

          <div className="bg-[#0f172a] rounded-[32px] p-8 shadow-xl text-white relative overflow-hidden group">
            <div className="flex items-center gap-1 mb-3">
              <Zap size={24} className='text-primary' />
              <p className="text-sm font-black uppercase tracking-widest">Thống kê nhóm</p>
            </div>

            <div className="space-y-2 relative z-10">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tổng sản phẩm đã chọn:</p>
                <p className="text-xl font-black text-[#00B074]">{selectedProductIds.length}</p>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Ngày khởi tạo:</p>
                <p className="text-xl font-bold">04/02/2026</p>
              </div>
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                * Việc chọn/bỏ chọn sản phẩm trong bảng bên cạnh sẽ có hiệu lực ngay sau khi bấm Lưu.
              </p>
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
            data={products}
            pagination={{
              currentPage,
              totalPages: Math.ceil(productsCount / limit),
              onPageChange: handlePageChange,
              totalItems: productsCount,
              itemsPerPage: limit
            }}
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
