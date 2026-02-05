import { Breadcrumb, Button } from '@/components'
import { InputSearch } from '@/components/Search';
import { TableLoading } from '@/components/TableLoading';
import { useCollections } from '@/hooks/medusa/useCollections';
import { Plus, Zap } from 'lucide-react'
import React, { Fragment, useState } from 'react'
import { Error } from '@/components/Error';
import { ProductCollection } from '@/types/product';
import { CollectionForm } from '@/components/form/collection/CollectionForm';
import { ConfirmModal } from '@/components/ConfirmModal';
import { collectionService } from '@/lib/api/medusa/collectionService';
import { CollectionCard } from '@/components/collection/CollectionCard';
import { Empty } from '@/components/Empty';

export default function Collection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCollectionData, setSelectedCollectionData] = useState<ProductCollection | null>(null)
  const [collectionToDelete, setCollectionToDelete] = useState<ProductCollection | null>(null)
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { collections, loading, error, refresh } = useCollections({
    autoFetch: true,
    q: searchTerm,
    limit,
    offset
  });


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

  if (isFormOpen) {
    return (
      <CollectionForm
        initialData={selectedCollectionData}
        onBack={() => {
          setIsFormOpen(false);
          setSelectedCollectionData(null);
        }}
        onSave={handleSave}
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
        {loading ? (
          <div>
            <TableLoading />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.length > 0 ? collections.map((collection: ProductCollection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={() => handleEdit(collection)}
              />
            )) : (
              <div className="col-span-full">
                <Empty
                  title="Không có bộ sưu tập nào"
                  description="Hãy tạo bộ sưu tập mới để bắt đầu"
                />
              </div>
            )}
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
