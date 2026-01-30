'use client';

import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
  position?: 'right' | 'left';
  showCloseButton?: boolean;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  icon: Icon,
  iconColor = 'text-emerald-500',
  iconBgColor = 'bg-emerald-500/20',
  children,
  footer,
  width = 'md',
  position = 'right',
  showCloseButton = true,
}: DrawerProps) {
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

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    'full': 'max-w-full',
  };

  const positionClasses = {
    left: 'left-0 animate-slide-in-left',
    right: 'right-0 animate-slide-in-right'
  }

  const drawerContent = (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={cn("fixed inset-y-0 z-[200] flex pointer-events-none", positionClasses[position])}>
        <div
          className={cn(`h-full ${widthClasses[width]} flex flex-col w-screen bg-slate-900 dark:bg-slate-950 shadow-2xl border-l border-slate-800 pointer-events-auto`)}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center`}>
                    <Icon size={20} className={iconColor} />
                  </div>
                )}
                {title && (
                  <h2 id="drawer-title" className="text-xl font-black text-white">
                    {title}
                  </h2>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                  aria-label="Close drawer"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-4 border-t border-slate-800 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Fallback to body if modal-root not found, though best practice is a dedicated root.
  // Using same root as Modal for stacking context consistency.
  const modalRoot = document.getElementById('modal-root') || document.body;
  if (!modalRoot) return null;

  return createPortal(drawerContent, modalRoot);
}
