'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStockLocations } from '@/store/slices/stockSlice';

/**
 * StockProvider handles the initialization and synchronization 
 * of global stock-related data (locations, inventory levels, etc.)
 */
export function StockProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const locations = useAppSelector((state) => state.stock.locations);

    useEffect(() => {
        // Fetch locations only if authenticated and not already loaded
        if (isAuthenticated && locations.length === 0) {
            dispatch(fetchStockLocations());
        }
    }, [dispatch, isAuthenticated, locations.length]);

    return <>{children}</>;
}
