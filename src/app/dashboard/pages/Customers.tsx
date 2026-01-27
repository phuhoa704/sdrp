'use client';

import { Fragment, useState, useMemo } from 'react';
import {
  Plus,
  Upload,
  Search,
  Zap,
  SearchX,
  Filter,
  ArrowUpDown,
  Download,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  User,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  BarChart3,
  BookOpen,
  ChevronDown,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Settings,
  History
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { MOCK_CUSTOMERS } from '../../../../mocks/customer';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'address' | 'debt'>('info');

  const filteredCustomers = useMemo(() => {
    return MOCK_CUSTOMERS.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const stats = [
    { label: 'TỔNG KHÁCH HÀNG', value: '3', icon: <User size={20} />, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'ĐANG HOẠT ĐỘNG', value: '3', icon: <Activity size={20} />, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'KHÁCH NỢ QUÁ HẠN', value: '2', icon: <AlertTriangle size={20} />, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
    { label: 'MỚI THÁNG NÀY', value: '+5', icon: <Users size={20} />, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  ];

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
            <Zap size={12} className='text-amber-500 animate-pulse' />
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
            Khách Hàng <span className="text-emerald-600 font-black">Thân Thiết</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs mt-3 uppercase tracking-tight">Xây dựng niềm tin thông qua dữ liệu và chăm sóc cá nhân hóa</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white/5 dark:bg-slate-800/40 text-slate-400 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95">
            <Upload size={18} />
            Nhập file
          </button>
          <Button className="h-14 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 font-black text-xs px-6 uppercase tracking-wider" icon={<Plus size={20} />}>
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
                <p className="text-3xl font-black text-white leading-none">{stat.value}</p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              {stat.icon && <stat.icon.type {...stat.icon.props} size={120} strokeWidth={1} />}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Tìm theo mã, tên, số điện thoại hoặc khu vực..."
            className="w-full bg-slate-950/20 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[24px] py-4 pl-14 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-600 shadow-inner-glow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900/40 border border-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/5 transition-all">
            <Filter size={16} className="text-emerald-500" />
            Bộ lọc
          </button>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900/40 border border-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/5 transition-all">
            <ArrowUpDown size={16} className="text-emerald-500" />
            Sắp xếp
          </button>
          <button className="p-3.5 bg-slate-900/40 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
            <Download size={18} />
          </button>
        </div>
      </div>

      <Card noPadding className="overflow-hidden shadow-xl bg-slate-900/40 border border-white/5 rounded-[32px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/30 text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] border-b border-white/5">
              <tr>
                <th className="px-8 py-6 w-12"></th>
                <th className="px-6 py-6 min-w-[250px]">Khách hàng</th>
                <th className="px-6 py-6 text-center">Phân nhóm</th>
                <th className="px-6 py-6 text-right">Nợ hiện tại</th>
                <th className="px-6 py-6 text-right">Tổng chi tiêu</th>
                <th className="px-6 py-6 text-center">Trạng thái</th>
                <th className="px-8 py-6 text-right w-16">Quản trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                      <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                        <SearchX size={40} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-bold italic text-slate-400">Không tìm thấy khách hàng nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <Fragment key={c.id}>
                    <tr
                      className={cn(
                        "group hover:bg-white/[0.02] transition-all cursor-pointer",
                        expandedId === c.id ? "bg-emerald-900/10" : ""
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
                            <p className="text-[13px] font-black text-slate-100 group-hover:text-emerald-400 transition-colors">{c.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">{c.id} • {c.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-tighter border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                          {c.group || 'Chưa nhóm'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right font-black">
                        <span className={cn(
                          "text-sm tracking-tight",
                          c.debt > 0 ? "text-rose-500" : "text-slate-500"
                        )}>
                          {c.debt.toLocaleString()}đ
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right font-black text-slate-200">
                        {c.totalSales.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">HOẠT ĐỘNG</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                    {expandedId === c.id && (
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
                                  <h4 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{c.name}</h4>
                                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/50">
                                    Loyalty Member
                                  </div>
                                </div>

                                <div className="mt-10 space-y-4">
                                  <DetailInfoRow icon={<Phone size={14} />} label="Điện thoại" value={c.phone} />
                                  <DetailInfoRow icon={<Mail size={14} />} label="Email" value={c.email || 'Chưa cập nhật'} />
                                  <DetailInfoRow icon={<MapPin size={14} />} label="Địa chỉ chính" value={c.address || 'Chưa thiết lập địa chỉ'} />
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
                                            <span className="text-sm font-black text-slate-800 dark:text-white">{c.createdAt}</span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase">Sinh nhật</span>
                                            <span className="text-sm font-black text-slate-800 dark:text-white">{c.birthday || '--/--/----'}</span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase">Mã số thuế</span>
                                            <span className="text-sm font-black text-slate-800 dark:text-white">{c.taxCode || 'N/A'}</span>
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
                                          defaultValue={c.note}
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
                                      <Card className="p-8 bg-emerald-600 text-white border-none shadow-2xl rounded-[32px] relative overflow-hidden flex flex-col justify-between h-48">
                                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-[0.05] rounded-full" />
                                        <div className="flex items-center justify-between">
                                          <p className="text-[10px] font-black opacity-60 uppercase tracking-widest leading-none">Nợ hiện tại</p>
                                          <CreditCard size={20} className="opacity-40" />
                                        </div>
                                        <div className="mb-2">
                                          <p className="text-4xl font-black tracking-tighter leading-none">{c.debt.toLocaleString()}đ</p>
                                          <p className="text-[10px] font-bold opacity-60 mt-2 uppercase tracking-tighter">Hạn thanh toán: Không áp dụng</p>
                                        </div>
                                      </Card>
                                      <Card className="p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-sm rounded-[32px] flex flex-col justify-between h-48">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Chi tiêu tích lũy</p>
                                        <div>
                                          <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{c.totalSales.toLocaleString()}đ</p>
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
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HIỂN THỊ {filteredCustomers.length} TRÊN 456 KHÁCH HÀNG</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-slate-500 hover:text-white transition-all"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-500/20">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-slate-500 hover:text-white transition-all text-xs font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-slate-500 hover:text-white transition-all text-xs font-bold">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-slate-500 hover:text-white transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </Card>

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
    </div>
  );
}

const TabButton = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-[20px] ${active ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {label}
  </button>
);

const DetailInfoRow = ({ icon, label, value }: any) => (
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