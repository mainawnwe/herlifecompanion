import { useState } from 'react';
import { Heart, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Email ထည့်ပါ');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email ပုံစံ မှန်အောင် ထည့်ပါ');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await signInWithEmail(email.trim());
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 overflow-y-auto relative gradient-header">
      <div className="absolute top-1/4 -left-24 w-72 h-72 rounded-full glow-blue pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-72 h-72 rounded-full glow-violet pointer-events-none" />

      <div className="relative w-full max-w-[400px] z-10">
        <div className="flex justify-center mb-8">
          <div className="w-[68px] h-[68px] rounded-[20px] flex items-center justify-center shadow-premium bg-gradient-to-br from-blue-500 to-violet-600">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[26px] font-bold text-white mb-1 tracking-tight">
            Her Life Companion
          </h1>
          <p className="text-[13px] text-white/60">
            Email နဲ့ ဝင်ရောက်ပါ
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-3xl p-6 shadow-premium text-center">
            <div className="text-[52px] mb-3">📧</div>
            <h2 className="text-[18px] font-bold text-ink mb-2">
              Email ပို့ပြီးပါပြီ
            </h2>
            <p className="text-[13px] text-ink-muted mb-1">
              {email}
            </p>
            <p className="text-[13px] text-ink-muted mb-5">
              Email ကို ဖွင့်ပြီး အတည်ပြုချက် Link ကို နှိပ်ပါ။
            </p>
            <Button
              variant="ghost"
              fullWidth
              size="sm"
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> နောက်သို့
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-premium">
            <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
              Email
            </label>
            <div className="relative mb-3">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full pl-11 pr-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {error && (
              <div className="text-[12px] text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3">
                {error}
              </div>
            )}

            <Button fullWidth onClick={handleSubmit} disabled={loading}>
              {loading ? '...' : '📩 Magic Link ပို့မယ်'}
            </Button>

            <p className="text-[11px] text-ink-muted text-center mt-4 leading-relaxed">
              Password မလိုပါ — Email ထဲက Link နှိပ်ရုံပါ။
            </p>
          </div>
        )}

        <p className="text-center text-[11px] text-white/40 mt-6">
          Made with 💙
        </p>
      </div>
    </div>
  );
}
