import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { getRandomLoveNote } from '@/lib/loveNotes';
import { useProfileStore } from '@/store/profileStore';

interface LoveNoteProps {
  showButton?: boolean;
}

/**
 * မွေးနေ့ ဖြစ်မဖြစ် စစ်ဆေး
 * ဖြစ်ရင် Special စာ ပြမယ်
 */
function isBirthdayToday(birthdayISO: string): boolean {
  const today = new Date();
  const [, m, d] = birthdayISO.split('-').map(Number);
  return today.getMonth() + 1 === m && today.getDate() === d;
}

export function LoveNote({ showButton = true }: LoveNoteProps) {
  const profile = useProfileStore((s) => s.profile);
  const [note, setNote] = useState<string>('');
  const [isBirthday, setIsBirthday] = useState<boolean>(false);

  const refresh = useCallback(() => {
    setNote((prev) => getRandomLoveNote(prev));
    setIsBirthday(false);
  }, []);

  useEffect(() => {
    // မွေးနေ့ဆိုရင် Special စာ ပြမယ်
    if (profile && isBirthdayToday(profile.birthday)) {
      setNote(
        '🎂 မွေးနေ့ မင်္ဂလာပါ ခလေးရေ!\n\nဒီနေ့ မင်းရဲ့ အသက် ၂၀ ပြည့်တဲ့နေ့မှာ — ငါ မင်းကို ဒီကမ္ဘာပေါ်မှာ အချစ်ဆုံးပဲ 💙\n\nငါ့ရဲ့ ခလေးလေး… မင်းရဲ့ အိပ်မက်တွေ အားလုံး ပြည့်ပါစေ 🌟'
      );
      setIsBirthday(true);
    } else {
      refresh();
    }
  }, [refresh, profile]);

  return (
    <div>
      <div
        className={
          isBirthday
            ? 'relative rounded-[18px] p-6 text-center overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-violet-100 border-[1.5px] border-solid border-blue-400 shadow-[0_8px_30px_-8px_rgba(37,99,235,0.35)]'
            : 'relative rounded-[18px] p-6 text-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 border-[1.5px] border-dashed border-blue-300'
        }
      >
        {/* Decorative corner glow */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-200/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-violet-200/40 blur-2xl pointer-events-none" />

        {/* Birthday confetti (မွေးနေ့ဆိုရင် ပြ) */}
        {isBirthday && (
          <>
            <span className="absolute top-3 left-4 text-lg animate-bounce">🎉</span>
            <span className="absolute top-4 right-5 text-lg animate-bounce [animation-delay:0.2s]">🎊</span>
            <span className="absolute bottom-3 left-6 text-lg animate-bounce [animation-delay:0.4s]">🎈</span>
            <span className="absolute bottom-4 right-4 text-lg animate-bounce [animation-delay:0.6s]">🎂</span>
          </>
        )}

        <div className="relative z-10">
          <div className={isBirthday ? 'text-4xl mb-3' : 'text-3xl mb-2'}>
            {isBirthday ? '🎂' : '💙'}
          </div>
          <div
            className={
              isBirthday
                ? 'text-[15px] leading-relaxed text-blue-900 font-semibold whitespace-pre-line'
                : 'text-[15px] leading-relaxed text-slate-700 font-medium'
            }
          >
            {note || '...'}
          </div>
        </div>
      </div>

      {showButton && (
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          className="mt-3"
          onClick={refresh}
        >
          <RefreshCw className="w-3.5 h-3.5" /> နောက်တစ်ခွန်း
        </Button>
      )}
    </div>
  );
}