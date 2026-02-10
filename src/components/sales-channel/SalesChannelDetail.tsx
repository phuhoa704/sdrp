import React, { useState } from 'react';
import { SalesChannel } from '@/types/sales-channel';
import { Breadcrumb, Button, Card } from '@/components';
import {
  Plus, Search, Filter, MoreHorizontal,
  ChevronLeft, Info, Package, Database, Code,
  Edit3, Trash2, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/medusa/useProducts';
import { TableView } from '@/components/TableView';
import { ProductSelectionModal } from './ProductSelectionModal';
import { salesChannelService } from '@/lib/api/medusa/salesChannelService';
import { useToast } from '@/contexts/ToastContext';

interface SalesChannelDetailProps {
  salesChannel: SalesChannel;
  onBack: () => void;
  onEdit: (sc: SalesChannel) => void;
  onDelete: (sc: SalesChannel) => void;
  onRefresh: () => void;
}

export const SalesChannelDetail: React.FC<SalesChannelDetailProps> = ({
  salesChannel,
  onBack,
  onEdit,
  onDelete,
  onRefresh
}) => {
  const { showToast } = useToast();
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [productPage, setProductPage] = useState(1);
  const productLimit = 10;

  const { products, count, loading, refresh: refreshProducts } = useProducts({
    sales_channel_id: salesChannel.id,
    limit: productLimit,
    offset: (productPage - 1) * productLimit,
  });

  const handleAddProducts = async (productIds: string[]) => {
    setIsManaging(true);
    try {
      await salesChannelService.manageSalesChannelProducts(salesChannel.id, {
        add: productIds
      });
      showToast(`Đã thêm ${productIds.length} sản phẩm vào kênh`, 'success');
      setIsSelectModalOpen(false);
      refreshProducts();
    } catch (err: any) {
      showToast(err.message || 'Không thể thêm sản phẩm', 'error');
    } finally {
      setIsManaging(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <ChevronLeft size={20} className="text-slate-500" />
        </button>
        <Breadcrumb
          items={[
            { label: 'KÊNH BÁN HÀNG', href: '#' },
            { label: salesChannel.name.toUpperCase(), href: '#' }
          ]}
        />
      </div>

      {/* Main Info Card */}
      <Card noPadding className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900">
        <div className="p-8 border-b dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
              <Database size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">
                  {salesChannel.name}
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">
                    {salesChannel.is_disabled ? 'TẮT' : 'HOẠT ĐỘNG'}
                  </span>
                </div>
              </div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">ID: {salesChannel.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl border-slate-100 dark:border-slate-800"
              icon={<Edit3 size={16} />}
              onClick={() => onEdit(salesChannel)}
            >
              CHỈNH SỬA
            </Button>
            <button className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 border border-slate-100 dark:border-slate-800">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/20">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Info size={12} className="text-blue-500" /> MÔ TẢ KÊNH
          </p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {salesChannel.description || "Không có mô tả cho kênh bán hàng này."}
          </p>
        </div>
      </Card>

      {/* Products Section */}
      <Card noPadding className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 mt-8">
        <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase">SẢN PHẨM TRÊN KÊNH</h3>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-500">{count}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600"
              icon={<Plus size={18} />}
              onClick={() => setIsSelectModalOpen(true)}
            >
              THÊM SẢN PHẨM
            </Button>
          </div>
        </div>

        <div className="p-6 bg-slate-50/30 dark:bg-slate-800/10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                placeholder="Tìm kiếm sản phẩm trên kênh..."
              />
            </div>
            <button className="h-12 px-5 flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-600 dark:text-slate-400 hover:border-emerald-500/50 transition-all">
              <Filter size={16} />
              BỘ LỌC
            </button>
          </div>

          <TableView
            columns={[
              { title: "Sản phẩm" },
              { title: "Bộ sưu tập" },
              { title: "Kênh bán hàng" },
              { title: "Biến thể", className: "text-center" },
              { title: "Trạng thái", className: "text-center" },
              { title: "", className: "text-right" }
            ]}
            data={products}
            isLoading={loading}
            emptyMessage={{
              title: "Chưa có sản phẩm nào",
              description: "Kênh bán hàng này hiện chưa được liên kết với sản phẩm nào."
            }}
            pagination={{
              currentPage: productPage,
              totalPages: Math.ceil(count / productLimit),
              onPageChange: setProductPage,
              itemsPerPage: productLimit,
              totalItems: count
            }}
            renderRow={(product) => (
              <tr key={product.id} className="border-b border-slate-50 dark:border-slate-800 group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                <td className="py-5 px-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50">
                      <img src={product.thumbnail || '/placeholder.png'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 dark:text-white leading-tight mb-0.5">{product.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{product.handle}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    {product.collection?.title || "Mặc định"}
                  </span>
                </td>
                <td className="py-5 px-4">
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {product.sales_channels?.map((sc: any) => (
                      <span key={sc.id} className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded uppercase">
                        {sc.name}
                      </span>
                    )) || <span className="text-[9px] text-slate-400 italic">Trống</span>}
                  </div>
                </td>
                <td className="py-5 px-4 text-center">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {product.variants?.length || 0} variants
                  </span>
                </td>
                <td className="py-5 px-4 text-center">
                  <span className={cn(
                    "text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest",
                    product.status === 'published' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {product.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </td>
                <td className="py-5 px-4 text-right">
                  <button className="p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-emerald-500 shadow-sm">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            )}
          />
        </div>
      </Card>

      {/* Metadata & JSON Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card noPadding className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 group">
          <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <Code size={20} />
              </div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Metadata</h4>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {Object.keys(salesChannel.metadata || {}).length} KEYS
              </span>
            </div>
            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors cursor-pointer" />
          </div>
          <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 min-h-[100px] flex items-center justify-center">
            <p className="text-xs font-bold text-slate-400 uppercase italic">Không có dữ liệu metadata</p>
          </div>
        </Card>

        <Card noPadding className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 group">
          <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                <Package size={20} />
              </div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Dữ liệu JSON RAW</h4>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {Object.keys(salesChannel).length} KEYS
              </span>
            </div>
            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-amber-500 transition-colors cursor-pointer" />
          </div>
          <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 min-h-[100px] flex items-center justify-center">
            <p className="text-xs font-bold text-slate-400 uppercase italic">Xem chi tiết cấu hình JSON</p>
          </div>
        </Card>
      </div>

      <ProductSelectionModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        onSelect={handleAddProducts}
        alreadySelectedIds={products.map(p => p.id)}
        isLoading={isManaging}
      />
    </div>
  );
};
