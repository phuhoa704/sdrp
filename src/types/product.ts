export interface ProductVariant {
    id: string;
    label: string;
    origin: string;
    price_modifier: number;
    stock: number;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    brand?: string;
    barcode?: string;
    active_ingredient: string;
    expiry_date: string;
    regulatory_doc: 'Verified' | 'Pending' | 'Expired';
    image_style: string;
    images?: string[];
    price: number;
    cost_price?: number;
    stockLevel?: number;
    current_stock?: number;
    min_stock?: number;
    max_stock?: number;
    location?: string;
    weight?: number;
    weight_unit?: string;
    description?: string;
    variants?: ProductVariant[];
    is_selling_directly?: boolean;
}