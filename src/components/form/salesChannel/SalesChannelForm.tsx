import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { SalesChannel } from '@/types/sales-channel';

interface SalesChannelFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
  initialData?: SalesChannel | null;
  loading?: boolean;
}

export const SalesChannelForm: React.FC<SalesChannelFormProps> = ({
  onCancel,
  onSave,
  initialData,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_disabled: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        is_disabled: initialData.is_disabled || false
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên kênh bán hàng';
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
              {initialData ? 'Cập nhật kênh bán hàng' : 'Thêm kênh bán hàng mới'}
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {initialData ? 'Chỉnh sửa thông tin kênh' : 'Tạo kênh bán hàng mới'}
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
                Tên kênh bán hàng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="VD: Website, Mobile App, Cửa hàng..."
                className={cn(inputClass, errors.name && "border-rose-500 focus:ring-rose-500/10")}
              />
              {errors.name && (
                <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về kênh bán hàng..."
                className={cn(inputClass, "h-32 py-4 resize-none")}
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div>
                <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">
                  Trạng thái kênh
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                  {formData.is_disabled ? 'Kênh đang tắt' : 'Kênh đang hoạt động'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_disabled: !formData.is_disabled })}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  !formData.is_disabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                  !formData.is_disabled ? "left-7 shadow-lg" : "left-1"
                )} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
