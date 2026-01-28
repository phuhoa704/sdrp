import { useState, useEffect, useCallback } from 'react';
import { productTagService } from '@/lib/api/medusa/productTagService';
import { ProductTag } from '@/types/product';

/**
 * Hook to fetch and manage Medusa product tags
 */
export const useProductTags = (autoFetch = true, query: any = {}) => {
    const [tags, setTags] = useState<ProductTag[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTags = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await productTagService.getProductTags(query);
            setTags(data.product_tags);
            setCount(data.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa product tags');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(query)]);

    useEffect(() => {
        if (autoFetch) {
            fetchTags();
        }
    }, [autoFetch, fetchTags]);

    return {
        tags,
        count,
        loading,
        error,
        refresh: fetchTags
    };
};
