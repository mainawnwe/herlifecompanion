import { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { nextBirthday, daysBetween, getAge, formatMM } from '@/lib/utils';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalMs: diff,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function BirthdayCountdown() {
  const profile = useProfileStore((s) => s.profile);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
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
  const totalDays = daysBetween(new Date(), next); // ← Calendar days (မှန်)
  const age = getAge(profile.birthday, next);
  const isToday = totalDays === 0;

  // Progress bar: ဒီနှစ်အတွင်း ဘယ်လောက်ရောက်နေပြီလဲ
  const DAYS_IN_YEAR = 365;
  const progressPct = Math.min(
    100,
    Math.max(0, ((DAYS_IN_YEAR - totalDays) / DAYS_IN_YEAR) * 100)
  );

  return (
    <div className="relative rounded-[24px] p-6 mb-3 overflow-hidden shadow-premium gradient-countdown text-white">
      {/* Glow decorations */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-fuchsia-400/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-violet-400/15 blur-3xl pointer-events-none" />

      {/* Floating sparkles */}
      <span className="absolute top-5 right-16 text-xs opacity-70 animate-pulse">✨</span>
      <span className="absolute bottom-8 right-6 text-xs opacity-60 animate-pulse [animation-delay:0.5s]">✨</span>
      <span className="absolute top-1/3 right-3 text-[10px] opacity-50 animate-pulse [animation-delay:1s]">⭐</span>

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
          /* ═══ Birthday Today ═══ */
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
            {/* ═══ Big Days Number ═══ */}
            <div className="text-center mb-5">
              <div
                className="text-[88px] font-black en leading-none tracking-tighter tabular-nums"
                style={{ textShadow: '0 6px 32px rgba(255,255,255,0.4)' }}
              >
                {pad(totalDays)}
              </div>
              <div className="text-[11px] font-bold tracking-[0.35em] text-white/75 uppercase mt-2 en">
                {totalDays === 1 ? 'Day' : 'Days'}
              </div>
            </div>

            {/* ═══ Live Timer (Prettier) ═══ */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <TimeBox value={pad(timeLeft.hours)} label="HRS" />
              <Colon />
              <TimeBox value={pad(timeLeft.minutes)} label="MIN" />
              <Colon />
              <TimeBox value={pad(timeLeft.seconds)} label="SEC" />
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

/* ═══════════════════════════════════════
   Time Box — Hours/Minutes/Seconds
   ═══════════════════════════════════════ */
function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[64px]">
      <div className="relative w-full px-3 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.15)]">
        <div className="text-[22px] font-black en tabular-nums leading-none text-center text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.35)]">
          {value}
        </div>
      </div>
      <div className="text-[9px] font-bold tracking-[0.2em] text-white/70 uppercase mt-1.5 en">
        {label}
      </div>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex flex-col items-center -mt-4">
      <span className="text-[20px] font-bold text-white/50 leading-none">:</span>
    </div>
  );
}