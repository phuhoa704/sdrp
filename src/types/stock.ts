export interface StockDisposalItem {
    productId: string;
    productName: string;
    unit: string;
    quantity: number;
    costPrice: number;
    subtotal: number;
}

export interface StockDisposalVoucher {
    id: string;
    code: string;
    createdAt: string;
    creator: string;
    status: 'draft' | 'completed' | 'cancelled';
    items: StockDisposalItem[];
    totalValue: number;
    branch: string;
    note?: string;
}

export interface StockAuditItem {
    productId: string;
    productName: string;
    variantLabel?: string;
    unit: string;
    systemStock: number;
    actualStock: number;
    varianceQty: number;
    varianceValue: number;
}

export interface StockAuditVoucher {
    id: string;
    code: string;
    createdAt: string;
    balanceDate?: string;
    creator: string;
    status: 'draft' | 'balanced' | 'cancelled';
    items: StockAuditItem[];
    totalActual: number;
    totalSystem: number;
    totalVarianceQty: number;
    totalVarianceValue: number;
    note?: string;
}

export interface StockLocationAddress {
    id: string;
    address_1: string | null;
    address_2: string | null;
    city: string | null;
    country_code: string | null;
    phone: string | null;
    postal_code: string | null;
    province: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    metadata: Record<string, unknown> | null;
}

export interface StockLocation {
    id: string;
    name: string;
    address_id?: string;
    address?: StockLocationAddress | null;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
