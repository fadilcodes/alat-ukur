'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { BookOpen, Hourglass, Edit3, Star, Home, LogOut, LogIn, UserPlus, Trophy } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getCompletedCount } = useProgressStore();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { completed, total } = getCompletedCount();
  const progressPercent = mounted ? Math.round((completed / total) * 100) : 0;

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const navItems = [
    { name: 'Modul Belajar', href: '/belajar', icon: BookOpen },
    { name: 'Latihan Simulasi', href: '/simulasi', icon: Hourglass },
    { name: 'Latihan Soal', href: '/quiz/main', icon: Edit3 },
    { name: 'Quiz Poin', href: '/quiz/endless', icon: Trophy },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-[#F8FAF9] border-r border-slate-200/70 flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-40">
      <div className="p-5 space-y-6">
        {/* Brand Logo & Header */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm2 4h12v2H6zm-2 4h16v2H4zm4 4h8v2H8z" />
            </svg>
          </div>
          <span className="font-black text-sm text-[#10B981] tracking-wider uppercase block">
            BELAJAR ALAT UKUR
          </span>
        </Link>

        {isAuthenticated ? (
          <>
            {/* Progress Bar Section (Visible only when logged in) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400 uppercase tracking-wider">PROGRESS</span>
                <span className="text-[#10B981]">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Navigation Menu (Visible only when logged in) */}
            <nav className="space-y-2 pt-2">
              <Link
                href="/"
                className={`px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-bold transition-all ${
                  pathname === '/'
                    ? 'bg-slate-200/70 text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
              >
                <Home className={`w-4 h-4 ${pathname === '/' ? 'text-[#10B981]' : 'text-slate-400'}`} />
                <span>Dashboard Home</span>
              </Link>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-slate-200/70 text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </>
        ) : (
          /* Guest Info Card & Auth CTAs */
          <div className="space-y-4 pt-4 border-t border-slate-200/60">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Silakan masuk ke akun kamu untuk mengakses modul belajar, simulator, dan latihan soal.
            </p>
            <div className="space-y-2">
              <Link
                href="/auth/login"
                className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Akun</span>
              </Link>
              <Link
                href="/auth/register"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer User Profile / XP Card */}
      {isAuthenticated && user && (
        <div className="p-5 space-y-3">
          <div className="bg-[#E8F8F0] border border-[#D1F2E2] rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block leading-tight">
                  {user.username}
                </span>
                <span className="text-sm font-black text-[#047857] font-mono leading-none">
                  {(user.total_points ?? 0).toLocaleString('id-ID')} XP
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      )}
    </aside>
  );
}

