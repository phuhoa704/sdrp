export interface Translation {
    id: string,
    reference_id: string,
    reference: string,
    locale_code: string,
    translations: {
        title: string,
        description: string,
    },
    created_at: string,
    updated_at: string,
    deleted_at: string
}

export interface ProductType {
    id: string,
    value: string,
    metadata: Record<string, unknown>,
    translations: Translation[],
    product_count: number,
    created_at: string,
    updated_at: string,
    deleted_at: string
}