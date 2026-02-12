
import React, { useState, useMemo } from 'react';
import { Search, BrainCircuit, BookOpen, Info, ChevronRight, ShieldCheck, LayoutGrid, Zap } from 'lucide-react';
import { Card } from '@/components/Card';
import { Product } from '@/types/product';
import { MOCK_DISEASE_DATA } from '../../../../../mocks/disease';
import { noImage } from '@/configs';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyCode } from '@/store/selectors';

interface POSCatalogProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categories: string[];
  filteredProducts: Product[];
  allProducts: Product[];
  onProductClick: (p: Product) => void;
  onOpenAI: () => void;
  onOpenDisease: (id: string) => void;
  loading?: boolean;
}

export const POSCatalog: React.FC<POSCatalogProps> = ({
  searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
  categories, filteredProducts, allProducts, onProductClick, onOpenAI, onOpenDisease,
  loading
}) => {
  const [showResults, setShowResults] = useState(false);
  const currencyCode = useAppSelector(selectCurrencyCode);

  const matchedDiseases = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];
    return Object.values(MOCK_DISEASE_DATA).filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const enhancedProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return filteredProducts.map(p => ({ ...p, relevantDiseases: [] as string[], isWikiMatch: false }));

    // Sử dụng allProducts để đảm bảo tìm thấy thuốc ngay cả khi nó không nằm trong Category đang chọn
    return allProducts.map((p: any) => {
      const activeIngredient = (p as any).metadata?.active_ingredient || p.variants?.[0]?.metadata?.active_ingredient || "";
      const relevantDiseases = matchedDiseases.filter(d =>
        d.recommendedIngredients.some(ing =>
          activeIngredient.toLowerCase().includes(ing.toLowerCase())
        )
      ).map(d => d.name);

      const matchesDirectly = p.title.toLowerCase().includes(query) ||
        activeIngredient.toLowerCase().includes(query);

      const isWikiMatch = relevantDiseases.length > 0;

      return {
        ...p,
        activeIngredient,
        relevantDiseases,
        isWikiMatch,
        shouldShow: matchesDirectly || isWikiMatch
      };
    })
      .filter(p => p.shouldShow)
      .sort((a, b) => {
        if (b.isWikiMatch !== a.isWikiMatch) return b.isWikiMatch ? 1 : -1;
        return 0;
      });
  }, [allProducts, filteredProducts, matchedDiseases, searchQuery]);

  const wikiRecommendedItems = useMemo(() => {
    return enhancedProducts.filter(p => p.isWikiMatch);
  }, [enhancedProducts]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9] dark:bg-slate-950 p-6 space-y-6">
      <div className="relative z-[70]">
        <div className="flex flex-col sm:flex-row gap-4 relative">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={searchQuery}
              onFocus={() => setShowResults(true)}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowResults(e.target.value.length > 0);
              }}
              placeholder="Gõ tên bệnh (VD: đạo ôn, vàng lá) để Wiki gợi ý thuốc..."
              className="w-full h-14 pl-12 pr-16 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm dark:text-white"
            />
            <button
              onClick={onOpenAI}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
            >
              <BrainCircuit size={20} />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 h-14 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-500 border dark:border-slate-800'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {showResults && searchQuery.length > 0 && (
          <>
            <div className="fixed inset-0 bg-black/5 z-[-1]" onClick={() => setShowResults(false)} />
            <div className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden max-h-[60vh] flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x dark:divide-slate-800 animate-slide-up">

              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-900/50 border-r dark:border-slate-800">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3 px-2">
                  <BookOpen size={14} className="text-primary" /> Wikipedia Bệnh ({matchedDiseases.length})
                </h3>
                {matchedDiseases.length > 0 ? matchedDiseases.map(d => (
                  <button
                    key={d.id}
                    onClick={() => { onOpenDisease(d.id); setShowResults(false); }}
                    className="w-full p-3 mb-2 bg-white dark:bg-slate-800 rounded-xl flex items-center gap-3 text-left hover:border-primary border border-transparent transition-all group"
                  >
                    <div className="w-9 h-9 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Info size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{d.name}</p>
                      <p className="text-[10px] text-slate-400 truncate italic">Bấm để xem phác đồ</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </button>
                )) : (
                  <div className="p-10 text-center"><p className="text-xs text-slate-400 italic">Không tìm thấy bệnh phù hợp</p></div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3 px-2">
                  <ShieldCheck size={14} className="text-primary" /> Thuốc Đặc Trị Đề Xuất ({wikiRecommendedItems.length})
                </h3>
                {wikiRecommendedItems.length > 0 ? wikiRecommendedItems.slice(0, 10).map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => { onProductClick(p); setShowResults(false); }}
                    className="w-full p-3 mb-2 bg-green-50/20 dark:bg-green-900/10 rounded-xl flex items-center gap-3 text-left border border-green-100 dark:border-green-800/40 hover:shadow-md transition-all"
                  >
                    <div className="relative w-10 h-10 shrink-0">
                      <img src={p.thumbnail} className="w-full h-full rounded-lg object-cover border dark:border-slate-700" alt={p.title} />
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm">
                        <ShieldCheck size={10} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{p.title}</p>
                      <p className="text-[9px] font-black text-green-600 dark:text-green-400 uppercase">
                        Trị: {p.relevantDiseases[0]?.split('(')[0]}
                      </p>
                    </div>
                  </button>
                )) : (
                  <div className="p-10 text-center space-y-2">
                    <LayoutGrid size={24} className="mx-auto text-slate-100 dark:text-slate-800" />
                    <p className="text-xs text-slate-400 italic">Nhập tên bệnh để Wiki tự tìm thuốc</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} noPadding className="flex flex-col bg-white dark:bg-slate-900 h-[400px] overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-100 dark:bg-slate-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-14" />
                  </div>
                </div>
              </Card>
            ))
          ) : enhancedProducts.map((p: any) => {
            const listPrice = p?.variants?.map((variant: any) => {
              const price = variant?.prices?.find((pr: any) => pr.currency_code === currencyCode)
              if (price) return price.amount
            })
            const maxPrice = Math.max(...listPrice)
            const minPrice = Math.min(...listPrice)

            return (
              <Card
                key={p.id}
                noPadding
                onClick={() => onProductClick(p)}
                className={`flex flex-col group active:scale-95 transition-all bg-white dark:bg-slate-900 h-full overflow-hidden border-2 ${p.isWikiMatch ? 'border-green-400 dark:border-green-600 shadow-lg shadow-green-500/5' : 'border-transparent'}`}
              >
                <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <img src={p.thumbnail || noImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {p.isWikiMatch && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded shadow-lg flex items-center gap-1">
                      <ShieldCheck size={10} /> ĐỀ XUẤT WIKI
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-[13px] text-slate-800 dark:text-slate-100 line-clamp-1 leading-tight">{p.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{p.activeIngredient}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-primary font-black text-base">{minPrice.toLocaleString()}đ - {maxPrice.toLocaleString()}đ</p>
                    {p.isWikiMatch && (
                      <span className="text-[8px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded border border-green-100 dark:border-green-800/50">Đặc trị</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
