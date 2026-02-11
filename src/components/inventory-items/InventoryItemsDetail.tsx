import React, { useEffect, useState } from 'react'
import { Modal } from '../Modal'
import { InventoryItem } from '@/types/inventory-item'
import { Boxes, Printer, Warehouse, X, Zap } from 'lucide-react';
import { Card } from '../Card';
import { noImage } from '@/configs';
import { inventoryService } from '@/lib/api/medusa/inventoryService';
import { TableLoading } from '../TableLoading';
import { TableView } from '../TableView';
import { Button } from '../Button';
import { Empty } from '../Empty';
import { Product } from '@/types/product';
import { productVariantService } from '@/lib/api/medusa/productVariantService';

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
}

export const InventoryItemsDetail = ({ item, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [inventoryItem, setInventoryItem] = useState<InventoryItem | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (item) {
      fetchInventoryItem();
    }
  }, [item]);

  const fetchInventoryItem = async () => {
    if (!item) return;
    setLoading(true);
    try {
      const response = await inventoryService.getInventoryItem(item.id);
      setInventoryItem(response.inventory_item);
      const productResponse = await productVariantService.getProductByInventoryItemId(item.id);
      setProduct(productResponse.data[0].product);
    } catch (error) {
      console.error('Failed to fetch inventory item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={!!item}
      onClose={onClose}
      title=''
      maxWidth='4xl'
      maxHeight='85vh'
    >
      {loading ? (
        <div className='py-4'><TableLoading /></div>
      ) : (inventoryItem ?
        <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col border dark:border-slate-800">
          <div className="p-8 bg-blue-600 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner">
                <Boxes size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Chi tiết tồn kho biến thể</p>
                <h3 className="text-2xl font-black uppercase tracking-tight">{inventoryItem?.sku}</h3>
              </div>
            </div>
            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all">
              <X size={28} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-10 no-scrollbar space-y-10 bg-slate-50/30 dark:bg-slate-950/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className='flex items-start gap-5'>
                <img src={inventoryItem?.thumbnail || noImage} alt="" className='w-20 h-20 rounded-2xl object-cover border dark:border-slate-700' />
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Sản phẩm gốc</h4>
                  <p className="text-base font-black text-slate-800 dark:text-white uppercase line-clamp-1">{product?.title}</p>
                  <p className="text-sm font-bold text-blue-600 mt-1">{inventoryItem?.title}</p>
                </div>
              </Card>
              <Card className='flex flex-col justify-between'>
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4">Hoạt chất & Phân loại</h4>
                <div className="flex gap-2">
                  {product?.material && (
                    <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-tighter">{product?.material}</span>
                  )}
                  <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-tighter">{product?.type?.value}</span>
                </div>
              </Card>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Warehouse size={16} className='text-blue-500' />
                Phân bổ theo kho lưu trữ
              </h4>
              <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border dark:border-slate-800 shadow-sm">
                <TableView
                  headerClassName='bg-slate-50 dark:bg-slate-800/80 text-[10px] font-black text-slate-400 uppercase'
                  columns={[
                    { title: "Tên kho" },
                    { title: "Reservation", className: "text-center" },
                    { title: "Tồn thực tế", className: "text-center" },
                    { title: "Có sẵn", className: "text-right" }
                  ]}
                  data={inventoryItem?.location_levels || []}
                  renderRow={(lcl, idx) => (
                    <tr key={idx} className='hover:bg-blue-50/20 transition-colors'>
                      <td className='px-8 py-5'>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{""}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{lcl.id.slice(0, 8)}</p>
                      </td>
                      <td className='px-6 py-5 text-center'>
                        <span className="text-xs font-black text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-lg">{lcl.reserved_quantity}</span>
                      </td>
                      <td className='px-6 py-5 text-center'>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300">{lcl.stocked_quantity}</span>
                      </td>
                      <td className='px-6 py-5 text-right'>
                        <span className="text-lg font-black text-emerald-600">{lcl.available_quantity}</span>
                      </td>
                    </tr>
                  )}
                />
              </div>
            </div>
            <div className="p-8 bg-blue-500/5 dark:bg-blue-500/10 border-2 border-dashed border-blue-100 dark:border-blue-900/50 rounded-[40px] flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap size={24} />
                </div>
                <div>
                  <h5 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">KẾ HOẠCH BỔ SUNG KHO</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Dựa trên tốc độ bán, bạn nên nhập thêm mặt hàng này vào tuần thứ 3 của tháng 02/2026.
                  </p>
                </div>
              </div>
              <Button variant='outline'>
                <span className="relative z-10">Xem dự báo</span>
              </Button>
            </div>
          </div>
          <div className="p-8 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-4">
            <Button variant='secondary'>Đóng</Button>
            <Button variant='primary'>
              <span className="shrink-0 opacity-90 transition-transform group-hover:scale-110">
                <Printer size={20} />
              </span>
              <span className="relative z-10">IN TEM SAU</span>
            </Button>
          </div>
        </div> : <Empty title='Không tìm thấy sản phẩm' description='Vui lòng chọn sản phẩm khác' />
      )}
    </Modal>
  )
}
