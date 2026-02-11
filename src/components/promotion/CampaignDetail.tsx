import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, MoreHorizontal, Info,
  Zap, ExternalLink, Loader2,
  Plus, Calendar, SearchX, Trash2, Edit, PenLine,
  Ticket
} from 'lucide-react';
import { Campaign } from '@/types/campaign';
import { Promotion } from '@/types/promotion';
import { campaignService } from '@/lib/api/medusa/campaignService';
import { promotionService } from '@/lib/api/medusa/promotionService';
import { Card } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { cn, formatDateByFormat } from '@/lib/utils';
import { usePromotions } from '@/hooks';
import { Drawer } from '@/components/Drawer';

interface CampaignDetailProps {
  id: string;
  onBack: () => void;
}

export const CampaignDetail: React.FC<CampaignDetailProps> = ({ id, onBack }) => {
  const { showToast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoLoading, setPromoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPromoModalOpen, setIsAddPromoModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    campaign_identifier: '',
    starts_at: '',
    ends_at: ''
  });

  const [tempBudgetLimit, setTempBudgetLimit] = useState<number>(0);

  // Add promo state
  const [selectedPromoIds, setSelectedPromoIds] = useState<string[]>([]);
  const { promotions: allPromotions, loading: allPromosLoading } = usePromotions({
    fields: "id,code,status"
  });

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await campaignService.getCampaigns({ id: id });
      // Assuming res.data.data contains our campaign if queried by id
      const campData = res.data.data.find((item: any) => item.campaign.id === id)?.campaign;
      if (campData) {
        setCampaign(campData);
        setEditForm({
          name: campData.name,
          description: campData.description || '',
          campaign_identifier: campData.campaign_identifier,
          starts_at: campData.starts_at ? new Date(campData.starts_at).toISOString().split('.')[0].slice(0, 16) : '',
          ends_at: campData.ends_at ? new Date(campData.ends_at).toISOString().split('.')[0].slice(0, 16) : ''
        });
        setTempBudgetLimit(campData.budget?.limit || 0);
      }

      // Fetch promotions for this campaign
      setPromoLoading(true);
      const promoRes = await promotionService.getMedusaPromotions({ campaign_id: id });
      setPromotions(promoRes.promotions);
    } catch (err: any) {
      setError(err.message || 'Không thể lấy thông tin chiến dịch');
    } finally {
      setLoading(false);
      setPromoLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    setIsActionLoading(true);
    try {
      await campaignService.deleteCampaign(id);
      showToast('Xóa chiến dịch thành công', 'success');
      onBack();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa chiến dịch', 'error');
    } finally {
      setIsActionLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleUpdate = async () => {
    setIsActionLoading(true);
    try {
      await campaignService.updateCampaign(id, {
        ...editForm,
        starts_at: editForm.starts_at ? new Date(editForm.starts_at).toISOString() : null,
        ends_at: editForm.ends_at ? new Date(editForm.ends_at).toISOString() : null
      });
      showToast('Cập nhật chiến dịch thành công', 'success');
      setIsEditModalOpen(false);
      fetchDetail();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi cập nhật chiến dịch', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAddPromotions = async () => {
    setIsActionLoading(true);
    try {
      await campaignService.managePromotions(id, {
        add: selectedPromoIds,
        remove: []
      });
      showToast('Thêm khuyến mãi thành công', 'success');
      setIsAddPromoModalOpen(false);
      setSelectedPromoIds([]);
      fetchDetail();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi thêm khuyến mãi', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    setIsActionLoading(true);
    try {
      await campaignService.updateCampaign(id, {
        budget: {
          limit: tempBudgetLimit
        }
      });
      showToast('Cập nhật hạn mức thành công', 'success');
      setIsBudgetModalOpen(false);
      fetchDetail();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi cập nhật hạn mức', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Đang tải chi tiết chiến dịch...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="py-20 text-center">
        <p className="text-rose-500 font-bold">{error || 'Không tìm thấy dữ liệu'}</p>
        <button onClick={onBack} className="mt-4 text-emerald-500 font-bold hover:underline flex items-center gap-2 mx-auto uppercase tracking-widest text-[11px]">
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>
      </div>
    );
  }

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
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none">{campaign.name}</h2>
            <div className={cn("flex items-center gap-2 px-3 py-1 border rounded-lg", new Date(campaign.starts_at) > new Date() ? 'bg-blue-500/10 border-blue-500/20' : 'bg-emerald-500/10 border-emerald-500/20')}>
              <div className={cn("w-1.5 h-1.5 rounded-full", new Date(campaign.starts_at) > new Date() ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]')} />
              <span className={cn("text-[10px] font-black uppercase tracking-widest leading-none", new Date(campaign.starts_at) > new Date() ? 'text-blue-600' : 'text-emerald-600')}>
                {new Date(campaign.starts_at) > new Date() ? 'Đã lên lịch' : 'Hoạt động'}
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-slate-800 dark:text-white">{campaign.name}</h3>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400"
                  >
                    <MoreHorizontal size={24} />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={() => {
                            setIsEditModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit size={16} /> Chỉnh sửa chiến dịch
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                        <button
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 size={16} /> Xóa chiến dịch
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 py-4 border-b dark:border-slate-800/50 items-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Identifier</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                  {campaign.campaign_identifier}
                </span>
              </div>
              <div className="space-y-3 py-4">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Description</span>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  {campaign.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Promotions Panel */}
          <Card noPadding className="overflow-hidden border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-slate-800 dark:text-white leading-none">Promotions</h4>
                <button
                  onClick={() => setIsAddPromoModalOpen(true)}
                  className="px-4 py-2 text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Add
                </button>
              </div>

              {promoLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-emerald-500" size={32} />
                </div>
              ) : promotions.length > 0 ? (
                <div className="space-y-4">
                  {promotions.map((promo, idx) => (
                    <div key={promo.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-800 rounded-[20px] flex items-center justify-between animate-fade-in group" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                          <Zap size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">{promo.code}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {promo.type} • {promo.application_method.value}% OFF
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest",
                        promo.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                      )}>
                        {promo.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-[28px] flex items-center justify-center mb-4 text-slate-500">
                    <Ticket size={28} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 mb-2">No records</p>
                  <p className="text-[10px] text-slate-500 font-bold max-w-[200px]">Chưa có khuyến mãi nào.</p>
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
                  {Object.keys(campaign).length} keys
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
          {/* Configuration Card */}
          <Card noPadding className="overflow-hidden border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase leading-none">Cấu hình</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border dark:border-slate-800/50">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-8 bg-amber-500 rounded-full" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Ngày bắt đầu</p>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-200">{campaign.starts_at ? formatDateByFormat(campaign.starts_at, "MMM dd, yyyy h:mm a") : 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border dark:border-slate-800/50">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-8 bg-amber-500 rounded-full" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Ngày kết thúc</p>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-200">{campaign.ends_at ? formatDateByFormat(campaign.ends_at, "MMM dd, yyyy h:mm a") : '∞'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Budget Used Card */}
          <Card noPadding className="overflow-hidden border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Zap size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase leading-none">Đã sử dụng</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="w-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{campaign.budget?.used || 0}</p>
            </div>
          </Card>

          {/* Budget Limit Card */}
          <Card noPadding className="overflow-hidden border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Calendar size={16} />
                </div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase leading-none">
                  {campaign.budget?.attribute === 'customer_id' ? 'Budget limit per customer' : 'Budget limit per email'}
                </h4>
              </div>
              <button
                onClick={() => {
                  setTempBudgetLimit(campaign.budget?.limit || 0);
                  setIsBudgetModalOpen(true);
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-blue-500"
              >
                <PenLine size={18} />
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="w-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
                {campaign.budget?.limit?.toLocaleString() || '∞'}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa chiến dịch?"
        message="Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến chiến dịch này sẽ bị xóa vĩnh viễn."
        variant="danger"
        confirmText="XÓA CHIẾN DỊCH"
        isLoading={isActionLoading}
      />

      {/* Edit Modal (Form) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa chiến dịch"
      >
        <div className="p-8 space-y-6 font-sans">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tên chiến dịch</label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full h-14 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl px-5 text-sm font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mã nhận diện</label>
              <input
                type="text"
                value={editForm.campaign_identifier}
                onChange={e => setEditForm({ ...editForm, campaign_identifier: e.target.value })}
                className="w-full h-14 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl px-5 text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mô tả</label>
            <textarea
              rows={4}
              value={editForm.description}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ngày bắt đầu</label>
              <input
                type="datetime-local"
                value={editForm.starts_at}
                onChange={e => setEditForm({ ...editForm, starts_at: e.target.value })}
                className="w-full h-14 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl px-5 text-sm font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ngày kết thúc</label>
              <input
                type="datetime-local"
                value={editForm.ends_at}
                onChange={e => setEditForm({ ...editForm, ends_at: e.target.value })}
                className="w-full h-14 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl px-5 text-sm font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              className="flex-1 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-black uppercase tracking-widest"
              onClick={() => setIsEditModalOpen(false)}
              variant='secondary'
            >
              Hủy
            </Button>
            <Button
              className="flex-1 h-14 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20"
              onClick={handleUpdate}
              loading={isActionLoading}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Promotion Modal */}
      <Modal
        isOpen={isAddPromoModalOpen}
        onClose={() => setIsAddPromoModalOpen(false)}
        title="Thêm khuyến mãi vào chiến dịch"
      >
        <div className="p-8 space-y-6 font-sans">
          <p className="text-xs text-slate-500 font-medium">Chọn các khuyến mãi hiện có để gán vào chiến dịch này.</p>

          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {allPromosLoading ? (
              <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>
            ) : allPromotions.length > 0 ? (
              allPromotions.filter(p => !promotions.find(cp => cp.id === p.id)).map(promo => {
                const isSelected = selectedPromoIds.includes(promo.id);
                return (
                  <div
                    key={promo.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPromoIds(selectedPromoIds.filter(id => id !== promo.id));
                      } else {
                        setSelectedPromoIds([...selectedPromoIds, promo.id]);
                      }
                    }}
                    className={cn(
                      "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group",
                      isSelected ? "bg-emerald-50/10 border-emerald-500" : "bg-slate-50 dark:bg-slate-900 border-transparent hover:border-slate-300 dark:hover:border-slate-800"
                    )}
                  >
                    <div>
                      <h4 className="font-black text-sm text-slate-800 dark:text-white tracking-tight leading-none mb-1.5">{promo.code}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">{promo.status}</p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected ? "bg-emerald-500 border-emerald-500" : "border-slate-300 dark:border-slate-700"
                    )}>
                      {isSelected && <Plus size={14} className="text-white rotate-45" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center opacity-30">
                <SearchX size={32} className="mx-auto mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">Không còn khuyến mãi để thêm</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              className="flex-1 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-black uppercase tracking-widest"
              onClick={() => setIsAddPromoModalOpen(false)}
              variant='secondary'
            >
              Hủy
            </Button>
            <Button
              className="flex-1 h-14 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20"
              onClick={handleAddPromotions}
              disabled={selectedPromoIds.length === 0}
              loading={isActionLoading}
            >
              Thêm ({selectedPromoIds.length})
            </Button>
          </div>
        </div>
      </Modal>

      {/* Budget Limit Update Modal */}
      <Modal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        title="Cập nhật hạn mức"
      >
        <div className="p-8 space-y-6 font-sans">
          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Loại giới hạn</p>
              <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                {campaign?.budget?.attribute === 'customer_id' ? 'Giới hạn theo Khách hàng' : 'Giới hạn theo Email'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Hạn mức sử dụng mới</label>
            <input
              type="number"
              value={tempBudgetLimit}
              onChange={(e) => setTempBudgetLimit(Number(e.target.value))}
              placeholder="VD: 100"
              className="w-full h-14 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all font-sans"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              className="flex-1 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-black uppercase tracking-widest"
              onClick={() => setIsBudgetModalOpen(false)}
              variant='secondary'
            >
              Hủy
            </Button>
            <Button
              className="flex-1 h-14 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-600/20"
              onClick={handleUpdateBudget}
              loading={isActionLoading}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
