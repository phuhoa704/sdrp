import bridgeClient from "../bridgeClient";
import axios from "axios";
import { ProductType } from "@/types/product-type";

export interface ProductTypeListResponse {
    product_types: ProductType[];
    count: number;
    offset: number;
    limit: number;
}

class ProductTypeService {
    async getProductTypes(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<{ product_types: ProductType[]; count: number; limit: number; offset: number }> {
        try {
            const res = await bridgeClient.get('/admin/product-types', { params: query });
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa product types:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch product types'
            );
        }
    }

    async createProductType(data: { value: string; metadata?: Record<string, unknown> }): Promise<{ product_type: ProductType }> {
        try {
            const res = await bridgeClient.post('/admin/product-types', data);
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to create Medusa product type:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create product type'
            );
        }
    }

    async updateProductType(id: string, data: { value?: string; metadata?: Record<string, unknown> }): Promise<{ product_type: ProductType }> {
        try {
            const res = await bridgeClient.post(`/admin/product-types/${id}`, data);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to update Medusa product type ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update product type'
            );
        }
    }

    async deleteProductType(id: string): Promise<{ product_type: ProductType }> {
        try {
            const res = await bridgeClient.delete(`/admin/product-types/${id}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to delete Medusa product type ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete product type'
            );
        }
    }
}

export const productTypeService = new ProductTypeService();