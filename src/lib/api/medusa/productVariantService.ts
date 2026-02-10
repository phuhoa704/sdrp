import { CustomResponse } from '@/types/custom-response';
import bridgeClient from '../bridgeClient';
import { Product } from '@/types/product';
import axios from 'axios';

/**
 * Medusa Product Variant Service
 * Handles interaction with product variants in Medusa Backend
 */
interface ProductByVariant {
    product_id: string;
    product: Product;
}
class ProductVariantService {
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
     * Update a product variant
     * @param productId ID of the product
     * @param variantId ID of the variant
     * @param payload Variant update data
     */
    async updateVariant(productId: string, variantId: string, payload: Record<string, unknown>): Promise<{ product: Product }> {
        try {
            const res = await bridgeClient.post(`/admin/products/${productId}/variants/${variantId}`, payload);
            return res.data as { product: Product };
        } catch (error: unknown) {
            console.error(`Failed to update variant ${variantId} for product ${productId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update variant'
            );
        }
    }

    /**
     * Delete a product variant
     * @param productId ID of the product
     * @param variantId ID of the variant to delete
     */
    async deleteVariant(productId: string, variantId: string): Promise<{ variant_id: string, object: string, deleted: boolean, product: Product }> {
        try {
            const res = await bridgeClient.delete(`/admin/products/${productId}/variants/${variantId}`);
            return res.data as { variant_id: string, object: string, deleted: boolean, product: Product };
        } catch (error: unknown) {
            console.error(`Failed to delete variant ${variantId} from product ${productId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete variant'
            );
        }
    }

    async getProductByVariantId(variantId: string): Promise<CustomResponse<ProductByVariant>> {
        try {
            const res = await bridgeClient.get<CustomResponse<ProductByVariant>>(`/custom/admin/products/variant/${variantId}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to get product by variant ID ${variantId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to get product by variant ID'
            );
        }
    }
}

export const productVariantService = new ProductVariantService();
