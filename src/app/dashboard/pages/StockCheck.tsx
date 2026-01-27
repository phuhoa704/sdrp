'use client';

import { Fragment, useMemo, useState } from 'react';
import {
  Plus,
  Download,
  Search,
  Zap,
  SearchX,
  ArrowUpRight,
  User,
  Calendar,
  Printer
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/Card';
import { StockAuditVoucher } from '@/types/stock';
import { Product } from '@/types/product';
import { StockAuditForm } from '@/components/form/stock/StockAuditForm';

interface Props {
  localProducts: Product[];
}

export default function StockCheck({ localProducts }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'balanced' | 'cancelled'>('all');
  const [isAuditFormOpen, setIsAuditFormOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState('Tất cả');
  const [audits, setAudits] = useState<StockAuditVoucher[]>(() => {
    const saved = localStorage.getItem('retail_audits');
    return saved ? JSON.parse(saved) : [];
  });

  const filteredAudits = audits.filter(a => {
    if (filter === 'Phiếu tạm') return a.status === 'draft';
    if (filter === 'Đã cân bằng') return a.status === 'balanced';
    if (filter === 'Đã hủy') return a.status === 'cancelled';
    return true;
  });

  const breadcrumbItems = useMemo(() => (isAuditFormOpen ? [
    { label: 'KHO HÀNG', href: '#' },
    { label: 'KIỂM KHO', href: '#', onClick: () => setIsAuditFormOpen(false) },
    { label: 'Tạo phiếu kiểm', href: '#' }
  ] : [
    { label: 'KHO HÀNG', href: '#' },
    { label: 'KIỂM KHO', href: '#' }
  ]), [isAuditFormOpen]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Hoàn thành</span>;
      case 'draft': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Phiếu tạm</span>;
      case 'cancelled': return <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Đã hủy</span>;
      default: return null;
    }
  };

  const handleAddAudit = () => {
    setIsAuditFormOpen(true);
  };

  const handleCancelAudit = () => {
    setIsAuditFormOpen(false);
  };

  const renderStockDisposalForm = () => {
    if (!isAuditFormOpen) return null;
    return (
      <StockAuditForm
        onCancel={handleCancelAudit}
        onSave={handleAddAudit}
        products={localProducts}
      />
    );
  };

  return (
    <div className="pb-32 animate-fade-in space-y-8 min-h-full relative font-sans">
      <Breadcrumb
        items={breadcrumbItems}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
              INVENTORY MANAGEMENT
            </span>
            <Zap size={12} className='text-amber-500 animate-pulse' />
          </div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
            Phiếu <span className="text-emerald-600 font-black">Kiểm kho</span>
          </h2>
        </div>

        {!isAuditFormOpen && <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white/5 dark:bg-slate-800/40 text-slate-400 border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95">
            <Download size={18} />
            Xuất file
          </button>
          <Button onClick={handleAddAudit} className="h-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 font-black text-xs px-6 uppercase tracking-wider" icon={<Plus size={20} />}>
            TẠO PHIẾU KIỂM KHO
          </Button>
        </div>}
      </div>

      {!isAuditFormOpen && (
        <Fragment>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Theo mã phiếu kiểm..."
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-slate-200 placeholder-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-white/5 scrollbar-hide overflow-x-auto w-full md:w-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                  activeTab === 'all'
                    ? "bg-primary text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                  activeTab === 'draft'
                    ? "bg-primary text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                Phiếu tạm
              </button>
              <button
                onClick={() => setActiveTab('balanced')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                  activeTab === 'balanced'
                    ? "bg-primary text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                Đã cân bằng
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                  activeTab === 'cancelled'
                    ? "bg-primary text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                Đã hủy
              </button>
            </div>
          </div>

          <Card noPadding className="overflow-hidden shadow-xl bg-white dark:bg-slate-900 rounded-[32px] border-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="px-8 py-6 w-12">
                      <div className="w-4 h-4 rounded border-2 border-slate-700"></div>
                    </th>
                    <th className="px-6 py-6">Mã kiểm kho</th>
                    <th className="px-6 py-6">Thời gian</th>
                    <th className="px-6 py-6 text-center">Số lượng thực tế</th>
                    <th className="px-6 py-6 text-center">Tổng chênh lệch</th>
                    <th className="px-8 py-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredAudits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                            <SearchX size={40} className="text-slate-400" />
                          </div>
                          <p className="text-sm font-bold italic text-slate-400">Chưa có phiếu kiểm kho nào được tạo</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAudits.map((audit) => (
                      <Fragment key={audit.id}>
                        <tr
                          className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all cursor-pointer ${expandedId === audit.id ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}
                          onClick={() => setExpandedId(expandedId === audit.id ? null : audit.id)}
                        >
                          <td className="px-8 py-5 text-center"><input type="checkbox" onClick={e => e.stopPropagation()} className="rounded-md border-slate-300 text-primary focus:ring-primary" /></td>
                          <td className="px-6 py-5 font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                            {audit.code}
                          </td>
                          <td className="px-6 py-5 text-center text-sm font-bold text-slate-500">
                            {audit.createdAt}
                          </td>
                          <td className="px-6 py-5 text-center font-black text-slate-800 dark:text-slate-100">
                            {audit.totalActual}
                          </td>
                          <td className={`px-6 py-5 text-center font-black ${audit.totalVarianceQty > 0 ? 'text-emerald-500' : audit.totalVarianceQty < 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                            {audit.totalVarianceQty > 0 ? '+' : ''}{audit.totalVarianceQty}
                          </td>
                          <td className="px-6 py-5 text-right pr-8">
                            <button className="p-2 text-slate-300 hover:text-emerald-500"><ArrowUpRight size={18} /></button>
                          </td>
                        </tr>

                        {expandedId === audit.id && (
                          <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-x-2 border-emerald-500 animate-slide-up">
                            <td colSpan={6} className="px-12 py-10">
                              <div className="space-y-8">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <h3 className="text-2xl font-black dark:text-white">{audit.code}</h3>
                                      {getStatusBadge(audit.status)}
                                    </div>
                                    <div className="flex gap-6 text-xs font-bold text-slate-500">
                                      <p className="flex items-center gap-1.5"><User size={14} /> Người tạo: {audit.creator}</p>
                                      <p className="flex items-center gap-1.5"><Calendar size={14} /> Ngày cân bằng: {audit.balanceDate || '--/--/----'}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-3">
                                    <Button size="sm" variant="outline" className="h-10 rounded-xl" icon={<Download size={14} />}>Xuất file</Button>
                                    <Button size="sm" variant="outline" className="h-10 rounded-xl" icon={<Printer size={14} />}>In phiếu</Button>
                                  </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
                                  <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-700 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                      <tr>
                                        <th className="px-6 py-4">Sản phẩm</th>
                                        <th className="px-6 py-4 text-center">Tồn kho</th>
                                        <th className="px-6 py-4 text-center">Thực tế</th>
                                        <th className="px-6 py-4 text-center">SL Lệch</th>
                                        <th className="px-6 py-4 text-right pr-8">Giá trị lệch</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y border-t border-slate-100 dark:border-slate-700 dark:divide-slate-700">
                                      {audit.items.map((item, idx) => (
                                        <tr key={idx} className="text-sm">
                                          <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800 dark:text-slate-100">{item.productName}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.productId}</p>
                                          </td>
                                          <td className="px-6 py-4 text-center font-medium text-slate-500">{item.systemStock}</td>
                                          <td className="px-6 py-4 text-center font-black text-slate-800 dark:text-slate-200">{item.actualStock}</td>
                                          <td className={`px-6 py-4 text-center font-black ${item.varianceQty > 0 ? 'text-emerald-500' : item.varianceQty < 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                                            {item.varianceQty > 0 ? '+' : ''}{item.varianceQty}
                                          </td>
                                          <td className="px-6 py-4 text-right pr-8 font-black text-slate-700 dark:text-slate-300">
                                            {item.varianceValue.toLocaleString()}đ
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                  <Card className="p-4 bg-white dark:bg-slate-800">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng thực tế</p>
                                    <p className="text-lg font-black text-slate-800 dark:text-white">{audit.totalActual}</p>
                                  </Card>
                                  <Card className="p-4 bg-white dark:bg-slate-800">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng lệch tăng</p>
                                    <p className="text-lg font-black text-emerald-500">+{audit.items.filter(i => i.varianceQty > 0).reduce((s, i) => s + i.varianceQty, 0)}</p>
                                  </Card>
                                  <Card className="p-4 bg-white dark:bg-slate-800">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng lệch giảm</p>
                                    <p className="text-lg font-black text-rose-500">{audit.items.filter(i => i.varianceQty < 0).reduce((s, i) => s + i.varianceQty, 0)}</p>
                                  </Card>
                                  <Card className="p-4 bg-emerald-600 border-emerald-600 text-white">
                                    <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">Tổng giá trị lệch</p>
                                    <p className="text-lg font-black">{audit.totalVarianceValue.toLocaleString()}đ</p>
                                  </Card>
                                </div>
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
        </Fragment>
      )}
      {renderStockDisposalForm()}
    </div>
  );
}
