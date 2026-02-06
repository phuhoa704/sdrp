import { Breadcrumb, Button } from '@/components'
import { Layers, Plus } from 'lucide-react'
import React, { Fragment, useMemo, useState } from 'react'
import { ProductTypeForm } from '@/components/form/productType/ProductTypeForm';
import { useProductType } from '@/hooks/medusa/useProductType';
import { ProductTypeCard } from '@/components/productType/ProductTypeCard';
import { ProductType } from '@/types/product-type';
import { TableLoading } from '@/components/TableLoading';
import { Empty } from '@/components/Empty';

export const ProductTypes = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const params = useMemo(() => {
    return {
      limit,
      offset: (currentPage - 1) * limit,
    }
  }, [currentPage, limit])
  const { productTypes, count, loading, error, refresh } = useProductType(params);

  const handleEdit = (productType: ProductType) => {
    setSelectedProductType(productType);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedProductType(null);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedProductType(null);
  };

  const handleSave = () => {
    setIsFormOpen(false);
    setSelectedProductType(null);
    refresh();
  };

  if (isFormOpen) {
    return <ProductTypeForm onCancel={handleClose} onSave={handleSave} initialData={selectedProductType} />;
  }

  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
        <Breadcrumb
          items={[
            { label: 'KHO HÀNG', href: '#' },
            { label: 'PHÂN LOẠI HÀNG HÓA', href: '#' }
          ]}
        />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                Master Data Groups
              </span>
              <Layers size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Phân Loại <span className="text-emerald-600 font-black">Sản Phẩm</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Tổ chức hàng hóa theo các nhóm chức năng chính</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant='primary' icon={<Plus size={18} />} onClick={handleCreate}>
              THÊM PHÂN LOẠI
            </Button>
          </div>
        </div>
        {loading ? (
          <TableLoading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productTypes.length > 0 ? productTypes.map((prdType) => (
              <ProductTypeCard key={prdType.id} productType={prdType} onClick={() => handleEdit(prdType)} />
            )) : (
              <div className="col-span-full">
                <Empty title='Không tìm thấy phân loại' description='Hãy thêm phân loại để bắt đầu' />
              </div>
            )}
          </div>
        )}
      </div>
    </Fragment>
  )
}
