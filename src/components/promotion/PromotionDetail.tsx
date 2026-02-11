import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, MoreHorizontal, Info,
  Users, Zap, ExternalLink, Loader2,
  Plus, ChevronRight, PenLine
} from 'lucide-react';
import { Promotion, PromotionRule } from '@/types/promotion';
import { promotionService } from '@/lib/api/medusa/promotionService';
import { Card } from '@/components/Card';
import { getPromotionUIData } from '@/lib/helpers/promotion';
import { Drawer } from '@/components/Drawer';
import { PromotionCampaignForm } from '@/components/form/promotion/PromotionCampaignForm';

interface PromotionDetailProps {
  id: string;
  onBack: () => void;
}

export const PromotionDetail: React.FC<PromotionDetailProps> = ({ id, onBack }) => {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [rules, setRules] = useState<PromotionRule[]>([]);
  const [targetRules, setTargetRules] = useState<PromotionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCampaignDrawerOpen, setIsCampaignDrawerOpen] = useState(false);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [promoData, rulesData, targetRulesData] = await Promise.all([
        promotionService.getPromotion(id, { fields: '+campaign' }),
        promotionService.getPromotionRules(id),
        promotionService.getPromotionTargetRules(id)
      ]);
      setPromotion(promoData.promotion);
      setRules(rulesData.rules);
      setTargetRules(targetRulesData.rules || []);
    } catch (err: any) {
      setError(err.message || 'Không thể lấy thông tin khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Đang tải chi tiết khuyến mãi...</p>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="py-20 text-center">
        <p className="text-rose-500 font-bold">{error || 'Không tìm thấy dữ liệu'}</p>
        <button onClick={onBack} className="mt-4 text-blue-500 font-bold hover:underline flex items-center gap-2 mx-auto uppercase tracking-widest text-[11px]">
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const ui = getPromotionUIData(promotion);

  return (
    <div className="animate-fade-in space-y-6 pb-20 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-500 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none">{promotion.code}</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
                {promotion.status === 'active' ? 'Hoạt động' : 'Nháp'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <Card noPadding className="overflow-hidden border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-xl">
            <div className="p-8 space-y-5">
              <div className="flex justify-end">
                <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 py-4 border-b dark:border-slate-800/50 items-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Campaign</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {promotion.campaign?.name || 'Không có'}
                </span>
              </div>
              <div className="grid grid-cols-2 py-4 border-b dark:border-slate-800/50 items-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mã</span>
                <div>
                  <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-black text-slate-600 dark:text-slate-200 border dark:border-slate-700 shadow-sm leading-none inline-block">
                    {promotion.code}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 py-4 border-b dark:border-slate-800/50 items-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Loại</span>
                <span className="text-sm font-black text-primary uppercase italic tracking-tight">
                  {ui.label || (promotion.type.charAt(0).toUpperCase() + promotion.type.slice(1))}
                </span>
              </div>
              <div className="grid grid-cols-2 py-4 border-b dark:border-slate-800/50 items-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Giá trị</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {promotion.application_method.value.toLocaleString()}{promotion.application_method.type === 'percentage' ? '%' : ' VNĐ'}
                </span>
              </div>
              <div className="grid grid-cols-2 py-4 items-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Allocation</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {promotion.application_method.allocation === 'across' ? 'Across' : 'Each'}
                </span>
              </div>
            </div>
          </Card>

          {/* Who can use this code? */}
          <Card noPadding className="overflow-hidden border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-slate-800 dark:text-white leading-none">Who can use this code?</h4>
                <button className="text-slate-400 hover:text-slate-200 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {rules.length > 0 ? (
                <div className="space-y-3">
                  {rules.map((rule, idx) => (
                    <div key={idx} className="p-3 bg-slate-100/50 dark:bg-slate-950/40 border dark:border-slate-800/50 rounded-2xl flex items-center gap-3 w-fit animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none border dark:border-slate-700">
                        {rule.attribute_label}
                      </span>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Equals</span>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight leading-none bg-white dark:bg-slate-800/50 px-3 py-1 rounded-lg">
                        {rule.values.map(v => v.label).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 opacity-40">
                  <Users size={32} className="mb-3" />
                  <p className="text-xs font-bold uppercase tracking-widest leading-none mb-1">Áp dụng cho mọi khách hàng</p>
                  <p className="text-[10px] text-slate-500">Khuyến mãi này không giới hạn nhóm khách hàng cụ thể.</p>
                </div>
              )}
            </div>
          </Card>

          {/* What items? */}
          <Card noPadding className="overflow-hidden border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-slate-800 dark:text-white leading-none">What items will the promotion be applied to?</h4>
                <button className="text-slate-400 hover:text-slate-200 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {targetRules.length > 0 ? (
                <div className="space-y-3">
                  {targetRules.map((rule, idx) => (
                    <div key={idx} className="p-3 bg-slate-100/50 dark:bg-slate-950/40 border dark:border-slate-800/50 rounded-2xl flex items-center gap-3 w-fit animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none border dark:border-slate-700">
                        {rule.attribute_label}
                      </span>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Equals</span>
                      <span className="text-sm font-black text-slate-800 dark:text-emerald-400 tracking-tight leading-none bg-white dark:bg-slate-800/50 px-3 py-1 rounded-lg">
                        {rule.values.map(v => v.label).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-[24px] flex items-center justify-center mb-4 text-slate-500">
                    <Info size={28} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">No records</p>
                  <p className="text-[10px] text-slate-500 font-bold mb-6 max-w-[240px]">Add a condition to restrict what items the promotion applies to.</p>
                  <button className="text-blue-500 font-black text-[10px] uppercase hover:text-blue-400 flex items-center gap-2 transition-colors">
                    <Plus size={14} /> Add condition
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* JSON Card */}
          <Card noPadding className="overflow-hidden border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-xl">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none">JSON</h4>
                <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-[0.1em] border dark:border-slate-700 leading-none">
                  {Object.keys(promotion).length} keys
                </span>
              </div>
              <button className="text-slate-500 hover:text-slate-200 p-2 transition-colors">
                <ExternalLink size={16} />
              </button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card noPadding className="overflow-hidden border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase leading-none">Campaign</h4>
              <button
                onClick={() => setIsCampaignDrawerOpen(true)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-blue-500"
              >
                <PenLine size={18} />
              </button>
            </div>

            {promotion.campaign ? (
              <div className="p-7 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] text-white shadow-2xl shadow-blue-500/30 group">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
                      <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                      <h5 className="text-lg font-black tracking-tight leading-none group-hover:text-blue-100 transition-colors">{promotion.campaign.name}</h5>
                      <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mt-1.5 opacity-80">Chiến dịch liên kết</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-blue-200 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mb-1.5 opacity-70">THỜI HẠN CHIẾN DỊCH</p>
                    <p className="text-xs font-bold tracking-tight">
                      {promotion.campaign.starts_at ? new Date(promotion.campaign.starts_at).toLocaleDateString('vi-VN') : 'N/A'} - {promotion.campaign.ends_at ? new Date(promotion.campaign.ends_at).toLocaleDateString('vi-VN') : '∞'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-slate-100/50 dark:bg-slate-800/50 rounded-[28px] flex items-center justify-center text-slate-400 mb-5 shadow-inner">
                  <Info size={28} />
                </div>
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2 leading-none">Not part of a campaign</p>
                <p className="text-[10px] text-slate-500 font-bold mb-8 px-6 leading-relaxed">Add this promotion to an existing campaign and manage it collectively.</p>
                <button className="w-full h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all text-blue-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border dark:border-slate-700 shadow-sm group">
                  <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Add to Campaign
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Edit Campaign Drawer */}
      <Drawer
        isOpen={isCampaignDrawerOpen}
        onClose={() => setIsCampaignDrawerOpen(false)}
        title="Edit Campaign"
      >
        <PromotionCampaignForm
          promotionId={id}
          currentCampaignId={promotion.campaign?.id}
          onCancel={() => setIsCampaignDrawerOpen(false)}
          onSuccess={() => {
            setIsCampaignDrawerOpen(false);
            fetchDetail();
          }}
        />
      </Drawer>
    </div>
  );
};
