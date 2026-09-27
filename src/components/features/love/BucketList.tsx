import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Empty } from '@/components/common/Input';
import { useBucketStore } from '@/store/todoStore';
import { cn } from '@/lib/utils';

export function BucketList() {
  const { items, addItem, toggleItem, removeItem } = useBucketStore();
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    addItem(text.trim());
    setText('');
  };

  return (
    <Card>
      <CardTitle icon="🎯">အတူလုပ်ချင်တာများ</CardTitle>

      {items.length === 0 ? (
        <Empty emoji="🎯">အတူလုပ်ချင်တာတွေ ထည့်ကြရအောင်</Empty>
      ) : (
        <div className="mb-3">
          {items.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggleItem(b.id)}
                className={cn(
                  'w-[22px] h-[22px] rounded-md border-[1.5px] flex-shrink-0',
                  'flex items-center justify-center transition-all cursor-pointer text-xs',
                  b.done
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-slate-300 hover:border-primary'
                )}
                aria-label="Toggle"
              >
                {b.done && '✓'}
              </button>
              <span
                className={cn(
                  'flex-1 text-sm',
                  b.done && 'line-through text-ink-muted'
                )}
              >
                {b.text}
              </span>
              <button
                type="button"
                onClick={() => removeItem(b.id)}
                className="text-slate-300 text-lg bg-transparent border-none cursor-pointer hover:text-red-400 leading-none"
                aria-label="Delete"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="ဥပမာ: ပင်လယ်ကမ်းခြေသွားမယ်"
          className="flex-1 px-4 py-3 rounded-[14px] border-[1.5px] border-slate-200 bg-white text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-slate-400"
        />
        <Button size="sm" onClick={handleAdd} className="!px-4">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}