'use client';

import { Fragment, useState, useMemo } from 'react';
import {
  Zap,
  Search,
  User,
  Store,
  Eye,
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { B2COrder } from '@/types/order';
import { useOrders } from '@/hooks';
import { orderService } from '@/lib/api/medusa/orderService';
import { formatCurrency, formatRelativeTime, formatTime, mapMedusaToB2C } from '@/lib/utils';
import { TableView } from '@/components/TableView';
import { OrderDetail } from '@/components/order/OrderDetail';
import { SalesChannelsFilter } from '@/components/filters/SalesChannels';
import { SearchFilter } from '@/components/filters/Search';

export default function RetailOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<B2COrder | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("all");
  const limit = 10;
  const handleSelectOrder = async (orderSummary: B2COrder & { rawId?: string }) => {
    setSelectedOrder(orderSummary);

    if (orderSummary.rawId) {
      setIsDetailLoading(true);
      try {
        const { order } = await orderService.getOrder(orderSummary.rawId);
        setSelectedOrder(prev => {
          if (prev && prev.id === orderSummary.id) {
            return mapMedusaToB2C(order);
          }
          return prev;
        });
      } catch (err) {
        console.error("Failed to fetch order detail:", err);
      } finally {
        setIsDetailLoading(false);
      }
    }
  };

  const orderQuery = useMemo(() => ({
    q: searchTerm || undefined,
    fields: "+sales_channel.*,+customer.*",
    offset: (currentPage - 1) * limit,
    limit,
    sales_channel_id: selectedChannelId === "all" ? undefined : [selectedChannelId],
  }), [searchTerm, currentPage, selectedChannelId]);

  const { orders: medusaOrders, loading, count } = useOrders(orderQuery);

  const b2cHistory: (B2COrder & { rawId?: string })[] = useMemo(() => {
    return medusaOrders.length > 0 ? medusaOrders.map((order: any) => ({
      ...mapMedusaToB2C(order),
      rawId: order.id
    })) : [];
  }, [medusaOrders]);

  const columns = [
    {
      title: 'Mã đơn hàng',
      className: "pl-8"
    },
    {
      title: 'Khách hàng',
    },
    {
      title: 'Thời gian',
      className: "text-center"
    },
    {
      title: 'Kênh bán',
    },
    {
      title: 'Số lượng mặt hàng',
    },
    {
      title: 'Tổng tiền',
    },
    {
      title: 'Chi tiết',
      className: "pr-8 text-right"
    },
  ]

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChannelSelect = (id: string) => {
    setSelectedChannelId(id);
    setCurrentPage(1);
  }

  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
        <Breadcrumb
          items={[
            { label: 'KHO HÀNG', href: '#' },
            { label: 'ĐƠN HÀNG', href: '#' }
          ]}
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
              Quản lý <span className="text-emerald-600 font-black">Đơn hàng</span>
            </h2>
          </div>
        </div>

        <Card className='flex flex-col xl:flex-row gap-4'>
          <SearchFilter
            searchTerm={searchTerm}
            handleSearchChange={setSearchTerm}
            placeholder="Tìm mã đơn hàng, khách hàng..."
          />
          <SalesChannelsFilter
            selectedChannelId={selectedChannelId}
            handleChannelSelect={handleChannelSelect}
          />
        </Card>

        <TableView<B2COrder & { rawId?: string }>
          columns={columns}
          data={b2cHistory}
          isLoading={loading}
          emptyMessage={{
            title: "Không tìm thấy đơn hàng",
            description: "Vui lòng thử tìm kiếm với từ khóa khác",
          }}
          pagination={{
            currentPage,
            totalPages: Math.ceil(count / limit),
            onPageChange: handlePageChange,
            totalItems: count,
            itemsPerPage: limit
          }}
          renderRow={(item) => {
            return (
              <tr
                key={item.id}
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-none text-xs"
                onClick={() => handleSelectOrder(item)}
              >
                <td className='py-5 px-4 pl-8 text-slate-700 dark:text-slate-200 font-bold'>{item.id}</td>
                <td className='py-5 px-4 text-slate-700 dark:text-slate-200'>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <User size={16} />
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{item.customer.name}</span>
                  </div>
                </td>
                <td className='py-5 px-4'>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{formatRelativeTime(item.date)}</span>
                    <span className="text-[10px] font-medium text-slate-400 mt-0.5">{formatTime(item.date)}</span>
                  </div>
                </td>
                <td className='py-5 px-4 text-slate-700 dark:text-slate-200'>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter border dark:border-slate-700">
                    <Store size={12} className='text-emerald-500' />
                    {item.sales_channel}
                  </div>
                </td>
                <td className='py-5 px-4 text-slate-700 dark:text-slate-200'>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    {item.items.length} SP
                  </span>
                </td>
                <td className='py-5 px-4 text-slate-700 dark:text-slate-200'>
                  <span className="text-base font-black text-emerald-600">
                    {formatCurrency(item.total)}
                  </span>
                </td>
                <td className='py-5 px-4 text-right text-slate-700 dark:text-slate-200'>
                  <button className='p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-300 group-hover:text-emerald-500 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all shadow-sm' onClick={() => handleSelectOrder(item)}>
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            )
          }}
        />
      </div>
      <OrderDetail
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        isDetailLoading={isDetailLoading}
      />
    </Fragment>
  );
}
