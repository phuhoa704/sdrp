import React, { useState } from 'react';
import {
  Calendar, Loader2, ChevronRight,
  ArrowLeft, Target, Wallet
} from 'lucide-react';
import { campaignService } from '@/lib/api/medusa/campaignService';
import { useToast } from '@/contexts/ToastContext';
import { CreateCampaignPayload } from '@/types/campaign';

interface CampaignFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ onCancel, onSave }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');

  // Budget State
  const [budgetType, setBudgetType] = useState<'usage' | 'spend'>('usage');
  const [budgetLimit, setBudgetLimit] = useState<number | undefined>();
  const [currencyCode, setCurrencyCode] = useState('vnd');
  const [limitAttribute, setLimitAttribute] = useState('customer_id');

  const labelStyle = "text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 block mb-2";
  const inputStyle = "w-full bg-white/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600";

  const handleSubmit = async () => {
    if (!name || !identifier) {
      showToast('Vui lòng điền Tên và Mã nhận diện chiến dịch', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload: CreateCampaignPayload = {
        name,
        campaign_identifier: identifier,
        description: description || null as any,
        starts_at: startsAt ? new Date(startsAt).toISOString() : null as any,
        ends_at: endsAt ? new Date(endsAt).toISOString() : null as any,
        budget: {
          type: "use_by_attribute",
          limit: budgetLimit || null,
          currency_code: budgetType === 'spend' ? (currencyCode || null) : null,
          attribute: budgetType === 'usage' ? limitAttribute : 'customer_id'
        }
      };

      if (startsAt && endsAt && new Date(startsAt) > new Date(endsAt)) {
        showToast('Ngày kết thúc phải sau ngày bắt đầu', 'error');
        setLoading(false);
        return;
      }

      await campaignService.createCampaign(payload);
      showToast('Tạo chiến dịch thành công!', 'success');
      onSave();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi tạo chiến dịch', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-8 pb-32 font-sans">
      {/* Header Section */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-500 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Tạo Chiến Dịch</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-tight mt-1">Khởi tạo một chiến dịch quảng bá mới.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Basic Information */}
        <section className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelStyle}>Tên chiến dịch</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${inputStyle} h-14`}
                placeholder="VD: Khuyến mãi Hè 2024"
              />
            </div>
            <div className="space-y-2">
              <label className={labelStyle}>Mã nhận diện</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={`${inputStyle} h-14 uppercase tracking-widest`}
                placeholder="CAMPAIGN_CODE_01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelStyle}>Mô tả <span className="text-slate-400 lowercase italic">(Không bắt buộc)</span></label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputStyle} py-4 resize-none`}
              placeholder="Nhập mô tả ngắn về chiến dịch..."
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelStyle}>Ngày bắt đầu <span className="text-slate-400 lowercase italic">(Không bắt buộc)</span></label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className={`${inputStyle} h-14 appearance-none`}
                />
                <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelStyle}>Ngày kết thúc <span className="text-slate-400 lowercase italic">(Không bắt buộc)</span></label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className={`${inputStyle} h-14 appearance-none`}
                />
                <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        <hr className="dark:border-slate-800 opacity-50" />

        {/* Budget Section */}
        <section className="space-y-8">
          <div>
            <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Ngân Sách Chiến Dịch</h4>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Thiết lập hạn mức tiêu dùng hoặc số lần sử dụng.</p>
          </div>

          <div className="space-y-4">
            <label className={labelStyle}>Loại ngân sách</label>
            <div className="grid grid-cols-2 gap-6">
              <div
                onClick={() => setBudgetType('usage')}
                className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all flex gap-5 ${budgetType === 'usage' ? 'bg-blue-50/10 border-blue-500 shadow-lg ring-4 ring-blue-500/5' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${budgetType === 'usage' ? 'border-blue-500' : 'border-slate-300'}`}>
                  {budgetType === 'usage' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                    <Target size={16} className="text-blue-500" /> Usage (Lượt dùng)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Giới hạn số lần các mã khuyến mãi trong chiến dịch có thể được sử dụng.</p>
                </div>
              </div>
              <div
                onClick={() => setBudgetType('spend')}
                className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all flex gap-5 ${budgetType === 'spend' ? 'bg-blue-50/10 border-blue-500 shadow-lg ring-4 ring-blue-500/5' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${budgetType === 'spend' ? 'border-blue-500' : 'border-slate-300'}`}>
                  {budgetType === 'spend' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                    <Wallet size={16} className="text-emerald-500" /> Spend (Tiền phí)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Giới hạn tổng số tiền chiết khấu đã áp dụng cho toàn chiến dịch.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            {budgetType === 'usage' ? (
              <>
                <div className="space-y-2">
                  <label className={labelStyle}>Hạn mức (Số lần)</label>
                  <input
                    type="number"
                    value={budgetLimit || ''}
                    onChange={(e) => setBudgetLimit(e.target.value ? Number(e.target.value) : undefined)}
                    className={`${inputStyle} h-14`}
                    placeholder="VD: 1000"
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Giới hạn sử dụng mỗi</label>
                  <select
                    value={limitAttribute}
                    onChange={(e) => setLimitAttribute(e.target.value)}
                    className={`${inputStyle} h-14 appearance-none`}
                  >
                    <option value="customer_id">Khách hàng (ID)</option>
                    <option value="customer_email">Email khách hàng</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className={labelStyle}>Loại tiền tệ</label>
                  <select
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value)}
                    className={`${inputStyle} h-14 appearance-none`}
                  >
                    <option value="vnd">VNĐ (Việt Nam Đồng)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Hạn mức chi tiêu</label>
                  <input
                    type="number"
                    value={budgetLimit || ''}
                    onChange={(e) => setBudgetLimit(e.target.value ? Number(e.target.value) : undefined)}
                    className={`${inputStyle} h-14`}
                    placeholder="VD: 5,000,000"
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="w-1/2 m-auto fixed bottom-0 left-0 right-0 h-24 dark:bg-slate-900 bg-slate-200/50 border-t border-white/5 z-[100] flex items-center justify-end px-12 gap-5 dark:shadow-[0_-15px_50px_rgba(0,0,0,0.6)] rounded-tl-xl rounded-tr-xl">
        <button
          onClick={onCancel}
          className="h-12 px-10 rounded-full bg-slate-800/40 hover:bg-slate-800 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          HỦY BỎ
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="h-14 px-12 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white text-sm font-black flex items-center gap-3 shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 group disabled:opacity-50 disabled:grayscale relative overflow-hidden"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000" />

          {loading ? <Loader2 size={22} className="animate-spin" /> : <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />}
          <span className="uppercase tracking-tight">HOÀN TẤT & LƯU CHIẾN DỊCH</span>
        </button>
      </div>
    </div>
  );
};
