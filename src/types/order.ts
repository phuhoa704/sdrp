export enum OrderStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    DRAFT = "draft",
    ARCHIVED = "archived",
    REQUIRES_ACTION = "requires_action",
}

export interface MedusaOrderItem {
    id: string;
    title: string;
    subtitle?: string;
    thumbnail?: string;
    variant_id?: string;
    product_id?: string;
    product_title?: string;
    variant_sku?: string;
    variant_title?: string;
    unit_price: number;
    quantity: number;
    total: number;
    subtotal: number;
    tax_total: number;
    discount_total: number;
}

export interface MedusaOrder {
    id: string;
    email: string;
    customer_id?: string;
    region_id?: string;
    sales_channel_id?: string;
    currency_code: string;
    items: MedusaOrderItem[];
    status: OrderStatus;
    payment_status: string;
    fulfillment_status: string;
    total: number;
    subtotal: number;
    tax_total: number;
    discount_total: number;
    shipping_total: number;
    created_at: string;
    updated_at: string;
    summary?: {
        paid_total: number;
        refunded_total: number;
        current_order_total: number;
    };
    display_id?: number; // Medusa often adds this for human-readable IDs
}

export interface B2COrder {
    id: string;
    customer: { name: string, phone: string, address: string };
    date: string;
    timestamp: number;
    total: number;
    status: OrderStatus;
    items: { name: string, qty: number, price: number, variant?: string, tech_specs?: string }[];
}