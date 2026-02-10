import { getVendorId } from '@/lib/utils';
import bridgeClient from '../bridgeClient';
import { ApplicationMethodTargetType, GetRuleAttributeOptionsParams, GetRuleAttributeOptionsResponse, GetRuleValuesOptionsResponse, Promotion, PromotionRule, RuleType } from '@/types/promotion';
import axios from 'axios';
import { CustomGetResponse } from '@/types/custom-response';

/**
 * Medusa Promotion Service
 * Handles promotion related interactions with Medusa Backend (v2)
 */
interface PromotionData {
    promotion_id: string;
    promotion: Promotion;
}

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
    }): Promise<CustomGetResponse<PromotionData>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.get('/custom/admin/vendors/promotions', { params: query, headers: { 'x-api-vendor': vendorId } });
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

    async getPromotionRules(promotionId: string): Promise<{ rules: PromotionRule[] }> {
        try {
            const res = await bridgeClient.get(`/admin/promotions/${promotionId}/rules`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa promotion rules ${promotionId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch promotion rules'
            );
        }
    }

    async getPromotionTargetRules(promotionId: string): Promise<{ target_rules: PromotionRule[] }> {
        try {
            const res = await bridgeClient.get(`/admin/promotions/${promotionId}/target-rules`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa promotion target rules ${promotionId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch promotion target rules'
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


    async getAttributeOptions(ruleType: RuleType, params: GetRuleAttributeOptionsParams): Promise<GetRuleAttributeOptionsResponse> {
        try {
            const res = await bridgeClient.get(`/admin/promotions/rule-attribute-options/${ruleType}`, { params });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to get attribute options for rule type ${ruleType}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to get attribute options'
            );
        }
    }

    async getRuleValuesOptions(ruleType: RuleType, ruleAttributeId: string, params?: { application_method_target_type?: ApplicationMethodTargetType, limit?: number, offset?: number }): Promise<GetRuleValuesOptionsResponse> {
        try {
            const res = await bridgeClient.get(`/admin/promotions/rule-value-options/${ruleType}/${ruleAttributeId}`, { params });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to get rule values options for rule type ${ruleType} and rule attribute id ${ruleAttributeId}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to get rule values options'
            );
        }
    }
}

export const promotionService = new PromotionService();
