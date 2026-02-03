
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Heart, Star, LayoutGrid, Bug, Pipette,
  Sprout, Zap, ChevronRight,
  ShieldCheck, Clock, Tag, BookOpen,
  ArrowUpRight, Info, ShoppingCart
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Product } from '@/types/product';
import { useMedusaProducts } from '@/hooks';

interface MarketplaceShopProps {
  onProductClick: (product: Product) => void;
  searchQuery?: string;
}

export const MarketplaceShop: React.FC<MarketplaceShopProps> = ({ onProductClick, searchQuery = "" }) => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Use Medusa Products
  const { products: medusaProducts, loading, error } = useMedusaProducts({ autoFetch: true });

  const banners = [
    {
      title: "Mùa Vàng Thắng Lớn 2024",
      desc: "Nhập sỉ phân bón NitroFast - Ưu đãi lên đến 25%",
      img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200",
      color: "from-emerald-600/90 to-green-900/90"
    },
    {
      title: "Siêu Sale Thuốc Trừ Bệnh",
      desc: "FungiGone 200SC - Mua 10 thùng tặng 1 thùng",
      img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200",
      color: "from-blue-600/90 to-indigo-900/90"
    }
  ];

  const catalogues = [
    {
      id: "cat1",
      title: "Giải pháp quản lý Rầy nâu & Đạo ôn 2024",
      desc: "Quy trình 3 bước từ giai đoạn làm đất đến trổ bông, tối ưu hóa năng suất và giảm 20% chi phí phân bón.",
      image: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=600",
      newsId: "n2",
      products: ["p1", "p3"],
      tag: "Solution"
    },
    {
      id: "cat2",
      title: "Kỹ thuật canh tác Lúa chất lượng cao",
      desc: "Bộ sản phẩm đạt chuẩn VietGAP cho các vùng chuyên canh lúa thơm xuất khẩu.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=600",
      newsId: "n1",
      products: ["p2", "p4"],
      tag: "Expertise"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { name: 'Tất cả', icon: <LayoutGrid size={20} /> },
    { name: 'Thuốc trừ sâu', icon: <Bug size={20} /> },
    { name: 'Phân bón lá', icon: <Sprout size={20} /> },
    { name: 'Thuốc trừ bệnh', icon: <ShieldCheck size={20} /> },
    { name: 'Dụng cụ', icon: <Pipette size={20} /> },
  ];

  const flashSaleProducts = medusaProducts.slice(0, 3);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredProducts = useMemo(() => {
    return medusaProducts.filter(p => {
      const activeIngredient = (p as any).metadata?.active_ingredient || p.variants?.[0]?.metadata?.active_ingredient || "";
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activeIngredient.toLowerCase().includes(searchQuery.toLowerCase());

      const category = (p.type as any)?.value || "Tất cả";
      const matchesCat = activeCategory === 'Tất cả' || category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [medusaProducts, searchQuery, activeCategory]);

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Hero Banner Slider */}
      <div className="relative h-48 md:h-72 w-full rounded-[40px] overflow-hidden group shadow-2xl">
        {banners.map((b, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentBanner === i ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={b.img} className="w-full h-full object-cover" alt={b.title} />
            <div className={`absolute inset-0 bg-gradient-to-r ${b.color} flex flex-col justify-center p-8 md:p-16`}>
              <div className="animate-slide-up">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20 mb-4 inline-block">Khuyến mãi cực đại</span>
                <h2 className="text-2xl md:text-5xl font-black text-white mb-2 md:mb-4 leading-tight">{b.title}</h2>
                <p className="text-white/80 text-xs md:text-lg font-medium mb-6 md:mb-8 max-w-md">{b.desc}</p>
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50 h-10 md:h-14 px-8 rounded-2xl shadow-xl font-black text-xs md:text-sm">KHÁM PHÁ NGAY</Button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrentBanner(i)} className={`h-1.5 transition-all rounded-full ${currentBanner === i ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* Visual Categories Grid */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex flex-col items-center gap-3 min-w-[100px] p-4 rounded-[32px] transition-all border-2 ${activeCategory === cat.name
              ? 'bg-white dark:bg-slate-800 border-primary shadow-xl -translate-y-1'
              : 'bg-white dark:bg-slate-900 border-transparent text-slate-400 hover:border-slate-100 dark:hover:border-slate-800'
              }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeCategory === cat.name ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800'
              }`}>
              {cat.icon}
            </div>
            <span className={`text-[11px] font-black uppercase tracking-tighter ${activeCategory === cat.name ? 'text-slate-800 dark:text-white' : ''
              }`}>{cat.name}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-6 rounded-3xl flex items-center gap-4 text-rose-600">
          <Zap className="shrink-0" />
          <p className="text-sm font-bold">Lỗi kết nối Medusa: {error}</p>
        </div>
      )}

      {/* Flash Sale Section */}
      <div className="bg-rose-500/5 dark:bg-rose-900/10 rounded-[40px] p-6 md:p-8 border border-rose-100 dark:border-rose-900/20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-rose-500 text-white p-2 rounded-xl animate-pulse shadow-lg shadow-rose-500/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Flash Sale B2B</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={14} className="text-rose-500" />
                <span className="text-xs font-bold text-rose-500">Kết thúc trong: 04 : 22 : 15</span>
              </div>
            </div>
          </div>
          <button className="text-rose-500 font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-1">Xem tất cả <ChevronRight size={14} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flashSaleProducts.map((p) => (
            <Card key={`flash-${p.id}`} noPadding className="flex items-center gap-4 p-4 hover:shadow-xl transition-all border-none bg-white dark:bg-slate-900 shadow-sm" onClick={() => onProductClick(p)}>
              <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-2xl border dark:border-slate-800">
                <img src={p.thumbnail || ""} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">-{Math.round(Math.random() * 15 + 15)}%</div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{p.title}</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black text-rose-500">
                    {((p.variants?.[0]?.metadata?.price as number || 0) * 0.7).toLocaleString()}đ
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    {(p.variants?.[0]?.metadata?.price as number || 0).toLocaleString()}đ
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Sắp cháy hàng</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Catalogue & Solutions Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <BookOpen size={20} className="text-primary" /> Catalogue & Giải pháp Kỹ thuật
          </h3>
          <button className="text-[10px] font-black text-slate-400 uppercase hover:text-primary transition-colors">Xem thư viện giải pháp</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {catalogues.map((cat) => (
            <Card key={cat.id} noPadding className="relative overflow-hidden group border-none shadow-xl bg-white dark:bg-slate-900 rounded-[40px] flex flex-col md:flex-row h-full">
              <div className="md:w-5/12 h-64 md:h-auto overflow-hidden">
                <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.title} />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">#{cat.tag}</span>
                </div>
              </div>
              <div className="md:w-7/12 p-8 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white mb-3 leading-tight group-hover:text-primary transition-colors">{cat.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6 font-medium">{cat.desc}</p>

                  <div className="space-y-3 mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Zap size={14} className="text-amber-500" /> Sản phẩm trong bộ giải pháp:
                    </p>
                    <div className="flex gap-2">
                      {cat.products.map(pId => {
                        const product = filteredProducts.find(p => p.id === pId);
                        return product ? (
                          <div
                            key={pId}
                            onClick={() => onProductClick(product)}
                            className="w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary transition-all shadow-sm"
                          >
                            <img src={product.thumbnail || ""} className="w-full h-full object-cover" title={product.title} />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="soft" size="sm" className="flex-1 rounded-xl h-11 text-[10px] font-black" icon={<Info size={14} />}>XEM KỸ THUẬT</Button>
                  <Button variant="primary" size="sm" className="flex-1 rounded-xl h-11 text-[10px] font-black" icon={<ArrowUpRight size={14} />}>NHẬP BỘ SẢN PHẨM</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Tag size={20} className="text-primary" /> {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Tất cả Catalog Sỉ'}
          </h3>
          <div className="flex gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">Hiện {filteredProducts.length} mã hàng</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((p) => (
            <Card key={p.id} noPadding className="flex flex-col group cursor-pointer relative h-full hover:shadow-2xl transition-all bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[32px] overflow-hidden" onClick={() => onProductClick(p)}>
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                <div className="bg-primary/90 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-sm uppercase tracking-wider">SỈ -15%</div>
                {(p.variants?.[0]?.metadata?.stock as number || 0) < 30 && (
                  <div className="bg-amber-500/90 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-sm uppercase tracking-wider">Hot Sale</div>
                )}
              </div>

              <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800 transition-colors">
                {p.thumbnail ? (
                  <img src={p.thumbnail || ""} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-white dark:bg-slate-800 flex items-center justify-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Zap size={20} className='text-white fill-white' />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                  <button onClick={(e) => { e.stopPropagation(); onProductClick(p); }} className="w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-slate-900 transition-colors">
                    <ShoppingCart size={20} />
                  </button>
                </div>
                <button onClick={(e) => toggleWishlist(p.id, e)} className={`absolute top-3 right-3 backdrop-blur-md p-2 rounded-xl shadow-sm transition-all z-10 ${wishlist.includes(p.id) ? 'bg-rose-500 text-white' : 'bg-white/80 dark:bg-slate-700/80 text-rose-500 hover:bg-white'}`}>
                  <Heart size={16} fill={wishlist.includes(p.id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">{(p.type as any)?.value || "Khác"}</span>
                  <div className="flex items-center text-amber-400"><Star size={10} fill="currentColor" /><span className="text-[9px] font-black ml-1">4.9</span></div>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 min-h-[40px] leading-snug group-hover:text-primary transition-colors">{p.title}</h4>
                <div className="mt-4 flex flex-col gap-0.5">
                  <p className="text-primary dark:text-green-400 font-black text-xl">{((p.variants?.[0]?.metadata?.price as number || 0) * 0.85).toLocaleString()}đ</p>
                  <p className="text-[10px] text-slate-400 line-through font-bold">{(p.variants?.[0]?.metadata?.price as number || 0).toLocaleString()}đ</p>
                </div>
                <div className="pt-4 mt-auto">
                  <div className="w-full flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Đã bán 1.2k+</span>
                    <span className="text-emerald-500">Sẵn hàng</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-32 text-center space-y-4 opacity-40">
              <Search size={64} className="mx-auto" />
              <p className="text-sm font-black uppercase">Không tìm thấy sản phẩm sỉ phù hợp</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
