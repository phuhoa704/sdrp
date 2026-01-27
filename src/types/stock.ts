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