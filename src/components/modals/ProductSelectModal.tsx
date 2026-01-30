import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/lib/api/medusa/productService';
import { Search, X, Check, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { matchProductStatus } from '@/lib/helpers';

interface ProductSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (productIds: string[]) => void;
  excludedProductIds?: string[];
}

export const ProductSelectModal: React.FC<ProductSelectModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  excludedProductIds = []
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 8;

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen, searchTerm, offset]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        q: searchTerm,
        limit,
        offset,
        fields: "id,title,thumbnail,status"
      });
      setProducts(data.products);
      setCount(data.count);
    } catch (error) {
      console.error('Failed to fetch products for selection:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (id: string) => {
    if (excludedProductIds.includes(id)) return;
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    onAdd(selectedIds);
    setSelectedIds([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Thêm sản phẩm</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Chọn sản phẩm để thêm vào danh mục</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-8 py-4 border-b border-slate-800 bg-slate-800/20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setOffset(0);
              }}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto min-h-[400px]">
          {loading ? (
            <div className="h-full flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 divide-y divide-slate-800">
              {products.map((p) => {
                const isExcluded = excludedProductIds.includes(p.id);
                const isSelected = selectedIds.includes(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={cn(
                      "px-8 py-4 flex items-center justify-between group transition-all cursor-pointer",
                      isExcluded ? "opacity-40 cursor-not-allowed bg-slate-800/10" : "hover:bg-slate-800/30",
                      isSelected && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={p.thumbnail || "https://via.placeholder.com/40"}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                          alt={p.title}
                        />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 animate-in zoom-in duration-200">
                            <Check size={12} className="text-white stroke-[3px]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{p.title}</h4>
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Trạng thái: {matchProductStatus(p.status)}</span>
                      </div>
                    </div>
                    {isExcluded && (
                      <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">Đã có</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 opacity-30 gap-4">
              <Package size={48} className="text-slate-500" />
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">Không tìm thấy sản phẩm</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all border border-slate-800 rounded-xl"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={offset + limit >= count}
              onClick={() => setOffset(offset + limit)}
              className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all border border-slate-800 rounded-xl"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Đã chọn <span className="text-white font-black">{selectedIds.length}</span> sản phẩm
            </span>
            <Button
              onClick={handleAdd}
              disabled={selectedIds.length === 0}
              className="px-8 h-12 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              Thêm sản phẩm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
