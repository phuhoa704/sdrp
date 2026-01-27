
import React, { useState } from 'react';
import {
  ClipboardList, ArrowUpDown, Building2, X, User, CheckCircle2, Box,
  DollarSign, TrendingUp, Wallet, Clock, ChevronRight
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { createPortal } from 'react-dom';

export const MarketplaceAffiliateHistory: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const mockAffiliateHistory = [
    {
      id: "AFF-2024-001",
      date: "Hôm nay, 14:30",
      retailer: "Đại lý Anh Bửu",
      totalOrder: 25000000,
      commission: 1250000,
      status: 'pending',
      items: [{ name: 'SuperKill 500WP', qty: 20, price: 150000 }],
      commissionRate: "5%"
    },
    {
      id: "AFF-2024-002",
      date: "Hôm qua, 09:15",
      retailer: "Đại lý Năm Hữu",
      totalOrder: 18200000,
      commission: 910000,
      status: 'paid',
      items: [{ name: 'FungiGone 200SC', qty: 15, price: 210000 }],
      commissionRate: "5%"
    }
  ];

  const renderModal = () => {
    if (!selectedOrder) return null;

    const modalContent = (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-10 animate-fade-in pointer-events-auto">
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setSelectedOrder(null)} />
        <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl animate-slide-up flex flex-col border dark:border-slate-800">
          <div className="p-8 bg-blue-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                <DollarSign size={32} className="text-blue-300" />
              </div>
              <div>
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Chi tiết Đơn Affiliate (Seller)</p>
                <h3 className="text-2xl font-black">{selectedOrder.id}</h3>
              </div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"><X size={32} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 no-scrollbar bg-slate-50/30 dark:bg-slate-950/20 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 border-none shadow-sm bg-white dark:bg-slate-800">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={14} /> Retailer mua hàng</h4>
                <p className="font-bold text-slate-800 dark:text-white text-lg">{selectedOrder.retailer}</p>
                <p className="text-sm text-slate-500 mt-1">Hỗ trợ chốt đơn qua SD-AI</p>
              </Card>
              <Card className="p-6 border-none shadow-sm bg-white dark:bg-slate-800">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Box size={14} /> Giá trị đơn hàng</h4>
                <p className="font-bold text-slate-800 dark:text-white text-lg">{selectedOrder.totalOrder.toLocaleString()}đ</p>
                <p className="text-xs text-blue-500 font-bold mt-1 uppercase">Đã xác nhận thanh toán</p>
              </Card>
              <Card className="p-6 border-none shadow-sm bg-blue-600 text-white">
                <h4 className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp size={14} /> Hoa hồng dự kiến</h4>
                <p className="font-black text-2xl">{selectedOrder.commission.toLocaleString()}đ</p>
                <p className="text-xs opacity-80 font-bold mt-1 uppercase">Tỉ lệ chiết khấu: {selectedOrder.commissionRate}</p>
              </Card>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Danh sách sản phẩm trong đơn</h4>
              <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border dark:border-slate-800 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-black text-slate-400 uppercase">
                    <tr>
                      <th className="px-8 py-5">Tên sản phẩm</th>
                      <th className="px-6 py-5 text-center">Số lượng sỉ</th>
                      <th className="px-8 py-5 text-right">Hoa hồng SP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-8 py-5">
                          <p className="font-bold text-slate-800 dark:text-white">{item.name}</p>
                        </td>
                        <td className="px-6 py-5 text-center font-black text-slate-600 dark:text-slate-400">x{item.qty} Thùng</td>
                        <td className="px-8 py-5 text-right font-black text-blue-600">{(selectedOrder.commission / selectedOrder.items.length).toLocaleString()}đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="p-10 border-t dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trạng thái thanh toán AFF</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${selectedOrder.status === 'paid' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
                <span className="text-sm font-black uppercase tracking-tighter text-slate-700 dark:text-slate-200">
                  {selectedOrder.status === 'paid' ? 'Đã thanh toán hoa hồng' : 'Đang xử lý đối soát'}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" className="px-8 rounded-2xl h-14" onClick={() => setSelectedOrder(null)}>Quay lại</Button>
              <Button className="px-10 rounded-2xl h-14 bg-blue-600 shadow-xl shadow-blue-500/20" icon={<CheckCircle2 size={20} />} onClick={() => setSelectedOrder(null)}>Đã Hiểu</Button>
            </div>
          </div>
        </div>
      </div>
    );
    const modalRoot = document.getElementById('modal-root');
    return modalRoot ? createPortal(modalContent, modalRoot) : null;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 bg-blue-600 text-white border-none shadow-xl rounded-[40px] flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center">
            <Wallet size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Ví hoa hồng sỉ</p>
            <h3 className="text-2xl font-black">2.160.000đ</h3>
            <p className="text-[10px] font-bold mt-1 flex items-center gap-1 opacity-80"><TrendingUp size={12} /> +15% so với tháng trước</p>
          </div>
        </Card>
        <Card className="p-8 bg-white dark:bg-slate-900 border-none shadow-lg rounded-[40px] flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-[24px] flex items-center justify-center">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đơn thành công</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">12 Đơn</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Đã đối soát xong</p>
          </div>
        </Card>
        <Card className="p-8 bg-white dark:bg-slate-900 border-none shadow-lg rounded-[40px] flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-[24px] flex items-center justify-center">
            {/* Fix: Added Clock import above */}
            <Clock size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đang chờ xử lý</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">3 Đơn</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Chờ công ty phê duyệt</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
            <ClipboardList size={18} className="text-blue-600" /> Danh sách đơn Affiliate của bạn
          </h3>
          <button className="h-10 px-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase shadow-sm">
            <ArrowUpDown size={14} /> Sắp xếp theo ngày
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAffiliateHistory.map((order) => (
            <Card
              key={order.id}
              className="p-6 border-none shadow-lg bg-white dark:bg-slate-900 hover:shadow-2xl transition-all cursor-pointer group"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-black text-slate-800 dark:text-white">{order.id}</span>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${order.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'}`}>
                      {order.status === 'paid' ? 'Đã chi trả' : 'Đang xử lý'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building2 size={14} />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{order.retailer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-blue-600">+{order.commission.toLocaleString()}đ</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{order.date}</p>
                </div>
              </div>
              <div className="pt-4 border-t dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                  <Box size={14} />
                  {order.items.length} Mã hàng sỉ
                </div>
                {/* Fix: Added ChevronRight import above */}
                <button className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 group-hover:gap-2 transition-all">Chi tiết <ChevronRight size={14} /></button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {renderModal()}
    </div>
  );
};
