export type RuleMap = Record<string, any>;

export type RawAmount = {
    value?: string;
    precision?: number;
};

export type Price = {
    id: string;
    title: string;
    variant_id: string;
    rules: RuleMap;
    currency_code: string;
    amount: number;
    raw_amount: RawAmount;
    min_quantity: number | null;
    max_quantity: number | null;
    price_set_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type PriceList = {
    id: string;
    title: string;
    description: string;
    rules: RuleMap;
    starts_at: string | null;
    ends_at: string | null;
    status: "draft" | "active" | "expired";
    type: "sale" | "override";
    prices: Price[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};
