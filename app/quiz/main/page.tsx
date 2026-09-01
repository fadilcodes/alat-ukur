'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import confetti from 'canvas-confetti';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { createClient } from '@/lib/supabase/client';
import { Trophy, CheckCircle2, ArrowRight, XCircle, RefreshCw, HelpCircle, Sparkles } from 'lucide-react';

interface Question {
  id: string | number;
  section: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function MainQuizPage() {
  const supabase = createClient();
  const { isAuthenticated, updatePoints } = useAuthStore();
  const { main_quiz_completed, main_quiz_score, main_quiz_attempts, setMainQuizCompleted } = useProgressStore();

  const [mounted, setMounted] = useState(false);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchDynamicQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted: Question[] = data.map((q, idx) => {
          const options = [q.option_a, q.option_b, q.option_c, q.option_d];
          const correctKeyMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
          const correctIdx = correctKeyMap[q.correct_answer?.toUpperCase()] ?? 0;

          let sectionName = 'Vernier Caliper';
          if (idx >= 5 && idx < 10) sectionName = 'Micrometer';
          if (idx >= 10) sectionName = 'Campuran';

          return {
            id: q.id || idx + 1,
            section: sectionName,
            question: q.question_text,
            options: options,
            correct: correctIdx,
            explanation: q.explanation || 'Jawaban berdasarkan analisis metrologi presisi industri.',
          };
        });

        setQuestionsList(formatted);
        randomizeQuestions(formatted);
      } else {
        setQuestionsList(FALLBACK_QUESTIONS);
        randomizeQuestions(FALLBACK_QUESTIONS);
      }
    } catch (err) {
      console.error('Error loading quiz questions from database:', err);
      setQuestionsList(FALLBACK_QUESTIONS);
      randomizeQuestions(FALLBACK_QUESTIONS);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const randomizeQuestions = (sourceQuestions: Question[]) => {
    const randomized = sourceQuestions.map((q) => {
      const originalCorrectText = q.options[q.correct];
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);
      return {
        ...q,
        options: shuffledOptions,
        correct: newCorrectIndex,
      };
    });
    setShuffledQuestions(randomized);
  };

  useEffect(() => {
    setMounted(true);
    fetchDynamicQuestions();
  }, []);

  const handleRetryAttempt = () => {
    randomizeQuestions(questionsList);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setIsCompleted(false);
    setScore(0);
    setIsRetrying(true);
  };

  const isQuizUnlocked = mounted && isAuthenticated;
  const attemptsCount = main_quiz_attempts || 0;
  const isAttemptsExhausted = attemptsCount >= 2 && !isRetrying;

  if (mounted && !isQuizUnlocked) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow max-w-xl w-full mx-auto px-4 py-12 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6 w-full">
            <div className="w-16 h-16 rounded-3xl bg-[#E8F8F0] text-[#10B981] mx-auto flex items-center justify-center shadow-xs">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#10B981] bg-[#E8F8F0] px-3 py-1 rounded-full border border-[#D1F2E2]">
                Akses Terkunci
              </span>
              <h2 className="text-2xl font-black text-slate-900">Silakan Masuk ke Akun</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
                Menu Latihan Soal hanya dapat diakses oleh pengguna yang sudah masuk ke akun.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/auth/login"
                className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all inline-flex items-center justify-center gap-2"
              >
                Masuk Akun Sekarang
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const activeQuestions = shuffledQuestions.length > 0 ? shuffledQuestions : questionsList;
  const q = activeQuestions[currentIdx] || FALLBACK_QUESTIONS[0];

  const handleSelectOpt = (idx: number) => {
    if (!isSubmitted) setSelectedOpt(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOpt === null) return;
    setIsSubmitted(true);
    if (selectedOpt === q.correct) {
      updatePoints(10);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleNextQuestion = () => {
    if (selectedOpt === null) return;

    const newAnswers = [...userAnswers, selectedOpt];
    setUserAnswers(newAnswers);

    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      let correctCount = 0;
      newAnswers.forEach((ans, index) => {
        if (ans === activeQuestions[index].correct) {
          correctCount++;
        }
      });

      const finalPercentage = Math.round((correctCount / activeQuestions.length) * 100);
      setScore(finalPercentage);
      setIsCompleted(true);
      setIsRetrying(false);
      setMainQuizCompleted(finalPercentage);

      confetti({ particleCount: 120, spread: 80 });
    }
  };

  const hasAlreadyCompleted = mounted && main_quiz_completed && attemptsCount >= 1 && !isRetrying && !isCompleted;
  const displayScore = isCompleted ? score : (main_quiz_score ?? 100);

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        {loadingQuestions ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#10B981]" />
            <p className="text-sm font-medium">Memuat soal latihan dari database...</p>
          </div>
        ) : !isCompleted && !hasAlreadyCompleted && !isAttemptsExhausted ? (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            {/* Header Progress & Attempt Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    Latihan Soal Evaluasi
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      Dynamic CMS
                    </span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Kesempatan Ke-{attemptsCount >= 1 ? 2 : 1} dari 2
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#E8F8F0] text-[#047857]">
                  {q.section}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {currentIdx + 1} / {activeQuestions.length}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-base md:text-lg font-bold text-slate-800 leading-relaxed">
              {currentIdx + 1}. {q.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let btnStyle = 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50';

                if (selectedOpt === idx) {
                  btnStyle = 'bg-[#E8F8F0] border-[#10B981] text-[#047857] font-bold shadow-2xs';
                }

                if (isSubmitted) {
                  if (idx === q.correct) {
                    btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-md';
                  } else if (selectedOpt === idx && idx !== q.correct) {
                    btnStyle = 'bg-red-500 border-red-500 text-white font-bold shadow-md';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOpt(idx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-2xl border font-medium text-xs md:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && idx === q.correct && (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                    {isSubmitted && selectedOpt === idx && idx !== q.correct && (
                      <XCircle className="w-5 h-5 text-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Realtime Answer Feedback & Explanation Card */}
            {isSubmitted && (
              <div
                className={`p-4 rounded-2xl border space-y-1 text-xs ${
                  selectedOpt === q.correct
                    ? 'bg-[#E8F8F0] border-[#D1F2E2] text-[#047857]'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 font-black">
                  {selectedOpt === q.correct ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>Jawaban Benar! 🎉 (+10 XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>Jawaban Kurang Tepat ❌</span>
                    </>
                  )}
                </div>
                <div className="pt-1 leading-relaxed">
                  <strong className="block font-bold">Penjelasan Pembacaan:</strong>
                  <p>{q.explanation}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              {!isSubmitted ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedOpt === null}
                  className="px-7 py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] disabled:opacity-40 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <span>Jawab Soal</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-7 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>
                    {currentIdx + 1 < activeQuestions.length ? 'Soal Berikutnya' : 'Selesaikan Quiz!'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Result Summary Card */
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-6 select-none">
            <div className="w-20 h-20 rounded-full bg-[#E8F8F0] text-[#10B981] mx-auto flex items-center justify-center shadow-2xs">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#10B981] bg-[#E8F8F0] px-3 py-1 rounded-full border border-[#D1F2E2]">
                {attemptsCount >= 2 ? 'Latihan Soal Selesai (2/2 Kesempatan Terpakai)' : 'Latihan Soal Selesai (1/2 Kesempatan Terpakai)'}
              </span>
              <h2 className="text-2xl font-black text-slate-800">
                {attemptsCount >= 2 ? 'Kamu Sudah Menggunakan 2x Kesempatan Pengerjaan' : 'Selamat! Latihan Soal Selesai'}
              </h2>
              <p className="text-xs text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                Nilai Terbaik Kamu: <strong className="text-[#10B981] text-2xl font-black">{displayScore}%</strong>
                <br />
                <span className="text-[11px] text-slate-400 block pt-1">
                  {attemptsCount >= 2
                    ? 'Kamu telah mencapai batas maksimal 2x kesempatan pengerjaan Latihan Soal Evaluasi. Silakan kumpulkan poin XP tanpa batas di menu Quiz Poin!'
                    : 'Kamu baru menggunakan 1x kesempatan pengerjaan. Kamu masih memiliki 1x kesempatan lagi untuk memperbaiki nilai!'}
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {attemptsCount < 2 && (
                <button
                  onClick={handleRetryAttempt}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Coba Kesempatan Ke-2 🔄</span>
                </button>
              )}
              <Link
                href="/quiz/endless"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                <span>Masuk ke Quiz Poin (Leaderboard) 🏆</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs transition-colors"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 1,
    section: 'Vernier Caliper',
    question: 'Skala utama menunjukkan 18 mm dan garis nonius ke-6 berimpit (ketelitian 0,05 mm). Berapakah hasil pengukurannya?',
    options: ['18.30 mm', '18.60 mm', '18.06 mm', '18.25 mm'],
    correct: 0,
    explanation: '18 + (6 x 0.05) = 18 + 0.30 = 18.30 mm.',
  },
];
