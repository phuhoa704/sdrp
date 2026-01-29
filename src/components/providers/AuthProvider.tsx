'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSession } from '@/store/slices/authSlice';
import { setBridgeAuthToken } from '@/lib/api/bridgeClient';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        // Sync token with bridge client (used for Admin API calls)
        setBridgeAuthToken(token);

        // Session is handled via cookies in the browser.
        // If Redux says we are authenticated, we verify it with the server.
        if (isAuthenticated) {
            dispatch(fetchSession());
        }
    }, [dispatch, token, isAuthenticated]);

    return <>{children}</>;
}
