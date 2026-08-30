'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import confetti from 'canvas-confetti';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { GeneratedQuizQuestion } from '@/app/api/quiz/generate/route';
import { Award, CheckCircle2, XCircle, RefreshCw, Trophy, ArrowRight, Sparkles, AlertCircle, Lock, LogIn } from 'lucide-react';

export default function EndlessQuizPage() {
  const { user, isAuthenticated, updatePoints } = useAuthStore();
  const { main_quiz_completed } = useProgressStore();

  const [mounted, setMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [questionData, setQuestionData] = useState<GeneratedQuizQuestion | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [pointDelta, setPointDelta] = useState<number | null>(null);
  const [sourceTag, setSourceTag] = useState<string>('gemini');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch next question from Gemini API route
  const fetchNextQuestion = async () => {
    setLoading(true);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setPointDelta(null);

    try {
      const res = await fetch('/api/quiz/generate', { method: 'POST' });
      const data = await res.json();
      if (data.question) {
        setQuestionData(data.question);
        setSourceTag(data.source || 'gemini');
      }
    } catch (err) {
      console.error('Failed to load Endless Quiz question:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && isAuthenticated && main_quiz_completed) {
      fetchNextQuestion();
    }
  }, [mounted, isAuthenticated, main_quiz_completed]);

  const isQuizUnlocked = mounted && isAuthenticated && main_quiz_completed;

  if (mounted && !isQuizUnlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow max-w-xl w-full mx-auto px-4 py-12 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6 w-full select-none">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-xs">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Quiz Poin Terkunci
              </span>
              <h2 className="text-2xl font-black text-slate-900">Syarat Pembuka Quiz Poin</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
                Fitur Quiz Poin mode tak terbatas hanya dapat diakses setelah kamu menyelesaikan 15 Latihan Soal Evaluasi!
              </p>
            </div>

            {/* Checklist */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-3 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isAuthenticated ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                  ✓
                </div>
                <span className={isAuthenticated ? 'text-emerald-700' : 'text-slate-500'}>
                  1. Masuk ke Akun / Login ({isAuthenticated ? 'Sudah Login' : 'Belum Login'})
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${main_quiz_completed ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                  ✓
                </div>
                <span className={main_quiz_completed ? 'text-emerald-700' : 'text-slate-500'}>
                  2. Selesaikan 15 Latihan Soal ({main_quiz_completed ? 'Sudah Selesai' : 'Belum Selesai'})
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {!isAuthenticated ? (
                <Link
                  href="/auth/login"
                  className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Akun Sekarang</span>
                </Link>
              ) : (
                <Link
                  href="/quiz/main"
                  className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Ke Latihan Soal (15 Soal)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleSelect = (idx: number) => {
    if (!isSubmitted) setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || !questionData) return;
    setIsSubmitted(true);

    const isCorrect = selectedOpt === questionData.correctAnswerIndex;
    if (isCorrect) {
      setPointDelta(10);
      updatePoints(10);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } else {
      setPointDelta(-5);
      updatePoints(-5);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Endless Quiz (Gemini API)
            </div>
            <h1 className="text-2xl font-black">Mode Mode Tanpa Batas</h1>
            <p className="text-xs text-slate-300">
              Benar: <strong className="text-emerald-400">+10 Poin</strong> | Salah: <strong className="text-red-400">-5 Poin</strong>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Total Poin Kamu</span>
            <span className="text-3xl font-black text-amber-400 font-mono">{user?.total_points ?? 0}</span>
          </div>
        </div>

        {/* Quiz Content Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700">Membuat Soal Baru via Gemini AI Engine...</p>
              <p className="text-xs text-slate-400">Menghasilkan konteks metrologi presisi secara real-time</p>
            </div>
          ) : questionData ? (
            <>
              {/* Question Header Tag */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Tool: {questionData.toolType === 'vernier' ? 'Jangka Sorong' : 'Mikrometer Sekrup'}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded">
                  Source: {sourceTag === 'gemini' ? '✨ Gemini AI' : 'Preset Metrologi'}
                </span>
              </div>

              {/* Question Title */}
              <h2 className="text-lg font-bold text-slate-900 leading-relaxed">
                {questionData.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {questionData.options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                  if (selectedOpt === idx) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  }

                  if (isSubmitted) {
                    if (idx === questionData.correctAnswerIndex) {
                      btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                    } else if (selectedOpt === idx && idx !== questionData.correctAnswerIndex) {
                      btnStyle = 'bg-red-500 border-red-500 text-white font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border font-medium text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && idx === questionData.correctAnswerIndex && (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                      {isSubmitted && selectedOpt === idx && idx !== questionData.correctAnswerIndex && (
                        <XCircle className="w-5 h-5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Point Feedback Badge */}
              {isSubmitted && pointDelta !== null && (
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    pointDelta > 0
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-extrabold text-sm block">
                      {pointDelta > 0 ? '🎉 Benar! +10 Poin Leaderboard' : '❌ Kurang Tepat! -5 Poin Leaderboard'}
                    </span>
                    <p className="text-xs">{questionData.explanation}</p>
                  </div>
                  <span className="text-2xl font-black font-mono">
                    {pointDelta > 0 ? '+10' : '-5'}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOpt === null}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-colors"
                  >
                    Kirim Jawaban
                  </button>
                ) : (
                  <button
                    onClick={fetchNextQuestion}
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
                  >
                    <span>Generate Soal Berikutnya (AI)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p>Gagal memuat soal. Silakan coba kembali.</p>
              <button
                onClick={fetchNextQuestion}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
