import { medusa } from '../medusa';
import { Product, ProductVariant } from '@/types/product';

/**
 * Medusa Product Variant Service
 * Handles interaction with product variants in Medusa Backend
 */
class ProductVariantService {
    /**
     * Create a new product variant
     * @param productId ID of the product
     * @param payload Variant creation data
     */
    async createVariant(productId: string, payload: any): Promise<{ product: Product }> {
        try {
            const response = await medusa.admin.product.createVariant(productId, payload);
            return response as { product: Product };
        } catch (error: any) {
            console.error(`Failed to create variant for product ${productId}:`, error);
            throw new Error(error.message || 'Failed to create variant');
        }
    }

    /**
     * Update a product variant
     * @param productId ID of the product
     * @param variantId ID of the variant
     * @param payload Variant update data
     */
    async updateVariant(productId: string, variantId: string, payload: any): Promise<{ product: Product }> {
        try {
            const response = await medusa.admin.product.updateVariant(productId, variantId, payload);
            return response as { product: Product };
        } catch (error: any) {
            console.error(`Failed to update variant ${variantId} for product ${productId}:`, error);
            throw new Error(error.message || 'Failed to update variant');
        }
    }

    /**
     * Delete a product variant
     * @param productId ID of the product
     * @param variantId ID of the variant to delete
     */
    async deleteVariant(productId: string, variantId: string): Promise<{ variant_id: string, object: string, deleted: boolean, product: Product }> {
        try {
            const response = await medusa.admin.product.deleteVariant(productId, variantId);
            return response as { variant_id: string, object: string, deleted: boolean, product: Product };
        } catch (error: any) {
            console.error(`Failed to delete variant ${variantId} from product ${productId}:`, error);
            throw new Error(error.message || 'Failed to delete variant');
        }
    }
}

export const productVariantService = new ProductVariantService();
