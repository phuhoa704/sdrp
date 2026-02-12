import { Vendor } from "@/lib/api/medusa/auth";
import { ProductVariant } from "./product";

export enum StockUpType {
    INBOUND = "goods_receipt",
    DISPOSAL = "adjustment"
}

export interface StockUpSummaryItem {
    price: number;
    quantity: number;
    variant_id: string;
    location_id: string;
    inventory_item_id: string;
    inventory_level_id: string;
}

export interface StockUpSummary {
    items: StockUpSummaryItem[];
    total: number;
}

export interface StockUp {
    id: string;
    title: string;
    code: string;
    type: StockUpType;
    created_at: string;
    created_by: string;
    variant_id: string;
    metadata: Record<string, unknown>;
    vendor_id: string;
    summary?: StockUpSummary;
    product_variant?: ProductVariant[];
    vendor?: Vendor;
}

export interface StockUpCreate {
    title: string;
    type: string;
    summary: StockUpSummary;
}

export interface StockUpCreateResponse {
    goods_receipt_id: string;
}

export interface StockUpFilters {
    type: StockUpType[];
}

export interface StockUpQuery {
    q?: string;
    limit?: number;
    page?: number;
    fields?: string;
    filters?: StockUpFilters;
}

