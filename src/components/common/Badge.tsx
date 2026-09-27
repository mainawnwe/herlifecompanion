import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'blue' | 'violet' | 'green' | 'gray' | 'pink';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
  blue: 'bg-primary-soft text-primary-dark',
  violet: 'bg-accent-soft text-violet-700',
  green: 'bg-emerald-50 text-emerald-700',
  gray: 'bg-slate-100 text-slate-600',
  pink: 'bg-rose-50 text-rose-600',
};

export function Badge({ variant = 'blue', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-tight',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}