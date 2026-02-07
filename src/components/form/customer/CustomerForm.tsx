import React, { useEffect, useState } from 'react'
import { Customer } from '@/types/customer';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components';
import { cn } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';

interface CustomerFormProps {
  initialData?: Customer | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const CustomerForm = ({ initialData, onSave, onCancel, loading }: CustomerFormProps) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    company_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    metadata: {}
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        company_name: initialData.company_name || '',
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        phone: initialData.phone || '',
        metadata: {}
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
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
              {initialData ? 'Cập nhật thông tin khách hàng' : 'Thêm khách hàng mới'}
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {initialData ? 'Chỉnh sửa thông tin khách hàng' : 'Tạo khách hàng mới'}
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
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight">
            Thông tin cơ bản
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="VD: example@gmail.com"
                className={cn(inputClass, errors.email && "border-rose-500 focus:ring-rose-500/10")}
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">{errors.email}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>
                  Họ
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => {
                    setFormData({ ...formData, first_name: e.target.value });
                    if (errors.first_name) setErrors({ ...errors, first_name: '' });
                  }}
                  placeholder="VD: Nguyễn"
                  className={cn(inputClass, errors.first_name && "border-rose-500 focus:ring-rose-500/10")}
                />
                {errors.first_name && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">{errors.first_name}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  Tên
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => {
                    setFormData({ ...formData, last_name: e.target.value });
                    if (errors.last_name) setErrors({ ...errors, last_name: '' });
                  }}
                  placeholder="VD: Văn A"
                  className={cn(inputClass, errors.last_name && "border-rose-500 focus:ring-rose-500/10")}
                />
                {errors.last_name && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">{errors.last_name}</p>
                )}
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="VD: 0123456789"
                className={cn(inputClass, errors.phone && "border-rose-500 focus:ring-rose-500/10")}
              />
              {errors.phone && (
                <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>
                Tên công ty
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => {
                  setFormData({ ...formData, company_name: e.target.value });
                  if (errors.company_name) setErrors({ ...errors, company_name: '' });
                }}
                placeholder="VD: Công ty TNHH ABC"
                className={cn(inputClass, errors.company_name && "border-rose-500 focus:ring-rose-500/10")}
              />
              {errors.company_name && (
                <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">{errors.company_name}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
