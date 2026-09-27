import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen pb-[88px] relative">
      <Header />
      <main className="px-4 -mt-6 relative z-[3]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
