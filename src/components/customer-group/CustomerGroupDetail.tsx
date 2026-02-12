import { Breadcrumb, Button, Card, ConfirmModal } from '@/components'
import { useToast } from '@/contexts/ToastContext'
import { customerGroupService } from '@/lib/api/medusa/customerGroupService'
import { formatDate, cn } from '@/lib/utils'
import type { CustomerGroup as CustomerGroupType } from '@/types/customer-group'
import {
  ArrowLeft,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
  User,
  Mail,
  Phone,
  Edit3,
  Check,
  Search
} from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import { Drawer } from '@/components/Drawer'
import { Customer } from '@/types/customer'
import { useCustomers } from '@/hooks/medusa/useCustomer'
import { SearchFilter } from '../filters/Search'

interface Props {
  id: string
  onBack: () => void
}

export const CustomerGroupDetail = ({ id, onBack }: Props) => {
  const { showToast } = useToast()
  const [group, setGroup] = useState<CustomerGroupType | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isAddCustomersDrawerOpen, setIsAddCustomersDrawerOpen] = useState(false)
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false)
  const brandMenuRef = useRef<HTMLDivElement>(null)

  // For Edit Name
  const [newName, setNewName] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // For Add Customers Selection
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([])
  const { customers: allCustomers, loading: customersLoading } = useCustomers({ query: { limit: 100, q: searchQuery } })
  const { customers: groupCustomers, loading: groupCustomersLoading, refresh: refreshGroupCustomers } = useCustomers({ query: { limit: 100, q: searchQuery, groups: [id] } })

  const fetchDetail = async () => {
    setLoading(true)
    try {
      const res = await customerGroupService.getCustomerGroup(id)
      setGroup(res.customer_group)
      setNewName(res.customer_group.name)
    } catch (error: any) {
      showToast(error.message || 'Không thể tải thông tin nhóm', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandMenuRef.current && !brandMenuRef.current.contains(event.target as Node)) {
        setIsBrandMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdateName = async () => {
    if (!newName.trim()) return
    setIsUpdating(true)
    try {
      await customerGroupService.updateCustomerGroup(id, { name: newName })
      showToast('Cập nhật tên nhóm thành công', 'success')
      setIsEditDrawerOpen(false)
      fetchDetail()
    } catch (error: any) {
      showToast(error.message || 'Không thể cập nhật tên nhóm', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddCustomers = async () => {
    if (selectedCustomerIds.length === 0) return
    setIsUpdating(true)
    try {
      await customerGroupService.manageCustomers(id, { add: selectedCustomerIds })
      showToast('Thêm khách hàng vào nhóm thành công', 'success')
      setIsAddCustomersDrawerOpen(false)
      setSelectedCustomerIds([])
      fetchDetail()
      refreshGroupCustomers();
    } catch (error: any) {
      showToast(error.message || 'Không thể thêm khách hàng', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveCustomer = async (customerId: string) => {
    try {
      await customerGroupService.manageCustomers(id, { remove: [customerId] })
      showToast('Đã xóa khách hàng khỏi nhóm', 'success')
      fetchDetail()
      refreshGroupCustomers();
    } catch (error: any) {
      showToast(error.message || 'Không thể xóa khách hàng', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!group) return null

  return (
    <div className="pb-32 animate-fade-in space-y-8 min-h-full font-sans">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-800">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{group.name}</h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">
              <span>NHÓM KHÁCH HÀNG</span>
              <span>•</span>
              <span>ID: {group.id.slice(group.id.length - 8)}</span>
            </div>
          </div>
        </div>

        {/* Header More Dropdown */}
        <div className="relative" ref={brandMenuRef}>
          <button
            onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-800 text-slate-500"
          >
            <MoreHorizontal size={24} />
          </button>
          {isBrandMenuOpen && (
            <div className="absolute top-full right-0 mt-3 glass-panel w-48 rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-slide-up z-[60] backdrop-blur-sm bg-white dark:bg-slate-900">
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setIsEditDrawerOpen(true)
                    setIsBrandMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-[11px] font-bold tracking-wide transition-all text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  <Edit3 size={16} className="text-blue-500" />
                  <span>Chỉnh sửa thông tin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-0 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Danh sách khách hàng</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{groupCustomers?.length || 0} Thành viên</p>
                </div>
              </div>
              <Button
                onClick={() => setIsAddCustomersDrawerOpen(true)}
                variant="primary"
                size="sm"
                icon={<Plus size={16} />}
                className="rounded-xl px-4 text-[10px] font-black tracking-widest uppercase"
              >
                THÊM THÀNH VIÊN
              </Button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {groupCustomers && groupCustomers.length > 0 ? (
                groupCustomers.map((c: Customer) => (
                  <div key={c.id} className="px-8 py-5 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm overflow-hidden border-2 border-white dark:border-slate-900 shadow-sm">
                        {c.first_name?.[0]}{c.last_name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white">
                          {c.first_name} {c.last_name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <Mail size={12} /> {c.email}
                          </span>
                          {c.phone && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                              <Phone size={12} /> {c.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCustomer(c.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100 dark:border-slate-800">
                    <Users size={32} />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Chưa có thành viên</h4>
                  <p className="text-xs text-slate-400 font-bold mt-1">Hãy thêm khách hàng vào nhóm này để bắt đầu chăm sóc</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Plus size={14} /> Thông tin khác
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Ngày tạo nhóm</label>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Mail size={14} className="text-slate-400" />
                  </div>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200">{formatDate(group.created_at)}</p>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Cập nhật lần cuối</label>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Phone size={14} className="text-slate-400" />
                  </div>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200">{formatDate(group.updated_at)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MoreHorizontal size={14} /> Metadata
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500">{Object.keys(group.metadata || {}).length} KEYS</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <pre className="text-[10px] font-mono text-slate-500 dark:text-slate-400 overflow-x-auto">
                {JSON.stringify(group.metadata, null, 2)}
              </pre>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Trash2 size={14} /> JSON
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500">{Object.keys(group || {}).length} KEYS</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <pre className="text-[10px] font-mono text-slate-500 dark:text-slate-400 overflow-x-auto max-h-64 no-scrollbar">
                {JSON.stringify(group, null, 2)}
              </pre>
            </div>
          </Card>
        </div>
      </div>

      {/* Drawers */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Chỉnh sửa nhóm"
        icon={Edit3}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsEditDrawerOpen(false)} fullWidth>Hủy bỏ</Button>
            <Button
              variant="primary"
              onClick={handleUpdateName}
              loading={isUpdating}
              disabled={isUpdating || !newName.trim()}
              fullWidth
            >
              Lưu thay đổi
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên nhóm</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full h-14 px-6 bg-white placeholder:text-slate-400 dark:bg-white/5 rounded-2xl border border-slate-700 dark:border-white/10 outline-none focus:border-emerald-500 transition-all text-sm font-bold text-slate-800 dark:text-white shadow-sm"
              placeholder="Nhập tên nhóm mới..."
            />
          </div>
        </div>
      </Drawer>

      <Drawer
        isOpen={isAddCustomersDrawerOpen}
        onClose={() => setIsAddCustomersDrawerOpen(false)}
        title="Thêm thành viên"
        icon={Plus}
        width="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsAddCustomersDrawerOpen(false)} fullWidth>Hủy bỏ</Button>
            <Button
              variant="primary"
              onClick={handleAddCustomers}
              loading={isUpdating}
              disabled={isUpdating || selectedCustomerIds.length === 0}
              fullWidth
            >
              Thêm {selectedCustomerIds.length} khách hàng
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <SearchFilter
            searchTerm={searchQuery}
            handleSearchChange={setSearchQuery}
            placeholder='Tìm kiếm khách hàng...'
          />

          <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {customersLoading ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              allCustomers.map(customer => {
                const isSelected = selectedCustomerIds.includes(customer.id)
                const alreadyInGroup = group.customers?.some(gc => gc.id === customer.id)

                return (
                  <button
                    key={customer.id}
                    disabled={alreadyInGroup}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCustomerIds(prev => prev.filter(hid => hid !== customer.id))
                      } else {
                        setSelectedCustomerIds(prev => [...prev, customer.id])
                      }
                    }}
                    className={cn(
                      "w-full p-4 rounded-2xl flex items-center justify-between transition-all border-2 mb-2",
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/50"
                        : "bg-white dark:bg-white/5 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm",
                      alreadyInGroup && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold border border-slate-100 dark:border-slate-700">
                        {customer.first_name?.[0]}{customer.last_name?.[0]}
                      </div>
                      <div className="text-left">
                        <p className={cn("text-sm font-bold", isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white")}>
                          {customer.first_name} {customer.last_name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{customer.email}</p>
                      </div>
                    </div>
                    {isSelected && <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Check size={14} /></div>}
                    {alreadyInGroup && <span className="text-[9px] font-black text-slate-500 uppercase">Đã trong nhóm</span>}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </Drawer>
    </div>
  )
}
