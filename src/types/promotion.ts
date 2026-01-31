export type PromotionStatus = 'active' | 'inactive' | 'draft';
export type PromotionType = 'standard' | 'buy_get';
export type ApplicationMethodType = 'fixed' | 'percentage';
export type ApplicationMethodTargetType = 'items' | 'order' | 'shipping';
export type ApplicationMethodAllocation = 'each' | 'across';
export type CampaignBudgetType = 'spend' | 'usage';

export interface PromotionRule {
    id: string;
    description?: string;
    attribute: string;
    operator: string;
    values: string[];
}

export interface PromotionCampaign {
    id: string;
    name: string;
    description?: string;
    currency?: string;
    campaign_identifier?: string;
    starts_at?: string;
    ends_at?: string;
    budget?: {
        id: string;
        type: CampaignBudgetType;
        currency_code: string;
        limit: number;
        used: number;
    };
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface ApplicationMethod {
    id: string;
    type: ApplicationMethodType;
    target_type: ApplicationMethodTargetType;
    allocation: ApplicationMethodAllocation;
    value: number;
    currency_code: string;
    max_quantity?: number;
    buy_rules_min_quantity?: number;
    apply_to_quantity?: number;
    target_rules?: PromotionRule[];
    buy_rules?: PromotionRule[];
    promotion?: any;
}

export interface Promotion {
    id: string;
    code: string;
    type: PromotionType;
    is_automatic: boolean;
    status: PromotionStatus;
    is_tax_inclusive: boolean;
    limit?: number;
    used: number;
    campaign_id?: string;
    campaign?: PromotionCampaign;
    application_method: ApplicationMethod;
    rules?: PromotionRule[];
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}