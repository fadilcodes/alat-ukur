'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Compass, Sparkles, BookOpen, Trophy, ArrowRight, Layers, CheckCircle2, UserPlus, LogIn } from 'lucide-react';

import LeaderboardTable from '@/components/dashboard/LeaderboardTable';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none">
      {/* Header / Top Navigation Bar for Guests */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/20">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm2 4h12v2H6zm-2 4h16v2H4zm4 4h8v2H8z" />
              </svg>
            </div>
            <span className="font-extrabold text-base text-slate-800 tracking-tight">
              Belajar Alat Ukur
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500" />
              <span>Masuk</span>
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Akun</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center max-w-5xl w-full mx-auto px-4 py-12 md:py-16 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-[#047857] text-xs font-extrabold shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <span>Platform E-Learning & Simulator Metrologi Presisi</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Kuasai Pengukuran <span className="text-[#10B981]">Vernier Caliper</span> & <span className="text-[#10B981]">Mikrometer</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Pelajari teori metrologi presisi, berlatih membaca skala 2D/3D interaktif secara realtime, dan dapatkan poin XP di setiap latihan soal!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Mulai Belajar Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <span>Sudah Punya Akun? Masuk</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#10B981] flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Modul Belajar Terstruktur</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Pelajari fungsi rahang, skala utama, nonius/thimble, dan cara membaca ketelitian hingga 0,05mm & 0,01mm.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-xs">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Simulator 2D Interaktif</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Bebas geser rahang jangka sorong & putar thimble mikrometer dengan animasi 60fps yang presisi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shadow-xs">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Gamifikasi & Quiz Poin</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Dapatkan +5 XP untuk setiap jawaban benar di Latihan Soal dan buka fitur Quiz Poin untuk bersaing di Leaderboard.
            </p>
          </div>
        </div>

        {/* Leaderboard Showcase Section */}
        <section className="space-y-6 max-w-xl mx-auto w-full pt-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Papan Peringkat Realtime</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Siswa Terbaik & Leaderboard 🏆
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Bergabunglah sekarang, kumpulkan poin XP, dan rebut peringkat nomor 1!
            </p>
          </div>

          <LeaderboardTable />

          <div className="text-center pt-2">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              <span>Daftar & Rebut Peringkat #1 🚀</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-semibold">
        © 2026 Belajar Alat Ukur (Metrologi Industri). All rights reserved.
      </footer>
    </div>
  );
}
