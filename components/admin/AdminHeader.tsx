'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { LogOut, User, ShieldCheck, Menu, Clock } from 'lucide-react';

interface AdminHeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function AdminHeader({
  title = 'Dashboard Overview',
  onMenuClick,
}: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const { user, logout } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {}
    logout();
    router.push('/login-dashboard');
    router.refresh();
  };

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
        </div>

        <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full ml-2">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Admin Session Active
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl font-medium">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>{todayStr}</span>
        </div>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-300 shadow-xs">
            {user?.username ? user.username.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-800 leading-tight">
              {user?.username || 'System Administrator'}
            </p>
            <p className="text-[10px] text-gray-500 leading-tight">
              {user?.email || 'admin@alatukur.id'}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition"
          title="Sign Out of Admin Portal"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
