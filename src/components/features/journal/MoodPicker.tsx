import type { MoodValue } from '@/types';
import { MOODS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MoodPickerProps {
  value: MoodValue;
  onChange: (v: MoodValue) => void;
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {MOODS.map((m) => {
        const active = m.val === value;
        return (
          <button
            key={m.val}
            type="button"
            onClick={() => onChange(m.val)}
            style={
              active
                ? {
                    borderColor: m.color,
                    color: m.color,
                    backgroundColor: `${m.color}15`,
                    boxShadow: `0 4px 12px -4px ${m.color}55`,
                  }
                : undefined
            }
            className={cn(
              'flex-1 min-w-[58px] py-2.5 px-1.5 rounded-[14px]',
              'bg-white border-[1.5px] border-slate-200 cursor-pointer',
              'flex flex-col items-center gap-0.5 transition-all duration-200',
              'text-[11px] font-medium',
              active ? 'font-semibold scale-[1.02]' : 'text-ink-muted hover:border-slate-300'
            )}
          >
            <span className="text-2xl leading-none">{m.emo}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}