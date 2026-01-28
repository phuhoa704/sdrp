
import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/lib/api/medusa/productService';
import { Product } from '@/types/product';

export const useProduct = (idOrHandle: string | null, autoFetch = true) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = useCallback(async () => {
        if (!idOrHandle) return;

        setLoading(true);
        setError(null);
        try {
            const data = await productService.getProduct(idOrHandle, {
                fields: "*categories,*sales_channels,*variants.prices"
            });
            setProduct(data.product);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa product');
        } finally {
            setLoading(false);
        }
    }, [idOrHandle]);

    useEffect(() => {
        if (autoFetch && idOrHandle) {
            fetchProduct();
        }
    }, [idOrHandle, autoFetch, fetchProduct]);

    return {
        product,
        loading,
        error,
        refresh: fetchProduct
    };
};
