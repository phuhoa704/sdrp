import { medusa } from '../medusa';
import { StockLocation } from '@/types/stock';

/**
 * Medusa Stock Location Service
 * Handles stock location related interactions with Medusa Backend (Admin domain)
 */

export interface StockLocationListResponse {
    stock_locations: StockLocation[];
    count: number;
    offset: number;
    limit: number;
}

class StockLocationService {
    /**
     * Get list of stock locations from Medusa
     * @param query Query parameters for filtering and pagination
     */
    async getStockLocations(query?: any): Promise<StockLocationListResponse> {
        try {
            const response = await medusa.admin.stockLocation.list(query);
            return response as StockLocationListResponse;
        } catch (error: any) {
            console.error('Failed to fetch Medusa stock locations:', error);
            throw new Error(error.message || 'Failed to fetch stock locations');
        }
    }

    /**
     * Get a single stock location by ID
     * @param id ID of the stock location
     */
    async getStockLocation(id: string): Promise<{ stock_location: StockLocation }> {
        try {
            const response = await medusa.admin.stockLocation.retrieve(id);
            return response as { stock_location: StockLocation };
        } catch (error: any) {
            console.error(`Failed to fetch Medusa stock location ${id}:`, error);
            throw new Error(error.message || 'Failed to fetch stock location');
        }
    }

    /**
     * Create a new stock location
     * @param data Data for creating the stock location
     */
    async createStockLocation(data: { name: string; address_id?: string; metadata?: Record<string, any> }): Promise<{ stock_location: StockLocation }> {
        try {
            const response = await medusa.admin.stockLocation.create(data);
            return response as { stock_location: StockLocation };
        } catch (error: any) {
            console.error('Failed to create Medusa stock location:', error);
            throw new Error(error.message || 'Failed to create stock location');
        }
    }

    /**
     * Update an existing stock location
     * @param id ID of the stock location to update
     * @param data Data for updating the stock location
     */
    async updateStockLocation(id: string, data: { name?: string; address_id?: string; metadata?: Record<string, any> }): Promise<{ stock_location: StockLocation }> {
        try {
            const response = await medusa.admin.stockLocation.update(id, data);
            return response as { stock_location: StockLocation };
        } catch (error: any) {
            console.error(`Failed to update Medusa stock location ${id}:`, error);
            throw new Error(error.message || 'Failed to update stock location');
        }
    }

    /**
     * Delete a stock location
     * @param id ID of the stock location to delete
     */
    async deleteStockLocation(id: string): Promise<{ id: string; object: string; deleted: boolean }> {
        try {
            const response = await medusa.admin.stockLocation.delete(id);
            return response as { id: string; object: string; deleted: boolean };
        } catch (error: any) {
            console.error(`Failed to delete Medusa stock location ${id}:`, error);
            throw new Error(error.message || 'Failed to delete stock location');
        }
    }
}

export const stockLocationService = new StockLocationService();
