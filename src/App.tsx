import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useCoupleStore } from '@/store/coupleStore';
import { useJournalStore } from '@/store/journalStore';
import { useTodoStore, useBucketStore, useDateStore } from '@/store/todoStore';
import { useWaterStore, usePeriodStore } from '@/store/healthStore';
import { useLoveNotesStore } from '@/store/loveNotesStore';
import { supabase } from '@/lib/supabase';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/Login';
import { SetupPage } from '@/pages/Setup';
import { HomePage } from '@/pages/Home';
import { JournalPage } from '@/pages/Journal';
import { HealthPage } from '@/pages/Health';
import { LovePage } from '@/pages/Love';
import { MorePage } from '@/pages/More';

export default function App() {
  const {
    user,
    initialized,
    recoveryMode,
    updatePassword,
    exitRecovery,
    init,
  } = useAuthStore();
  const { profile, loading, loadProfile } = useProfileStore();

  // Auth init
  useEffect(() => {
    init();
  }, [init]);

  // Load all data on login
  useEffect(() => {
    if (!user) return;
    (async () => {
      await loadProfile();
      await useCoupleStore.getState().loadPartner();
      await Promise.all([
        useJournalStore.getState().loadFromCloud(),
        useTodoStore.getState().loadFromCloud(),
        useBucketStore.getState().loadFromCloud(),
        useDateStore.getState().loadFromCloud(),
        usePeriodStore.getState().loadFromCloud(),
        useWaterStore.getState().loadFromCloud(),
      ]);
      await useLoveNotesStore.getState().loadAll();
    })();
  }, [user, loadProfile]);

  // Realtime subscription for love notes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('love_notes_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'love_notes',
          filter: `to_user=eq.${user.id}`,
        },
        () => {
          useLoveNotesStore.getState().loadAll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Loading
  if (!initialized || (user && loading && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-header">
        <div className="text-white text-center">
          <div className="text-5xl mb-3 animate-pulse">💙</div>
          <div className="text-sm opacity-70">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  // Password Recovery Mode
  if (recoveryMode) {
    return (
      <ResetPasswordScreen onUpdate={updatePassword} onCancel={exitRecovery} />
    );
  }

  if (!profile || !profile.display_name) return <SetupPage />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="health" element={<HealthPage />} />
          <Route path="love" element={<LovePage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// ═══════════════════════════════════════════════════
// Reset Password Screen
// ═══════════════════════════════════════════════════
function ResetPasswordScreen({
  onUpdate,
  onCancel,
}: {
  onUpdate: (pw: string) => Promise<{ error: string | null }>;
  onCancel: () => void;
}) {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (pw.length < 6) return setError('၆ လုံး အနည်းဆုံး');
    if (pw !== confirm) return setError('Password ၂ ခု မတူဘူး');

    setLoading(true);
    const res = await onUpdate(pw);
    setLoading(false);
    if (res.error) setError(res.error);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative gradient-header">
      <div className="relative w-full max-w-[400px] z-10">
        <div className="text-center mb-6">
          <div className="text-[48px] mb-2">🔑</div>
          <h1 className="text-[22px] font-bold text-white mb-1">
            Password အသစ် သတ်မှတ်ပါ
          </h1>
          <p className="text-[13px] text-white/60">
            ခလေးရဲ့ Password အသစ် ထည့်ပါ
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-premium">
          <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
            New Password
          </label>
          <input
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError(null);
            }}
            placeholder="••••••"
            className="w-full px-4 py-3 mb-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
          />

          <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Password ပြန်"
            className="w-full px-4 py-3 mb-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
          />

          {error && (
            <div className="text-[12px] text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-[14px] bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold text-sm shadow-[0_4px_14px_-4px_rgba(37,99,235,0.6)] active:scale-[0.97] disabled:opacity-50"
          >
            {loading ? '...' : '🔒 Password သိမ်းမယ်'}
          </button>

          <div className="text-center mt-4">
            <button
              onClick={onCancel}
              className="text-[12px] text-ink-muted hover:underline"
            >
              နောက်သို့
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}