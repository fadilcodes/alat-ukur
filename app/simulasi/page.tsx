'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SeamlessSimulationArea from '@/components/simulation/SeamlessSimulationArea';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { Lock, LogIn } from 'lucide-react';

export default function SimulasiPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { isAuthenticated } = useAuthStore();

  if (mounted && !isAuthenticated) {
    return (
      <main className="flex-1 p-6 md:p-8 max-w-xl w-full mx-auto flex items-center justify-center min-h-[70vh]">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6 w-full font-sans">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#10B981] mx-auto flex items-center justify-center shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#10B981] bg-[#E8F8F0] px-3 py-1 rounded-full border border-[#D1F2E2]">
              Akses Terkunci
            </span>
            <h2 className="text-2xl font-black text-slate-900">Silakan Masuk ke Akun</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
              Menu Latihan Simulasi 2D hanya dapat diakses oleh siswa atau pengguna yang sudah masuk ke akun.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/auth/login"
              className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all inline-flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Akun Sekarang</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
      <div className="space-y-0.5">
        <span className="text-xs font-black uppercase tracking-wider text-[#10B981] block">
          LATIHAN SIMULASI
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          Simulator Pengukuran
        </h1>
      </div>

      <SeamlessSimulationArea />
    </main>
  );
}

