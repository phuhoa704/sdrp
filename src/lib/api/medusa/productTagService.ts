import { medusa } from '../medusa';
import { ProductTag } from '@/types/product';

/**
 * Medusa Product Tag Service
 * Handles product tag related interactions with Medusa Backend
 */

export interface ProductTagListResponse {
    product_tags: ProductTag[];
    count: number;
    offset: number;
    limit: number;
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
        [key: string]: any;
    }): Promise<ProductTagListResponse> {
        try {
            // Note: In Medusa Admin JS SDK, product tags are under admin.productTag
            const response = await medusa.admin.productTag.list(query);
            return response as ProductTagListResponse;
        } catch (error: any) {
            console.error('Failed to fetch Medusa product tags:', error);
            throw new Error(error.message || 'Failed to fetch product tags');
        }
    }

    /**
     * Get a single product tag (if supported/needed, medusa sdk might not have retrieve for tags directly)
     * For now, listing with filter is more common for tags.
     */
}

export const productTagService = new ProductTagService();
