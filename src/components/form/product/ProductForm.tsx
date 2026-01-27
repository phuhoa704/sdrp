
import React, { useState, useEffect } from 'react';
import {
  Camera, ChevronDown, HelpCircle,
  Settings, Info,
  Package, Banknote,
  Beaker, ArrowLeft, Save
} from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface ProductFormProps {
  onCancel: () => void;
  onSave: (product: Product) => void;
  initialData?: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onCancel, onSave, initialData }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'desc'>('info');
  const [formData, setFormData] = useState<Partial<Product>>({
    id: 'Tự động',
    name: '',
    barcode: '',
    category: '',
    brand: '',
    cost_price: 0,
    price: 0,
    current_stock: 0,
    min_stock: 0,
    max_stock: 999999999,
    location: '',
    weight: 0,
    weight_unit: 'g',
    is_selling_directly: true,
    active_ingredient: '',
    image_style: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalId = formData.id === 'Tự động' ? `PRD-${Math.floor(Math.random() * 10000)}` : formData.id;
    onSave({
      ...formData,
      id: finalId,
      active_ingredient: formData.active_ingredient || 'N/A',
      regulatory_doc: 'Verified',
      expiry_date: new Date().toISOString().split('T')[0]
    } as Product);
  };

  const inputClass = "w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-300 shadow-sm";
  const labelClass = "text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-2 block uppercase tracking-tight";
  const sectionTitleClass = "text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3";

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-800">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {initialData ? 'Cập nhật hàng hóa' : 'Thêm hàng hóa mới'}
            </h1>
            <p className="text-slate-500 font-medium">Thiết lập thông tin sản phẩm và định mức tồn kho SDRP</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="px-8 rounded-2xl h-14 font-bold border-slate-200" onClick={onCancel}>HỦY BỎ</Button>
          <Button className="px-12 rounded-2xl h-14 font-black shadow-xl shadow-primary/20" icon={<Save size={20} />} onClick={handleSubmit}>LƯU THÔNG TIN</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h3 className={sectionTitleClass}><Info className="text-primary" /> Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Tên sản phẩm <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: SuperKill 500WP"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Mã hàng (ID)</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Nhóm hàng</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                    >
                      <option value="">Chọn nhóm hàng</option>
                      <option value="Thuốc trừ sâu">Thuốc trừ sâu</option>
                      <option value="Phân bón lá">Phân bón lá</option>
                      <option value="Thuốc trừ bệnh">Thuốc trừ bệnh</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Mã vạch (Barcode)</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </section>

          <hr className="dark:border-slate-800" />

          <section>
            <h3 className={sectionTitleClass}><Banknote className="text-emerald-500" /> Giá vốn & Giá bán</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <label className={labelClass}>Giá vốn (Ước tính)</label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={formData.cost_price}
                    onChange={e => setFormData({ ...formData, cost_price: Number(e.target.value) })}
                    className={`${inputClass} text-right font-black text-lg`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">VNĐ</span>
                </div>
              </Card>
              <Card className="p-6 bg-primary/5 border-2 border-primary/20 shadow-sm">
                <label className={labelClass}>Giá bán lẻ</label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={`${inputClass} text-right font-black text-lg text-primary`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">VNĐ</span>
                </div>
              </Card>
            </div>
          </section>

          <hr className="dark:border-slate-800" />

          <section>
            <h3 className={sectionTitleClass}><Package className="text-amber-500" /> Quản lý kho vận</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Tồn kho hiện tại</label>
                <input
                  type="number"
                  value={formData.current_stock}
                  onChange={e => setFormData({ ...formData, current_stock: Number(e.target.value) })}
                  className={`${inputClass} font-black`}
                />
              </div>
              <div>
                <label className={labelClass}>Định mức tối thiểu</label>
                <input
                  type="number"
                  value={formData.min_stock}
                  onChange={e => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                  className={`${inputClass} text-rose-500 font-bold`}
                />
              </div>
              <div>
                <label className={labelClass}>Định mức tối đa</label>
                <input
                  type="number"
                  value={formData.max_stock}
                  onChange={e => setFormData({ ...formData, max_stock: Number(e.target.value) })}
                  className={`${inputClass} text-emerald-500 font-bold`}
                />
              </div>
            </div>
          </section>

          <hr className="dark:border-slate-800" />

          <section>
            <h3 className={sectionTitleClass}><Beaker className="text-blue-500" /> Thành phần & Công dụng</h3>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Hoạt chất chính</label>
                <input
                  type="text"
                  value={formData.active_ingredient}
                  onChange={e => setFormData({ ...formData, active_ingredient: e.target.value })}
                  placeholder="VD: Imidacloprid 25%, Azoxystrobin..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Mô tả chi tiết & Hướng dẫn sử dụng</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả công dụng, liều lượng pha, thời gian cách ly..."
                  className={`${inputClass} h-48 py-4 resize-none leading-relaxed font-medium`}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section>
            <label className={labelClass}>Hình ảnh sản phẩm</label>
            <div className="aspect-square bg-white dark:bg-slate-800 rounded-[40px] border-4 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-10 group cursor-pointer hover:border-primary transition-all relative overflow-hidden shadow-sm">
              <img src={formData.image_style} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform opacity-40" alt="" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-[24px] flex items-center justify-center shadow-2xl mb-4 text-primary border border-slate-100 dark:border-slate-600">
                  <Camera size={40} />
                </div>
                <p className="text-sm font-black uppercase text-slate-700 dark:text-white">TẢI ẢNH LÊN</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Hỗ trợ JPG, PNG (Max 5MB)</p>
              </div>
            </div>
          </section>

          <Card className="p-8 bg-slate-900 text-white border-none shadow-2xl rounded-[40px] space-y-8">
            <div className="flex items-center gap-3">
              <Settings size={24} className="text-emerald-400" />
              <h4 className="font-black uppercase tracking-tight">Cấu hình nâng cao</h4>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black opacity-60 uppercase tracking-widest block mb-2">Vị trí trong kho</label>
                <div className="relative">
                  <select
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 outline-none text-sm font-bold text-white appearance-none pr-10 cursor-pointer"
                  >
                    <option value="" className="text-slate-800">Chọn kệ hàng</option>
                    <option value="Kệ A1" className="text-slate-800">Kệ A1 - Thuốc trừ sâu</option>
                    <option value="Kệ B2" className="text-slate-800">Kệ B2 - Phân bón</option>
                    <option value="Kho sau" className="text-slate-800">Kho lưu trữ sau</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <HelpCircle size={20} className="text-emerald-400" />
                  <span className="text-sm font-bold uppercase tracking-tighter">Bán trực tiếp</span>
                </div>
                <input
                  type="checkbox"
                  className="w-6 h-6 rounded-lg border-white/20 text-primary focus:ring-offset-slate-900"
                  checked={formData.is_selling_directly}
                  onChange={e => setFormData({ ...formData, is_selling_directly: e.target.checked })}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-xs font-medium text-emerald-100/50 italic leading-relaxed">
                * Sản phẩm sau khi lưu sẽ được đồng bộ ngay lập tức với hệ thống POS tại quầy và báo cáo tồn kho trung tâm.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
