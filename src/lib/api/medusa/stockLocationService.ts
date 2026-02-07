import { getVendorId } from '@/lib/utils';
import bridgeClient from '../bridgeClient';
import { StockLocation } from '@/types/stock';
import axios from 'axios';
import { CustomGetResponse } from '@/types/custom-response';

/**
 * Medusa Stock Location Service
 * Handles stock location related interactions with Medusa Backend (Admin domain)
 */

export interface StockLocationData {
    stock_location: StockLocation;
    stock_location_id: string;
}

export interface ManageSalesChannelsPayload {
    add: string[];
    remove: string[];
}

class StockLocationService {
    /**
     * Get list of stock locations from Medusa
     * @param query Query parameters for filtering and pagination
     */
    async getStockLocations(query?: Record<string, unknown>): Promise<CustomGetResponse<StockLocationData>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.get('/custom/admin/vendors/stock-location', { params: query, headers: { 'x-api-vendor': vendorId } });
            return res.data as CustomGetResponse<StockLocationData>;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa stock locations:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch stock locations'
            );
        }
    }

    /**
     * Get a single stock location by ID
     * @param id ID of the stock location
     */
    async getStockLocation(id: string): Promise<{ stock_location: StockLocation }> {
        try {
            const res = await bridgeClient.get(`/admin/stock-locations/${id}`, {
                params: {
                    fields: "name,*sales_channels,*address"
                }
            });
            return res.data as { stock_location: StockLocation };
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa stock location ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch stock location'
            );
        }
    }

    /**
     * Create a new stock location
     * @param data Data for creating the stock location
     */
    async createStockLocation(data: { name: string; address: Record<string, unknown> }): Promise<{ stock_location: StockLocation }> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.post('/custom/admin/vendors/stock-location', data, { headers: { 'x-api-vendor': vendorId } });
            return res.data as { stock_location: StockLocation };
        } catch (error: unknown) {
            console.error('Failed to create Medusa stock location:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create stock location'
            );
        }
    }

    /**
     * Update an existing stock location
     * @param id ID of the stock location to update
     * @param data Data for updating the stock location
     */
    async updateStockLocation(id: string, data: { name?: string; address_id?: string; address?: Record<string, unknown>; metadata?: Record<string, unknown> }): Promise<{ stock_location: StockLocation }> {
        try {
            const res = await bridgeClient.post(`/admin/stock-locations/${id}`, data);
            return res.data as { stock_location: StockLocation };
        } catch (error: unknown) {
            console.error(`Failed to update Medusa stock location ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update stock location'
            );
        }
    }

    /**
     * Delete a stock location
     * @param id ID of the stock location to delete
     */
    async deleteStockLocation(id: string): Promise<{ id: string; object: string; deleted: boolean }> {
        try {
            const res = await bridgeClient.delete(`/admin/stock-locations/${id}`);
            return res.data as { id: string; object: string; deleted: boolean };
        } catch (error: unknown) {
            console.error(`Failed to delete Medusa stock location ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete stock location'
            );
        }
    }

    async manageSalesChannels(stockLocationId: string, payload: ManageSalesChannelsPayload) {
        try {
            const res = await bridgeClient.post(`/admin/stock-locations/${stockLocationId}/sales-channels`, payload);
            return res.data as { stock_location: StockLocation };
        } catch (error: unknown) {
            console.error(`Failed to manage sales channels for Medusa stock location ${stockLocationId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to manage sales channels'
            );
        }
    }
}

export const stockLocationService = new StockLocationService();
