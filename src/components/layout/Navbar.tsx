'use client';

import { Video, Bell } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#1a1f2e] border-b border-gray-800 px-8 flex items-center justify-between z-50">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <Video className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-white">ConnectPro</h1>
      </div>

      {/* Right Side - Notifications & Profile */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
          <Image
            src="/avatar-placeholder.png"
            alt="User avatar"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
}
