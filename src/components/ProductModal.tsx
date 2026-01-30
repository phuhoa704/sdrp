
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Package, ShoppingCart, Plus, Minus, AlignLeft, Globe, Zap } from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';
import { Button } from './Button';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product, config: any) => void;
  mode?: 'RETAIL' | 'WHOLESALE';
  disableAddToCart?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product: initialProduct,
  onClose,
  onAddToCart,
  mode = 'RETAIL',
  disableAddToCart = false
}) => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedUnit, setSelectedUnit] = useState('Chai/Gói');

  useEffect(() => {
    setCurrentProduct(initialProduct);
    if (initialProduct) {
      setSelectedVariant(initialProduct.variants?.[0] || null);
      setSelectedUnit(mode === 'WHOLESALE' ? 'Thùng' : 'Chai/Gói');
      setQuantity(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [initialProduct, mode]);

  if (!currentProduct) return null;

  const isWholesale = mode === 'WHOLESALE';
  const basePrice = currentProduct.variants?.[0]?.prices?.[0]?.amount || 0;
  const currentPrice = selectedVariant
    ? (selectedVariant.prices.find(price => price.currency_code === 'vnd')?.amount || 0)
    : basePrice;
  console.log(basePrice, currentPrice, currentProduct);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(currentProduct, {
        unit: selectedUnit,
        quantity: quantity,
        variant: selectedVariant,
        tech_specs: selectedVariant ? `${selectedVariant.title} - ${selectedVariant.origin_country}` : '',
        price: currentPrice
      });
      onClose();
    }
  };

  const primaryColor = isWholesale ? '#2F80ED' : '#10B981';
  const softBg = isWholesale ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20';

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 lg:p-12 animate-fade-in pointer-events-auto">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[32px] md:rounded-[40px] shadow-2xl animate-slide-up flex flex-col max-h-[90vh] overflow-hidden border border-transparent dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-50 dark:border-slate-800 shrink-0 z-10">
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${softBg} hidden md:block text-[${primaryColor}] shadow-sm`}>
              <Package size={28} style={{ color: primaryColor }} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#1F2937] dark:text-slate-100 leading-tight">{currentProduct.title}</h2>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Hoạt chất: {"--"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl flex items-center justify-center transition-all text-slate-400"><X size={32} /></button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto no-scrollbar">
          {/* Left: Product Media & Description */}
          <div className="md:w-5/12 border-r border-gray-50 dark:border-slate-800 flex flex-col">
            <div className="relative h-64 md:h-80 shrink-0 p-6">
              <img src={currentProduct.thumbnail || ""} alt={currentProduct.title} className="w-full h-full rounded-3xl object-cover shadow-2xl border dark:border-slate-700" />
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest flex items-center gap-3">
                  <AlignLeft size={16} style={{ color: primaryColor }} /> Đặc tính kỹ thuật
                </h3>
                <p className="text-sm text-[#4B5563] dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800">
                  {currentProduct.description || `Sản phẩm bảo vệ thực vật công nghệ cao, nồng độ hoạt chất tối ưu giúp kiểm soát dịch hại triệt để.`}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Configuration */}
          <div className="md:w-7/12 p-6 md:p-8 space-y-8 bg-slate-50/30 dark:bg-slate-950/20">
            {/* Price Display */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[11px] md:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Đơn giá áp dụng</p>
                <p className="text-3xl md:text-5xl font-black mt-2" style={{ color: primaryColor }}>
                  {currentPrice.toLocaleString()}đ
                </p>
              </div>
            </div>

            {/* Variant Selector - Nồng độ & Công nghệ */}
            {currentProduct.variants && currentProduct.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Zap size={14} style={{ color: primaryColor }} /> Nồng độ / Công nghệ bào chế
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 text-left ${selectedVariant?.id === v.id
                        ? 'bg-white dark:bg-slate-800 shadow-lg'
                        : 'bg-white/50 dark:bg-slate-900/50 border-transparent text-slate-500'
                        }`}
                      style={selectedVariant?.id === v.id ? { borderColor: primaryColor } : {}}
                    >
                      <span className={`text-sm font-black ${selectedVariant?.id === v.id ? 'text-slate-800 dark:text-white' : ''}`}>
                        {v.title}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-bold opacity-70">
                        <Globe size={12} /> {v.origin_country}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Unit */}
            <div className="grid grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Đóng gói</label>
                <div className="flex gap-2">
                  {(isWholesale ? ['Thùng', 'Lốc'] : ['Chai/Gói', 'Lốc']).map(u => (
                    <button
                      key={u}
                      onClick={() => setSelectedUnit(u)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border-2 ${selectedUnit === u ? 'bg-white dark:bg-slate-700' : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-400'}`}
                      style={selectedUnit === u ? { borderColor: primaryColor, color: primaryColor } : {}}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Số lượng</label>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-all"><Minus size={18} /></button>
                  <span className="text-lg font-black dark:text-slate-200">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-all"><Plus size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 md:p-10 bg-white dark:bg-slate-900 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <div className="hidden md:block">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Thành tiền tạm tính</p>
            <p className="text-4xl font-black" style={{ color: primaryColor }}>
              {(currentPrice * quantity).toLocaleString()}đ
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="secondary" onClick={onClose} className="h-14 rounded-2xl px-8 hidden md:flex font-bold">Quay lại</Button>
            {!disableAddToCart && (
              <Button
                size="lg"
                onClick={handleAddToCart}
                className={`h-14 rounded-2xl flex-1 md:flex-none px-12 font-black text-base shadow-xl text-white`}
                style={{ backgroundColor: primaryColor }}
                icon={<ShoppingCart size={20} />}
              >
                {isWholesale ? 'NHẬP HÀNG SỈ' : 'THÊM VÀO ĐƠN'}
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
