import { Breadcrumb, Button, Card } from '@/components'
import { SearchFilter } from '@/components/filters/Search'
import { cn, formatDateByFormat, formatTime } from '@/lib/utils'
import { Building2, ChevronRight, Download, Plus, Printer, Receipt } from 'lucide-react'
import React, { Fragment, useState } from 'react'
import { useBooks } from '@/hooks/medusa/useBooks'
import { TableView } from '@/components/TableView'
import { StockForm } from '@/components/books/StockForm'
import { FormTypeModal } from '@/components/books/FormTypeModal'
import { StockUpType } from '@/types/stock-up'

export const StockUp = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [status, setStatus] = useState('all')
  const [selectedType, setSelectedType] = useState<string>("all")
  const options = [
    { id: "all", label: "Tất cả" },
    { id: "processing", label: "Đang xử lý" },
    { id: "completed", label: "Đã nhập kho" },
  ]
  const typeOptions = [
    { id: "all", label: "Tất cả" },
    { id: StockUpType.INBOUND, label: "Nhập hàng" },
    { id: StockUpType.DISPOSAL, label: "Điều chỉnh" },
  ]
  const [currentPage, setCurrentPage] = useState(1)
  const { books, count, loading, error, refresh } = useBooks({
    q: searchTerm,
    limit: 10,
    page: currentPage,
    filters: {
      type: (selectedType === "all" ? [StockUpType.INBOUND, StockUpType.DISPOSAL] : [selectedType]) as StockUpType[]
    },
    fields: "created_at,vendor"
  })
  const [isStockFormOpen, setIsStockFormOpen] = useState(false)
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)
  const [selectedTypeForm, setSelectedTypeForm] = useState<StockUpType>(StockUpType.INBOUND)

  if (isStockFormOpen) return (
    <StockForm
      onBack={() => setIsStockFormOpen(false)}
      initialType={selectedTypeForm}
      onSuccess={() => {
        setIsStockFormOpen(false)
        refresh()
      }}
    />
  )
  return (
    <Fragment>
      {!isStockFormOpen && (
        <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
          <Breadcrumb
            items={[
              { label: 'SỔ SÁCH', href: '#' },
              { label: 'PHIẾU XUẤT/NHẬP HÀNG', href: '#' }
            ]}
          />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
            <div className="shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Inventory Ledger Archive
                </span>
                <Receipt size={12} className='text-emerald-500 animate-pulse' />
              </div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
                Quản Lý <span className="text-emerald-500 font-black">Nhập Hàng</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Lịch sử nhập kho và chứng từ thanh toán NPP</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant='secondary'
                className='h-12 rounded-2xl text-xs font-semibold'
                icon={<Download size={20} />}
              >
                Xuất báo cáo
              </Button>
              <Button
                variant='primary'
                onClick={() => setIsTypeModalOpen(true)}
                className="h-12 rounded-2xl text-xs font-semibold"
                icon={<Plus size={20} />}
              >
                TẠO PHIẾU MỚI
              </Button>
            </div>
          </div>
          <Card className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1'>
              <SearchFilter
                searchTerm={searchTerm}
                handleSearchChange={setSearchTerm}
                placeholder='Tìm theo mã phiếu hoặc nhà cung cấp...'
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {typeOptions.map((type) => (
                  <button
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all",
                      type.id === selectedType
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-blue-500/30"
                    )}
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block"></div>
              <div className="flex gap-2">
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setStatus(option.id)}
                    className={cn(
                      "h-12 px-6 rounded-xl text-[10px] font-black uppercase transition-all border whitespace-nowrap",
                      option.id === status
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-blue-500/30"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
          <TableView
            columns={[
              { title: "Mã phiếu" },
              { title: "Nhà cung cấp" },
              { title: "Thời gian", className: "text-center" },
              { title: "SL Mã", className: "text-center" },
              { title: "Tổng giá trị", className: "text-right" },
              { title: "Trạng thái", className: "text-center" },
              { title: "Thao tác", className: "text-right" },
            ]}
            data={books}
            isLoading={loading}
            emptyMessage={{
              title: "Không tìm thấy phiếu nhập hàng",
              description: "Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm"
            }}
            headerClassName='bg-emerald-500 dark:bg-slate-900'
            pagination={{
              currentPage,
              totalPages: Math.ceil(count / 10),
              onPageChange: (page) => setCurrentPage(page),
              totalItems: count,
              itemsPerPage: 10
            }}
            renderRow={(book, index) => (
              <tr
                key={index}
                className='group hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all cursor-pointer'
              >
                <td className='px-8 py-6'>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
                      {book.code}
                    </span>
                    <span
                      className={cn(
                        "text-[8px] font-black px-1.5 py-0.5 rounded w-fit uppercase",
                        book.type === StockUpType.INBOUND
                          ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600"
                          : "bg-rose-50 dark:bg-rose-900/40 text-rose-600"
                      )}
                    >
                      {book.type === StockUpType.INBOUND ? "Nhập hàng" : "Xuất hủy"}
                    </span>
                  </div>
                </td>
                <td className='px-6 py-6'>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Building2 size={16} />
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{book?.vendor?.name || ""}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {formatDateByFormat(book?.created_at || "", "dd/MM/yyyy")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {formatTime(book?.created_at || "")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-xs font-black text-slate-500 uppercase">
                    {book.product_variant?.length || 0} SKU
                  </span>
                </td>
                <td className="px-6 py-6 text-right">
                  <span className="text-base font-black text-emerald-500">
                    {book.summary?.reduce((acc, item) => acc + item.total, 0) || 0}
                  </span>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter bg-emerald-50 text-emerald-600 border border-emerald-100">

                  </span>
                </td>
                <td className="px-8 py-6 text-right pr-10">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2.5 bg-white dark:bg-slate-700 rounded-xl text-slate-400 hover:text-emerald-500 shadow-sm border border-slate-50 dark:border-slate-600 transition-all">
                      <Printer size={16} />
                    </button>
                    <button className="p-2.5 bg-white dark:bg-slate-700 rounded-xl text-slate-400 hover:text-emerald-500 shadow-sm border border-slate-50 dark:border-slate-600 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>
      )}
      <FormTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelect={(type) => {
          setSelectedTypeForm(type)
          setIsStockFormOpen(true)
        }}
      />
    </Fragment>
  )
}
