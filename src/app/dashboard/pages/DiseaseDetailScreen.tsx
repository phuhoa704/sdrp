
import React, { useState, useMemo } from 'react';
import { ExternalLink, Activity, Beaker, Microscope, Search, Book, ChevronRight, Info, Filter, LeafyGreen, TreeDeciduous, Sprout, ShieldAlert, Clock } from 'lucide-react';
import { Card } from '@/components/Card';
import { Product } from '@/types/product';
import { ProductRow } from '@/components/product/ProductRow';
import { MOCK_DISEASE_DATA } from '../../../../mocks/disease';
import { useMedusaProducts } from '@/hooks';

interface DiseaseDetailScreenProps {
  id: string | null;
  onBack: () => void;
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product, variant: any) => void;
}

export const DiseaseDetailScreen: React.FC<DiseaseDetailScreenProps> = ({ id: initialId, onBack, onProductClick, onAddToCart }) => {
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(initialId || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");

  const { products: medusaProducts } = useMedusaProducts({ autoFetch: true, limit: 100 });

  const allDiseases = Object.values(MOCK_DISEASE_DATA);

  const filteredDiseases = useMemo(() => {
    return allDiseases.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeFilter === "Tất cả" ||
        (activeFilter === "Lúa" && d.name.toLowerCase().includes("lúa")) ||
        (activeFilter === "Rau màu" && (d.name.toLowerCase().includes("rau") || d.id === "suong-mai")) ||
        (activeFilter === "Cây ăn trái" && d.id === "than-thu");

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeFilter]);

  if (selectedDiseaseId) {
    const disease = MOCK_DISEASE_DATA[selectedDiseaseId];
    if (!disease) {
      setSelectedDiseaseId(null);
      return null;
    }

    const recommendedProducts = medusaProducts.filter(p =>
      disease.recommendedIngredients.some(ing => {
        const activeIngredient = (p as any).metadata?.active_ingredient || p.variants?.[0]?.metadata?.active_ingredient || "";
        return activeIngredient.toLowerCase().includes(ing.toLowerCase());
      })
    );

    return (
      <div className="animate-fade-in bg-transparent">
        <div className="relative h-48 md:h-64 overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-900" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10 text-white">
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => initialId ? onBack() : setSelectedDiseaseId(null)}
                className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/10"
              >
                <Book size={18} />
              </button>
              <span className="bg-white/20 backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-full uppercase border border-white/20">Kiến thức nông nghiệp</span>
              {disease.wikiUrl && (
                <a href={disease.wikiUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-green-300 font-bold flex items-center gap-1 hover:text-white transition-colors">
                  <ExternalLink size={12} /> Wiki
                </a>
              )}
            </div>
            <h3 className="text-2xl md:text-3xl font-black leading-tight max-w-2xl">{disease.name}</h3>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-7 space-y-8">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Info size={14} className="text-green-500" /> Giới thiệu bệnh
                </h4>
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {disease.description}
                </p>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={14} className="text-green-500" /> Triệu chứng nhận biết
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {disease.symptoms.map((s, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-5 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0 font-black text-xs">0{idx + 1}</div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 pt-1.5">{s}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="md:col-span-5 space-y-8">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldAlert size={14} className="text-green-500" /> Phác đồ kỹ thuật
                </h4>
                <div className="space-y-4">
                  {disease.stages.map((stage, idx) => (
                    <div key={idx} className={`relative p-5 rounded-[24px] border-l-4 transition-all shadow-sm ${stage.severity === 'high' ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-900/10' :
                      stage.severity === 'medium' ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-900/10' :
                        'border-blue-500 bg-blue-50/40 dark:bg-blue-900/10'
                      }`}>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">{stage.title}</h5>
                        <div className={`p-1 rounded-full ${stage.severity === 'high' ? 'bg-rose-500/10 text-rose-500' :
                          stage.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-blue-500/10 text-blue-500'
                          }`}>
                          <Clock size={12} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">{stage.action}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <section className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Beaker size={16} className="text-green-500" /> Sản phẩm đặc trị đề xuất
              </h4>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">{recommendedProducts.length} mặt hàng</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedProducts.map(p => (
                <ProductRow
                  key={p.id}
                  product={p}
                  showAction
                  onAddToCart={(prod, config) => onAddToCart(prod, config)}
                  onClick={() => onProductClick(p)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Wikipedia</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Thư viện bệnh cây trồng và thuốc đặc trị</p>
        </div>
        <div className="p-3.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-[24px] shadow-sm">
          <Book size={28} />
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-colors group-focus-within:text-green-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm tên bệnh hoặc hoạt chất..."
          className="h-16 w-full pl-14 pr-6 rounded-[24px] bg-white dark:bg-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-800 focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 outline-none transition-all text-sm font-medium"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {[
          { name: "Tất cả", icon: <Filter size={16} /> },
          { name: "Lúa", icon: <LeafyGreen size={16} /> },
          { name: "Cây ăn trái", icon: <TreeDeciduous size={16} /> },
          { name: "Rau màu", icon: <Sprout size={16} /> }
        ].map(filter => (
          <button
            key={filter.name}
            onClick={() => setActiveFilter(filter.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all border ${activeFilter === filter.name
              ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-green-200'
              }`}
          >
            {filter.icon}
            {filter.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDiseases.map(d => (
          <Card
            key={d.id}
            className="group cursor-pointer hover:border-green-500/30 transition-all p-6 shadow-sm active:scale-[0.98] border border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[32px]"
            onClick={() => setSelectedDiseaseId(d.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                <Microscope size={22} />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-green-500 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-green-600 transition-colors truncate">{d.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">{d.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
