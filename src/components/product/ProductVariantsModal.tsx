import React, { useState } from 'react';
import { Layers, Image as ImageIcon, MoreHorizontal, Search, ChevronLeft, ExternalLink, PenLine, Edit3, Trash2, Plus } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Product, ProductVariant } from '@/types/product';
import { BRIDGE_API_URL } from '@/lib/api/config';
import { Button } from '@/components/Button';
import { productService } from '@/lib/api/medusa/productService';
import { Card } from '@/components/Card';
import { formatCurrency } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { VariantPriceDrawer } from './VariantPriceDrawer';
import { InventoryItemDetail } from './InventoryItemDetail';
import { ProductOptionDrawer } from './ProductOptionDrawer';
import { CreateProductOptionDrawer } from './CreateProductOptionDrawer';
import { ProductOption } from '@/types/product';

interface ProductVariantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  variants: ProductVariant[];
  loading?: boolean;
  onUpdate?: () => void;
}

export const ProductVariantsModal: React.FC<ProductVariantsModalProps> = ({
  isOpen,
  onClose,
  product,
  variants,
  loading,
  onUpdate
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isVariantLoading, setIsVariantLoading] = useState(false);
  const [isPriceDrawerOpen, setIsPriceDrawerOpen] = useState(false);
  const [selectedInventoryItemId, setSelectedInventoryItemId] = useState<string | null>(null);
  const [isOptionDrawerOpen, setIsOptionDrawerOpen] = useState(false);
  const [isCreateOptionDrawerOpen, setIsCreateOptionDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [activeOptionMenuId, setActiveOptionMenuId] = useState<string | null>(null);
  const [isDeleteOptionModalOpen, setIsDeleteOptionModalOpen] = useState(false);
  const [isDeletingOption, setIsDeletingOption] = useState(false);

  const currencyCode = useAppSelector(state => state.products.currencyCode);

  // Reset selected variant when modal closes or product changes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedVariant(null);
    }
  }, [isOpen]);

  const handleVariantClick = async (variantId: string) => {
    if (!product) return;
    setIsVariantLoading(true);
    try {
      const { variant } = await productService.getVariant(product.id, variantId, {
        fields: '*inventory_items,*inventory_items.inventory,*inventory_items.inventory.location_levels,*options,*options.option,*prices,*prices.price_rules,+images.id,+images.url,+images.variants.id'
      });
      setSelectedVariant(variant);
    } catch (error) {
      console.error('Failed to fetch variant details:', error);
    } finally {
      setIsVariantLoading(false);
    }
  };

  const handleDeleteOption = async () => {
    if (!product || !selectedOption) return;
    setIsDeletingOption(true);
    try {
      await productService.deleteOption(product.id, selectedOption.id);
      if (onUpdate) onUpdate();
      setIsDeleteOptionModalOpen(false);
      setSelectedOption(null);
    } catch (error) {
      console.error('Failed to delete option:', error);
      alert('Không thể xóa Option này. Vui lòng thử lại.');
    } finally {
      setIsDeletingOption(false);
    }
  };

  const optionMap = React.useMemo(() => {
    const map = new Map<string, string>();

    if (product?.options) {
      product.options.forEach(opt => {
        map.set(opt.id, opt.title);
      });
    }

    if (map.size === 0 && variants.length) {
      variants.forEach(v => {
        v.options?.forEach(opt => {
          if (opt.option?.id && opt.option?.title) {
            map.set(opt.option.id, opt.option.title);
          }
        });
      });
    }

    return map;
  }, [product, variants]);

  const optionTitles = Array.from(optionMap.values());

  const getOptionValue = (variant: ProductVariant, title: string) => {
    let optionId: string | undefined;
    for (const [id, t] of optionMap.entries()) {
      if (t === title) {
        optionId = id;
        break;
      }
    }

    if (!optionId) return '-';

    const opt = variant.options?.find(o => o.option_id === optionId);
    return opt ? opt.value : '-';
  };

  const renderVariantDetail = () => {
    if (!selectedVariant) return null;

    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedVariant(null)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">{selectedVariant.title}</h2>
            <p className="text-xs text-slate-500 font-bold">Biến thể</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Variant Info */}
            <Card className="bg-slate-900 border-slate-800 p-0 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">SKU</label>
                    <span className="text-sm font-medium text-slate-300">{selectedVariant.sku || '-'}</span>
                  </div>
                  {selectedVariant.options.map(opt => (
                    <div key={opt.id}>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">{opt.option?.title || 'Option'}</label>
                      <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded text-slate-300">{opt.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Media */}
            <Card className="bg-slate-900 border-slate-800 p-0">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-200 text-sm">Media</h3>
                <PenLine size={14} className="text-slate-500" />
              </div>
              <div className="p-8 flex flex-col items-center justify-center text-center">
                {(selectedVariant as any).images?.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4 w-full">
                    {(selectedVariant as any).images.map((img: any) => (
                      <img key={img.id} src={img.url.replace('http://localhost:9000', BRIDGE_API_URL)} className="w-full aspect-square object-cover rounded-lg border border-slate-700" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="mb-2 text-slate-700"><ImageIcon size={48} strokeWidth={1} /></div>
                    <p className="text-slate-400 font-bold text-sm">No media yet</p>
                    <p className="text-slate-600 text-xs">Add media to showcase it in your storefront.</p>
                  </>
                )}
              </div>
            </Card>

            {/* Inventory Items */}
            <Card className="bg-slate-900 border-slate-800 p-0">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-200 text-sm">Hàng tồn kho</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500 bg-slate-900/50 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase">Tên</th>
                      <th className="px-4 py-3 font-bold uppercase">SKU</th>
                      <th className="px-4 py-3 font-bold uppercase">Số lượng</th>
                      <th className="px-4 py-3 font-bold uppercase">Tồn kho</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedVariant.inventory_items?.map((item: any) => {
                      // Inv item logic
                      let available = 0;
                      let locs = 0;
                      item.inventory?.location_levels?.forEach((l: any) => {
                        if (l.available_quantity > 0) {
                          available += l.available_quantity;
                          locs++;
                        }
                      });

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                          onClick={() => {
                            if (item.inventory?.id) {
                              setSelectedInventoryItemId(item.inventory.id);
                            }
                          }}
                        >
                          <td className="px-4 py-3 font-medium text-slate-300 group-hover:text-indigo-400 transition-colors">{item.inventory?.title || selectedVariant.title}</td>
                          <td className="px-4 py-3 text-slate-400">{item.inventory?.sku || '-'}</td>
                          <td className="px-4 py-3 text-slate-400">{item.required_quantity || 1}</td>
                          <td className="px-4 py-3 text-slate-400">
                            {available > 0 ? (
                              <span className="text-slate-300">{available} tại {locs} kho</span>
                            ) : (
                              <span className="text-rose-500">0 tại 0 kho</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <MoreHorizontal size={14} className="text-slate-500" />
                          </td>
                        </tr>
                      )
                    }) || (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Không có kho</td></tr>
                      )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Debug / Extra */}
            <Card className="bg-slate-900 border-slate-800 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800/80 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">Metadata</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">0 keys</span>
              </div>
              <ExternalLink size={14} className="text-slate-500" />
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800/80 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">JSON</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">27 keys</span>
              </div>
              <ExternalLink size={14} className="text-slate-500" />
            </Card>
          </div>

          <div className="col-span-1 space-y-6">
            {/* Prices */}
            <Card className="bg-slate-900 border-slate-800 p-0">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-200 text-sm">Giá</h3>
                <button
                  onClick={() => setIsPriceDrawerOpen(true)}
                  className="p-1 hover:bg-slate-800 rounded transition-colors group"
                  title="Chỉnh sửa giá"
                >
                  <PenLine size={14} className="text-slate-500 group-hover:text-white" />
                </button>
              </div>
              <div className="divide-y divide-slate-800">
                {selectedVariant.prices?.map(price => (
                  <div key={price.id} className="p-4 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">{price.currency_code}</span>
                    <span className="text-sm font-bold text-slate-200">{formatCurrency(price.amount, price.currency_code)}</span>
                  </div>
                ))}
                {(!selectedVariant.prices || selectedVariant.prices.length === 0) && (
                  <div className="p-4 text-center text-slate-500 text-xs text-bold">Chưa có giá</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedVariant ? undefined : "Biến thể"}
      icon={selectedVariant ? undefined : Layers}
      maxWidth="6xl"
      maxHeight='[90vh]'
      showCloseButton={!selectedVariant}
    >
      <div className="p-6">
        {selectedInventoryItemId ? (
          <InventoryItemDetail
            inventoryItemId={selectedInventoryItemId}
            onBack={() => setSelectedInventoryItemId(null)}
          />
        ) : selectedVariant ? renderVariantDetail() : (
          <>
            {product?.options && product.options.length > 0 && (
              <Card className="bg-slate-900 border-slate-800 p-0 overflow-visible mb-8">
                <div className="px-4 py-3 flex justify-between items-center border-b border-slate-800 bg-slate-900/50 rounded-t-[24px]">
                  <h3 className="text-sm font-bold text-slate-200">Options</h3>
                  <button
                    onClick={() => setIsCreateOptionDrawerOpen(true)}
                    className="p-1 hover:bg-slate-800 rounded transition-colors group"
                    title="Thêm Option mới"
                  >
                    <Plus size={14} className="text-slate-500 group-hover:text-white" />
                  </button>
                </div>
                <div className="divide-y divide-slate-800">
                  {product.options.map((option, index) => (
                    <div
                      key={option.id}
                      className={`px-4 py-4 flex items-center justify-between group hover:bg-slate-800/20 transition-colors ${index === product.options.length! - 1 ? 'rounded-b-[24px]' : ''
                        }`}
                    >
                      <div className="flex items-center gap-12">
                        <span className="text-xs font-bold text-slate-400 min-w-[100px]">{option.title}</span>
                        <div className="flex flex-wrap gap-2">
                          {option.values?.map((val) => (
                            <span key={val.id} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                              {val.value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setActiveOptionMenuId(activeOptionMenuId === option.id ? null : option.id)}
                          className="p-1 hover:bg-slate-800 rounded transition-colors group"
                        >
                          <MoreHorizontal size={14} className="text-slate-500 group-hover:text-white" />
                        </button>

                        {activeOptionMenuId === option.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveOptionMenuId(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                              <button
                                onClick={() => {
                                  setSelectedOption(option);
                                  setIsOptionDrawerOpen(true);
                                  setActiveOptionMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-left text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                              >
                                <Edit3 size={12} className="text-blue-500" />
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedOption(option);
                                  setIsDeleteOptionModalOpen(true);
                                  setActiveOptionMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-left text-xs font-bold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 transition-colors border-t border-slate-800"
                              >
                                <Trash2 size={12} />
                                Xóa Option
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="flex items-center justify-end mb-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="h-9 pl-9 pr-4 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors w-64"
                  />
                </div>
                <Button className="h-9 px-4 text-xs font-bold gap-2 bg-white text-black hover:bg-slate-200">
                  Thêm biến thể
                </Button>
              </div>
            </div>

            <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-900/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900">
                    <th className="px-6 py-4">Tiêu đề</th>
                    <th className="px-6 py-4">SKU</th>
                    {optionTitles.map(title => (
                      <th key={title} className="px-6 py-4">{title}</th>
                    ))}
                    <th className="px-6 py-4">Tồn kho</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5 + optionTitles.length} className="px-6 py-12 text-center text-slate-500 text-xs font-bold">
                        Loading variants...
                      </td>
                    </tr>
                  ) : variants.length === 0 ? (
                    <tr>
                      <td colSpan={5 + optionTitles.length} className="px-6 py-12 text-center text-slate-500 text-xs font-bold">
                        Không tìm thấy biến thể.
                      </td>
                    </tr>
                  ) : (
                    variants.map((v) => {
                      let availableCount = 0;
                      let locationCount = 0;

                      if (v.inventory_items && v.inventory_items.length > 0) {
                        v.inventory_items.forEach((item: any) => {
                          if (item.inventory && item.inventory.location_levels) {
                            item.inventory.location_levels.forEach((level: any) => {
                              if (level.available_quantity > 0) {
                                availableCount += level.available_quantity;
                                locationCount++;
                              }
                            });
                          }
                        });
                      } else {
                        availableCount = (v.inventory_quantity as number) || (v.metadata?.stock as number) || 0;
                        locationCount = availableCount > 0 ? 1 : 0;
                      }

                      const inventoryText = availableCount > 0
                        ? `${availableCount} available at ${locationCount} location${locationCount !== 1 ? 's' : ''}`
                        : `0 available at ${locationCount} location${locationCount !== 1 ? 's' : ''}`;
                      const inventoryColor = availableCount > 0 ? 'text-slate-300' : 'text-rose-500';

                      const thumbnail = v.thumbnail || product?.thumbnail;

                      return (
                        <tr key={v.id} onClick={() => handleVariantClick(v.id)} className="group hover:bg-slate-800/50 transition-colors cursor-pointer">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {thumbnail && (
                                <img
                                  src={thumbnail.replace('http://localhost:9000', BRIDGE_API_URL).replace('https://localhost:9000', BRIDGE_API_URL)}
                                  alt={v.title}
                                  className="w-8 h-8 rounded-lg object-cover bg-slate-800"
                                />
                              )}
                              <span className="text-xs font-bold text-slate-200">{v.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-slate-400">{v.sku || '-'}</span>
                          </td>
                          {optionTitles.map(title => (
                            <td key={title} className="px-6 py-4">
                              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-bold uppercase">{getOptionValue(v, title)}</span>
                            </td>
                          ))}
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold ${inventoryColor}`}>{inventoryText}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-6 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>1 - {variants.length} of {variants.length} results</span>
              <div className="flex gap-4">
                <span className="text-slate-700 cursor-not-allowed">Prev</span>
                <span className="text-slate-700 cursor-not-allowed">Next</span>
              </div>
            </div>
          </>
        )}
      </div>
      {isVariantLoading && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {selectedVariant && product && (
        <VariantPriceDrawer
          isOpen={isPriceDrawerOpen}
          onClose={() => setIsPriceDrawerOpen(false)}
          product={product}
          variant={selectedVariant}
          onUpdate={() => handleVariantClick(selectedVariant.id)}
        />
      )}
      {product && (
        <ProductOptionDrawer
          isOpen={isOptionDrawerOpen}
          onClose={() => setIsOptionDrawerOpen(false)}
          product={product}
          variants={variants}
          option={selectedOption}
          onUpdate={() => {
            if (onUpdate) onUpdate();
          }}
        />
      )}
      {product && (
        <CreateProductOptionDrawer
          isOpen={isCreateOptionDrawerOpen}
          onClose={() => setIsCreateOptionDrawerOpen(false)}
          productId={product.id}
          onUpdate={() => {
            if (onUpdate) onUpdate();
          }}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteOptionModalOpen}
        onClose={() => setIsDeleteOptionModalOpen(false)}
        onConfirm={handleDeleteOption}
        title="Xác nhận xóa Option"
        message={`Bạn có chắc chắn muốn xóa Option "${selectedOption?.title}"? Tất cả giá trị của Option này trong các biến thể sẽ bị ảnh hưởng.`}
        variant="danger"
        isLoading={isDeletingOption}
        confirmText="Xác nhận xóa"
      />
    </Modal>
  );
};
