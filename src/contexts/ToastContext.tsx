'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const showToast = useCallback((message: string, type: ToastType = 'info', duration = 5000) => {
        toast[type](message, {
            autoClose: duration,
        });
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Slide}
                className="mt-20 rounded-xl"
                toastClassName="relative flex p-1 min-h-10 rounded-xl justify-between overflow-hidden cursor-pointer bg-white dark:bg-slate-900 shadow-2xl mb-4 border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-800 dark:text-slate-200"
            />
        </ToastContext.Provider>
    );
};
