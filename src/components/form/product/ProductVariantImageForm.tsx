'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/Button';
import { ProductImage } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductVariantImageFormProps {
    productImages: ProductImage[];
    currentImageIds: string[];
    onSave: (selectedImageIds: string[]) => Promise<void>;
    loading?: boolean;
}

export const ProductVariantImageForm: React.FC<ProductVariantImageFormProps> = ({
    productImages,
    currentImageIds,
    onSave,
    loading
}) => {
    const [selectedImageIds, setSelectedImageIds] = useState<string[]>(currentImageIds);
    const [isSaving, setIsSaving] = useState(false);

    const toggleImage = (imageId: string) => {
        setSelectedImageIds(prev =>
            prev.includes(imageId)
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(selectedImageIds);
        } finally {
            setIsSaving(false);
        }
    };

    const labelClass = "text-[11px] font-black text-slate-400 dark:text-slate-500 mb-3 block uppercase tracking-widest";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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

                                    {/* Selection Overlay */}
                                    <div
                                        className={cn(
                                            "absolute inset-0 transition-all duration-300",
                                            isSelected
                                                ? "bg-primary/20"
                                                : "bg-black/0 hover:bg-black/10"
                                        )}
                                    />

                                    {/* Check Icon */}
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

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                    type="submit"
                    fullWidth
                    loading={isSaving || loading}
                    disabled={isSaving || loading}
                    className="h-14 rounded-2xl font-black shadow-xl shadow-primary/20"
                >
                    {isSaving || loading ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT ẢNH'}
                </Button>
            </div>
        </form>
    );
};
