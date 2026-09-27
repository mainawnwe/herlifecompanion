import { Card, CardTitle } from '@/components/common/Card';
import { BirthdayCountdown } from '@/components/features/countdown/BirthdayCountdown';
import { LoveNote } from '@/components/features/love/LoveNote';
import { WeatherCard } from '@/components/features/weather/WeatherCard';
import { useWaterStore, usePeriodStore } from '@/store/healthStore';
import { useTodoStore } from '@/store/todoStore';

export function HomePage() {
  const water = useWaterStore((s) => s.count);
  const todos = useTodoStore((s) => s.todos);
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <>
      <BirthdayCountdown />

      <div className="grid grid-cols-2 gap-3 mb-3.5">
        <div className="bg-white rounded-[20px] p-3.5 border border-border shadow-soft flex flex-col gap-1">
          <div className="text-[11px] text-ink-muted font-medium">
            💧 ဒီနေ့ရေသောက်
          </div>
          <div className="text-xl font-bold en">
            {water}
            <span className="text-xs text-ink-muted font-medium">
              {' '}
              / 8 ခွက်
            </span>
          </div>
        </div>
        <div className="bg-white rounded-[20px] p-3.5 border border-border shadow-soft flex flex-col gap-1">
          <div className="text-[11px] text-ink-muted font-medium">
            ✅ လုပ်ရန်ကျန်
          </div>
          <div className="text-xl font-bold en">
            {remaining}
            <span className="text-xs text-ink-muted font-medium"> ခု</span>
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
