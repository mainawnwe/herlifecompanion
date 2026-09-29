import { useState, useEffect } from 'react';
import {
  LogOut,
  Copy,
  Check,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { Card, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { TodoList } from '@/components/features/todo/TodoList';
import { useProfileStore } from '@/store/profileStore';
import { useAuthStore } from '@/store/authStore';
import { useCoupleStore } from '@/store/coupleStore';
import { useJournalStore } from '@/store/journalStore';
import { useTodoStore, useBucketStore, useDateStore } from '@/store/todoStore';
import { usePeriodStore, useWaterStore } from '@/store/healthStore';
import { todayISO } from '@/lib/utils';

export function MorePage() {
  const { profile, saveProfile, loading } = useProfileStore();
  const signOut = useAuthStore((s) => s.signOut);
  const changePassword = useAuthStore((s) => s.changePassword);
  const {
    partner,
    loadPartner,
    pairWithCode,
    unpair,
    loading: pairing,
  } = useCoupleStore();

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [partnerInput, setPartnerInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  // Change Password Modal
  const [pwOpen, setPwOpen] = useState(false);

  useEffect(() => {
    setName(profile?.display_name ?? '');
    setBirthday(profile?.birthday ?? '');
    setPartnerInput(profile?.partner_name ?? '');
  }, [profile]);

  useEffect(() => {
    loadPartner();
  }, [loadPartner]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('နာမည် ထည့်ပါ');
      return;
    }
    try {
      await saveProfile({
        display_name: name.trim(),
        birthday,
        partner_name: partnerInput.trim(),
      });
      alert('သိမ်းပြီးပါပြီ 💙');
    } catch {
      alert('သိမ်းလို့ မရပါ');
    }
  };

  const handleCopyCode = async () => {
    if (!profile?.pair_code) return;
    try {
      await navigator.clipboard.writeText(profile.pair_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Copy လုပ်လို့ မရပါ');
    }
  };

  const handlePair = async () => {
    if (!codeInput.trim()) {
      alert('Code ထည့်ပါ');
      return;
    }
    const res = await pairWithCode(codeInput);
    alert(res.message);
    if (res.ok) setCodeInput('');
  };

  const handleUnpair = async () => {
    if (!confirm('ချိတ်ဆက်မှု ဖျက်မှာလား?')) return;
    await unpair();
  };

  const handleSignOut = async () => {
    if (!confirm('ထွက်မှာလား?')) return;
    useProfileStore.getState().clear();
    useJournalStore.setState({ entries: [], loaded: false });
    useTodoStore.setState({ todos: [] });
    useBucketStore.setState({ items: [] });
    useDateStore.setState({ dates: [] });
    usePeriodStore.setState({ records: [] });
    useWaterStore.setState({ date: todayISO(), count: 0, loaded: false });
    await signOut();
  };

  return (
    <>
      <TodoList />

      {/* Couple Linking */}
      <Card>
        <CardTitle icon="💞">Couple Linking</CardTitle>

        {partner ? (
          <>
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-200 mb-3 text-center">
              <div className="text-[32px] mb-1">💙</div>
              <div className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                ချိတ်ဆက်ပြီး
              </div>
              <div className="text-[16px] font-bold text-ink">
                {partner.display_name ?? partner.email ?? '—'}
              </div>
            </div>
            <Button variant="danger" size="sm" fullWidth onClick={handleUnpair}>
              🔓 ချိတ်ဆက်မှု ဖျက်
            </Button>
          </>
        ) : (
          <>
            <p className="text-[12px] text-ink-muted mb-3 leading-relaxed">
              ဒီ Code ကို ခလေးကို ပေးပါ။ သူ့ဖုန်းမှာ ထည့်လိုက်ရင်
              နှစ်ယောက် ချိတ်ဆက်သွားမယ်။
            </p>

            {/* My Code */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 min-w-0 bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl px-4 py-3 border border-primary-100 text-center">
                <div className="text-[10px] text-ink-muted font-semibold uppercase tracking-wider mb-1">
                  မင်းရဲ့ Code
                </div>
                <div className="text-[24px] font-black text-primary en tracking-widest">
                  {profile?.pair_code ?? '------'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-soft text-primary-dark flex items-center justify-center active:scale-95 transition-all"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Partner Code Input */}
            <div className="border-t border-slate-100 pt-4">
              <div className="text-[11px] font-semibold text-ink-muted mb-2 pl-1 uppercase tracking-wide">
                ခလေးရဲ့ Code ထည့်ပါ
              </div>

              <div className="flex gap-2 items-stretch">
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handlePair()}
                  placeholder="ABC123"
                  maxLength={6}
                  className="flex-1 min-w-0 px-3 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-center text-[16px] font-bold tracking-widest uppercase outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-slate-300 en"
                />
                <button
                  type="button"
                  onClick={handlePair}
                  disabled={pairing}
                  className="flex-shrink-0 px-4 rounded-[14px] bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold text-[12px] flex items-center gap-1.5 shadow-[0_4px_14px_-4px_rgba(37,99,235,0.6)] active:scale-[0.97] disabled:opacity-50 whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>ချိတ်</span>
                </button>
              </div>

              <div className="mt-2">
                <Badge variant="gray">⏳ မချိတ်ဆက်ရသေး</Badge>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Settings */}
      <Card>
        <CardTitle icon="⚙️">ဆက်တင်</CardTitle>
        <Input
          label="သူ့နာမည်"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="သူ့မွေးနေ့"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
        <Input
          label="မင်းနာမည်"
          value={partnerInput}
          onChange={(e) => setPartnerInput(e.target.value)}
        />
        <Button fullWidth onClick={handleSave} disabled={loading}>
          {loading ? '...' : '💾 သိမ်းမယ်'}
        </Button>
      </Card>

      {/* Security */}
      <Card>
        <CardTitle icon="🔐">လုံခြုံရေး</CardTitle>

        <div className="bg-slate-50 rounded-xl px-4 py-3 mb-3">
          <div className="text-[10px] text-ink-muted font-semibold uppercase tracking-wide mb-0.5">
            Email
          </div>
          <div className="text-[13px] font-semibold text-ink break-all">
            {profile?.email ?? '—'}
          </div>
        </div>

        <Button
          variant="ghost"
          fullWidth
          onClick={() => setPwOpen(true)}
          className="!justify-start"
        >
          <KeyRound className="w-4 h-4" />
          <span className="flex-1 text-left">Password ပြောင်းမယ်</span>
          <span className="text-ink-muted">›</span>
        </Button>
      </Card>

      {/* Sign Out */}
      <Card>
        <Button variant="danger" fullWidth onClick={handleSignOut}>
          <LogOut className="w-4 h-4" /> ထွက်မယ်
        </Button>
      </Card>

      <div className="text-center text-ink-muted text-[11px] py-3 pb-6">
        Made with 💙 for {profile?.display_name ?? '—'}
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        onSubmit={changePassword}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════
// Change Password Modal
// ═══════════════════════════════════════════════════
function ChangePasswordModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    current: string,
    newPw: string
  ) => Promise<{ error: string | null }>;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrent('');
      setNext('');
      setConfirm('');
      setError(null);
      setSuccess(false);
      setShowCurrent(false);
      setShowNext(false);
    }
  }, [open]);

  const handle = async () => {
    setError(null);

    if (!current) return setError('လက်ရှိ Password ထည့်ပါ');
    if (next.length < 6) return setError('Password အသစ် ၆ လုံး အနည်းဆုံး');
    if (next !== confirm) return setError('Password ၂ ခု မတူဘူး');
    if (current === next) return setError('Password အသစ်က အဟောင်းနဲ့ တူနေတယ်');

    setLoading(true);
    const res = await onSubmit(current, next);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-[15px] font-bold text-ink leading-tight">
              Password ပြောင်းမယ်
            </div>
            <div className="text-[10px] text-ink-muted">လုံခြုံရေးအတွက်</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-ink-muted hover:text-ink p-1 rounded-lg hover:bg-slate-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {success ? (
        <div className="text-center py-6">
          <div className="text-[48px] mb-2">✅</div>
          <div className="text-[15px] font-bold text-emerald-600 mb-1">
            Password ပြောင်းပြီးပါပြီ
          </div>
          <div className="text-[12px] text-ink-muted">
            အသစ်နဲ့ ပြန်ဝင်ရန် အသင့်ပါ
          </div>
        </div>
      ) : (
        <>
          <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
            လက်ရှိ Password
          </label>
          <div className="relative mb-3">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={current}
              onChange={(e) => {
                setCurrent(e.target.value);
                setError(null);
              }}
              placeholder="••••••"
              className="w-full px-4 py-3 pr-11 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showCurrent ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
            Password အသစ်
          </label>
          <div className="relative mb-3">
            <input
              type={showNext ? 'text' : 'password'}
              value={next}
              onChange={(e) => {
                setNext(e.target.value);
                setError(null);
              }}
              placeholder="၆ လုံး အနည်းဆုံး"
              className="w-full px-4 py-3 pr-11 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <button
              type="button"
              onClick={() => setShowNext((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showNext ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <label className="block text-[11px] font-semibold text-ink-muted mb-1.5 pl-1 uppercase tracking-wide">
            Confirm Password
          </label>
          <div className="relative mb-3">
            <input
              type="password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handle()}
              placeholder="Password ပြန်"
              className="w-full px-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-ink text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {error && (
            <div className="text-[12px] text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3">
              {error}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <Button variant="ghost" fullWidth onClick={onClose}>
              မလုပ်တော့
            </Button>
            <Button fullWidth onClick={handle} disabled={loading}>
              {loading ? '...' : '🔒 သိမ်းမယ်'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}