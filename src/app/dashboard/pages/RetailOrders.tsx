'use client';

import { Fragment, useState } from 'react';
import {
  Zap,
  Search,
  Filter,
  ArrowUpDown,
  User,
  Package,
  ArrowUpRight,
  Calendar,
  Receipt,
  Printer,
  X,
  Building2,
  Box,
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { B2COrder } from '@/types/order';
import { MOCK_B2C_HISTORY } from '../../../../mocks/order';
import { Button } from '@/components/Button';

export default function RetailOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<B2COrder | null>(null);

  const [b2cHistory, setB2cHistory] = useState<B2COrder[]>(MOCK_B2C_HISTORY);

  const renderDetails = () => {
    if (!selectedOrder) return null;
    const order = selectedOrder;
    return (
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title=''
        maxWidth='5xl'
        maxHeight='85vh'
      >
        <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl animate-slide-up flex flex-col border dark:border-slate-800">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                <Receipt size={28} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Chi tiết đơn hàng POS</p>
                <h3 className="text-xl font-black">{order.id}</h3>
              </div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all">
              <X size={28} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card className="p-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={14} /> Khách hàng</h4>
                <p className="font-bold text-slate-800 dark:text-white">{order.customer.name}</p>
                <p className="text-sm text-slate-500 mt-1">{order.customer.phone}</p>
                <p className="text-xs text-slate-400 mt-2 italic">{order.customer.address}</p>
              </Card>
              <Card className="p-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={14} /> Giao dịch</h4>
                <p className="font-bold text-slate-800 dark:text-white">{order.date}</p>
                <p className="text-sm text-emerald-600 font-bold mt-1 uppercase tracking-tighter">Hoàn tất • Tiền mặt</p>
              </Card>
            </div>
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase">
                  <tr>
                    <th className="px-6 py-4">Sản phẩm</th>
                    <th className="px-6 py-4 text-center">SL</th>
                    <th className="px-6 py-4 text-right">Đơn giá</th>
                    <th className="px-6 py-4 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.name}</p>
                        <div className="flex gap-1.5 mt-1">
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/50">{item.variant}</span>
                          {item.tech_specs && <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border dark:border-slate-700">{item.tech_specs}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-xs font-black">x{item.qty}</td>
                      <td className="px-6 py-4 text-right text-xs text-slate-500">{item.price.toLocaleString()}đ</td>
                      <td className="px-6 py-4 text-right text-sm font-black text-emerald-600">{(item.price * item.qty).toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-8 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shrink-0">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tổng thanh toán</p>
              <p className="text-3xl font-black text-emerald-600">{order.total.toLocaleString()}đ</p>
            </div>
            <Button className="px-10 rounded-2xl" onClick={() => setSelectedOrder(null)}>Đóng</Button>
          </div>
        </div>
      </Modal>
    )
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
              Đơn hàng <span className="text-emerald-600 font-black">Đơn hàng</span>
            </h2>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Tìm mã đơn hàng, khách hàng..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-sm dark:text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <Filter size={16} className="text-emerald-500" />
            Bộ lọc
          </button>
          <button className="flex items-center gap-2 px-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <ArrowUpDown size={16} className="text-emerald-500" />
            Mới nhất
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {b2cHistory.map((order) => (
            <Card
              key={order.id}
              className="group cursor-pointer hover:border-primary transition-all p-6 bg-white dark:bg-slate-900 rounded-[32px]"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shadow-inner">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg tracking-tight">{order.id}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{order.date}</p>
                  </div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowUpRight size={18} />
                </div>
              </div>
              <div className="space-y-3 mb-6 text-sm font-bold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-3"><User size={14} className="text-slate-400" /> {order.customer.name}</div>
                <div className="flex items-center gap-3"><Box size={14} className="text-slate-400" /> {order.items.length} mặt hàng</div>
              </div>
              <div className="pt-4 border-t dark:border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng cộng</span>
                <span className="text-xl font-black text-primary">{order.total.toLocaleString()}đ</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {renderDetails()}
    </Fragment>
  );
}
