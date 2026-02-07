import React, { Dispatch, useState, useEffect } from 'react'
import { Search, UserPlus, X, User, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../Button';
import { OrderTab } from '@/store/slices/posSlice';
import { draftOrderService } from '@/lib/api/medusa/draftOrderService';
import { useCustomers } from '@/hooks/medusa/useCustomer';
import { cn } from '@/lib/utils';
import { Customer } from '@/types/customer';
import { customerService } from '@/lib/api/medusa/customerService';
import { CustomerForm } from '../form/customer/CustomerForm';

interface Props {
  setShowCustomerModal: (show: boolean) => void;
  activeTab: any;
  setTabs: Dispatch<React.SetStateAction<OrderTab[]>>;
  setActiveTab: Dispatch<React.SetStateAction<OrderTab | null>>;
  activeTabId: string;
}

export const CustomerModal = ({ setShowCustomerModal, activeTab, setTabs, setActiveTab, activeTabId }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isSavingNew, setIsSavingNew] = useState(false);

  const { customers, loading, refresh } = useCustomers({
    query: {
      q: searchTerm,
      limit: 10,
    }
  });

  const handleSelectCustomer = async (customer: Customer) => {
    setIsUpdating(true);
    try {
      // Update Medusa draft order
      await draftOrderService.updateDraftOrder(activeTabId, {
        customer_id: customer.id,
        email: customer.email
      });

      // Update local state
      const customerData = {
        id: customer.id,
        name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email,
        phone: customer.phone,
        email: customer.email
      };

      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, customer: customerData } : t));
      setActiveTab(prev => {
        if (!prev) return null;
        return { ...prev, customer: customerData }
      });

      setShowCustomerModal(false);
    } catch (err) {
      console.error('Failed to update customer for draft order:', err);
      // You might want to show an error toast here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateCustomer = async (formData: any) => {
    setIsSavingNew(true);
    try {
      const { customer } = await customerService.createCustomer(formData);
      await handleSelectCustomer(customer);
    } catch (err) {
      console.error('Failed to create customer:', err);
    } finally {
      setIsSavingNew(false);
    }
  };

  if (isAddingCustomer) {
    return (
      <div className="fixed inset-0 z-[10500] bg-slate-50 dark:bg-slate-900 overflow-y-auto">
        <CustomerForm
          onSave={handleCreateCustomer}
          onCancel={() => setIsAddingCustomer(false)}
          loading={isSavingNew}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[10500] flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => !isUpdating && setShowCustomerModal(false)} />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-10 py-8 bg-[#131926] text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Gán Khách Hàng</h3>
            <p className="text-[10px] font-bold text-emerald-400 mt-2 uppercase tracking-[0.2em]">Cơ sở dữ liệu khách hàng SD-CRM</p>
          </div>
          <button
            onClick={() => setShowCustomerModal(false)}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-8 border-b dark:border-slate-800 shrink-0">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, SĐT hoặc mã khách hàng..."
              className="w-full h-16 pl-14 pr-6 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-bold text-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="flex justify-between items-center mb-6 px-2">
            <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Danh bạ gần đây</h4>
            <button
              onClick={() => setIsAddingCustomer(true)}
              className="flex items-center gap-2 text-[11px] font-black text-emerald-500 uppercase tracking-widest hover:underline transition-all group"
            >
              <UserPlus size={14} className="group-hover:scale-110 transition-transform" />
              Thêm khách mới
            </button>
          </div>

          <div className="space-y-4">
            {loading && !customers.length ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
              </div>
            ) : customers.length > 0 ? (
              customers.map((c) => (
                <button
                  key={c.id}
                  disabled={isUpdating}
                  onClick={() => handleSelectCustomer(c)}
                  className="w-full p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border-2 border-transparent hover:border-emerald-500/30 hover:shadow-xl transition-all flex items-center gap-5 group text-left relative overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-black text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors truncate">
                      {`${c.first_name || ''} ${c.last_name || ''}`.trim() || c.email}
                    </h5>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-tight">
                      {c.phone || 'Không có SĐT'} • {c.metadata?.category || 'KHÁCH LẺ'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none mb-1 group-hover:text-emerald-500/50 transition-colors">Chi tiêu tích lũy</p>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.metadata?.total_spend || 0)}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-slate-200 dark:text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />

                  {isUpdating && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center">
                      <Loader2 className="animate-spin text-emerald-500" size={24} />
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-20 px-10">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                  <User className="text-slate-300" size={32} />
                </div>
                <h5 className="text-lg font-black text-slate-800 dark:text-white">Không tìm thấy khách hàng</h5>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest leading-relaxed">Hãy thử thay đổi từ khóa tìm kiếm hoặc thêm khách hàng mới</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/20">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-[200px] leading-relaxed italic">
            Vui lòng chọn hoặc tìm kiếm khách hàng trong danh bạ
          </p>
          <Button
            variant="secondary"
            className="px-12 h-14 rounded-2xl font-black text-xs tracking-widest border-2"
            onClick={() => setShowCustomerModal(false)}
            disabled={isUpdating}
          >
            ĐÓNG
          </Button>
        </div>
      </div>
    </div>
  )
}
