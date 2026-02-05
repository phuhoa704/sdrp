import bridgeClient from '../bridgeClient';
import { ProductCollection } from '@/types/product';
import axios from 'axios';

/**
 * Medusa Collection Service
 * Handles product collection related interactions with Medusa Backend
 */

export interface CollectionListResponse {
    collections: ProductCollection[];
    count: number;
    offset: number;
    limit: number;
}

class CollectionService {
    /**
     * Get list of product collections from Medusa Store
     * @param query Query parameters for filtering and pagination
     */
    async getCollections(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<CollectionListResponse> {
        try {
            const res = await bridgeClient.get('/admin/collections', { params: query });
            return res.data as CollectionListResponse;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa collections:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch collections'
            );
        }
    }

    /**
     * Get a single product collection by ID
     * @param id ID of the collection
     */
    async getCollection(id: string, query?: Record<string, unknown>): Promise<{ collection: ProductCollection }> {
        try {
            const res = await bridgeClient.get(`/admin/collections/${id}`, { params: query });
            return res.data as { collection: ProductCollection };
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa collection ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch collection'
            );
        }
    }

    /**
     * Create a new product collection
     * @param payload Collection creation data
     */
    async createCollection(payload: any): Promise<{ collection: ProductCollection }> {
        try {
            const res = await bridgeClient.post('/admin/collections', payload);
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to create Medusa collection:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create collection'
            );
        }
    }

    /**
     * Update an existing product collection
     * @param id ID of the collection to update
     * @param payload Collection update data
     */
    async updateCollection(id: string, payload: any): Promise<{ collection: ProductCollection }> {
        try {
            const res = await bridgeClient.post(`/admin/collections/${id}`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to update Medusa collection ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update collection'
            );
        }
    }

    /**
     * Delete a product collection by ID
     * @param id ID of the collection to delete
     */
    async deleteCollection(id: string): Promise<{ id: string; object: string; deleted: boolean }> {
        try {
            const res = await bridgeClient.delete(`/admin/collections/${id}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to delete Medusa collection ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete collection'
            );
        }
    }

    /**
     * Add products to a collection
     * @param id Collection ID
     * @param productIds Array of product IDs to add
     */
    async updateProductsToCollection(id: string, payload: { add?: string[], remove?: string[] }): Promise<{ collection: ProductCollection }> {
        try {
            const res = await bridgeClient.post(`/admin/collections/${id}/products`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to update products to collection ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update products to collection'
            );
        }
    }

    /**
     * Remove products from a collection
     * @param id Collection ID
     * @param productIds Array of product IDs to remove
     */
    async removeProductsFromCollection(id: string, productIds: string[]): Promise<{ collection: ProductCollection }> {
        try {
            const res = await bridgeClient.delete(`/admin/collections/${id}/products`, {
                data: { product_ids: productIds }
            });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to remove products from collection ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to remove products from collection'
            );
        }
    }
}

export const collectionService = new CollectionService();
