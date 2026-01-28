import { useState, useEffect, useCallback } from 'react';
import { productService, BridgeProduct, BridgeProductResponse } from '@/lib/api/hub/productService';

export const useProducts = (autoFetch = true) => {
    const [products, setProducts] = useState<BridgeProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState<{ count: number; limit: number; offset: number } | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data: BridgeProductResponse = await productService.getProducts();
            setProducts(data.products);
            setMeta({
                count: data.count,
                limit: data.limit,
                offset: data.offset
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchProducts();
        }
    }, [autoFetch, fetchProducts]);

    return {
        products,
        loading,
        error,
        meta,
        refresh: fetchProducts
    };
};
