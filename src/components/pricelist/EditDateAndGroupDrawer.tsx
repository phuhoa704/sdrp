import React, { useState } from 'react'
import { Drawer } from '../Drawer'
import { PriceList } from '@/types/price'
import { Button } from '../Button';
import DatePicker from 'react-datepicker';
import { CalendarIcon, ChevronDown, Users, X } from 'lucide-react';
import { useCustomerGroups } from '@/hooks/medusa/useCustomerGroups';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  priceList: PriceList;
  onSave: (data: any) => void;
}

export const EditDateAndGroupDrawer: React.FC<Props> = ({ isOpen, onClose, priceList, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedCustomerGroupIds, setSelectedCustomerGroupIds] = useState<string[]>([]);
  const [isCustomerGroupsOpen, setIsCustomerGroupsOpen] = useState(false);

  const { customerGroups, loading: groupsLoading } = useCustomerGroups({
    fields: "id,name",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({
      start_date: startDate,
      end_date: endDate,
      rules: {
        "customer.groups.id": selectedCustomerGroupIds,
      }
    });
    setIsSaving(false);
  };
  const inputStyle = "w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-slate-800 dark:text-white transition-all";
  const labelStyle = "text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-2 block";
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="CHỈNH SỬA CẤU HÌNH"
      footer={
        <div className="flex gap-3 w-full">
          <Button variant="secondary" fullWidth onClick={onClose} className="rounded-2xl font-black">HỦY BỎ</Button>
          <Button variant="primary" fullWidth onClick={handleSave} loading={isSaving} className="rounded-2xl font-black">LƯU THAY ĐỔI</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className={labelStyle}>Ngày bắt đầu (Tùy chọn)</label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              placeholderText="Chọn ngày bắt đầu"
              className={inputStyle}
              dateFormat="dd/MM/yyyy"
              wrapperClassName='w-full'
            />
            <CalendarIcon size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-2">
          <label className={labelStyle}>Ngày kết thúc (Tùy chọn)</label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              placeholderText="Chọn ngày kết thúc"
              className={inputStyle}
              dateFormat="dd/MM/yyyy"
              minDate={startDate || undefined}
              wrapperClassName='w-full'
            />
            <CalendarIcon size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-2">
          <label className={labelStyle}>Nhóm khách hàng (Tùy chọn)</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCustomerGroupsOpen(!isCustomerGroupsOpen)}
              className={`${inputStyle} text-left flex items-center justify-between`}
            >
              <span className={cn(selectedCustomerGroupIds.length === 0 ? "text-slate-400" : "text-slate-800 dark:text-white")}>
                {selectedCustomerGroupIds.length === 0
                  ? "Chọn nhóm khách hàng"
                  : `${selectedCustomerGroupIds.length} nhóm đã chọn`}
              </span>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <ChevronDown size={16} className={cn("text-slate-400 transition-transform", isCustomerGroupsOpen && "rotate-180")} />
              </div>
            </button>

            {isCustomerGroupsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCustomerGroupsOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-2 space-y-1">
                  {groupsLoading ? (
                    <div className="p-4 text-center text-xs text-slate-400">Đang tải...</div>
                  ) : customerGroups.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">Không tìm thấy nhóm khách hàng nào</div>
                  ) : (
                    customerGroups.map(group => (
                      <label
                        key={group.id}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCustomerGroupIds.includes(group.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCustomerGroupIds([...selectedCustomerGroupIds, group.id]);
                            } else {
                              setSelectedCustomerGroupIds(selectedCustomerGroupIds.filter(id => id !== group.id));
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{group.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          {selectedCustomerGroupIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCustomerGroupIds.map(id => {
                const group = customerGroups.find(g => g.id === id);
                if (!group) return null;
                return (
                  <div key={id} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800/50 animate-fade-in">
                    {group.name}
                    <button
                      type="button"
                      onClick={() => setSelectedCustomerGroupIds(selectedCustomerGroupIds.filter(gid => gid !== id))}
                      className="hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  )
}
