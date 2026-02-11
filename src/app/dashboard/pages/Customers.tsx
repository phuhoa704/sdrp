'use client';

import { Fragment, useState, useEffect } from 'react';
import {
  Plus,
  Upload,
  Zap,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  User,
  ChevronRight,
  MoreHorizontal,
  BarChart3,
  BookOpen,
  ChevronDown,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Settings,
  History,
  Edit3,
  Trash2,
  User2,
  Filter,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { cn, formatDateByFormat } from '@/lib/utils';
import { SearchFilter } from '@/components/filters/Search';
import { useCustomers } from '@/hooks/medusa/useCustomer';
import { TableView } from '@/components/TableView';
import { customerService } from '@/lib/api/medusa/customerService';
import { Customer } from '@/types/customer';
import { TableLoading } from '@/components/TableLoading';
import { CustomerForm } from '@/components/form/customer/CustomerForm';
import { ConfirmModal } from '@/components';
import { useToast } from '@/contexts/ToastContext';
import { CustomerFilterModal } from '@/components/customer/CustomerFilterModal';

function TabButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-[20px] ${active ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {label}
    </button>
  );
}

function DetailInfoRow({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3 group/item">
      <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover/item:text-primary transition-colors shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{value}</p>
      </div>
    </div>
  );
}

export default function Customers() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'address' | 'debt'>('info');
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sort, setSort] = useState<'DESC' | 'ASC'>('DESC');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const limit = 10;

  const { customers, count, loading, error, refresh, deleteCustomer } = useCustomers({
    query: {
      limit,
      offset: (currentPage - 1) * limit,
      q: searchTerm,
      created_at: sort,
      groups: selectedGroups.length > 0 ? selectedGroups : undefined
    }
  });

  // Fetch customer details when expanded
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (expandedId) {
        setLoadingDetails(true);
        try {
          const { customer } = await customerService.getCustomer(expandedId);
          setCustomerDetails(customer);
        } catch (err) {
          console.error('Failed to fetch customer details:', err);
        } finally {
          setLoadingDetails(false);
        }
      } else {
        setCustomerDetails(null);
      }
    };

    fetchCustomerDetails();
  }, [expandedId]);

  const stats = [
    { label: 'TỔNG KHÁCH HÀNG', value: '3', icon: <User size={20} className='text-slate-800 dark:text-white' />, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'ĐANG HOẠT ĐỘNG', value: '3', icon: <Activity size={20} className='text-slate-800 dark:text-white' />, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'KHÁCH NỢ QUÁ HẠN', value: '2', icon: <AlertTriangle size={20} className='text-slate-800 dark:text-white' />, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
    { label: 'MỚI THÁNG NÀY', value: '+5', icon: <Users size={20} className='text-slate-800 dark:text-white' />, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  ];

  const handleCreate = () => {
    setIsFormOpen(true);
    setSelectedUser(null);
  }

  const handleEdit = (customer: Customer) => {
    setIsFormOpen(true);
    setSelectedUser(customer);
  }

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      if (selectedUser) {
        await customerService.updateCustomer(selectedUser.id, data);
        showToast('Cập nhật khách hàng thành công', 'success');
      } else {
        await customerService.createCustomer(data);
        showToast('Thêm khách hàng mới thành công', 'success');
      }
      setIsFormOpen(false);
      setSelectedUser(null);
      refresh();
    } catch (err: any) {
      console.error('Failed to save customer:', err);
      showToast(err.message || 'Không thể lưu khách hàng', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (isFormOpen) {
    return (
      <CustomerForm
        initialData={selectedUser}
        onSave={handleSave}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        loading={isSaving}
      />
    )
  }

  return (
    <div className="pb-32 animate-fade-in space-y-8 min-h-full relative font-sans">
      <Breadcrumb
        items={[
          { label: 'CRM', href: '#' },
          { label: 'QUẢN LÝ KHÁCH HÀNG', href: '#' }
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
              CUSTOMER RELATION MANAGEMENT
            </span>
            <User2 size={12} className='text-amber-500 animate-pulse' />
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
            Khách Hàng <span className="text-emerald-600 font-black">Thân Thiết</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs mt-3 tracking-tight">Xây dựng niềm tin thông qua dữ liệu và chăm sóc cá nhân hóa</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white/5 dark:bg-slate-800/40 text-slate-400 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95">
            <Upload size={18} />
            Nhập file
          </button>
          <Button onClick={handleCreate} className="h-14 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 font-black text-xs px-6 uppercase tracking-wider" icon={<Plus size={20} />}>
            THÊM KHÁCH HÀNG
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 bg-slate-900/40 border-none shadow-xl flex items-start justify-between group overflow-hidden relative">
            <div className="relative z-10 space-y-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg", stat.bgColor, stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white leading-none">{stat.value}</p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              {stat.icon && <stat.icon.type {...stat.icon.props} size={120} strokeWidth={1} />}
            </div>
          </Card>
        ))}
      </div>

      <Card className="flex flex-col md:flex-row items-center gap-4">
        <SearchFilter
          placeholder='Tìm theo mã, tên, số điện thoại hoặc khu vực...'
          searchTerm={searchTerm}
          handleSearchChange={setSearchTerm}
        />
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={cn(
              "h-12 px-5 rounded-xl flex items-center gap-2 text-xs font-bold border transition-all",
              selectedGroups.length > 0
                ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-primary/30"
            )}
          >
            <Filter size={16} />
            Bộ lọc {selectedGroups.length > 0 && `(${selectedGroups.length})`}
          </button>
          <button
            onClick={() => setSort(prev => prev === 'DESC' ? 'ASC' : 'DESC')}
            className={cn(
              "h-12 px-5 rounded-xl flex items-center gap-2 text-xs font-bold border transition-all",
              sort === 'ASC'
                ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-primary/30"
            )}
          >
            <ArrowUpDown size={16} className={cn("transition-transform", sort === 'ASC' && "rotate-180")} />
            Sắp xếp {sort === 'ASC' ? '(Cũ nhất)' : '(Mới nhất)'}
          </button>
          <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-800 self-center mx-1"></div>
          <button className="p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <Download size={20} />
          </button>
        </div>
      </Card>

      <TableView
        columns={[
          { title: "" },
          { title: "Khách hàng" },
          { title: "Phân nhóm" },
          { title: "Nợ hiện tại" },
          { title: "Tổng chi tiêu" },
          { title: "Trạng thái", className: "text-center" },
          { title: "" },
        ]}
        data={customers}
        emptyMessage={{
          title: "Không tìm thấy khách hàng",
          description: "Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc",
        }}
        isLoading={loading}
        pagination={{
          currentPage,
          totalPages: Math.ceil(count / limit),
          onPageChange: (page) => setCurrentPage(page),
          itemsPerPage: limit,
          totalItems: count,
        }}
        renderRow={(c, idx) => (
          <Fragment key={c.id}>
            <tr
              className={cn(
                "group hover:bg-white/[0.02] transition-all cursor-pointer",
                expandedId === c.id ? "bg-emerald-50/50 dark:bg-emerald-900/10" : ""
              )}
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
            >
              <td className="px-6 py-6 text-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${expandedId === c.id ? 'bg-emerald-500 text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <ChevronDown size={18} />
                </div>
              </td>
              <td className="px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 border border-white/5 group-hover:border-emerald-500/50 transition-all shadow-inner">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-400 transition-colors">{c.first_name + ' ' + c.last_name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">{c.id.slice(c.id.length - 8)} • {c.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-6">
                <span className="px-3 py-1 dark:bg-slate-800 bg-slate-100 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-tighter border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                  {c.groups.length > 0 ? c.groups.map((g: any) => g.name).join(', ') : 'Chưa nhóm'}
                </span>
              </td>
              <td className="px-6 py-6 text-right font-black">

              </td>
              <td className="px-6 py-6 text-right font-black text-slate-200">

              </td>
              <td className="px-6 py-6">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">HOẠT ĐỘNG</span>
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="relative inline-block">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === c.id ? null : c.id);
                  }} className="p-2 text-slate-500  dark:hover:text-white rounded-lg hover:bg-white/5 transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                  {activeMenuId === c.id && (
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
                            handleEdit(c);
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
                            setCustomerToDelete(c);
                            setIsDeleteModalOpen(true);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-4 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 flex items-center gap-3 transition-colors border-t border-slate-50 dark:border-slate-800/50"
                        >
                          <Trash2 size={16} />
                          Xóa khách hàng
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
            {expandedId === c.id && (
              loadingDetails ? (
                <tr>
                  <td colSpan={7}>
                    <TableLoading />
                  </td>
                </tr>
              ) : (
                <tr className="bg-slate-50/30 dark:bg-slate-900/30 animate-fade-in border-x-2 border-emerald-500">
                  <td colSpan={7} className="px-10 py-10">
                    <div className="flex flex-col lg:flex-row gap-12">
                      <div className="lg:w-1/3 flex flex-col gap-6">
                        <Card className="p-8 bg-white dark:bg-slate-900 shadow-xl rounded-[40px] relative overflow-hidden group/card">
                          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover/card:scale-110 transition-transform duration-700">
                            <User size={180} />
                          </div>
                          <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-[40px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center border-4 border-slate-50 dark:border-slate-800 shadow-2xl mb-6 relative">
                              <User size={64} className="text-slate-300" />
                              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900">
                                <Zap size={20} fill="currentColor" />
                              </div>
                            </div>
                            <h4 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{customerDetails?.first_name + ' ' + customerDetails?.last_name}</h4>
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/50">
                              Loyalty Member
                            </div>
                          </div>

                          <div className="mt-10 space-y-4">
                            <DetailInfoRow icon={<Phone size={14} />} label="Điện thoại" value={customerDetails?.phone || 'Chưa cập nhật'} />
                            <DetailInfoRow icon={<Mail size={14} />} label="Email" value={customerDetails?.email || 'Chưa cập nhật'} />
                            <DetailInfoRow icon={<MapPin size={14} />} label="Địa chỉ chính" value={'Chưa thiết lập địa chỉ'} />
                          </div>
                        </Card>

                        <div className="flex gap-3">
                          <Button variant="soft" className="flex-1 rounded-2xl h-14 font-black text-[10px] uppercase">GỬI TIN NHẮN</Button>
                          <Button variant="secondary" className="w-14 h-14 rounded-2xl p-0" icon={<Settings size={20} />} />
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-[24px] w-fit">
                          <TabButton label="THÔNG TIN CHI TIẾT" active={activeTab === 'info'} onClick={() => setActiveTab('info')} />
                          <TabButton label="LỊCH SỬ MUA HÀNG" active={activeTab === 'debt'} onClick={() => setActiveTab('debt')} />
                          <TabButton label="SỔ NỢ" active={activeTab === 'address'} onClick={() => setActiveTab('address')} />
                        </div>

                        <div className="min-h-[300px] animate-fade-in">
                          {activeTab === 'info' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-4">Hồ sơ khách hàng</h5>
                                <div className="grid grid-cols-1 gap-4">
                                  <Card className="p-6 bg-white dark:bg-slate-800 shadow-sm border-slate-100 dark:border-slate-700 rounded-[28px] space-y-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[11px] font-bold text-slate-400 uppercase">Ngày gia nhập</span>
                                      <span className="text-sm font-black text-slate-800 dark:text-white">{formatDateByFormat(c.created_at, 'dd/MM/yyyy')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-[11px] font-bold text-slate-400 uppercase">Sinh nhật</span>
                                      <span className="text-sm font-black text-slate-800 dark:text-white">{""}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-[11px] font-bold text-slate-400 uppercase">Mã số thuế</span>
                                      <span className="text-sm font-black text-slate-800 dark:text-white">{'N/A'}</span>
                                    </div>
                                  </Card>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-blue-500 pl-4">Ghi chú & Tương tác</h5>
                                <Card className="p-0 overflow-hidden bg-white dark:bg-slate-800 border-none shadow-sm rounded-[28px]">
                                  <textarea
                                    placeholder="Nhập ghi chú quan trọng về khách hàng này (Sở thích, lưu ý kỹ thuật...)"
                                    className="w-full h-32 p-6 bg-transparent outline-none text-sm text-slate-600 dark:text-slate-300 italic font-medium resize-none leading-relaxed"
                                    defaultValue={""}
                                  />
                                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-end">
                                    <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Lưu ghi chú</button>
                                  </div>
                                </Card>
                              </div>
                            </div>
                          )}

                          {activeTab === 'debt' && (
                            <div className="space-y-6">
                              <div className="flex justify-between items-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3 Giao dịch gần nhất</p>
                                <Button size="sm" variant="soft" className="text-[9px] h-8 font-black uppercase">Tải lịch sử (PDF)</Button>
                              </div>
                              <div className="space-y-3">
                                {[1, 2].map(i => (
                                  <div key={i} className="p-5 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-between border dark:border-slate-700 shadow-sm hover:shadow-md transition-all group/item">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:text-emerald-500 transition-colors">
                                        <History size={20} />
                                      </div>
                                      <div>
                                        <p className="text-sm font-black text-slate-800 dark:text-white">Hóa đơn POS-882{i}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">1{i}/05/2024 • 3 Mặt hàng</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-black text-slate-800 dark:text-white">{(450000 * i).toLocaleString()}đ</p>
                                      <span className="text-[9px] font-black text-emerald-500 uppercase">Hoàn tất</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeTab === 'address' && (
                            <div className="space-y-8">
                              <div className="grid grid-cols-2 gap-6">
                                <Card className="p-8 bg-emerald-600 border-none shadow-2xl rounded-[32px] relative overflow-hidden flex flex-col justify-between h-48">
                                  <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-[0.05] rounded-full" />
                                  <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest leading-none text-slate-800 dark:text-slate-200">Nợ hiện tại</p>
                                    <CreditCard size={20} className="opacity-40 text-slate-800 dark:text-slate-200" />
                                  </div>
                                  <div className="mb-2">
                                    <p className="text-4xl font-black tracking-tighter leading-none text-slate-800 dark:text-slate-200">{""}</p>
                                    <p className="text-[10px] font-bold opacity-60 mt-2 uppercase tracking-tighter text-slate-800 dark:text-slate-200">Hạn thanh toán: Không áp dụng</p>
                                  </div>
                                </Card>
                                <Card className="p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-sm rounded-[32px] flex flex-col justify-between h-48">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Chi tiêu tích lũy</p>
                                  <div>
                                    <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{""}</p>
                                    <div className="mt-2 flex items-center gap-2 text-emerald-500">
                                      <TrendingUp size={14} />
                                      <span className="text-[10px] font-black uppercase">+15% so với tháng trước</span>
                                    </div>
                                  </div>
                                </Card>
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button variant="secondary" className="px-8 rounded-2xl h-14 font-black text-xs">XEM SỔ NỢ CHI TIẾT</Button>
                                <Button className="px-10 rounded-2xl h-14 font-black text-xs bg-emerald-600 shadow-xl shadow-emerald-500/20">THU TIỀN NỢ</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            )}
          </Fragment>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        <Card className="p-8 bg-blue-900/10 border-none shadow-xl flex items-center gap-6 group cursor-pointer hover:bg-blue-900/20 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <BarChart3 size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black text-blue-500 leading-tight">Báo cáo Khách hàng</h4>
            <p className="text-xs font-bold text-slate-500 mt-1">Tổng hợp công nợ và tăng trưởng doanh thu theo khu vực</p>
          </div>
          <ChevronRight className="ml-auto text-blue-500/30 group-hover:text-blue-500 transition-all" size={24} />
        </Card>

        <Card className="p-8 bg-emerald-900/10 border-none shadow-xl flex items-center gap-6 group cursor-pointer hover:bg-emerald-900/20 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <BookOpen size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black text-emerald-500 leading-tight">Sổ nhật ký Chăm sóc</h4>
            <p className="text-xs font-bold text-slate-500 mt-1">Theo dõi lịch sử tư vấn AI và phản hồi của khách hàng</p>
          </div>
          <ChevronRight className="ml-auto text-emerald-500/30 group-hover:text-emerald-500 transition-all" size={24} />
        </Card>
      </div>

      <CustomerFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedGroups={selectedGroups}
        onApply={(groups) => {
          setSelectedGroups(groups);
          setCurrentPage(1);
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCustomerToDelete(null);
        }}
        onConfirm={async () => {
          if (customerToDelete) {
            const res = await deleteCustomer(customerToDelete.id);
            if (res.success) {
              showToast('Xóa khách hàng thành công', 'success');
            } else {
              showToast(res.error || 'Không thể xóa khách hàng', 'error');
            }
          }
          setIsDeleteModalOpen(false);
          setCustomerToDelete(null);
        }}
        isLoading={loading}
        title="Xác nhận xóa khách hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${customerToDelete?.first_name} ${customerToDelete?.last_name}"? Hành động này không thể hoàn tác.`}
        variant="danger"
        confirmText="Xóa khách hàng"
        cancelText="Quay lại"
      />
    </div>
  );
}
