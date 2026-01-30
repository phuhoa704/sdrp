'use client';

import { AlertTriangle, ArrowRight, Beaker, BookOpen, BrainCircuit, ChevronRight, History, Hourglass, Info, Newspaper, PackageCheck, Plus, Search, ShoppingBag, ShoppingCart, Stars, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MOCK_DISEASE_DATA } from '../../../../mocks/disease';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { MOCK_NEWS } from '../../../../mocks/news';
import { B2COrder } from '@/types/order';
import { MOCK_B2C_HISTORY } from '../../../../mocks/order';
import { Product } from '@/types/product';
import { useMedusaProducts } from '@/hooks';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const salesData = [
  { name: 'T1', sales: 12.5 }, { name: 'T2', sales: 14.8 }, { name: 'T3', sales: 13.2 },
  { name: 'T4', sales: 17.1 }, { name: 'T5', sales: 19.5 }, { name: 'T6', sales: 22.0 }, { name: 'T7', sales: 20.3 },
];

const MARKETPLACE_PROMOS = [
  {
    id: 1,
    title: "Chợ Sỉ Nông Nghiệp",
    subtitle: "Sàn sỉ B2B",
    desc: "Nhập hàng trực tiếp từ NPP với chiết khấu lên đến 25% và ưu đãi vận chuyển.",
    gradient: "from-blue-600 to-indigo-800",
    icon: <ShoppingBag size={180} />,
    btnText: "VÀO CHỢ SỈ NGAY"
  },
  {
    id: 2,
    title: "Miễn Phí Vận Chuyển",
    subtitle: "Ưu đãi Logistics",
    desc: "Freeship toàn quốc cho các đơn hàng sỉ trên 10 triệu đồng trong tháng này.",
    gradient: "from-indigo-600 to-purple-800",
    icon: <Zap size={180} />,
    btnText: "XEM CHI TIẾT"
  },
  {
    id: 3,
    title: "Flash Sale B2B",
    subtitle: "Giờ vàng giá sốc",
    desc: "Săn deal hời mỗi khung giờ 9h & 15h. Hàng nghìn mã hàng giảm sâu.",
    gradient: "from-rose-600 to-orange-800",
    icon: <Stars size={180} />,
    btnText: "SĂN DEAL NGAY"
  }
];

interface Props {
  onSelectNewsArticle: (id: string) => void;
  onSelectDisease: (id: string) => void;
  onProductClick: (p: Product) => void;
  onViewAllNews?: () => void;
  onDiagnose?: () => void;
  onGoToPOS?: () => void;
}

export default function RetailerDashboard({ onSelectNewsArticle, onSelectDisease, onProductClick, onViewAllNews, onDiagnose, onGoToPOS }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { products: medusaProducts } = useMedusaProducts({ autoFetch: true, limit: 100 });

  const [b2cHistory, setB2cHistory] = useState<B2COrder[]>(MOCK_B2C_HISTORY);
  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % MARKETPLACE_PROMOS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchInput = (val: string) => { setSearchQuery(val); setShowResults(val.trim().length > 1); };

  const matchedDiseases = Object.values(MOCK_DISEASE_DATA).filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ingredientToDiseaseNames = new Map<string, string[]>();
  matchedDiseases.forEach(d => {
    d.recommendedIngredients.forEach(ing => {
      const key = ing.toLowerCase();
      const existing = ingredientToDiseaseNames.get(key) || [];
      if (!existing.includes(d.name)) {
        ingredientToDiseaseNames.set(key, [...existing, d.name]);
      }
    });
  });

  const matchedProducts = medusaProducts.filter(p => {
    const activeIngredient = (p as any).metadata?.active_ingredient || p.variants?.[0]?.metadata?.active_ingredient || "";
    const matchesDirectly = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activeIngredient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesViaDisease = Array.from(ingredientToDiseaseNames.keys()).some(ing =>
      activeIngredient.toLowerCase().includes(ing)
    );
    return matchesDirectly || matchesViaDisease;
  });

  const criticalProducts = medusaProducts.filter(p => {
    const stock = (p.variants?.[0]?.metadata?.stock as number) || 0;
    const expiryDateStr = (p as any).expiry_date || p.metadata?.expiry_date;
    if (!expiryDateStr) return stock < 20;

    const expiryDate = new Date(expiryDateStr);
    const diffDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return (diffDays <= 90 && diffDays > 0) || stock < 20;
  });
  return (
    <div className="pb-10 animate-fade-in space-y-8 md:space-y-10 px-1">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-[0.2em] border border-emerald-100 dark:border-emerald-800/50">
              Đại lý thông minh
            </span>
            <Zap size={14} className="text-amber-500 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none">
            Bảng Tin <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Tổng Quan</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg max-w-lg">
            Giám sát hiệu quả kinh doanh và sức khỏe nông trại theo thời gian thực
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="h-12 rounded-2xl px-10 font-extrabold !text-xs shadow-xl shadow-emerald-500/20 w-full md:w-auto tracking-widest"
            icon={<Plus size={20} />}
            onClick={onGoToPOS}
          >
            BÁN HÀNG NGAY (POS)
          </Button>
        </div>
      </div>

      <div className="relative group">
        <div className="relative z-[60] overflow-hidden rounded-[24px] shadow-glass border border-white/40 dark:border-slate-800/40">
          <div className="absolute z-[1] inset-y-0 left-5 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500">
            <Search className="!text-slate-400" size={22} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Tìm tên bệnh hoặc sản phẩm đặc trị..."
            className="h-16 w-full pl-14 pr-6 bg-white/80 dark:bg-slate-900/80 dark:text-white backdrop-blur-xl outline-none transition-all font-semibold text-base"
          />
        </div>
        {showResults && (
          <>
            <div className="fixed inset-0 bg-slate-900/10 dark:bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-500" onClick={() => setShowResults(false)} />
            <div className="absolute top-20 left-0 right-0 glass-panel rounded-[32px] shadow-2xl z-[60] border border-white/50 dark:border-slate-800/50 animate-slide-up overflow-hidden max-h-[80vh] flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40 dark:bg-slate-900/80">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-5 px-2"><BookOpen size={16} className="text-emerald-500" /> Kết quả Wikipedia ({matchedDiseases.length})</h3>
                {matchedDiseases.length > 0 ? (
                  <div className="space-y-3">{matchedDiseases.map(d => (
                    <div key={d.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-white dark:border-slate-700 hover:border-emerald-500/30 transition-all duration-300 shadow-smooth group overflow-hidden">
                      <button onClick={() => { onSelectDisease(d.id); setShowResults(false); }} className="w-full p-4 text-left flex gap-4">
                        <div className="h-11 w-11 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0"><Info size={20} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors truncate">{d.name}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 italic font-medium">{d.description}</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 self-center group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ))}</div>
                ) : <div className="py-12 text-center text-xs font-bold text-slate-400 tracking-wider">Không tìm thấy dữ liệu bệnh</div>}
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-white/50 dark:bg-slate-900/80">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-5 px-2"><Beaker size={16} className="text-emerald-500" /> Thuốc đề xuất ({matchedProducts.length})</h3>
                {matchedProducts.length > 0 ? (
                  <div className="space-y-2">{matchedProducts.map(p => (
                    <div key={p.id} onClick={() => { onProductClick(p); setShowResults(false); }} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-50 dark:border-slate-700 hover:shadow-glow transition-all cursor-pointer group">
                      <div className="w-14 h-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <img src={p.thumbnail || ""} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.title} />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-500 transition-colors">{p.title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1 tracking-widest">{(p as any).metadata?.active_ingredient || p.variants?.[0]?.metadata?.active_ingredient || "N/A"}</p>
                      </div>
                    </div>
                  ))}</div>
                ) : <div className="py-12 text-center text-xs font-bold text-slate-400 tracking-wider">Không tìm thấy sản phẩm</div>}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-10">
        <div className="lg:col-span-6 relative group overflow-hidden rounded-[40px] shadow-2xl">
          <Card noPadding className="relative h-full border-none min-h-[320px] md:min-h-[400px] flex items-center overflow-hidden">
            <img
              src="/banner.jpg"
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-all duration-[3s]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/70 to-emerald-900/10 z-[1]" />
            <div className="absolute inset-0 opacity-10 mix-blend-overlay z-[2]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            <div className="p-8 md:p-10 text-white z-10 space-y-5 md:space-y-6 relative">
              <span className="bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 shadow-inner-glow inline-block">SD-AI Vision v3</span>
              <h2 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight">Chẩn đoán AI<br /><span className="text-emerald-300 opacity-90 italic">Bảo vệ mùa màng</span></h2>
              <p className="text-emerald-50/70 text-sm md:text-base font-medium leading-relaxed max-w-md">Phân tích triệu chứng qua hình ảnh vệ tinh và macro, đưa ra phác đồ tối ưu chỉ trong 3 giây.</p>
              <div className="flex gap-4 pt-3">
                <Button
                  onClick={onDiagnose}
                  className="bg-white text-emerald-800 hover:bg-emerald-50 px-10 h-14 rounded-2xl font-black text-xs tracking-widest shadow-2xl transition-all"
                >
                  PHÂN TÍCH NGAY
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 grid grid-cols-2 gap-4 h-full">
          <Card className="bg-white dark:bg-slate-900 border-none shadow-glass p-8 flex flex-col justify-between group hover:shadow-glow transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform"><PackageCheck size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Đơn hàng mới</p>
              <h4 className="text-4xl font-black text-slate-800 dark:text-white">14</h4>
            </div>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-none shadow-glass p-8 flex flex-col justify-between group hover:shadow-glow transition-all">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Hourglass size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Chờ xử lý</p>
              <h4 className="text-4xl font-black text-slate-800 dark:text-white">05</h4>
            </div>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-none shadow-glass p-8 flex flex-col justify-between group hover:shadow-glow transition-all">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform"><AlertTriangle size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Cảnh báo kho</p>
              <h4 className="text-4xl font-black text-slate-800 dark:text-white">{criticalProducts.length}</h4>
            </div>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-none shadow-glass p-8 flex flex-col justify-between group hover:shadow-glow transition-all overflow-hidden relative">
            <div className="absolute top-[-20%] right-[-20%] text-blue-500/5 group-hover:scale-110 transition-transform duration-700">
              <TrendingUp size={200} />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><TrendingUp size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Tăng trưởng</p>
              <h4 className="text-4xl font-black text-slate-800 dark:text-white">+18%</h4>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <History size={24} className="text-emerald-600" /> Nhật ký bán lẻ (B2C)
            </h3>
            <button className="text-[11px] font-black text-primary hover:underline tracking-widest uppercase">XEM TẤT CẢ →</button>
          </div>
          <Card noPadding className="bg-white dark:bg-slate-900 border-none shadow-glass overflow-hidden rounded-[32px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] border-b dark:border-slate-800">
                  <th className="py-6 pl-8">Mã đơn</th>
                  <th className="py-6 px-4">Khách hàng</th>
                  <th className="py-6 px-4">Ngày đặt</th>
                  <th className="py-6 px-4 font-right">Giá trị</th>
                  <th className="py-6 pr-8 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {b2cHistory.slice(0, 5).map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                    <td className="py-6 pl-8 font-black text-sm text-slate-800 dark:text-slate-200 group-hover:text-primary">{order.id}</td>
                    <td className="py-6 px-4">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{order.customer.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{order.customer.phone}</p>
                    </td>
                    <td className="py-6 px-4 text-xs font-bold text-slate-500">{order.date}</td>
                    <td className="py-6 px-4 font-black text-slate-800 dark:text-white">{order.total.toLocaleString()}đ</td>
                    <td className="py-6 pr-8 text-right">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter ${order.status === 'completed' ? 'bg-emerald-100/50 text-emerald-600' :
                        'bg-amber-100/50 text-amber-600'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <TrendingUp size={24} className="text-emerald-600" /> Biểu đồ doanh thu
            </h3>
          </div>
          <Card className="bg-white dark:bg-slate-900 border-none shadow-glass p-8 rounded-[32px] h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                />
                <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === salesData.length - 1 ? '#10b981' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase">Tăng trưởng tuần này</p>
                <div className="flex items-center gap-1 text-emerald-600 font-black text-sm">
                  <TrendingUp size={14} /> +12%
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}