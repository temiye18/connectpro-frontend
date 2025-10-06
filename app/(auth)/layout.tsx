'use client';

import { ReactNode } from 'react';
import { GuestGuard } from '@/src/components/guards/GuestGuard';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#1a1f2e]">
        {children}
      </div>
    </GuestGuard>
  );
}
