import { Breadcrumb, Button } from '@/components'
import { InputSearch } from '@/components/Search';
import { TableLoading } from '@/components/TableLoading';
import { useCollections } from '@/hooks/medusa/useCollections';
import { ChevronLeft, ChevronRight, Edit3, MoreHorizontal, Plus, Trash2, Zap } from 'lucide-react'
import React, { Fragment, useState } from 'react'
import { Error } from '@/components/Error';
import { ProductCollection } from '@/types/product';
import { CollectionForm } from '@/components/form/collection/CollectionForm';
import { ConfirmModal } from '@/components/ConfirmModal';
import { collectionService } from '@/lib/api/medusa/collectionService';
import { CollectionDetail } from '@/components/collection/CollectionDetail';

export default function Collection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCollectionData, setSelectedCollectionData] = useState<ProductCollection | null>(null)
  const [collectionToDelete, setCollectionToDelete] = useState<ProductCollection | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [viewingCollection, setViewingCollection] = useState<ProductCollection | null>(null);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { collections, count, loading, error, refresh } = useCollections({
    autoFetch: true,
    q: searchTerm,
    limit,
    offset
  });

  const totalPages = Math.ceil(count / limit);

  const handleCreate = () => {
    setSelectedCollectionData(null);
    setIsFormOpen(true);
  };

  const handleEdit = (collection: ProductCollection) => {
    setSelectedCollectionData(collection);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    setIsFormOpen(false);
    setSelectedCollectionData(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!collectionToDelete) return;
    try {
      await collectionService.deleteCollection(collectionToDelete.id);
      setIsDeleteModalOpen(false);
      setCollectionToDelete(null);
      refresh();
    } catch (err) {
      console.error('Failed to delete collection:', err);
      alert('Không thể xóa bộ sưu tập. Vui lòng thử lại.');
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  if (isFormOpen) {
    return (
      <CollectionForm
        initialData={selectedCollectionData}
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    );
  }

  if (viewingCollection) {
    return (
      <CollectionDetail
        collection={viewingCollection}
        onBack={() => setViewingCollection(null)}
        onEdit={(col) => {
          setSelectedCollectionData(col);
          setViewingCollection(null);
          setIsFormOpen(true);
        }}
        refreshCollections={refresh}
      />
    );
  }

  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
        <Breadcrumb
          items={[
            { label: 'QUẢN LÝ HÀNG', href: '#' },
            { label: 'BỘ SƯU TẬP', href: '#' }
          ]}
        />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                COLLECTION MANAGEMENT
              </span>
              <Zap size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Quản lý <span className="text-emerald-600 font-black">Bộ sưu tập</span>
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
          placeholder="Tìm bộ sưu tập..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {error && (
          <Error error={error} />
        )}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm overflow-visible">
          <div className="overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800">
                  <th className="py-5 px-8 rounded-tl-[32px]">Tiêu đề</th>
                  <th className="py-5 px-4 text-center">Handle</th>
                  <th className="py-5 px-4 text-center">Sản phẩm</th>
                  <th className="py-5 pr-8 text-right rounded-tr-[32px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <TableLoading colSpan={4} />
                ) : (collections.length > 0 ? (
                  collections.map((collection) => (
                    <tr
                      key={collection.id}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => setViewingCollection(collection)}
                    >
                      <td className="py-5 px-8">{collection.title}</td>
                      <td className="py-5 px-4 text-center">/{collection.handle}</td>
                      <td className="py-5 px-4 text-center">{collection.products?.length || 0}</td>
                      <td className="py-5 pr-8 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === collection.id ? null : collection.id);
                            }}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-all"
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {activeMenuId === collection.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <button
                                  onClick={() => {
                                    handleEdit(collection);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                                >
                                  <Edit3 size={16} className="text-blue-500" />
                                  Chỉnh sửa
                                </button>
                                <button
                                  onClick={() => {
                                    setCollectionToDelete(collection);
                                    setIsDeleteModalOpen(true);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-4 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 flex items-center gap-3 transition-colors border-t border-slate-50 dark:border-slate-800/50"
                                >
                                  <Trash2 size={16} />
                                  Xóa
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-5 px-8 text-center">
                      Không có dữ liệu
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {!loading && count > limit && (
          <div className="flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 rounded-b-[32px]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Đang hiển thị {offset + 1} - {Math.min(offset + limit, count)} trong số {count}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, i, arr) => (
                  <Fragment key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="text-slate-300">...</span>}
                    <button
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${p === currentPage
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                        : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                      {p}
                    </button>
                  </Fragment>
                ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa bộ sưu tập "${collectionToDelete?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        variant="danger"
      />
    </Fragment>
  )
}
