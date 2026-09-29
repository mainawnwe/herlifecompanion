import { useState } from 'react';
import { Heart, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';

type Screen = 'signin' | 'signup' | 'forgot';

export function LoginPage() {
  const { signIn, signUp, sendResetLink, loading } = useAuthStore();

  const [screen, setScreen] = useState<Screen>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignIn = async () => {
    setError(null);
    if (!emailValid) return setError('Email မှန်အောင် ထည့်ပါ');
    if (password.length < 6) return setError('Password ၆ လုံး အနည်းဆုံး');
    const res = await signIn(email.trim(), password);
    if (res.error) setError(res.error);
  };

  const handleSignUp = async () => {
    setError(null);
    if (!emailValid) return setError('Email မှန်အောင် ထည့်ပါ');
    if (password.length < 6) return setError('Password ၆ လုံး အနည်းဆုံး');
    if (password !== confirm) return setError('Password ၂ ခု မတူဘူး');
    const res = await signUp(email.trim(), password);
    if (res.error) return setError(res.error);
    setInfo('Account ဖန်တီးပြီးပါပြီ — Sign In လုပ်ပါ 💙');
    setScreen('signin');
    setPassword('');
    setConfirm('');
  };

  const handleForgot = async () => {
    setError(null);
    setInfo(null);
    if (!emailValid) return setError('Email မှန်အောင် ထည့်ပါ');
    const res = await sendResetLink(email.trim());
    if (res.error) return setError(res.error);
    setInfo('Password reset link ကို Email သို့ ပို့ပြီးပါပြီ 💙');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 overflow-y-auto relative gradient-header">
      <div className="absolute top-1/4 -left-24 w-72 h-72 rounded-full glow-blue pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-72 h-72 rounded-full glow-violet pointer-events-none" />

      <div className="relative w-full max-w-[400px] z-10">
        <div className="flex justify-center mb-6">
          <div className="w-[68px] h-[68px] rounded-[20px] flex items-center justify-center shadow-premium bg-gradient-to-br from-blue-500 to-violet-600">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-[26px] font-bold text-white mb-1 tracking-tight">
            Her Life Companion
          </h1>
          <p className="text-[13px] text-white/60">
            {screen === 'signin' && 'ဝင်ရောက်ပါ'}
            {screen === 'signup' && 'Account အသစ် ဖန်တီးပါ'}
            {screen === 'forgot' && 'Password ပြန်ရယူပါ'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-premium">
          {/* ═══ FORGOT PASSWORD ═══ */}
          {screen === 'forgot' && (
            <>
              <div className="text-center mb-4">
                <div className="text-[44px] mb-2">🔑</div>
                <p className="text-[13px] text-ink-muted">
                  Email ထည့်ပါ — Password Reset Link ပို့ပါမယ်
                </p>
              </div>

              <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
                Email
              </label>
              <div className="relative mb-3">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleForgot()}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              {error && (
                <div className="text-[12px] text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3">
                  {error}
                </div>
              )}
              {info && (
                <div className="text-[12px] text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2 mb-3">
                  {info}
                </div>
              )}

              <Button fullWidth onClick={handleForgot} disabled={loading}>
                {loading ? '...' : '📩 Reset Link ပို့မယ်'}
              </Button>

              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setScreen('signin');
                    setError(null);
                    setInfo(null);
                  }}
                  className="text-[12px] text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Sign In သို့ ပြန်
                </button>
              </div>
            </>
          )}

          {/* ═══ SIGN IN ═══ */}
          {screen === 'signin' && (
            <>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
                Email
              </label>
              <div className="relative mb-3">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
                Password
              </label>
              <div className="relative mb-3">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                  placeholder="••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div className="text-right mb-3">
                <button
                  onClick={() => {
                    setScreen('forgot');
                    setError(null);
                    setInfo(null);
                  }}
                  className="text-[11px] text-primary font-semibold hover:underline"
                >
                  🔑 Password မေ့နေလား?
                </button>
              </div>

              {error && (
                <div className="text-[12px] text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3">
                  {error}
                </div>
              )}
              {info && (
                <div className="text-[12px] text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2 mb-3">
                  {info}
                </div>
              )}

              <Button fullWidth onClick={handleSignIn} disabled={loading}>
                {loading ? '...' : '🔑 ဝင်မယ်'}
              </Button>

              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setScreen('signup');
                    setError(null);
                    setInfo(null);
                  }}
                  className="text-[12px] text-primary font-semibold hover:underline"
                >
                  Account မရှိဘူးလား? → ဖန်တီးမယ်
                </button>
              </div>
            </>
          )}

          {/* ═══ SIGN UP ═══ */}
          {screen === 'signup' && (
            <>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
                Email
              </label>
              <div className="relative mb-3">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
                Password
              </label>
              <div className="relative mb-3">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="၆ လုံး အနည်းဆုံး"
                  className="w-full pl-11 pr-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative mb-3">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
                  placeholder="Password ပြန်"
                  className="w-full pl-11 pr-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              {error && (
                <div className="text-[12px] text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3">
                  {error}
                </div>
              )}

              <Button fullWidth onClick={handleSignUp} disabled={loading}>
                {loading ? '...' : '✨ Account ဖန်တီး'}
              </Button>

              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setScreen('signin');
                    setError(null);
                  }}
                  className="text-[12px] text-primary font-semibold hover:underline"
                >
                  ← ဝင်ရောက်ရန် ပြန်သွား
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-white/40 mt-6">
          Made with 💙
        </p>
      </div>
    </div>
  );
}