import React from 'react';
import { Modal } from '../Modal';
import { StockUp, StockUpType } from '@/types/stock-up';
import { cn, formatDateByFormat, formatTime, formatCurrency } from '@/lib/utils';
import { Building2, Package, Calendar, User, Receipt, Printer, FileText } from 'lucide-react';

interface StockDetailProps {
  isOpen: boolean;
  onClose: () => void;
  data: StockUp | null;
  loading?: boolean;
}

export const StockDetail: React.FC<StockDetailProps> = ({ isOpen, onClose, data, loading }) => {
  if (!isOpen) return null;

  const totalValue = data?.summary?.total || 0;
  const totalItems = data?.summary?.items?.length || 0;
  const code = data?.code?.toUpperCase();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={data ? `Chi tiết phiếu: ${code}` : 'Đang tải...'}
      maxWidth="4xl"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang lấy dữ liệu...</p>
        </div>
      ) : data ? (
        <div className="space-y-8 animate-fade-in p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Receipt size={18} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại phiếu</span>
              </div>
              <p className={cn(
                "text-sm font-black uppercase",
                data.type === StockUpType.INBOUND ? "text-emerald-500" : "text-rose-500"
              )}>
                {data.type === StockUpType.INBOUND ? "Nhập hàng (Inbound)" : "Xuất hủy (Disposal)"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Building2 size={18} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhà cung cấp</span>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {data.vendor?.name || 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Calendar size={18} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {formatDateByFormat(data.created_at, "dd/MM/yyyy")}
                </p>
                <span className="text-sm text-slate-400 font-bold">{formatTime(data.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-4 flex items-center gap-2">
              <Package size={14} />
              Danh sách mặt hàng
            </h3>

            <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-3xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mặt hàng</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Số lượng</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Đơn giá</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-10">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {data.summary?.items.map((item, idx) => {
                    if (!item) return null
                    const variant = data.product_variant?.find(v => v && v.id === item.variant_id);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {variant?.thumbnail && (
                              <img src={variant.thumbnail} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                            )}
                            <div>
                              <p className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">{variant?.sku || item.variant_id}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 max-w-[250px] truncate">{variant?.title || 'Unknown SKU'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-xs font-black text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {formatCurrency(item.price, 'vnd')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right pr-10">
                          <span className="text-sm font-black text-emerald-500">
                            {formatCurrency(item.quantity * item.price, 'vnd')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Người lập phiếu</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{data.vendor?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Mã đối chiếu</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{data.id}</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500 rounded-[32px] p-8 text-white min-w-[300px] shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
              <Receipt size={80} className="absolute -right-4 -bottom-4 text-white opacity-10 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Tổng giá trị thanh toán</p>
                <p className="text-4xl font-black tracking-tighter leading-none mb-4">
                  {formatCurrency(totalValue, 'vnd')}
                </p>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
                    Tổng số mặt hàng: <span className="text-white font-black">{totalItems} sản phẩm</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button className="h-12 px-8 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-xs font-black text-slate-600 dark:text-slate-300 transition-all uppercase tracking-widest">
              <Printer size={18} />
              In chứng từ
            </button>
            <button
              onClick={onClose}
              className="h-12 px-8 bg-emerald-500/10 text-emerald-500 rounded-2xl text-xs font-black hover:bg-emerald-500/20 transition-all uppercase tracking-widest"
            >
              Đóng
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
