import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'text-white bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_4px_14px_-4px_rgba(37,99,235,0.6)] active:scale-[0.97]',
  ghost:
    'bg-primary-soft text-primary-dark active:bg-blue-100 active:scale-[0.97]',
  danger: 'bg-red-50 text-red-600 active:bg-red-100 active:scale-[0.97]',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-[13px] rounded-xl',
  md: 'px-5 py-3 text-sm rounded-[14px]',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-semibold',
        'transition-all duration-200 border-none cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}