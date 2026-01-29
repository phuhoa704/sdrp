import React, { useState } from 'react';
import { Drawer } from '@/components/Drawer';
import { Button } from '@/components/Button';
import { productService } from '@/lib/api/medusa/productService';
import { cn } from '@/lib/utils';

interface CreateProductOptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onUpdate: () => void;
}

export const CreateProductOptionDrawer: React.FC<CreateProductOptionDrawerProps> = ({
  isOpen,
  onClose,
  productId,
  onUpdate
}) => {
  const [title, setTitle] = useState('');
  const [variations, setVariations] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset fields when opening
  React.useEffect(() => {
    if (isOpen) {
      setTitle('');
      setVariations('');
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const values = variations
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v !== '');

      await productService.createOption(productId, {
        title: title.trim(),
        values: values.length > 0 ? values : undefined
      });
      onUpdate();
      onClose();
    } catch (e) {
      console.error('Failed to create option:', e);
      alert('Không thể tạo Option. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-400 shadow-sm";
  const labelClass = "text-[11px] font-black text-slate-400 dark:text-slate-500 mb-2 block uppercase tracking-widest";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo mới"
      width="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Hủy</Button>
          <Button onClick={handleSave} disabled={loading || !title.trim()}>
            {loading ? 'Đang lưu...' : 'Lưu'}
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
