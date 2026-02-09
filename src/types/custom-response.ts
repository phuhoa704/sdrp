export interface CustomResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface CustomGetResponse<T> {
    status: number;
    data: {
        data: T[];
        message: string;
        status: string;
        pagination: {
            count: number;
            limit: number;
            offset: number;
        };
    };
}

export interface CustomPostResponse<T> {
    status: number;
    data: {
        data: T;
        message: string;
        status: string;
    };
}