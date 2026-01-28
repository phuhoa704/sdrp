import { Loader2 } from 'lucide-react';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyles = "rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed tracking-tight h-12";

  const variants = {
    primary: `bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] text-white shadow-lg shadow-green-500/20`,
    secondary: "bg-white text-[#111827] hover:bg-gray-50 border border-gray-100 shadow-sm",
    soft: "bg-[#F0FDF4] text-[#22C55E] hover:bg-green-100",
    outline: "bg-transparent border-2 border-[#22C55E] text-[#22C55E] hover:bg-green-50",
    danger: "bg-[#EF4444] text-white shadow-lg shadow-rose-500/20"
  };

  const sizes = {
    sm: "h-10 px-4 text-xs",
    md: "h-12 px-7 text-sm",
    lg: "h-14 px-10 text-base"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};