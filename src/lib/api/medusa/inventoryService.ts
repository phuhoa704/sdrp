import bridgeClient from '../bridgeClient';
import axios from 'axios';
import { Product, ProductVariant } from '@/types/product';

export interface StockLocation {
    id: string;
    name: string;
}

export interface InventoryLevel {
    id: string;
    location_id: string;
    available_quantity: number;
    stocked_quantity: number;
    reserved_quantity: number;
    incoming_quantity: number;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
    stock_locations?: StockLocation[];
}

export interface InventoryItemVariant extends ProductVariant {
    product?: Product;
}

export interface InventoryItem {
    id: string;
    sku: string | null;
    title: string | null;
    description: string | null;
    thumbnail: string | null;
    origin_country: string | null;
    hs_code: string | null;
    requires_shipping: boolean;
    mid_code: string | null;
    material: string | null;
    weight: number | null;
    length: number | null;
    height: number | null;
    width: number | null;
    metadata: Record<string, any> | null;
    reserved_quantity: number;
    stocked_quantity: number;
    created_at: string;
    updated_at: string;
    location_levels: InventoryLevel[];
    variants: InventoryItemVariant[];
}

export interface InventoryItemResponse {
    inventory_item: InventoryItem;
}

class InventoryService {
    /**
     * Get inventory item details
     * @param id Inventory Item ID
     * @param query Query parameters (fields, expand, etc.)
     */
    async getInventoryItem(id: string, query?: Record<string, unknown>): Promise<InventoryItemResponse> {
        try {
            const res = await bridgeClient.get(`/admin/inventory-items/${id}`, { params: query });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch inventory item ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch inventory item'
            );
        }
    }

    /**
     * Get inventory levels for an inventory item
     * @param inventoryItemId Inventory Item ID
     * @param query Query parameters
     */
    async getInventoryLevels(inventoryItemId: string, query?: Record<string, unknown>): Promise<{
        inventory_levels: InventoryLevel[];
        count: number;
        offset: number;
        limit: number;
    }> {
        try {
            const res = await bridgeClient.get(`/admin/inventory-items/${inventoryItemId}/location-levels`, { params: query });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch inventory levels for item ${inventoryItemId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch inventory levels'
            );
        }
    }

    /**
     * Create location level (Assign inventory item to a location)
     */
    async createInventoryLevel(inventoryItemId: string, payload: { location_id: string; stocked_quantity?: number; incoming_quantity?: number }): Promise<{ inventory_level: InventoryLevel }> {
        try {
            const res = await bridgeClient.post(`/admin/inventory-items/${inventoryItemId}/location-levels`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to create inventory level for item ${inventoryItemId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create inventory level'
            );
        }
    }

    /**
     * Delete location level (Remove inventory item from a location)
     */
    async deleteInventoryLevel(inventoryItemId: string, locationId: string): Promise<void> {
        try {
            await bridgeClient.delete(`/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`);
        } catch (error: unknown) {
            console.error(`Failed to delete inventory level for item ${inventoryItemId} at location ${locationId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete inventory level'
            );
        }
    }

    /**
     * Batch update location levels
     * @param inventoryItemId 
     * @param payload { create: { location_id: string }[], delete: string[] }
     */
    async batchInventoryLevels(inventoryItemId: string, payload: { create?: { location_id: string }[], delete?: string[] }): Promise<{ inventory_item: InventoryItem }> {
        try {
            const res = await bridgeClient.post(`/admin/inventory-items/${inventoryItemId}/location-levels/batch`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to batch update inventory levels for item ${inventoryItemId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to batch update inventory levels'
            );
        }
    }

    /**
     * Update location level (Update stock quantity)
     */
    async updateInventoryLevel(inventoryItemId: string, locationId: string, payload: { stocked_quantity?: number; incoming_quantity?: number }): Promise<{ inventory_level: InventoryLevel }> {
        try {
            const res = await bridgeClient.post(`/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to update inventory level for item ${inventoryItemId} at location ${locationId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update inventory level'
            );
        }
    }
}

export const inventoryService = new InventoryService();
