import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { getRandomLoveNote } from '@/lib/loveNotes';

interface LoveNoteProps {
  showButton?: boolean;
}

export function LoveNote({ showButton = true }: LoveNoteProps) {
  const [note, setNote] = useState<string>('');

  const refresh = useCallback(() => {
    setNote((prev) => getRandomLoveNote(prev));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <div className="relative rounded-[18px] p-6 text-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 border-[1.5px] border-dashed border-blue-300">
        {/* Decorative corner glow */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-200/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-violet-200/40 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-3xl mb-2">💙</div>
          <div className="text-[15px] leading-relaxed text-slate-700 font-medium">
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