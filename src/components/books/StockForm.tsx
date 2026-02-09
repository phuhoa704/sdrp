import { ArrowLeft, Building2, CheckCircle2, ChevronDown, ChevronUp, Plus, Receipt } from 'lucide-react'
import React, { useState } from 'react'
import { Card } from '../Card'
import { StockUpType } from '@/types/stock-up'
import { Button } from '../Button'
import { cn } from '@/lib/utils'
import { SearchFilter } from '../filters/Search'
import { TableView } from '../TableView'
import { useInventoryItems } from '@/hooks/medusa/useInventory'

import { useToast } from '@/contexts/ToastContext'
import { booksService } from '@/lib/api/medusa/booksService'
import { noImage } from '@/configs'

export const StockForm = ({ onBack, onSuccess }: { onBack?: () => void, onSuccess?: () => void }) => {
  const { showToast } = useToast()
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [isVendorOpen, setIsVendorOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [findBy, setFindBy] = useState<'product' | 'sku'>('product')
  const [formValues, setFormValues] = useState({
    type: StockUpType.INBOUND,
    vendor: "NPP Trung Tâm",
    code: "",
    title: "Phiếu nhập hàng mới"
  })

  const [itemInputs, setItemInputs] = useState<Record<string, {
    quantity: number,
    price: number,
    location_id: string,
    inventory_level_id: string,
    sku: string,
    title: string,
    thumbnail: string
  }>>({})

  const { inventoryItems, loading } = useInventoryItems({ q: searchTerm, limit: 100 })
  const typeOpts = [
    { id: StockUpType.INBOUND, label: "Nhập hàng (Inbound)" },
    { id: StockUpType.DISPOSAL, label: "Xuất hủy (Disposal)" },
  ]
  const findByOpts = [
    { id: 'product', label: "Tìm theo sản phẩm" },
    { id: 'sku', label: "Tìm theo biến thể" },
  ]
  const vendorOpts = [
    { id: "v1", label: "NPP Trung Tâm" },
    { id: "v2", label: "NPP Miền Nam" },
    { id: "v3", label: "NPP Miền Bắc" },
  ]
  return (
    <div className='animate-fade-in space-y-8 pb-32'>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
            <ArrowLeft size={24} className='text-slate-500' />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">
              Lập phiếu nghiệp vụ
            </h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Inventory Management System</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <Card className='space-y-6'>
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-4">
                Cấu hình phiếu
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Loại phiếu
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <button onClick={() => setIsTypeOpen(prev => !prev)} className="w-full h-12 pl-12 pr-10 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm font-bold shadow-inner flex items-center text-left">
                      <span className='text-slate-900 dark:text-white'>
                        {typeOpts.find(o => o.id === formValues.type)?.label || 'Chọn loại phiếu'}
                      </span>
                    </button>
                    <Building2 size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none' />
                    {isTypeOpen ? <ChevronDown size={16} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform pointer-events-none' />
                      : <ChevronUp size={16} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform pointer-events-none' />
                    }
                    <div
                      className={cn(
                        "absolute top-full left-0 right-0 mt-2 z-[200] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-up",
                        isTypeOpen ? "block" : "hidden"
                      )}>
                      {typeOpts.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setFormValues({ ...formValues, type: type.id })
                            setIsTypeOpen(false)
                          }}
                          className="w-full px-5 py-3.5 text-left text-xs font-bold transition-colors border-b last:border-none border-slate-50 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Nhà cung cấp
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <button onClick={() => setIsVendorOpen(prev => !prev)} className="w-full h-12 pl-12 pr-10 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm font-bold shadow-inner flex items-center text-left">
                      <span className='text-slate-900 dark:text-white'>{formValues.vendor || 'Chọn nhà cung cấp'}</span>
                    </button>
                    <Building2 size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none' />
                    {isVendorOpen ? <ChevronDown size={16} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform pointer-events-none' />
                      : <ChevronUp size={16} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform pointer-events-none' />
                    }
                    <div className={cn(
                      "absolute top-full left-0 right-0 mt-2 z-[200] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-up",
                      isVendorOpen ? "block" : "hidden"
                    )}>
                      {vendorOpts.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setFormValues({ ...formValues, vendor: v.label })
                            setIsVendorOpen(false)
                          }}
                          className="w-full px-5 py-3.5 text-left text-xs font-bold transition-colors border-b last:border-none border-slate-50 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Mã phiếu
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder='Tự động sinh (hoặc tự nhập)'
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 shadow-inner"
                    />
                    <Receipt size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t dark:border-slate-800 space-y-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-4">
                Chi tiết thanh toán
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                  <span>Số lượng mặt hàng:</span>
                  <span className="text-slate-800 dark:text-white">
                    {Object.values(itemInputs).filter(i => i.quantity > 0).length} SKU
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                  <span>Tổng số lượng:</span>
                  <span className="text-slate-800 dark:text-white">
                    {Object.values(itemInputs).reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
                <div className="pt-6 border-t dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Tổng tiền hàng nhập</p>
                  <p className="text-4xl font-black tracking-tighter leading-none text-blue-600">
                    {Object.values(itemInputs).reduce((total, item) => total + (item.quantity * item.price), 0).toLocaleString()}đ
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant='primary'
              className='mt-5 w-full'
              icon={isSubmitting ? undefined : <CheckCircle2 size={24} />}
              loading={isSubmitting}
              onClick={async () => {
                const selected = Object.entries(itemInputs)
                  .filter(([_, data]) => data.quantity > 0)
                  .map(([itemId, data]) => ({
                    inventory_item_id: itemId,
                    variant_id: itemId,
                    quantity: data.quantity,
                    price: data.price,
                    location_id: data.location_id,
                    inventory_level_id: data.inventory_level_id
                  }))

                if (selected.length === 0) {
                  showToast('Vui lòng nhập số lượng cho ít nhất 1 mặt hàng', 'warning')
                  return
                }

                setIsSubmitting(true)
                try {
                  await booksService.createStockup({
                    title: formValues.title || `Nhập hàng ${new Date().toLocaleDateString()}`,
                    type: formValues.type,
                    summary: [{
                      items: selected,
                      total: selected.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0)
                    }]
                  })
                  showToast('Lập phiếu nhập hàng thành công', 'success')
                  onSuccess?.()
                } catch (err: any) {
                  showToast(err.message || 'Lỗi khi lập phiếu', 'error')
                } finally {
                  setIsSubmitting(false)
                }
              }}
              disabled={isSubmitting || Object.values(itemInputs).filter(i => i.quantity > 0).length === 0}
            >
              Xác nhận nhập kho
            </Button>
          </Card>
        </div>
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] space-y-6 shadow-xl relative z-[50]">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Plus size={18} className='text-blue-500' />
                Thêm hàng vào phiếu
              </h3>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {findByOpts.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFindBy(opt.id as 'product' | 'sku')}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                      findBy === opt.id ? "bg-white dark:bg-slate-700 text-emerald-500 shadow-sm" : "text-slate-400"
                    )}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <SearchFilter
              searchTerm={searchTerm}
              handleSearchChange={setSearchTerm}
              placeholder='Nhập SKU hoặc quy cách'
            />
          </div>
          <TableView
            columns={[
              { title: "SKU/ Quy cách" },
              { title: "Kho nhập" },
              { title: "Số lượng", className: "w-24" },
              { title: "Đơn giá nhập", className: "w-40" },
              { title: "Thành tiền", className: "text-right pr-8" }
            ]}
            data={inventoryItems}
            isLoading={loading}
            renderRow={(item, index) => {
              const input = itemInputs[item.id] || {
                quantity: 0,
                price: 0,
                location_id: item.location_levels?.[0]?.location_id || '',
                inventory_level_id: item.location_levels?.[0]?.id || '',
                sku: item.sku || '',
                title: item.title || '',
                thumbnail: item.thumbnail || ''
              }

              const updateInput = (updates: Partial<typeof input>) => {
                setItemInputs(prev => ({
                  ...prev,
                  [item.id]: { ...input, ...updates }
                }))
              }

              return (
                <tr
                  key={index}
                  className={cn(
                    "group transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-none",
                    input.quantity > 0 ? "bg-emerald-50/30 dark:bg-emerald-500/5" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail || noImage} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-none">{item.sku}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 truncate max-w-[200px]">{item.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={input.location_id}
                      onChange={(e) => {
                        const lcl = item.location_levels?.find(l => l.location_id === e.target.value)
                        updateInput({
                          location_id: e.target.value,
                          inventory_level_id: lcl?.id || ''
                        })
                      }}
                      className="bg-transparent text-[10px] font-bold text-slate-600 dark:text-slate-400 outline-none uppercase border-b border-dashed border-slate-300 dark:border-slate-700 pb-0.5"
                    >
                      {item.location_levels?.map(lvl => (
                        <option key={lvl.id} value={lvl.location_id}>
                          {lvl.location_id.slice(-8).toUpperCase()} (Tồn: {lvl.stocked_quantity})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      min="0"
                      value={input.quantity || ""}
                      onChange={(e) => updateInput({ quantity: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg h-9 px-2 text-center text-xs font-black text-emerald-600 outline-none focus:border-emerald-500"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={input.price || ""}
                        onChange={(e) => updateInput({ price: Number(e.target.value) })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg h-9 pl-2 pr-6 text-right text-xs font-black text-blue-600 outline-none focus:border-blue-500"
                        placeholder="0"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">đ</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right pr-8">
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {(input.quantity * input.price).toLocaleString()}đ
                    </p>
                  </td>
                </tr>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}
