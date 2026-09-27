import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const baseInput =
  'w-full px-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white ' +
  'text-ink text-sm outline-none transition-all placeholder:text-slate-400 ' +
  'focus:border-primary focus:ring-4 focus:ring-primary/10';

export function Input({ label, className, ...rest }: InputProps) {
  return (
    <div className="mb-3.5">
      {label && (
        <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input className={cn(baseInput, className)} {...rest} />
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, ...rest }: TextareaProps) {
  return (
    <div className="mb-3.5">
      {label && (
        <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        className={cn(baseInput, 'min-h-[100px] resize-y', className)}
        {...rest}
      />
    </div>
  );
}

interface EmptyProps {
  emoji?: string;
  children: ReactNode;
}

export function Empty({ emoji = '📭', children }: EmptyProps) {
  return (
    <div className="text-center py-8 px-3">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 mb-3 text-3xl">
        {emoji}
      </div>
      <div className="text-ink-muted text-[13px]">{children}</div>
    </div>
  );
}