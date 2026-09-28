import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/Login';
import { SetupPage } from '@/pages/Setup';
import { HomePage } from '@/pages/Home';
import { JournalPage } from '@/pages/Journal';
import { HealthPage } from '@/pages/Health';
import { LovePage } from '@/pages/Love';
import { MorePage } from '@/pages/More';

export default function App() {
  const { user, initialized, init } = useAuthStore();
  const { profile, loading, loadProfile } = useProfileStore();

  useEffect(() => {
    init();
  }, [init]);

  // User ရှိလာရင် Profile load
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  // Loading
  if (!initialized || (user && loading && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-header">
        <div className="text-white text-center">
          <div className="text-5xl mb-3 animate-pulse">💙</div>
          <div className="text-sm opacity-70">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;
  if (!profile || !profile.display_name) return <SetupPage />;

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