'use client';

import { Fragment, useState } from 'react';
import { ChevronRight, Zap, ArrowRight, ClipboardList, ArrowUpDown, Building2, Download, CheckCircle2, Box, CreditCard, MapPin, ExternalLink, Receipt, Printer, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';

interface Order {
  id: string;
  seller: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled' | "completed";
  items: { name: string; qty: number; price: number }[];
}

interface OrderHistoryProps {
  onGoToWholesale?: () => void;
}

export default function OrderHistory({ onGoToWholesale }: OrderHistoryProps) {
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  const mockHistory: Order[] = [
    { id: "ORD-9928", date: "Hôm nay, 10:20", seller: "NPP Hoàng Gia", total: 12500000, status: 'shipping', items: [{ name: 'SuperKill 500WP', qty: 10, price: 150000 }] },
    { id: "ORD-9845", date: "20/05/2024", seller: "NPP Hoàng Gia", total: 8200000, status: 'completed', items: [{ name: 'FungiGone 200SC', qty: 8, price: 210000 }] }
  ];

  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
        <Breadcrumb items={[{ label: 'MARKETPLACE', href: '/dashboard/marketplace' }, { label: 'LỊCH SỬ GIAO DỊCH', href: '/dashboard/order-history' }]} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">B2B MARKETPLACE</span>
              <Zap size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Chợ Sỉ <span className="text-emerald-600 font-black">SDRP</span>
            </h2>
          </div>
          <div className="shrink-0 flex gap-3">
            <button
              onClick={onGoToWholesale}
              className={cn(
                "rounded-2xl font-bold transition-all duration-300",
                "flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
                "tracking-wide h-12 uppercase text-[11px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100",
                "hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 shadow-smooth",
                "h-12 px-7 text-[11px]",
                "h-14 rounded-2xl px-6 font-black text-xs inner-border-glow"
              )}
            >
              <span className="shrink-0 opacity-90 transition-transform group-hover:scale-110">
                <ArrowRight size={20} />
              </span>
              <span className="relative z-10">VỀ GIAN HÀNG</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2 dark:text-slate-100">
              <ClipboardList size={18} className='text-[#22C55E]' />
              Lịch sử đơn sỉ
            </h3>
            <button className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-[#111827] dark:text-slate-100 shadow-sm">
              <ArrowUpDown className='text-[#22C55E]' size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockHistory.map((order) => (
              <Card
                key={order.id}
                className="border border-gray-50 dark:border-slate-800 hover:border-[#22C55E]/40 transition-all p-6 shadow-sm bg-white dark:bg-slate-900 cursor-pointer"
                onClick={() => setSelectedOrderDetails(order)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-base text-[#111827] dark:text-slate-100">{order.id}</span>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 animate-pulse'}`}>
                        {order.status === 'completed' ? 'Đã giao' : 'Vận chuyển'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Building2 size={16} />
                      <p className="text-sm font-bold text-[#111827] dark:text-slate-200">{order.seller}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#22C55E] text-xl">{order.total.toLocaleString()}đ</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">{order.date}</p>
                  </div>
                </div>
                <Button size="sm" variant="primary" fullWidth className="rounded-xl font-bold h-10 text-xs uppercase tracking-wider">Xem chi tiết đơn</Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={!!selectedOrderDetails}
        onClose={() => setSelectedOrderDetails(null)}
        title=''
        maxWidth='6xl'
        maxHeight='85vh'
      >
        <div className="p-8 md:p-10 bg-[#0f172a] text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-[28px] flex items-center justify-center border border-white/10 backdrop-blur-md shadow-2xl">
              <Receipt size={36} className="text-[#22C55E]" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <p className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em]">Đơn đặt hàng sỉ (Wholesale)</p>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${selectedOrderDetails?.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}>
                  {selectedOrderDetails?.status === 'completed' ? 'Đã hoàn tất' : 'Đang vận chuyển'}
                </span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black tracking-tight">{selectedOrderDetails?.id}</h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"><Printer size={24} /></button>
            <button onClick={() => setSelectedOrderDetails(null)} className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"><X size={32} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 md:p-12 no-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            <div className="lg:col-span-4 space-y-10">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-3 px-2">
                  <Building2 size={16} className="text-emerald-500" /> Nhà phân phối đối tác
                </h4>
                <Card className="p-8 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm rounded-[32px]">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xl font-black text-slate-800 dark:text-slate-100">{selectedOrderDetails?.seller}</p>
                      <p className="text-xs text-slate-500 font-bold mt-1">Hợp đồng: NPP-HG-2024-88</p>
                    </div>
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <MapPin size={16} className="text-emerald-500" />
                        <span>KCN Mỹ Tho, Tiền Giang</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <ExternalLink size={16} className="text-emerald-500" />
                        <span className="underline cursor-pointer">Xem hồ sơ năng lực</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-3 px-2">
                  <CreditCard size={16} className="text-emerald-500" /> Hình thức thanh toán
                </h4>
                <Card className="p-8 bg-blue-50/30 border-2 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30 rounded-[32px]">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-blue-600 text-white flex items-center justify-center shadow-lg">
                      <CreditCard size={32} />
                    </div>
                    <div>
                      <p className="text-lg font-black uppercase tracking-tight text-blue-700 dark:text-blue-400">Công nợ 30 ngày</p>
                      <p className="text-xs text-slate-500 font-bold mt-1">Hạn thanh toán: 20/06/2024</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-3 px-2">
                  <Box size={16} className="text-emerald-500" /> Danh sách hàng sỉ
                </h4>
                <div className="border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                      <tr>
                        <th className="px-10 py-6">Mặt hàng sỉ</th>
                        <th className="px-8 py-6 text-center">Số lượng</th>
                        <th className="px-8 py-6 text-right">Đơn giá sỉ</th>
                        <th className="px-10 py-6 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedOrderDetails?.items.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-10 py-6">
                            <p className="text-base font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter mt-1 block">Chiết khấu sỉ -15%</span>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-xl text-xs font-black">x{item.qty} Thùng</span>
                          </td>
                          <td className="px-8 py-6 text-right text-sm font-medium text-slate-500">
                            {item.price.toLocaleString()}đ
                          </td>
                          <td className="px-10 py-6 text-right text-base font-black text-emerald-600">
                            {(item.price * item.qty).toLocaleString()}đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[32px] flex items-center gap-6">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-100">Cam kết chất lượng từ NPP</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sản phẩm đi kèm đầy đủ chứng từ regulatory và QR code truy xuất nguồn gốc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 md:p-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between shrink-0 gap-8 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Giá trị đơn hàng sỉ</p>
            <div className="flex items-baseline gap-3">
              <p className="text-4xl md:text-5xl font-black text-emerald-600">{selectedOrderDetails?.total.toLocaleString()}đ</p>
              <span className="text-sm text-slate-400 font-bold italic">(Đã bao gồm VAT 8%)</span>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="secondary" className="h-16 rounded-[20px] px-10 font-bold flex-1 md:flex-none dark:bg-slate-800 shadow-sm border-slate-200 text-white hover:bg-slate-800" onClick={() => alert("Đang tải đơn đặt hàng...")}>
              <Download size={24} /> <span className="hidden sm:inline">Tải PDF</span>
            </Button>
            <Button className="h-16 rounded-[20px] px-14 font-black shadow-2xl shadow-emerald-500/30 flex-1 md:flex-none text-base tracking-tight" onClick={() => setSelectedOrderDetails(null)}>Đóng chi tiết</Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
