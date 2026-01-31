import { useState, useCallback, useEffect } from 'react';
import { promotionService } from '@/lib/api/medusa/promotionService';
import { Promotion } from '@/types/promotion';

export const usePromotions = (query?: any) => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryStr = JSON.stringify(query);

    const fetchPromotions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await promotionService.getPromotions(query);
            setPromotions(data.promotions);
            setCount(data.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch promotions');
        } finally {
            setLoading(false);
        }
    }, [queryStr]);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    return {
        promotions,
        count,
        loading,
        error,
        refresh: fetchPromotions
    };
};
