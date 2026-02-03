import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Camera, ChevronDown,
  Settings, Info,
  Banknote,
  ArrowLeft, Save,
  X, Plus, Check, ChevronRight,
  Layers, Globe, Tag, Box,
} from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useCategories, useSalesChannels, useProductTags, useCollections } from '@/hooks';
import { cn, formatDisplayNumber, parseDisplayNumber } from '@/lib/utils';

interface ProductFormProps {
  onCancel: () => void;
  onSave: (product: any) => void;
  initialData?: Product | null;
  loading?: boolean;
}

interface ProductOption {
  title: string;
  values: string[];
  rawValue?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onCancel, onSave, initialData, loading }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState<any>({
    title: '',
    subtitle: '',
    description: '',
    thumbnail: '',
    has_variants: false,
    category_id: '',
    tag_ids: [] as string[],
    collection_id: '',
    sales_channel_ids: [] as string[],
    price: 0,
    options: [] as ProductOption[],
    variantData: {} as Record<string, { price: number; sku?: string }>
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { categories } = useCategories();
  const { salesChannels } = useSalesChannels();
  const { tags: allTags } = useProductTags();
  const { collections } = useCollections({ limit: 100 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      const options = initialData.options?.map(o => ({
        title: o.title,
        values: o.values.map(v => v.value),
        rawValue: o.values.map(v => v.value).join(', ')
      })) || [];

      const variantData: any = {};
      initialData.variants?.forEach(v => {
        const variantKey = v.options.map(o => o.value).join(' / ') || 'Default';
        variantData[variantKey] = {
          price: (v.prices?.find(p => p.currency_code === 'vnd')?.amount) || (v.metadata?.price as number) || 0,
          sku: v.sku || ''
        };
      });

      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        description: initialData.description || '',
        thumbnail: initialData.thumbnail || '',
        has_variants: (initialData.variants?.length || 0) > 1 || options.length > 0,
        category_id: initialData.categories?.[0]?.id || '',
        tag_ids: initialData.tags?.map(t => t.id) || [],
        collection_id: initialData.collection_id || '',
        sales_channel_ids: initialData.sales_channels?.map(sc => sc.id) || [],
        price: variantData['Default']?.price || 0,
        options,
        variantData
      });
    }
  }, [initialData]);

  // Derived Variants
  const generatedVariants = useMemo(() => {
    if (!formData.has_variants || formData.options.length === 0) return ['Default'];

    const cartesian = (...a: any[][]): any[][] => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
    const optionValues = formData.options.map((o: any) => o.values.length > 0 ? o.values : ['-']);
    const combinations = cartesian(...optionValues);

    return combinations.map(c => Array.isArray(c) ? c.join(' / ') : c);
  }, [formData.options, formData.has_variants]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { title: '', values: [], rawValue: '' }]
    });
  };

  const removeOption = (index: number) => {
    const newOptions = [...formData.options];
    newOptions.splice(index, 1);
    setFormData({ ...formData, options: newOptions });
  };

  const updateOptionTitle = (index: number, title: string) => {
    const newOptions = [...formData.options];
    newOptions[index].title = title;
    setFormData({ ...formData, options: newOptions });
  };

  const updateOptionValues = (index: number, valuesStr: string) => {
    const newOptions = [...formData.options];
    newOptions[index].rawValue = valuesStr;
    newOptions[index].values = valuesStr.split(',').map(v => v.trim()).filter(v => v !== '');
    setFormData({ ...formData, options: newOptions });
  };

  const handleNext = () => {
    if (loading) return;
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tên sản phẩm";
      if (formData.has_variants) {
        if (formData.options.length === 0) newErrors.options = "Vui lòng thêm ít nhất một thuộc tính";
        formData.options.forEach((opt: any, idx: number) => {
          if (!opt.title.trim()) newErrors[`option_${idx}_title`] = "Vui lòng nhập tên thuộc tính";
          if (opt.values.length === 0) newErrors[`option_${idx}_values`] = "Vui lòng nhập ít nhất một giá trị";
        });
      }
    }

    /* Category is now optional as per user request */
    // if (currentStep === 2) {
    //   if (!formData.category_id) newErrors.category_id = "Vui lòng chọn nhóm hàng";
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const newErrors: Record<string, string> = {};
    if (!formData.has_variants) {
      if (formData.price <= 0) newErrors.price = "Giá bán phải lớn hơn 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process final data
    const finalData = {
      ...formData,
      imageFile,
      variants: formData.has_variants ? generatedVariants.map(v => ({
        title: v,
        price: formData.variantData[v]?.price || 0,
        sku: formData.variantData[v]?.sku || ''
      })) : [
        {
          title: 'Default',
          price: formData.price,
          sku: formData.barcode || ''
        }
      ]
    };

    onSave(finalData);
  };

  const inputClass = "w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-400 shadow-sm";
  const labelClass = "text-[11px] font-black text-slate-400 dark:text-slate-500 mb-2 block uppercase tracking-widest";
  const stepCircleClass = (step: number) => cn(
    "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all border-2",
    currentStep === step ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-110" :
      currentStep > step ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 animate-fade-in pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <button onClick={onCancel} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-800">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                {initialData ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bước {currentStep} của 3: {
                  currentStep === 1 ? 'Thông tin chung' :
                    currentStep === 2 ? 'Phân loại & Tổ chức' : 'Giá & Kho vận'
                }</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-3xl border dark:border-slate-800 shadow-sm">
            <div className={stepCircleClass(1)}>{currentStep > 1 ? <Check size={20} /> : '1'}</div>
            <div className="w-8 h-[2px] bg-slate-100 dark:bg-slate-800" />
            <div className={stepCircleClass(2)}>{currentStep > 2 ? <Check size={20} /> : '2'}</div>
            <div className="w-8 h-[2px] bg-slate-100 dark:bg-slate-800" />
            <div className={stepCircleClass(3)}>{'3'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <Card className="p-8 bg-white dark:bg-slate-900 border-none shadow-xl rounded-[40px] relative overflow-hidden">
            {/* Step 1: Product Basics */}
            {currentStep === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 border-b dark:border-slate-800 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Info size={24} /></div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Thông tin cơ bản</h3>
                    <p className="text-xs font-bold text-slate-400">Tên, mô tả và thiết lập biến thể cho sản phẩm</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className={labelClass}>Tên sản phẩm <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => {
                        setFormData({ ...formData, title: e.target.value });
                        if (errors.title) setErrors({ ...errors, title: '' });
                      }}
                      placeholder="VD: SuperKill 500WP"
                      className={cn(inputClass, errors.title && "border-rose-500 focus:ring-rose-500/10")}
                    />
                    {errors.title && <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">{errors.title}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Tiểu đề (Subtitle)</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="Thông tin ngắn gọn..."
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Handle (URL slug)</label>
                      <input
                        type="text"
                        value={formData.handle}
                        onChange={e => setFormData({ ...formData, handle: e.target.value })}
                        placeholder="tudong-sinh-slug"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Mô tả chi tiết</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Mô tả công dụng, liều lượng, hướng dẫn..."
                      className={cn(inputClass, "h-32 py-4 resize-none")}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t dark:border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Layers size={20} /></div>
                      <div>
                        <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Biến thể sản phẩm</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Kích hoạt nếu sản phẩm có nhiều lựa chọn (size, màu, vv...)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, has_variants: !formData.has_variants })}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        formData.has_variants ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                        formData.has_variants ? "left-7 shadow-lg" : "left-1"
                      )} />
                    </button>
                  </div>

                  {formData.has_variants && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      {formData.options.map((opt: any, idx: number) => (
                        <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border dark:border-slate-700 relative group">
                          <button
                            onClick={() => removeOption(idx)}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className={labelClass}>Tên thuộc tính</label>
                              <input
                                value={opt.title}
                                onChange={(e) => {
                                  updateOptionTitle(idx, e.target.value);
                                  if (errors[`option_${idx}_title`]) setErrors({ ...errors, [`option_${idx}_title`]: '' });
                                }}
                                placeholder="VD: Dung tích, Màu sắc..."
                                className={cn(inputClass, "h-10 text-xs", errors[`option_${idx}_title`] && "border-rose-500")}
                              />
                              {errors[`option_${idx}_title`] && <p className="text-[9px] font-bold text-rose-500 mt-1 ml-1">{errors[`option_${idx}_title`]}</p>}
                            </div>
                            <div>
                              <label className={labelClass}>Giá trị (Cách nhau bằng dấu phẩy)</label>
                              <input
                                value={opt.rawValue !== undefined ? opt.rawValue : opt.values.join(', ')}
                                onChange={(e) => {
                                  updateOptionValues(idx, e.target.value);
                                  if (errors[`option_${idx}_values`]) setErrors({ ...errors, [`option_${idx}_values`]: '' });
                                }}
                                placeholder="S, M, L hoặc 500ml, 1L..."
                                className={cn(inputClass, "h-10 text-xs", errors[`option_${idx}_values`] && "border-rose-500")}
                              />
                              {errors[`option_${idx}_values`] && <p className="text-[9px] font-bold text-rose-500 mt-1 ml-1">{errors[`option_${idx}_values`]}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="soft"
                        fullWidth
                        icon={<Plus size={16} />}
                        className="py-6 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 hover:text-primary hover:border-primary"
                        onClick={addOption}
                      >
                        THÊM THUỘC TÍNH MỚI
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Organization */}
            {currentStep === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 border-b dark:border-slate-800 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Box size={24} /></div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Tổ chức hàng hóa</h3>
                    <p className="text-xs font-bold text-slate-400">Phân loại theo danh mục, nhãn và kênh bán hàng</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Nhóm hàng (Category)</label>
                      <div className="relative">
                        <select
                          value={formData.category_id}
                          onChange={e => {
                            setFormData({ ...formData, category_id: e.target.value });
                            if (errors.category_id) setErrors({ ...errors, category_id: '' });
                          }}
                          className={cn(inputClass, "appearance-none pr-10 cursor-pointer", errors.category_id && "border-rose-500")}
                        >
                          <option value="">Chọn nhóm hàng</option>
                          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        {errors.category_id && <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">{errors.category_id}</p>}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Bộ sưu tập (Collection)</label>
                      <div className="relative">
                        <select
                          value={formData.collection_id}
                          onChange={e => setFormData({ ...formData, collection_id: e.target.value })}
                          className={cn(inputClass, "appearance-none pr-10 cursor-pointer")}
                        >
                          <option value="">Không có</option>
                          {collections.map(col => (
                            <option key={col.id} value={col.id}>{col.title}</option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Nhãn sản phẩm (Tags)</label>
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border dark:border-slate-700 shadow-inner">
                      {allTags.map(tag => {
                        const isSelected = formData.tag_ids.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            onClick={() => {
                              const newTags = isSelected
                                ? formData.tag_ids.filter((id: string) => id !== tag.id)
                                : [...formData.tag_ids, tag.id];
                              setFormData({ ...formData, tag_ids: newTags });
                            }}
                            className={cn(
                              "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2",
                              isSelected ? "bg-primary text-white shadow-lg" : "bg-white dark:bg-slate-800 text-slate-400 border dark:border-slate-700"
                            )}
                          >
                            <Tag size={12} />
                            {tag.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Kênh bán hàng (Sales Channels)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {salesChannels.map(sc => {
                        const isSelected = formData.sales_channel_ids.includes(sc.id);
                        return (
                          <button
                            key={sc.id}
                            onClick={() => {
                              const newChannels = isSelected
                                ? formData.sales_channel_ids.filter((id: string) => id !== sc.id)
                                : [...formData.sales_channel_ids, sc.id];
                              setFormData({ ...formData, sales_channel_ids: newChannels });
                            }}
                            className={cn(
                              "p-4 rounded-2xl flex items-center justify-between transition-all border-2 text-left",
                              isSelected ? "bg-emerald-500/5 border-emerald-500 text-emerald-600" : "bg-white dark:bg-slate-800 border-transparent text-slate-400"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isSelected ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-400")}>
                                <Globe size={16} />
                              </div>
                              <span className="text-xs font-black uppercase">{sc.name}</span>
                            </div>
                            {isSelected && <Check size={18} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pricing & Inventory */}
            {currentStep === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 border-b dark:border-slate-800 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Banknote size={24} /></div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Giá & Tồn kho</h3>
                    <p className="text-xs font-bold text-slate-400">Thiết lập đơn giá và số lượng cho từng biến thể</p>
                  </div>
                </div>

                {!formData.has_variants ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClass}>Giá bán lẻ (VNĐ)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formatDisplayNumber(formData.price)}
                          onChange={e => {
                            const val = parseDisplayNumber(e.target.value);
                            setFormData({ ...formData, price: val });
                            if (errors.price) setErrors({ ...errors, price: '' });
                          }}
                          className={cn(inputClass, "text-right font-black text-primary text-xl pr-14", errors.price && "border-rose-500")}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">đ</span>
                        {errors.price && <p className="text-[10px] font-bold text-rose-500 mt-1.5 text-right">{errors.price}</p>}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-hidden border dark:border-slate-800 rounded-[32px] bg-slate-50 dark:bg-slate-900 shadow-inner">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-700">
                          <tr>
                            <th className="px-6 py-4">Biến thể</th>
                            <th className="px-6 py-4 w-40">Giá bán (đ)</th>
                            <th className="px-6 py-4 w-40">SKU</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-800">
                          {generatedVariants.map(vKey => (
                            <tr key={vKey} className="hover:bg-white dark:hover:bg-slate-800/40 transition-colors">
                              <td className="px-6 py-4">
                                <span className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-200">{vKey}</span>
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  value={formatDisplayNumber(formData.variantData[vKey]?.price || 0)}
                                  onChange={e => {
                                    const val = parseDisplayNumber(e.target.value);
                                    setFormData({
                                      ...formData,
                                      variantData: {
                                        ...formData.variantData,
                                        [vKey]: { ...formData.variantData[vKey], price: val }
                                      }
                                    });
                                  }}
                                  className="w-full h-10 px-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-right font-black text-primary text-xs outline-none focus:ring-2 focus:ring-primary/20"
                                />
                              </td>

                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  value={formData.variantData[vKey]?.sku || ''}
                                  onChange={e => setFormData({
                                    ...formData,
                                    variantData: {
                                      ...formData.variantData,
                                      [vKey]: { ...formData.variantData[vKey], sku: e.target.value }
                                    }
                                  })}
                                  placeholder="SKU-AUTO"
                                  className="w-full h-10 px-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-xs font-bold text-slate-400 outline-none focus:ring-2 focus:ring-primary/20"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t dark:border-slate-800">
              <Button
                variant="secondary"
                className="px-8 rounded-2xl h-14 font-bold border-slate-200"
                onClick={currentStep === 1 ? onCancel : handleBack}
              >
                {currentStep === 1 ? 'HỦY BỎ' : 'QUAY LẠI'}
              </Button>

              {currentStep < 3 ? (
                <Button
                  className="px-10 rounded-2xl h-14 font-black shadow-xl shadow-primary/20"
                  onClick={handleNext}
                  icon={<ChevronRight size={20} />}
                >
                  TIẾP THEO
                </Button>
              ) : (
                <Button
                  className="px-10 rounded-2xl h-14 font-black shadow-xl shadow-primary/20"
                  onClick={handleSubmit}
                  icon={<Save size={20} />}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'ĐANG LƯU...' : 'HOÀN TẤT & LƯU'}
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <label className={labelClass}>Hình ảnh đại diện</label>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-white dark:bg-slate-800 rounded-[48px] border-4 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-10 group cursor-pointer hover:border-primary transition-all relative overflow-hidden shadow-sm"
            >
              {formData.thumbnail ? (
                <>
                  <img src={formData.thumbnail} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="p-4 bg-white rounded-2xl text-primary hover:bg-slate-50 transition-all shadow-2xl"
                      >
                        <Camera size={24} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, thumbnail: '' });
                          setImageFile(null);
                        }}
                        className="p-4 bg-white rounded-2xl text-rose-500 hover:bg-slate-50 transition-all shadow-2xl"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-primary group-hover:scale-110 transition-transform">
                    <Camera size={48} />
                  </div>
                  <p className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-widest">TẢI ẢNH LÊN</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">JPG, PNG (MAX 5MB)</p>
                </div>
              )}
            </div>
          </section>

          <Card className="p-8 bg-slate-950 text-white border-none shadow-2xl rounded-[40px] space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/5"><Settings size={24} /></div>
              <div>
                <h4 className="font-black uppercase tracking-tight">Tóm tắt thiết lập</h4>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">SDRP Integrated System</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase">Biến thể</span>
                <span className="text-xs font-black text-emerald-400">{formData.has_variants ? generatedVariants.length : 'Không có'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase">Tags đã chọn</span>
                <span className="text-xs font-black text-emerald-400">{formData.tag_ids.length} nhãn</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase">Kênh hiển thị</span>
                <span className="text-xs font-black text-emerald-400">{formData.sales_channel_ids.length} kênh</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 relative z-10">
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <p className="text-[10px] font-bold dark:text-emerald-100/70 text-emerald-800 italic leading-relaxed text-center">
                  Hệ thống sẽ tự động tạo {formData.has_variants ? generatedVariants.length : 1} biến thể khi bạn nhấn "Hoàn tất".
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
