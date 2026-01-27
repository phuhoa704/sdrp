'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Tag as TagIcon,
  Users,
  Package,
  Calendar,
  Info,
  MoreHorizontal,
  ChevronRight,
  SearchX,
  Tag
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { MOCK_PRICE_LISTS } from '../../../../mocks/pricing';
import { PriceListForm } from '@/components/form/pricelist/PriceListForm';
import { PriceList } from '@/types/price';


export default function Pricing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPriceListFormOpen, setIsPriceListFormOpen] = useState<boolean>(false);
  const [priceLists, setPriceLists] = useState<PriceList[]>(() => {
    const saved = localStorage.getItem('price_lists');
    return saved ? JSON.parse(saved) : MOCK_PRICE_LISTS;
  });

  const filtered = priceLists.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isPriceListFormOpen) {
    return <PriceListForm onCancel={() => setIsPriceListFormOpen(false)} onSave={(pl) => {
      setPriceLists([pl, ...priceLists]);
      setIsPriceListFormOpen(false);
    }} />;
  }

  return (
    <div className="pb-32 animate-fade-in space-y-8 min-h-full relative font-sans text-slate-200">
      <Breadcrumb
        items={[
          { label: 'BÁN HÀNG', href: '#' },
          { label: 'BẢNG GIÁ & KHUYẾN MÃI', href: '#' }
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
        <div className="shrink-0">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-3">
            Bảng Giá <span className="text-emerald-500 font-black">Hệ Thống</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-tight">Quản lý các quy tắc giá đặc biệt cho từng nhóm khách hàng và thời điểm.</p>
        </div>

        <Button onClick={() => setIsPriceListFormOpen(true)} className="h-14 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 font-black text-xs px-6 uppercase tracking-wider" icon={<Plus size={20} />}>
          TẠO BẢNG GIÁ MỚI
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề bảng giá..."
            className="w-full bg-slate-900/40 border border-white/5 rounded-[24px] py-4 pl-14 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-slate-200 placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="w-14 h-14 flex items-center justify-center bg-slate-900/40 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
          <Filter size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-30">
            <SearchX size={48} className="mx-auto mb-4" />
            <p className="font-bold italic">Không tìm thấy bảng giá nào...</p>
          </div>
        ) : (
          filtered.map(pl => (
            <Card key={pl.id} className="p-6 bg-white dark:bg-slate-900 hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-emerald-500/30 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${pl.type === 'discount' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Tag size={20} />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${pl.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {pl.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{pl.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">{pl.description}</p>
              <div className="pt-6 border-t dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                /* Fixed ReferenceError by importing Package above */
                  <span className="flex items-center gap-2 uppercase tracking-tighter"><Package size={14} /> {pl.itemCount} Sản phẩm</span>
                  <span className="flex items-center gap-2 uppercase tracking-tighter"><Calendar size={14} /> {pl.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Users size={14} className="text-emerald-500" />
                  <span className="uppercase tracking-tighter">Nhóm: Khách lẻ, VIP</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Card className="p-8 bg-blue-900/10 border-none shadow-xl flex items-center gap-6 group">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Info size={28} />
        </div>
        <div>
          <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight">Bảng giá là gì?</h4>
          <p className="text-xs font-bold text-slate-500 mt-1 italic">Bảng giá giúp bạn thiết lập các quy tắc giá ưu đãi cho một nhóm khách hàng hoặc một chiến dịch cụ thể trong thời gian giới hạn.</p>
        </div>
        <ChevronRight className="ml-auto text-blue-500/30 group-hover:text-blue-500 transition-all translate-x-0 group-hover:translate-x-2" size={24} />
      </Card>
    </div>
  );
}
