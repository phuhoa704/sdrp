import { useState, useCallback, useEffect } from "react";
import { promotionService } from "@/lib/api/medusa/promotionService";
import { GetRuleAttributeOptionsParams, RuleAttributeOption, RuleType } from "@/types/promotion";

export const useRuleAttrOptions = (ruleType: RuleType, params: GetRuleAttributeOptionsParams) => {
    const [options, setOptions] = useState<RuleAttributeOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryStr = JSON.stringify(params);

    const fetchOptions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await promotionService.getAttributeOptions(ruleType, params);
            setOptions(data.attributes);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch options');
        } finally {
            setLoading(false);
        }
    }, [queryStr]);

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    return {
        options,
        loading,
        error,
        refresh: fetchOptions
    };
}