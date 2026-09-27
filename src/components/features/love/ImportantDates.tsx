import { useState } from 'react';
import { Card, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input, Empty } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { useDateStore } from '@/store/todoStore';
import { nextOccurrence, daysBetween } from '@/lib/utils';

export function ImportantDates() {
  const { dates, addDate, removeDate, sortedByUpcoming } = useDateStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const sorted = sortedByUpcoming();

  const handleAdd = () => {
    if (!title.trim() || !date) {
      alert('ခေါင်းစဉ်နဲ့ရက် ထည့်ပါ');
      return;
    }
    addDate(title.trim(), date);
    setTitle('');
    setDate('');
    setOpen(false);
  };

  return (
    <Card>
      <CardTitle icon="📅">အရေးကြီးရက်များ</CardTitle>

      {sorted.length === 0 ? (
        <Empty emoji="📅">ရက်များ မထည့်ရသေးပါ</Empty>
      ) : (
        <div className="mb-3">
          {sorted.map((d) => {
            const days = daysBetween(new Date(), nextOccurrence(d.date));
            return (
              <div
                key={d.id}
                className="flex items-center gap-3 py-3 border-b border-border last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {d.title}
                  </div>
                  <div className="text-[11px] text-ink-muted">{d.date}</div>
                </div>
                <Badge variant="pink">{days} ရက်</Badge>
                <button
                  type="button"
                  onClick={() => removeDate(d.id)}
                  className="text-[#D1A7BD] text-lg bg-transparent border-none cursor-pointer hover:text-red-400"
                  aria-label="Delete"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        fullWidth
        onClick={() => setOpen(true)}
      >
        ➕ ရက်အသစ်ထည့်
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="📅 ရက်အသစ်ထည့်">
        <Input
          label="ခေါင်းစဉ်"
          placeholder="ဥပမာ: ချစ်သူများနေ့"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="ရက်စွဲ"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setOpen(false)}
          >
            မလုပ်တော့
          </Button>
          <Button fullWidth onClick={handleAdd}>
            သိမ်းမယ်
          </Button>
        </div>
      </Modal>
    </Card>
  );
}
