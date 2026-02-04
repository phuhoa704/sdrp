import React, { useState, useEffect } from 'react';
import { ProductCategory } from '@/types/product';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';
import { Info, X, Save, ArrowLeft } from 'lucide-react';
import { categoryService } from '@/lib/api/medusa/categoryService';
import { categoryStatusOptions, categoryTypeOptions } from '@/lib/helpers';

interface CategoryFormProps {
  initialData?: ProductCategory | null;
  onCancel: () => void;
  onSave: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onCancel, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    description: '',
    is_active: true,
    is_internal: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        handle: initialData.handle || '',
        description: initialData.description || '',
        is_active: initialData.is_active ?? true,
        is_internal: initialData.is_internal ?? false
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await categoryService.updateCategory(initialData.id, {
          ...formData,
          is_active: formData.is_active ? true : false,
          is_internal: formData.is_internal ? true : false
        });
      } else {
        await categoryService.createCategory({
          ...formData,
          is_active: formData.is_active ? true : false,
          is_internal: formData.is_internal ? true : false
        });
      }
      onSave();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Không thể lưu danh mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-white placeholder:text-slate-600 shadow-sm";
  const labelClass = "text-[11px] font-black text-slate-500 mb-2 block uppercase tracking-widest";
  const selectClass = "w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-white shadow-sm appearance-none cursor-pointer";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            {initialData ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {initialData ? 'Cập nhật thông tin danh mục và tổ chức.' : 'Tạo danh mục mới để tổ chức sản phẩm.'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 hover:text-white transition-all shadow-sm"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="bg-slate-900/50 border-slate-800 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className={labelClass}>Tên danh mục</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
                placeholder="Thuốc trừ sâu"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Handle</label>
                <Info size={12} className="text-slate-600" />
                <span className="text-[10px] text-slate-600 normal-case font-bold">(Optional)</span>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">/</div>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className={cn(inputClass, "pl-8")}
                  placeholder="thuoc-tru-sau"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-1.5 mb-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Description</label>
              <span className="text-[10px] text-slate-600 normal-case font-bold">(Optional)</span>
            </div>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={cn(inputClass, "h-auto py-4 resize-none")}
              placeholder="Mô tả về loại hàng này..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelClass}>Trạng thái</label>
              <div className="relative">
                <select
                  value={formData.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                  className={selectClass}
                >
                  {categoryStatusOptions.map((option, idx) => (
                    <option key={idx} value={`${option.value}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <ArrowLeft size={16} className="-rotate-90" />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Hiển thị</label>
              <div className="relative">
                <select
                  value={formData.is_internal ? 'internal' : 'public'}
                  onChange={(e) => setFormData({ ...formData, is_internal: e.target.value === 'internal' })}
                  className={selectClass}
                >
                  {categoryTypeOptions.map((option, idx) => (
                    <option key={idx} value={`${option.value}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <ArrowLeft size={16} className="-rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-4 pb-20">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all border border-slate-800"
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="h-12 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
            loading={loading}
            icon={<Save size={18} />}
          >
            Lưu
          </Button>
        </div>
      </form>
    </div>
  );
};
