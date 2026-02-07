import { Breadcrumb, Button, ConfirmModal } from '@/components'
import { InputSearch } from '@/components/Search'
import { Edit3, MoreHorizontal, Plus, Tags, Trash2 } from 'lucide-react'
import React, { Fragment, useState } from 'react'
import { useProductTags } from '@/hooks/medusa/useProductTags';
import { Error } from '@/components/Error';
import { TableView } from '@/components/TableView';
import { ProductTag } from '@/types/product';
import { ProductTagForm } from '@/components/form/productTag/ProductTagForm';
import { formatDate } from '@/lib/utils';
import { productTagService } from '@/lib/api/medusa/productTagService';
import { useToast } from '@/contexts/ToastContext';

export const ProductTags = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const { tags, loading, error, count, refresh, deleteProductTag } = useProductTags();
  const [selectedProductTag, setSelectedProductTag] = useState<ProductTag | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productTagToDelete, setProductTagToDelete] = useState<ProductTag | null>(null);

  const handleCreate = () => {
    setSelectedProductTag(null);
    setActiveMenuId(null);
    setIsFormOpen(true);
  };
  const handleEdit = (tag: ProductTag) => {
    setSelectedProductTag(tag);
    setActiveMenuId(null);
    setIsFormOpen(true);
  };
  const handleDelete = (tag: ProductTag) => {
    setActiveMenuId(null);
    setProductTagToDelete(tag);
    setIsDeleteModalOpen(true);
  };
  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      if (selectedProductTag) {
        await productTagService.updateProductTag(selectedProductTag.id, data);
      } else {
        await productTagService.createProductTag(data);
      }
      await refresh();
      showToast(selectedProductTag ? 'Cập nhật thẻ sản phẩm thành công' : 'Tạo thẻ sản phẩm thành công', 'success');
      setIsFormOpen(false);
      setSelectedProductTag(null);
    } catch (error: any) {
      console.error('Failed to save product tag:', error);
      showToast(error.message || 'Không thể lưu thẻ sản phẩm', 'error');
    } finally {
      setIsSaving(false);
    }
  }
  if (isFormOpen) {
    return (
      <ProductTagForm
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedProductTag(null);
        }}
        onSave={handleSave}
        initialData={selectedProductTag}
        loading={isSaving}
      />
    )
  }
  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
        <Breadcrumb
          items={[
            { label: 'CÀI ĐẶT', href: '#' },
            { label: 'THẺ SẢN PHẨM', href: '#' }
          ]}
        />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                PRODUCT TAGS MANAGEMENT
              </span>
              <Tags size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Quản lý <span className="text-emerald-600 font-black">Thẻ sản phẩm</span>
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
          placeholder="Tìm thẻ sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {error && (
          <Error error={error} />
        )}
        <TableView
          columns={[
            { title: "Tên thẻ" },
            { title: "Ngày tạo" },
            { title: "Ngày cập nhật" },
            { title: "Hành động", className: "text-right" }
          ]}
          data={tags}
          emptyMessage={{
            title: "Không có thẻ sản phẩm nào",
            description: "Hãy tạo thẻ sản phẩm mới để bắt đầu"
          }}
          pagination={{
            currentPage,
            totalPages: Math.ceil(count / limit),
            onPageChange: (page) => setCurrentPage(page),
            totalItems: count,
            itemsPerPage: limit
          }}
          isLoading={loading}
          renderRow={(item, index) => (
            <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(item.created_at)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(item.updated_at)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="relative inline-block">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === item.id ? null : item.id);
                    }}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <MoreHorizontal size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  {activeMenuId === item.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => handleEdit(item)}
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
                          onClick={(e) => handleDelete(item)}
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
          setProductTagToDelete(null);
        }}
        onConfirm={async () => {
          if (productTagToDelete) {
            try {
              await deleteProductTag(productTagToDelete.id);
              showToast('Xóa thẻ sản phẩm thành công', 'success');
            } catch (error: any) {
              showToast(error.message || 'Không thể xóa thẻ sản phẩm', 'error');
            }
          }
          setIsDeleteModalOpen(false);
          setProductTagToDelete(null);
        }}
        isLoading={loading}
        title="Xác nhận xóa thẻ sản phẩm"
        message={`Bạn có chắc chắn muốn xóa thẻ sản phẩm "${productTagToDelete?.value}"? Hành động này không thể hoàn tác.`}
        variant="danger"
        confirmText="Xóa thẻ sản phẩm"
        cancelText="Quay lại"
      />
    </Fragment>
  )
}
