import { CustomGetResponse } from "@/types/custom-response";
import { Campaign } from "@/types/campaign";
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
}

export const campaignService = new CampaignService();
