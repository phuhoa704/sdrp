import { useProducts } from "@/hooks/medusa/useProducts";
import { PriceList } from "@/types/price";
import { ManagePricesInPriceListPayload } from "@/types/price-list";
import { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { Card } from "../Card";
import { Button } from "../Button";
import { Package } from "lucide-react";
import { usePriceListById } from "@/hooks/medusa/usePriceList";
import { formatDisplayNumber, parseDisplayNumber } from "@/lib/utils";

interface EditPricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIds: string[];
  priceList: PriceList;
  onSave: (payload: ManagePricesInPriceListPayload) => void;
  newProductIds?: string[];
}

export const EditPricesModal: React.FC<EditPricesModalProps> = ({
  isOpen,
  onClose,
  productIds,
  priceList,
  onSave,
  newProductIds,
}) => {
  const isAddNewFlow = Array.isArray(newProductIds) && newProductIds.length > 0;

  const { products: existingProducts, loading: existingLoading } = useProducts({
    price_list_id: isAddNewFlow ? undefined : [priceList.id],
    fields: "+variants",
    limit: 9999,
    autoFetch: !isAddNewFlow,
  });

  const { products: newProducts, loading: newLoading } = useProducts({
    id: isAddNewFlow ? newProductIds : undefined,
    fields: "+variants",
    limit: 9999,
    autoFetch: isAddNewFlow,
  });

  const products = isAddNewFlow ? newProducts : existingProducts;
  const loading = isAddNewFlow ? newLoading : existingLoading;

  const { priceList: priceListWithPrices } = usePriceListById(priceList.id, {
    fields:
      "*prices,prices.price_set.variant.id,prices.price_rules.attribute,prices.price_rules.value",
  });

  const [variantPrices, setVariantPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isAddNewFlow) {
      setVariantPrices({});
    } else if (priceListWithPrices?.prices) {
      const initialPrices: Record<string, number> = {};
      priceListWithPrices.prices.forEach((p) => {
        initialPrices[p.variant_id] = p.amount;
      });
      setVariantPrices(initialPrices);
    }
  }, [priceListWithPrices, isAddNewFlow]);

  const handleSave = () => {
    if (isAddNewFlow) {
      const create = Object.entries(variantPrices).map(([variantId, amount]) => ({
        variant_id: variantId,
        amount,
        currency_code: "VND",
      }));
      onSave({ create });
    } else {
      const priceIdByVariant: Record<string, string> = {};
      priceListWithPrices?.prices?.forEach((p) => {
        priceIdByVariant[p.variant_id] = p.id;
      });

      const update = Object.entries(variantPrices)
        .filter(([variantId]) => !!priceIdByVariant[variantId])
        .map(([variantId, amount]) => ({
          id: priceIdByVariant[variantId],
          amount,
          currency_code: "VND",
        }));

      onSave({ update });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAddNewFlow ? "THIẾT LẬP GIÁ SẢN PHẨM MỚI" : "THIẾT LẬP GIÁ BIẾN THỂ"}
      footer={
        <div className="flex justify-end gap-3 pt-6 border-t dark:border-slate-800">
          <Button variant="outline" onClick={onClose} className="rounded-2xl font-black">
            HỦY BỎ
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="rounded-2xl font-black px-10"
          >
            CẬP NHẬT GIÁ
          </Button>
        </div>
      }
      maxWidth="4xl"
    >
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          </div>
        ) : (
          <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4 no-scrollbar">
            {products.map((product) => (
              <Card key={product.id} className="p-6 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Package size={20} className="text-slate-400" />
                  </div>
                  <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">
                    {product.title}
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.variants?.map((v: any) => (
                    <div
                      key={v.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between border dark:border-slate-800/50"
                    >
                      <p className="text-xs font-bold text-slate-500 truncate pr-2">
                        {v.title || "Mặc định"}
                      </p>
                      <div className="relative w-32">
                        <input
                          type="text"
                          className="w-full h-10 pl-3 pr-8 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-700 text-right text-xs font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          value={formatDisplayNumber(variantPrices[v.id] || "")}
                          onChange={(e) =>
                            setVariantPrices({
                              ...variantPrices,
                              [v.id]: parseDisplayNumber(e.target.value),
                            })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">
                          đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};