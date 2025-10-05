'use client';

import { useState, useRef, useEffect } from 'react';
import { Video, Bell, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/src/store/authStore';
import { toast } from 'sonner';

export function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/signin');
  };

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

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#252b3b] border border-gray-700 rounded-lg shadow-xl overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-white font-semibold truncate">{user?.name}</p>
                <p className="text-gray-400 text-sm truncate">{user?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#2a3142] transition-colors flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
