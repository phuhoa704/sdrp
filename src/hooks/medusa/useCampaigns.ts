import { useState, useCallback, useEffect } from "react";
import { campaignService } from "@/lib/api/medusa/campaignService";
import { Campaign } from "@/types/campaign";

export const useCampaigns = (query?: any) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryStr = JSON.stringify(query);

    const fetchCampaigns = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await campaignService.getCampaigns(query);
            setCampaigns(data.data.data.map((item: any) => item.campaign));
            setCount(data.data.pagination.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch campaigns');
        } finally {
            setLoading(false);
        }
    }, [queryStr]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    return {
        campaigns,
        count,
        loading,
        error,
        refresh: fetchCampaigns
    };
};