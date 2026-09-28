import { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { nextBirthday, daysBetween, getAge, formatMM } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function BirthdayCountdown() {
  const profile = useProfileStore((s) => s.profile);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!profile) return;

    const target = nextBirthday(profile.birthday);

    const tick = () => {
      setTimeLeft(getTimeLeft(target));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [profile]);

  if (!profile) return null;

  const next = nextBirthday(profile.birthday);
  const totalDays = daysBetween(new Date(), next);
  const age = getAge(profile.birthday, next);
  const isToday = totalDays === 0;

  // Progress: days elapsed since last birthday (365 - remaining)
  const DAYS_IN_YEAR = 365;
  const elapsed = Math.max(0, DAYS_IN_YEAR - totalDays);
  const progressPct = Math.min(100, (elapsed / DAYS_IN_YEAR) * 100);

  return (
    <div className="relative rounded-[24px] p-6 mb-3 overflow-hidden shadow-premium gradient-countdown text-white">
      {/* Decorative radial glows */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-fuchsia-400/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-violet-400/15 blur-3xl pointer-events-none" />

      {/* Floating sparkles */}
      <span className="absolute top-5 right-16 text-xs opacity-70 animate-pulse">✨</span>
      <span className="absolute bottom-8 right-6 text-xs opacity-60 animate-pulse [animation-delay:0.5s]">✨</span>
      <span className="absolute top-1/3 right-3 text-[10px] opacity-50 animate-pulse [animation-delay:1s]">⭐</span>

      <div className="relative z-10">
        {/* Header row */}
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
          /* ── Birthday Today ── */
          <div className="text-center py-2">
            <div className="text-[56px] leading-none mb-2 animate-bounce">🎉</div>
            <div className="text-[22px] font-bold text-white mb-1.5">
              မွေးနေ့ မင်္ဂလာပါ ခလေးရေ!
            </div>
            <div className="text-[13px] text-white/85">
              အသက် {age} ပြည့်ပါပြီ 💙
            </div>
          </div>
        ) : (
          <>
            {/* ── Main countdown ── */}
            <div className="mb-5">
              {/* Big days number */}
              <div className="flex items-end justify-center gap-3 mb-4">
                <div className="flex flex-col items-center">
                  <div
                    className="text-[80px] font-black en leading-none tracking-tighter"
                    style={{
                      textShadow: '0 4px 24px rgba(255,255,255,0.35)',
                    }}
                  >
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase mt-1">
                    Days
                  </div>
                </div>
              </div>

              {/* Hours : Minutes : Seconds row */}
              <div className="flex items-center justify-center gap-1.5 text-white/90">
                <div className="flex flex-col items-center min-w-[46px]">
                  <div className="text-[20px] font-bold en tabular-nums leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] font-medium tracking-wider text-white/60 mt-1 uppercase">
                    Hrs
                  </div>
                </div>
                <span className="text-[18px] text-white/40 -mt-3">:</span>
                <div className="flex flex-col items-center min-w-[46px]">
                  <div className="text-[20px] font-bold en tabular-nums leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] font-medium tracking-wider text-white/60 mt-1 uppercase">
                    Min
                  </div>
                </div>
                <span className="text-[18px] text-white/40 -mt-3">:</span>
                <div className="flex flex-col items-center min-w-[46px]">
                  <div className="text-[20px] font-bold en tabular-nums leading-none">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] font-medium tracking-wider text-white/60 mt-1 uppercase">
                    Sec
                  </div>
                </div>
              </div>
            </div>

            {/* ── Progress bar ── */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold tracking-wider text-white/70 uppercase en">
                  ရောက်ဖို့
                </span>
                <span className="text-[10px] font-bold text-white/90 en tabular-nums">
                  {Math.round(progressPct)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-white via-cyan-200 to-emerald-300 shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-all duration-1000"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* ── Info footer ── */}
            <div className="flex items-center justify-between pt-3 border-t border-white/15">
              <div>
                <div className="text-[9px] font-semibold tracking-wider text-white/55 uppercase mb-0.5">
                  မွေးနေ့
                </div>
                <div className="text-[13px] font-semibold text-white/95">
                  {formatMM(profile.birthday)}
                </div>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div className="text-right">
                <div className="text-[9px] font-semibold tracking-wider text-white/55 uppercase mb-0.5">
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