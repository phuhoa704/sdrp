import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '@/lib/api/medusa/categoryService';
import { ProductCategory } from '@/types/product';

/**
 * Hook to fetch and manage Medusa product categories
 * @param autoFetch Whether to fetch categories on mount
 */
export const useCategories = (autoFetch = true) => {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // By default, we might want to fetch only top-level categories or all of them
            // We can pass query parameters if needed
            const data = await categoryService.getCategories({
                include_descendants_tree: true // Common use case to show nested categories
            });
            setCategories(data.product_categories);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch Medusa categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchCategories();
        }
    }, [autoFetch, fetchCategories]);

    return {
        categories,
        loading,
        error,
        refresh: fetchCategories
    };
};
