import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Empty } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { useLoveNotesStore } from '@/store/loveNotesStore';
import { cn } from '@/lib/utils';

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diff < 60) return 'ယခုလေးတင်';
  if (diff < 3600) return `${Math.floor(diff / 60)} မိနစ်က`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} နာရီက`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ရက်က`;
  return d.toLocaleDateString('my-MM', { month: 'short', day: 'numeric' });
}

export function ReceivedNotes() {
  const { received, markSeen, markAllSeen, unseenCount } =
    useLoveNotesStore();

  // Auto mark all as seen when component mounts
  useEffect(() => {
    if (unseenCount > 0) {
      const timer = setTimeout(() => {
        markAllSeen();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [unseenCount, markAllSeen]);

  if (received.length === 0) {
    return <Empty emoji="💌">စာ မရောက်ရသေးပါ</Empty>;
  }

  return (
    <div>
      {unseenCount > 0 && (
        <div className="mb-3 flex items-center justify-between bg-primary-soft rounded-xl px-3 py-2">
          <span className="text-[12px] font-semibold text-primary-dark">
            🔔 စာ {unseenCount} ခု မဖတ်ရသေး
          </span>
          <button
            onClick={markAllSeen}
            className="text-[11px] text-primary font-bold hover:underline"
          >
            အားလုံး ဖတ်ပြီး
          </button>
        </div>
      )}

      <div className="space-y-2">
        {received.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => !n.is_seen && markSeen(n.id)}
            className={cn(
              'w-full text-left rounded-2xl p-3.5 transition-all border-[1.5px]',
              n.is_seen
                ? 'bg-white border-slate-200'
                : 'bg-gradient-to-br from-pink-50 to-violet-50 border-pink-300 shadow-[0_4px_14px_-6px_rgba(236,72,153,0.4)]'
            )}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Heart
                  className={cn(
                    'w-3.5 h-3.5',
                    n.is_seen ? 'text-slate-300' : 'text-pink-500'
                  )}
                  fill={n.is_seen ? 'none' : '#EC4899'}
                />
                <span className="text-[11px] font-semibold text-ink-muted">
                  {n.from_name ?? 'ချစ်သူ'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {!n.is_seen && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
                <span className="text-[10px] text-ink-muted">
                  {timeAgo(n.created_at)}
                </span>
              </div>
            </div>
            <div
              className={cn(
                'text-[14px] leading-relaxed',
                n.is_seen ? 'text-slate-600' : 'text-ink font-medium'
              )}
            >
              {n.content}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
