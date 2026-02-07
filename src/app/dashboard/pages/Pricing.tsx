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
import { PriceListForm } from '@/components/form/pricelist/PriceListForm';
import { SearchFilter } from '@/components/filters/Search';
import { usePriceList } from '@/hooks/medusa/usePriceList';
import { formatDate } from '@/lib/utils';
import { Empty } from '@/components/Empty';
import { useToast } from '@/contexts/ToastContext';
import { priceListService } from '@/lib/api/medusa/priceListService';
import { useCustomerGroups } from '@/hooks/medusa/useCustomerGroups';


export default function Pricing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPriceListFormOpen, setIsPriceListFormOpen] = useState<boolean>(false);
  const { priceLists, loading, error, fetchPriceLists, deletePriceList } = usePriceList();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { customerGroups } = useCustomerGroups({
    fields: "id,name",
  });

  const handleSavePriceList = async (data: any) => {
    setIsSaving(true);
    try {
      await priceListService.createPriceList(data);
      showToast('Tạo bảng giá thành công', 'success');
      setIsPriceListFormOpen(false);
      fetchPriceLists();
    } catch (err: any) {
      console.error('Failed to create price list:', err);
      showToast(err.message || 'Không thể tạo bảng giá', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isPriceListFormOpen) {
    return (
      <PriceListForm
        onCancel={() => setIsPriceListFormOpen(false)}
        onSave={handleSavePriceList}
        isLoading={isSaving}
      />
    );
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

      <Card className='flex xl:flex-row flex-col gap-4'>
        <SearchFilter
          placeholder="Tìm theo tiêu đề bảng giá..."
          searchTerm={searchTerm}
          handleSearchChange={setSearchTerm}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {priceLists.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Empty title="Không tìm thấy bảng giá nào" description="" />
          </div>
        ) : (
          priceLists.map(pl => {
            const grps = customerGroups.map(cg => {
              if (pl.rules[`customer.groups.id`].includes(cg.id)) {
                return cg.name;
              }
            }).join(",");
            return (
              <Card key={pl.id} className="p-6 bg-white dark:bg-slate-900 hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-emerald-500/30 group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${pl.type === 'sale' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Tag size={20} />
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${pl.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {pl.status === 'active' ? 'Hoạt động' : 'Nháp'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{pl.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">{pl.description}</p>
                <div className="pt-6 border-t dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-2 uppercase tracking-tighter"><Package size={14} /> {0} Sản phẩm</span>
                    <span className="flex items-center gap-2 uppercase tracking-tighter"><Calendar size={14} /> {formatDate(pl.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Users size={14} className="text-emerald-500" />
                    <span className="uppercase tracking-tighter">Nhóm: {grps}</span>
                  </div>
                </div>
              </Card>
            )
          }))}
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
