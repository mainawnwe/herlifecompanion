import { useState } from 'react';
import { Card, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/common/Input';
import { MoodPicker } from '@/components/features/journal/MoodPicker';
import { JournalList } from '@/components/features/journal/JournalList';
import { useJournalStore } from '@/store/journalStore';
import type { MoodValue } from '@/types';

export function JournalPage() {
  const addEntry = useJournalStore((s) => s.addEntry);
  const [mood, setMood] = useState<MoodValue>(3);
  const [text, setText] = useState('');

  const handleSave = () => {
    if (!text.trim()) {
      alert('စာလေး နည်းနည်း ရေးပါဦး 💗');
      return;
    }
    addEntry(text.trim(), mood);
    setText('');
    setMood(3);
  };

  return (
    <>
      <Card>
        <CardTitle icon="✍️">ဒီနေ့ ဘယ်လိုခံစားနေလဲ?</CardTitle>
        <div className="mb-3">
          <MoodPicker value={mood} onChange={setMood} />
        </div>
        <Textarea
          placeholder="ဒီနေ့အကြောင်း နည်းနည်းရေးထားလိုက်ပါ..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button fullWidth onClick={handleSave}>
          💾 သိမ်းမယ်
        </Button>
      </Card>

      <Card>
        <CardTitle icon="📖">မှတ်တမ်းများ</CardTitle>
        <JournalList />
      </Card>
    </>
  );
}
