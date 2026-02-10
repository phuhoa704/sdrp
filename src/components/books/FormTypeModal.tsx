import React from 'react'
import { Modal } from '../Modal'
import { StockUpType } from '@/types/stock-up';
import { cn } from '@/lib/utils';
import { Inbox, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: StockUpType) => void;
}

export const FormTypeModal = ({ isOpen, onClose, onSelect }: Props) => {
  const typeOpts = [
    { id: StockUpType.INBOUND, label: "Nhập hàng (Inbound)" },
    { id: StockUpType.DISPOSAL, label: "Xuất hủy (Disposal)" },
  ]
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Chọn loại phiếu' wrapperClassName='top-1/4'>
      <div className="grid grid-cols-1 gap-4 p-4">
        {typeOpts.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              onSelect(type.id)
              onClose()
            }}
            className={cn(
              "p-6 border-2 border-transparent rounded-[32px] flex items-center gap-6 group transition-all text-left",
              type.id === StockUpType.INBOUND ? "bg-blue-50 dark:bg-blue-900/20 hover:border-blue-500" : "bg-rose-50 dark:bg-rose-900/20 hover:border-rose-500"
            )}
          >
            <div
              className={cn(
                "w-16 h-16 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
                type.id === StockUpType.INBOUND ? "bg-blue-600" : "bg-rose-600"
              )}>
              {type.id === StockUpType.INBOUND ? <Inbox size={24} /> : <Trash2 size={24} />}
            </div>
            <div className="flex-1">
              <h4 className={cn(
                "text-xl font-black uppercase tracking-tight",
                type.id === StockUpType.INBOUND ? "text-blue-700 dark:text-blue-400" : "text-rose-700 dark:text-rose-400"
              )}>
                {type.label}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {type.id === StockUpType.INBOUND ? "Tiếp nhận hàng hóa từ NPP hoặc NCC." : "Hạch toán hàng hỏng, hết hạn, thất thoát."}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  )
}
