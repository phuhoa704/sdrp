import React, { useEffect, useState } from 'react';
import {
  X, Calendar, Tag, Info, List, Target,
  Trash2, Edit, AlertCircle, Loader2,
  CheckCircle2, Clock, Info as InfoIcon,
  ChevronRight, Gift, Zap
} from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Promotion, PromotionRule } from '@/types/promotion';
import { promotionService } from '@/lib/api/medusa/promotionService';
import { Button } from '@/components/Button';
import { getPromotionUIData } from '@/lib/helpers/promotion';
import { cn, formatTime } from '@/lib/utils';
import { Card } from '@/components/Card';

interface PromotionDetailModalProps {
  id: string | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const PromotionDetailModal: React.FC<PromotionDetailModalProps> = ({
  id,
  isOpen,
  onClose,
  onRefresh
}) => {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [rules, setRules] = useState<PromotionRule[]>([]);
  const [targetRules, setTargetRules] = useState<PromotionRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && isOpen) {
      const fetchDetail = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await promotionService.getPromotion(id);
          setPromotion(data.promotion);
          const rulesData = await promotionService.getPromotionRules(id);
          setRules(rulesData.rules);
          const targetRulesData = await promotionService.getPromotionTargetRules(id);
          setTargetRules(targetRulesData.target_rules);
        } catch (err: any) {
          setError(err.message || 'Không thể lấy thông tin khuyến mãi');
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [id, isOpen]);

  if (!isOpen) return null;

  const ui = promotion ? getPromotionUIData(promotion) : null;
  const Icon = ui?.icon || Gift;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CHI TIẾT KHUYẾN MÃI"
      maxWidth="4xl"
    >
      <div className="min-h-[400px] p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu chiến dịch...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
              <AlertCircle size={32} />
            </div>
            <p className="text-slate-800 dark:text-white font-black mb-2 uppercase tracking-tight">Đã có lỗi xảy ra</p>
            <p className="text-slate-500 text-xs font-medium max-w-sm">{error}</p>
          </div>
        ) : promotion && (
          <div className="animate-fade-in space-y-8 p-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className={cn("w-20 h-20 rounded-[24px] flex items-center justify-center shadow-lg", ui?.bgColor, ui?.color)}>
                  <Icon size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                    {ui?.label}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm mt-1 mb-3">
                    {ui?.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                      promotion.status === 'active'
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-slate-100 text-slate-400 border-slate-200"
                    )}>
                      {promotion.status === 'active' ? 'Hoạt động' : 'Bản nháp'}
                    </span>
                    {promotion.is_automatic ? (
                      <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest">Tự động</span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-widest">Sử dụng Mã: {promotion.code}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card noPadding className="p-6 bg-slate-50 dark:bg-slate-900/50 border-none shadow-inner">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Tag size={12} className="text-blue-500" /> GIÁ TRỊ ƯU ĐÃI
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
                    {promotion.application_method.value.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-slate-500 uppercase tracking-widest">
                    {promotion.application_method.type === 'percentage' ? '%' : promotion.application_method.currency_code}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-3 italic">
                  Áp dụng cho {promotion.application_method.target_type === 'items' ? 'từng sản phẩm' : promotion.application_method.target_type === 'order' ? 'tổng hóa đơn' : 'vận chuyển'}
                </p>
              </Card>

              <Card noPadding className="p-6 bg-slate-50 dark:bg-slate-900/50 border-none shadow-inner">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-emerald-500" /> TÌNH TRẠNG SỬ DỤNG
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-600 tracking-tighter">
                    {promotion.used || 0}
                  </span>
                  <span className="text-slate-300 font-medium">/</span>
                  <span className="text-2xl font-black text-slate-400 tracking-tighter">
                    {promotion.limit || '∞'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: promotion.limit ? `${Math.min(((promotion.used || 0) / promotion.limit) * 100, 100)}%` : '0%' }}
                  />
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              {rules && rules.length > 0 && (
                <section>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <List size={14} className="text-blue-500" /> Đối tượng khách hàng áp dụng
                  </h4>
                  <div className="space-y-3">
                    {rules.map((rule, idx) => (
                      <div key={`rule_${idx}`} className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight">{rule.attribute_label}</span>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-black text-slate-400 uppercase">
                            {rule.operator[0] === 'eq' ? 'Bằng' :
                              rule.operator[0] === 'in' ? 'Trong danh sách' :
                                rule.operator[0] === 'neq' ? 'Khác' : rule.operator[0]}
                          </span>
                          <span className="text-sm font-bold text-blue-500">{rule.values.map((val) => val.label).join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {targetRules && targetRules.length > 0 && (
                <section>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Target size={14} className="text-rose-500" /> Điều kiện sản phẩm áp dụng
                  </h4>
                  <div className="space-y-3">
                    {targetRules.map((rule) => (
                      <div key={rule.id} className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight">{rule.attribute_label}</span>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-black text-slate-400 uppercase">
                            {rule.operator[0] === 'eq' ? 'Bằng' :
                              rule.operator[0] === 'in' ? 'Trong danh sách' :
                                rule.operator[0] === 'neq' ? 'Khác' : rule.operator[0]}
                          </span>
                          <span className="text-sm font-bold text-rose-500">{rule.values.map((val) => val.label).join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {promotion.campaign && (
              <section className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[32px] text-white shadow-xl shadow-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                      <Zap size={22} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-none mb-1">Chiến dịch liên kết</p>
                      <h5 className="text-lg font-black tracking-tight leading-none">{promotion.campaign.name}</h5>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-blue-200" />
                </div>
                <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[9px] font-black text-blue-200 uppercase tracking-tighter mb-1 leading-none">THỜI HẠN CHIẾN DỊCH</p>
                    <p className="text-[11px] font-bold">
                      {promotion.campaign.starts_at ? new Date(promotion.campaign.starts_at).toLocaleDateString('vi-VN') : 'N/A'} - {promotion.campaign.ends_at ? new Date(promotion.campaign.ends_at).toLocaleDateString('vi-VN') : '∞'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-blue-200 uppercase tracking-tighter mb-1 leading-none">NGÂN SÁCH CAMPAIGN</p>
                    <p className="text-[11px] font-black uppercase">
                      {promotion.campaign.budget?.limit.toLocaleString()} {promotion.campaign.budget?.currency_code}
                    </p>
                  </div>
                </div>
              </section>
            )}

            <div className="h-4" />
          </div>
        )}
      </div>
    </Modal>
  );
};
