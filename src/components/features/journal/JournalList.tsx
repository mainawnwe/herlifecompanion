import { useJournalStore } from '@/store/journalStore';
import { Empty } from '@/components/common/Input';
import { formatMM } from '@/lib/utils';

export function JournalList() {
  const entries = useJournalStore((s) => s.entries);
  const removeEntry = useJournalStore((s) => s.removeEntry);

  if (entries.length === 0) {
    return <Empty emoji="📖">မှတ်တမ်း မရှိသေးပါ</Empty>;
  }

  return (
    <div>
      {entries.slice(0, 20).map((e) => (
        <div
          key={e.id}
          className="flex items-start gap-3 py-3 border-b border-border last:border-b-0"
        >
          <span className="text-2xl leading-none mt-0.5">{e.moodEmo}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-ink-muted mb-0.5">
              {formatMM(e.date)} · {e.moodLabel}
            </div>
            <div className="text-sm leading-relaxed break-words">
              {e.text}
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeEntry(e.id)}
            className="text-[#D1A7BD] text-lg leading-none p-1 bg-transparent border-none cursor-pointer hover:text-red-400"
            aria-label="Delete"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
