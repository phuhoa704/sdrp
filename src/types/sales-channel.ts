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

export interface SalesChannelData {
    sales_channel_id: string;
    sales_channel: SalesChannel;
}

export interface SalesChannelListResponse {
    data: {
        data: SalesChannelData[];
        message: string;
        pagination: {
            count: number;
            limit: number;
            offset: number;
        };
        status: string
    },
    status: number;
}
