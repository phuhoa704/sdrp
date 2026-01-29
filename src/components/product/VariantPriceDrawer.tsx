import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/Drawer';
import { ProductVariant, Product } from '@/types/product';
import { Button } from '@/components/Button';
import { productService } from '@/lib/api/medusa/productService';

interface VariantPriceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  variant: ProductVariant;
  onUpdate: () => void;
}

export const VariantPriceDrawer: React.FC<VariantPriceDrawerProps> = ({ isOpen, onClose, product, variant, onUpdate }) => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && variant && variant.prices) {
      const initialPrices: Record<string, number> = {};
      variant.prices.forEach(p => {
        if (p.currency_code) {
          initialPrices[p.currency_code] = p.amount;
        }
      });
      setPrices(initialPrices);
    }
  }, [variant, isOpen]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const pricesPayload = Object.entries(prices).map(([code, amount]) => ({
        currency_code: code,
        amount: amount
      }));

      await productService.batchVariants(product.id, {
        update: [{
          id: variant.id,
          prices: pricesPayload
        }]
      });

      onUpdate();
      onClose();
    } catch (e) {
      console.error('Failed to update variant prices:', e);
      alert('Failed to update prices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa giá"
      width="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Hủy</Button>
          <Button onClick={handleSave} disabled={loading || Object.keys(prices).length === 0}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 mb-6">
          <h3 className="text-sm font-bold text-slate-300 mb-1">{variant.title}</h3>
          <p className="text-xs text-slate-500">{variant.sku}</p>
        </div>

        {Object.keys(prices).length > 0 ? (
          Object.entries(prices).map(([code, amount]) => (
            <div key={code} className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-right w-full flex justify-between">
                <span>{code.toUpperCase()}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setPrices({ ...prices, [code]: parseFloat(e.target.value) || 0 })}
                  className="w-full !rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-white text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold uppercase">{code}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">Biến thể này chưa có giá nào.</p>
            <p className="text-slate-600 text-xs mt-1">Vui lòng thêm giá trong trang quản lý chi tiết.</p>
          </div>
        )}
      </div>
    </Drawer>
  );
};
