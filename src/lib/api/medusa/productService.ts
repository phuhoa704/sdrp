import { getVendorId } from '@/lib/utils';
import bridgeClient from '../bridgeClient';
import { Product, ProductOption, ProductVariant, ProductVariantUpdatePayload } from '@/types/product';
import axios from 'axios';
import { CommonResponse } from '@/types/common';
import { CustomResponse } from '@/types/custom-response';

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
            const vendorId = getVendorId()
            const res = await bridgeClient.post('/admin/products', { ...payload, additional_data: { vendor_id: vendorId } });
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

    /**
     * Get list of variants for a product
     * @param productId product id
     * @param query Query parameters
     */
    async getVariants(productId: string, query?: Record<string, unknown>): Promise<{ variants: ProductVariant[], count: number, offset: number, limit: number }> {
        try {
            const res = await bridgeClient.get(`/admin/products/${productId}/variants`, { params: query });
            return res.data as { variants: ProductVariant[], count: number, offset: number, limit: number };
        } catch (error: unknown) {
            console.error('Failed to fetch variants:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch variants'
            );
        }
    }

    /**
     * Get a single variant details
     * @param productId product id
     * @param variantId variant id
     * @param query Query parameters
     */
    async getVariant(productId: string, variantId: string, query?: Record<string, unknown>): Promise<{ variant: ProductVariant }> {
        try {
            const res = await bridgeClient.get(`/admin/products/${productId}/variants/${variantId}`, { params: query });
            return res.data as { variant: ProductVariant };
        } catch (error: unknown) {
            console.error(`Failed to fetch variant ${variantId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch variant'
            );
        }
    }

    /**
     * Batch manage variants (create, update, delete)
     * @param productId product id
     * @param payload batch payload
     */
    async batchVariants(productId: string, payload: { create?: any[], update?: any[], delete?: string[] }): Promise<{ variants: ProductVariant[] }> {
        try {
            const res = await bridgeClient.post(`/admin/products/${productId}/variants/batch`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to batch update variants for product ${productId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to batch update variants'
            );
        }
    }

    async updateVariant(productId: string, variantId: string, payload: ProductVariantUpdatePayload): Promise<{ variant: ProductVariant }> {
        try {
            const res = await bridgeClient.post(`/admin/products/${productId}/variants/${variantId}`, payload);
            return res.data as { variant: ProductVariant };
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
     * Update a product option
     * @param productId product id
     * @param optionId option id
     * @param payload update payload
     */
    async updateOption(productId: string, optionId: string, payload: { title: string; values?: string[] }): Promise<{ option: any }> {
        try {
            const res = await bridgeClient.post(`/admin/products/${productId}/options/${optionId}`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to update option ${optionId} for product ${productId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update product option'
            );
        }
    }

    /**
     * Create a product option
     * @param productId product id
     * @param payload creation payload { title: string }
     */
    async createOption(productId: string, payload: { title: string; values?: string[] }): Promise<{ option: any }> {
        try {
            const res = await bridgeClient.post(`/admin/products/${productId}/options`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to create option for product ${productId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create product option'
            );
        }
    }

    /**
     * Delete a product option
     * @param productId product id
     * @param optionId option id
     */
    async deleteOption(productId: string, optionId: string): Promise<{ id: string; object: string; deleted: boolean }> {
        try {
            const res = await bridgeClient.delete(`/admin/products/${productId}/options/${optionId}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to delete option ${optionId} for product ${productId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete product option'
            );
        }
    }

    async getListOptions(productId: string): Promise<CommonResponse & { product_options: ProductOption[] }> {
        try {
            const res = await bridgeClient.get(`/admin/products/${productId}/options`, { params: { fields: "*values" } });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to get options for product ${productId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to get product options'
            );
        }
    }

    async getCustomProductDetail(id: string): Promise<CustomResponse<Product>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.get(`/custom/admin/products/detail/${id}`, {
                headers: {
                    "x-api-vendor": vendorId
                }
            });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to get product ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to get product'
            );
        }
    }
}

export const productService = new ProductService();
