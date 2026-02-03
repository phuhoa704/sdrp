
import React, { useMemo, useState } from 'react';
import {
  ShoppingCart, Trash2, User, Store, Truck,
  Ticket, Percent, Minus, Plus, X,
  ChevronRight, Search,
  ChevronDown, Banknote, QrCode, CheckCircle2, Loader2,
  AlertCircle, CreditCard, Clock
} from 'lucide-react';
import { Button } from '@/components/Button';
import { createPortal } from 'react-dom';
import { usePromotions } from '@/hooks';
import { getPromotionUIData } from '@/lib/helpers';
import { TableLoading } from '@/components/TableLoading';
import { draftOrderService } from '@/lib/api/medusa/draftOrderService';

const CartItem = ({ item, onRemoveItem, onUpdateQty }: any) => {
  const [qty, setQty] = useState(item.quantity);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const deltaRef = React.useRef(0);

  React.useEffect(() => {
    if (deltaRef.current === 0) setQty(item.quantity);
  }, [item.quantity]);

  const handleUpdate = (delta: number) => {
    const newQty = Math.max(1, qty + delta);
    setQty(newQty);
    deltaRef.current += delta;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (deltaRef.current !== 0) {
        onUpdateQty(item.id, item.variant, item.tech_specs, deltaRef.current);
        deltaRef.current = 0;
      }
    }, 500);
  };

  return (
    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm group">
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img src={item.image} className="w-12 h-12 rounded-lg object-cover border dark:border-slate-700" alt={item.name} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h5 className="font-black text-xs text-slate-800 dark:text-slate-100 truncate leading-tight">{item.name}</h5>
            <button
              onClick={() => onRemoveItem(item.id, item.variant, item.tech_specs)}
              className="text-slate-300 hover:text-rose-500 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded uppercase">{item.variant}</span>
            {item.tech_specs && <span className="text-[8px] font-bold text-slate-400 bg-slate-50 px-1 py-0.5 rounded truncate max-w-[120px]">{item.tech_specs}</span>}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-lg p-0.5 border dark:border-slate-700">
              <button
                onClick={() => handleUpdate(-1)}
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-emerald-500"
              >
                <Minus size={12} />
              </button>
              <span className="text-[11px] font-black w-6 text-center dark:text-slate-200">{qty}</span>
              <button
                onClick={() => handleUpdate(1)}
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-emerald-500"
              >
                <Plus size={12} />
              </button>
            </div>
            <p className="text-sm font-black text-slate-900 dark:text-white">{(item.price * qty).toLocaleString()}đ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface POSCartProps {
  width: number;
  activeTab: any;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  isCreatingShipping: boolean;
  onUpdateQty: (id: string, variant: string, tech_specs: string | undefined, delta: number) => void;
  onRemoveItem: (id: string, variant: string, tech_specs: string | undefined) => void;
  onClearCart: () => void;
  onSetFulfillment: (f: 'pickup' | 'delivery') => void;
  onUpdateShippingFee: (fee: number) => void;
  onUpdateDiscount: (amount: number) => void;
  onOpenCustomerModal: () => void;
  onCheckout: () => void;
  onSetShippingPartner: (partner: string) => void;
  loadingTabId?: string | null;
  isSyncing?: boolean;
  debouncedConfirm: (activeTabId: string) => void;
}

export const POSCart: React.FC<POSCartProps> = ({
  width, activeTab, subtotal, totalAmount, isCreatingShipping,
  onUpdateQty, onRemoveItem, onSetFulfillment,
  onUpdateShippingFee, onUpdateDiscount, onOpenCustomerModal, onCheckout,
  loadingTabId, isSyncing = false, debouncedConfirm
}) => {
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount');
  const [discountValue, setDiscountValue] = useState(0);
  const [promoSearch, setPromoSearch] = useState("");
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);

  const [isPromoExpanded, setIsPromoExpanded] = useState(false);
  const [isManualDiscountExpanded, setIsManualDiscountExpanded] = useState(false);

  const [promotionLoading, setPromotionLoading] = useState<boolean>(false)

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrStatus, setQrStatus] = useState<'waiting' | 'received'>('waiting');
  const { promotions: apiPromotions, loading, error } = usePromotions({
    q: promoSearch || undefined
  });

  const filteredPromos = useMemo(() => {
    return apiPromotions.filter(p => p.status === "active");
  }, [apiPromotions]);

  const handleApplyPromo = async (promo: any) => {
    if (!activeTab?.id || !promo.code) return;

    try {
      setPromotionLoading(true)
      const res = await draftOrderService.addPromotionToDraftOrder(activeTab.id, promo.code);

      setSelectedPromoId(promo.id);
      setShowPromoModal(false);
      setIsPromoExpanded(false);
      onUpdateDiscount(res.draft_order_preview.discount_total);
    } catch (err) {
      console.error('Failed to apply promotion:', err);
    } finally {
      debouncedConfirm(activeTab.id);
      setPromotionLoading(false)
    }
  };

  const handleManualDiscountChange = (val: number) => {
    setDiscountValue(val);
    if (discountType === 'percent') {
      onUpdateDiscount(Math.round((subtotal * val) / 100));
    } else {
      onUpdateDiscount(val);
    }
  };

  const handleProcessCheckout = () => {
    if (paymentMethod === 'qr') {
      setShowQRModal(true);
      setQrStatus('waiting');
      setTimeout(() => {
        setQrStatus('received');
      }, 2000);
    } else {
      onCheckout();
    }
  };

  const confirmAndComplete = () => {
    setShowQRModal(false);
    onCheckout();
  };

  const renderPromoModal = () => {
    if (!showPromoModal) return null;
    const content = (
      <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 animate-fade-in">
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowPromoModal(false)} />
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up border dark:border-slate-800">
          <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-amber-500 text-white shrink-0">
            <div className="flex items-center gap-3">
              <Ticket size={24} />
              <h3 className="text-xl font-black uppercase tracking-tight">Kho Voucher Khuyến Mãi</h3>
            </div>
            <button onClick={() => setShowPromoModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={24} /></button>
          </div>
          <div className="p-6 space-y-4 shrink-0 bg-slate-50 dark:bg-slate-950/40">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={promoSearch}
                onChange={(e) => setPromoSearch(e.target.value)}
                placeholder="Tìm tên chương trình hoặc mã code..."
                className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-amber-500/20 dark:text-white text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar relative min-h-[300px]">
            {loading ? (
              <div className='flex justify-center items-center h-full'>
                <TableLoading />
              </div>
            ) : (
              <>
                {promotionLoading && (
                  <div className="absolute inset-0 z-50 bg-white/60 dark:bg-slate-900/60 flex flex-col items-center justify-center backdrop-blur-[2px] transition-all duration-300">
                    <Loader2 className="animate-spin text-amber-500 mb-2" size={40} />
                    <span className="text-sm font-bold text-amber-600 animate-pulse">Đang áp dụng...</span>
                  </div>
                )}
                {filteredPromos.map(promo => {
                  const ui = getPromotionUIData(promo);
                  const Icon = ui.icon;
                  const isSelected = promo.id === selectedPromoId;

                  return (
                    <div
                      key={promo.id}
                      onClick={() => !promotionLoading && handleApplyPromo(promo)}
                      className={`group relative flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all shadow-sm active:scale-[0.98]
                        ${isSelected
                          ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500'
                          : 'bg-white dark:bg-slate-900 border-transparent hover:border-amber-400'
                        }
                        ${promotionLoading ? 'opacity-50 grayscale cursor-not-allowed pointer-events-none' : ''}
                      `}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner-soft transition-colors 
                        ${isSelected ? 'bg-amber-500 text-white' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'}
                      `}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 px-4 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase transition-colors
                            ${isSelected ? 'bg-amber-500 text-white' : 'text-amber-600 bg-amber-50 dark:bg-amber-900/30'}
                          `}>
                            {promo.code}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 truncate">{ui.label}</h4>
                        <p className="text-[10px] text-slate-500 italic truncate">{ui.description}</p>
                      </div>
                      {isSelected && <CheckCircle2 size={18} className="text-amber-500" />}
                      {!isSelected && <ChevronRight size={18} className="text-slate-200 group-hover:text-amber-500" />}
                    </div>
                  )
                })}
              </>
            )}
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t dark:border-slate-800">
            <Button fullWidth onClick={() => setShowPromoModal(false)}>Đóng</Button>
          </div>
        </div>
      </div>
    );
    return createPortal(content, document.getElementById('modal-root')!);
  };

  const renderQRModal = () => {
    if (!showQRModal) return null;
    const content = (
      <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 animate-fade-in">
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => qrStatus === 'waiting' && setShowQRModal(false)} />
        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-8 flex flex-col items-center animate-slide-up border dark:border-slate-800">
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Thanh toán QR</h3>
            {qrStatus === 'waiting' && (
              <button onClick={() => setShowQRModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
            )}
          </div>

          <div className={`relative p-5 bg-white rounded-3xl border-4 transition-all duration-500 ${qrStatus === 'received' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-indigo-100 shadow-inner'} mb-6`}>
            <div className={`w-56 h-56 bg-slate-50 rounded-2xl flex items-center justify-center transition-all ${qrStatus === 'received' ? 'opacity-10 blur-sm' : ''}`}>
              <QrCode size={160} className="text-slate-800" strokeWidth={1} />
            </div>

            {qrStatus === 'waiting' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center gap-3 shadow-xl border border-indigo-50">
                  <Loader2 size={36} className="text-indigo-600 animate-spin" />
                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Đang quét mã...</span>
                </div>
              </div>
            )}

            {qrStatus === 'received' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <p className="text-xl font-black text-emerald-600 uppercase">ĐÃ NHẬN TIỀN</p>
              </div>
            )}
          </div>

          <div className="w-full space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-black text-slate-400 uppercase">Số tiền</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">{totalAmount.toLocaleString()}đ</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Nội dung</p>
              <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">SDRP {activeTab.id} {activeTab.customer?.phone || 'POS'}</p>
            </div>

            {qrStatus === 'received' ? (
              <Button fullWidth size="lg" className="bg-emerald-500 hover:bg-emerald-600 h-14 rounded-2xl font-black" onClick={confirmAndComplete}>XÁC NHẬN HOÀN TẤT</Button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 py-3 rounded-xl">
                <AlertCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-tight">Vui lòng chờ khách quét mã...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
    return createPortal(content, document.getElementById('modal-root')!);
  };

  const isPromoApplied = !!selectedPromoId;
  const isDiscountApplied = activeTab.discount > 0;

  return (
    <div
      className="bg-white dark:bg-slate-900 border-l dark:border-slate-800 flex flex-col shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] h-full"
      style={{ width: `${width}px` }}
    >
      <div className="shrink-0 p-4 pb-0 space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Giỏ hàng</span>
          </div>
          {isSyncing && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-full border border-emerald-100 dark:border-emerald-900/30 animate-pulse">
              <Loader2 size={10} className="animate-spin text-emerald-500" />
              <span className="text-[8px] font-black text-emerald-600 uppercase">Đang lưu...</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSetFulfillment('pickup')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl text-[10px] font-black transition-all border-2 ${activeTab.fulfillment === 'pickup' ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-600 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400'}`}
          >
            <Store size={20} /> TẠI QUẦY
          </button>
          <button
            onClick={() => onSetFulfillment('delivery')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl text-[10px] font-black transition-all border-2 ${activeTab.fulfillment === 'delivery' ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-600 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400'}`}
          >
            <Truck size={20} /> GIAO HÀNG
          </button>
        </div>

        <button
          onClick={onOpenCustomerModal}
          className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${activeTab.customer ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab.customer ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
              <User size={16} />
            </div>
            <div className="text-left">
              <p className={`text-[11px] font-black truncate max-w-[150px] ${activeTab.customer ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                {activeTab.customer ? activeTab.customer.name : 'GÁN KHÁCH HÀNG'}
              </p>
              {activeTab.customer && <p className="text-[9px] font-bold text-slate-400">{activeTab.customer.phone}</p>}
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-300" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {loadingTabId === activeTab.id ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 h-24" />
            ))}
          </div>
        ) : activeTab.items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-20">
            <ShoppingCart size={48} className="mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-center">Giỏ hàng trống<br />Vui lòng chọn sản phẩm</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeTab.items.map((item: any, idx: number) => (
              <CartItem
                key={`${item.id}-${item.variant}-${idx}`}
                item={item}
                onRemoveItem={onRemoveItem}
                onUpdateQty={onUpdateQty}
              />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 p-5 bg-[#0F172A] dark:bg-slate-950 border-t dark:border-slate-800 space-y-4 shadow-2xl">
        <div className="grid grid-cols-2 gap-2">
          <div className={`rounded-xl border transition-all overflow-hidden ${isPromoApplied ? 'bg-amber-50/10 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
            <button onClick={() => setIsPromoExpanded(!isPromoExpanded)} className="w-full px-3 h-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket size={14} className={isPromoApplied ? 'text-amber-500' : 'text-slate-500'} />
                <span className={`text-[10px] font-black uppercase tracking-tight ${isPromoApplied ? 'text-amber-500' : 'text-slate-500'}`}>Voucher</span>
              </div>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${isPromoExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isPromoExpanded && (
              <div className="px-3 pb-3 space-y-2 animate-fade-in">
                {isPromoApplied ? (
                  <div className="p-2 bg-slate-800 border border-amber-500/30 rounded-lg flex items-center justify-between">
                    <span className="text-[9px] font-black text-amber-500 uppercase">{apiPromotions.find(p => p.id === selectedPromoId)?.code}</span>
                    <button
                      onClick={async () => {
                        const promoCode = apiPromotions.find(p => p.id === selectedPromoId)?.code;
                        if (!activeTab?.id || !promoCode) return;

                        try {
                          setPromotionLoading(true)
                          await draftOrderService.removePromotionFromDraftOrder(activeTab.id, promoCode);
                          setSelectedPromoId(null);
                          onUpdateDiscount(0);
                        } catch (err) {
                          console.error('Failed to remove promotion:', err);
                        } finally {
                          debouncedConfirm(activeTab.id);
                          setPromotionLoading(false)
                        }
                      }}
                      className="text-rose-500"
                    >
                      {promotionLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowPromoModal(true)} className="w-full py-2 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase shadow-lg">CHỌN MÃ</button>
                )}
              </div>
            )}
          </div>

          <div className={`rounded-xl border transition-all overflow-hidden ${isDiscountApplied ? 'bg-emerald-50/10 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
            <button onClick={() => setIsManualDiscountExpanded(!isManualDiscountExpanded)} className="w-full px-3 h-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent size={14} className={isDiscountApplied ? 'text-emerald-500' : 'text-slate-500'} />
                <span className={`text-[10px] font-black uppercase tracking-tight ${isDiscountApplied ? 'text-emerald-500' : 'text-slate-500'}`}>Giảm trực tiếp</span>
              </div>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${isManualDiscountExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isManualDiscountExpanded && (
              <div className="px-3 pb-3 space-y-2 animate-fade-in">
                <div className="flex p-0.5 bg-slate-800 rounded-lg border border-slate-700">
                  <button onClick={() => setDiscountType('amount')} className={`flex-1 py-1 text-[9px] font-black rounded ${discountType === 'amount' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400'}`}>VNĐ</button>
                  <button onClick={() => setDiscountType('percent')} className={`flex-1 py-1 text-[9px] font-black rounded ${discountType === 'percent' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400'}`}>%</button>
                </div>
                <input
                  type="number"
                  value={discountValue || ''}
                  onChange={(e) => handleManualDiscountChange(parseInt(e.target.value) || 0)}
                  placeholder="Mức giảm..."
                  className="w-full h-8 px-3 bg-slate-800 border border-slate-700 text-white rounded-lg text-xs font-black outline-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-tighter ${paymentMethod === 'cash' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
          >
            <Banknote size={14} /> TIỀN MẶT
          </button>
          <button
            onClick={() => setPaymentMethod('qr')}
            className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-tighter ${paymentMethod === 'qr' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
          >
            <QrCode size={14} /> QR BANKING
          </button>
        </div>

        <div className="space-y-2">
          {activeTab.fulfillment === 'delivery' && (
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
              <span>Vận chuyển ({activeTab.shippingPartner || 'GHTK'})</span>
              <span className="text-blue-400">+{activeTab.shippingFee.toLocaleString()}đ</span>
            </div>
          )}
          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
            <span>Khuyến mãi / Giảm giá</span>
            <span className={activeTab.discount > 0 ? 'text-rose-400' : 'text-white'}>
              {activeTab.discount > 0 ? `-${activeTab.discount.toLocaleString()}đ` : '0đ'}
            </span>
          </div>
          <div className="flex justify-between items-end pt-2 border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">TỔNG THANH TOÁN</span>
              <span className="text-[8px] text-emerald-500 font-black uppercase italic">Đã gồm VAT 8%</span>
            </div>
            <span className="text-3xl font-black text-emerald-400 leading-none tracking-tighter">
              {totalAmount.toLocaleString()}
              <span className="text-sm ml-1 font-bold">đ</span>
            </span>
          </div>
        </div>

        <Button
          size="lg" fullWidth className={`rounded-xl h-14 font-black text-sm uppercase tracking-tight transition-all active:scale-[0.98] ${isCreatingShipping ? 'opacity-70' : ''} ${activeTab.fulfillment === 'delivery' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'}`}
          icon={isCreatingShipping ? <Clock size={20} className="animate-spin" /> : (paymentMethod === 'qr' ? <QrCode size={20} /> : <CreditCard size={20} />)}
          onClick={handleProcessCheckout}
          disabled={activeTab.items.length === 0 || isCreatingShipping || (activeTab.fulfillment === 'delivery' && !activeTab.shippingPartner)}
        >
          {isCreatingShipping ? 'Đang tạo đơn...' : (paymentMethod === 'qr' ? 'Thanh toán QR' : 'Xác nhận đơn')}
        </Button>
      </div>

      {renderPromoModal()}
      {renderQRModal()}
    </div>
  );
};
