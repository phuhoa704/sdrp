'use client'

import React, { useState } from 'react';
import { ArrowLeft, Clock, Search, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PriceList } from '@/types/price';
import { TableView } from '@/components/TableView';
import { useProducts } from '@/hooks/medusa/useProducts';
import { Product, ProductVariant } from '@/types/product';
import { cn } from '@/lib/utils';

interface PriceListFormProps {
  onCancel: () => void;
  onSave: (pl: any) => void;
  isLoading?: boolean;
}

export const PriceListForm: React.FC<PriceListFormProps> = ({ onCancel, onSave, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [type, setType] = useState<'sale' | 'override'>('sale');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [title, setTitle] = useState("Soft opening");
  const [description, setDescription] = useState("Chương trình khai trương, giảm toàn cửa hàng 20%");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [variantPrices, setVariantPrices] = useState<Record<string, { amount: number, currency_code: string }>>({});

  const { products, loading } = useProducts({
    fields: "*,*variants",
    autoFetch: true
  });

  const inputStyle = "w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-slate-800 dark:text-white transition-all";
  const labelStyle = "text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-2 block";
  const subLabelStyle = "text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-4 block";

  const handleProductToggle = (product: Product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const priceListData = {
      title,
      description,
      type,
      status,
      prices: Object.entries(variantPrices).map(([variantId, price]) => ({
        variant_id: variantId,
        amount: price.amount,
        currency_code: price.currency_code,
      }))
    };
    onSave(priceListData);
  };

  const steps = [
    { number: 1, title: 'Thông tin cơ bản' },
    { number: 2, title: 'Chọn sản phẩm' },
    { number: 3, title: 'Thiết lập giá' }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-fade-in space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Tạo bảng giá</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium ml-12">Tạo một bảng giá mới để quản lý giá của sản phẩm.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, idx) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                currentStep >= step.number
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              )}>
                {currentStep > step.number ? <Check size={18} /> : step.number}
              </div>
              <span className={cn(
                "text-sm font-bold",
                currentStep >= step.number ? "text-slate-800 dark:text-white" : "text-slate-400"
              )}>
                {step.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight size={20} className="text-slate-300 dark:text-slate-700" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <div className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className={labelStyle}>Loại</label>
              <span className={subLabelStyle}>Chọn loại bảng giá bạn muốn tạo.</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setType('sale')}
                className={`p-6 rounded-[20px] border-2 cursor-pointer transition-all flex gap-4 ${type === 'sale' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-2 ring-blue-500/10' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${type === 'sale' ? 'border-blue-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {type === 'sale' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-white">Giảm giá</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Giảm giá là những thay đổi giá tạm thời cho sản phẩm.</p>
                </div>
              </div>

              <div
                onClick={() => setType('override')}
                className={`p-6 rounded-[20px] border-2 cursor-pointer transition-all flex gap-4 ${type === 'override' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-2 ring-blue-500/10' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${type === 'override' ? 'border-blue-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {type === 'override' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-white">Ghi đè</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Ghi đè thường được dùng để tạo giá dành riêng cho khách hàng.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelStyle}>Tiêu đề</label>
              <input
                type="text"
                className={inputStyle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className={labelStyle}>Trạng thái</label>
              <div className="relative">
                <select
                  className={`${inputStyle} appearance-none pr-10`}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="active">Hoạt động</option>
                  <option value="draft">Nháp</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className={labelStyle}>Mô tả</label>
              <textarea
                className={`${inputStyle} h-24 py-4 resize-none`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Product Selection */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Chọn sản phẩm</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Chọn các sản phẩm để áp dụng bảng giá này.</p>
          </div>

          <TableView
            columns={[
              { title: "" },
              { title: "Sản phẩm" },
              { title: "Biến thể" },
              { title: "Trạng thái" }
            ]}
            data={products}
            isLoading={loading}
            emptyMessage={{
              title: "Không có sản phẩm",
              description: "Chưa có sản phẩm nào trong hệ thống"
            }}
            renderRow={(product: Product) => (
              <tr key={product.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.some(p => p.id === product.id)}
                    onChange={() => handleProductToggle(product)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-sm text-slate-800 dark:text-white">{product.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{product.variants?.length || 0} biến thể</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    product.status === 'published' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}>
                    {product.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                  </span>
                </td>
              </tr>
            )}
          />
        </div>
      )}

      {/* Step 3: Variant Pricing */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Thiết lập giá</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Nhập giá cho từng biến thể sản phẩm.</p>
          </div>

          <div className="space-y-4">
            {selectedProducts.map(product => (
              <Card key={product.id} className="p-6">
                <h4 className="font-bold text-slate-800 dark:text-white mb-4">{product.title}</h4>
                <div className="space-y-3">
                  {product.variants?.map((variant: ProductVariant) => (
                    <div key={variant.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{variant.title}</p>
                      </div>
                      <div className="w-48">
                        <input
                          type="number"
                          placeholder="Giá"
                          className={inputStyle}
                          value={variantPrices[variant.id]?.amount || ''}
                          onChange={(e) => setVariantPrices({
                            ...variantPrices,
                            [variant.id]: {
                              amount: parseFloat(e.target.value) || 0,
                              currency_code: 'VND'
                            }
                          })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-8 flex justify-between border-t border-slate-200 dark:border-slate-800">
        <Button
          variant="secondary"
          className="px-10 rounded-2xl"
          onClick={currentStep === 1 ? onCancel : handleBack}
        >
          {currentStep === 1 ? 'Hủy bỏ' : 'Quay lại'}
        </Button>
        <Button
          className="px-14 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20"
          onClick={currentStep === 3 ? handleSave : handleNext}
          loading={currentStep === 3 && isLoading}
        >
          {currentStep === 3 ? 'Lưu bảng giá' : 'Tiếp tục'}
        </Button>
      </div>
    </div>
  );
};
