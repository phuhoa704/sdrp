import { useCallback, useEffect, useMemo, useState } from "react";
import { priceListService } from "@/lib/api/medusa/priceListService";
import { PriceList } from "@/types/price";

export interface UsePriceListOptions {
    autoFetch?: boolean;
    q?: string;
    limit?: number;
    offset?: number;
}

export const usePriceList = (options: UsePriceListOptions = {}) => {
    const { autoFetch = true, q, limit, offset } = options;
    const [priceLists, setPriceLists] = useState<PriceList[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchPriceLists = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await priceListService.getPriceLists({ q, limit, offset });
            setPriceLists(response.price_lists);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchPriceLists();
        }
    }, [autoFetch, q, limit, offset]);

    const deletePriceList = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await priceListService.deletePriceList(id);
            await fetchPriceLists();
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    return {
        priceLists,
        loading,
        error,
        fetchPriceLists,
        deletePriceList,
    };
}

export const usePriceListById = (id: string, params?: Record<string, unknown>) => {
    const [priceList, setPriceList] = useState<PriceList | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Serialize params so object identity changes don't trigger re-fetches
    const paramKey = useMemo(() => JSON.stringify(params ?? null), [params]);
    const stableParams = useMemo(() => params,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [paramKey]
    );

    const fetchPriceList = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await priceListService.getPriceListById(id, stableParams);
            setPriceList(response);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [id, stableParams]);

    useEffect(() => {
        fetchPriceList();
    }, [fetchPriceList]);

    return {
        priceList,
        loading,
        error,
        fetchPriceList,
    };
}