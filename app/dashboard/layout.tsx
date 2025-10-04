import { ReactNode } from 'react';
import { Navbar } from '@/src/components/layout/Navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}
