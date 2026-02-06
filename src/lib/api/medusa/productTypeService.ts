import bridgeClient from "../bridgeClient";
import axios from "axios";
import { ProductType } from "@/types/product-type";
import { getVendorId } from "@/lib/utils";
import { CustomGetResponse, CustomResponse } from "@/types/custom-response";

export interface ProductTypeData {
    product_type: ProductType;
    product_type_id: string;
}

export interface ProductTypeListResponse extends CustomGetResponse<ProductTypeData> {
}

class ProductTypeService {
    async getProductTypes(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<ProductTypeListResponse> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.get('/custom/admin/vendors/product-types', { params: query, headers: { 'x-api-vendor': vendorId } });
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

    async createProductType(data: { value: string; metadata?: Record<string, unknown> }): Promise<CustomResponse<ProductType>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.post('/custom/admin/vendors/product-types', data, { headers: { 'x-api-vendor': vendorId } });
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