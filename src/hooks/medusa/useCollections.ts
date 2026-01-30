import { useState, useEffect, useCallback } from 'react';
import { collectionService } from '@/lib/api/medusa/collectionService';
import { ProductCollection } from '@/types/product';

export interface UseCollectionsOptions {
    autoFetch?: boolean;
    q?: string;
    limit?: number;
    offset?: number;
}

export const useCollections = (options: UseCollectionsOptions = {}) => {
    const { autoFetch = true, q, limit, offset } = options;
    const [collections, setCollections] = useState<ProductCollection[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCollections = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await collectionService.getCollections({
                q,
                limit,
                offset,
                fields: "title,handle,products.id"
            });
            setCollections(data.collections);
            setCount(data.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa collections');
        } finally {
            setLoading(false);
        }
    }, [q, limit, offset]);

    useEffect(() => {
        if (autoFetch) {
            fetchCollections();
        }
    }, [autoFetch, fetchCollections, q, limit, offset]);

    return {
        collections,
        count,
        loading,
        error,
        refresh: fetchCollections
    };
};