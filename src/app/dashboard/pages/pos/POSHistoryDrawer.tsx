
import React, { useState, useMemo } from 'react';
import {
  X, History, Receipt, ChevronRight, Search,
  Store, Truck, Ticket, Percent,
  MapPin, Phone, User, Box, Printer
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { B2COrder } from '@/types/b2corder';
import { createPortal } from 'react-dom';

interface POSHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: B2COrder[];
  onViewDetail: (order: B2COrder) => void;
}

export const POSHistoryDrawer: React.FC<POSHistoryDrawerProps> = ({
  isOpen, onClose, history, onViewDetail
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'all' | 'pickup' | 'delivery'>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const filteredHistory = useMemo(() => {
    return history.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

      const orderFulfillment = parseInt(order.id.split('-')[1]) % 2 === 0 ? 'pickup' : 'delivery';
      const matchesFulfillment = fulfillmentFilter === 'all' || orderFulfillment === fulfillmentFilter;

      return matchesSearch && matchesFulfillment;
    });
  }, [history, searchQuery, fulfillmentFilter]);

  const renderOrderDetailModal = () => {
    if (!selectedOrder) return null;
    const isDelivery = parseInt(selectedOrder.id.split('-')[1]) % 2 !== 0;

    // Giả lập dữ liệu bổ sung cho lịch sử
    const mockPromo = isDelivery ? { code: 'FS2024', name: 'Miễn phí vận chuyển' } : { code: 'SUMMER50', name: 'Hè rực rỡ -50k' };
    const mockShippingFee = isDelivery ? 30000 : 0;
    const mockDiscount = 50000;

    const modalContent = (
      <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 md:p-8 animate-fade-in">
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
        <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl animate-slide-up flex flex-col border dark:border-slate-800">

          {/* Header */}
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                <Receipt size={28} className="text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Chi tiết đơn hàng</p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${isDelivery ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {isDelivery ? 'Giao hàng' : 'Tại quầy'}
                  </span>
                </div>
                <h3 className="text-2xl font-black">{selectedOrder.id}</h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"><Printer size={20} /></button>
              <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-white/10 rounded-xl transition-all"><X size={24} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Cột 1: Khách hàng */}
              <Card className="p-6 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User size={14} /> Khách hàng</h4>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-lg">{selectedOrder.customer.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-slate-500">
                    <Phone size={14} />
                    <span className="text-sm font-medium">{selectedOrder.customer.phone}</span>
                  </div>
                </div>
                <div className="pt-4 border-t dark:border-slate-800 flex items-start gap-2">
                  <MapPin size={14} className="text-emerald-500 mt-1 shrink-0" />
                  <p className="text-xs text-slate-400 italic leading-relaxed">{selectedOrder.customer.address || 'Tại quầy'}</p>
                </div>
              </Card>

              {/* Cột 2: Hình thức & Vận chuyển */}
              <Card className="p-6 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  {isDelivery ? <Truck size={14} /> : <Store size={14} />} Hình thức mua hàng
                </h4>
                <div className={`p-4 rounded-2xl flex items-center gap-4 ${isDelivery ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600' : 'bg-amber-50 dark:bg-amber-900/10 text-amber-600'}`}>
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                    {isDelivery ? <Truck size={20} /> : <Store size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase">{isDelivery ? 'Giao hàng tận nơi' : 'Nhận tại quầy'}</p>
                    <p className="text-[10px] opacity-70 font-bold">Thanh toán: Tiền mặt</p>
                  </div>
                </div>
                {isDelivery && (
                  <div className="pt-4 space-y-2 border-t dark:border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Đối tác:</span>
                      <span className="text-xs font-black text-blue-600">GHTK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Mã vận đơn:</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tighter">GHTK9928112</span>
                    </div>
                  </div>
                )}
              </Card>

              {/* Cột 3: Khuyến mãi & Chiết khấu */}
              <Card className="p-6 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Ticket size={14} /> Ưu đãi & Giảm giá</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Ticket size={14} className="text-amber-500" />
                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">{mockPromo.code}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600">{mockPromo.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Percent size={14} className="text-primary" />
                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">Chiết khấu trực tiếp</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary">-{mockDiscount.toLocaleString()}đ</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase">
                  <tr>
                    <th className="px-8 py-5">Sản phẩm</th>
                    <th className="px-6 py-5 text-center">Số lượng</th>
                    <th className="px-6 py-5 text-right">Đơn giá</th>
                    <th className="px-8 py-5 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100">{item.name}</p>
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">{item.variant}</span>
                      </td>
                      <td className="px-6 py-5 text-center text-xs font-black">x{item.qty}</td>
                      <td className="px-6 py-5 text-right text-xs text-slate-500">{item.price.toLocaleString()}đ</td>
                      <td className="px-8 py-5 text-right text-sm font-black text-emerald-600">{(item.price * item.qty).toLocaleString()}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-8 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shrink-0">
            <div className="flex gap-12">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tổng tiền hàng</p>
                <p className="text-xl font-black text-slate-800 dark:text-white">{(selectedOrder.total + mockDiscount - mockShippingFee).toLocaleString()}đ</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Chi phí / Giảm giá</p>
                <p className="text-xl font-black text-rose-500">-{mockDiscount.toLocaleString()}đ</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tổng cộng</p>
                <p className="text-3xl font-black text-emerald-600">{selectedOrder.total.toLocaleString()}đ</p>
              </div>
            </div>
            <Button className="px-10 rounded-2xl" onClick={() => setSelectedOrder(null)}>Đóng</Button>
          </div>
        </div>
      </div>
    );
    const modalRoot = document.getElementById('modal-root');
    return modalRoot ? createPortal(modalContent, modalRoot) : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10600] flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl animate-slide-left flex flex-col">
        {/* Top Header */}
        <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between bg-emerald-600 text-white shrink-0">
          <div className="flex items-center gap-3">
            <History size={24} />
            <h3 className="text-lg font-black uppercase tracking-tight">Lịch sử đơn hàng</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 space-y-4 shrink-0 bg-slate-50 dark:bg-slate-950/40">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã đơn, tên khách hàng..."
              className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFulfillmentFilter('all')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${fulfillmentFilter === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400'}`}
            >Tất cả</button>
            <button
              onClick={() => setFulfillmentFilter('pickup')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${fulfillmentFilter === 'pickup' ? 'bg-amber-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400'}`}
            >Tại quầy</button>
            <button
              onClick={() => setFulfillmentFilter('delivery')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${fulfillmentFilter === 'delivery' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400'}`}
            >Giao hàng</button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {filteredHistory.map(order => {
            const isDelivery = parseInt(order.id.split('-')[1]) % 2 !== 0;
            return (
              <Card
                key={order.id}
                className="group p-5 border-transparent hover:border-emerald-500/50 transition-all cursor-pointer bg-white dark:bg-slate-800 shadow-sm relative overflow-hidden"
                onClick={() => setSelectedOrder(order)}
              >
                <div className={`absolute top-0 right-0 w-1.5 h-full ${isDelivery ? 'bg-blue-500' : 'bg-amber-500'}`} />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{order.id}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase ${isDelivery ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                        {isDelivery ? 'Vận chuyển' : 'Tại quầy'}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">{order.date}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                    <User size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{order.customer.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{order.customer.phone}</p>
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-slate-700 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Box size={14} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{order.items.length} mặt hàng</span>
                  </div>
                  <span className="text-lg font-black text-emerald-600">{order.total.toLocaleString()}đ</span>
                </div>
              </Card>
            );
          })}

          {filteredHistory.length === 0 && (
            <div className="py-20 text-center opacity-20">
              <History size={64} className="mx-auto mb-4" />
              <p className="text-sm font-black uppercase">Không tìm thấy đơn hàng</p>
            </div>
          )}
        </div>

        {renderOrderDetailModal()}
      </div>
    </div>
  );
};
