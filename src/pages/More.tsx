import { useState, useEffect } from 'react';
import { LogOut, Copy, Check } from 'lucide-react';
import { Card, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { TodoList } from '@/components/features/todo/TodoList';
import { useProfileStore } from '@/store/profileStore';
import { useAuthStore } from '@/store/authStore';

export function MorePage() {
  const { profile, saveProfile, loading } = useProfileStore();
  const signOut = useAuthStore((s) => s.signOut);

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [partner, setPartner] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setName(profile?.display_name ?? '');
    setBirthday(profile?.birthday ?? '');
    setPartner(profile?.partner_name ?? '');
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('နာမည် ထည့်ပါ');
      return;
    }
    try {
      await saveProfile({
        display_name: name.trim(),
        birthday,
        partner_name: partner.trim(),
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

  const handleSignOut = async () => {
    if (!confirm('ထွက်မှာလား?')) return;
    await signOut();
  };

  return (
    <>
      <TodoList />

      {/* Pair Code Card */}
      <Card>
        <CardTitle icon="💞">Couple Linking</CardTitle>
        <p className="text-[12px] text-ink-muted mb-3 leading-relaxed">
          ဒီ Code ကို ချစ်သူကို ပေးပါ။ သူ့ဖုန်းမှာ ထည့်လိုက်ရင် နှစ်ယောက် ချိတ်ဆက်သွားမယ်။
        </p>

        <div className="flex items-center gap-2 mb-3">
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
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>

        {profile?.paired_with ? (
          <Badge variant="green">✅ ချိတ်ဆက်ပြီး</Badge>
        ) : (
          <Badge variant="gray">⏳ မချိတ်ဆက်ရသေး</Badge>
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
          value={partner}
          onChange={(e) => setPartner(e.target.value)}
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