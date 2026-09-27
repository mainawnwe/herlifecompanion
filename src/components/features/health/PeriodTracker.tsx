import { Card, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { usePeriodStore } from '@/store/healthStore';
import { formatMM } from '@/lib/utils';

export function PeriodTracker() {
  const { records, markToday, clearAll, lastStart, nextStart, daysUntilNext } =
    usePeriodStore();

  const last = lastStart();
  const next = nextStart();
  const days = daysUntilNext();

  let statusText = 'ရာသီစတင်ရက် မှတ်ထားပါ 🌸';
  let statusVariant: 'violet' | 'gray' | 'pink' = 'gray';

  if (days !== null) {
    if (days > 0) {
      statusText = `${days} ရက်အကြာ ရာသီလာမယ်`;
      statusVariant = 'violet';
    } else if (days > -6) {
      statusText = 'ရာသီလာနေတဲ့ ကာလဖြစ်နိုင်';
      statusVariant = 'pink';
    } else {
      statusText = `${-days} ရက် ရာသီရက်ကျော်နေပြီ`;
      statusVariant = 'gray';
    }
  }

  return (
    <Card>
      <CardTitle icon="🌸">ရာသီစက်ဝန်း</CardTitle>

      {last && next ? (
        <>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[10px] text-ink-muted font-medium mb-0.5 uppercase tracking-wide">
                နောက်ဆုံး
              </div>
              <div className="text-[13px] font-semibold">{formatMM(last)}</div>
            </div>
            <div className="bg-violet-50 rounded-xl p-3 border border-violet-100">
              <div className="text-[10px] text-violet-600 font-medium mb-0.5 uppercase tracking-wide">
                ခန့်မှန်း
              </div>
              <div className="text-[13px] font-semibold text-violet-700">
                {formatMM(next)}
              </div>
            </div>
          </div>
          <div className="mb-3.5">
            <Badge variant={statusVariant}>{statusText}</Badge>
          </div>
        </>
      ) : (
        <div className="text-sm text-ink-muted mb-3.5">{statusText}</div>
      )}

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" fullWidth onClick={markToday}>
          📍 ဒီနေ့ စတင်
        </Button>
        {records.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm('ရာသီမှတ်တမ်း ရှင်းမှာလား?')) clearAll();
            }}
          >
            🗑️
          </Button>
        )}
      </div>
    </Card>
  );
}