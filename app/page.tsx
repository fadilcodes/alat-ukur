'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import LeaderboardTable from '@/components/dashboard/LeaderboardTable';
import LandingPage from '@/components/landing/LandingPage';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { Lock, Trophy, BookOpen, Compass, Award } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { isAuthenticated, user } = useAuthStore();
  const { main_quiz_completed } = useProgressStore();

  // Quiz Poin condition: User MUST be logged in AND completed 15 Latihan Soal
  const quizUnlocked = mounted && isAuthenticated && main_quiz_completed;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center font-sans">
        <div className="w-8 h-8 rounded-full border-4 border-[#10B981] border-t-transparent animate-spin" />
      </div>
    );
  }

  // If user is not authenticated, render opening Landing Page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // If authenticated, render Dashboard Home (Stat cards removed per user request)
  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-4xl w-full mx-auto space-y-8 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-xl mx-auto w-full pt-4">
          {/* Top Green Icon with Badge */}
          <div className="relative inline-block mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-[#10B981] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto">
              <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm2 4h12v2H6zm-2 4h16v2H4zm4 4h8v2H8z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-white text-[10px] font-black shadow-xs">
              ★
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Selamat Datang, <span className="text-[#10B981] font-black">{user?.username}</span>!
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-slate-600 tracking-tight">
              Dashboard Belajar Metrologi
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Vernier Caliper & Mikrometer Sekrup Presisi
            </p>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed font-medium">
            Pelajari teori, simulasikan alat ukur 2D, dan selesaikan Latihan Soal untuk mengumpulkan poin XP!
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2 max-w-xs mx-auto w-full">
            <Link
              href="/belajar"
              className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Ayo Belajar</span>
              <span>🚀</span>
            </Link>

            {quizUnlocked ? (
              <Link
                href="/quiz/endless"
                className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4 fill-current" />
                <span>Quiz Poin (Terbuka!)</span>
              </Link>
            ) : (
              <Link
                href="/quiz/endless"
                className="w-full py-3.5 rounded-2xl bg-slate-200/80 text-slate-500 font-bold text-sm border border-slate-300/50 flex flex-col items-center justify-center gap-0.5 hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-slate-600">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>Quiz Poin (Terkunci)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">
                  Selesaikan 15 Latihan Soal untuk membuka
                </span>
              </Link>
            )}
          </div>
        </section>

        {/* Leaderboard Card Section */}
        <section className="w-full pt-4">
          <LeaderboardTable />
        </section>
      </main>
    </div>
  );
}

