'use client';

import { AlertTriangle, ArrowRight, Beaker, BookOpen, BrainCircuit, ChevronRight, History, Hourglass, Info, Newspaper, PackageCheck, Plus, Search, ShoppingBag, ShoppingCart, Stars, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MOCK_DISEASE_DATA } from '../../../../mocks/disease';
import { MOCK_PRODUCTS } from '../../../../mocks/product';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { MOCK_NEWS } from '../../../../mocks/news';
import { B2COrder } from '@/types/order';
import { MOCK_B2C_HISTORY } from '../../../../mocks/order';
import { Product } from '@/types/product';
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
}

export default function RetailerDashboard({ onSelectNewsArticle, onSelectDisease, onProductClick, onViewAllNews, onDiagnose }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const matchedProducts = MOCK_PRODUCTS.filter(p => {
    const matchesDirectly = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.active_ingredient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesViaDisease = Array.from(ingredientToDiseaseNames.keys()).some(ing =>
      p.active_ingredient.toLowerCase().includes(ing)
    );
    return matchesDirectly || matchesViaDisease;
  });

  const criticalProducts = MOCK_PRODUCTS.filter(p => {
    const expiryDate = new Date(p.expiry_date);
    const diffDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return (diffDays <= 90 && diffDays > 0) || (p.stockLevel && p.stockLevel < 20);
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
            className="h-14 rounded-2xl px-10 font-extrabold text-xs shadow-xl shadow-emerald-500/20 w-full md:w-auto tracking-widest"
            icon={<Plus size={20} />}
          >
            BÁN HÀNG NGAY (POS)
          </Button>
        </div>
      </div>

      <div className="relative group">
        <div className="relative z-[60] overflow-hidden rounded-[24px] shadow-glass border border-white/40 dark:border-slate-800/40">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500">
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
                        <img src={p.image_style} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-500 transition-colors">{p.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1 tracking-widest">{p.active_ingredient}</p>
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
          <Card noPadding className="relative h-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 border-none min-h-[320px] md:min-h-[400px] flex items-center">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            <div className="p-10 md:p-14 text-white z-10 space-y-5 md:space-y-8 relative">
              <span className="bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 shadow-inner-glow inline-block">SD-AI Vision v3</span>
              <h2 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">Chẩn đoán AI<br /><span className="text-emerald-300 opacity-90 italic">Bảo vệ mùa màng</span></h2>
              <p className="text-emerald-50/70 text-base md:text-lg font-medium leading-relaxed max-w-md">Phân tích triệu chứng qua hình ảnh vệ tinh và macro, đưa ra phác đồ tối ưu chỉ trong 3 giây.</p>
              <div className="flex gap-4 pt-3">
                <Button
                  onClick={onDiagnose}
                  className="bg-white text-emerald-800 hover:bg-emerald-50 px-10 h-14 rounded-2xl font-black text-xs tracking-widest shadow-2xl transition-all"
                >
                  PHÂN TÍCH NGAY
                </Button>
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center opacity-10 pointer-events-none pr-10">
              <BrainCircuit size={320} className="text-white rotate-12 hidden md:block" />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 relative overflow-hidden rounded-[40px] shadow-2xl min-h-[320px] md:min-h-[400px]">
          {MARKETPLACE_PROMOS.map((promo, idx) => (
            <div key={promo.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === promoIndex ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-105'}`}>
              <Card noPadding className={`relative h-full overflow-hidden bg-gradient-to-br ${promo.gradient} border-none flex items-center`}>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="p-10 md:p-12 text-white z-10 space-y-5 md:space-y-8 w-full relative">
                  <span className="bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 shadow-inner-glow inline-block">{promo.subtitle}</span>
                  <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-white">{promo.title.split(' ')[0]}<br /><span className="opacity-80 font-medium italic">{promo.title.split(' ').slice(1).join(' ')}</span></h2>
                  <p className="text-white/60 text-sm md:text-base font-medium leading-relaxed max-w-[280px]">{promo.desc}</p>
                  <Button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border border-white/25 w-full h-14 rounded-2xl font-black text-xs tracking-widest inner-border-glow shadow-xl" icon={<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}>{promo.btnText}</Button>
                </div>
                <div className="absolute -right-10 bottom-0 opacity-10 text-white transform rotate-12 pointer-events-none">{promo.icon}</div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
        <div className="lg:col-span-6 space-y-10">
          <Card className="p-8 lg:p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-smooth space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3"><TrendingUp size={24} className="text-emerald-500" /> Doanh số vùng (Trđ)</h3>
              <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl inner-border-glow">
                <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter bg-white dark:bg-slate-700 shadow-sm rounded-lg text-emerald-600">6 Tháng</button>
                <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter text-slate-400">1 Năm</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '11px', fontWeight: 700 }} tick={{ fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '11px', fontWeight: 700 }} tick={{ fill: '#94A3B8' }} />
                <Tooltip cursor={{ fill: 'rgba(16, 185, 129, 0.05)', radius: 10 }} contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '24px', color: '#F8FAFC', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', padding: '12px 16px' }} />
                <Bar dataKey="sales" fill="#10B981" radius={[12, 12, 0, 0]} barSize={32}>
                  {salesData.map((e, i) => (<Cell key={i} fill={i === salesData.length - 1 ? '#10B981' : '#E2E8F0'} className="transition-all duration-500" />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="space-y-5">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3"><History size={16} className="text-emerald-500" /> Giao dịch gần đây</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
              {b2cHistory.slice(0, 3).map(o => (
                <Card key={o.id} className="flex items-center justify-between p-5 hover:border-emerald-500/30 bg-white dark:bg-slate-900 shadow-smooth group">
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner group-hover:scale-110 transition-transform"><ShoppingCart size={24} /></div>
                    <div className="min-w-0 pr-2">
                      <h4 className="font-extrabold text-sm dark:text-slate-100 truncate group-hover:text-emerald-600 transition-colors">{o.customer.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-black uppercase tracking-widest">{o.id} • {o.date}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-emerald-600 text-lg md:text-xl">{o.total.toLocaleString()}đ</span>
                    <ChevronRight size={18} className="inline-block ml-3 text-slate-200 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="space-y-5">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Tình trạng vận hành</h3>
            <div className="grid grid-cols-2 gap-4">
              <StatsCard title="Mã hàng" value={MOCK_PRODUCTS.length} icon={<PackageCheck size={20} />} color="green" />
              <StatsCard title="Sắp hết" value={MOCK_PRODUCTS.filter(p => (p.stockLevel || 0) < 20).length} icon={<AlertTriangle size={20} />} color="rose" />
              <StatsCard title="HSD Cận" value={criticalProducts.length} icon={<Hourglass size={20} />} color="amber" />
              <StatsCard title="Đơn tuần" value={b2cHistory.length} icon={<ShoppingCart size={20} />} color="blue" />
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-3"><Newspaper size={16} className="text-emerald-500" /> Tin tức thị trường</h3>
            <div className="space-y-5">
              {MOCK_NEWS.slice(0, 3).map(a => (
                <Card key={a.id} noPadding className="flex items-center gap-5 p-4 hover:border-emerald-500/20 bg-white dark:bg-slate-900 shadow-smooth overflow-hidden group" onClick={() => onSelectNewsArticle(a.id)}>
                  <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-[24px] shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115" />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1.5 opacity-80">{a.category}</span>
                    <h4 className="font-extrabold text-[14px] md:text-[15px] text-slate-800 dark:text-slate-100 line-clamp-2 leading-[1.3] group-hover:text-emerald-600 transition-colors">{a.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 tracking-tighter">{a.date} • {a.author}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Button
              variant="soft"
              fullWidth
              className="h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm"
              onClick={onViewAllNews}
            >
              XEM TẤT CẢ TIN TỨC
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


const StatsCard = ({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) => {
  const styles: any = {
    green: "bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-600 border-emerald-100/50 dark:border-emerald-800/50",
    rose: "bg-rose-50/50 dark:bg-rose-900/10 text-rose-600 border-rose-100/50 dark:border-rose-800/50",
    amber: "bg-amber-50/50 dark:bg-amber-900/10 text-amber-500 border-amber-100/50 dark:border-amber-800/50",
    blue: "bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 border-blue-100/50 dark:border-blue-800/50"
  };
  return (
    <Card className={`p-6 ${styles[color]} border shadow-smooth flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-glow group relative overflow-hidden`}>
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-60">{title}</p>
        <div className="opacity-80 group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter relative z-10">{value}</p>
    </Card>
  );
};