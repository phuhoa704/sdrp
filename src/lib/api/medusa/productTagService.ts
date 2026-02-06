import { getVendorId } from '@/lib/utils';
import bridgeClient from '../bridgeClient';
import { ProductTag } from '@/types/product';
import axios from 'axios';
import { CustomGetResponse, CustomResponse } from '@/types/custom-response';

/**
 * Medusa Product Tag Service
 * Handles product tag related interactions with Medusa Backend
 */

export interface ProductTagData {
    product_tag: ProductTag;
    product_tag_id: string;
}

class ProductTagService {
    /**
     * Get list of product tags from Medusa Backend
     * @param query Query parameters for filtering and pagination
     */
    async getProductTags(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<CustomGetResponse<ProductTagData>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.get('/custom/admin/vendors/product-tags', { params: query, headers: { 'x-api-vendor': vendorId } });
            return res.data as CustomGetResponse<ProductTagData>;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa product tags:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch product tags'
            );
        }
    }

    /**
     * Create a new product tag
     * @param data Product tag data
     */
    async createProductTag(data: { value: string }): Promise<CustomResponse<ProductTagData>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.post('/custom/admin/vendors/product-tags', data, { headers: { 'x-api-vendor': vendorId } });
            return res.data as CustomResponse<ProductTagData>;
        } catch (error: unknown) {
            console.error('Failed to create Medusa product tag:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create product tag'
            );
        }
    }

    /**
     * Update a product tag
     * @param id Product tag ID
     * @param data Product tag data
     */
    async updateProductTag(id: string, data: { value: string }): Promise<CustomResponse<ProductTagData>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.put(`/custom/admin/vendors/product-tags/${id}`, data, { headers: { 'x-api-vendor': vendorId } });
            return res.data as CustomResponse<ProductTagData>;
        } catch (error: unknown) {
            console.error('Failed to update Medusa product tag:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update product tag'
            );
        }
    }

    /**
     * Delete a product tag
     * @param id Product tag ID
     */
    async deleteProductTag(id: string): Promise<CustomResponse<ProductTagData>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.delete(`/custom/admin/vendors/product-tags/${id}`, { headers: { 'x-api-vendor': vendorId } });
            return res.data as CustomResponse<ProductTagData>;
        } catch (error: unknown) {
            console.error('Failed to delete Medusa product tag:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete product tag'
            );
        }
    }

    /**
     * Get a single product tag (if supported/needed, medusa sdk might not have retrieve for tags directly)
     * For now, listing with filter is more common for tags.
     */
}

export const productTagService = new ProductTagService();
