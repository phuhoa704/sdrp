import { useState, useEffect, useCallback } from 'react';
import { stockLocationService } from '@/lib/api/medusa/stockLocationService';
import { StockLocation } from '@/types/stock';

/**
 * Hook to fetch and manage Medusa stock locations
 * @param autoFetch Whether to fetch locations on mount
 */
export const useStockLocations = (autoFetch = true) => {
    const [locations, setLocations] = useState<StockLocation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLocations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await stockLocationService.getStockLocations();
            setLocations(data.stock_locations);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa stock locations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchLocations();
        }
    }, [autoFetch, fetchLocations]);

    return {
        locations,
        loading,
        error,
        refresh: fetchLocations
    };
};
