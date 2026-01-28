import { useState, useEffect, useCallback } from 'react';
import { salesChannelService } from '@/lib/api/medusa/salesChannelService';
import { SalesChannel } from '@/types/sales-channel';

/**
 * Hook to fetch and manage Medusa sales channels
 * @param autoFetch Whether to fetch sales channels on mount
 */
export const useSalesChannels = (autoFetch = true) => {
    const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSalesChannels = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await salesChannelService.getSalesChannels();
            setSalesChannels(data.sales_channels);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa sales channels');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchSalesChannels();
        }
    }, [autoFetch, fetchSalesChannels]);

    return {
        salesChannels,
        loading,
        error,
        refresh: fetchSalesChannels
    };
};
