'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';

function ThemeWatcher() {
    const isDarkMode = useAppSelector((state: RootState) => state.ui.isDarkMode);
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);
    return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef(store);
    const persistorRef = useRef(persistor);

    return (
        <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={persistorRef.current}>
                <ThemeWatcher />
                {children}
            </PersistGate>
        </Provider>
    );
}
