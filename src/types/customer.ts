export type CustomerAddress = {
    id: string;
    address_name: string;
    is_default_shipping: boolean;
    is_default_billing: boolean;
    customer_id: string;
    company: string;
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    country_code: string;
    province: string;
    postal_code: string;
    phone: string;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
};

export type Customer = {
    id: string;
    has_account: boolean;
    email: string;
    default_billing_address_id: string | null;
    default_shipping_address_id: string | null;
    company_name: string;
    first_name: string;
    last_name: string;
    addresses: CustomerAddress[];
    phone: string;
    metadata: Record<string, any> | null;
};