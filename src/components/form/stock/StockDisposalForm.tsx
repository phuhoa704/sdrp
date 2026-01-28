
import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Trash2, AlertCircle, LayoutGrid,
  Package, Receipt, Save, CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { StockDisposalVoucher, StockDisposalItem } from '@/types/stock';
import { Product } from '@/types/product';

interface StockDisposalFormProps {
  products: Product[];
  onSave: (disposal: StockDisposalVoucher) => void;
  onCancel: () => void;
}

export const StockDisposalForm: React.FC<StockDisposalFormProps> = ({ products, onSave, onCancel }) => {
  const [disposalCode] = useState(`XH${Math.floor(100000 + Math.random() * 900000)}`);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<StockDisposalItem[]>([]);
  const [note, setNote] = useState("");

  const filteredSearch = useMemo(() => {
    if (searchQuery.length < 1) return [];
    return products.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  const handleAddItem = (p: Product) => {
    if (selectedItems.find(i => i.productId === p.id)) return;
    const price = (p.variants?.[0]?.prices?.[0]?.amount as number) ||
      (p.variants?.[0]?.metadata?.price as number) || 0;
    const costPrice = (p.variants?.[0]?.metadata?.cost_price as number) ||
      (p.metadata?.cost_price as number) ||
      Math.round(price * 0.7);
    const newItem: StockDisposalItem = {
      productId: p.id,
      productName: p.title,
      unit: (p as any).weight_unit || 'Chai/Gói',
      quantity: 1,
      costPrice: costPrice,
      subtotal: costPrice
    };
    setSelectedItems([...selectedItems, newItem]);
    setSearchQuery("");
  };

  const handleUpdateQty = (id: string, qty: number) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.productId === id) {
        const quantity = Math.max(1, qty);
        return { ...item, quantity, subtotal: quantity * item.costPrice };
      }
      return item;
    }));
  };

  const handleRemove = (id: string) => {
    setSelectedItems(prev => prev.filter(i => i.productId !== id));
  };

  const totalValue = selectedItems.reduce((s, i) => s + i.subtotal, 0);

  const handleSubmit = (status: 'draft' | 'completed') => {
    if (selectedItems.length === 0) return alert("Vui lòng chọn ít nhất 1 sản phẩm để hủy.");
    const disposal: StockDisposalVoucher = {
      id: Math.random().toString(36).substr(2, 9),
      code: disposalCode,
      createdAt: new Date().toLocaleString('vi-VN'),
      creator: 'Trần Phúc Lợi',
      status: status,
      items: selectedItems,
      totalValue,
      branch: 'Chi nhánh trung tâm',
      note
    };
    onSave(disposal);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] animate-fade-in">
      <div className="flex-1 flex gap-8 min-h-0">

        <div className="w-1/3 flex flex-col gap-6">
          <Card className="p-6 bg-white dark:bg-slate-900 shadow-lg space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={16} className="text-rose-500" /> Chọn hàng cần hủy
              </h3>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm tên hàng, mã SKU..."
                className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-500/20 dark:text-white placeholder:text-slate-300"
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar space-y-2">
              {filteredSearch.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleAddItem(p)}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-rose-500 cursor-pointer transition-all flex items-center gap-4 group"
                >
                  <img src={p.thumbnail || ""} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold dark:text-white truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{p.id} • Tồn: {(p.variants?.[0]?.metadata?.stock as number) || 0}</p>
                  </div>
                  <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
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
              <Receipt size={24} className="text-rose-400" />
              <h4 className="font-black uppercase tracking-tight">Thông tin phiếu hủy</h4>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Mã phiếu:</span>
                <span className="text-xs font-black text-rose-400">{disposalCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Người tạo:</span>
                <span className="text-xs font-bold">Trần Phúc Lợi</span>
              </div>
            </div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ghi chú lý do xuất hủy (VD: Hỏng do vận chuyển, hết hạn...)"
              className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-2xl text-xs outline-none focus:border-rose-500/50 resize-none mt-4 dark:text-white placeholder:text-slate-500"
            />
          </Card>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <Card noPadding className="flex-1 flex flex-col bg-white dark:bg-slate-900 shadow-xl rounded-[40px] overflow-hidden border-none">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3 text-rose-600">
                <Trash2 size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">Chi tiết sản phẩm hủy</h3>
              </div>
              <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full text-slate-500 uppercase tracking-widest">{selectedItems.length} MẶT HÀNG</span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {selectedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                  <AlertCircle size={64} className="opacity-10" />
                  <p className="text-sm font-bold italic opacity-30">Vui lòng chọn sản phẩm cần hủy từ danh sách bên trái</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700 z-10">
                    <tr>
                      <th className="px-8 py-5">Tên sản phẩm</th>
                      <th className="px-6 py-5 text-center">ĐVT</th>
                      <th className="px-6 py-5 text-center">Số lượng hủy</th>
                      <th className="px-6 py-5 text-right">Giá vốn</th>
                      <th className="px-6 py-5 text-right">Thành tiền</th>
                      <th className="px-8 py-5 text-right w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedItems.map((item) => (
                      <tr key={item.productId} className="group hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-slate-800 dark:text-slate-100">{item.productName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.productId}</p>
                        </td>
                        <td className="px-6 py-5 text-center"><span className="text-xs font-bold text-slate-500 uppercase">{item.unit}</span></td>
                        <td className="px-6 py-5 text-center">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={e => handleUpdateQty(item.productId, Number(e.target.value))}
                            className="w-20 h-10 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-rose-500 rounded-xl text-center font-black text-sm outline-none transition-all dark:text-white"
                          />
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-slate-500">{item.costPrice.toLocaleString()}</td>
                        <td className="px-6 py-5 text-right font-black text-rose-600">
                          {item.subtotal.toLocaleString()}đ
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

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 shrink-0 flex justify-between items-end">
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã sản phẩm chọn</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{selectedItems.length}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-1">Tổng giá trị thiệt hại</p>
                <p className="text-4xl font-black text-rose-600 leading-none">{totalValue.toLocaleString()}đ</p>
              </div>
            </div>
          </Card>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="secondary" className="h-14 px-10 rounded-2xl font-bold border-slate-200" onClick={onCancel}>Hủy bỏ</Button>
            <Button variant="outline" className="h-14 px-10 rounded-2xl font-black border-slate-200" icon={<Save size={20} />} onClick={() => handleSubmit('draft')}>LƯU TẠM</Button>
            <Button className="h-14 px-14 rounded-2xl font-black bg-rose-600 text-white shadow-xl shadow-rose-500/20" icon={<CheckCircle2 size={24} />} onClick={() => handleSubmit('completed')}>HOÀN THÀNH</Button>
          </div>
        </div>

      </div>
    </div>
  );
};
