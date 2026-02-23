import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/lib/api/medusa/productService';
import { Product } from '@/types/product';

export interface UseProductsOptions {
    q?: string;
    id?: string | string[];
    category_id?: string | string[];
    sales_channel_id?: string | string[];
    tags?: string | string[];
    price_list_id?: string | string[];
    limit?: number;
    offset?: number;
    autoFetch?: boolean;
    fields?: string;
}

export const useProducts = (options: UseProductsOptions = {}) => {
    const { q, id, category_id, sales_channel_id, price_list_id, tags, limit = 10, offset = 0, autoFetch = true, fields } = options;
    const [products, setProducts] = useState<Product[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Memoize options to prevent unnecessary re-renders when the parent passes an object literal
    const memoOptions = JSON.stringify({ q, id, category_id, sales_channel_id, price_list_id, tags, limit, offset, fields });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await productService.getProducts({
                q,
                id,
                category_id,
                sales_channel_id,
                price_list_id,
                tags,
                limit,
                offset,
                fields: fields || "*categories,*sales_channels,-variants"
            });
            setProducts(data.products);
            setCount(data.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa products');
        } finally {
            setLoading(false);
        }
    }, [memoOptions]);

    useEffect(() => {
        if (autoFetch) {
            fetchProducts();
        }
    }, [autoFetch, fetchProducts]);

    const deleteProduct = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await productService.deleteProduct(id);
            await fetchProducts();
            return { success: true };
        } catch (err: any) {
            setError(err.message || 'Failed to delete product');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    return {
        products,
        count,
        loading,
        error,
        refresh: fetchProducts,
        deleteProduct
    };
};
