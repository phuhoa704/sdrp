import { useState, useCallback, useEffect } from "react";
import { booksService } from "@/lib/api/medusa/booksService";
import { StockUp, StockUpQuery } from "@/types/stock-up";

export const useBooks = (query?: StockUpQuery) => {
    const [books, setBooks] = useState<StockUp[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryStr = JSON.stringify(query);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await booksService.getStockUps(query);
            setBooks(data.data.data);
            setCount(data.data.pagination.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch books');
        } finally {
            setLoading(false);
        }
    }, [queryStr]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return {
        books,
        count,
        loading,
        error,
        refresh: fetchBooks
    };
};