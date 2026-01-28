
import React from 'react';
import { ShoppingCart, Droplets } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Product } from '@/types/product';

interface ProductRowProps {
    product: Product;
    showAction?: boolean;
    showDosage?: boolean;
    onAddToCart?: (p: Product, variant: any) => void;
    onClick?: () => void;
    themeColor?: 'green' | 'blue';
}

export const ProductRow: React.FC<ProductRowProps> = ({ product, showAction, showDosage, onAddToCart, onClick, themeColor = 'green' }) => {
    const primaryColor = themeColor === 'green' ? '#22C55E' : '#2F80ED';
    const borderColor = themeColor === 'green' ? 'border-green-50/50 dark:border-slate-800/50' : 'border-blue-50/50 dark:border-slate-800/50';
    const bgColor = themeColor === 'green' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20';

    return (
        <Card className={`flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 ${borderColor} shadow-sm transition-all`} noPadding onClick={onClick}>
            <div className="p-3 pr-0"><img src={product.thumbnail || ""} className="w-16 h-16 rounded-xl object-cover border dark:border-slate-700" alt={product.title} /></div>
            <div className="flex-1 py-3 pr-4 text-left">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-[#111827] dark:text-slate-100 text-sm truncate">{product.title}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">{product.variants?.[0]?.metadata?.active_ingredient}</p>
                    </div>
                    <span className="font-bold text-sm shrink-0 ml-2" style={{ color: primaryColor }}>{product.variants?.[0]?.prices?.[0]?.amount.toLocaleString()}đ</span>
                </div>
                {showDosage && <div className={`mt-2 flex items-center gap-2 ${bgColor} w-fit px-2 py-1 rounded-md transition-colors`}><Droplets size={10} style={{ color: primaryColor }} /><span className="text-[10px] font-bold" style={{ color: primaryColor }}>20ml / bình</span></div>}
                {showAction && (
                    <div className="mt-2 flex justify-end">
                        <Button size="sm" className="h-8 text-[10px] px-3 rounded-full shadow-sm" icon={<ShoppingCart size={12} />} onClick={(e) => { e.stopPropagation(); onAddToCart?.(product, { quantity: 1 }); }}>
                            Thêm
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};
