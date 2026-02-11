import { CustomGetResponse } from "@/types/custom-response";
import { Campaign, CreateCampaignPayload, ManagePromotionsPayload, UpdateCampaignPayload } from "@/types/campaign";
import { getVendorId } from "@/lib/utils";
import bridgeClient from "../bridgeClient";
import axios from "axios";

interface CampaignData {
    campaign_id: string;
    campaign: Campaign;
}

class CampaignService {
    /**
     * Get list of campaigns from Medusa Backend
     * @param query - Query parameters for filtering and pagination
     * @returns Promise with list of campaigns and pagination info
     */
    async getCampaigns(query?: any): Promise<CustomGetResponse<CampaignData>> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.get('/custom/admin/vendors/campaigns', { params: query, headers: { 'x-api-vendor': vendorId } });
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa campaigns:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch campaigns');
            }
            throw new Error('Failed to fetch campaigns');
        }
    }

    /**
     * Create a new campaign
     * @param payload Campaign creation data
     */
    async createCampaign(payload: CreateCampaignPayload): Promise<{ campaign: Campaign }> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.post('/admin/campaigns', { ...payload, additional_data: { vendor_id: vendorId } });
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to create Medusa campaign:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to create campaign');
            }
            throw new Error('Failed to create campaign');
        }
    }

    async updateCampaign(id: string, payload: UpdateCampaignPayload): Promise<{ campaign: Campaign }> {
        try {
            const vendorId = getVendorId();
            const res = await bridgeClient.put(`/admin/campaigns/${id}`, { ...payload, additional_data: { vendor_id: vendorId } });
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to update Medusa campaign:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to update campaign');
            }
            throw new Error('Failed to update campaign');
        }
    }

    async deleteCampaign(id: string): Promise<{ campaign: Campaign }> {
        try {
            const res = await bridgeClient.delete(`/admin/campaigns/${id}`);
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to delete Medusa campaign:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to delete campaign');
            }
            throw new Error('Failed to delete campaign');
        }
    }

    async managePromotions(id: string, payload: ManagePromotionsPayload): Promise<{ campaign: Campaign }> {
        try {
            const res = await bridgeClient.post(`/admin/campaigns/${id}/promotions`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to manage Medusa campaign promotions:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to manage campaign promotions');
            }
            throw new Error('Failed to manage campaign promotions');
        }
    }
}

export const campaignService = new CampaignService();
