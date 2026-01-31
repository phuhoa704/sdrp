import bridgeClient from '../bridgeClient';
import { Promotion } from '@/types/promotion';
import axios from 'axios';

/**
 * Medusa Promotion Service
 * Handles promotion related interactions with Medusa Backend (v2)
 */

class PromotionService {
    /**
     * Get list of promotions from Medusa Backend
     * @param query Query parameters for filtering and pagination
     */
    async getPromotions(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<{ promotions: Promotion[]; count: number; limit: number; offset: number }> {
        try {
            const res = await bridgeClient.get('/admin/promotions', { params: query });
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa promotions:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch promotions'
            );
        }
    }

    /**
     * Get a single promotion by ID
     * @param id ID of the promotion
     */
    async getPromotion(id: string): Promise<{ promotion: Promotion }> {
        try {
            const res = await bridgeClient.get(`/admin/promotions/${id}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa promotion ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch promotion'
            );
        }
    }

    /**
     * Create a new promotion
     * @param payload Promotion creation data
     */
    async createPromotion(payload: any): Promise<{ promotion: Promotion }> {
        try {
            const res = await bridgeClient.post('/admin/promotions', payload);
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to create Medusa promotion:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create promotion'
            );
        }
    }

    /**
     * Update an existing promotion
     * @param id ID of the promotion to update
     * @param payload Promotion update data
     */
    async updatePromotion(id: string, payload: any): Promise<{ promotion: Promotion }> {
        try {
            const res = await bridgeClient.post(`/admin/promotions/${id}`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to update Medusa promotion ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update promotion'
            );
        }
    }

    /**
     * Delete a promotion by ID
     * @param id ID of the promotion to delete
     */
    async deletePromotion(id: string): Promise<{ id: string; object: string; deleted: boolean }> {
        try {
            const res = await bridgeClient.delete(`/admin/promotions/${id}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to delete Medusa promotion ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete promotion'
            );
        }
    }
}

export const promotionService = new PromotionService();
