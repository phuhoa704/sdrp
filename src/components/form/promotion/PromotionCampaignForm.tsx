'use client';

import React, { useState, useEffect } from 'react';
import {
    Zap, Info, Calendar, Loader2,
    ChevronDown, CheckCircle2, Circle
} from 'lucide-react';
import { useCampaigns } from '@/hooks/medusa/useCampaigns';
import { promotionService } from '@/lib/api/medusa/promotionService';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/Button';
import { cn, formatDateByFormat } from '@/lib/utils';
import { Campaign } from '@/types/campaign';

interface PromotionCampaignFormProps {
    promotionId: string;
    currentCampaignId?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const PromotionCampaignForm: React.FC<PromotionCampaignFormProps> = ({
    promotionId,
    currentCampaignId,
    onSuccess,
    onCancel,
}) => {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState<'none' | 'existing'>(currentCampaignId ? 'existing' : 'none');
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(currentCampaignId);
    const { campaigns, loading: campaignsLoading } = useCampaigns();

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await promotionService.updatePromotion(promotionId, {
                campaign_id: selectedType === 'existing' ? selectedCampaignId : null as any
            });
            showToast('Cập nhật chiến dịch thành công', 'success');
            onSuccess();
        } catch (err: any) {
            showToast(err.message || 'Lỗi khi cập nhật chiến dịch', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full font-sans">
            <div className="flex-1 space-y-8 py-4">
                {/* Selection Sections */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign</h3>

                    <div className="space-y-3">
                        {/* Without Campaign */}
                        <div
                            onClick={() => setSelectedType('none')}
                            className={cn(
                                "p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 group",
                                selectedType === 'none'
                                    ? "bg-blue-500/5 border-blue-500 shadow-lg shadow-blue-500/10"
                                    : "bg-slate-50 dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                selectedType === 'none' ? "border-blue-500 bg-blue-500" : "border-slate-300 dark:border-slate-700"
                            )}>
                                {selectedType === 'none' && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-sm text-slate-800 dark:text-white leading-none mb-1">Without Campaign</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Proceed without associating promotion with campaign</p>
                            </div>
                        </div>

                        {/* Existing Campaign */}
                        <div
                            onClick={() => setSelectedType('existing')}
                            className={cn(
                                "p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 group",
                                selectedType === 'existing'
                                    ? "bg-blue-500/5 border-blue-500 shadow-lg shadow-blue-500/10"
                                    : "bg-slate-50 dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                selectedType === 'existing' ? "border-blue-500 bg-blue-500" : "border-slate-300 dark:border-slate-700"
                            )}>
                                {selectedType === 'existing' && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-sm text-slate-800 dark:text-white leading-none mb-1">Existing Campaign</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Add promotion to an existing campaign.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {selectedType === 'existing' && (
                    <section className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 ml-1">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Existing Campaign</label>
                                <Info size={14} className="text-slate-300" />
                            </div>

                            <div className="relative group">
                                <select
                                    value={selectedCampaignId}
                                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                                    className="w-full h-14 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 appearance-none text-sm font-bold text-slate-800 dark:text-white outline-none transition-all cursor-pointer group-hover:bg-slate-100 dark:group-hover:bg-slate-800/50"
                                    disabled={campaignsLoading}
                                >
                                    <option value="">Chọn một chiến dịch...</option>
                                    {campaigns.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.campaign_identifier})</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    {campaignsLoading ? <Loader2 size={18} className="animate-spin" /> : <ChevronDown size={18} />}
                                </div>
                            </div>
                        </div>

                        {selectedCampaign && (
                            <div className="space-y-8 border-t border-slate-100 dark:border-slate-800/50 pt-8 animate-in fade-in duration-500">
                                {/* Campaign Details */}
                                <div className="space-y-5">
                                    <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Campaign details</h4>

                                    <div className="grid grid-cols-2 gap-y-4 text-xs">
                                        <span className="font-bold text-slate-400 uppercase tracking-widest">Identifier</span>
                                        <span className="font-black text-slate-700 dark:text-slate-200 text-right uppercase tracking-widest">{selectedCampaign.campaign_identifier}</span>

                                        <span className="font-bold text-slate-400 uppercase tracking-widest">Description</span>
                                        <span className="font-bold text-slate-500 dark:text-slate-400 text-right leading-relaxed">{selectedCampaign.description || '-'}</span>

                                        <span className="font-bold text-slate-400 uppercase tracking-widest">Start date</span>
                                        <span className="font-bold text-slate-600 dark:text-slate-300 text-right">{selectedCampaign.starts_at ? new Date(selectedCampaign.starts_at).toISOString() : '-'}</span>

                                        <span className="font-bold text-slate-400 uppercase tracking-widest">End date</span>
                                        <span className="font-bold text-slate-600 dark:text-slate-300 text-right">{selectedCampaign.ends_at ? new Date(selectedCampaign.ends_at).toISOString() : '-'}</span>
                                    </div>
                                </div>

                                {/* Campaign Budget */}
                                <div className="space-y-5">
                                    <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-6">Campaign budget</h4>

                                    <div className="grid grid-cols-2 gap-y-4 text-xs font-sans">
                                        <span className="font-bold text-slate-400 uppercase tracking-widest">Type</span>
                                        <span className="font-bold text-slate-500 dark:text-slate-400 text-right capitalize">
                                            {selectedCampaign.budget?.type === 'usage' ? 'Usage per customer' : 'Spend limit'}
                                        </span>

                                        <span className="font-bold text-slate-400 uppercase tracking-widest">Currency</span>
                                        <span className="font-black text-slate-500 dark:text-slate-400 text-right uppercase">{selectedCampaign.budget?.currency_code || 'vnd'}</span>

                                        <span className="font-bold text-slate-400 uppercase tracking-widest">Limit</span>
                                        <span className="font-black text-slate-700 dark:text-slate-200 text-right tracking-tight">{selectedCampaign.budget?.limit?.toLocaleString() || '-'}</span>

                                        <span className="font-bold text-slate-400 uppercase tracking-widest">Total used</span>
                                        <span className="font-bold text-slate-500 dark:text-slate-400 text-right">-</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>

            <div className="flex gap-4 pt-8 border-t border-slate-100 dark:border-slate-800/50 mt-8">
                <Button
                    variant="secondary"
                    className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    className="flex-1 h-12 rounded-xl bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={selectedType === 'existing' && !selectedCampaignId}
                >
                    Save
                </Button>
            </div>
        </div>
    );
};
