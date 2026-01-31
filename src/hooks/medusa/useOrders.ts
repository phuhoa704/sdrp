import { useState, useCallback, useEffect } from 'react';
import { orderService } from '@/lib/api/medusa/orderService';

export const useOrders = (query?: any) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryStr = JSON.stringify(query);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getOrders(query);
            setOrders(data.orders);
            setCount(data.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    }, [queryStr]); // Use queryStr here

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        count,
        loading,
        error,
        refresh: fetchOrders
    };
};
