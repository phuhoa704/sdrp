import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { PenLine, ExternalLink, Filter, SlidersHorizontal, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { inventoryService, InventoryItem, InventoryLevel } from '@/lib/api/medusa/inventoryService';
import { ManageLocationsDrawer } from './ManageLocationsDrawer';
import { UpdateStockDrawer } from './UpdateStockDrawer';

interface InventoryItemDetailProps {
  inventoryItemId: string | null;
  onBack: () => void;
}

export const InventoryItemDetail: React.FC<InventoryItemDetailProps> = ({ inventoryItemId, onBack }) => {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [levels, setLevels] = useState<InventoryLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isManageLocationsOpen, setIsManageLocationsOpen] = useState(false);
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<InventoryLevel | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!inventoryItemId) return;
    setLoading(true);
    try {
      const [itemRes, levelsRes] = await Promise.all([
        inventoryService.getInventoryItem(inventoryItemId, {
          fields: '*variants,*variants.product,*variants.options'
        }),
        inventoryService.getInventoryLevels(inventoryItemId, {
          limit: 20,
          offset: 0,
          fields: '+stock_locations.id,+stock_locations.name'
        })
      ]);
      setItem(itemRes.inventory_item);
      setLevels(levelsRes.inventory_levels);
    } catch (error) {
      console.error('Failed to fetch inventory details:', error);
    } finally {
      setLoading(false);
    }
  }, [inventoryItemId]);

  useEffect(() => {
    if (inventoryItemId) {
      fetchData();
    } else {
      setItem(null);
      setLevels([]);
    }
  }, [inventoryItemId, fetchData]);

  if (!inventoryItemId) return null;

  const totalStocked = levels.reduce((acc, l) => acc + l.stocked_quantity, 0);
  const totalReserved = levels.reduce((acc, l) => acc + l.reserved_quantity, 0);
  const totalAvailable = levels.reduce((acc, l) => acc + l.available_quantity, 0);
  const locationCount = levels.length;

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-800 rounded-lg dark:text-slate-400 text-slate-800 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold dark:text-white text-slate-800 max-w-md truncate">{item?.title || 'Loading...'}</h2>
          <p className="text-xs dark:text-slate-500 text-slate-700 font-bold">Chi tiết kho</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : item ? (
        <div className="space-y-8 text-sm pb-8">
          {/* General Info */}
          <Card className="bg-slate-900 dark:border-slate-800 border-slate-200 p-0">
            <div className="p-4 grid grid-cols-1 divide-y dark:divide-slate-800 divide-slate-200">
              <div className="flex justify-between py-3 first:pt-0">
                <span className="font-bold dark:text-slate-500 text-slate-800">SKU</span>
                <span className="dark:text-slate-300 text-slate-700 font-medium">{item.sku || '-'}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-bold dark:text-slate-500 text-slate-800">Trong kho</span>
                <span className="dark:text-slate-300 text-slate-700 font-medium">{totalStocked} tại {locationCount} kho</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-bold dark:text-slate-500 text-slate-800">Đặt trước</span>
                <span className="dark:text-slate-300 text-slate-700 font-medium">{totalReserved} tại {locationCount} kho</span>
              </div>
              <div className="flex justify-between py-3 last:pb-0">
                <span className="font-bold dark:text-slate-500 text-slate-800">Còn lại</span>
                <span className="dark:text-slate-300 text-slate-700 font-medium">{totalAvailable} tại {locationCount} kho</span>
              </div>
            </div>
          </Card>

          {/* Locations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold dark:text-slate-200 text-slate-800">Kho</h3>
              <Button variant="secondary" className="h-7 text-xs px-3" onClick={() => setIsManageLocationsOpen(true)}>Quản lý kho</Button>
            </div>
            <Card className="bg-slate-900 dark:border-slate-800 border-slate-200 p-0 overflow-hidden">
              <div className="p-2 flex justify-end gap-2 border-b border-slate-800">
                <button className="p-1.5 hover:bg-slate-800 rounded dark:text-slate-500 text-slate-800 transition-colors"><Filter size={14} /></button>
                <button className="p-1.5 hover:bg-slate-800 rounded dark:text-slate-500 text-slate-800 transition-colors"><SlidersHorizontal size={14} /></button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] uppercase dark:text-slate-500 text-slate-800 dark:bg-slate-900/50 bg-slate-200/50 font-bold border-b dark:border-slate-800 border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Kho</th>
                      <th className="px-4 py-3">Đặt trước</th>
                      <th className="px-4 py-3">Trong kho</th>
                      <th className="px-4 py-3">Còn lại</th>
                      <th className="px-4 py-3 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800 divide-slate-200 text-xs">
                    {levels.map(level => (
                      <tr key={level.id} className="group dark:hover:bg-slate-800/30 hover:bg-slate-200/50 transition-colors">
                        <td className="px-4 py-3 font-medium dark:text-slate-300 text-slate-800">
                          {level.stock_locations?.[0]?.name || 'Unknown Location'}
                        </td>
                        <td className="px-4 py-3 dark:text-slate-400 text-slate-800 font-medium">{level.reserved_quantity}</td>
                        <td className="px-4 py-3 dark:text-slate-400 text-slate-800 font-medium">{level.stocked_quantity}</td>
                        <td className="px-4 py-3 dark:text-slate-400 text-slate-800 font-medium">{level.available_quantity}</td>
                        <td className="px-4 py-3 text-right">
                          <PenLine
                            size={14}
                            className="text-slate-500 cursor-pointer hover:text-slate-300"
                            onClick={() => {
                              setSelectedLevel(level);
                              setIsUpdateStockOpen(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    {levels.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 font-medium">No locations found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                <span>1 - {levels.length} of {levels.length} results</span>
                <div className="flex gap-4 pr-2">
                  <span className="cursor-not-allowed text-slate-700">Prev</span>
                  <span className="cursor-not-allowed text-slate-700">Next</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Reservations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold dark:text-slate-200 text-slate-800">Reservations</h3>
              <Button variant="secondary" className="h-7 text-xs px-3">Thêm</Button>
            </div>
            <Card className="bg-slate-900 dark:border-slate-800 border-slate-200 min-h-[150px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center mb-3 text-slate-500 text-[10px] font-bold">!</div>
              <p className="font-bold dark:text-slate-300 text-slate-800 mb-1 text-xs">No records</p>
              <p className="text-slate-500 text-[10px] font-bold">There are no records to show</p>
            </Card>
          </div>

          {/* JSON Debug */}
          <div className="space-y-2">
            <Card className="bg-slate-900 dark:border-slate-800 border-slate-200 p-4 flex justify-between items-center cursor-pointer dark:hover:bg-slate-800/80 hover:bg-slate-200/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold dark:text-slate-200 text-slate-800">Metadata</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-medium">0 keys</span>
              </div>
              <ExternalLink size={14} className="text-slate-500" />
            </Card>
            <Card className="bg-slate-900 dark:border-slate-800 border-slate-200 p-4 flex justify-between items-center cursor-pointer dark:hover:bg-slate-800/80 hover:bg-slate-200/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold dark:text-slate-200 text-slate-800">JSON</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">{Object.keys(item).length} keys</span>
              </div>
              <ExternalLink size={14} className="text-slate-500" />
            </Card>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-slate-500 font-bold">Failed to load item</div>
      )}

      {item && (
        <ManageLocationsDrawer
          isOpen={isManageLocationsOpen}
          onClose={() => setIsManageLocationsOpen(false)}
          inventoryItemId={item.id}
          inventoryItemTitle={item.title || undefined}
          inventoryItemSku={item.sku || undefined}
          currentLocationIds={levels.map(l => l.location_id)}
          onUpdate={fetchData}
        />
      )}
      {item && (
        <UpdateStockDrawer
          isOpen={isUpdateStockOpen}
          onClose={() => setIsUpdateStockOpen(false)}
          inventoryItem={item}
          locationLevel={selectedLevel}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
};

