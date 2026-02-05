import { productTypeService } from "@/lib/api/medusa/productTypeService";
import { ProductType } from "@/types/product-type";
import { useEffect, useState, useCallback } from "react";

export interface UseProductTypeProps {
    autoFetch?: boolean;
    q?: string;
    limit?: number;
    offset?: number;
    [key: string]: unknown;
}

export const useProductType = (options: UseProductTypeProps) => {
    const { autoFetch = true, q, limit, offset } = options;
    const [productTypes, setProductTypes] = useState<ProductType[]>([])
    const [count, setCount] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProductTypes = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await productTypeService.getProductTypes(options)
            setProductTypes(data.product_types)
            setCount(data.count)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa product types')
        } finally {
            setLoading(false)
        }
    }, [JSON.stringify(options)]);

    useEffect(() => {
        if (autoFetch) {
            fetchProductTypes();
        }
    }, [autoFetch, fetchProductTypes]);

    return {
        productTypes,
        count,
        loading,
        error,
        refresh: fetchProductTypes
    };
}