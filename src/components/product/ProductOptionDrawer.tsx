import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/Drawer';
import { Product, ProductOption, ProductVariant } from '@/types/product';
import { Button } from '@/components/Button';
import { productService } from '@/lib/api/medusa/productService';
import { cn } from '@/lib/utils';

interface ProductOptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  variants: ProductVariant[];
  option: ProductOption | null;
  onUpdate: () => void;
}

export const ProductOptionDrawer: React.FC<ProductOptionDrawerProps> = ({
  isOpen,
  onClose,
  product,
  variants,
  option,
  onUpdate
}) => {
  const [title, setTitle] = useState('');
  const [variations, setVariations] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && option) {
      setTitle(option.title);

      // Extract unique values for this option
      const uniqueVals = new Set<string>();
      if (variants) {
        variants.forEach(v => {
          const opt = v.options?.find(o => o.option_id === option.id);
          if (opt?.value) uniqueVals.add(opt.value);
        });
      }
      if (uniqueVals.size === 0 && option.values) {
        option.values.forEach(v => uniqueVals.add(v.value));
      }

      setVariations(Array.from(uniqueVals).join(', '));
    }
  }, [isOpen, option, variants]);

  const handleSave = async () => {
    if (!option) return;
    setLoading(true);
    try {
      const valuesArray = variations
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v !== '');

      // 1. Update Option (Title & potentially values if supported by API)
      await productService.updateOption(product.id, option.id, {
        title: title.trim(),
        values: valuesArray.length > 0 ? valuesArray : undefined
      });

      // Note: In a real scenario, renaming existing values might still require 
      // updating variants if Medusa doesn't auto-handle the link.
      // But for "similar to create", this follows the same pattern.

      onUpdate();
      onClose();
    } catch (e) {
      console.error('Failed to update option:', e);
      alert('Không thể cập nhật Option. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-400 shadow-sm";
  const labelClass = "text-[11px] font-black text-slate-400 dark:text-slate-500 mb-2 block uppercase tracking-widest";

  if (!option) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa Option"
      width="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Hủy</Button>
          <Button onClick={handleSave} disabled={loading || !title.trim()}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div className="flex flex-col">
          <label className={labelClass}>Tên Option</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={cn(inputClass, "h-10 text-xs")}
            placeholder="Ví dụ: Màu sắc"
            autoFocus
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Các giá trị (cách nhau bởi dấu phẩy)</label>
          <input
            type="text"
            value={variations}
            onChange={(e) => setVariations(e.target.value)}
            className={cn(inputClass, "h-10 text-xs")}
            placeholder="Ví dụ: Đỏ, Xanh, Vàng"
          />
        </div>
      </div>
    </Drawer>
  );
};
