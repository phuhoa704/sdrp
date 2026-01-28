
'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle, Info, CheckCircle2, XCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'Đồng ý',
  variant = 'info',
}) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: XCircle,
          iconColor: 'text-rose-500',
          iconBgColor: 'bg-rose-500/20',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          iconColor: 'text-amber-500',
          iconBgColor: 'bg-amber-500/20',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          iconColor: 'text-emerald-500',
          iconBgColor: 'bg-emerald-500/20',
        };
      case 'info':
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          iconBgColor: 'bg-blue-500/20',
        };
    }
  };

  const { icon: Icon, iconColor, iconBgColor } = getVariantConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
    >
      <div className="p-8 flex flex-col items-center text-center">
        <div className={`w-20 h-20 ${iconBgColor} rounded-[32px] flex items-center justify-center mb-6`}>
          <Icon size={40} className={iconColor} />
        </div>

        <h3 className="text-2xl font-black text-white mb-3 tracking-tight leading-tight">
          {title}
        </h3>

        <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-10">
          {message}
        </p>

        <Button
          variant="primary"
          className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all"
          onClick={onClose}
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};
