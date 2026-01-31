
import React, { useState } from 'react';
import {
  X, Check, ChevronRight, Gift, Percent, Truck,
  Tag, Zap, Calendar, Database, DollarSign,
  ChevronDown, Settings, Plus, Trash2
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PromotionType } from '@/types/promotion';

interface PromotionWizardProps {
  onCancel: () => void;
  onSave: (promotion: any) => void;
}

export const PromotionWizard: React.FC<PromotionWizardProps> = ({ onCancel, onSave }) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<PromotionType | null>(null);

  const [method, setMethod] = useState<'code' | 'automatic'>('code');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [isTaxIncluded, setIsTaxIncluded] = useState(false);
  const [allocation, setAllocation] = useState<'each' | 'once'>('each');

  const [campaignLink, setCampaignLink] = useState<'none' | 'existing' | 'new'>('none');

  const steps = [
    { id: 1, label: 'Loại KM', icon: <Tag size={18} /> },
    { id: 2, label: 'Cấu hình', icon: <Settings size={18} /> },
    { id: 3, label: 'Chiến dịch', icon: <Zap size={18} /> }
  ];

  const types = [
    { id: 'amount_off_products', label: 'Amount off products', desc: 'Discount specific products or collection of products', icon: <Gift /> },
    { id: 'amount_off_order', label: 'Amount off order', desc: 'Discounts the total order amount', icon: <DollarSign /> },
    { id: 'percentage_off_product', label: 'Percentage off product', desc: 'Discounts a percentage off selected products', icon: <Percent /> },
    { id: 'percentage_off_order', label: 'Percentage off order', desc: 'Discounts a percentage of the total order amount', icon: <Percent /> },
    { id: 'buy_x_get_y', label: 'Buy X Get Y', desc: 'Buy X product(s), get Y product(s)', icon: <Gift /> },
    { id: 'free_shipping', label: 'Free shipping', desc: 'Applies a 100% discount to shipping fees', icon: <Truck /> },
  ];

  const inputStyle = "w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium dark:text-white transition-all";
  const labelStyle = "text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-2 block";
  const subLabelStyle = "text-[11px] text-slate-400 font-medium mb-4 block leading-relaxed";

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-14 overflow-x-auto no-scrollbar py-2">
      {steps.map((s, idx) => (
        <React.Fragment key={s.id}>
          <div
            className={`flex items-center gap-3 transition-all duration-500 shrink-0 ${step >= s.id ? 'opacity-100' : 'opacity-40 grayscale'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-lg transition-all ${step >= s.id ? 'bg-blue-600 text-white scale-110 shadow-blue-500/20' : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
              {step > s.id ? <Check size={24} strokeWidth={3} /> : s.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Bước 0{s.id}</span>
              <span className={`text-sm font-black tracking-tight ${step >= s.id ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>{s.label}</span>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-8 md:w-20 h-0.5 rounded-full transition-colors duration-500 ${step > s.id ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-48 animate-fade-in px-4">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-slate-500"
          >
            <ChevronRight className="rotate-180" size={24} />
          </button>
          <div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none flex items-center gap-4">
              Tạo Khuyến Mãi
              <span className="text-blue-600 uppercase text-xs tracking-[0.4em] font-black">Marketing Strategy</span>
            </h2>
          </div>
        </div>
      </div>

      {renderStepIndicator()}

      <div className="max-w-4xl mx-auto">
        {step === 1 && (
          <div className="space-y-10 animate-fade-in">
            <div className="text-center mb-8">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Lựa chọn hình thức giảm giá</h3>
              <p className="text-slate-500 text-sm mt-1">Hệ thống hỗ trợ đa dạng các kịch bản khuyến mãi linh hoạt</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {types.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedType(t.id as any)}
                  className={`p-8 rounded-[32px] border-2 cursor-pointer transition-all flex items-start gap-6 ${selectedType === t.id ? 'bg-blue-50/10 border-blue-500 shadow-xl ring-4 ring-blue-500/5' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${selectedType === t.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-base text-slate-800 dark:text-white mb-1">{t.label}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{t.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${selectedType === t.id ? 'border-blue-500' : 'border-slate-300'}`}>
                    {selectedType === t.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white">Chi tiết khuyến mãi</h2>
                <p className="text-slate-500 font-medium">Thiết lập các quy tắc và giá trị của mã giảm giá</p>
              </div>
              <div className="px-5 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-xs font-black text-blue-600 uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                {types.find(t => t.id === selectedType)?.label}
              </div>
            </div>

            {/* Phương thức */}
            <section className="space-y-6">
              <label className={labelStyle}>Phương thức áp dụng</label>
              <div className="grid grid-cols-2 gap-6">
                <div
                  onClick={() => setMethod('code')}
                  className={`p-6 rounded-[28px] border-2 cursor-pointer transition-all flex gap-5 ${method === 'code' ? 'bg-blue-50/10 border-blue-500 shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${method === 'code' ? 'border-blue-500' : 'border-slate-300'}`}>
                    {method === 'code' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-800 dark:text-white">Mã khuyến mãi</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Khách hàng phải nhập mã này khi thanh toán để nhận ưu đãi.</p>
                  </div>
                </div>
                <div
                  onClick={() => setMethod('automatic')}
                  className={`p-6 rounded-[28px] border-2 cursor-pointer transition-all flex gap-5 ${method === 'automatic' ? 'bg-blue-50/10 border-blue-500 shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${method === 'automatic' ? 'border-blue-500' : 'border-slate-300'}`}>
                    {method === 'automatic' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-800 dark:text-white">Áp dụng tự động</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Hệ thống tự động trừ tiền khi đơn hàng thỏa mãn toàn bộ quy tắc.</p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="dark:border-slate-800" />

            {/* Trạng thái */}
            <section className="space-y-6">
              <label className={labelStyle}>Trạng thái phát hành</label>
              <div className="grid grid-cols-2 gap-6">
                <div onClick={() => setStatus('draft')} className={`p-6 rounded-[28px] border-2 cursor-pointer transition-all flex gap-5 ${status === 'draft' ? 'bg-blue-50/10 border-blue-500 shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${status === 'draft' ? 'border-blue-500' : 'border-slate-300'}`}>
                    {status === 'draft' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div><h4 className="font-black text-sm">Bản nháp</h4><p className="text-[11px] text-slate-500 font-medium mt-1">Lưu để chỉnh sửa sau, khách hàng chưa thể sử dụng.</p></div>
                </div>
                <div onClick={() => setStatus('active')} className={`p-6 rounded-[28px] border-2 cursor-pointer transition-all flex gap-5 ${status === 'active' ? 'bg-blue-50/10 border-blue-500 shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${status === 'active' ? 'border-blue-500' : 'border-slate-300'}`}>
                    {status === 'active' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div><h4 className="font-black text-sm">Hoạt động</h4><p className="text-[11px] text-slate-500 font-medium mt-1">Công khai mã lên hệ thống ngay sau khi hoàn tất lưu.</p></div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelStyle}>Mã Voucher</label>
                <input type="text" placeholder="VD: SUMMER2026" defaultValue="SUMMER15" className={`${inputStyle} h-14 font-black uppercase text-blue-600 tracking-widest`} />
              </div>
              <div className="space-y-2">
                <label className={labelStyle}>Giá trị khuyến mãi</label>
                <div className="relative">
                  <input type="number" defaultValue="100000" className={`${inputStyle} h-14 pr-12 font-black text-lg`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VNĐ</span>
                </div>
              </div>
            </section>

            <hr className="dark:border-slate-800" />

            {/* Quy tắc Rules */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <label className={labelStyle}>Đối tượng khách hàng áp dụng</label>
                  <p className={subLabelStyle}>Để trống nếu muốn áp dụng cho tất cả khách hàng.</p>
                </div>
                <Button variant="soft" size="sm" className="mb-4 rounded-xl text-[10px] font-black h-10" icon={<Plus size={14} />}>THÊM QUY TẮC</Button>
              </div>
              <Card noPadding className="p-8 bg-slate-50 dark:bg-slate-950 border-none rounded-[32px] space-y-6 shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Thuộc tính</label>
                    <input type="text" defaultValue="Customer Group" className={`${inputStyle} bg-white dark:bg-slate-900 border-none shadow-sm`} />
                  </div>
                  <div className="w-48 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Phép toán</label>
                    <select className={`${inputStyle} bg-white dark:bg-slate-900 border-none shadow-sm appearance-none`}>
                      <option>Equals</option>
                      <option>Not Equals</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Giá trị mục tiêu</label>
                    <select className={`${inputStyle} bg-white dark:bg-slate-900 border-none shadow-sm appearance-none`}>
                      <option>Chọn nhóm khách hàng...</option>
                      <option>Khách hàng VIP</option>
                      <option>Nhà nông 4.0</option>
                    </select>
                  </div>
                  <button className="self-end mb-2 p-3 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              </Card>
            </section>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-12 animate-fade-in max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <div className="relative w-24 h-24 bg-blue-600 text-white rounded-[32px] flex items-center justify-center shadow-2xl mx-auto">
                  <Zap size={48} strokeWidth={2.5} fill="currentColor" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white">Liên kết chiến dịch</h2>
              <p className="text-slate-500 font-medium mt-1">Gán khuyến mãi này vào một chiến dịch để quản lý ngân sách tập trung</p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'none', label: 'Không liên kết chiến dịch', desc: 'Tiếp tục mà không gán mã này vào bất kỳ Campaign nào.' },
                { id: 'existing', label: 'Sử dụng chiến dịch hiện có', desc: 'Gán khuyến mãi này vào một chương trình Marketing đang chạy.' },
                { id: 'new', label: 'Tạo chiến dịch mới ngay', desc: 'Thiết lập ngân sách và thời hạn riêng cho đợt khuyến mãi này.' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setCampaignLink(opt.id as any)}
                  className={`p-8 rounded-[32px] border-2 cursor-pointer transition-all flex items-center gap-6 ${campaignLink === opt.id ? 'bg-blue-50/10 border-blue-500 shadow-xl' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${campaignLink === opt.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                    {opt.id === 'none' ? <X size={28} /> : opt.id === 'existing' ? <Database size={28} /> : <Plus size={28} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-lg text-slate-800 dark:text-white">{opt.label}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium italic">{opt.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${campaignLink === opt.id ? 'border-blue-500' : 'border-slate-300'}`}>
                    {campaignLink === opt.id && <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />}
                  </div>
                </div>
              ))}
            </div>

            {campaignLink === 'existing' && (
              <section className="space-y-4 animate-slide-up bg-slate-50 dark:bg-slate-950 p-8 rounded-[40px]">
                <label className={labelStyle}>Chọn chiến dịch hệ thống</label>
                <div className="relative">
                  <select className={`${inputStyle} h-14 appearance-none pr-10 bg-white dark:bg-slate-900 border-none shadow-sm`}>
                    <option>Chọn chiến dịch đang hoạt động...</option>
                    <option>Chiền dịch Mùa Vàng 2026</option>
                    <option>Săn ưu đãi VIP tháng 2</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </section>
            )}

            {campaignLink === 'new' && (
              <div className="grid grid-cols-2 gap-8 animate-slide-up bg-slate-50 dark:bg-slate-950 p-10 rounded-[48px] border-none shadow-inner">
                <div className="col-span-2 space-y-4">
                  <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Thông tin chiến dịch mới</h5>
                  <div className="space-y-2">
                    <label className={labelStyle}>Tiêu đề chiến dịch</label>
                    <input type="text" className={`${inputStyle} h-14 bg-white dark:bg-slate-900 border-none shadow-sm`} placeholder="VD: Khuyến mãi Tết Nguyên Đán 2026" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Ngày bắt đầu</label>
                  <div className="relative">
                    <input type="text" className={`${inputStyle} h-14 bg-white dark:bg-slate-900 border-none shadow-sm`} placeholder="DD/MM/YYYY" />
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Ngày kết thúc</label>
                  <div className="relative">
                    <input type="text" className={`${inputStyle} h-14 bg-white dark:bg-slate-900 border-none shadow-sm`} placeholder="DD/MM/YYYY" />
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className={labelStyle}>Ngân sách tối đa (VNĐ)</label>
                  <div className="relative">
                    <input type="number" className={`${inputStyle} h-14 bg-white dark:bg-slate-900 border-none shadow-sm pl-12`} placeholder="0" />
                    <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-1/2 m-auto fixed bottom-0 left-0 right-0 h-24 bg-[#0B1221] border-t border-white/5 z-[100] flex items-center justify-end px-12 gap-5 shadow-[0_-15px_50px_rgba(0,0,0,0.6)]">
        <div className="flex-1 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quá trình khởi tạo đang được bảo mật</p>
          </div>
        </div>

        <button
          onClick={step === 1 ? onCancel : () => setStep(step - 1)}
          className="h-12 px-10 rounded-full bg-slate-800/40 hover:bg-slate-800 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          {step === 1 ? 'HỦY BỎ' : 'QUAY LẠI'}
        </button>

        <button
          onClick={step === 3 ? onSave : () => setStep(step + 1)}
          className="h-14 px-12 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-white text-sm font-black flex items-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000" />

          <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
          <span className="uppercase tracking-tight">
            {step === 3 ? 'HOÀN TẤT & LƯU CHIẾN DỊCH' : 'TIẾP TỤC BƯỚC TIẾP THEO'}
          </span>
        </button>
      </div>
    </div>
  );
};
