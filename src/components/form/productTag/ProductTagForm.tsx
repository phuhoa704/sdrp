import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { ProductTag } from '@/types/product';

interface ProductTagFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
  initialData?: ProductTag | null;
  loading?: boolean;
}

export const ProductTagForm: React.FC<ProductTagFormProps> = ({
  onCancel,
  onSave,
  initialData,
  loading
}) => {
  const [formData, setFormData] = useState({
    value: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        value: initialData.value || '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const newErrors: Record<string, string> = {};
    if (!formData.value.trim()) {
      newErrors.value = 'Vui lòng nhập tên thẻ sản phẩm';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const inputClass = "w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-400 shadow-sm";
  const labelClass = "text-[11px] font-black text-slate-400 dark:text-slate-500 mb-2 block uppercase tracking-widest";

  return (
    <div className="min-h-screen px-4 animate-fade-in relative z-50">
      <div className="sticky top-0 z-40 -mx-6 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-800"
          >
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {initialData ? 'Cập nhật thẻ sản phẩm' : 'Thêm thẻ sản phẩm mới'}
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {initialData ? 'Chỉnh sửa thông tin thẻ sản phẩm' : 'Tạo thẻ sản phẩm mới'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="h-12 rounded-2xl"
            onClick={onCancel}
          >
            HỦY BỎ
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
            icon={<CheckCircle2 size={16} />}
            className="h-12 rounded-2xl"
          >
            {loading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>
                Tên thẻ sản phẩm <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => {
                  setFormData({ ...formData, value: e.target.value });
                  if (errors.value) setErrors({ ...errors, value: '' });
                }}
                placeholder="VD: Website, Mobile App, Cửa hàng..."
                className={cn(inputClass, errors.name && "border-rose-500 focus:ring-rose-500/10")}
              />
              {errors.name && (
                <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">{errors.name}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
