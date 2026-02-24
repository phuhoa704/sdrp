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
  ChevronRight,
  Edit3,
  Loader2
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { TableView } from '@/components/TableView';
import { formatDate } from '@/lib/utils';
import { PriceList } from '@/types/price';
import { priceListService } from '@/lib/api/medusa/priceListService';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/medusa/useProducts';
import { useCustomerGroups } from '@/hooks/medusa/useCustomerGroups';
import { Drawer } from '@/components/Drawer';
import { ProductSelectionModal } from '@/components/sales-channel/ProductSelectionModal';
import { Modal } from '@/components/Modal';
import { EditPricesModal } from './EditPricesModal';
import { EditPriceListDrawer } from './EditPriceListDrawer';
import { EditDateAndGroupDrawer } from './EditDateAndGroupDrawer';
import { ConfirmModal } from '../ConfirmModal';
import { ManagePricesInPriceListPayload } from '@/types/price-list';

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
  const [isEditDateAndGroupDrawerOpen, setIsEditDateAndGroupDrawerOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isDeletingProducts, setIsDeletingProducts] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
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
      setIsEditDateAndGroupDrawerOpen(false);
      fetchDetail();
      refreshProducts();
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Cập nhật thất bại', 'error');
    }
  };


  const handleSaveBatchPrices = async (payload: ManagePricesInPriceListPayload) => {
    try {
      await priceListService.managePrices(priceListId, payload);
      showToast('Cập nhật giá thành công', 'success');
      setIsEditPricesModalOpen(false);
      setSelectedProductIdsForAdd([]);
      fetchDetail();
      refreshProducts();
    } catch (err: any) {
      showToast(err.message || 'Cập nhật giá thất bại', 'error');
    }
  };

  const handleSelectAll = (e: any) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedProductIds(lp.map((product) => product.id));
    } else {
      setSelectedProductIds([]);
    }
  }

  const handleDeleteProducts = async () => {
    setIsDeletingProducts(true);
    try {
      await priceListService.removeProductFromPriceList(priceListId, selectedProductIds);
      showToast('Xóa sản phẩm thành công', 'success');
      setSelectedProductIds([]);
      fetchDetail();
      refreshProducts();
    } catch (err: any) {
      showToast(err.message || 'Xóa sản phẩm thất bại', 'error');
    } finally {
      setIsDeletingProducts(false);
    }
  }

  if (loading || productsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl p-0 space-y-4">
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-2.5 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              ))}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-xl p-0 space-y-4">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-2.5 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              ))}
            </Card>
            <Card className="shadow-xl p-0 space-y-4">
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl" />
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            </Card>
          </div>
        </div>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <div className="bg-white dark:bg-slate-900 pt-4">
              <TableView
                columns={[
                  { title: <div><input type="checkbox" checked={selectedProductIds.length === lp.length} onChange={handleSelectAll} className="rounded-md border-slate-300 text-primary focus:ring-primary" /></div> },
                  { title: "Tên sản phẩm" },
                  { title: "Bộ sưu tập" },
                  { title: "Kênh bán hàng" },
                  { title: "Biến thể" },
                  { title: "Trạng thái", className: "text-right" }
                ]}
                data={lp}
                renderRow={(product: any, index: number) => (
                  <tr key={`${product.id}-${index}`} className="border-b dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6 pl-8">
                      <input type="checkbox" checked={selectedProductIds.includes(product.id)} onChange={e => {
                        e.stopPropagation();
                        if (selectedProductIds.includes(product.id)) {
                          setSelectedProductIds(selectedProductIds.filter((id: string) => id !== product.id));
                        } else {
                          setSelectedProductIds([...selectedProductIds, product.id]);
                        }
                      }} className="rounded-md border-slate-300 text-primary focus:ring-primary" />
                    </td>
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

        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Settings size={80} className="text-slate-500" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Cấu hình</h3>
                <Edit3 onClick={() => setIsEditDateAndGroupDrawerOpen(true)} size={18} className="text-slate-400 cursor-pointer hover:text-slate-600" />
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

      {selectedProductIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-1 bg-emerald-500 dark:bg-slate-900 text-white rounded-2xl shadow-2xl shadow-black/40 border border-white/10 px-2 py-2 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-2 px-3 py-1.5 border-r border-white/10 mr-1">
              <span className="text-xs font-black text-white dark:text-slate-300 whitespace-nowrap">
                {selectedProductIds.length} đã chọn
              </span>
            </div>

            {isDeletingProducts ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-rose-500/20 text-sm font-bold text-white dark:text-slate-200 hover:text-rose-400 transition-all group">
                <Loader2 size={15} className="animate-spin" />
                <span>Đang xóa...</span>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-rose-500/20 text-sm font-bold text-white dark:text-slate-200 hover:text-rose-400 transition-all group"
              >
                <Trash2 size={15} />
                <span>Xóa</span>
              </button>
            )}
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button
              onClick={() => setSelectedProductIds([])}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white dark:text-slate-200 hover:text-white transition-all"
              title="Bỏ chọn tất cả"
            >
              <ChevronRight size={15} className="rotate-180" />
            </button>
          </div>
        </div>
      )}


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
        alreadySelectedIds={lp.map(p => p.id)}
        isLoading={false}
        title='Thêm sản phẩm vào bảng giá'
      />

      <EditPricesModal
        isOpen={isEditPricesModalOpen}
        onClose={() => setIsEditPricesModalOpen(false)}
        productIds={selectedProductIdsForAdd}
        priceList={priceList}
        onSave={handleSaveBatchPrices}
        newProductIds={selectedProductIdsForAdd.length > 0 ? selectedProductIdsForAdd : undefined}
      />

      <EditDateAndGroupDrawer
        isOpen={isEditDateAndGroupDrawerOpen}
        onClose={() => setIsEditDateAndGroupDrawerOpen(false)}
        priceList={priceList}
        onSave={handleUpdatePriceList}
      />

      <ConfirmModal
        isOpen={confirmDeleteModal}
        variant='danger'
        onClose={() => setConfirmDeleteModal(false)}
        onConfirm={handleDeleteProducts}
        title='Xóa sản phẩm khỏi bảng giá'
        message={`Bạn có chắc chắn muốn xóa ${selectedProductIds.length} sản phẩm khỏi bảng giá?`}
      />
    </div>
  );
};

