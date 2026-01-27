
import React, { useState, useMemo } from 'react';
import {
  ChevronRight, Check, Minus, Plus, Trash2,
  CheckCircle2, ShoppingBag,
  MapPin, Phone, Truck, Store, Receipt,
  ShieldCheck, ArrowRight, Building2,
  Percent, UserCircle, Zap, Search
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Product } from '@/types/product';
import { UserRole } from '@/types/enum';

interface CartItem extends Product {
  cartKey: string;
  quantity: number;
  selectedVariant?: any;
  isWholesale?: boolean;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  taxCode?: string;
  note?: string;
}

interface CheckoutWizardProps {
  cart: CartItem[];
  onBack: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemove: (key: string) => void;
  onComplete: (customer: CustomerInfo, total: number) => void;
  userRole?: UserRole | null;
}

// Mock database for Seller to search retailers
const MOCK_RETAILERS = [
  { id: 'RT-001', name: 'Đại lý Anh Bửu', phone: '0912345678', address: 'Ấp 3, Mỹ An, Tháp Mười, Đồng Tháp', taxCode: '140028394' },
  { id: 'RT-002', name: 'Đại lý Năm Hữu', phone: '0988777666', address: 'Thạnh Hóa, Long An', taxCode: '150099823' },
  { id: 'RT-003', name: 'Nông nghiệp Tươi Sáng', phone: '0909123456', address: 'Châu Thành, Tiền Giang', taxCode: '160022334' },
  { id: 'RT-004', name: 'Vật tư Agri Kim', phone: '0944555222', address: 'Mỏ Cày Bắc, Bến Tre', taxCode: '170088112' }
];

export const CheckoutWizard: React.FC<CheckoutWizardProps> = ({ cart, onBack, onUpdateQty, onRemove, onComplete, userRole }) => {
  const isSeller = userRole === UserRole.SELLER;

  const [step, setStep] = useState(1);
  const [referralCode, setReferralCode] = useState(isSeller ? 'NGUYỄN VĂN A' : '');
  const [customer, setCustomer] = useState<CustomerInfo>(isSeller ? {
    name: '',
    phone: '',
    address: '',
    taxCode: '',
    note: ''
  } : {
    name: 'Đại lý Anh Bửu',
    phone: '0912345678',
    address: 'Ấp 3, Mỹ An, Tháp Mười, Đồng Tháp',
    taxCode: '140028394',
    note: ''
  });

  const [retailerSearch, setRetailerSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredRetailers = useMemo(() => {
    if (!retailerSearch.trim()) return [];
    return MOCK_RETAILERS.filter(r =>
      r.name.toLowerCase().includes(retailerSearch.toLowerCase()) ||
      r.phone.includes(retailerSearch) ||
      r.id.toLowerCase().includes(retailerSearch.toLowerCase())
    );
  }, [retailerSearch]);

  const handleSelectRetailer = (retailer: typeof MOCK_RETAILERS[0]) => {
    setCustomer({
      name: retailer.name,
      phone: retailer.phone,
      address: retailer.address,
      taxCode: retailer.taxCode,
      note: ''
    });
    setRetailerSearch('');
    setShowSearchResults(false);
  };

  const isWholesale = cart.some(i => i.isWholesale);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vat = subtotal * 0.08;
  const total = subtotal + vat;

  const steps = [
    { id: 1, label: 'Giỏ hàng', icon: <ShoppingBag size={18} /> },
    { id: 2, label: 'Giao nhận', icon: <MapPin size={18} /> },
    { id: 3, label: 'Hoàn tất', icon: <CheckCircle2 size={18} /> }
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-10 overflow-x-auto no-scrollbar py-2">
      {steps.map((s, idx) => (
        <React.Fragment key={s.id}>
          <div
            className={`flex items-center gap-3 transition-all duration-500 shrink-0 ${step >= s.id ? 'opacity-100' : 'opacity-40 grayscale'}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-lg transition-all ${step >= s.id ? 'bg-primary text-white scale-110 shadow-primary/20' : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
              {step > s.id ? <Check size={20} /> : s.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Bước 0{s.id}</span>
              <span className={`text-sm font-bold tracking-tight ${step >= s.id ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>{s.label}</span>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-8 md:w-16 h-0.5 rounded-full transition-colors duration-500 ${step > s.id ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const OrderSummary = () => (
    <Card className="sticky top-8 p-8 bg-white dark:bg-slate-900 border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[40px] space-y-6">
      <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
        <Receipt size={22} className="text-primary" /> Tóm tắt đơn sỉ
      </h3>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 font-medium">Tạm tính ({cart.length} mã hàng)</span>
          <span className="font-bold text-slate-800 dark:text-white">{subtotal.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 font-medium">Thuế VAT (8%)</span>
          <span className="font-bold text-slate-800 dark:text-white">{vat.toLocaleString()}đ</span>
        </div>
        {isWholesale && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white">
              <Percent size={14} />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase leading-none">Chiết khấu sỉ B2B</p>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Đã trừ trực tiếp vào giá sản phẩm</p>
            </div>
          </div>
        )}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng thanh toán</p>
            <p className="text-3xl font-black text-primary leading-none tracking-tighter">
              {total.toLocaleString()}
              <span className="text-sm ml-1 font-bold">đ</span>
            </p>
          </div>
        </div>
      </div>

      {/* REFERRAL CODE SECTION - UPDATED FOR SELLER AUTO-FILL */}
      {isWholesale && step === 2 && (
        <div className="pt-4 space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
            <UserCircle size={14} className="text-blue-500" /> Mã giới thiệu NPP/Seller
          </label>
          <div className="relative group">
            <input
              type="text"
              value={referralCode}
              readOnly={isSeller}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã nhân viên/NPP..."
              className={`w-full h-12 pl-4 pr-12 bg-slate-50 dark:bg-slate-800 border-2 rounded-xl outline-none transition-all font-black text-xs placeholder:text-slate-300 ${isSeller ? 'border-blue-500/50 cursor-default ring-4 ring-blue-500/5' : 'border-dashed border-slate-200 dark:border-slate-700 focus:border-blue-500'}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
              {referralCode ? <CheckCircle2 size={18} className="text-blue-500" /> : <Zap size={18} />}
            </div>
          </div>
          {isSeller ? (
            <p className="text-[9px] text-blue-500 font-bold px-1 flex items-center gap-1.5">
              <ShieldCheck size={10} /> Đã gán hoa hồng cho tài khoản của bạn.
            </p>
          ) : (
            <p className="text-[9px] text-slate-400 italic px-1 leading-relaxed">
              * Nhập mã để Seller nhận hoa hồng Affiliate theo chính sách chuỗi.
            </p>
          )}
        </div>
      )}

      <div className="pt-4 space-y-3">
        <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-none">Cam kết bảo mật dữ liệu</span>
        </div>
        <p className="text-[10px] text-slate-400 italic text-center leading-relaxed">Đơn hàng sẽ được gửi trực tiếp về hệ thống xử lý trung tâm của công ty.</p>
      </div>

      {step === 1 && (
        <Button fullWidth size="lg" className="h-16 rounded-[24px] text-base font-black shadow-2xl shadow-primary/20" icon={<ChevronRight size={20} />} onClick={() => setStep(2)}>
          TIẾP TỤC ĐẶT HÀNG
        </Button>
      )}
      {step === 2 && (
        <Button fullWidth size="lg" className="h-16 rounded-[24px] text-base font-black shadow-2xl shadow-primary/20" icon={<ChevronRight size={20} />} disabled={!customer.name || !customer.phone || !customer.address} onClick={() => setStep(3)}>
          XÁC NHẬN THÔNG TIN
        </Button>
      )}
    </Card>
  );

  const handleCheckoutComplete = () => {
    onComplete(customer, total);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={step === 1 ? onBack : () => setStep(step - 1)}
            className="p-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-slate-500"
          >
            <ChevronRight className="rotate-180" size={24} />
          </button>
          <div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none flex items-center gap-4">
              Thanh Toán
              <span className="text-primary uppercase text-sm tracking-[0.4em] font-black">{isWholesale ? 'Đơn hàng sỉ B2B' : 'Đơn hàng lẻ B2C'}</span>
            </h2>
          </div>
        </div>
      </div>

      {renderStepIndicator()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className={`${step === 3 ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-8`}>

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-3">
                  <ShoppingBag size={20} className="text-primary" /> Kiểm tra giỏ hàng ({cart.length})
                </h3>
              </div>

              <Card className="p-0 border-none shadow-xl bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden">
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {cart.map((item) => (
                    <div key={item.cartKey} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center group transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <div className="relative shrink-0">
                        <img src={item.image_style} className="h-24 w-24 rounded-3xl object-cover border-2 border-white dark:border-slate-700 shadow-xl group-hover:scale-105 transition-transform" alt={item.name} />
                        {item.isWholesale && (
                          <div className="absolute -top-3 -left-3 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-tighter border-2 border-white dark:border-slate-900">SỈ -15%</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <h4 className="font-black text-lg text-slate-800 dark:text-slate-100 leading-tight mb-1">{item.name}</h4>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                          <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase border border-primary/20">{item.selectedVariant?.unit || 'Thùng'}</span>
                          {item.selectedVariant?.tech_specs && (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase">{item.selectedVariant.tech_specs}</span>
                          )}
                        </div>
                        <p className="text-xl font-black text-primary">
                          {item.price.toLocaleString()}đ
                          <span className="text-xs text-slate-400 font-bold ml-1 uppercase">/ {item.selectedVariant?.unit || 'đv'}</span>
                        </p>
                      </div>

                      <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border-2 border-white dark:border-slate-700 shadow-sm">
                          <button
                            onClick={() => onUpdateQty(item.cartKey, -1)}
                            className="h-10 w-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm text-slate-400 hover:text-primary transition-all active:scale-90"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-lg font-black w-10 text-center dark:text-slate-200">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.cartKey, 1)}
                            className="h-10 w-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm text-slate-400 hover:text-primary transition-all active:scale-90"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemove(item.cartKey)}
                          className="flex items-center gap-2 text-[10px] font-black text-slate-300 hover:text-rose-500 uppercase tracking-widest transition-colors"
                        >
                          <Trash2 size={14} /> Xóa khỏi đơn
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              {/* SELLER EXCLUSIVE: RETAILER SEARCH BOX */}
              {isSeller && (
                <div className="relative group z-20">
                  <div className="flex items-center gap-4 mb-4 px-1">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-3">
                      <Search size={20} className="text-blue-500" /> Tìm đại lý đặt hàng
                    </h3>
                    <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Tính năng NPP</span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      value={retailerSearch}
                      onFocus={() => setShowSearchResults(true)}
                      onChange={(e) => setRetailerSearch(e.target.value)}
                      placeholder="Gõ tên, mã hoặc SĐT đại lý để tự động điền thông tin..."
                      className="w-full h-16 pl-14 pr-6 bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-blue-900/40 rounded-[28px] shadow-xl text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {showSearchResults && retailerSearch.length > 0 && (
                    <div className="absolute top-20 left-0 right-0 glass-panel rounded-[32px] shadow-2xl border border-blue-50 dark:border-blue-900/30 overflow-hidden animate-slide-up max-h-64 overflow-y-auto no-scrollbar">
                      {filteredRetailers.length > 0 ? (
                        <div className="p-3 space-y-1">
                          {filteredRetailers.map(r => (
                            <button
                              key={r.id}
                              onClick={() => handleSelectRetailer(r)}
                              className="w-full p-4 flex items-center gap-4 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all group/item"
                            >
                              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                                <Building2 size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-800 dark:text-white text-sm group-hover/item:text-blue-600 transition-colors">{r.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{r.id} • {r.phone}</p>
                              </div>
                              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-300 group-hover/item:text-blue-500 group-hover/item:bg-white transition-all">
                                <ChevronRight size={16} />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 text-center text-slate-400 font-medium italic">Không tìm thấy đại lý trong danh bạ NPP</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <Card className={`p-10 bg-white dark:bg-slate-900 border-none shadow-xl rounded-[40px] space-y-8 transition-all ${customer.name && isSeller ? 'ring-4 ring-emerald-500/10' : ''}`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black flex items-center gap-3 text-slate-800 dark:text-white">
                    <Building2 size={26} className="text-primary" /> {isSeller ? 'Thông tin đại lý thụ hưởng' : 'Thông tin đơn hàng sỉ'}
                  </h3>
                  <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                      {customer.name && isSeller ? 'Đã gán đại lý' : 'Đã liên kết đại lý'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Đại lý đặt hàng</label>
                    <div className="relative">
                      <input
                        value={customer.name}
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-black text-sm focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                      <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Số điện thoại liên lạc</label>
                    <div className="relative">
                      <input
                        value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-black text-sm focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Địa chỉ nhận hàng (Chi nhánh)</label>
                    <div className="relative">
                      <input
                        value={customer.address}
                        onChange={e => setCustomer({ ...customer, address: e.target.value })}
                        className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-black text-sm focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Mã số thuế (VAT Invoice)</label>
                    <div className="relative">
                      <input
                        value={customer.taxCode}
                        onChange={e => setCustomer({ ...customer, taxCode: e.target.value })}
                        placeholder="Nhập MST để xuất hóa đơn..."
                        className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-black text-sm focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                      <Receipt size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Lưu ý cho Kho vận</label>
                    <input
                      value={customer.note}
                      onChange={e => setCustomer({ ...customer, note: e.target.value })}
                      placeholder="VD: Giao giờ hành chính, gọi trước 30p..."
                      className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-black text-sm focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 border-2 border-primary bg-emerald-50/20 dark:bg-emerald-950/20 rounded-[32px] flex items-start gap-5 group cursor-pointer transition-all">
                  <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Truck size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-black text-slate-800 dark:text-white">Vận chuyển hệ thống</h4>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Đội xe chuyên dụng của NPP Hoàng Gia hỗ trợ giao tận nơi trong 24h-48h.</p>
                  </div>
                </Card>

                <Card className="p-8 border-2 border-transparent bg-white dark:bg-slate-900 shadow-sm rounded-[32px] flex items-start gap-5 group cursor-pointer hover:border-slate-200 transition-all opacity-60">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center transition-transform">
                    <Store size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-black text-slate-800 dark:text-white mb-1">Nhận tại Kho</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Đại lý chủ động đến lấy hàng tại trung tâm logistics vùng.</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in text-center py-10 max-w-2xl mx-auto w-full">
              <div className="relative inline-block mb-10">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <div className="relative w-32 h-32 bg-primary text-white rounded-[40px] flex items-center justify-center shadow-2xl animate-bounce mx-auto">
                  <CheckCircle2 size={64} strokeWidth={2.5} />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                  {isSeller ? 'Sẵn sàng gửi đơn hộ!' : 'Sẵn sàng gửi đơn!'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-xl mx-auto">
                  {isSeller ? `Vui lòng xác nhận để gửi yêu cầu đặt hàng sỉ cho đại lý ${customer.name}. Hệ thống sẽ thông báo ngay cho khách hàng.` : `Vui lòng xác nhận để gửi yêu cầu đặt hàng về cho công ty. Nhân viên điều phối sẽ liên hệ lại qua số điện thoại <strong>${customer.phone}</strong> trong tối đa 15 phút.`}
                </p>
              </div>

              <Card className="p-8 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[32px] text-left mt-10">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b dark:border-slate-700">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm">
                    <Building2 size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đại lý thụ hưởng</p>
                    <p className="text-base font-black text-slate-800 dark:text-white uppercase">{customer.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã số thuế</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{customer.taxCode}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phương thức</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Công nợ 30 ngày</p>
                  </div>
                </div>
                {referralCode && (
                  <div className="mt-6 pt-6 border-t dark:border-slate-700 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">
                      {isSeller ? <ShieldCheck size={18} /> : <UserCircle size={18} />}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">{isSeller ? 'Ghi nhận cho Seller' : 'Mã giới thiệu AFF'}</p>
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{referralCode}</p>
                    </div>
                  </div>
                )}
              </Card>

              <div className="pt-10 flex gap-4">
                <Button variant="secondary" fullWidth className="h-18 rounded-[28px] text-lg font-black" onClick={() => setStep(2)}>KIỂM TRA LẠI</Button>
                <Button fullWidth size="lg" className="h-18 rounded-[28px] text-lg font-black shadow-[0_20px_50px_rgba(16,185,129,0.3)] group" icon={<ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />} onClick={handleCheckoutComplete}>
                  {isSeller ? 'XÁC NHẬN GỬI ĐƠN HỘ' : 'GỬI ĐƠN ĐẶT HÀNG'}
                </Button>
              </div>
            </div>
          )}

        </div>

        {step < 3 && (
          <div className="lg:col-span-4 hidden lg:block">
            <OrderSummary />
          </div>
        )}
      </div>

      {step < 3 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t dark:border-slate-800 p-6 z-[80] animate-slide-up">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Tổng đơn sỉ</p>
              <p className="text-2xl font-black text-primary">{total.toLocaleString()}đ</p>
            </div>
            <Button size="lg" className="px-10 rounded-2xl font-black" onClick={() => setStep(step === 1 ? 2 : 3)}>
              {step === 1 ? 'TIẾP TỤC' : 'XÁC NHẬN'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
