export interface Campaign {
    id: string;
    name: string;
    description: string;
    currency: string;
    campaign_identifier: string;
    starts_at: string;
    ends_at: string;
    budget: {
        id: string;
        type: string;
        currency_code: string;
        limit: number;
        used: number;
        attribute: string;
    };
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface CreateCampaignPayload {
    name: string;
    campaign_identifier: string;
    description?: string | null;
    starts_at: string | null;
    ends_at: string | null;
    budget: {
        type: string;
        currency_code?: string | null;
        limit?: number | null;
        attribute?: string | null;
    };
}

export interface UpdateCampaignPayload {
    name?: string;
    description?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
    campaign_identifier?: string;
    budget?: {
        limit: number;
    }
}

export interface ManagePromotionsPayload {
    add: string[];
    remove: string[];
}