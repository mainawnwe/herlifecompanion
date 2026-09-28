import { Card, CardTitle } from '@/components/common/Card';
import { BirthdayCountdown } from '@/components/features/countdown/BirthdayCountdown';
import { LoveNote } from '@/components/features/love/LoveNote';
import { WeatherCard } from '@/components/features/weather/WeatherCard';
import { useWaterStore } from '@/store/healthStore';
import { useTodoStore } from '@/store/todoStore';
import { Droplet, CheckCircle2 } from 'lucide-react';
import { WATER_GOAL } from '@/lib/constants';

export function HomePage() {
  const water = useWaterStore((s) => s.count);
  const todos = useTodoStore((s) => s.todos);
  const remaining = todos.filter((t) => !t.done).length;
  const waterPct = Math.round((water / WATER_GOAL) * 100);

  return (
    <>
      <BirthdayCountdown />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-[18px] p-4 border border-slate-100 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Droplet className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <span className="text-[11px] font-semibold text-ink-muted">
              ရေသောက်
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-2xl font-bold text-ink en leading-none">
              {water}
            </span>
            <span className="text-[11px] text-ink-muted font-medium">
              / {WATER_GOAL}
            </span>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${waterPct}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-[18px] p-4 border border-slate-100 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-[11px] font-semibold text-ink-muted">
              လုပ်ရန်ကျန်
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-2xl font-bold text-ink en leading-none">
              {remaining}
            </span>
            <span className="text-[11px] text-ink-muted font-medium">ခု</span>
          </div>
          <div className="text-[10px] text-ink-subtle font-medium">
            {remaining === 0 ? '✨ အားလုံး ပြီးပါပြီ' : 'ဆက်လုပ်ရန်'}
          </div>
        </div>
      </div>

      <WeatherCard />

      <Card>
        <CardTitle icon="💌">ချစ်စကားလေးတစ်ခွန်း</CardTitle>
        <LoveNote />
      </Card>
    </>
  );
}