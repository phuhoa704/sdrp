import bridgeClient from '../bridgeClient';
import { ProductTag } from '@/types/product';
import axios from 'axios';

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
        [key: string]: unknown;
    }): Promise<ProductTagListResponse> {
        try {
            const res = await bridgeClient.get('/admin/product-tags', { params: query });
            return res.data as ProductTagListResponse;
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
     * Get a single product tag (if supported/needed, medusa sdk might not have retrieve for tags directly)
     * For now, listing with filter is more common for tags.
     */
}

export const productTagService = new ProductTagService();
