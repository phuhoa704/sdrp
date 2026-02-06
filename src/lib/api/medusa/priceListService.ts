import { PriceList } from "@/types/price";
import bridgeClient from "../bridgeClient";

interface PriceListResponse {
    limit: number;
    offset: number;
    count: number;
    price_lists: PriceList[];
}

class PriceListService {
    async getPriceLists(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<PriceListResponse> {
        try {
            const response = await bridgeClient.get<PriceListResponse>('/admin/price-lists', { params: query });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch price lists:', error);
            throw error;
        }
    }

    async getPriceListById(id: string): Promise<PriceList> {
        try {
            const response = await bridgeClient.get<PriceList>(`/admin/price-lists/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch price list:', error);
            throw error;
        }
    }

    async createPriceList(data: any): Promise<PriceList> {
        try {
            const response = await bridgeClient.post<PriceList>('/admin/price-lists', data);
            return response.data;
        } catch (error) {
            console.error('Failed to create price list:', error);
            throw error;
        }
    }

    async updatePriceList(id: string, data: any): Promise<PriceList> {
        try {
            const response = await bridgeClient.put<PriceList>(`/admin/price-lists/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update price list:', error);
            throw error;
        }
    }

    async deletePriceList(id: string): Promise<void> {
        try {
            await bridgeClient.delete(`/admin/price-lists/${id}`);
        } catch (error) {
            console.error('Failed to delete price list:', error);
            throw error;
        }
    }

    async managePrices(priceListId: string, data: any): Promise<PriceList> {
        try {
            const response = await bridgeClient.post<PriceList>(`/admin/price-lists/${priceListId}/prices/batch`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to manage price list items:', error);
            throw error;
        }
    }
}

export const priceListService = new PriceListService();