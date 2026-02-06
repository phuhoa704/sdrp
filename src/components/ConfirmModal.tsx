
'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'info',
  isLoading = false,
}) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: AlertTriangle,
          iconColor: 'text-rose-500',
          iconBgColor: 'bg-rose-500/20',
          btnVariant: 'danger' as const,
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-500',
          iconBgColor: 'bg-amber-500/20',
          btnVariant: 'primary' as const,
        };
      case 'success':
        return {
          icon: CheckCircle2,
          iconColor: 'text-emerald-500',
          iconBgColor: 'bg-emerald-500/20',
          btnVariant: 'primary' as const,
        };
      case 'info':
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          iconBgColor: 'bg-blue-500/20',
          btnVariant: 'primary' as const,
        };
    }
  };

  const { icon: Icon, iconColor, iconBgColor, btnVariant } = getVariantConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      showCloseButton={!isLoading}
    >
      <div className="p-8 flex flex-col items-center text-center">
        <div className={`w-20 h-20 ${iconBgColor} rounded-[32px] flex items-center justify-center mb-6 animate-bounce-subtle`}>
          <Icon size={40} className={iconColor} />
        </div>

        <h3 className="text-2xl font-black dark:text-white text-slate-800 mb-3 tracking-tight leading-tight">
          {title}
        </h3>

        <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-10">
          {message}
        </p>

        <div className="flex items-center gap-4 w-full">
          <Button
            variant="secondary"
            className="flex-1 h-14 rounded-2xl text-slate-400 font-black uppercase tracking-widest border border-slate-800 hover:bg-slate-800 transition-all"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={btnVariant}
            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang xử lý</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
