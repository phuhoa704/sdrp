import bridgeClient from '../bridgeClient';
import { SalesChannel, SalesChannelListResponse } from '@/types/sales-channel';
import axios from 'axios';

/**
 * Medusa Sales Channel Service
 * Handles sales channel related interactions with Medusa Backend (Admin API)
 */
class SalesChannelService {
    /**
     * Get list of sales channels
     * @param query Query parameters for filtering and pagination
     */
    async getSalesChannels(query?: Record<string, unknown>): Promise<SalesChannelListResponse> {
        try {
            const res = await bridgeClient.get('/admin/sales-channels', { params: query });
            return res.data as SalesChannelListResponse;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa sales channels:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch sales channels'
            );
        }
    }

    /**
     * Get a single sales channel by ID
     * @param id ID of the sales channel
     */
    async getSalesChannel(id: string): Promise<{ sales_channel: SalesChannel }> {
        try {
            const res = await bridgeClient.get(`/admin/sales-channels/${id}`);
            return res.data as { sales_channel: SalesChannel };
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa sales channel ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch sales channel'
            );
        }
    }

    /**
     * Create a new sales channel
     * @param data Sales channel data
     */
    async createSalesChannel(data: Record<string, unknown>): Promise<{ sales_channel: SalesChannel }> {
        try {
            const res = await bridgeClient.post('/admin/sales-channels', data);
            return res.data as { sales_channel: SalesChannel };
        } catch (error: unknown) {
            console.error('Failed to create Medusa sales channel:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create sales channel'
            );
        }
    }

    /**
     * Update an existing sales channel
     * @param id ID of the sales channel
     * @param data Update data
     */
    async updateSalesChannel(id: string, data: Record<string, unknown>): Promise<{ sales_channel: SalesChannel }> {
        try {
            const res = await bridgeClient.post(`/admin/sales-channels/${id}`, data);
            return res.data as { sales_channel: SalesChannel };
        } catch (error: unknown) {
            console.error(`Failed to update Medusa sales channel ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update sales channel'
            );
        }
    }

    /**
     * Delete a sales channel
     * @param id ID of the sales channel
     */
    async deleteSalesChannel(id: string): Promise<{ id: string, object: string, deleted: boolean }> {
        try {
            const res = await bridgeClient.delete(`/admin/sales-channels/${id}`);
            return res.data as { id: string, object: string, deleted: boolean };
        } catch (error: unknown) {
            console.error(`Failed to delete Medusa sales channel ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete sales channel'
            );
        }
    }
}

export const salesChannelService = new SalesChannelService();
