'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MoreHorizontal,
  Package,
  Calendar,
  Users,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { TableView } from '@/components/TableView';
import { formatDate } from '@/lib/utils';
import { PriceList, Price } from '@/types/price';
import { priceListService } from '@/lib/api/medusa/priceListService';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/medusa/useProducts';
import { useCustomerGroups } from '@/hooks/medusa/useCustomerGroups';
import { Drawer } from '@/components/Drawer';
import { ProductSelectionModal } from '@/components/sales-channel/ProductSelectionModal';
import { Modal } from '@/components/Modal';

interface PriceListDetailProps {
  priceListId: string;
  onBack: () => void;
  onRefresh: () => void;
}

export const PriceListDetail: React.FC<PriceListDetailProps> = ({ priceListId, onBack, onRefresh }) => {
  const [priceList, setPriceList] = useState<PriceList | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditPricesModalOpen, setIsEditPricesModalOpen] = useState(false);
  const [selectedProductIdsForAdd, setSelectedProductIdsForAdd] = useState<string[]>([]);
  const [isProductActionMenuOpen, setIsProductActionMenuOpen] = useState(false);
  const { showToast } = useToast();

  const { customerGroups } = useCustomerGroups({ fields: "id,name" });
  const { products: lp, loading: productsLoading, refresh: refreshProducts } = useProducts({
    price_list_id: [priceListId],
    fields: "*categories,*sales_channels,+variants",
    limit: 100
  });

  const handleAddProducts = (productIds: string[]) => {
    setSelectedProductIdsForAdd(productIds);
    setIsAddProductModalOpen(false);
    setIsEditPricesModalOpen(true);
  };

  const handleEditExistingPrices = () => {
    setIsEditPricesModalOpen(true);
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await priceListService.getPriceListById(priceListId);
      setPriceList(data);
    } catch (err) {
      console.error('Failed to fetch price list detail:', err);
      showToast('Không thể tải thông tin bảng giá', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [priceListId]);

  const handleUpdatePriceList = async (data: any) => {
    try {
      await priceListService.updatePriceList(priceListId, data);
      showToast('Cập nhật thành công', 'success');
      setIsEditDrawerOpen(false);
      fetchDetail();
      refreshProducts();
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Cập nhật thất bại', 'error');
    }
  };


  const handleSaveBatchPrices = async (prices: any[]) => {
    try {
      await priceListService.managePrices(priceListId, { prices });
      showToast('Cập nhật giá thành công', 'success');
      setIsEditPricesModalOpen(false);
      fetchDetail();
      refreshProducts();
    } catch (err: any) {
      showToast(err.message || 'Cập nhật giá thất bại', 'error');
    }
  };

  if (loading || productsLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!priceList) return null;

  const currentGroups = customerGroups.filter(cg =>
    priceList.rules[`customer.groups.id`]?.includes(cg.id)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft size={24} className="text-slate-500" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{priceList.title}</h1>
            <span className={cn(
              "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
              priceList.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
            )}>
              {priceList.status === 'active' ? 'Hoạt động' : 'Nháp'}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tighter">ID: {priceList.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Information Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-none shadow-xl">
            <div className="bg-white dark:bg-slate-900 overflow-hidden">
              <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Thông tin chung</h3>
                <Button
                  variant="soft"
                  size="sm"
                  onClick={() => setIsEditDrawerOpen(true)}
                  className="font-black text-[10px] uppercase"
                  icon={<Edit2 size={14} />}
                >
                  CHỈNH SỬA
                </Button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Loại</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white capitalize">{priceList.type === 'sale' ? 'Sale' : 'Override'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mô tả</p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{priceList.description || "Không có mô tả"}</p>
                  </div>
                </div>
                <div className="pt-6 border-t dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số lượng giá ghi đè</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{priceList?.prices?.length || 0}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Products Panel */}
          <Card className="p-0 overflow-hidden border-none shadow-xl">
            <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Sản phẩm</h3>
              <div className="relative">
                <Button
                  variant="soft"
                  size="sm"
                  onClick={() => setIsProductActionMenuOpen(!isProductActionMenuOpen)}
                  className="font-black text-[10px] uppercase"
                  icon={<MoreHorizontal size={14} />}
                />
                {isProductActionMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProductActionMenuOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl z-20 overflow-hidden py-1 animate-slide-up">
                      <button
                        onClick={() => {
                          setIsAddProductModalOpen(true);
                          setIsProductActionMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-tight"
                      >
                        <Plus size={14} className="text-emerald-500" />
                        Thêm sản phẩm
                      </button>
                      <button
                        onClick={() => {
                          handleEditExistingPrices();
                          setIsProductActionMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-tight"
                      >
                        <Edit2 size={14} className="text-blue-500" />
                        Chỉnh sửa giá
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900">
              <TableView
                columns={[
                  { title: "Tên sản phẩm" },
                  { title: "Bộ sưu tập" },
                  { title: "Kênh bán hàng" },
                  { title: "Biến thể" },
                  { title: "Trạng thái", className: "text-right" }
                ]}
                data={lp}
                renderRow={(product: any, index: number) => (
                  <tr key={`${product.id}-${index}`} className="border-b dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{product.title}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-bold text-slate-500">
                        {product.categories?.map((c: any) => c.name).join(', ') || '—'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {product.sales_channels?.map((sc: any) => (
                          <span key={sc.id} className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-[9px] font-black uppercase tracking-tighter">
                            {sc.name}
                          </span>
                        )) || '—'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-black text-slate-700 dark:text-slate-300">
                        {product.variants?.length || 0} biến thể
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                        product.status === 'published' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                      )}>
                        {product.status === 'published' ? 'Hoạt động' : 'Nháp'}
                      </span>
                    </td>
                  </tr>
                )}
                isLoading={false}
                emptyMessage={{ title: "Chưa có sản phẩm nào", description: "Bắt đầu bằng cách thêm sản phẩm mới" }}
              />
            </div>
          </Card>

        </div>

        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Settings size={80} className="text-slate-500" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Cấu hình</h3>
                <MoreHorizontal size={18} className="text-slate-400 cursor-pointer hover:text-slate-600" />
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Users size={12} className="text-emerald-500" /> Nhóm khách hàng
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentGroups.length > 0 ? currentGroups.map(cg => (
                      <span key={cg.id} className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100">
                        {cg.name}
                      </span>
                    )) : (
                      <span className="text-xs font-bold text-slate-400 italic">Áp dụng cho tất cả</span>
                    )}
                    {currentGroups.length > 1 && <span className="text-[10px] font-bold text-slate-400"> + {currentGroups.length - 1} more</span>}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 pt-4 border-t dark:border-slate-800">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800/50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Calendar size={10} /> Ngày bắt đầu
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {priceList.starts_at ? formatDate(priceList.starts_at) : "Chưa thiết lập"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800/50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Calendar size={10} /> Ngày kết thúc
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {priceList.ends_at ? formatDate(priceList.ends_at) : "Chưa thiết lập"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <EditPriceListDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        priceList={priceList}
        onSave={handleUpdatePriceList}
      />

      <ProductSelectionModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSelect={handleAddProducts}
        alreadySelectedIds={[]} // Simplified for now
        isLoading={false}
      />

      <EditPricesModal
        isOpen={isEditPricesModalOpen}
        onClose={() => setIsEditPricesModalOpen(false)}
        productIds={selectedProductIdsForAdd}
        priceList={priceList}
        onSave={handleSaveBatchPrices}
      />
    </div>
  );
};

interface EditPriceListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  priceList: PriceList;
  onSave: (data: any) => void;
}

const EditPriceListDrawer: React.FC<EditPriceListDrawerProps> = ({ isOpen, onClose, priceList, onSave }) => {
  const [title, setTitle] = useState(priceList.title);
  const [description, setDescription] = useState(priceList.description);
  const [type, setType] = useState(priceList.type);
  const [status, setStatus] = useState(priceList.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({ title, description, type, status });
    setIsSaving(false);
  };

  const inputStyle = "w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 text-sm font-medium transition-all text-slate-800 dark:text-white";
  const labelStyle = "text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="CHỈNH SỬA BẢNG GIÁ"
      footer={
        <div className="flex gap-3 w-full">
          <Button variant="secondary" fullWidth onClick={onClose} className="rounded-2xl font-black">HỦY BỎ</Button>
          <Button variant="primary" fullWidth onClick={handleSave} loading={isSaving} className="rounded-2xl font-black">LƯU THAY ĐỔI</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className={labelStyle}>Loại</label>
          <div className="grid grid-cols-1 gap-3">
            <div
              onClick={() => setType('sale')}
              className={cn(
                "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4",
                type === 'sale' ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600"
              )}
            >
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", type === 'sale' ? "border-white" : "border-slate-300")}>
                {type === 'sale' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase">Sale</p>
                <p className={cn("text-[10px] font-medium opacity-80", type === 'sale' ? "text-white" : "text-slate-400")}>Dùng cho các chương trình khuyến mãi tạm thời.</p>
              </div>
            </div>
            <div
              onClick={() => setType('override')}
              className={cn(
                "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4",
                type === 'override' ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600"
              )}
            >
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", type === 'override' ? "border-white" : "border-slate-300")}>
                {type === 'override' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase">Override</p>
                <p className={cn("text-[10px] font-medium opacity-80", type === 'override' ? "text-white" : "text-slate-400")}>Dùng để ghi đè giá hệ thống vĩnh viễn.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className={labelStyle}>Tiêu đề</label>
          <input className={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className={labelStyle}>Trạng thái</label>
          <select className={cn(inputStyle, "appearance-none")} value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="active">Hoạt động</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>

        <div>
          <label className={labelStyle}>Mô tả</label>
          <textarea className={cn(inputStyle, "h-32 py-4 resize-none")} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>
    </Drawer>
  );
};

interface EditPricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIds: string[];
  priceList: PriceList;
  onSave: (prices: any[]) => void;
}

const EditPricesModal: React.FC<EditPricesModalProps> = ({ isOpen, onClose, productIds, priceList, onSave }) => {
  // Note: useProducts needs the 'id' option which we added to UseProductsOptions
  const { products, loading } = useProducts({
    id: productIds.length > 0 ? productIds : undefined,
    fields: "+variants",
    autoFetch: productIds.length > 0
  });
  const [variantPrices, setVariantPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (priceList.prices) {
      const initialPrices: Record<string, number> = {};
      priceList.prices.forEach(p => {
        initialPrices[p.variant_id] = p.amount;
      });
      setVariantPrices(initialPrices);
    }
  }, [priceList]);

  const handleSave = () => {
    const updatedPrices = Object.entries(variantPrices).map(([variantId, amount]) => ({
      variant_id: variantId,
      amount,
      currency_code: 'VND'
    }));
    onSave(updatedPrices);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="THIẾT LẬP GIÁ BIẾN THỂ" maxWidth="4xl">
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          </div>
        ) : (
          <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4 no-scrollbar">
            {products.map(product => (
              <Card key={product.id} className="p-6 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Package size={20} className="text-slate-400" />
                  </div>
                  <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{product.title}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.variants?.map((v: any) => (
                    <div key={v.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between border dark:border-slate-800/50">
                      <p className="text-xs font-bold text-slate-500 truncate pr-2">{v.title || "Mặc định"}</p>
                      <div className="relative w-32">
                        <input
                          type="number"
                          className="w-full h-10 pl-3 pr-8 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-700 text-right text-xs font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          value={variantPrices[v.id] || ''}
                          onChange={(e) => setVariantPrices({ ...variantPrices, [v.id]: parseFloat(e.target.value) || 0 })}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-3 pt-6 border-t dark:border-slate-800">
          <Button variant="outline" onClick={onClose} className="rounded-2xl font-black">HỦY BỎ</Button>
          <Button variant="primary" onClick={handleSave} className="rounded-2xl font-black px-10">CẬP NHẬT GIÁ</Button>
        </div>
      </div>
    </Modal>
  );
};
