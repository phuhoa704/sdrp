
import React, { useState, useEffect } from 'react';
import {
  Search, ChevronRight, Bookmark, MoreHorizontal, MessageSquare,
  Heart, Share2, ArrowLeft, Plus, Edit3, Trash2, Save,
  Upload, Layout, FileText, Zap, Globe, ShieldCheck, X
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { NewsArticle } from '@/types/news';
import { MOCK_NEWS } from '../../../../mocks/news';

interface NewsViewProps {
  initialArticleId?: string | null;
  onBack: () => void;
  isAdmin?: boolean;
}

type NewsPageState = 'list' | 'create' | 'edit';

export const NewsView: React.FC<NewsViewProps> = ({ initialArticleId, onBack, isAdmin = false }) => {
  const [pageState, setPageState] = useState<NewsPageState>('list');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [category, setCategory] = useState("Tất cả");

  useEffect(() => {
    if (initialArticleId) {
      const article = MOCK_NEWS.find(a => a.id === initialArticleId);
      if (article) {
        setSelectedArticle(article);
        setPageState('list');
      }
    } else {
      setSelectedArticle(null);
    }
  }, [initialArticleId]);

  const handleSelectArticle = (article: NewsArticle) => {
    if (pageState === 'list') {
      setSelectedArticle(article);
    }
  };

  const handleEdit = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingArticle(article);
    setPageState('edit');
    setSelectedArticle(null);
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setPageState('create');
    setSelectedArticle(null);
  };

  const renderBreadcrumbs = () => (
    <div className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
      <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => { setSelectedArticle(null); setPageState('list'); }}>TIN TỨC</span>
      {(selectedArticle || pageState !== 'list') && <ChevronRight size={10} />}
      {selectedArticle && <span className="text-primary truncate max-w-[200px]">{selectedArticle.title}</span>}
      {pageState === 'create' && <span className="text-primary">Viết bài mới</span>}
      {pageState === 'edit' && <span className="text-primary">Chỉnh sửa</span>}
    </div>
  );

  const renderEditor = () => (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      {renderBreadcrumbs()}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPageState('list')}
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border dark:border-slate-700"
          >
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              {pageState === 'create' ? 'Viết bài mới' : 'Chỉnh sửa bài viết'}
            </h2>
            <p className="text-slate-500 font-medium">Ban hành tin tức, kỹ thuật nông nghiệp chuẩn SDRP</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="rounded-2xl h-14 px-8 font-bold" onClick={() => setPageState('list')}>HỦY BỔ</Button>
          <Button className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20" icon={<Save size={20} />} onClick={() => setPageState('list')}>LƯU & XUẤT BẢN</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-8 bg-white dark:bg-slate-900 border-none shadow-xl rounded-[40px] space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Tiêu đề bài viết</label>
              <input
                type="text"
                defaultValue={editingArticle?.title}
                placeholder="VD: Cảnh báo rầy nâu bùng phát tại khu vực Mekong Delta..."
                className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-lg font-bold outline-none focus:ring-4 focus:ring-primary/10 border-none dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Chuyên mục</label>
                <select className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border-none dark:text-white appearance-none">
                  {["Thị trường", "Kỹ thuật", "Pháp luật", "Thời tiết"].map(c => <option key={c} selected={editingArticle?.category === c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tác giả (Author)</label>
                <input type="text" defaultValue={editingArticle?.author || 'Ban biên tập SDRP'} className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border-none dark:text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tóm tắt (Summary)</label>
              <textarea
                defaultValue={editingArticle?.summary}
                placeholder="Mô tả tóm tắt nội dung sẽ hiển thị ở trang danh sách..."
                className="w-full h-24 p-6 bg-slate-50 dark:bg-slate-800 rounded-[28px] font-medium outline-none border-none dark:text-white resize-none"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nội dung chi tiết</label>
              <textarea
                placeholder="Viết nội dung bài viết tại đây (hỗ trợ Markdown)..."
                className="w-full h-96 p-8 bg-slate-50 dark:bg-slate-800 rounded-[32px] font-medium outline-none border-none dark:text-white resize-none leading-relaxed"
              />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 bg-white dark:bg-slate-900 border-none shadow-xl rounded-[40px] space-y-6">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Upload size={16} className="text-primary" /> Ảnh đại diện (Cover Image)
            </label>
            <div className="aspect-video rounded-[32px] bg-slate-50 dark:bg-slate-800 border-4 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group cursor-pointer relative">
              {editingArticle?.image ? (
                <>
                  <img src={editingArticle.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <Upload className="text-white" size={32} />
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-primary/10 rounded-full text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Plus size={32} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Tải lên thumbnail</p>
                </>
              )}
            </div>
          </Card>
          <Card className="p-8 bg-indigo-600 text-white border-none shadow-xl rounded-[40px] space-y-6">
            <div className="flex items-center gap-3">
              <Zap size={24} />
              <h4 className="font-black uppercase tracking-tight">Cấu hình xuất bản</h4>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="w-10 h-6 bg-rose-400 rounded-full relative transition-colors shadow-lg">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Tin khẩn cấp (Breaking)</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="w-10 h-6 bg-emerald-400 rounded-full relative transition-colors shadow-lg">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Public lên App</span>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  if (isAdmin && (pageState === 'create' || pageState === 'edit')) {
    return renderEditor();
  }

  if (selectedArticle) {
    return (
      <div className="space-y-4">
        {renderBreadcrumbs()}
        <NewsDetail article={selectedArticle} onBack={() => { setSelectedArticle(null); setPageState('list'); }} />
      </div>
    );
  }

  return (
    <div className="pb-10 animate-fade-in space-y-8">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span className="text-primary">TIN TỨC</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${isAdmin ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'} text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest`}>
              {isAdmin ? 'Editorial Management' : 'Kênh thông tin SDRP'}
            </span>
            <Zap size={14} className="text-amber-500 animate-pulse" />
          </div>
          <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
            Tin Tức <span className={`${isAdmin ? 'text-purple-600' : 'text-emerald-600'} ml-3`}>
              {isAdmin ? 'Hệ Thống' : 'Khám Phá'}
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
            {isAdmin
              ? 'Quản trị nội dung và ban hành tin tức nông nghiệp'
              : 'Cập nhật tin tức thị trường và kỹ thuật nông nghiệp'}
          </p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Button
              className="h-14 rounded-2xl px-8 font-black text-xs shadow-xl bg-purple-600 shadow-purple-500/20 text-white"
              icon={<Plus size={20} />}
              onClick={handleCreate}
            >
              TẠO BÀI VIẾT MỚI
            </Button>
          )}
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm tin tức, kỹ thuật, giá cả thị trường..."
          className="w-full h-16 pl-14 pr-6 bg-white dark:bg-slate-900 dark:text-white rounded-[28px] shadow-sm border border-slate-100 dark:border-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {["Tất cả", "Thị trường", "Kỹ thuật", "Pháp luật", "Thời tiết"].map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-6 py-3 rounded-full text-xs font-black whitespace-nowrap transition-all ${category === c ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:bg-slate-50'}`}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Tiêu điểm hôm nay</h3>
          </div>
          <div className="relative overflow-hidden rounded-[48px] h-[450px] group cursor-pointer shadow-2xl" onClick={() => handleSelectArticle(MOCK_NEWS[0])}>
            <img src={MOCK_NEWS[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-12">
              <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full w-fit mb-6 uppercase tracking-widest shadow-lg">{MOCK_NEWS[0].category}</span>
              <h4 className="text-white font-black text-3xl md:text-4xl leading-tight line-clamp-2 max-w-3xl">
                {MOCK_NEWS[0].title}
              </h4>
              <div className="flex items-center gap-4 mt-8 text-[11px] font-bold text-white/60 uppercase tracking-widest">
                <span className="text-white">{MOCK_NEWS[0].author}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span>{MOCK_NEWS[0].date}</span>
              </div>

              {/* ADMIN ACTIONS ON HERO */}
              {isAdmin && (
                <div className="absolute top-8 right-8 flex gap-3">
                  <button
                    onClick={(e) => handleEdit(MOCK_NEWS[0], e)}
                    className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-primary transition-all border border-white/20 shadow-xl"
                    title="Chỉnh sửa"
                  >
                    <Edit3 size={24} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="p-4 bg-rose-500/80 backdrop-blur-md rounded-2xl text-white hover:bg-rose-600 transition-all shadow-xl"
                    title="Gỡ bài"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Cập nhật mới</h3>
          </div>
          <div className="space-y-6">
            {MOCK_NEWS.slice(1).map(article => (
              <div
                key={article.id}
                className="flex gap-6 cursor-pointer group relative"
                onClick={() => handleSelectArticle(article)}
              >
                <div className="w-28 h-28 rounded-[28px] overflow-hidden shrink-0 shadow-md border border-slate-100 dark:border-slate-800">
                  <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">{article.category}</span>
                  <h5 className="font-black text-base text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h5>
                  <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span className="text-slate-600 dark:text-slate-300">{article.author}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span>{article.date}</span>
                  </div>

                  {/* ADMIN QUICK ACTIONS ON LIST */}
                  {isAdmin && (
                    <div className="flex gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={(e) => handleEdit(article, e)}
                        className="flex items-center gap-1 text-primary hover:text-emerald-400 text-[10px] font-black uppercase tracking-tighter"
                      >
                        <Edit3 size={12} /> Chỉnh sửa
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="flex items-center gap-1 text-rose-500 hover:text-rose-400 text-[10px] font-black uppercase tracking-tighter"
                      >
                        <Trash2 size={12} /> Gỡ bài
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button variant="soft" fullWidth className="h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4">TẢI THÊM BÀI VIẾT</Button>
        </div>
      </div>
    </div>
  );
};

const NewsDetail: React.FC<{ article: NewsArticle, onBack: () => void }> = ({ article, onBack }) => {
  return (
    <div className="bg-white dark:bg-slate-950 z-[60] overflow-y-auto animate-slide-up no-scrollbar rounded-[48px] shadow-2xl">
      <div className="relative h-[500px]">
        <img src={article.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
          <button onClick={onBack} className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-colors border border-white/20">
            <ArrowLeft size={28} />
          </button>
          <div className="flex gap-3">
            <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/40 border border-white/20">
              <Bookmark size={24} />
            </button>
            <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/40 border border-white/20">
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative -mt-24 bg-white dark:bg-slate-900 rounded-t-[64px] p-12 md:p-20 space-y-10 min-h-screen shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="bg-primary/10 text-primary text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest border border-primary/20 inline-block">{article.category}</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white leading-[1.1] tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 py-8 border-y border-slate-50 dark:border-slate-800">
            <div className="w-16 h-16 rounded-[24px] bg-slate-100 dark:bg-slate-800 overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
              <img src={`https://picsum.photos/seed/${article.author}/100/100`} alt="Author" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-black text-xl text-slate-800 dark:text-slate-100">{article.author} <span className="text-primary ml-1 text-base">✓</span></p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Biên tập viên cấp cao • {article.date}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all"><Share2 size={20} /></button>
            </div>
          </div>

          <div className="text-slate-600 dark:text-slate-300 leading-[1.8] text-lg space-y-8 font-medium">
            <p className="font-black text-2xl text-slate-800 dark:text-slate-100 italic border-l-8 border-primary pl-8 py-2">
              “{article.summary}”
            </p>
            <p>
              Theo báo cáo mới nhất từ Hiệp hội Lương thực Việt Nam, trong bối cảnh địa chính trị toàn cầu có nhiều biến động, ngành lúa gạo Việt Nam đang đứng trước những thời cơ chưa từng có. Không chỉ giá bán tăng cao, mà chất lượng gạo thơm Việt Nam cũng ngày càng khẳng định vị thế tại các thị trường khó tính như Châu Âu và Nhật Bản.
            </p>
            <p>
              Để tận dụng tốt cơ hội này, các đại lý (retailer) cần chủ động cập nhật kiến thức về quy trình bảo quản, đồng thời liên kết chặt chẽ với các hộ nông dân để đảm bảo nguồn cung ổn định và đáp ứng các tiêu chuẩn xuất khẩu khắt khe. Việc áp dụng các giải pháp bảo vệ thực vật công nghệ cao như <strong>SuperKill 500WP</strong> không chỉ giúp bảo vệ năng suất mà còn đảm bảo chất lượng hạt gạo đạt chuẩn quốc tế.
            </p>

            <div className="grid grid-cols-2 gap-6 my-12">
              <img src="https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=600" className="rounded-[40px] w-full h-64 object-cover shadow-xl" />
              <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600" className="rounded-[40px] w-full h-64 object-cover shadow-xl" />
            </div>

            <p>
              Các chuyên gia cũng nhấn mạnh tầm quan trọng của việc theo dõi sát sao dự báo thời tiết và cảnh báo sâu bệnh thời gian thực qua ứng dụng SDRP. Việc phản ứng nhanh với các thay đổi của môi trường sẽ là chìa khóa để duy trì lợi thế cạnh tranh của nông sản Việt Nam trên bản đồ thế giới.
            </p>
          </div>

          <div className="flex justify-between items-center pt-12 border-t border-slate-100 dark:border-slate-800 pb-20">
            <div className="flex gap-10">
              <button className="flex items-center gap-3 text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-rose-50 transition-all">
                  <Heart size={24} />
                </div>
                <span className="text-sm font-black">1,248 Lượt thích</span>
              </button>
              <button className="flex items-center gap-3 text-slate-400 dark:text-slate-500 hover:text-primary transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-green-50 transition-all">
                  <MessageSquare size={24} />
                </div>
                <span className="text-sm font-black">48 Bình luận</span>
              </button>
            </div>
            <button className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-black uppercase text-xs tracking-widest hover:text-primary transition-all group">
              <span>Chia sẻ bài viết</span>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center group-hover:scale-110 transition-all">
                <Share2 size={20} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
