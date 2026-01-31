import { useState, useEffect, useCallback } from 'react';
import { regionService } from '@/lib/api/medusa/regionService';
import { Region } from '@/types/region';

export interface UseRegionsOptions {
    autoFetch?: boolean;
    limit?: number;
    offset?: number;
}

export const useRegions = (options: UseRegionsOptions = {}) => {
    const { autoFetch = true, limit = 50, offset = 0 } = options;

    const [regions, setRegions] = useState<Region[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRegions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await regionService.getRegions({
                limit,
                offset
            });
            setRegions(data.regions);
            setCount(data.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa regions');
        } finally {
            setLoading(false);
        }
    }, [limit, offset]);

    useEffect(() => {
        if (autoFetch) {
            fetchRegions();
        }
    }, [autoFetch, fetchRegions]);

    return {
        regions,
        count,
        loading,
        error,
        refresh: fetchRegions
    };
};
