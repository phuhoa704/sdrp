
import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Trash2, ClipboardCheck,
  AlertCircle, LayoutGrid, Package, Receipt, Save, CheckCircle2
} from 'lucide-react';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { StockAuditItem, StockAuditVoucher } from '@/types/stock';
import { Product } from '@/types/product';

interface StockAuditFormProps {
  products: Product[];
  onSave: (audit: StockAuditVoucher) => void;
  onCancel: () => void;
}

export const StockAuditForm: React.FC<StockAuditFormProps> = ({ products, onSave, onCancel }) => {
  const [auditCode] = useState(`KK${Math.floor(100000 + Math.random() * 900000)}`);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<StockAuditItem[]>([]);
  const [note, setNote] = useState("");

  const filteredSearch = useMemo(() => {
    if (searchQuery.length < 1) return [];
    return products.filter(p => {
      const activeIngredient = (p as any).metadata?.active_ingredient || p.variants?.[0]?.metadata?.active_ingredient || "";
      return p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activeIngredient.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, products]);

  const handleAddItem = (p: Product) => {
    if (selectedItems.find(i => i.productId === p.id)) return;
    const stock = (p.variants?.[0]?.metadata?.stock as number) || 0;
    const newItem: StockAuditItem = {
      productId: p.id,
      productName: p.title,
      unit: (p as any).weight_unit || 'Chai/Gói',
      systemStock: stock,
      actualStock: stock,
      varianceQty: 0,
      varianceValue: 0
    };
    setSelectedItems([...selectedItems, newItem]);
    setSearchQuery("");
  };

  const handleUpdateActual = (id: string, actual: number) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.productId === id) {
        const product = products.find(p => p.id === id);
        const costPrice = (product?.variants?.[0]?.metadata?.cost_price as number) ||
          (product?.metadata?.cost_price as number) || 0;
        const varianceQty = actual - item.systemStock;
        const varianceValue = varianceQty * costPrice;
        return { ...item, actualStock: actual, varianceQty, varianceValue };
      }
      return item;
    }));
  };

  const handleRemove = (id: string) => {
    setSelectedItems(prev => prev.filter(i => i.productId !== id));
  };

  const totalActual = selectedItems.reduce((s, i) => s + i.actualStock, 0);
  const totalVarianceQty = selectedItems.reduce((s, i) => s + i.varianceQty, 0);
  const totalVarianceValue = selectedItems.reduce((s, i) => s + i.varianceValue, 0);

  const handleSubmit = (status: 'draft' | 'balanced') => {
    const audit: StockAuditVoucher = {
      id: Math.random().toString(36).substr(2, 9),
      code: auditCode,
      createdAt: new Date().toLocaleString('vi-VN'),
      balanceDate: status === 'balanced' ? new Date().toLocaleString('vi-VN') : undefined,
      creator: 'Trần Phúc Lợi',
      status: status,
      items: selectedItems,
      totalActual,
      totalSystem: selectedItems.reduce((s, i) => s + i.systemStock, 0),
      totalVarianceQty,
      totalVarianceValue,
      note
    };
    onSave(audit);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] animate-fade-in">
      <div className="flex-1 flex gap-8 min-h-0">

        <div className="w-1/3 flex flex-col gap-6">
          <Card className="p-6 bg-white dark:bg-slate-900 shadow-lg space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid size={16} className="text-emerald-500" /> Chọn hàng kiểm kho
            </h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm tên hàng, hoạt chất..."
                className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar space-y-2">
              {filteredSearch.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleAddItem(p)}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-emerald-500 cursor-pointer transition-all flex items-center gap-4 group"
                >
                  <img src={p.thumbnail || ""} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold dark:text-white truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{p.id} • Tồn: {(p.variants?.[0]?.metadata?.stock as number) || 0}</p>
                  </div>
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <Plus size={16} />
                  </div>
                </div>
              ))}
              {searchQuery.length > 0 && filteredSearch.length === 0 && (
                <p className="text-center py-10 text-xs text-slate-400 italic">Không tìm thấy sản phẩm phù hợp</p>
              )}
              {searchQuery.length === 0 && (
                <div className="py-20 text-center opacity-10">
                  <Package size={64} className="mx-auto" />
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-[#0F172A] dark:bg-slate-950 text-white shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Receipt size={24} className="text-emerald-400" />
              <h4 className="font-black uppercase tracking-tight">Thông tin phiếu</h4>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Mã phiếu:</span>
                <span className="text-xs font-black text-emerald-400">{auditCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Trạng thái:</span>
                <span className="text-[9px] font-black bg-blue-500 px-2 py-0.5 rounded-full">PHIẾU TẠM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Người tạo:</span>
                <span className="text-xs font-bold">Trần Phúc Lợi</span>
              </div>
            </div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ghi chú kiểm kho..."
              className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-2xl text-xs outline-none focus:border-emerald-500/50 resize-none mt-4 dark:text-white"
            />
          </Card>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <Card noPadding className="flex-1 flex flex-col bg-white dark:bg-slate-900 shadow-xl rounded-[40px] overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3 text-emerald-600">
                <ClipboardCheck size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">Chi tiết kiểm kê</h3>
              </div>
              <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full text-slate-500 uppercase tracking-widest">{selectedItems.length} MẶT HÀNG</span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {selectedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                  <AlertCircle size={64} className="opacity-10" />
                  <p className="text-sm font-bold italic opacity-30">Vui lòng chọn sản phẩm từ danh sách bên trái</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 z-10">
                    <tr>
                      <th className="px-8 py-5">Sản phẩm</th>
                      <th className="px-6 py-5 text-center">ĐVT</th>
                      <th className="px-6 py-5 text-center">Tồn kho</th>
                      <th className="px-6 py-5 text-center">Thực tế</th>
                      <th className="px-6 py-5 text-center">Lệch SL</th>
                      <th className="px-8 py-5 text-right w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedItems.map((item) => (
                      <tr key={item.productId} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-slate-800 dark:text-slate-100">{item.productName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.productId}</p>
                        </td>
                        <td className="px-6 py-5 text-center"><span className="text-xs font-bold text-slate-500">{item.unit}</span></td>
                        <td className="px-6 py-5 text-center font-black text-slate-500">{item.systemStock}</td>
                        <td className="px-6 py-5 text-center">
                          <input
                            type="number"
                            value={item.actualStock}
                            onChange={e => handleUpdateActual(item.productId, Number(e.target.value))}
                            className="w-20 h-10 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-emerald-500 rounded-xl text-center font-black text-sm outline-none transition-all dark:text-white"
                          />
                        </td>
                        <td className={`px-6 py-5 text-center font-black ${item.varianceQty > 0 ? 'text-emerald-500' : item.varianceQty < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                          {item.varianceQty > 0 ? '+' : ''}{item.varianceQty}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => handleRemove(item.productId)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 shrink-0 grid grid-cols-4 gap-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng thực tế</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{totalActual}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng lệch tăng</p>
                <p className="text-2xl font-black text-emerald-500">+{selectedItems.filter(i => i.varianceQty > 0).reduce((s, i) => s + i.varianceQty, 0)}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng lệch giảm</p>
                <p className="text-2xl font-black text-rose-500">{selectedItems.filter(i => i.varianceQty < 0).reduce((s, i) => s + i.varianceQty, 0)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng giá trị lệch</p>
                <p className="text-3xl font-black text-emerald-600">{totalVarianceValue.toLocaleString()}đ</p>
              </div>
            </div>
          </Card>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="secondary" className="h-14 px-10 rounded-2xl font-bold border-slate-200" onClick={onCancel}>Hủy bỏ</Button>
            <Button variant="outline" className="h-14 px-10 rounded-2xl font-black border-slate-200" icon={<Save size={20} />} onClick={() => handleSubmit('draft')}>LƯU TẠM</Button>
            <Button className="h-14 px-14 rounded-2xl font-black shadow-xl shadow-emerald-500/20" icon={<CheckCircle2 size={24} />} onClick={() => handleSubmit('balanced')}>HOÀN THÀNH</Button>
          </div>
        </div>

      </div>
    </div>
  );
};
