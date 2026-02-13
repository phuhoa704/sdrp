import React, { Fragment } from 'react'
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Empty } from './Empty';
import { cn } from '@/lib/utils';

interface Props<T> {
  columns: {
    title: React.ReactNode;
    width?: string;
    className?: string;
  }[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: {
    title: string;
    description: string;
  };
  renderRow?: (item: T, index: number) => React.ReactNode;
  headerClassName?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const TableView = <T,>({ columns, data, isLoading, emptyMessage, renderRow, headerClassName, pagination }: Props<T>) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
          <thead>
            <tr className={cn(`bg-primary dark:bg-slate-800/50 text-[10px] font-black text-white dark:text-slate-500 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800`, headerClassName || "")}>
              {columns.map((column, index) => (
                <th key={index} className={`py-5 px-4 first:pl-8 last:pr-8 ${column.className || ''}`} style={{ width: column.width }}>
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-20">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : (data.length > 0 ? (
              renderRow ? (
                data.map((item, index) => renderRow(item, index))
              ) : null
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-32 text-center">
                  <Empty title={emptyMessage?.title || 'No data'} description={emptyMessage?.description || 'No records found'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && !isLoading && pagination.totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center sm:text-left">
              Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} / {pagination.totalItems}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.currentPage) <= 1)
                .map((p, i, arr) => (
                  <Fragment key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="text-slate-300 px-1 text-[10px]">...</span>}
                    <button
                      onClick={() => pagination.onPageChange(p)}
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-[10px] sm:text-xs font-black transition-all",
                        p === pagination.currentPage
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                          : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      )}
                    >
                      {p}
                    </button>
                  </Fragment>
                ))}
            </div>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
