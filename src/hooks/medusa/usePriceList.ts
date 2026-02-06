import { useEffect, useState } from "react";
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