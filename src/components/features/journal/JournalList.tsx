import { useJournalStore } from '@/store/journalStore';
import { Empty } from '@/components/common/Input';
import { formatMM } from '@/lib/utils';
import { MOODS } from '@/lib/constants';

export function JournalList() {
  const entries = useJournalStore((s) => s.entries);
  const removeEntry = useJournalStore((s) => s.removeEntry);

  if (entries.length === 0) {
    return <Empty emoji="📖">မှတ်တမ်း မရှိသေးပါ</Empty>;
  }

  return (
    <div>
      {entries.slice(0, 20).map((e) => {
        const mood = MOODS.find((m) => m.val === e.mood);
        const color = mood?.color ?? '#2563EB';

        return (
          <div
            key={e.id}
            className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
              style={{
                backgroundColor: `${color}15`,
                border: `1px solid ${color}30`,
              }}
            >
              {e.moodEmo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-medium text-ink-muted">
                  {formatMM(e.date)}
                </span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {e.moodLabel}
                </span>
              </div>
              <div className="text-sm leading-relaxed break-words text-ink">
                {e.text}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeEntry(e.id)}
              className="text-slate-300 text-lg leading-none p-1 bg-transparent border-none cursor-pointer hover:text-red-400"
              aria-label="Delete"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}