export interface PriceList {
    id: string;
    title: string;
    type: 'discount' | 'override';
    status: 'active' | 'inactive';
    description?: string;
    startDate?: string;
    endDate?: string;
    customerGroups?: string[];
    itemCount: number;
    createdAt: string;
}