import bridgeClient from '../bridgeClient';
import { ProductCategory } from '@/types/product';
import axios from 'axios';

/**
 * Medusa Category Service
 * Handles product category related interactions with Medusa Backend
 */

export interface CategoryListResponse {
    product_categories: ProductCategory[];
    count: number;
    offset: number;
    limit: number;
}

class CategoryService {
    /**
     * Get list of product categories from Medusa Store
     * @param query Query parameters for filtering and pagination
     */
    async getCategories(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<CategoryListResponse> {
        try {
            const res = await bridgeClient.get('/admin/product-categories', { params: query });
            return res.data as CategoryListResponse;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa categories:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch categories'
            );
        }
    }

    /**
     * Get a single product category by handle or ID
     * @param idOrHandle Handle or ID of the category
     */
    async getCategory(idOrHandle: string, query?: Record<string, unknown>): Promise<{ product_category: ProductCategory }> {
        try {
            const res = await bridgeClient.get(`/admin/product-categories/${idOrHandle}`, { params: query });
            return res.data as { product_category: ProductCategory };
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa category ${idOrHandle}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch category'
            );
        }
    }
    async createCategory(payload: any): Promise<{ product_category: ProductCategory }> {
        try {
            const res = await bridgeClient.post('/admin/product-categories', payload);
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to create Medusa category:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create category'
            );
        }
    }

    async updateCategory(id: string, payload: any): Promise<{ product_category: ProductCategory }> {
        try {
            const res = await bridgeClient.post(`/admin/product-categories/${id}`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to update Medusa category ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update category'
            );
        }
    }

    async deleteCategory(id: string): Promise<{ id: string; object: string; deleted: boolean }> {
        try {
            const res = await bridgeClient.delete(`/admin/product-categories/${id}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to delete Medusa category ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete category'
            );
        }
    }

    /**
     * Update products in a category (add and remove)
     * @param id Category ID
     * @param payload Object with add and remove product ID arrays
     */
    async updateProductsToCategory(id: string, payload: { add?: string[], remove?: string[] }): Promise<{ product_category: ProductCategory }> {
        try {
            const res = await bridgeClient.post(`/admin/product-categories/${id}/products`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to update products in category ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update products in category'
            );
        }
    }

    /**
     * Remove products from a category
     * @param id Category ID
     * @param productIds Array of product IDs to remove
     */
    async removeProductsFromCategory(id: string, productIds: string[]): Promise<{ product_category: ProductCategory }> {
        try {
            const res = await bridgeClient.delete(`/admin/product-categories/${id}/products`, {
                data: { product_ids: productIds }
            });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to remove products from category ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to remove products from category'
            );
        }
    }
}

export const categoryService = new CategoryService();
