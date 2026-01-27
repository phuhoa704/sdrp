export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    group?: string;
    debt: number;
    totalSales: number;
    taxCode?: string;
    note?: string;
    createdAt: string;
    gender?: string;
    birthday?: string;
    facebook?: string;
    isActive: boolean;
}