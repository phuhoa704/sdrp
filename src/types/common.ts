export interface CommonQuery {
    q?: string;
    limit?: number;
    offset?: number;
    [key: string]: unknown;
}

export interface CommonResponse {
    count: number;
    limit: number;
    offset: number;
}
