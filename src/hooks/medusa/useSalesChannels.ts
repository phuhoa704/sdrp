import { useState, useEffect, useCallback } from 'react';
import { salesChannelService } from '@/lib/api/medusa/salesChannelService';
import { SalesChannel } from '@/types/sales-channel';
import { Pagination } from '@/types/pagination';

interface SalesChannelsOptions {
    autoFetch?: boolean;
    isDisabled?: boolean;
    offset?: number;
    limit?: number;
}

export const useSalesChannels = (options: SalesChannelsOptions = {}) => {
    const { autoFetch = true, isDisabled = false, offset = 0, limit = 10 } = options;
    const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSalesChannels = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await salesChannelService.getSalesChannels({
                is_disabled: isDisabled,
                offset,
                limit
            });
            setSalesChannels(data.data.data.map(item => item.sales_channel));
            setPagination(data.data.pagination);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa sales channels');
        } finally {
            setLoading(false);
        }
    }, [isDisabled, offset, limit]);

    useEffect(() => {
        if (autoFetch) {
            fetchSalesChannels();
        }
    }, [autoFetch, fetchSalesChannels]);

    const deleteSalesChannel = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await salesChannelService.deleteSalesChannel(id);
            await fetchSalesChannels();
            return { success: true };
        } catch (err: any) {
            setError(err.message || 'Failed to delete sales channel');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [fetchSalesChannels]);

    return {
        salesChannels,
        pagination,
        loading,
        error,
        refresh: fetchSalesChannels,
        deleteSalesChannel
    };
};
