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