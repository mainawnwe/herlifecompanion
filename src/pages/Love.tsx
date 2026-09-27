import { Card, CardTitle } from '@/components/common/Card';
import { LoveNote } from '@/components/features/love/LoveNote';
import { ImportantDates } from '@/components/features/love/ImportantDates';
import { BucketList } from '@/components/features/love/BucketList';

export function LovePage() {
  return (
    <>
      <Card>
        <CardTitle icon="💌">ချစ်စကားလေးများ</CardTitle>
        <LoveNote />
      </Card>

      <ImportantDates />

      <BucketList />
    </>
  );
}
