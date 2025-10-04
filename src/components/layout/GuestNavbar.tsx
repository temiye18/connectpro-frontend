'use client';

import { Video } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/Button';

export function GuestNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#1a1f2e] border-b border-gray-800 px-8 flex items-center justify-between z-50">
      {/* Logo & Brand */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <Video className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-white">ConnectPro</h1>
      </Link>

      {/* Sign In Button */}
      <Link href="/signin">
        <Button variant="outline" size="md">
          Sign In
        </Button>
      </Link>
    </nav>
  );
}
