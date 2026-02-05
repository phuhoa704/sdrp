import React from 'react'
import { B2COrder, OrderStatus } from '@/types/order'
import { Modal } from '../Modal';
import { Calendar, Loader2, Receipt, User, X } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { TableView } from '../TableView';
import { formatRelativeTime, formatTime } from '@/lib/utils';

interface OrderDetailProps {
  order: B2COrder | null;
  onClose: () => void;
  isDetailLoading: boolean;
}

export const OrderDetail = ({ order, onClose, isDetailLoading }: OrderDetailProps) => {
  if (!order) return null;
  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title=''
      maxWidth='5xl'
      maxHeight='85vh'
    >
      <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 overflow-hidden shadow-2xl animate-slide-up flex flex-col border dark:border-slate-800">
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
              <Receipt size={28} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest flex items-center gap-2">
                Chi tiết đơn hàng POS
                {isDetailLoading && <Loader2 size={10} className="animate-spin text-emerald-400" />}
              </p>
              <h3 className="text-xl font-black">{order.id}</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all">
            <X size={28} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={14} /> Khách hàng</h4>
              {isDetailLoading && !order.customer.name ? (
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse w-3/4" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse w-1/2" />
                </div>
              ) : (
                <>
                  <p className="font-bold text-slate-800 dark:text-white">{order.customer.name}</p>
                  <p className="text-sm text-slate-500 mt-1">{order.customer.phone}</p>
                  <p className="text-xs text-slate-400 mt-2 italic">{order.customer.address}</p>
                </>
              )}
            </Card>
            <Card className="p-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={14} /> Giao dịch</h4>
              <p className="">
                <span className="font-bold text-slate-800 dark:text-white">{formatRelativeTime(order.date)}</span>&nbsp;&nbsp;
                <span className="font-semibold text-sm text-slate-600">{formatTime(order.date)}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${order.status === OrderStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' :
                  order.status === OrderStatus.CANCELLED ? 'bg-rose-100 text-rose-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                  {order.status === OrderStatus.COMPLETED ? 'Hoàn tất' :
                    order.status === OrderStatus.CANCELLED ? 'Đã hủy' :
                      order.status === OrderStatus.PENDING ? 'Chờ xử lý' : order.status}
                </span>
              </div>
            </Card>
          </div>
          <TableView
            columns={[
              { title: "Sản phẩm", className: "" },
              { title: "SL", className: "text-center" },
              { title: "Đơn giá", className: "text-right" },
              { title: "Thành tiền", className: "text-right" },
            ]}
            data={order.items}
            emptyMessage={{
              title: "Không có sản phẩm",
              description: "Đơn hàng không có sản phẩm",
            }}
            renderRow={(item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.name}</p>
                  <div className="flex gap-1.5 mt-1">
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/50">{item.variant}</span>
                    {item.tech_specs && <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border dark:border-slate-700">{item.tech_specs}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-xs font-black text-slate-500 dark:text-white">x{item.qty}</td>
                <td className="px-6 py-4 text-right text-xs font-semibold text-slate-500">{item.price.toLocaleString()}đ</td>
                <td className="px-6 py-4 text-right text-sm font-black text-emerald-600">{(item.price * item.qty).toLocaleString()}đ</td>
              </tr>
            )}
          />
        </div>
        <div className="p-8 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shrink-0">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tổng thanh toán</p>
            <p className="text-3xl font-black text-emerald-600">{order.total.toLocaleString()}đ</p>
          </div>
          <Button className="px-10 rounded-2xl" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </Modal>
  )
}
