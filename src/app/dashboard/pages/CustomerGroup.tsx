import { Breadcrumb, Button, Card, ConfirmModal } from '@/components'
import { SearchFilter } from '@/components/filters/Search';
import { CustomerGroupForm } from '@/components/form/customer-group/CustomerGroupForm';
import { TableView } from '@/components/TableView';
import { useToast } from '@/contexts/ToastContext';
import { useCustomerGroups } from '@/hooks/medusa/useCustomerGroups';
import { customerGroupService } from '@/lib/api/medusa/customerGroupService';
import { formatDate } from '@/lib/utils';
import type { CustomerGroup as CustomerGroupType } from '@/types/customer-group';
import { Edit3, MoreHorizontal, Plus, Trash2, Users } from 'lucide-react'
import React, { Fragment, useState } from 'react'

import { CustomerGroupDetail } from '@/components/customer-group/CustomerGroupDetail';

export const CustomerGroup = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
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
  const handleEdit = (grp: CustomerGroupType) => {
    setSelectedGroup(grp);
    setIsFormOpen(true);
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
              Khách Hàng <span className="text-emerald-600 font-black">Thân Thiết</span>
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">
              Xây dựng niềm tin thông qua dữ liệu và chăm sóc cá nhân hóa
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
        <TableView
          columns={[
            { title: 'Tên nhóm' },
            { title: 'Số lượng khách hàng' },
            { title: 'Ngày tạo' },
            { title: 'Hành động', className: "text-right" },
          ]}
          data={customerGroups}
          emptyMessage={{
            title: "Không tìm thấy nhóm khách hàng",
            description: "Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
          }}
          isLoading={loading}
          pagination={{
            currentPage,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            onPageChange: setCurrentPage,
            itemsPerPage: limit
          }}
          renderRow={(grp, idx) => (
            <tr key={idx} onClick={() => setSelectedGroupId(grp.id)} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className='py-5 px-4 pl-8 text-slate-800 dark:text-white'>{grp.name}</td>
              <td className='py-5 px-4 text-slate-800 dark:text-white'>{grp?.customers?.length || 0}</td>
              <td className='py-5 px-4 text-slate-800 dark:text-white'>{formatDate(grp.created_at)}</td>
              <td className='py-5 px-4 pr-8 text-right'>
                <div className="relative inline-block">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === grp.id ? null : grp.id);
                  }} className="p-2 text-slate-500  dark:hover:text-white rounded-lg hover:bg-white/5 transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                  {activeMenuId === grp.id && (
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
                            handleEdit(grp);
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
                            setCustomerGroupToDelete(grp);
                            setIsDeleteModalOpen(true);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-4 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 flex items-center gap-3 transition-colors border-t border-slate-50 dark:border-slate-800/50"
                        >
                          <Trash2 size={16} />
                          Xóa nhóm khách hàng
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
