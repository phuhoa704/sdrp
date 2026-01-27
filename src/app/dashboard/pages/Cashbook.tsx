'use client';

import { useState, useMemo } from 'react';
import {
  Zap,
  Search,
  Download,
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  CreditCard,
  Banknote,
  FileText,
  ShieldCheck,
  ChevronRight,
  User,
  MoreHorizontal
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/Modal';
import { CashbookForm } from '@/components/form/cashbook/CashbookForm';

interface Transaction {
  id: string;
  time: string;
  type: 'income' | 'expense' | 'transfer';
  target: string;
  reason: string;
  method: 'cash' | 'transfer';
  value: number;
  isAccounting: boolean;
}

export default function Cashbook() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'IN' | 'OUT' | 'TRANSFER'>('IN');

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('retail_transactions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'PT000001',
        time: '22/01/2026 08:30',
        type: 'income',
        target: 'Chú Năm Ruộng',
        reason: 'Thu tiền bán hàng (POS-8821)',
        method: 'cash',
        value: 450000,
        isAccounting: true
      },
      {
        id: 'PC000001',
        time: '21/01/2026 15:45',
        type: 'expense',
        target: 'NPP Hoàng Gia',
        reason: 'Thanh toán tiền hàng (ORD-9921)',
        method: 'transfer',
        value: -12500000,
        isAccounting: true
      },
      {
        id: 'CQ000001',
        time: '20/01/2026 10:00',
        type: 'transfer',
        target: 'Nội bộ',
        reason: 'Chuyển tiền mặt vào tài khoản TEC...',
        method: 'cash',
        value: 5000000,
        isAccounting: false
      }
    ];
  });

  const openModal = (type: 'IN' | 'OUT' | 'TRANSFER') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (data: any) => {
    const newTransaction: Transaction = {
      id: data.code,
      time: data.date,
      type: data.type === 'IN' ? 'income' : data.type === 'OUT' ? 'expense' : 'transfer',
      target: data.partner,
      reason: data.reason,
      method: data.method === 'CASH' ? 'cash' : 'transfer',
      value: data.type === 'OUT' ? -data.amount : data.amount,
      isAccounting: data.isAccounting
    };
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem('retail_transactions', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'income' && t.type === 'income') ||
      (activeTab === 'expense' && t.type === 'expense') ||
      (activeTab === 'transfer' && t.type === 'transfer');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="pb-32 animate-fade-in space-y-8 min-h-full relative font-sans">
      <Breadcrumb
        items={[
          { label: 'TÀI CHÍNH', href: '#' },
          { label: 'SỔ QUỸ & DÒNG TIỀN', href: '#' }
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
              FINANCIAL MANAGEMENT
            </span>
            <Zap size={12} className='text-amber-500 animate-pulse' />
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
            Dòng Tiền <span className="text-emerald-600 font-black">Thông Minh</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs mt-3 uppercase tracking-tight">Kiểm soát thu chi, công nợ và điều chuyển quỹ tập trung</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openModal('TRANSFER')}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 dark:bg-slate-800/40 text-slate-400 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95"
          >
            <RefreshCcw size={16} />
            Chuyển quỹ
          </button>
          <button
            onClick={() => openModal('OUT')}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 dark:bg-slate-800/40 text-slate-400 border border-emerald-500/30 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-emerald-500/10 transition-all active:scale-95"
          >
            <TrendingDown size={16} className="text-rose-500" />
            Lập phiếu chi
          </button>
          <button
            onClick={() => openModal('IN')}
            className="flex items-center gap-3 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95"
          >
            <TrendingUp size={18} />
            Lập phiếu thu
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title=""
        maxWidth="2xl"
      >
        <CashbookForm
          type={modalType}
          onSave={handleSaveTransaction}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 p-8 bg-slate-900 border-none shadow-2xl rounded-[40px] flex items-center justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Tổng tồn quỹ hiện tại</p>
            <p className="text-4xl font-black text-white">-12,050,000đ</p>
            <div className="mt-6 flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase">Tất cả chi nhánh & ngân hàng</span>
            </div>
          </div>
          <div className="relative z-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={120} className="text-white" strokeWidth={1} />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full"></div>
        </Card>

        <Card className="lg:col-span-4 p-8 bg-white dark:bg-slate-900 border-none shadow-sm rounded-[40px] flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tổng thu (Tháng này)</p>
            <p className="text-3xl font-black text-emerald-600">+450,000đ</p>
          </div>
          <div className="mt-8">
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[60%] h-full bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-4 p-8 bg-white dark:bg-slate-900 border-none shadow-sm rounded-[40px] flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tổng chi (Tháng này)</p>
            <p className="text-3xl font-black text-rose-600">-12,500,000đ</p>
          </div>
          <div className="mt-8">
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-rose-500 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Tìm theo mã phiếu, đối tác hoặc lý do..."
            className="w-full bg-slate-950/20 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[24px] py-4 pl-14 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-slate-800 dark:text-slate-200 placeholder-slate-500 shadow-inner-glow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-white/5 scrollbar-hide overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'income', label: 'Phiếu thu' },
            { id: 'expense', label: 'Phiếu chi' },
            { id: 'transfer', label: 'Điều chuyển' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {tab.label}
            </button>
          ))}
          <button className="p-2.5 text-slate-500 hover:text-white transition-colors border-l border-white/5 ml-1">
            <Download size={16} />
          </button>
        </div>
      </div>

      <Card noPadding className="overflow-hidden shadow-xl bg-white dark:bg-slate-900 rounded-[32px] border dark:border-white/5">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
              <tr>
                <th className="px-8 py-6">Mã phiếu</th>
                <th className="px-6 py-6 text-center">Ngày giờ</th>
                <th className="px-6 py-6">Đối tượng / Lý do</th>
                <th className="px-6 py-6 text-center">Phương thức</th>
                <th className="px-6 py-6 text-right">Giá trị</th>
                <th className="px-6 py-6 text-center">Hạch toán</th>
                <th className="px-8 py-6 text-right w-16">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                      t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" :
                        t.type === 'expense' ? "bg-rose-500/10 text-rose-500" :
                          "bg-blue-500/10 text-blue-500"
                    )}>
                      {t.id}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center text-[10px] font-bold text-slate-400 whitespace-nowrap">
                    {t.time}
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">{t.target}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">{t.reason}</p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center gap-2">
                      {t.method === 'cash' ? <Banknote size={16} className="text-emerald-500" /> : <CreditCard size={16} className="text-blue-500" />}
                      <span className="text-[9px] font-black text-slate-500 uppercase">{t.method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right font-black">
                    <span className={cn(
                      "text-sm tracking-tighter",
                      t.value > 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {t.value > 0 ? '+' : ''}{t.value.toLocaleString()}đ
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                      {t.isAccounting ? (
                        <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase">
                          <ShieldCheck size={14} /> KẾT QUẢ KD
                        </div>
                      ) : (
                        <div className="text-[9px] font-black text-slate-400 uppercase">KHÔNG TÍNH KQKD</div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 bg-blue-900/10 border-none shadow-xl flex items-center gap-6 group cursor-pointer hover:bg-blue-900/20 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <FileText size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black text-blue-500 leading-tight">Báo cáo Tài chính</h4>
            <p className="text-xs font-bold text-slate-500 mt-1">Phân tích lãi lỗ (P&L), công nợ và dự báo dòng tiền</p>
          </div>
          <ChevronRight className="ml-auto text-blue-500/30 group-hover:text-blue-500 transition-all" size={24} />
        </Card>

        <Card className="p-8 bg-amber-900/10 border-none shadow-xl flex items-center gap-6 group cursor-pointer hover:bg-amber-900/20 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
            <RefreshCcw size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black text-amber-500 leading-tight">Đối soát Chi nhánh</h4>
            <p className="text-xs font-bold text-slate-500 mt-1">Quản lý dòng tiền luân chuyển giữa các kho và chi nhánh vùng</p>
          </div>
          <ChevronRight className="ml-auto text-amber-500/30 group-hover:text-amber-500 transition-all" size={24} />
        </Card>
      </div>
    </div>
  );
}
