import { Breadcrumb, Button, ConfirmModal } from '@/components'
import { InputSearch } from '@/components/Search'
import { Edit3, MoreHorizontal, Plus, Store, Trash2 } from 'lucide-react'
import React, { Fragment, useState } from 'react'
import { useStockLocations } from '@/hooks/medusa/useStockLocations'
import { Error } from '@/components/Error'
import { TableView } from '@/components/TableView'
import { StockLocation } from '@/types/stock'
import { StockLocationForm } from '@/components/form/stockLocation/StockLocationForm'
import { stockLocationService } from '@/lib/api/medusa/stockLocationService'
import { useToast } from '@/contexts/ToastContext'
import { StockLocationDetail } from '@/components/stock-location/StockLocationDetail'

export const StockLocations = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { locations, loading, error, refresh, count, deleteStockLocation } = useStockLocations();
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
        <TableView
          columns={[
            { title: "Tên" },
            { title: "Địa chỉ" },
            { title: "Số điện thoại" },
            { title: "" }
          ]}
          data={locations}
          emptyMessage={{
            title: "Không có vị trí kho nào",
            description: "Hãy tạo vị trí kho mới để bắt đầu"
          }}
          isLoading={loading}
          pagination={{
            currentPage,
            totalPages: Math.ceil(count / limit),
            onPageChange: (page) => setCurrentPage(page),
            itemsPerPage: limit,
            totalItems: count
          }}
          renderRow={(item, index) => (
            <tr key={item.id} onClick={() => setSelectedLocationId(item.id)} className="group border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.address?.address_1}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.address?.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="relative inline-block">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === item.id ? null : item.id);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <MoreHorizontal size={18} className="text-gray-500 dark:text-gray-400" />
                  </button>
                  {activeMenuId === item.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                        }}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
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
                          Xóa danh mục
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          )}
        />
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
