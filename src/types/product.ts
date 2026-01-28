import { Metadata } from "./metadata";
import { SalesChannel } from "./sales-channel";

// Medusa Product
export type ISODateString = string

export interface ProductImage {
    id: string
    url: string
    metadata: Metadata | null
    rank: number
    product_id: string
    created_at: ISODateString
    updated_at: ISODateString
    deleted_at: ISODateString | null
}

export interface ProductCollection {
    id: string
    title: string
    handle: string
    metadata: Metadata | null
    created_at: ISODateString
    updated_at: ISODateString
    deleted_at: ISODateString | null
}

export interface ProductCategory {
    id: string
    name: string
    handle: string
    description: string
    is_active: boolean
    is_internal: boolean
    parent_category_id: string | null
    parent_category?: ProductCategory | null
    category_children?: ProductCategory[]
    created_at: ISODateString
    updated_at: ISODateString
    deleted_at: ISODateString | null
    metadata: Metadata | null
}

export interface ProductOptionValue {
    id: string
    value: string
    metadata: Metadata | null
    option_id: string
    created_at: ISODateString
    updated_at: ISODateString
    deleted_at: ISODateString | null
}

export interface ProductOption {
    id: string
    title: string
    metadata: Metadata | null
    product_id: string
    created_at: ISODateString
    updated_at: ISODateString
    deleted_at: ISODateString | null
    values: ProductOptionValue[]
}

export interface VariantOption {
    id: string
    value: string
    metadata: Metadata | null
    option_id: string
    option: {
        id: string
        title: string
        metadata: Metadata | null
        product_id: string
        created_at: ISODateString
        updated_at: ISODateString
        deleted_at: ISODateString | null
    }
    created_at: ISODateString
    updated_at: ISODateString
    deleted_at: ISODateString | null
}

export interface MoneyAmount {
    id: string;
    currency_code: string;
    amount: number;
    min_quantity: number | null;
    max_quantity: number | null;
    variant_id: string;
    created_at: ISODateString;
    updated_at: ISODateString;
    deleted_at: ISODateString | null;
}

export interface ProductVariant {
    id: string
    title: string
    sku: string | null
    barcode: string | null
    ean: string | null
    upc: string | null

    allow_backorder: boolean
    manage_inventory: boolean

    hs_code: string | null
    origin_country: string | null
    mid_code: string | null
    material: string | null

    weight: number | null
    length: number | null
    height: number | null
    width: number | null

    metadata: Metadata | null
    variant_rank: number
    thumbnail: string | null

    product_id: string

    created_at: ISODateString
    updated_at: ISODateString
    deleted_at: ISODateString | null

    options: VariantOption[]
    prices: MoneyAmount[]
}

export interface Product {
    id: string
    title: string
    subtitle: string | null
    description: string | null
    handle: string

    is_giftcard: boolean
    discountable: boolean

    thumbnail: string | null

    collection_id: string | null
    type_id: string | null

    weight: number | null
    length: number | null
    height: number | null
    width: number | null

    metadata?: Metadata | null

    hs_code: string | null
    origin_country: string | null
    mid_code: string | null
    material: string | null

    created_at: ISODateString
    updated_at: ISODateString

    type: any | null

    collection: ProductCollection | null
    categories?: ProductCategory[]
    sales_channels?: SalesChannel[]

    options: ProductOption[]
    tags: any[]

    images: ProductImage[]
    variants: ProductVariant[]
}