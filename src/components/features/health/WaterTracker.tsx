import { useEffect } from 'react';
import { Card, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useWaterStore } from '@/store/healthStore';
import { WATER_GOAL } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function WaterTracker() {
  const { count, toggleCup, autoResetIfNewDay } = useWaterStore();
  const pct = Math.round((count / WATER_GOAL) * 100);

  useEffect(() => {
    autoResetIfNewDay();
  }, [autoResetIfNewDay]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <CardTitle icon="💧" className="mb-0">ရေသောက်မှု</CardTitle>
        <Badge variant="blue">{pct}%</Badge>
      </div>

      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-3xl font-bold text-cyan-600 en leading-none">
          {count}
        </span>
        <span className="text-sm text-ink-muted font-medium">
          / {WATER_GOAL} ခွက်
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: WATER_GOAL }, (_, i) => i + 1).map((n) => {
          const filled = n <= count;
          return (
            <button
              key={n}
              type="button"
              onClick={() => toggleCup(n)}
              className={cn(
                'aspect-square rounded-[14px] flex items-center justify-center',
                'text-2xl cursor-pointer transition-all duration-200 border-[1.5px]',
                filled
                  ? 'bg-cyan-50 border-cyan-400 scale-[1.02] shadow-[0_4px_10px_-4px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-50 border-slate-200 hover:border-cyan-300'
              )}
              aria-label={`Cup ${n}`}
            >
              {filled ? '💧' : '🥛'}
            </button>
          );
        })}
      </div>
    </Card>
  );
}