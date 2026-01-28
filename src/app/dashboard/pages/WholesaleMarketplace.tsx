'use client';

import { Fragment, useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ShoppingCart, Filter, Zap, ChevronRight, X, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { UserRole } from '@/types/enum';
import { MarketplaceShop } from './marketplace/MarketplaceShop';
import { Product } from '@/types/product';
import { ProductModal } from '@/components/product/ProductModal';
import { RootState } from '@/store';
import { addToCart, updateQuantity, removeFromCart, clearCart } from '@/store/slices/cartSlice';
import { cn } from '@/lib/utils';
import { CheckoutWizard } from '../dashboards/Checkout';

interface Props {
  role: UserRole | null;
}

export default function WholesaleMarketplace({ role }: Props) {
  const dispatch = useDispatch();
  const { items: cart, total: cartTotal } = useSelector((state: RootState) => state.cart);

  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);

  const cartItemCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product: Product, config: any) => {
    // Dispatch to Redux store instead of local state
    dispatch(addToCart({
      product,
      quantity: config.quantity,
      variant: config.variant,
      unit: config.unit,
      price: config.price,
      techSpecs: config.tech_specs
    }));
  };

  const handleUpdateQty = (key: string, delta: number) => {
    const index = cart.findIndex(i => `${i.product.id}-${i.unit}` === key);
    if (index !== -1) {
      dispatch(updateQuantity({ index, quantity: cart[index].quantity + delta }));
    }
  };

  const handleRemove = (key: string) => {
    const index = cart.findIndex(i => `${i.product.id}-${i.unit}` === key);
    if (index !== -1) {
      dispatch(removeFromCart(index));
    }
  };

  const checkoutCartItems = useMemo(() => cart.map(item => ({
    ...item.product,
    cartKey: `${item.product.id}-${item.unit}`,
    quantity: item.quantity,
    selectedVariant: { unit: item.unit, tech_specs: item.techSpecs },
    isWholesale: true,
    price: item.price
  })), [cart]);

  if (isCheckout) {
    return (
      <CheckoutWizard
        cart={checkoutCartItems}
        onBack={() => setIsCheckout(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onComplete={() => {
          dispatch(clearCart());
          setIsCheckout(false);
          alert("Đơn hàng đã được gửi thành công!");
        }}
        userRole={role}
      />
    );
  }

  return (
    <div className="pb-32 animate-fade-in space-y-8 min-h-full relative font-sans">
      <Breadcrumb items={[{ label: 'MARKETPLACE', href: '/dashboard/marketplace' }, { label: 'GIAN HÀNG SỈ', href: '/dashboard/wholesale-marketplace' }]} />

      {/* Header Section */}
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-[60] py-4 -mx-4 px-4 border-b border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                B2B Marketplace
              </span>
              <Zap size={12} className="text-amber-500 animate-pulse" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Chợ Sỉ <span className="text-emerald-600 font-black">SDRP</span>
            </h2>
          </div>

          <div className="flex-1 max-w-2xl flex items-center gap-2 group">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã hàng sỉ, hoạt chất, thương hiệu hoặc NPP..."
                className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-950/50 dark:text-white rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all text-sm font-bold"
              />
            </div>
            <button className="h-14 w-14 bg-white dark:bg-slate-950/50 rounded-[20px] flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-sm">
              <Filter size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button
                onClick={() => setShowQuickView(!showQuickView)}
                className="h-14 px-6 bg-white dark:bg-slate-950/50 rounded-[20px] border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm hover:border-emerald-500/30 transition-all"
              >
                <div className="relative">
                  <ShoppingCart size={22} className="text-slate-600 dark:text-slate-400" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Giỏ sỉ</p>
                  <p className="text-sm font-black text-slate-800 dark:text-white leading-none">{cartTotal.toLocaleString()}đ</p>
                </div>
              </button>
            </div>
            <Button
              onClick={() => setIsCheckout(true)}
              className="h-14 rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-600/20 font-black text-xs px-8"
            >
              ĐẶT HÀNG
            </Button>
          </div>
        </div>
      </div>

      <MarketplaceShop onProductClick={(p) => setSelectedProduct(p)} searchQuery={searchQuery} />

      {cart.length > 0 && (
        <Fragment>
          {/* Quick View Mini Cart Popup */}
          <div
            className={`fixed transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-[100] pointer-events-none ${isScrolled
              ? 'bottom-8 right-8'
              : 'bottom-28 left-0 right-0 px-4 md:px-8 flex justify-center'
              }`}
          >
            <div className={`relative pointer-events-auto transition-all duration-500 ${isScrolled ? 'w-auto' : 'w-full max-w-4xl'}`}>
              {(showQuickView || isScrolled) && (
                <div className={cn(
                  "absolute bottom-full right-0 mb-6 w-80 bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-up origin-bottom-right transition-opacity",
                  showQuickView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                )}>
                  <div className="p-5 bg-emerald-600 text-white flex justify-between items-center px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                        <ShoppingCart size={16} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.15em]">Giỏ hàng sỉ B2B</span>
                    </div>
                    <button onClick={() => setShowQuickView(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"><X size={18} /></button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-4 no-scrollbar space-y-3 bg-slate-50/50 dark:bg-slate-950/20 px-6 py-6">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100/50 dark:border-slate-800/50 group">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border dark:border-slate-800 shrink-0">
                          <img src={item.product.thumbnail || ""} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black dark:text-white truncate group-hover:text-emerald-500 transition-colors uppercase tracking-tighter">{item.product.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">x{item.quantity} {item.unit}</p>
                        </div>
                        <p className="text-xs font-black text-emerald-600">{(item.price * item.quantity).toLocaleString()}đ</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 border-t dark:border-slate-800 bg-white dark:bg-slate-900">
                    <button
                      onClick={() => setIsCheckout(true)}
                      className="w-full bg-slate-900 dark:bg-emerald-600 dark:text-white py-4 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-900/10"
                    >
                      TIẾP TỤC ĐẶT HÀNG <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Action Button (FAB) or Detailed Bar */}
          {isScrolled ? (
            <button
              onClick={() => setShowQuickView(!showQuickView)}
              className="fixed bottom-8 right-8 z-[101] group w-18 h-18 bg-emerald-600 rounded-[28px] shadow-[0_20px_40px_rgba(16,185,129,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-slate-950"
              style={{ width: '72px', height: '72px' }}
            >
              <ShoppingCart size={28} />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black h-7 w-7 rounded-full flex items-center justify-center shadow-lg border-[3px] border-white dark:border-slate-950 animate-pulse">
                {cartItemCount}
              </span>
            </button>
          ) : (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] w-full max-w-4xl px-4 animate-slide-up">
              <button
                onClick={() => setIsCheckout(true)}
                className="group w-full bg-slate-950/90 dark:bg-slate-800/95 backdrop-blur-2xl text-white p-4 h-28 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] flex items-center gap-8 border border-white/10 transition-all hover:scale-[1.01] active:translate-y-1"
              >
                <div className="relative h-20 w-20 bg-emerald-600 rounded-[30px] flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0 overflow-hidden">
                  <ShoppingCart size={34} />
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] h-8 w-8 rounded-full flex items-center justify-center border-[3px] border-slate-900 font-black shadow-lg">
                    {cartItemCount}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.25em] mb-2 opacity-90">Giỏ hàng Marketplace (Sỉ)</p>
                  <div className="flex items-center gap-6">
                    <span className="text-3xl font-black text-white leading-none tracking-tight">{cartTotal.toLocaleString()}đ</span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{cart.length} mặt hàng đã chọn</span>
                  </div>
                </div>
                <div className="bg-white/10 group-hover:bg-emerald-600 p-5 rounded-[28px] transition-all group-hover:px-8 flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Xem giỏ</span>
                  <ChevronRight size={26} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          )}
        </Fragment>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          mode="WHOLESALE"
        />
      )}
    </div>
  );
}
