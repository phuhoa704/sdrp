import { Breadcrumb, Button } from '@/components'
import { useCategories } from '@/hooks';
import { matchCategoryStatus, matchCategoryStatusColor, matchCategoryType, matchCategoryTypeColor } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { AlertCircle, ChevronLeft, ChevronRight, Edit3, MoreHorizontal, Plus, Search, Trash2, Zap } from 'lucide-react';
import React, { Fragment, useState } from 'react'
import { CategoryForm } from '@/components/form/category/CategoryForm';
import { CategoryDetail } from './CategoryDetail';
import { ProductCategory } from '@/types/product';
import { ConfirmModal } from '@/components/ConfirmModal';
import { categoryService } from '@/lib/api/medusa/categoryService';

export default function Category() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState<ProductCategory | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);
  const [viewingCategory, setViewingCategory] = useState<ProductCategory | null>(null);

  const limit = 10;
  const offset = (currentPage - 1) * limit;

  //hook
  const { categories, count, loading, error, refresh } = useCategories({
    q: searchTerm,
    limit,
    offset
  });

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
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      refresh();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Không thể xóa danh mục. Vui lòng thử lại.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isFormOpen) {
    return (
      <CategoryForm
        initialData={selectedCategoryData}
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    );
  }

  if (viewingCategory) {
    return (
      <CategoryDetail
        category={viewingCategory}
        onBack={() => setViewingCategory(null)}
        onEdit={(cat) => {
          setSelectedCategoryData(cat);
          setViewingCategory(null);
          setIsFormOpen(true);
        }}
        refreshCategories={refresh}
      />
    );
  }

  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
        <Breadcrumb
          items={[
            { label: 'QUẢN LÝ HÀNG', href: '#' },
            { label: 'LOẠI HÀNG', href: '#' }
          ]}
        />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                CATEGORY MANAGEMENT
              </span>
              <Zap size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Phân loại <span className="text-emerald-600 font-black">Hàng hóa</span>
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
        <div className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Tìm sản phẩm, hoạt chất..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-sm dark:text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-6 rounded-3xl flex items-center gap-4 text-rose-600">
            <AlertCircle className="shrink-0" />
            <p className="text-sm font-bold">Lỗi kết nối: {error}</p>
          </div>
        )}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm overflow-visible">
          <div className="overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800">
                  <th className="py-5 px-8 rounded-tl-[32px]">Tên danh mục</th>
                  <th className="py-5 px-4 text-center">Handle</th>
                  <th className="py-5 px-4 text-center">Trạng thái</th>
                  <th className="py-5 px-4 text-center">Loại</th>
                  <th className="py-5 pr-8 text-right rounded-tr-[32px]">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    </td>
                  </tr>
                ) : (categories.length > 0 ? (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      onClick={() => setViewingCategory(category)}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="py-5 px-8 font-bold text-slate-700 dark:text-slate-200">{category.name}</td>
                      <td className="py-5 px-4 text-center">
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">/{category.handle}</span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <div className="flex justify-center items-center gap-2 text-xs xl:text-sm">
                          <div className={cn("w-2 h-2 rounded-full", matchCategoryStatusColor(category))}></div>
                          <span className="font-bold">{matchCategoryStatus(category)}</span>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <div className="flex justify-center items-center gap-2 text-xs xl:text-sm font-bold">
                          <div className={cn("w-2 h-2 rounded-full", matchCategoryTypeColor(category))}></div>
                          {matchCategoryType(category)}
                        </div>
                      </td>
                      <td className="py-5 pr-8 text-right">
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
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <button
                                  onClick={() => {
                                    handleEdit(category);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                                >
                                  <Edit3 size={16} className="text-blue-500" />
                                  Chỉnh sửa
                                </button>
                                <button
                                  onClick={() => {
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20">
                      <div className="flex justify-center">
                        <p className="text-sm font-bold opacity-40 uppercase tracking-widest">Không có danh mục nào</p>
                      </div>
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
