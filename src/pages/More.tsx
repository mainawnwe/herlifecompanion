import { useState, useEffect } from 'react';
import { LogOut, Copy, Check, Heart, UserPlus } from 'lucide-react';
import { Card, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
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
  const { partner, loadPartner, pairWithCode, unpair, loading: pairing } =
    useCoupleStore();

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [partnerInput, setPartnerInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [codeInput, setCodeInput] = useState('');

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

            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl px-4 py-3 border border-primary-100 text-center">
                <div className="text-[10px] text-ink-muted font-semibold uppercase tracking-wider mb-1">
                  မင်းရဲ့ Code
                </div>
                <div className="text-[24px] font-black text-primary en tracking-widest">
                  {profile?.pair_code ?? '------'}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="!px-3 !py-3"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="text-[11px] font-semibold text-ink-muted mb-2 pl-1 uppercase tracking-wide">
                ခလေးရဲ့ Code ထည့်ပါ
              </div>
              <div className="flex gap-2">
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handlePair()}
                  placeholder="ABC123"
                  maxLength={6}
                  className="flex-1 px-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-center text-[16px] font-bold tracking-widest uppercase outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-slate-300 en"
                />
                <Button
                  size="sm"
                  onClick={handlePair}
                  disabled={pairing}
                  className="!px-4"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
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

      {/* Sign Out */}
      <Card>
        <Button variant="danger" fullWidth onClick={handleSignOut}>
          <LogOut className="w-4 h-4" /> ထွက်မယ်
        </Button>
      </Card>

      <div className="text-center text-ink-muted text-[11px] py-3 pb-6">
        Made with 💙 for {profile?.display_name ?? '—'}
      </div>
    </>
  );
}