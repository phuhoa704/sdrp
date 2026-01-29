import bridgeClient from '../bridgeClient';
import { Product } from '@/types/product';
import axios from 'axios';

/**
 * Medusa Product Service
 * Handles product-related interactions with Medusa Backend
 */

export interface ProductListResponse {
    products: Product[];
    count: number;
    offset: number;
    limit: number;
}

class ProductService {
    /**
     * Get list of products from Medusa Store
     * @param query Query parameters for filtering and pagination
     */
    async getProducts(query?: {
        q?: string;
        category_id?: string | string[];
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<ProductListResponse> {
        try {
            const res = await bridgeClient.get('/admin/products', { params: query });
            return res.data as ProductListResponse;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa products:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch products'
            );
        }
    }

    /**
     * Get a single product by handle or ID
     * @param idOrHandle Handle or ID of the product
     */
    async getProduct(idOrHandle: string, query?: Record<string, unknown>): Promise<{ product: Product }> {
        try {
            const res = await bridgeClient.get(`/admin/products/${idOrHandle}`, { params: query });
            return res.data as { product: Product };
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa product ${idOrHandle}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch product'
            );
        }
    }

    /**
     * Delete a product by ID
     * @param id ID of the product to delete
     */
    async deleteProduct(id: string): Promise<{ id: string, object: string, deleted: boolean }> {
        try {
            const res = await bridgeClient.delete(`/admin/products/${id}`);
            return res.data as { id: string, object: string, deleted: boolean };
        } catch (error: unknown) {
            console.error(`Failed to delete Medusa product ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete product'
            );
        }
    }

    /**
     * Create a new product
     * @param payload Product creation data
     */
    async createProduct(payload: Record<string, unknown>): Promise<{ product: Product }> {
        try {
            const res = await bridgeClient.post('/admin/products', payload);
            return res.data as { product: Product };
        } catch (error: unknown) {
            console.error('Failed to create Medusa product:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create product'
            );
        }
    }

    /**
     * Create a new product variant
     * @param productId ID of the product
     * @param payload Variant creation data
     */
    async createVariant(productId: string, payload: Record<string, unknown>): Promise<{ product: Product }> {
        try {
            const res = await bridgeClient.post(`/admin/products/${productId}/variants`, payload);
            return res.data as { product: Product };
        } catch (error: unknown) {
            console.error(`Failed to create variant for product ${productId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create variant'
            );
        }
    }

    /**
     * Update an existing product
     * @param id ID of the product to update
     * @param payload Product update data
     */
    async updateProduct(id: string, payload: Record<string, unknown>): Promise<{ product: Product }> {
        try {
            const res = await bridgeClient.post(`/admin/products/${id}`, payload);
            return res.data as { product: Product };
        } catch (error: unknown) {
            console.error(`Failed to update Medusa product ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update product'
            );
        }
    }
}

export const productService = new ProductService();
