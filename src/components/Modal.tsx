'use client';

import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  maxHeight?: string;
  showCloseButton?: boolean;
  wrapperClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  icon: Icon,
  iconColor = 'text-emerald-500',
  iconBgColor = 'bg-emerald-500/20',
  children,
  footer,
  maxWidth = 'lg',
  maxHeight,
  showCloseButton = true,
  wrapperClassName,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  const modalContent = (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={cn("fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 pointer-events-none", wrapperClassName)}>
        <div
          className={`w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-down pointer-events-auto overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center`}>
                    <Icon size={20} className={iconColor} />
                  </div>
                )}
                <h2 id="modal-title" className="text-xl font-black text-slate-900 dark:text-white">
                  {title}
                </h2>
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          <div className={cn("overflow-y-auto scrollbar-hide", maxHeight ? `max-h-[${maxHeight}]` : 'max-h-[60vh]')}>
            {children}
          </div>
          {footer && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(modalContent, modalRoot);
}
