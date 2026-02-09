import { getVendorId } from "@/lib/utils";
import { CustomGetResponse, CustomPostResponse } from "@/types/custom-response";
import { StockUp, StockUpCreate, StockUpCreateResponse, StockUpQuery } from "@/types/stock-up";
import bridgeClient from "../bridgeClient";
import axios from "axios";

class BooksService {
    async getStockUps(query?: StockUpQuery): Promise<CustomGetResponse<StockUp>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.get("/custom/inventory/goods-receipt", { params: query, headers: { 'x-api-vendor': vendorId } })
            return res.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch stock up');
            }
            throw new Error('Failed to fetch stock up');
        }
    }

    async getStockupById(id: string): Promise<CustomGetResponse<StockUp>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.get(`/custom/inventory/goods-receipt/${id}`, { headers: { 'x-api-vendor': vendorId } })
            return res.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch stock up');
            }
            throw new Error('Failed to fetch stock up');
        }
    }

    async createStockup(data: StockUpCreate): Promise<CustomPostResponse<StockUpCreateResponse>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.post("/custom/inventory/goods-receipt", data, { headers: { 'x-api-vendor': vendorId } })
            return res.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create stock up');
            }
            throw new Error('Failed to create stock up');
        }
    }
}

export const booksService = new BooksService();