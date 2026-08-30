'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { Menu, X, Star, Home, BookOpen, Hourglass, Edit3, Trophy, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getCompletedCount } = useProgressStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const userInitial = user?.username ? user.username.substring(0, 2).toUpperCase() : 'U';
  const xpValue = (user?.total_points ?? 0).toLocaleString('id-ID');
  const { completed, total } = getCompletedCount();
  const progressPercent = mounted ? Math.round((completed / total) * 100) : 0;

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
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
    <>
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 md:px-6 py-3 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Mobile Hamburger & Brand Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Visible only on mobile < md) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/80"
              aria-label="Buka Menu Navigasi"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4zm2 4h12v2H6zm-2 4h16v2H4zm4 4h8v2H8z" />
                </svg>
              </div>
              <span className="font-extrabold text-sm sm:text-base text-slate-800 tracking-tight">
                Belajar Alat Ukur
              </span>
            </Link>
          </div>

          {/* Right Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* XP Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F8F0] border border-[#D1F2E2] text-[#047857] font-bold text-xs shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-[#10B981] text-[#10B981]" />
                <span>{xpValue} XP</span>
              </div>

              {/* Avatar Circle */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center font-extrabold text-xs shadow-sm shrink-0">
                {userInitial}
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:flex p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/auth/login"
                className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Masuk</span>
              </Link>
              <Link
                href="/auth/register"
                className="px-3 sm:px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Daftar</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay (Visible on mobile when hamburger clicked) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Container */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 overflow-y-auto select-none">
            <div className="space-y-6">
              {/* Header & Close Button */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center text-white font-black text-xs">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M4 6h16v2H4zm2 4h12v2H6zm-2 4h16v2H4zm4 4h8v2H8z" />
                    </svg>
                  </div>
                  <span className="font-extrabold text-xs text-[#10B981] uppercase tracking-wider">
                    BELAJAR ALAT UKUR
                  </span>
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isAuthenticated && user ? (
                <>
                  {/* User Badge */}
                  <div className="bg-[#E8F8F0] border border-[#D1F2E2] p-3 rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                      {userInitial}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {user.username}
                      </span>
                      <span className="text-xs font-black text-[#047857] font-mono">
                        {xpValue} XP
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-400 uppercase tracking-wider">PROGRESS</span>
                      <span className="text-[#10B981]">{progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="space-y-1.5 pt-2">
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-3.5 py-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-colors ${
                        pathname === '/'
                          ? 'bg-[#E8F8F0] text-[#047857]'
                          : 'text-slate-600 hover:bg-slate-100'
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
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`px-3.5 py-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-colors ${
                            isActive
                              ? 'bg-[#E8F8F0] text-[#047857]'
                              : 'text-slate-600 hover:bg-slate-100'
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
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Masuk ke akun kamu untuk mengakses modul belajar, simulator, dan latihan soal.
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Masuk Akun</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Daftar Akun</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

