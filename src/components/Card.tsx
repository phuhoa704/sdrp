
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
  variant?: 'white' | 'glass' | 'soft';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  noPadding = false,
  variant = 'white'
}) => {
  const variants = {
    white: 'bg-white dark:bg-slate-900 shadow-sm border border-gray-50 dark:border-slate-800',
    glass: 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/40 dark:border-slate-800/40 shadow-sm',
    soft: 'bg-[#F7F9FC] dark:bg-slate-800/40 shadow-inner-soft'
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-[24px] shadow-smooth hover:shadow-md transition-all overflow-hidden ${variants[variant]} ${noPadding ? '' : 'p-4'} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className} transition-colors duration-300`}
    >
      {children}
    </div>
  );
};
