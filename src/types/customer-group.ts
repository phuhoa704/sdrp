import { Customer } from "./customer";
import { Metadata } from "./metadata";

export type CustomerGroup = {
    id: string;
    name: string;
    customers: Customer[];
    metadata: Metadata;
    created_at: string;
    updated_at: string;
};