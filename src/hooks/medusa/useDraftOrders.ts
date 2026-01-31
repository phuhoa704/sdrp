import { useState, useEffect, useCallback } from 'react';
import { draftOrderService } from '@/lib/api/medusa/draftOrderService';
import { DraftOrder } from '@/types/draft-order';

export interface UseDraftOrdersOptions {
    autoFetch?: boolean;
    q?: string;
    limit?: number;
    offset?: number;
}

export const useDraftOrders = (options: UseDraftOrdersOptions = {}) => {
    const { autoFetch = true, q, limit = 20, offset = 0 } = options;

    const [draftOrders, setDraftOrders] = useState<DraftOrder[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDraftOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await draftOrderService.getDraftOrders({
                // q,
                // limit,
                // offset,
                fields: "id,items"
            });
            setDraftOrders(data.draft_orders);
            setCount(data.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa draft orders');
        } finally {
            setLoading(false);
        }
    }, [q, limit, offset]);

    useEffect(() => {
        if (autoFetch) {
            fetchDraftOrders();
        }
    }, [autoFetch, fetchDraftOrders]);

    return {
        draftOrders,
        count,
        loading,
        error,
        refresh: fetchDraftOrders
    };
};
