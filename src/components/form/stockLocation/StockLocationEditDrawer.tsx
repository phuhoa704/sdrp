import { Button } from '@/components'
import { Drawer } from '@/components/Drawer'
import { useToast } from '@/contexts/ToastContext'
import { stockLocationService } from '@/lib/api/medusa/stockLocationService'
import { cn } from '@/lib/utils'
import { StockLocation } from '@/types/stock'
import { Edit3 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface StockLocationEditDrawerProps {
  isOpen: boolean
  onClose: () => void
  stockLocation: StockLocation
  onUpdate: () => void
}

export const StockLocationEditDrawer = ({ isOpen, onClose, stockLocation, onUpdate }: StockLocationEditDrawerProps) => {
  const { showToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: {
      address_1: '',
      address_2: '',
      city: '',
      postal_code: '',
      country_code: 'VN',
      province: '',
      phone: '',
      company: '',
    }
  })

  useEffect(() => {
    if (isOpen && stockLocation) {
      setFormData({
        name: stockLocation.name || '',
        address: {
          address_1: stockLocation.address?.address_1 || '',
          address_2: stockLocation.address?.address_2 || '',
          city: stockLocation.address?.city || '',
          postal_code: stockLocation.address?.postal_code || '',
          country_code: stockLocation.address?.country_code || 'VN',
          province: stockLocation.address?.province || '',
          phone: stockLocation.address?.phone || '',
          company: (stockLocation.address?.metadata as any)?.company || '',
        }
      })
    }
  }, [isOpen, stockLocation])

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast('Vui lòng nhập tên vị trí kho', 'warning')
      return
    }

    setIsSaving(true)
    try {
      await stockLocationService.updateStockLocation(stockLocation.id, {
        name: formData.name,
        address: {
          ...formData.address,
          metadata: {
            ...stockLocation.address?.metadata,
            company: formData.address.company
          }
        } as any
      })
      showToast('Cập nhật thông tin kho thành công', 'success')
      onUpdate()
    } catch (error: any) {
      showToast(error.message || 'Không thể cập nhật thông tin kho', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const labelClass = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block"
  const inputClass = "w-full h-12 px-5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:border-emerald-500 transition-all text-sm font-bold text-slate-900 dark:text-white"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Location"
      icon={Edit3}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} fullWidth>Hủy bỏ</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving}
            fullWidth
          >
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            placeholder="Kho trung tâm"
          />
        </div>

        <div>
          <label className={labelClass}>Address</label>
          <input
            type="text"
            value={formData.address.address_1}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, address_1: e.target.value } })}
            className={inputClass}
            placeholder="56, Trung Nhứt, Thốt Nốt, Cần Thơ"
          />
        </div>

        <div>
          <label className={labelClass}>Apartment, suite, etc. (Optional)</label>
          <input
            type="text"
            value={formData.address.address_2}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, address_2: e.target.value } })}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Postal Code (Optional)</label>
            <input
              type="text"
              value={formData.address.postal_code}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postal_code: e.target.value } })}
              className={inputClass}
              placeholder="900000"
            />
          </div>
          <div>
            <label className={labelClass}>City (Optional)</label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
              className={inputClass}
              placeholder="Cần Thơ"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Country</label>
          <select
            value={formData.address.country_code}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country_code: e.target.value } })}
            className={cn(inputClass, "appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1em_1em]")}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 9l4 4 4-4' /%3E%3C/svg%3E")` }}
          >
            <option value="VN">Viet Nam</option>
            <option value="US">United States</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>State (Optional)</label>
          <input
            type="text"
            value={formData.address.province}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, province: e.target.value } })}
            className={inputClass}
            placeholder="Cần Thơ"
          />
        </div>

        <div>
          <label className={labelClass}>Company (Optional)</label>
          <input
            type="text"
            value={formData.address.company}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, company: e.target.value } })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Phone (Optional)</label>
          <input
            type="text"
            value={formData.address.phone}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, phone: e.target.value } })}
            className={inputClass}
            placeholder="0944555666"
          />
        </div>
      </div>
    </Drawer>
  )
}
