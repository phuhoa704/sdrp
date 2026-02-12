import { Breadcrumb, Button, Card, ConfirmModal } from '@/components'
import { SearchFilter } from '@/components/filters/Search';
import { CustomerGroupForm } from '@/components/form/customer-group/CustomerGroupForm';
import { useToast } from '@/contexts/ToastContext';
import { useCustomerGroups } from '@/hooks/medusa/useCustomerGroups';
import { customerGroupService } from '@/lib/api/medusa/customerGroupService';
import { formatDate } from '@/lib/utils';
import type { CustomerGroup as CustomerGroupType } from '@/types/customer-group';
import { ChevronRight, LayoutGrid, Plus, Users } from 'lucide-react'
import React, { Fragment, useState } from 'react'

import { CustomerGroupDetail } from '@/components/customer-group/CustomerGroupDetail';
import { TableLoading } from '@/components/TableLoading';
import { Empty } from '@/components/Empty';

export const CustomerGroup = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState<CustomerGroupType | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerGroupToDelete, setCustomerGroupToDelete] = useState<CustomerGroupType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const limit = 10;

  const { customerGroups, loading, error, refresh, count, deleteCustomerGroup } = useCustomerGroups({
    limit,
    offset: (currentPage - 1) * limit,
    q: searchTerm,
    fields: "id,name,created_at,updated_at,customers.id"
  });

  const handleCreate = () => {
    setIsFormOpen(true);
    setSelectedGroup(null);
  }
  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      if (selectedGroup) {
        await customerGroupService.updateCustomerGroup(selectedGroup.id, data);
      } else {
        await customerGroupService.createCustomerGroup(data);
      }
      setIsFormOpen(false);
      setSelectedGroup(null);
      refresh();
    } catch (error: any) {
      console.error('Failed to save customer:', error);
      showToast(error.message || 'Không thể lưu nhóm khách hàng', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (selectedGroupId) {
    return (
      <CustomerGroupDetail
        id={selectedGroupId}
        onBack={() => {
          setSelectedGroupId(null)
          refresh()
        }}
      />
    )
  }

  if (isFormOpen) {
    return (
      <CustomerGroupForm
        onSave={handleSave}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedGroup(null);
        }}
        loading={isSaving}
        initialData={selectedGroup}
      />
    )
  }
  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative font-sans">
        <Breadcrumb
          items={[
            { label: 'CRM', href: '#' },
            { label: 'NHÓM KHÁCH HÀNG', href: '#' }
          ]}
        />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                CUSTOMER RELATION MANAGEMENT
              </span>
              <Users size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              QUẢN LÝ <span className="text-emerald-600 font-black">NHÓM KHÁCH HÀNG</span>
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">
              Phân loại tệp khách hàng để tối ưu hóa chăm sóc và bảng giá
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleCreate} className="h-14 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 font-black text-xs px-6 uppercase tracking-wider" icon={<Plus size={20} />}>
              THÊM NHÓM KHÁCH HÀNG
            </Button>
          </div>
        </div>
        <Card className="flex flex-col md:flex-row items-center gap-4">
          <SearchFilter
            placeholder='Tìm theo mã, tên, số điện thoại hoặc khu vực...'
            searchTerm={searchTerm}
            handleSearchChange={setSearchTerm}
          />
        </Card>
        {loading ? (
          <TableLoading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerGroups.length > 0 ? (
              customerGroups.map((grp, idx) => (
                <Card className='relative group' key={idx} onClick={() => setSelectedGroupId(grp.id)}>
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                    <Users size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                        <LayoutGrid size={24} />
                      </div>
                      <span className="text-[9px] font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full uppercase tracking-widest border border-emerald-100">{formatDate(grp.created_at)}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                      {grp.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-8 leading-relaxed"></p>
                    <div className="pt-6 border-t dark:border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Users size={14} className='text-slate-400' />
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">{grp?.customers?.length || 0} THÀNH VIÊN</span>
                      </div>
                      <ChevronRight size={18} className='text-slate-300 group-hover:translate-x-1 transition-transform' />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Empty title='Không tìm thấy nhóm khách hàng' description='Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc' />
              </div>
            )}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCustomerGroupToDelete(null);
        }}
        onConfirm={async () => {
          if (customerGroupToDelete) {
            await deleteCustomerGroup(customerGroupToDelete.id);
          }
          setIsDeleteModalOpen(false);
          setCustomerGroupToDelete(null);
        }}
        isLoading={loading}
        title="Xác nhận xóa nhóm khách hàng"
        message={`Bạn có chắc chắn muốn xóa nhóm khách hàng "${customerGroupToDelete?.name}"? Hành động này không thể hoàn tác.`}
        variant="danger"
        confirmText="Xóa nhóm khách hàng"
        cancelText="Quay lại"
      />
    </Fragment>
  )
}
