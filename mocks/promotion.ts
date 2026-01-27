import { Promotion, PromotionCampaign } from "@/types/promotion";

export const PROMOTIONS: Promotion[] = [
    { id: 'P001', type: 'percentage_off_order', method: 'code', code: 'SUMMER20', status: 'active', value: 20, createdAt: '01/02/2026', usageLimit: 500, allocation: 'each' },
    { id: 'P002', type: 'free_shipping', method: 'automatic', status: 'active', value: 0, createdAt: '05/02/2026', allocation: 'each' }
];

export const CAMPAIGNS: PromotionCampaign[] = [
    { id: 'C001', title: 'Chiến dịch Mùa Vàng', startDate: '2026-02-01', endDate: '2026-03-31', status: 'active', budget: 50000000 }
];