import { useProfileStore } from '@/store/profileStore';
import { getGreeting, todayMMFull } from '@/lib/utils';

export function Header() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile || !profile.display_name) return null;

  return (
    <header className="gradient-header pt-8 px-5 pb-12 rounded-b-[28px] overflow-hidden relative">
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full glow-violet pointer-events-none" />
      <div className="absolute -bottom-32 -left-16 w-56 h-56 rounded-full glow-blue pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-[11px] text-white/60 tracking-wide font-medium">
            {getGreeting()}
          </span>
        </div>

        <h1 className="text-[26px] font-bold text-white leading-tight mb-1 tracking-tight">
          {profile.display_name}
        </h1>

        <div className="text-[12px] text-white/55">{todayMMFull()}</div>
      </div>
    </header>
  );
}