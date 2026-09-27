import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-[20px] p-[18px] mb-3',
        'shadow-card border border-slate-100',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  icon?: string;
  children: ReactNode;
  className?: string;
}

export function CardTitle({ icon, children, className }: CardTitleProps) {
  return (
    <div className={cn('flex items-center gap-2 mb-3.5', className)}>
      {icon && <span className="text-[17px] leading-none">{icon}</span>}
      <span className="text-[14px] font-semibold text-ink tracking-tight">
        {children}
      </span>
    </div>
  );
}