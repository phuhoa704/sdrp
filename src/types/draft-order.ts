export enum DraftOrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    DRAFT = 'draft',
    ARCHIVED = 'archived',
    CANCELLED = 'cancelled',
}

export interface CreateDraftOrderPayload {
    email: string;
    region_id: string;
    items: {
        variant_id?: string;
        quantity: number;
        unit_price?: number;
        title?: string;
        metadata?: Record<string, any>;
    }[];
    shipping_methods?: {
        option_id: string;
        data?: Record<string, any>;
        price?: number;
    }[];
    customer_id?: string;
    billing_address_id?: string;
    shipping_address_id?: string;
    billing_address?: any;
    shipping_address?: any;
    discounts?: {
        code: string;
    }[];
    metadata?: Record<string, any>;
    sales_channel_id?: string;
}

export interface DraftOrderItem {
    id: string;
    title: string;
    subtitle?: string;
    thumbnail?: string;
    variant_id: string;
    product_id: string;
    product_title: string;
    variant_sku: string;
    variant_title: string;
    unit_price: number;
    quantity: number;
    total: number;
    subtotal: number;
    tax_total: number;
    discount_total: number;
    created_at: string;
    updated_at: string;
    metadata?: Record<string, any>;
}

export interface DraftOrder {
    id: string;
    status: DraftOrderStatus;
    currency_code: string;
    email: string;
    customer_id?: string;
    region_id: string;
    sales_channel_id?: string;
    payment_status: string;
    fulfillment_status: string;
    items: DraftOrderItem[];
    total: number;
    subtotal: number;
    tax_total: number;
    discount_total: number;
    shipping_total: number;
    created_at: string;
    updated_at: string;
    display_id?: number;
}

export interface DraftOrderListResponse {
    draft_orders: DraftOrder[];
    count: number;
    offset: number;
    limit: number;
}

export interface DraftOrderCheckAvailabilityResponse {
    status: string;
    message: string;
    data: {
        [variantId: string]: {
            availability: number;
            sales_channel_id: string;
        }
    }
}