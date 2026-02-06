import { useState, useEffect, useCallback } from 'react';
import { stockLocationService } from '@/lib/api/medusa/stockLocationService';
import { StockLocation } from '@/types/stock';

/**
 * Hook to fetch and manage Medusa stock locations
 * @param autoFetch Whether to fetch locations on mount
 */
export const useStockLocations = (autoFetch = true) => {
    const [locations, setLocations] = useState<StockLocation[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLocations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await stockLocationService.getStockLocations();
            setLocations(data.data.data.map((item) => item.stock_location));
            setCount(data.data.pagination.count);
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

    const deleteStockLocation = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await stockLocationService.deleteStockLocation(id);
            setLocations(locations.filter((location) => location.id !== id));
            setCount(count - 1);
        } catch (err: any) {
            setError(err.message || 'Failed to delete Medusa stock location');
        } finally {
            setLoading(false);
        }
    };

    return {
        locations,
        loading,
        error,
        count,
        refresh: fetchLocations,
        deleteStockLocation
    };
};
