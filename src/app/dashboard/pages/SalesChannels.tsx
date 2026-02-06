import { Breadcrumb, Button, ConfirmModal } from '@/components'
import { InputSearch } from '@/components/Search'
import { Edit3, MoreHorizontal, Plus, Trash2, Zap } from 'lucide-react'
import React, { Fragment, useState } from 'react'
import { useSalesChannels } from '@/hooks/medusa/useSalesChannels'
import { Error } from '@/components/Error'
import { TableView } from '@/components/TableView'
import { SalesChannel } from '@/types/sales-channel'
import { SalesChannelForm } from '@/components/form/salesChannel/SalesChannelForm'
import { salesChannelService } from '@/lib/api/medusa/salesChannelService'
import { useAppDispatch } from '@/store/hooks'
import { refreshSalesChannels } from '@/store/slices/uiSlice'

export const SalesChannels = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSalesChannel, setSelectedSalesChannel] = useState<SalesChannel | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [salesChannelToDelete, setSalesChannelToDelete] = useState<SalesChannel | null>(null);

  const { salesChannels, loading, error, refresh, pagination, deleteSalesChannel } = useSalesChannels({
    offset: (currentPage - 1) * limit,
    limit
  });

  const handleCreate = () => {
    setSelectedSalesChannel(null);
    setIsFormOpen(true);
  }

  const handleEdit = (channel: SalesChannel) => {
    setSelectedSalesChannel(channel);
    setIsFormOpen(true);
  }

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      if (selectedSalesChannel?.id) {
        await salesChannelService.updateSalesChannel(selectedSalesChannel.id, data);
      } else {
        await salesChannelService.createSalesChannel(data);
      }
      setIsFormOpen(false);
      setSelectedSalesChannel(null);
      refresh();
      dispatch(refreshSalesChannels()); // Trigger refresh in Sidebar
    } catch (err: any) {
      console.error('Failed to save sales channel:', err);
      alert(err.message || 'Không thể lưu kênh bán hàng');
    } finally {
      setIsSaving(false);
    }
  }

  if (isFormOpen) {
    return (
      <SalesChannelForm
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedSalesChannel(null);
        }}
        onSave={handleSave}
        initialData={selectedSalesChannel}
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
            { label: 'KÊNH BÁN HÀNG', href: '#' }
          ]}
        />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                SALES CHANNELS MANAGEMENT
              </span>
              <Zap size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Quản lý <span className="text-emerald-600 font-black">Kênh bán hàng</span>
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
          placeholder="Tìm kênh bán hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {error && (
          <Error error={error} />
        )}
        <TableView
          columns={[
            { title: "Tên kênh" },
            { title: "Mô tả" },
            { title: "Trạng thái" },
            { title: "Hành động", className: "text-right" },
          ]}
          data={salesChannels}
          emptyMessage={{
            title: "Không có kênh bán hàng nào",
            description: "Hãy tạo kênh bán hàng mới để bắt đầu"
          }}
          isLoading={loading}
          pagination={{
            currentPage,
            totalPages: pagination?.count ? Math.ceil(pagination.count / limit) : 0,
            onPageChange: (page) => setCurrentPage(page),
            itemsPerPage: limit,
            totalItems: pagination?.count || 0
          }}
          renderRow={(item, index) => (
            <tr key={item.id} onClick={() => handleEdit(item)} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.is_disabled ? "Không hoạt động" : "Hoạt động"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="relative inline-block">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === item.id ? null : item.id);
                    }}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-all"
                  >
                    <MoreHorizontal size={20} />
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
                            setSalesChannelToDelete(item);
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
          setSalesChannelToDelete(null);
        }}
        onConfirm={async () => {
          if (salesChannelToDelete) {
            await deleteSalesChannel(salesChannelToDelete.id);
          }
          setIsDeleteModalOpen(false);
          setSalesChannelToDelete(null);
        }}
        isLoading={loading}
        title="Xác nhận xóa kênh bán hàng"
        message={`Bạn có chắc chắn muốn xóa kênh bán hàng "${salesChannelToDelete?.name}"? Hành động này không thể hoàn tác.`}
        variant="danger"
        confirmText="Xóa kênh bán hàng"
        cancelText="Quay lại"
      />
    </Fragment>
  )
}
