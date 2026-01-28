import { medusa } from '../medusa';
import { Product } from '@/types/product';

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
        [key: string]: any;
    }): Promise<ProductListResponse> {
        try {
            const response = await medusa.admin.product.list(query);
            return response as ProductListResponse;
        } catch (error: any) {
            console.error('Failed to fetch Medusa products:', error);
            throw new Error(error.message || 'Failed to fetch products');
        }
    }

    /**
     * Get a single product by handle or ID
     * @param idOrHandle Handle or ID of the product
     */
    async getProduct(idOrHandle: string): Promise<{ product: Product }> {
        try {
            const response = await medusa.admin.product.retrieve(idOrHandle);
            return response as { product: Product };
        } catch (error: any) {
            console.error(`Failed to fetch Medusa product ${idOrHandle}:`, error);
            throw new Error(error.message || 'Failed to fetch product');
        }
    }
}

export const productService = new ProductService();
