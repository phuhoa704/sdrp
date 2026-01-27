'use client';

import { Fragment, useState, useMemo } from 'react';
import {
  Plus,
  Download,
  Search,
  Zap,
  SearchX,
  Calendar,
  History,
  Clock,
  AlertCircle,
  ArrowUpRight,
  User,
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { StockDisposalVoucher } from '@/types/stock';
import { StockDisposalForm } from '@/components/form/stock/StockDisposalForm';
import { Product } from '@/types/product';

interface Props {
  localProducts: Product[];
}

export default function StockDisposal({ localProducts }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'completed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [disposals, setDisposals] = useState<StockDisposalVoucher[]>(() => {
    const saved = localStorage.getItem('retail_disposals');
    return saved ? JSON.parse(saved) : [];
  });

  const filteredDisposals = useMemo(() => {
    return disposals.filter(d => {
      const matchesSearch = d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.items.some(i => i.productName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTab = activeTab === 'all' || d.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [disposals, searchTerm, activeTab]);

  const totalValueThisMonth = useMemo(() => {
    return disposals
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.totalValue, 0);
  }, [disposals]);

  const breadcrumbItems = useMemo(() => (
    isFormOpen ? [
      { label: 'KHO HÀNG', href: '#' },
      { label: 'XUẤT HỦY', href: '#', onClick: () => setIsFormOpen(false) },
      { label: 'TẠO PHIẾU MỚI', href: '#' }
    ] : [
      { label: 'KHO HÀNG', href: '#' },
      { label: 'XUẤT HỦY', href: '#' }
    ]
  ), [isFormOpen]);

  const handleSaveDisposal = (newDisposal: StockDisposalVoucher) => {
    const updated = [newDisposal, ...disposals];
    setDisposals(updated);
    localStorage.setItem('retail_disposals', JSON.stringify(updated));
    setIsFormOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Hoàn thành</span>;
      case 'draft':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Phiếu tạm</span>;
      case 'cancelled':
        return <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Đã hủy</span>;
      default: return null;
    }
  };

  if (isFormOpen) {
    return (
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative font-sans">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                INVENTORY MANAGEMENT
              </span>
              <Zap size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Xuất hủy <span className="text-rose-600 font-black">Hàng hỏng/hết hạn</span>
            </h2>
          </div>
        </div>
        <StockDisposalForm
          products={localProducts}
          onSave={handleSaveDisposal}
          onCancel={() => setIsFormOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="pb-32 animate-fade-in space-y-8 min-h-full relative font-sans">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
              INVENTORY MANAGEMENT
            </span>
            <Zap size={12} className='text-amber-500 animate-pulse' />
          </div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
            Xuất hủy <span className="text-rose-600 font-black">Hàng hỏng/hết hạn</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white/5 dark:bg-slate-800/40 text-slate-400 border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95">
            <Download size={18} />
            Xuất file
          </button>
          <Button onClick={() => setIsFormOpen(true)} className="h-14 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 font-black text-xs px-6 uppercase tracking-wider" icon={<Plus size={20} />}>
            TẠO PHIẾU HỦY
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Tìm theo mã xuất hủy (VD: XH...)"
            className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-slate-200 placeholder-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-white/5">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                activeTab === 'all' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >Tất cả</button>
            <button
              onClick={() => setActiveTab('draft')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                activeTab === 'draft' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >Phiếu tạm</button>
            <button
              onClick={() => setActiveTab('completed')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                activeTab === 'completed' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >Hoàn thành</button>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/40 border border-white/5 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-all">
            <Calendar size={16} className="text-emerald-500" />
            Tháng này
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-rose-500/5 border border-rose-500/20 shadow-xl flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
            <AlertCircle size={30} />
          </div>
          <div>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Giá trị hủy tháng này</p>
            <p className="text-3xl font-black text-rose-600">{totalValueThisMonth.toLocaleString()}đ</p>
          </div>
        </Card>

        <Card className="p-6 bg-blue-500/5 border border-blue-500/20 shadow-xl flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <History size={30} />
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Tổng số phiếu</p>
            <p className="text-3xl font-black text-blue-600">{disposals.length} phiếu</p>
          </div>
        </Card>
      </div>

      <Card noPadding className="overflow-hidden shadow-xl bg-slate-900/40 border border-white/5 rounded-[32px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-8 py-6 w-12 text-center">
                  <div className="w-4 h-4 rounded border-2 border-slate-700 mx-auto"></div>
                </th>
                <th className="px-6 py-6">Mã xuất hủy</th>
                <th className="px-6 py-6 text-right">Tổng giá trị hủy</th>
                <th className="px-6 py-6 text-center">Thời gian</th>
                <th className="px-6 py-6">Chi nhánh</th>
                <th className="px-8 py-6 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDisposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                      <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                        <SearchX size={40} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-bold italic text-slate-400">Không tìm thấy phiếu xuất hủy nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDisposals.map((d) => (
                  <Fragment key={d.id}>
                    <tr
                      className={cn(
                        "group hover:bg-white/5 transition-all cursor-pointer",
                        expandedId === d.id ? "bg-emerald-900/10" : ""
                      )}
                      onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                    >
                      <td className="px-8 py-5 text-center">
                        <input type="checkbox" onClick={e => e.stopPropagation()} className="rounded border-slate-700 bg-transparent text-emerald-500" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-black text-slate-100 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{d.code}</p>
                          <ArrowUpRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-black text-rose-500">
                        {d.totalValue.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-5 text-center text-xs font-bold text-slate-500">
                        {d.createdAt}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{d.branch}</p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {getStatusBadge(d.status)}
                      </td>
                    </tr>
                    {expandedId === d.id && (
                      <tr className="bg-slate-900/80 border-l-4 border-emerald-500 animate-slide-up">
                        <td colSpan={6} className="px-12 py-10">
                          <div className="space-y-8">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{d.code}</h3>
                                <div className="flex gap-6 text-xs font-bold text-slate-500">
                                  <p className="flex items-center gap-2 uppercase tracking-widest"><User size={14} className="text-emerald-500" /> Người tạo: {d.creator}</p>
                                  <p className="flex items-center gap-2 uppercase tracking-widest"><Clock size={14} className="text-emerald-500" /> Thời gian: {d.createdAt}</p>
                                </div>
                              </div>
                              <div className="flex gap-4">
                                <Button size="sm" variant="outline" className="h-10 rounded-xl" icon={<Download size={14} />}>In phiếu</Button>
                                {d.status === 'draft' && (
                                  <Button size="sm" className="h-10 rounded-xl bg-emerald-600">Duyệt phiếu</Button>
                                )}
                              </div>
                            </div>

                            <div className="bg-slate-950 border border-white/5 rounded-3xl overflow-hidden">
                              <table className="w-full text-left">
                                <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                  <tr>
                                    <th className="px-8 py-4">Sản phẩm</th>
                                    <th className="px-6 py-4 text-center">ĐVT</th>
                                    <th className="px-6 py-4 text-center">Số lượng</th>
                                    <th className="px-6 py-4 text-right">Giá vốn</th>
                                    <th className="px-8 py-4 text-right">Thành tiền</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {d.items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                      <td className="px-8 py-4">
                                        <p className="text-sm font-bold text-slate-200">{item.productName}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{item.productId}</p>
                                      </td>
                                      <td className="px-6 py-4 text-center text-xs font-medium text-slate-400">{item.unit}</td>
                                      <td className="px-6 py-4 text-center font-black text-white">{item.quantity}</td>
                                      <td className="px-6 py-4 text-right text-xs font-bold text-slate-500">{item.costPrice.toLocaleString()}</td>
                                      <td className="px-8 py-4 text-right font-black text-emerald-500">{(item.costPrice * item.quantity).toLocaleString()}đ</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {d.note && (
                              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><History size={14} /> Ghi chú lý do</p>
                                <p className="text-sm text-slate-300 font-medium italic">"{d.note}"</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
