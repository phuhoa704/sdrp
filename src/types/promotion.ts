export type PromotionStatus = 'active' | 'inactive' | 'draft';
export type PromotionType = 'standard' | 'buyget';
export type ApplicationMethodType = 'fixed' | 'percentage';
export type ApplicationMethodTargetType = 'items' | 'order' | 'shipping_methods';
export type ApplicationMethodAllocation = 'each' | 'across';
export type CampaignBudgetType = 'spend' | 'usage';
export type RuleType = 'rules' | 'target-rules' | 'buy-rules'
export type RuleAttributeFieldType = 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'object' | 'array';
export type RuleAttributeOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'ncontains';

export interface PromotionRule {
    id: string;
    description?: string;
    attribute: string;
    operator: string[];
    values: string;
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

/* RULES */
export interface GetRuleAttributeOptionsParams {
    promotion_type: PromotionType;
    application_method_type: ApplicationMethodType;
    application_method_target_type: ApplicationMethodTargetType;
}

export interface RuleAttributeOperatorOption {
    id: RuleAttributeOperator;
    label: string;
    value: RuleAttributeOperator;
}

export interface RuleAttributeOption {
    id: string;
    label: string;
    field_type: RuleAttributeFieldType;
    required: boolean;
    value: string;
    operators: RuleAttributeOperatorOption[];
    options?: { label: string; value: string }[];
}

export interface GetRuleAttributeOptionsResponse {
    attributes: RuleAttributeOption[];
}

export interface RuleValueOption {
    label: string;
    value: string;
}

export interface GetRuleValuesOptionsResponse {
    values: RuleValueOption[];
    count: number;
    limit: number;
    offset: number;
}
