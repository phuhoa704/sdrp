'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { usePromotions } from '@/hooks';
import {
  Plus,
  Search,
  Filter,
  Percent,
  Truck,
  Zap,
  ArrowUpRight,
  SearchX,
  PackagePlus,
  CreditCard as CreditCardIcon,
  Gift,
  Ticket,
  Clock,
  Calendar
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PromotionWizard } from '@/components/form/promotion/PromotionWizard';

const PROMOTION_UI_MAP: Record<string, { label: string; description: string; icon: any; color: string; bgColor: string }> = {
  amount_off_products: {
    label: "Giảm tiền sản phẩm",
    description: "Giảm số tiền cố định trực tiếp trên từng sản phẩm được chọn.",
    icon: PackagePlus,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  amount_off_order: {
    label: "Giảm tiền hóa đơn",
    description: "Khuyến mãi giảm một khoản tiền cố định trên tổng giá trị đơn hàng.",
    icon: CreditCardIcon,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  },
  percentage_off_product: {
    label: "Giảm % sản phẩm",
    description: "Ưu đãi theo tỷ lệ phần trăm cho danh mục hoặc sản phẩm cụ thể.",
    icon: Percent,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10"
  },
  percentage_off_order: {
    label: "Giảm % hóa đơn",
    description: "Chiết khấu theo % trên tổng bill khi đơn hàng đạt điều kiện.",
    icon: Zap,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10"
  },
  buy_x_get_y: {
    label: "Mua X tặng Y",
    description: "Chương trình quà tặng kèm khi khách hàng mua đủ số lượng X.",
    icon: Gift,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  free_shipping: {
    label: "Miễn phí vận chuyển",
    description: "Hỗ trợ phí giao hàng để kích khích khách hàng chốt đơn nhanh.",
    icon: Truck,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10"
  },
  unknown: {
    label: "Khuyến mãi",
    description: "Chương trình ưu đãi khách hàng.",
    icon: Ticket,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10"
  }
};

const getPromotionUIData = (p: any) => {
  if (p.type === 'buy_get') return PROMOTION_UI_MAP.buy_x_get_y;
  const am = p.application_method;
  if (!am) return PROMOTION_UI_MAP.unknown;

  if (am.target_type === 'shipping') return PROMOTION_UI_MAP.free_shipping;

  if (am.target_type === 'items') {
    return am.type === 'percentage' ? PROMOTION_UI_MAP.percentage_off_product : PROMOTION_UI_MAP.amount_off_products;
  }

  if (am.target_type === 'order') {
    return am.type === 'percentage' ? PROMOTION_UI_MAP.percentage_off_order : PROMOTION_UI_MAP.amount_off_order;
  }

  return PROMOTION_UI_MAP.unknown;
};

export default function Promotions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'promotions' | 'campaigns'>('promotions');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const { promotions: apiPromotions, loading, error } = usePromotions({
    q: searchTerm || undefined
  });

  const displayPromotions = (apiPromotions && apiPromotions.length > 0) ? apiPromotions : [];

  const filtered = displayPromotions.filter(p => {
    const ui = getPromotionUIData(p);
    return ui.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getPromotionTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage_off_order': return 'Giảm % hóa đơn';
      case 'amount_off_products': return 'Giảm tiền sản phẩm';
      case 'free_shipping': return 'Miễn phí vận chuyển';
      default: return 'Khuyến mãi';
    }
  };

  if (isWizardOpen) {
    return <PromotionWizard onCancel={() => setIsWizardOpen(false)} onSave={() => setIsWizardOpen(false)} />;
  }

  return (
    <div className="pb-32 animate-fade-in space-y-8 min-h-full relative font-sans text-slate-200">
      <Breadcrumb
        items={[
          { label: 'MARKETING', href: '#' },
          { label: 'KHUYẾN MÃI & CHIẾN DỊCH', href: '#' }
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
        <div className="shrink-0">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-3">
            Khuyến Mãi <span className="text-blue-500">Đa Kênh</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-tight">Tăng doanh số qua các kịch bản giảm giá và chương trình ưu đãi thông minh.</p>
        </div>

        <Button onClick={() => setIsWizardOpen(true)} className="h-14 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 font-black text-xs px-6 uppercase tracking-wider" icon={<Plus size={20} />}>
          TẠO KHUYẾN MÃI MỚI
        </Button>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-900/40 p-1.5 rounded-[24px] w-fit">
        <button
          onClick={() => setActiveTab('promotions')}
          className={cn(
            "px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-[20px]",
            activeTab === 'promotions'
              ? "bg-white dark:bg-slate-800 text-blue-500 shadow-md"
              : "text-slate-500 hover:text-slate-300"
          )}
        >
          DANH SÁCH KHUYẾN MÃI
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={cn(
            "px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-[20px]",
            activeTab === 'campaigns'
              ? "bg-white dark:bg-slate-800 text-blue-500 shadow-md"
              : "text-slate-500 hover:text-slate-300"
          )}
        >
          CHIẾN DỊCH (CAMPAIGNS)
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã code..."
            className="w-full bg-slate-900/40 border border-white/5 rounded-[24px] py-4 pl-14 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all text-slate-200 placeholder:text-slate-600 shadow-inner-glow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="w-14 h-14 flex items-center justify-center bg-slate-900/40 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
          <Filter size={20} />
        </button>
      </div>

      {activeTab === 'promotions' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-30">
              <SearchX size={48} className="mx-auto mb-4" />
              <p className="font-bold italic">Không tìm thấy khuyến mãi nào...</p>
            </div>
          ) : (
            filtered.map((p: any) => {
              const ui = getPromotionUIData(p);
              const Icon = ui.icon;
              return (
                <Card key={p.id} className="p-6 bg-white dark:bg-slate-900 hover:shadow-xl transition-all border border-transparent hover:border-blue-500/30 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-4 rounded-2xl", ui.bgColor, ui.color)}>
                      <Icon size={24} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {p.status === 'active' ? 'Hoạt động' : p.status === 'draft' ? 'Nháp' : 'Tắt'}
                      </span>
                      {!p.is_automatic && (
                        <span className="text-[11px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/50">{p.code}</span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{ui.label}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-6">
                    Khởi tạo: {new Date(p.created_at || p.createdAt).toLocaleDateString('vi-VN')}
                  </p>

                  <div className="pt-6 border-t dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Đã dùng / Giới hạn</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {p.used || 0} / {p.limit || '∞'}
                      </p>
                    </div>
                    <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* {CAMPAIGNS.map(campaign => (
            <Card key={campaign.id} className="p-4 bg-slate-900/40 border border-white/5 rounded-[24px] flex items-center justify-between group hover:bg-slate-800/40 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
                  <Calendar size={28} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors tracking-tight">{(campaign as any).name || (campaign as any).title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-3">
                    <span>BẮT ĐẦU: {(campaign as any).starts_at || (campaign as any).startDate}</span>
                    <span className="text-slate-700">•</span>
                    <span>KẾT THÚC: {(campaign as any).ends_at || (campaign as any).endDate}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12 mr-4">
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">NGÂN SÁCH DỰ KIẾN</p>
                  <p className="text-xl font-black text-blue-500 tracking-tighter">{(campaign.budget || 0).toLocaleString()}đ</p>
                </div>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all">
                  QUẢN LÝ CHIẾN DỊCH
                </button>
              </div>
            </Card>
          ))} */}
        </div>
      )}
    </div>
  );
}
