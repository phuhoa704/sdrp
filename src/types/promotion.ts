export type PromotionType =
    | 'amount_off_products'
    | 'amount_off_order'
    | 'percentage_off_product'
    | 'percentage_off_order'
    | 'buy_x_get_y'
    | 'free_shipping';

export interface Promotion {
    id: string;
    type: PromotionType;
    method: 'code' | 'automatic';
    code?: string;
    status: 'active' | 'draft';
    value: number;
    maxValue?: number;
    allocation: 'each' | 'once';
    usageLimit?: number;
    createdAt: string;
    campaignId?: string;
}

export interface PromotionCampaign {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    budget?: number;
    status: 'active' | 'inactive';
}