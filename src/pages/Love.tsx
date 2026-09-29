import { useEffect } from 'react';
import { Card, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { LoveNote } from '@/components/features/love/LoveNote';
import { SendLoveNote } from '@/components/features/love/SendLoveNote';
import { ReceivedNotes } from '@/components/features/love/ReceivedNotes';
import { ImportantDates } from '@/components/features/love/ImportantDates';
import { BucketList } from '@/components/features/love/BucketList';
import { useLoveNotesStore } from '@/store/loveNotesStore';
import { useCoupleStore } from '@/store/coupleStore';

export function LovePage() {
  const { loadAll, unseenCount } = useLoveNotesStore();
  const loadPartner = useCoupleStore((s) => s.loadPartner);

  useEffect(() => {
    loadPartner();
    loadAll();
  }, [loadPartner, loadAll]);

  return (
    <>
      {/* Realtime: Send */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <CardTitle icon="💌" className="mb-0">
            ချစ်စကား ပို့မယ်
          </CardTitle>
          <Badge variant="blue">⚡ Live</Badge>
        </div>
        <SendLoveNote />
      </Card>

      {/* Realtime: Received */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <CardTitle icon="📥" className="mb-0">
            ငါ့ဆီ ရောက်တဲ့ စာများ
          </CardTitle>
          {unseenCount > 0 && (
            <Badge variant="violet">{unseenCount} ခု အသစ်</Badge>
          )}
        </div>
        <ReceivedNotes />
      </Card>

      {/* Random Notes */}
      <Card>
        <CardTitle icon="💙">ချစ်စကားလေးများ</CardTitle>
        <LoveNote />
      </Card>

      <ImportantDates />
      <BucketList />
    </>
  );
}