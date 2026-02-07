import { Customer } from "./customer";

export type CustomerGroup = {
    id: string;
    name: string;
    customers: Customer[];
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
};