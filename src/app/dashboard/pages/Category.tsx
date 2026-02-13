import { Breadcrumb, Button } from '@/components'
import { useCategories } from '@/hooks';
import { cn } from '@/lib/utils';
import { Edit3, ListOrdered, MoreHorizontal, Plus, Tags, Trash2, Zap, Folder, CornerDownRight } from 'lucide-react';
import React, { Fragment, useMemo, useState } from 'react'
import { CategoryForm } from '@/components/form/category/CategoryForm';
import { ProductCategory } from '@/types/product';
import { ConfirmModal } from '@/components/ConfirmModal';
import { TableView } from '@/components/TableView';
import { categoryService } from '@/lib/api/medusa/categoryService';
import { InputSearch } from '@/components/Search';
import { Error } from '@/components/Error';
import { CategoryRanking } from '@/components/category/CategoryRanking';
import { useToast } from '@/contexts/ToastContext';

export default function Category() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState<ProductCategory | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);
  const [isRankingOpen, setIsRankingOpen] = useState(false);

  const limit = 100;
  const offset = (currentPage - 1) * limit;

  //hook
  const { categories, count, loading, error, refresh } = useCategories({
    q: searchTerm,
    limit,
    offset
  });


  const sortedCategories = useMemo(() => {
    if (!categories) return [];

    const getRank = (c: any) => c.rank ?? c.metadata?.rank ?? 0;

    const catMap = new Map(categories.map(c => [c.id, c]));

    const roots = categories.filter(c => !c.parent_category_id || !catMap.has(c.parent_category_id));

    const childMap = new Map<string, ProductCategory[]>();
    categories.forEach(c => {
      if (c.parent_category_id && catMap.has(c.parent_category_id)) {
        const existing = childMap.get(c.parent_category_id) || [];
        existing.push(c);
        childMap.set(c.parent_category_id, existing);
      }
    });

    const sortFn = (a: ProductCategory, b: ProductCategory) => getRank(a) - getRank(b);

    roots.sort(sortFn);

    const result: ProductCategory[] = [];

    const traverse = (cat: ProductCategory) => {
      result.push(cat);
      const children = childMap.get(cat.id);
      if (children) {
        children.sort(sortFn);
        children.forEach(traverse);
      }
    };

    roots.forEach(traverse);

    return result;
  }, [categories]);

  const totalPages = Math.ceil(count / limit);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCreate = () => {
    setSelectedCategoryData(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: ProductCategory) => {
    setSelectedCategoryData(category);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    setIsFormOpen(false);
    setSelectedCategoryData(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      showToast('Xóa danh mục thành công', 'success');
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      refresh();
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      showToast(error.message || 'Không thể xóa danh mục', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveRanking = async () => {
    refresh();
  };

  if (isFormOpen) {
    return (
      <CategoryForm
        initialData={selectedCategoryData}
        onSave={handleSave}
        onBack={() => {
          setIsFormOpen(false);
          setSelectedCategoryData(null);
        }}
      />
    );
  }

  if (isRankingOpen) {
    return (
      <CategoryRanking
        categories={sortedCategories}
        onCancel={() => setIsRankingOpen(false)}
        onSave={handleSaveRanking}
      />
    );
  }

  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
        <Breadcrumb
          items={[
            { label: 'KHO HÀNG', href: '#' },
            { label: 'LOẠI HÀNG', href: '#' }
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                Type Architecture
              </span>
              <Tags size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-tight sm:leading-none">
              Cấu Trúc <span className="text-emerald-600 font-black">Loại Hàng</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-lg mt-1">Quản lý phân cấp và thứ tự hiển thị trên ứng dụng khách hàng</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant='secondary'
              className='h-12 rounded-2xl text-[10px] sm:text-xs font-semibold px-4'
              icon={<ListOrdered size={20} className='text-primary' />}
              onClick={() => setIsRankingOpen(true)}
            >
              RANK
            </Button>
            <Button
              variant='primary'
              className="h-12 rounded-2xl text-[10px] sm:text-xs font-semibold px-4"
              icon={<Plus size={20} />}
              onClick={handleCreate}
            >
              THÊM MỚI
            </Button>
          </div>
        </div>
        <InputSearch
          placeholder="Tìm sản phẩm, hoạt chất..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {error && (
          <Error error={error} />
        )}
        <TableView
          columns={[
            { title: 'Rank', width: '80px', className: 'pl-8 text-center' },
            { title: 'Tên loại hàng' },
            { title: 'URL / Path' },
            { title: 'Trạng thái', className: 'text-right' },
            { title: 'Hiển thị', className: 'text-right' },
            { title: '', className: 'text-right pr-8' },
          ]}
          data={sortedCategories}
          isLoading={loading}
          emptyMessage={{
            title: "Không có danh mục nào",
            description: "Hãy tạo danh mục mới để bắt đầu"
          }}
          pagination={{
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: handlePageChange,
            totalItems: count,
            itemsPerPage: limit
          }}
          renderRow={(category: any, index: number) => {
            const isChild = !!category.parent_category_id;
            return (
              <tr
                key={category.id}
                onClick={() => {
                  setSelectedCategoryData(category);
                  setIsFormOpen(true);
                }}
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-none"
              >
                <td className="py-5 px-4 pl-8 text-center">
                  <span className={cn(
                    "w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center",
                    isChild ? "bg-transparent text-slate-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  )}>
                    {isChild ? '' : index + 1}
                  </span>
                </td>
                <td className="py-5 px-4 font-bold text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-3" style={{ paddingLeft: isChild ? '32px' : '0px' }}>
                    {isChild && <CornerDownRight size={16} className="text-slate-300" />}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      isChild ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500" : "bg-emerald-50 dark:bg-emerald-900/20 text-primary"
                    )}>
                      {isChild ? <Tags size={14} /> : <Folder size={16} className="fill-current opacity-20" />}
                      {!isChild && <Folder size={16} className="absolute" />}
                    </div>
                    <span className="uppercase tracking-wide text-sm">{category.name}</span>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <span className="text-xs font-medium text-slate-400">/{category.handle}</span>
                </td>
                <td className="py-5 px-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full bg-primary", category.is_active ? "animate-pulse" : "bg-slate-300")}></div>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", category.is_active ? "text-primary" : "text-slate-400")}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full bg-[#00B074]", category.is_public !== false ? "animate-pulse" : "bg-slate-300")}></div>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", category.is_public !== false ? "text-[#00B074]" : "text-slate-400")}>
                      {category.is_public !== false ? 'Public' : 'Private'}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === category.id ? null : category.id);
                      }}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-all"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeMenuId === category.id && (
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
                              handleEdit(category);
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
                              setCategoryToDelete(category);
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
            );
          }}
        />

      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Xác nhận xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}"? Hành động này sẽ không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm thuộc danh mục này.`}
        variant="danger"
        confirmText="Xóa danh mục"
      />
    </Fragment>
  )
}
