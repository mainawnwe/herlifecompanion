import { useState, useEffect } from 'react';
import { Card, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { TodoList } from '@/components/features/todo/TodoList';
import { useProfileStore } from '@/store/profileStore';

export function MorePage() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const clearProfile = useProfileStore((s) => s.clearProfile);

  const [name, setName] = useState(profile?.name ?? '');
  const [birthday, setBirthday] = useState(profile?.birthday ?? '');
  const [partner, setPartner] = useState(profile?.partner ?? '');

  useEffect(() => {
    setName(profile?.name ?? '');
    setBirthday(profile?.birthday ?? '');
    setPartner(profile?.partner ?? '');
  }, [profile]);

  const handleSave = () => {
    if (!name.trim()) {
      alert('နာမည် ထည့်ပါ');
      return;
    }
    updateProfile({ name: name.trim(), birthday, partner: partner.trim() });
    alert('သိမ်းပြီးပါပြီ 💗');
  };

  const handleReset = () => {
    if (!confirm('အားလုံးကို ဖျက်ပြီး အစကနေ ပြန်စမှာလား?')) return;
    localStorage.clear();
    clearProfile();
    location.reload();
  };

  return (
    <>
      <TodoList />

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
        <Button fullWidth onClick={handleSave}>
          💾 သိမ်းမယ်
        </Button>
        <Button
          fullWidth
          variant="danger"
          size="sm"
          className="mt-2"
          onClick={handleReset}
        >
          ⚠️ အားလုံး ပြန်ရှင်းမယ်
        </Button>
      </Card>

      <div className="text-center text-ink-muted text-[11px] py-3 pb-6">
        Made with 💗 for {profile?.name ?? '—'}
      </div>
    </>
  );
}
