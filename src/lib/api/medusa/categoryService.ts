import { medusa } from '../medusa';
import { ProductCategory } from '@/types/product';

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
    async getCategories(query?: any): Promise<CategoryListResponse> {
        try {
            const response = await medusa.store.category.list(query);
            return response as CategoryListResponse;
        } catch (error: any) {
            console.error('Failed to fetch Medusa categories:', error);
            throw new Error(error.message || 'Failed to fetch categories');
        }
    }

    /**
     * Get a single product category by handle or ID
     * @param idOrHandle Handle or ID of the category
     */
    async getCategory(idOrHandle: string, query?: any): Promise<{ product_category: ProductCategory }> {
        try {
            const response = await medusa.store.category.retrieve(idOrHandle, query);
            return response as { product_category: ProductCategory };
        } catch (error: any) {
            console.error(`Failed to fetch Medusa category ${idOrHandle}:`, error);
            throw new Error(error.message || 'Failed to fetch category');
        }
    }
}

export const categoryService = new CategoryService();
