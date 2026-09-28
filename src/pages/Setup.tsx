import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useProfileStore } from '@/store/profileStore';

export function SetupPage() {
  const saveProfile = useProfileStore((s) => s.saveProfile);
  const loading = useProfileStore((s) => s.loading);

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('2006-09-30');
  const [partner, setPartner] = useState('');

   const handleSubmit = async () => {
    if (!name.trim()) {
      alert('သူ့နာမည် ထည့်ပါဦး 💙');
      return;
    }
    try {
      await saveProfile({
        display_name: name.trim(),
        birthday: birthday || '2006-09-30',
        partner_name: partner.trim() || 'ချစ်သူ',
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      alert(`သိမ်းလို့ မရပါ\n\n${msg}`);
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
            အချက်အလက် ဖြည့်ပါ
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-premium">
          <Input
            label="သူ့နာမည်"
            placeholder="ဥပမာ: ခလေး"
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
            label="မင်းနာမည် (ချစ်သူ)"
            placeholder="ဥပမာ: အကို"
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
          />

          <Button fullWidth className="mt-2" onClick={handleSubmit} disabled={loading}>
            {loading ? '...' : 'စတင်မယ် 💙'}
          </Button>
        </div>

        <p className="text-center text-[11px] text-white/40 mt-6">
          Made with 💙
        </p>
      </div>
    </div>
  );
}