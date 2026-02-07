import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/Drawer';
import { Button } from '@/components/Button';
import { inventoryService, InventoryLevel, InventoryItem } from '@/lib/api/medusa/inventoryService';
import { useToast } from '@/contexts/ToastContext';

interface UpdateStockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItem: InventoryItem | null;
  locationLevel: InventoryLevel | null;
  onUpdate: () => void;
}

export const UpdateStockDrawer: React.FC<UpdateStockDrawerProps> = ({
  isOpen,
  onClose,
  inventoryItem,
  locationLevel,
  onUpdate
}) => {
  const { showToast } = useToast();
  const [stock, setStock] = useState<number | ''>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && locationLevel) {
      setStock(locationLevel.stocked_quantity);
    }
  }, [isOpen, locationLevel]);

  const handleSave = async () => {
    if (!inventoryItem || !locationLevel) return;
    setSaving(true);
    try {
      const quantity = stock === '' ? 0 : Number(stock);
      await inventoryService.updateInventoryLevel(inventoryItem.id, locationLevel.location_id, {
        stocked_quantity: quantity
      });
      showToast('Cập nhật tồn kho thành công', 'success');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Failed to update stock', error);
      showToast(error.message || 'Không thể cập nhật tồn kho', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!locationLevel || !inventoryItem) return null;

  const locationName = locationLevel.stock_locations?.[0]?.name || 'Unknown Location';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Quản lý số lượng tồn kho"
      width="md"
    >
      <div className="p-6 space-y-6 flex flex-col h-full">
        <div className="border border-slate-100 dark:border-slate-700 rounded-lg overflow-hidden text-sm">
          <div className="grid grid-cols-[100px_1fr] divide-y divide-slate-100 dark:divide-slate-700">
            <div className="bg-slate-50 dark:bg-slate-900 p-3 text-slate-500 dark:text-slate-400 font-medium border-r border-slate-100 dark:border-slate-700">Tên</div>
            <div className="p-3 text-slate-900 dark:text-slate-200">{inventoryItem.title || '-'}</div>

            <div className="bg-slate-50 dark:bg-slate-900 p-3 text-slate-500 dark:text-slate-400 font-medium border-r border-slate-100 dark:border-slate-700">SKU</div>
            <div className="p-3 text-slate-900 dark:text-slate-200">{inventoryItem.sku || '-'}</div>

            <div className="bg-slate-50 dark:bg-slate-900 p-3 text-slate-500 dark:text-slate-400 font-medium border-r border-slate-100 dark:border-slate-700">Vị trí kho</div>
            <div className="p-3 text-slate-900 dark:text-slate-200">{locationName}</div>

            <div className="bg-slate-50 dark:bg-slate-900 p-3 text-slate-500 dark:text-slate-400 font-medium border-r border-slate-100 dark:border-slate-700">Đã đặt</div>
            <div className="p-3 text-slate-900 dark:text-slate-200">{locationLevel.reserved_quantity}</div>

            <div className="bg-slate-50 dark:bg-slate-900 p-3 text-slate-500 dark:text-slate-400 font-medium border-r border-slate-100 dark:border-slate-700">Còn lại</div>
            <div className="p-3 text-slate-900 dark:text-slate-200">{locationLevel.available_quantity}</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-2">Số lượng tồn kho</label>
          <input
            type="number"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600"
            value={stock}
            onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>

        <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={saving}>Hủy</Button>
          <Button onClick={handleSave} disabled={saving}>Lưu</Button>
        </div>
      </div>
    </Drawer>
  );
};
