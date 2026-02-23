'use client';

import React, { useState, useEffect } from 'react';
import { Drawer } from './Drawer';
import { Plus, Trash2, Key, Type, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Metadata } from '@/types/metadata';

interface MetadataItem {
  key: string;
  value: string;
  id: string;
}

interface MetadataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metadata?: Metadata;
  onSave: (metadata: Metadata) => void;
  title?: string;
  description?: string;
}


export function MetadataDrawer({
  isOpen,
  onClose,
  metadata = {},
  onSave,
  title = "QUẢN LÝ METADATA",
  description = "Thêm các trường thông tin tùy chỉnh hoặc siêu dữ liệu cho đối tượng này."
}: MetadataDrawerProps) {
  const [items, setItems] = useState<MetadataItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initialItems = Object.entries(metadata || {}).map(([key, value], index) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        id: `item-${index}-${Date.now()}`
      }));

      setItems(initialItems.length > 0 ? initialItems : [{ key: '', value: '', id: `empty-${Date.now()}` }]);
    }
  }, [isOpen, metadata]);

  const addItem = () => {
    setItems([...items, { key: '', value: '', id: `new-${Date.now()}` }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) {
      setItems([{ key: '', value: '', id: `item-cleared-${Date.now()}` }]);
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: 'key' | 'value', value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSave = () => {
    setIsSaving(true);

    const result: Record<string, any> = {};
    items.forEach(item => {
      const trimmedKey = item.key.trim();
      const trimmedValue = item.value.trim();

      if (trimmedKey) {
        let finalValue: any = trimmedValue;

        try {
          if ((trimmedValue.startsWith('{') && trimmedValue.endsWith('}')) ||
            (trimmedValue.startsWith('[') && trimmedValue.endsWith(']'))) {
            finalValue = JSON.parse(trimmedValue);
          } else if (trimmedValue.toLowerCase() === 'true') {
            finalValue = true;
          } else if (trimmedValue.toLowerCase() === 'false') {
            finalValue = false;
          } else if (!isNaN(Number(trimmedValue)) && trimmedValue !== '') {
            finalValue = Number(trimmedValue);
          }
        } catch (e) {
        }

        result[trimmedKey] = finalValue;
      }
    });

    setTimeout(() => {
      onSave(result);
      setIsSaving(false);
      onClose();
    }, 400);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={Key}
      width="lg"
      footer={
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            className="rounded-2xl"
          >
            HỦY
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSave}
            loading={isSaving}
            className="rounded-2xl"
          >
            LƯU METADATA
          </Button>
        </div>
      }
    >
      <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thành phần mở rộng</h4>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
              {items.filter(i => i.key.trim()).length} Items
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl transition-all hover:border-emerald-200 dark:hover:border-emerald-900/30 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                      <Key size={10} className="text-emerald-500" /> Khóa (Key)
                    </label>
                    <input
                      type="text"
                      value={item.key}
                      onChange={(e) => updateItem(item.id, 'key', e.target.value)}
                      placeholder="vd: color, code..."
                      className="w-full h-10 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-4 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                      <Type size={10} className="text-blue-500" /> Giá trị (Value)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                        placeholder="Giá trị..."
                        className="flex-1 h-10 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-4 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-900/10 text-rose-500 transition-all hover:bg-rose-500 hover:text-white group-hover:opacity-100 md:opacity-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-3 text-xs font-black text-slate-400 hover:text-emerald-500 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Plus size={18} />
            </div>
            THÊM TRƯỜNG DỮ LIỆU MỚI
          </button>
        </div>

        <div className="mt-auto p-5 bg-amber-50/50 dark:bg-amber-900/5 border border-amber-100/50 dark:border-amber-900/10 rounded-3xl flex gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
            <AlertCircle size={20} className="text-amber-600" />
          </div>
          <div className="space-y-1">
            <h5 className="text-[10px] font-black text-amber-800 dark:text-amber-500 uppercase tracking-widest">Hướng dẫn xử lý</h5>
            <p className="text-[11px] font-bold text-amber-700/70 dark:text-amber-500/60 leading-relaxed uppercase tracking-tighter">
              Metadata chấp nhận chuỗi (String), số (Number), Boolean và cả JSON Object. Hệ thống sẽ tự động định dạng kiểu dữ liệu khi bạn lưu.
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
