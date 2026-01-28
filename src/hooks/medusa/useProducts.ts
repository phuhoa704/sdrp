import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/lib/api/medusa/productService';
import { Product } from '@/types/product';

export interface UseProductsOptions {
    q?: string;
    category_id?: string | string[];
    sales_channel_id?: string | string[];
    limit?: number;
    offset?: number;
    autoFetch?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
    const { q, category_id, sales_channel_id, limit = 10, offset = 0, autoFetch = true } = options;
    const [products, setProducts] = useState<Product[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await productService.getProducts({
                q,
                category_id,
                sales_channel_id,
                limit,
                offset,
                fields: "*categories,*sales_channels,*variants.prices"
            });
            setProducts(data.products);
            setCount(data.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa products');
        } finally {
            setLoading(false);
        }
    }, [q, category_id, sales_channel_id, limit, offset]);

    useEffect(() => {
        if (autoFetch) {
            fetchProducts();
        }
    }, [autoFetch, fetchProducts, q, category_id, sales_channel_id, limit, offset]);

    return {
        products,
        count,
        loading,
        error,
        refresh: fetchProducts
    };
};
