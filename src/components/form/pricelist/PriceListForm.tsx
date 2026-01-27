'use client'

import React, { useState } from 'react';
import { ArrowLeft, Clock, Search, ChevronDown } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PriceList } from '@/types/price';

interface PriceListFormProps {
  onCancel: () => void;
  onSave: (pl: PriceList) => void;
}

export const PriceListForm: React.FC<PriceListFormProps> = ({ onCancel, onSave }) => {
  const [type, setType] = useState<'discount' | 'override'>('discount');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [title, setTitle] = useState("Soft opening");
  const [description, setDescription] = useState("Chương trình khai trương, giảm toàn cửa hàng 20%");

  const inputStyle = "w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium dark:text-white transition-all";
  const labelStyle = "text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-2 block";
  const subLabelStyle = "text-[11px] text-slate-400 font-medium mb-4 block";

  const handleSave = () => {
    onSave({
      id: `PL${Math.floor(Math.random() * 1000)}`,
      title,
      type,
      status,
      description,
      itemCount: 0,
      createdAt: new Date().toLocaleDateString('vi-VN')
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-fade-in space-y-12">
      <div className="space-y-2">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Tạo bảng giá</h1>
        </div>
        <p className="text-slate-500 font-medium ml-12">Tạo một bảng giá mới để quản lý giá của sản phẩm.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className={labelStyle}>Loại</label>
          <span className={subLabelStyle}>Chọn loại bảng giá bạn muốn tạo.</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setType('discount')}
            className={`p-6 rounded-[20px] border-2 cursor-pointer transition-all flex gap-4 ${type === 'discount' ? 'bg-blue-50/30 border-blue-500 ring-2 ring-blue-500/10' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${type === 'discount' ? 'border-blue-500' : 'border-slate-300'}`}>
              {type === 'discount' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-white">Giảm giá</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Giảm giá là những thay đổi giá tạm thời cho sản phẩm.</p>
            </div>
          </div>

          <div
            onClick={() => setType('override')}
            className={`p-6 rounded-[20px] border-2 cursor-pointer transition-all flex gap-4 ${type === 'override' ? 'bg-blue-50/30 border-blue-500 ring-2 ring-blue-500/10' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${type === 'override' ? 'border-blue-500' : 'border-slate-300'}`}>
              {type === 'override' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-white">Ghi đè</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Ghi đè thường được dùng để tạo giá dành riêng cho khách hàng.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className={labelStyle}>Tiêu đề</label>
          <input
            type="text"
            className={inputStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className={labelStyle}>Trạng thái</label>
          <div className="relative">
            <select
              className={`${inputStyle} appearance-none pr-10`}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className={labelStyle}>Mô tả</label>
          <textarea
            className={`${inputStyle} h-24 py-4 resize-none`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <hr className="dark:border-slate-800" />

      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-sm">
            <label className={labelStyle}>Bảng giá có ngày bắt đầu không? (Optional)</label>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Lên lịch để bảng giá kích hoạt trong tương lai.</p>
          </div>
          <div className="relative flex-1 md:max-w-xs">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Clock size={18} /></div>
            <input type="text" placeholder="--:-- DD/MM/YYYY" className={`${inputStyle} pl-12 bg-white dark:bg-slate-900`} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-sm">
            <label className={labelStyle}>Bảng giá có ngày hết hạn không? (Optional)</label>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Lên lịch để bảng giá ngừng hoạt động trong tương lai.</p>
          </div>
          <div className="relative flex-1 md:max-w-xs">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Clock size={18} /></div>
            <input type="text" placeholder="--:-- DD/MM/YYYY" className={`${inputStyle} pl-12 bg-white dark:bg-slate-900`} />
          </div>
        </div>
      </div>

      <hr className="dark:border-slate-800" />

      <div className="space-y-6">
        <div>
          <label className={labelStyle}>Khả dụng cho khách hàng (Optional)</label>
          <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">Chọn nhóm khách hàng mà bảng giá sẽ áp dụng.</p>
        </div>
        <Card noPadding className="p-4 bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <div className="flex gap-4">
            <input type="text" placeholder="Nhóm khách hàng" className={`${inputStyle} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex-[0.5]`} />
            <input type="text" placeholder="Trong" className={`${inputStyle} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex-1`} />
          </div>
          <div className="flex gap-4">
            <div className="relative flex-1 group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Tìm kiếm nhóm khách hàng" className={`${inputStyle} pl-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800`} />
            </div>
            <button className="px-6 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">Duyệt</button>
          </div>
        </Card>
      </div>

      <div className="pt-12 flex justify-end gap-4 border-t dark:border-slate-800">
        <Button variant="secondary" className="px-10 rounded-2xl" onClick={onCancel}>Hủy bỏ</Button>
        <Button className="px-14 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20" onClick={handleSave}>Lưu bảng giá</Button>
      </div>
    </div>
  );
};
