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
    async getCategories(query?: Record<string, unknown>): Promise<CategoryListResponse> {
        try {
            const res = await bridgeClient.get('/store/product-categories', { params: query });
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
            const res = await bridgeClient.get(`/store/product-categories/${idOrHandle}`, { params: query });
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
}

export const categoryService = new CategoryService();
