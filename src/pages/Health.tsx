import { WaterTracker } from '@/components/features/health/WaterTracker';
import { PeriodTracker } from '@/components/features/health/PeriodTracker';

export function HealthPage() {
  return (
    <>
      <PeriodTracker />
      <WaterTracker />
    </>
  );
}
