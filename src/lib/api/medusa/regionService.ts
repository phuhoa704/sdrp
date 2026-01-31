import bridgeClient from '../bridgeClient';
import { Region, RegionListResponse } from '@/types/region';
import axios from 'axios';

/**
 * Medusa Region Service
 * Handles region related interactions with Medusa Backend
 */

class RegionService {
    /**
     * Get list of regions from Medusa Backend
     * @param query Query parameters for filtering and pagination
     */
    async getRegions(query?: {
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<RegionListResponse> {
        try {
            const res = await bridgeClient.get('/admin/regions', { params: query });
            return res.data as RegionListResponse;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa regions:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch regions'
            );
        }
    }

    /**
     * Get a single region by ID
     * @param id ID of the region
     */
    async getRegion(id: string): Promise<{ region: Region }> {
        try {
            const res = await bridgeClient.get(`/admin/regions/${id}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa region ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch region'
            );
        }
    }
}

export const regionService = new RegionService();
