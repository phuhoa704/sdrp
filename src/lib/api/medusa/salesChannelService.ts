import { medusa } from '../medusa';
import { SalesChannel, SalesChannelListResponse } from '@/types/sales-channel';

/**
 * Medusa Sales Channel Service
 * Handles sales channel related interactions with Medusa Backend (Admin API)
 */
class SalesChannelService {
    /**
     * Get list of sales channels
     * @param query Query parameters for filtering and pagination
     */
    async getSalesChannels(query?: any): Promise<SalesChannelListResponse> {
        try {
            const response = await medusa.admin.salesChannel.list(query);
            return response as SalesChannelListResponse;
        } catch (error: any) {
            console.error('Failed to fetch Medusa sales channels:', error);
            throw new Error(error.message || 'Failed to fetch sales channels');
        }
    }

    /**
     * Get a single sales channel by ID
     * @param id ID of the sales channel
     */
    async getSalesChannel(id: string): Promise<{ sales_channel: SalesChannel }> {
        try {
            const response = await medusa.admin.salesChannel.retrieve(id);
            return response as { sales_channel: SalesChannel };
        } catch (error: any) {
            console.error(`Failed to fetch Medusa sales channel ${id}:`, error);
            throw new Error(error.message || 'Failed to fetch sales channel');
        }
    }

    /**
     * Create a new sales channel
     * @param data Sales channel data
     */
    async createSalesChannel(data: any): Promise<{ sales_channel: SalesChannel }> {
        try {
            const response = await medusa.admin.salesChannel.create(data);
            return response as { sales_channel: SalesChannel };
        } catch (error: any) {
            console.error('Failed to create Medusa sales channel:', error);
            throw new Error(error.message || 'Failed to create sales channel');
        }
    }

    /**
     * Update an existing sales channel
     * @param id ID of the sales channel
     * @param data Update data
     */
    async updateSalesChannel(id: string, data: any): Promise<{ sales_channel: SalesChannel }> {
        try {
            const response = await medusa.admin.salesChannel.update(id, data);
            return response as { sales_channel: SalesChannel };
        } catch (error: any) {
            console.error(`Failed to update Medusa sales channel ${id}:`, error);
            throw new Error(error.message || 'Failed to update sales channel');
        }
    }

    /**
     * Delete a sales channel
     * @param id ID of the sales channel
     */
    async deleteSalesChannel(id: string): Promise<{ id: string, object: string, deleted: boolean }> {
        try {
            const response = await medusa.admin.salesChannel.delete(id);
            return response as { id: string, object: string, deleted: boolean };
        } catch (error: any) {
            console.error(`Failed to delete Medusa sales channel ${id}:`, error);
            throw new Error(error.message || 'Failed to delete sales channel');
        }
    }
}

export const salesChannelService = new SalesChannelService();
