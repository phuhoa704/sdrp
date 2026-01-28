import { Metadata } from "./metadata";

export interface SalesChannel {
    id: string;
    name: string;
    description: string | null;
    is_disabled: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    metadata: Metadata | null;
}

export interface SalesChannelListResponse {
    sales_channels: SalesChannel[];
    count: number;
    offset: number;
    limit: number;
}
