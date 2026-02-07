import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/Drawer';
import { Button } from '@/components/Button';
import { stockLocationService } from '@/lib/api/medusa/stockLocationService';
import { inventoryService } from '@/lib/api/medusa/inventoryService';
import { StockLocation } from '@/types/stock';
import { Search, Check } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface ManageLocationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItemId: string | null;
  inventoryItemTitle?: string;
  inventoryItemSku?: string;
  currentLocationIds: string[]; // IDs of locations currently assigned
  onUpdate: () => void; // Trigger refresh
}

export const ManageLocationsDrawer: React.FC<ManageLocationsDrawerProps> = ({
  isOpen,
  onClose,
  inventoryItemId,
  inventoryItemTitle,
  inventoryItemSku,
  currentLocationIds,
  onUpdate
}) => {
  const { showToast } = useToast();
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchLocations();
      setSelectedIds(new Set(currentLocationIds));
    }
  }, [isOpen, currentLocationIds]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await stockLocationService.getStockLocations({ limit: 100 });
      setLocations(res.data.data.map((item) => item.stock_location));
    } catch (error) {
      console.error('Failed to fetch stock locations', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSave = async () => {
    if (!inventoryItemId) return;
    setSaving(true);
    try {
      const createList: { location_id: string }[] = [];
      const deleteList: string[] = [];

      // Finds Added IDs
      for (const id of selectedIds) {
        if (!currentLocationIds.includes(id)) {
          createList.push({ location_id: id });
        }
      }
      // Find Removed IDs
      for (const id of currentLocationIds) {
        if (!selectedIds.has(id)) {
          deleteList.push(id);
        }
      }

      if (createList.length > 0 || deleteList.length > 0) {
        await inventoryService.batchInventoryLevels(inventoryItemId, {
          create: createList,
          delete: deleteList
        });
      }
      showToast('Cập nhật vị trí kho thành công', 'success');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Failed to update locations', error);
      showToast(error.message || 'Không thể cập nhật vị trí kho', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredLocations = locations.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Quản lý vị trí kho"
      width="lg"
    >
      <div className="p-6 space-y-6 flex flex-col h-full overflow-hidden">
        {/* Header Table */}
        <div className="border border-slate-100 dark:border-slate-700 rounded-lg overflow-hidden shrink-0">
          <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-700 bg-slate-50 dark:bg-slate-900">
            <div className="p-3">
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Tên</div>
              <div className="text-sm text-slate-900 dark:text-slate-300 font-medium truncate">{inventoryItemTitle || '-'}</div>
            </div>
            <div className="p-3">
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">SKU</div>
              <div className="text-sm text-slate-900 dark:text-slate-300 font-medium truncate">{inventoryItemSku || '-'}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-200">Vị trí kho</h3>
              <p className="text-xs text-slate-500">Chọn vị trí kho chứa sản phẩm.</p>
            </div>
            <span className="text-xs text-slate-400">(Đã chọn {selectedIds.size} / {filteredLocations.length})</span>
          </div>

          <div className="mb-4 relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading locations...</div>
            ) : filteredLocations.map(loc => {
              const isSelected = selectedIds.has(loc.id);
              // Determine address string safer
              const addressParts = [];
              if (loc.address?.address_1) addressParts.push(loc.address.address_1);
              if (loc.address?.city) addressParts.push(loc.address.city);
              if (loc.address?.country_code) addressParts.push(loc.address.country_code);

              return (
                <div
                  key={loc.id}
                  onClick={() => handleToggle(loc.id)}
                  className={`
                                        p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-start gap-3 select-none
                                        ${isSelected ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}
                                    `}
                >
                  <div className={`
                                        w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors
                                        ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600'}
                                    `}>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{loc.name}</div>
                    {addressParts.length > 0 && (
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        {addressParts.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {!loading && filteredLocations.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">No locations found</div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
