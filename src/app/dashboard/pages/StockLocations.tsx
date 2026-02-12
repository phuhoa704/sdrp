import { Breadcrumb, Button, ConfirmModal } from '@/components'
import { InputSearch } from '@/components/Search'
import { ChevronLeft, ChevronRight, Edit3, MapPin, MoreHorizontal, Phone, Plus, Store, Trash2 } from 'lucide-react'
import React, { Fragment, useState } from 'react'
import { useStockLocations } from '@/hooks/medusa/useStockLocations'
import { Error } from '@/components/Error'
import { Card } from '@/components/Card'
import { Empty } from '@/components/Empty'
import { StockLocation } from '@/types/stock'
import { StockLocationForm } from '@/components/form/stockLocation/StockLocationForm'
import { stockLocationService } from '@/lib/api/medusa/stockLocationService'
import { useToast } from '@/contexts/ToastContext'
import { StockLocationDetail } from '@/components/stock-location/StockLocationDetail'

export const StockLocations = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { locations, loading, error, refresh, count, deleteStockLocation } = useStockLocations({
    limit: 10,
    offset: 0,
    q: searchTerm
  });
  const [currentPage, setCurrentPage] = useState(1)
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStockLocation, setSelectedStockLocation] = useState<StockLocation | null>(null);
  const limit = 10;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockLocationToDelete, setStockLocationToDelete] = useState<StockLocation | null>(null);

  const handleCreate = () => {
    setSelectedStockLocation(null);
    setIsFormOpen(true);
  }

  const handleEdit = (location: StockLocation) => {
    setSelectedStockLocation(location);
    setIsFormOpen(true);
  }

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      if (selectedStockLocation?.id) {
        await stockLocationService.updateStockLocation(selectedStockLocation.id, data);
        showToast('Cập nhật vị trí kho thành công', 'success');
      } else {
        await stockLocationService.createStockLocation(data);
        showToast('Tạo vị trí kho mới thành công', 'success');
      }
      setIsFormOpen(false);
      setSelectedStockLocation(null);
      refresh();
    } catch (err: any) {
      console.error('Failed to save stock location:', err);
      showToast(err.message || 'Không thể lưu vị trí kho', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (selectedLocationId) {
    return (
      <StockLocationDetail
        id={selectedLocationId}
        onBack={() => {
          setSelectedLocationId(null)
          refresh()
        }}
      />
    )
  }

  if (isFormOpen) {
    return (
      <StockLocationForm
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedStockLocation(null);
        }}
        onSave={handleSave}
        initialData={selectedStockLocation}
        loading={isSaving}
      />
    );
  }

  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
        <Breadcrumb
          items={[
            { label: 'CÀI ĐẶT', href: '#' },
            { label: 'VỊ TRÍ KHO', href: '#' }
          ]}
        />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                STOCK LOCATIONS MANAGEMENT
              </span>
              <Store size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Quản lý <span className="text-emerald-600 font-black">Vị trí kho</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="h-14 rounded-2xl bg-white text-primary border-2 border-primary"
              icon={<Plus size={20} />}
              onClick={handleCreate}
            >
              THÊM MỚI
            </Button>
          </div>
        </div>
        <InputSearch
          placeholder="Tìm vị trí kho..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {error && (
          <Error error={error} />
        )}
        {loading && locations.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((item) => (
              <Card
                key={item.id}
                onClick={() => setSelectedLocationId(item.id)}
                className="group p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-slate-100 dark:border-slate-800 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Store size={24} />
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === item.id ? null : item.id);
                        }}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                      >
                        <MoreHorizontal size={20} className="text-slate-400" />
                      </button>

                      {activeMenuId === item.id && (
                        <>
                          <div className="fixed inset-0 z-[100]" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl z-[110] overflow-hidden animate-slide-up">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors underline-offset-4"
                            >
                              <Edit3 size={16} className="text-blue-500" />
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setStockLocationToDelete(item);
                                setIsDeleteModalOpen(true);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-4 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 flex items-center gap-3 transition-colors border-t border-slate-50 dark:border-slate-800/50"
                            >
                              <Trash2 size={16} />
                              Xóa kho
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 line-clamp-1">{item.name}</h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 line-clamp-2">
                        {item.address?.address_1 || 'Chưa cập nhật địa chỉ'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-slate-400 shrink-0" />
                      <p className="text-xs font-black text-primary">
                        {item.address?.phone || 'Chưa có SĐT'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {item.id.slice(-8).toUpperCase()}</span>
                    <div className="flex items-center gap-1 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      CHI TIẾT <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
            <Empty
              title="Không có vị trí kho nào"
              description="Hãy tạo vị trí kho mới để bắt đầu quản lý tồn kho của bạn"
            />
          </div>
        )}

        {/* Pagination */}
        {!loading && count > limit && (
          <div className="flex items-center justify-between px-2 py-8 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Hiển thị {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, count)} trong số {count}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.ceil(count / limit) }, (_, i) => i + 1)
                .filter(p => p === 1 || p === Math.ceil(count / limit) || Math.abs(p - currentPage) <= 1)
                .map((p, i, arr) => (
                  <Fragment key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="text-slate-300 px-1">...</span>}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${p === currentPage
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 shadow-sm shadow-black/5'
                        }`}
                    >
                      {p}
                    </button>
                  </Fragment>
                ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(count / limit)}
                className="p-2 rounded-xl text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStockLocationToDelete(null);
        }}
        onConfirm={async () => {
          if (stockLocationToDelete) {
            await deleteStockLocation(stockLocationToDelete.id);
          }
          setIsDeleteModalOpen(false);
          setStockLocationToDelete(null);
        }}
        isLoading={loading}
        title="Xác nhận xóa vị trí kho"
        message={`Bạn có chắc chắn muốn xóa vị trí kho "${stockLocationToDelete?.name}"? Hành động này không thể hoàn tác.`}
        variant="danger"
        confirmText="Xóa vị trí kho"
        cancelText="Quay lại"
      />
    </Fragment>
  )
}
