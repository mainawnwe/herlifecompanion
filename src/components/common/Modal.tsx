import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ open, onClose, children, title }: ModalProps) {
  // Escape key နှိပ်ရင် ပိတ်
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[200] flex items-center justify-center p-5',
        'bg-[rgba(74,44,61,0.45)] backdrop-blur-[4px]'
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white rounded-3xl p-6 w-full max-w-[420px]',
          'max-h-[85vh] overflow-y-auto',
          'animate-[pop_0.25s_ease]'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="text-lg font-bold text-ink mb-4">{title}</div>
        )}
        {children}
      </div>

      <style>{`
        @keyframes pop {
          from { transform: scale(0.9); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
