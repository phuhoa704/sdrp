
import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Package, ShoppingCart, Plus, Minus, AlignLeft, Zap } from 'lucide-react';
import { Product, ProductOption, ProductVariant } from '@/types/product';
import { Button } from './Button';
import { productService } from '@/lib/api/medusa/productService';
import { TableLoading } from './TableLoading';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedSalesChannelId } from '@/store/selectors';
import { draftOrderService } from '@/lib/api/medusa/draftOrderService';
import { cn } from '@/lib/utils';
import { noImage } from '@/configs';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product, config: any) => void;
  disableAddToCart?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product: initialProduct,
  onClose,
  onAddToCart,
  disableAddToCart = false
}) => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [customProduct, setCustomProduct] = useState<Product | null>(null);
  const selectedSalesChannelId = useAppSelector(selectSelectedSalesChannelId);

  const availability = useMemo(() => {
    if (!selectedVariant) return null;
    if (!selectedVariant.inventory_items || selectedVariant.inventory_items.length === 0) return 0;

    return selectedVariant.inventory_items.reduce((total, item) => {
      const levelSum = item.inventory?.location_levels?.reduce(
        (sum, level) => sum + (level.available_quantity || 0),
        0
      ) || 0;
      return total + levelSum;
    }, 0);
  }, [selectedVariant]);

  useEffect(() => {
    setCurrentProduct(initialProduct);
    if (initialProduct) {
      setQuantity(1);
      fetchVariants(initialProduct.id)
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [initialProduct]);

  // Handle option selection
  const handleOptionChange = (optionId: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionId]: value };
    setSelectedOptions(newOptions);
  };

  // Find variant matching selected options
  useEffect(() => {
    if (variants.length > 0 && Object.keys(selectedOptions).length > 0) {
      const match = variants.find(variant => {
        return variant.options.every(opt => {
          return selectedOptions[opt.option_id] === opt.value;
        });
      });
      setSelectedVariant(match || null);
    } else if (variants.length > 0 && productOptions.length === 0) {
      // No options product, just use the first variant
      setSelectedVariant(variants[0]);
    }
  }, [selectedOptions, variants, productOptions.length]);

  if (!currentProduct) return null;

  const basePrice = currentProduct.variants?.[0]?.prices?.[0]?.amount || 0;
  const currentPrice = selectedVariant
    ? (selectedVariant.prices.find(price => price.currency_code === 'vnd')?.amount || 0)
    : basePrice;

  const [isLoading, setIsLoading] = useState(false);

  const fetchVariants = async (id: string) => {
    setVariantsLoading(true);
    try {
      const [oRes, cRes] = await Promise.all([
        productService.getListOptions(id),
        productService.getCustomProductDetail(id)
      ]);

      const productData = cRes.data;
      const variantsData = productData.variants || [];

      setCustomProduct(productData);
      setVariants(variantsData);
      setProductOptions(oRes.product_options);

      if (variantsData.length > 0) {
        // Find if we can auto-select the first complete variant
        const firstVariant = variantsData[0];
        setSelectedVariant(firstVariant);

        const initialOpts: Record<string, string> = {};
        firstVariant.options.forEach(opt => {
          initialOpts[opt.option_id] = opt.value;
        });
        setSelectedOptions(initialOpts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setVariantsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (onAddToCart) {
      setIsLoading(true);
      try {
        await onAddToCart(currentProduct, {
          quantity: quantity,
          variant: selectedVariant,
          tech_specs: selectedVariant ? `${selectedVariant.title} - ${selectedVariant.sku}` : '',
          price: currentPrice
        });
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 lg:p-12 animate-fade-in pointer-events-auto">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[32px] md:rounded-[40px] shadow-2xl animate-slide-up flex flex-col max-h-[90vh] overflow-hidden border border-transparent dark:border-slate-800">
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-50 dark:border-slate-800 shrink-0 z-10">
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 hidden md:block text-primary shadow-sm`}>
              <Package size={28} className='text-primary' />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#1F2937] dark:text-slate-100 leading-tight">{currentProduct.title}</h2>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                {currentProduct.tags?.map((t) => t.value).join(', ')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl flex items-center justify-center transition-all text-slate-400"><X size={32} /></button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto no-scrollbar">
          <div className="md:w-5/12 border-r border-gray-50 dark:border-slate-800 flex flex-col">
            <div className="relative h-64 md:h-80 shrink-0 p-6">
              <img src={currentProduct.thumbnail || noImage} alt={currentProduct.title} className="w-full h-full rounded-3xl object-cover shadow-2xl border dark:border-slate-700" />
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest flex items-center gap-3">
                  <AlignLeft size={16} className='text-primary' /> Đặc tính kỹ thuật
                </h3>
                <div className="p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-[#4B5563] dark:text-slate-300 leading-relaxed font-medium line-clamp-5">
                    {currentProduct.description || `Sản phẩm bảo vệ thực vật công nghệ cao, nồng độ hoạt chất tối ưu giúp kiểm soát dịch hại triệt để.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-7/12 p-6 md:p-8 space-y-8 bg-slate-50/30 dark:bg-slate-950/20">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[11px] md:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Đơn giá áp dụng</p>
                <p className="text-3xl md:text-5xl font-black mt-2 text-primary">
                  {currentPrice.toLocaleString()}đ
                </p>
              </div>
            </div>

            {variantsLoading ? (
              <TableLoading />
            ) : (
              <div className="space-y-6">
                {productOptions.map((option) => (
                  <div key={option.id} className="space-y-3">
                    <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Zap size={14} className='text-primary' /> {option.title}
                      </span>
                      {selectedOptions[option.id] && (
                        <span className="text-primary font-black uppercase text-[10px]">
                          {selectedOptions[option.id]}
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((v) => {
                        const isSelected = selectedOptions[option.id] === v.value;

                        return (
                          <button
                            key={v.id}
                            onClick={() => handleOptionChange(option.id, v.value)}
                            className={cn(
                              "px-4 py-2.5 rounded-2xl border-2 transition-all flex items-center gap-3",
                              isSelected
                                ? 'bg-white dark:bg-slate-800 shadow-md border-primary'
                                : 'bg-white/50 dark:bg-slate-900/50 border-transparent text-slate-500 hover:border-slate-200 dark:hover:border-slate-800 shadow-sm'
                            )}
                          >
                            <span className={cn(
                              "text-sm font-black transition-colors",
                              isSelected ? 'text-slate-800 dark:text-white' : ''
                            )}>
                              {v.value}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {selectedVariant && (
                  <div className="p-5 rounded-[24px] bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">SKU: {selectedVariant.sku}</p>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100">{selectedVariant.title}</p>
                    </div>
                    {availability !== null && (
                      <div className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                        availability > 0 ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      )}>
                        {availability > 0 ? `Còn hàng (${availability})` : 'Hết hàng'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Số lượng</label>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-all"><Minus size={18} /></button>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-200">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-all"><Plus size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 bg-white dark:bg-slate-900 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <div className="hidden md:block">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Thành tiền tạm tính</p>
            <p className="text-4xl font-black text-primary">
              {(currentPrice * quantity).toLocaleString()}đ
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="secondary" onClick={onClose} className="h-14 rounded-2xl px-8 hidden md:flex font-bold">Quay lại</Button>
            {!disableAddToCart && (
              <Button
                size="lg"
                loading={isLoading}
                onClick={handleAddToCart}
                disabled={!selectedVariant || availability === null || availability <= 0 || isLoading}
                className={cn(
                  "h-14 rounded-2xl flex-1 md:flex-none px-12 font-black text-base shadow-xl text-white transition-all",
                  (!selectedVariant || availability === null || availability <= 0 || isLoading) ? 'opacity-50 grayscale cursor-not-allowed bg-[#94a3b8]' : 'bg-primary'
                )}
                icon={<ShoppingCart size={20} />}
              >
                {!selectedVariant ? 'CHƯA CHỌN BIẾN THỂ' : (availability === null || availability <= 0) ? 'HẾT HÀNG' : 'THÊM VÀO ĐƠN'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const modalRoot = document.getElementById('modal-root');
  return modalRoot ? createPortal(modalContent, modalRoot) : null;
};
