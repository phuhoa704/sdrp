'use client';

import React, { useState } from 'react';
import {
  X,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  Banknote,
  CreditCard,
  User,
  LayoutGrid,
  Info,
  CheckCircle2,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

interface CashbookFormProps {
  type: 'IN' | 'OUT' | 'TRANSFER';
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const CashbookForm: React.FC<CashbookFormProps> = ({ type, onSave, onCancel }) => {
  const [amount, setAmount] = useState<string>('0');
  const [method, setMethod] = useState<'CASH' | 'BANK'>('CASH');
  const [partner, setPartner] = useState('');
  const [reason, setReason] = useState('Bán hàng thu tiền ngay (Mặc định)');
  const [isAccounting, setIsAccounting] = useState(true);

  const config = {
    IN: {
      title: 'LẬP PHIẾU THU',
      subtitle: 'HẠCH TOÁN TÀI CHÍNH',
      color: 'bg-emerald-500',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600',
      icon: <ArrowUpCircle size={32} />,
      defaultReason: 'Bán hàng thu tiền ngay (Mặc định)'
    },
    OUT: {
      title: 'LẬP PHIẾU CHI',
      subtitle: 'HẠCH TOÁN TÀI CHÍNH',
      color: 'bg-rose-500',
      btnColor: 'bg-rose-500 hover:bg-rose-600',
      icon: <ArrowDownCircle size={32} />,
      defaultReason: 'Thanh toán tiền hàng cho NCC'
    },
    TRANSFER: {
      title: 'CHUYỂN QUỸ NỘI BỘ',
      subtitle: 'HẠCH TOÁN TÀI CHÍNH',
      color: 'bg-blue-600',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      icon: <RefreshCcw size={32} />,
      defaultReason: 'Chuyển tiền mặt vào tài khoản ngân hàng'
    }
  }[type];

  const handleSubmit = () => {
    onSave({
      type,
      amount: parseFloat(amount.replace(/,/g, '')),
      method,
      partner,
      reason,
      isAccounting,
      date: new Date().toLocaleString('vi-VN'),
      code: `${type === 'IN' ? 'PT' : type === 'OUT' ? 'PC' : 'CQ'}${Math.floor(Math.random() * 100000)}`
    });
  };

  return (
    <div className="w-full max-w-2xl bg-[#0f172a] rounded-[40px] overflow-hidden shadow-2xl animate-slide-up border border-white/5">
      {/* Header */}
      <div className={cn("p-8 flex justify-between items-center text-white", config.color)}>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
            {config.icon}
          </div>
          <div>
            <p className="text-[10px] font-black opacity-70 uppercase tracking-[0.2em] mb-1">{config.subtitle}</p>
            <h3 className="text-2xl font-black tracking-tight">{config.title}</h3>
          </div>
        </div>
        <button onClick={onCancel} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all">
          <X size={28} />
        </button>
      </div>

      <div className="p-10 space-y-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Amount */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Số tiền giao dịch (VNĐ)</label>
            <div className="relative group">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-16 bg-slate-900 border border-white/5 rounded-2xl px-6 text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
              />
            </div>
          </div>

          {/* Method */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Phương thức</label>
            <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/5 h-16">
              <button
                onClick={() => setMethod('CASH')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase transition-all",
                  method === 'CASH' ? "bg-white/10 text-emerald-400 border border-white/5" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Banknote size={18} /> Tiền mặt
              </button>
              <button
                onClick={() => setMethod('BANK')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase transition-all",
                  method === 'BANK' ? "bg-white/10 text-blue-400 border border-white/5" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <CreditCard size={18} /> Ngân hàng
              </button>
            </div>
          </div>
        </div>

        {/* Partner */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Đối tượng giao dịch</label>
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={20} />
            <input
              type="text"
              placeholder="Tìm tên khách hàng, nhà cung cấp hoặc nhân viên..."
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className="w-full h-16 bg-slate-900 border border-white/5 rounded-2xl pl-14 pr-6 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Lý do giao dịch</label>
          <div className="relative group">
            <LayoutGrid className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={20} />
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-16 bg-slate-900 border border-white/5 rounded-2xl pl-14 pr-6 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all appearance-none cursor-pointer"
            >
              <option>{config.defaultReason}</option>
              <option>Thu nợ khách hàng</option>
              <option>Chi phí vận hành</option>
              <option>Chi lương nhân viên</option>
              <option>Khác...</option>
            </select>
          </div>
        </div>

        {/* Accounting Toggle */}
        <div className="p-8 bg-white/5 border border-dashed border-white/10 rounded-3xl flex items-center justify-between group">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
              <Info size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-tight mb-1">Hạch toán kết quả kinh doanh</p>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed">Phiếu này sẽ tự động được cộng dồn vào báo cáo Lãi/Lỗ tổng hợp.</p>
            </div>
          </div>
          <button
            onClick={() => setIsAccounting(!isAccounting)}
            className={cn(
              "w-14 h-8 rounded-full transition-all relative p-1",
              isAccounting ? "bg-emerald-500" : "bg-slate-700"
            )}
          >
            <div className={cn(
              "w-6 h-6 bg-white rounded-full shadow-lg transition-all",
              isAccounting ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-center flex-col items-center gap-6 pt-4">
          <button
            onClick={handleSubmit}
            className={cn(
              "w-full h-16 rounded-2xl text-xs font-black text-white uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3",
              config.btnColor
            )}
          >
            <CheckCircle2 size={24} />
            Xác nhận lập phiếu
          </button>
          <button
            onClick={onCancel}
            className="text-[11px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-3 border border-white/5 px-8 py-3 rounded-xl hover:bg-white/5"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};
