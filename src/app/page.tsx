'use client';

import EngineerView from '@/components/EngineerView';
import Navbar from '@/components/Navbar';
import StakeholderView from '@/components/StakeholderView';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const { viewMode, prdData } = useAppStore();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] overflow-hidden bg-[var(--bg)]">
        {viewMode === 'engineer' && prdData ? <EngineerView /> : <StakeholderView />}
      </main>
    </div>
  );
}
