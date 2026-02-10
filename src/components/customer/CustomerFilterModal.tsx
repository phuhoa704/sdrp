import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Users, X, Check, Search } from 'lucide-react';
import { customerGroupService } from '@/lib/api/medusa/customerGroupService';
import { CustomerGroup } from '@/types/customer-group';
import { TableLoading } from '@/components/TableLoading';

interface CustomerFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGroups: string[];
  onApply: (groups: string[]) => void;
}

export const CustomerFilterModal: React.FC<CustomerFilterModalProps> = ({
  isOpen,
  onClose,
  selectedGroups: initialSelectedGroups,
  onApply
}) => {
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(initialSelectedGroups);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
      setSelectedGroups(initialSelectedGroups);
    }
  }, [isOpen]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await customerGroupService.getCustomerGroups({ limit: 100 });
      setGroups(response.data.data.map(item => item.customer_group));
    } catch (err) {
      console.error('Failed to fetch groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="BỘ LỌC KHÁCH HÀNG"
      maxWidth="xl"
    >
      <div className="p-8 space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">NHÓM KHÁCH HÀNG</h4>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/50">
              {selectedGroups.length} ĐÃ CHỌN
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm nhóm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto no-scrollbar space-y-2 pr-2">
            {loading ? (
              <TableLoading />
            ) : filteredGroups.length > 0 ? (
              filteredGroups.map(group => (
                <div
                  key={group.id}
                  onClick={() => toggleGroup(group.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${selectedGroups.includes(group.id)
                    ? 'bg-emerald-500/5 border-emerald-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-500/30'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedGroups.includes(group.id) ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                      }`}>
                      <Users size={18} />
                    </div>
                    <div>
                      <p className={`text-sm font-black transition-colors ${selectedGroups.includes(group.id) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'
                        }`}>
                        {group.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {group.customers?.length || 0} THÀNH VIÊN
                      </p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedGroups.includes(group.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-700'
                    }`}>
                    {selectedGroups.includes(group.id) && <Check size={14} />}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm font-bold text-slate-400">Không tìm thấy nhóm khách hàng nào</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t dark:border-slate-800">
          <Button
            variant="soft"
            className="flex-1 h-14 rounded-2xl font-black text-xs uppercase"
            onClick={() => setSelectedGroups([])}
          >
            LÀM MỚI
          </Button>
          <Button
            className="flex-[2] h-14 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 font-black text-xs uppercase tracking-wider"
            onClick={() => {
              onApply(selectedGroups);
              onClose();
            }}
          >
            ÁP DỤNG BỘ LỌC
          </Button>
        </div>
      </div>
    </Modal>
  );
};
