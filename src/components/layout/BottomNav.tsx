import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/',          emo: '🏠', label: 'ပင်မ',     end: true },
  { to: '/journal',   emo: '✍️', label: 'မှတ်တမ်း' },
  { to: '/health',    emo: '🌸', label: 'ကျန်းမာ' },
  { to: '/love',      emo: '💕', label: 'ချစ်ခြင်း' },
  { to: '/more',      emo: '⚙️', label: 'အခြား' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] max-w-[480px] mx-auto glass border-t border-slate-200/70 flex justify-around px-1 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))]">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'relative flex-1 flex flex-col items-center gap-0.5 py-1.5 px-0.5',
              'rounded-xl no-underline text-[10px] font-medium transition-all duration-200',
              isActive ? 'text-primary' : 'text-slate-400'
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute -top-2 w-8 h-[3px] rounded-full bg-primary" />
              )}
              <span
                className={cn(
                  'text-xl leading-none transition-transform',
                  isActive && 'scale-110'
                )}
              >
                {item.emo}
              </span>
              <span className={cn(isActive && 'font-semibold')}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}