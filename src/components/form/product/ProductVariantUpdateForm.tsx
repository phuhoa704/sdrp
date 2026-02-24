import React, { useState } from 'react';
import { Tag, Banknote, Save, Check } from 'lucide-react';
import { ProductImage, ProductVariant, ProductVariantUpdatePayload } from '@/types/product';
import { Button } from '@/components/Button';
import { cn, formatDisplayNumber, parseDisplayNumber } from '@/lib/utils';

interface ProductVariantUpdateFormProps {
  variant: ProductVariant;
  onSave: (payload: ProductVariantUpdatePayload) => Promise<void>;
  loading?: boolean;
  currentImageIds: string[];
  productImages: ProductImage[];
}

export const ProductVariantUpdateForm: React.FC<ProductVariantUpdateFormProps> = ({
  variant,
  onSave,
  loading,
  currentImageIds,
  productImages
}) => {
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(currentImageIds);
  const [sku, setSku] = useState(variant.sku || '');
  const [price, setPrice] = useState(
    variant.prices?.find(p => p.currency_code === 'vnd')?.amount ||
    (variant.metadata?.price as number) || 0
  );

  const toggleImage = (imageId: string) => {
    setSelectedImageIds(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ProductVariantUpdatePayload = {
      sku: sku || null,
      prices: [
        {
          currency_code: 'vnd',
          amount: price,
          id: variant.prices?.find(p => p.currency_code === 'vnd')?.id as string,
          variant_id: variant.id,
          min_quantity: null,
          max_quantity: null,
          created_at: '',
          updated_at: '',
          deleted_at: null
        }
      ],
      selectedImageIds
    };

    onSave(payload);
  };

  const labelClass = "text-[11px] font-black text-slate-400 dark:text-slate-500 mb-2 block uppercase tracking-widest";
  const inputClass = "w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-400 shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className={labelClass}>
          Chọn ảnh cho biến thể ({selectedImageIds.length}/{productImages.length})
        </label>

        {productImages.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-bold text-slate-400">Sản phẩm chưa có ảnh nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {productImages.map((image) => {
              const isSelected = selectedImageIds.includes(image.id);
              return (
                <div
                  key={image.id}
                  onClick={() => toggleImage(image.id)}
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-4",
                    isSelected
                      ? "border-primary shadow-xl shadow-primary/20 scale-105"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <img
                    src={image.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  <div
                    className={cn(
                      "absolute inset-0 transition-all duration-300",
                      isSelected
                        ? "bg-primary/20"
                        : "bg-black/0 hover:bg-black/10"
                    )}
                  />

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                      <Check size={20} className="text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="space-y-6">
        <div>
          <label className={labelClass}>Mã SKU</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Tag size={16} />
            </div>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="VD: SKU-123456"
              className={cn(inputClass, "pl-11")}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Giá bán (VNĐ)</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Banknote size={16} />
            </div>
            <input
              type="text"
              value={formatDisplayNumber(price)}
              onChange={(e) => setPrice(parseDisplayNumber(e.target.value))}
              placeholder="0"
              className={cn(inputClass, "pl-11 pr-12 text-right font-black text-primary text-lg")}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">đ</span>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
          icon={<Save size={20} />}
          className="h-14 rounded-2xl font-black shadow-xl shadow-primary/20"
        >
          {loading ? 'ĐANG LƯU...' : 'CẬP NHẬT BIẾN THỂ'}
        </Button>
      </div>
    </form>
  );
};


