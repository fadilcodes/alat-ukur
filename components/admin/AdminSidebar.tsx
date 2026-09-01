'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Sliders,
  BookOpen,
  HelpCircle,
  Shield,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';

const menuItems = [
  {
    title: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'User Monitoring',
    href: '/admin/users',
    icon: Users,
    badge: 'Live',
  },
  {
    title: 'Site Settings',
    href: '/admin/settings',
    icon: Sliders,
    badge: 'CMS',
  },
  {
    title: 'Modules CMS',
    href: '/admin/modules',
    icon: BookOpen,
    badge: 'CMS',
  },
  {
    title: 'Quiz Questions',
    href: '/admin/quizzes',
    icon: HelpCircle,
    badge: 'CRUD',
  },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function AdminSidebar({ mobileOpen = false, setMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen text-slate-300 select-none">
      {/* Top Branding Section */}
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600/20 border border-emerald-500/40 rounded-xl flex items-center justify-center text-emerald-400 shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight block text-sm">
                Alat Ukur Admin
              </span>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold block">
                Management CMS
              </span>
            </div>
          </div>

          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="px-3 py-6 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Main Navigation
          </div>

          {menuItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.title}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide ${
                        isActive
                          ? 'bg-emerald-700 text-emerald-100'
                          : 'bg-slate-800 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
          <span>Supabase DB</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            ● Connected
          </span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition border border-slate-700/60"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            View Live Website
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-semibold">
            Public
          </span>
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen z-40">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 lg:hidden flex">
          <div className="relative animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setMobileOpen && setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
