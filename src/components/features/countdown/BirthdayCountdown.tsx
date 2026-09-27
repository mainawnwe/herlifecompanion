import { useProfileStore } from '@/store/profileStore';
import { nextBirthday, daysBetween, getAge, formatMM } from '@/lib/utils';

export function BirthdayCountdown() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const next = nextBirthday(profile.birthday);
  const days = daysBetween(new Date(), next);
  const age = getAge(profile.birthday, next);
  const isToday = days === 0;

  return (
    <div className="gradient-countdown text-white rounded-[20px] p-5 mb-3 relative overflow-hidden shadow-premium">
      {/* Glow decorations */}
      <div className="absolute -top-12 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top label row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
            <span className="text-[10px] font-semibold tracking-[0.15em] text-white/70 uppercase en">
              Countdown
            </span>
          </div>
          <span className="text-lg">🎂</span>
        </div>

        {/* Main number */}
        <div className="flex items-end gap-2 mb-2">
          {isToday ? (
            <span className="text-[42px] font-bold en leading-none">🎉</span>
          ) : (
            <>
              <span className="text-[48px] font-bold en leading-none tracking-tight">
                {days}
              </span>
              <span className="text-sm opacity-85 font-medium pb-1.5">ရက်</span>
            </>
          )}
        </div>

        {/* Subtitle */}
        <div className="text-xs text-white/75 leading-relaxed">
          {isToday
            ? 'ဒီနေ့ မွေးနေ့ပါ! မင်္ဂလာမွေးနေ့ပါ 🎂'
            : `${formatMM(profile.birthday)} — အသက် ${age} ပြည့်မယ် 🎉`}
        </div>
      </div>
    </div>
  );
}