import React, { Dispatch, useState } from 'react'
import { Button } from '../Button';
import { OrderTab } from '@/store/slices/posSlice';
import { draftOrderService } from '@/lib/api/medusa/draftOrderService';

interface Props {
  setShowCustomerModal: (show: boolean) => void;
  activeTab: any;
  setTabs: Dispatch<React.SetStateAction<OrderTab[]>>;
  setActiveTab: Dispatch<React.SetStateAction<OrderTab | null>>;
  activeTabId: string;
}

export const CustomerModal = ({ setShowCustomerModal, activeTab, setTabs, setActiveTab, activeTabId }: Props) => {
  const [email, setEmail] = useState(activeTab?.customer?.name || '');
  const [phone, setPhone] = useState(activeTab?.customer?.phone || '');
  const [address, setAddress] = useState(activeTab?.customer?.address || '');
  return (
    <div className="fixed inset-0 z-[10500] flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCustomerModal(false)} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl border dark:border-slate-800">
        <h3 className="text-xl font-bold mb-6 dark:text-white">Thông tin khách hàng</h3>
        <div className="space-y-5">
          <input id="cust-name" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 dark:text-white outline-none" />
          <input id="cust-phone" placeholder="Số điện thoại..." value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 dark:text-white outline-none" />
          <textarea id="cust-address" placeholder="Địa chỉ..." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-24 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 dark:text-white outline-none resize-none" />
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" fullWidth onClick={() => setShowCustomerModal(false)}>Hủy</Button>
            <Button fullWidth onClick={() => {
              if (email && phone) {
                setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, customer: { name: email, phone: phone, address: address } } : t));
                setActiveTab(prev => {
                  if (!prev) return null;
                  return { ...prev, customer: { name: email, phone: phone, address: address } }
                });
                draftOrderService.updateDraftOrder(activeTabId, {
                  email: email
                });
                setShowCustomerModal(false);
              }
            }}>Lưu</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
