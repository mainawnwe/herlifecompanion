import { Heart, Check, MailOpen } from 'lucide-react';
import { Empty } from '@/components/common/Input';
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
  const { received, markSeen, markAllSeen, unseenCount } = useLoveNotesStore();

  if (received.length === 0) {
    return <Empty emoji="💌">စာ မရောက်ရသေးပါ</Empty>;
  }

  return (
    <div>
      {/* Unread Alert + Mark All Button */}
      {unseenCount > 0 && (
        <div className="mb-3 flex items-center justify-between bg-gradient-to-r from-pink-50 to-violet-50 border border-pink-200 rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-[12px] font-semibold text-pink-700">
              စာ {unseenCount} ခု မဖတ်ရသေး
            </span>
          </div>
          <button
            onClick={markAllSeen}
            className="text-[11px] text-primary font-bold px-2.5 py-1 rounded-lg bg-white border border-primary-200 active:scale-95 transition-all"
          >
            ✓ အားလုံး ဖတ်ပြီး
          </button>
        </div>
      )}

      <div className="space-y-2">
        {received.map((n) => {
          const isUnread = !n.is_seen;
          return (
            <div
              key={n.id}
              className={cn(
                'rounded-2xl p-3.5 transition-all border-[1.5px] relative',
                isUnread
                  ? 'bg-gradient-to-br from-pink-50 to-violet-50 border-pink-300 shadow-[0_4px_14px_-6px_rgba(236,72,153,0.4)]'
                  : 'bg-white border-slate-200'
              )}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Heart
                    className={cn(
                      'w-3.5 h-3.5',
                      isUnread ? 'text-pink-500' : 'text-slate-300'
                    )}
                    fill={isUnread ? '#EC4899' : 'none'}
                  />
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {n.from_name ?? 'ချစ်သူ'}
                  </span>
                  {isUnread && (
                    <span className="ml-1 text-[9px] font-bold text-white bg-pink-500 px-1.5 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-ink-muted">
                  {timeAgo(n.created_at)}
                </span>
              </div>

              {/* Content */}
              <div
                className={cn(
                  'text-[14px] leading-relaxed mb-2',
                  isUnread ? 'text-ink font-medium' : 'text-slate-500'
                )}
              >
                {n.content}
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between">
                {isUnread ? (
                  <button
                    onClick={() => markSeen(n.id)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-white border border-primary-200 px-2.5 py-1 rounded-lg active:scale-95 transition-all"
                  >
                    <Check className="w-3 h-3" />
                    ဖတ်ပြီး အမှတ်အသား
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <MailOpen className="w-3 h-3" />
                    ဖတ်ပြီး
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}