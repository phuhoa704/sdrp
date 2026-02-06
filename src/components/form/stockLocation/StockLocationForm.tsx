import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { StockLocation } from '@/types/stock';

interface StockLocationFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
  initialData?: StockLocation | null;
  loading?: boolean;
}

export const StockLocationForm: React.FC<StockLocationFormProps> = ({
  onCancel,
  onSave,
  initialData,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: {
      address_1: '',
      address_2: '',
      country_code: 'VN',
      city: '',
      phone: '',
      province: '',
      postal_code: '',
      metadata: {}
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        address: {
          address_1: initialData.address?.address_1 || '',
          address_2: initialData.address?.address_2 || '',
          country_code: initialData.address?.country_code || 'VN',
          city: initialData.address?.city || '',
          phone: initialData.address?.phone || '',
          province: initialData.address?.province || '',
          postal_code: initialData.address?.postal_code || '',
          metadata: initialData.address?.metadata || {}
        }
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên vị trí kho';
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
      <div className="-mx-6 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-800"
          >
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {initialData ? 'Cập nhật vị trí kho' : 'Thêm vị trí kho mới'}
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {initialData ? 'Chỉnh sửa thông tin vị trí kho' : 'Tạo vị trí kho mới'}
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

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight">
                Thông tin cơ bản
              </h3>
              <div>
                <label className={labelClass}>
                  Tên vị trí kho <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="VD: Kho trung tâm, Kho chi nhánh 1..."
                  className={cn(inputClass, errors.name && "border-rose-500 focus:ring-rose-500/10")}
                />
                {errors.name && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Address Info */}
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight">
                Địa chỉ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Địa chỉ 1</label>
                  <input
                    type="text"
                    value={formData.address.address_1}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, address_1: e.target.value }
                    })}
                    placeholder="Số nhà, tên đường..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Địa chỉ 2</label>
                  <input
                    type="text"
                    value={formData.address.address_2}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, address_2: e.target.value }
                    })}
                    placeholder="Tòa nhà, tầng..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Thành phố</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                    placeholder="VD: Hồ Chí Minh, Hà Nội..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    value={formData.address.province}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, province: e.target.value }
                    })}
                    placeholder="VD: TP. Hồ Chí Minh..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Mã bưu điện</label>
                  <input
                    type="text"
                    value={formData.address.postal_code}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, postal_code: e.target.value }
                    })}
                    placeholder="VD: 700000..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Mã quốc gia</label>
                  <input
                    type="text"
                    value={formData.address.country_code}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, country_code: e.target.value }
                    })}
                    placeholder="VD: VN, US..."
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.address.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, phone: e.target.value }
                    })}
                    placeholder="VD: 0901234567..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
