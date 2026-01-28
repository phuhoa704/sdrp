'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHubSession } from '@/store/slices/authSlice';
import { hubAuthService } from '@/lib/api/hub/authService';

export function HubAuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        // Initialize auth service (restore token from localStorage)
        hubAuthService.initializeAuth();

        // If we have a token in localStorage, verify it with the server
        const token = localStorage.getItem('hub_auth_token');
        if (token) {
            dispatch(fetchHubSession());
        }
    }, [dispatch]);

    return <>{children}</>;
}
