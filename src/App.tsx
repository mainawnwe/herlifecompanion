import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { SetupPage } from '@/pages/Setup';
import { HomePage } from '@/pages/Home';
import { JournalPage } from '@/pages/Journal';
import { HealthPage } from '@/pages/Health';
import { LovePage } from '@/pages/Love';
import { MorePage } from '@/pages/More';

export default function App() {
  const profile = useProfileStore((s) => s.profile);

  // Profile မရှိသေးရင် Setup ပြရမယ်
  if (!profile) {
    return <SetupPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="health" element={<HealthPage />} />
          <Route path="love" element={<LovePage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}