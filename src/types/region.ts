export interface Country {
    id: number;
    iso_2: string;
    iso_3: string;
    num_code: number;
    name: string;
    display_name: string;
    region_id: string;
}

export interface Region {
    id: string;
    name: string;
    currency_code: string;
    tax_rate: number;
    tax_code: string | null;
    gift_cards_taxable: boolean;
    automatic_taxes: boolean;
    tax_provider_id: string | null;
    metadata: Record<string, any> | null;
    countries: Country[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface RegionListResponse {
    regions: Region[];
    count: number;
    offset: number;
    limit: number;
}
