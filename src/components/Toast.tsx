import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

const toastConfig = {
    success: {
        icon: CheckCircle,
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        iconColor: 'text-emerald-500',
        textColor: 'text-emerald-800 dark:text-emerald-200'
    },
    error: {
        icon: AlertCircle,
        bgColor: 'bg-rose-50 dark:bg-rose-900/20',
        borderColor: 'border-rose-200 dark:border-rose-800',
        iconColor: 'text-rose-500',
        textColor: 'text-rose-800 dark:text-rose-200'
    },
    warning: {
        icon: AlertTriangle,
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-800',
        iconColor: 'text-amber-500',
        textColor: 'text-amber-800 dark:text-amber-200'
    },
    info: {
        icon: Info,
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-500',
        textColor: 'text-blue-800 dark:text-blue-200'
    }
};

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 5000, onClose }) => {
    const config = toastConfig[type];
    const Icon = config.icon;

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-2xl border shadow-lg backdrop-blur-sm animate-slide-in-right',
                config.bgColor,
                config.borderColor
            )}
        >
            <Icon size={20} className={cn('shrink-0 mt-0.5', config.iconColor)} />
            <p className={cn('text-sm font-bold flex-1', config.textColor)}>{message}</p>
            <button
                onClick={onClose}
                className={cn(
                    'shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
                    config.iconColor
                )}
            >
                <X size={16} />
            </button>
        </div>
    );
};
