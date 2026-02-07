import { Button, Card } from '@/components'
import { useToast } from '@/contexts/ToastContext'
import { stockLocationService } from '@/lib/api/medusa/stockLocationService'
import { cn } from '@/lib/utils'
import { StockLocation } from '@/types/stock'
import {
  ArrowLeft,
  MoreHorizontal,
  Store,
  MapPin,
  Edit3,
  Globe,
  Truck,
  Package,
  Check,
  Search,
  Info
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Drawer } from '@/components/Drawer'
import { useSalesChannels } from '@/hooks/medusa/useSalesChannels'

import { StockLocationEditDrawer } from '@/components/form/stockLocation/StockLocationEditDrawer'

interface Props {
  id: string
  onBack: () => void
}

export const StockLocationDetail = ({ id, onBack }: Props) => {
  const { showToast } = useToast()
  const [location, setLocation] = useState<StockLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [isManageSalesChannelsOpen, setIsManageSalesChannelsOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)

  const fetchDetail = async () => {
    setLoading(true)
    try {
      const res = await stockLocationService.getStockLocation(id)
      setLocation(res.stock_location)
    } catch (error: any) {
      showToast(error.message || 'Không thể tải thông tin vị trí kho', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!location) return null

  const address = location.address;
  const addressString = [
    address?.address_1,
    address?.address_2,
    address?.city,
    address?.province,
    address?.postal_code,
    address?.country_code?.toUpperCase()
  ].filter(Boolean).join(', ');

  return (
    <div className="pb-32 animate-fade-in space-y-8 min-h-full font-sans">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-800">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{location.name}</h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">
              <span>VỊ TRÍ KHO</span>
              <span>•</span>
              <span>ID: {location.id.slice(location.id.length - 8)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <Card className="p-8 relative overflow-hidden group">
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => setIsEditDrawerOpen(true)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-blue-500"
                title="Chỉnh sửa thông tin"
              >
                <Edit3 size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{location.name}</h3>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                    {addressString || 'Chưa cập nhật địa chỉ'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Fulfillment Providers Panels - Placeholder/Mockup */}
          <Card className="p-0 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-slate-400" />
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Pickup</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Disabled
                </span>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-slate-400" />
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Shipping</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Disabled
                </span>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Sales Channels Sidebar Panel */}
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Store size={16} className="text-emerald-500" />
                Sales Channels
              </h3>
              <button
                onClick={() => setIsManageSalesChannelsOpen(true)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-blue-500"
              >
                <Edit3 size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {location.sales_channels && location.sales_channels.length > 0 ? (
                <div className="space-y-3">
                  {location.sales_channels.map(sc => (
                    <div key={sc.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-[20px] border border-slate-100 dark:border-slate-800">
                      <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm shrink-0">
                        <Store size={14} className="text-slate-400" />
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{sc.name}</p>
                    </div>
                  ))}
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-center mt-4">
                    Đã kết nối đến {location.sales_channels.length} kênh bán hàng
                  </p>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <Store size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">No sales channels connected</p>
                </div>
              )}
            </div>
          </Card>

          {/* Fulfillment Providers Sidebar Panel */}
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Truck size={16} className="text-blue-500" />
                Fulfillment Providers
              </h3>
              <MoreHorizontal size={16} className="text-slate-400" />
            </div>
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                <Info size={20} />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight">No records</h4>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-1">
                  This Stock Location is not connected to any fulfillment providers.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-xl px-4 text-[9px] font-black tracking-widest uppercase border-slate-200 dark:border-slate-700 h-9"
              >
                Connect Providers
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ManageSalesChannelsDrawer
        isOpen={isManageSalesChannelsOpen}
        onClose={() => setIsManageSalesChannelsOpen(false)}
        stockLocation={location}
        onUpdate={() => {
          fetchDetail()
          setIsManageSalesChannelsOpen(false)
        }}
      />

      <StockLocationEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        stockLocation={location}
        onUpdate={() => {
          fetchDetail()
          setIsEditDrawerOpen(false)
        }}
      />
    </div>
  )
}


interface ManageSalesChannelsDrawerProps {
  isOpen: boolean
  onClose: () => void
  stockLocation: StockLocation
  onUpdate: () => void
}

const ManageSalesChannelsDrawer = ({ isOpen, onClose, stockLocation, onUpdate }: ManageSalesChannelsDrawerProps) => {
  const { showToast } = useToast()
  const { salesChannels, loading: channelsLoading } = useSalesChannels({ autoFetch: true, limit: 100 })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isOpen && stockLocation.sales_channels) {
      setSelectedIds(stockLocation.sales_channels.map(sc => sc.id))
    }
  }, [isOpen, stockLocation])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const currentIds = stockLocation.sales_channels?.map(sc => sc.id) || []
      const add = selectedIds.filter(id => !currentIds.includes(id))
      const remove = currentIds.filter(id => !selectedIds.includes(id))

      if (add.length > 0 || remove.length > 0) {
        await stockLocationService.manageSalesChannels(stockLocation.id, { add, remove })
        showToast('Cập nhật kênh bán hàng thành công', 'success')
      }
      onUpdate()
    } catch (error: any) {
      showToast(error.message || 'Không thể cập nhật kênh bán hàng', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredChannels = salesChannels.filter(sc =>
    sc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Sales Channels"
      icon={Store}
      width="lg"
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
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all text-sm font-bold text-slate-800 dark:text-white"
            placeholder="Tìm kênh bán hàng..."
          />
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
          {channelsLoading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            filteredChannels.map(channel => {
              const isSelected = selectedIds.includes(channel.id)

              return (
                <button
                  key={channel.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedIds(prev => prev.filter(id => id !== channel.id))
                    } else {
                      setSelectedIds(prev => [...prev, channel.id])
                    }
                  }}
                  className={cn(
                    "w-full p-4 rounded-2xl flex items-center justify-between transition-all border-2 mb-2",
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500/50"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-bold border border-slate-100 dark:border-slate-700">
                      <Store size={20} />
                    </div>
                    <div className="text-left">
                      <p className={cn("text-sm font-black", isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-white")}>
                        {channel.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase truncate max-w-[200px]">{channel.description || 'No description'}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </Drawer>
  )
}
