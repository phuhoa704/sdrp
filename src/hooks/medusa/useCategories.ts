import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '@/lib/api/medusa/categoryService';
import { ProductCategory } from '@/types/product';

export interface UseCategoriesOptions {
    autoFetch?: boolean;
    q?: string;
    limit?: number;
    offset?: number;
}

export const useCategories = (options: UseCategoriesOptions = {}) => {
    const { autoFetch = true, q, limit, offset } = options;
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await categoryService.getCategories({
                include_descendants_tree: true,
                q,
                limit,
                offset
            });
            setCategories(data.data.data.map(item => item.product_category));
            setCount(data.data.pagination.total);
        } catch (err: any) {
            console.log("error", err)
            setError(err.message || 'Failed to fetch Medusa categories');
        } finally {
            setLoading(false);
        }
    }, [q, limit, offset]);

    useEffect(() => {
        if (autoFetch) {
            fetchCategories();
        }
    }, [autoFetch, fetchCategories, q, limit, offset]);

    return {
        categories,
        count,
        loading,
        error,
        refresh: fetchCategories
    };
};
