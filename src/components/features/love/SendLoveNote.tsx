import { useState } from 'react';
import { Send, Heart } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useCoupleStore } from '@/store/coupleStore';
import { useLoveNotesStore } from '@/store/loveNotesStore';

const QUICK_TEMPLATES = [
  'ခလေး ချစ်တယ် 💙',
  'ခလေး ဘယ်လိုနေလဲ? 🤗',
  'ခလေး အတွေးထဲ ရှိတယ် ✨',
  'မနက်ဖြန် ဆုံမယ်နော် 💕',
  'ခလေးက ငါ့အချစ်ဆုံးပဲ 👑',
];

export function SendLoveNote() {
  const partner = useCoupleStore((s) => s.partner);
  const send = useLoveNotesStore((s) => s.send);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    const res = await send(text);
    setSending(false);
    if (res.ok) {
      setText('');
    } else {
      alert(res.message);
    }
  };

  if (!partner) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[12px] text-amber-700 text-center">
        ⚠️ ချစ်သူ မချိတ်ရသေး — More page → Couple Linking
      </div>
    );
  }

  return (
    <div>
      {/* Recipient */}
      <div className="flex items-center gap-2 mb-3 bg-gradient-to-br from-pink-50 to-violet-50 rounded-xl px-3 py-2.5 border border-pink-100">
        <Heart className="w-4 h-4 text-pink-500" fill="#EC4899" />
        <span className="text-[12px] text-ink-muted">ပို့မယ့်သူ</span>
        <span className="text-[13px] font-bold text-ink ml-auto">
          {partner.display_name ?? 'ချစ်သူ'}
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ချစ်စကားလေး ရေးပါ... 💙"
        maxLength={500}
        rows={3}
        className="w-full px-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
      />

      <div className="flex items-center justify-between mt-1.5 mb-3">
        <span className="text-[10px] text-ink-muted">
          {text.length}/500
        </span>
      </div>

      {/* Quick templates */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {QUICK_TEMPLATES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setText(t)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-ink-muted hover:bg-primary-soft hover:text-primary-dark transition-all"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Send button */}
      <Button
        fullWidth
        onClick={handleSend}
        disabled={sending || !text.trim()}
      >
        {sending ? (
          '...'
        ) : (
          <>
            <Send className="w-4 h-4" /> စာပို့မယ်
          </>
        )}
      </Button>
    </div>
  );
}
