export enum PriceListStatus {
    draft = "draft",
    active = "active"
}

export enum PriceListType {
    sale = "sale",
    override = "override"
}

export interface PriceListPrice {
    variant_id: string,
    rules: any,
    id: string,
    title: string,
    currency_code: string,
    amount: number,
    raw_amount: any,
    min_quantity: number,
    max_quantity: number,
    price_set_id: string,
    created_at: string,
    updated_at: string,
    deleted_at: string
}

export interface PriceList {
    id: string,
    title: string,
    description: string,
    rules: any,
    starts_at: string,
    ends_at: string,
    status: PriceListStatus,
    type: PriceListType,
    prices: PriceListPrice[],
    created_at: string,
    updated_at: string,
    deleted_at: string
}