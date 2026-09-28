import { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { nextBirthday, daysBetween, getAge, formatMM } from '@/lib/utils';

interface TimeLeft {
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  const totalHours = Math.floor(diff / 3600000);
  const totalMinutes = Math.floor(diff / 60000);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    totalHours,
    totalMinutes,
    totalSeconds,
    hours: totalHours % 24,
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function BirthdayCountdown() {
  const profile = useProfileStore((s) => s.profile);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!profile) return;
    const target = nextBirthday(profile.birthday);
    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [profile]);

  if (!profile) return null;

  const next = nextBirthday(profile.birthday);
  const calendarDays = daysBetween(new Date(), next); // ← Calendar
  const durationDays = Math.floor(timeLeft.totalHours / 24); // ← Duration
  const age = getAge(profile.birthday, next);
  const isToday = calendarDays === 0;

  const DAYS_IN_YEAR = 365;
  const progressPct = Math.min(
    100,
    Math.max(0, ((DAYS_IN_YEAR - calendarDays) / DAYS_IN_YEAR) * 100)
  );

  return (
    <div className="relative rounded-[24px] p-6 mb-3 overflow-hidden shadow-premium gradient-countdown text-white">
      {/* Glow decorations */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-fuchsia-400/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-violet-400/15 blur-3xl pointer-events-none" />

      {/* Sparkles */}
      <span className="absolute top-5 right-16 text-xs opacity-70 animate-pulse">✨</span>
      <span className="absolute bottom-8 right-6 text-xs opacity-60 animate-pulse [animation-delay:0.5s]">✨</span>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-300 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/85 uppercase en">
              Countdown
            </span>
          </div>
          <span className="text-[22px] leading-none">🎂</span>
        </div>

        {isToday ? (
          <div className="text-center py-4">
            <div className="text-[56px] leading-none mb-3 animate-bounce">🎉</div>
            <div className="text-[22px] font-bold text-white mb-1.5">
              မွေးနေ့ မင်္ဂလာပါ ခလေးရေ!
            </div>
            <div className="text-[13px] text-white/85">
              အသက် {age} ပြည့်ပါပြီ 💙
            </div>
          </div>
        ) : (
          <>
            {/* ═══ Big Days Number (Calendar) ═══ */}
            <div className="text-center mb-5">
              <div
                className="text-[88px] font-black en leading-none tracking-tighter tabular-nums"
                style={{ textShadow: '0 6px 32px rgba(255,255,255,0.4)' }}
              >
                {pad(calendarDays)}
              </div>
              <div className="text-[11px] font-bold tracking-[0.35em] text-white/75 uppercase mt-2 en">
                {calendarDays === 1 ? 'Day' : 'Days'}
              </div>
              <div className="text-[11px] text-white/55 mt-1">
                {formatMM(profile.birthday)} အထိ
              </div>
            </div>

            {/* ═══ Total Remaining Time (Text) ═══ */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 mb-4">
              <div className="text-[9px] font-semibold tracking-[0.2em] text-white/60 uppercase text-center mb-1.5 en">
                Total Remaining
              </div>
              <div className="text-center en tabular-nums text-[20px] font-bold text-white">
                <span className="text-white/90">{timeLeft.totalHours}</span>
                <span className="text-white/50 text-sm">h</span>
                <span className="mx-1.5 text-white/40">·</span>
                <span className="text-white/90">{pad(timeLeft.minutes)}</span>
                <span className="text-white/50 text-sm">m</span>
                <span className="mx-1.5 text-white/40">·</span>
                <span className="text-white/90">{pad(timeLeft.seconds)}</span>
                <span className="text-white/50 text-sm">s</span>
              </div>
              <div className="text-[10px] text-white/50 text-center mt-1">
                (စုစုပေါင်း ကျန်ချိန် — {durationDays} ရက် {timeLeft.hours} နာရီ)
              </div>
            </div>

            {/* ═══ Progress Bar ═══ */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold tracking-wider text-white/70 uppercase en">
                  ရောက်ဖို့
                </span>
                <span className="text-[11px] font-bold text-white/95 en tabular-nums">
                  {Math.round(progressPct)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-white via-cyan-200 to-emerald-300 shadow-[0_0_14px_rgba(255,255,255,0.7)] transition-all duration-1000"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* ═══ Info Footer ═══ */}
            <div className="flex items-center justify-between pt-4 border-t border-white/15">
              <div>
                <div className="text-[9px] font-semibold tracking-wider text-white/55 uppercase mb-1">
                  မွေးနေ့
                </div>
                <div className="text-[13px] font-semibold text-white/95">
                  {formatMM(profile.birthday)}
                </div>
              </div>
              <div className="w-px h-9 bg-white/15" />
              <div className="text-right">
                <div className="text-[9px] font-semibold tracking-wider text-white/55 uppercase mb-1">
                  ပြည့်မယ့်အသက်
                </div>
                <div className="text-[13px] font-semibold text-white/95">
                  {age} နှစ် 🎈
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}