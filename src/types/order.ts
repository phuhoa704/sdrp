export interface B2COrder {
    id: string;
    customer: { name: string, phone: string, address: string };
    date: string;
    timestamp: number;
    total: number;
    status: 'completed' | 'refunded';
    items: { name: string, qty: number, price: number, variant?: string, tech_specs?: string }[];
}