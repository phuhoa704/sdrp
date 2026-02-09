import { useState, useEffect, useCallback } from "react";
import { customerService } from "@/lib/api/medusa/customerService";
import { Customer } from "@/types/customer";

interface Props {
    autoFetch?: boolean;
    query?: any;
}

export const useCustomers = (props: Props) => {
    const { autoFetch = true, query } = props;
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await customerService.getCustomers(query);
            setCustomers(data.data.data.map((item: any) => item.customer));
            setCount(data.data.pagination.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa customers');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(query)]);

    useEffect(() => {
        if (autoFetch) {
            fetchCustomers();
        }
    }, [autoFetch, fetchCustomers]);

    const deleteCustomer = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await customerService.deleteCustomer(id);
            await fetchCustomers();
            return { success: true };
        } catch (err: any) {
            setError(err.message || 'Failed to delete customer');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [fetchCustomers]);

    return {
        customers,
        count,
        loading,
        error,
        refresh: fetchCustomers,
        deleteCustomer
    };
}