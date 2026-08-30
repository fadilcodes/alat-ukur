'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import confetti from 'canvas-confetti';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, Trophy, Star } from 'lucide-react';

const VERNIER_PRACTICE_QUESTIONS = [
  {
    id: 1,
    question: 'Skala utama menunjukkan 22 mm dan garis nonius ke-4 berimpit presisi (ketelitian 0,05 mm). Berapakah hasil pembacaannya?',
    options: ['22.20 mm', '22.40 mm', '22.04 mm', '22.25 mm'],
    correct: 0,
    explanation: '22 mm + (4 x 0,05 mm) = 22 mm + 0,20 mm = 22,20 mm.',
  },
  {
    id: 2,
    question: 'Jika nol skala nonius berada tepat di antara angka 35 mm dan 36 mm, serta garis nonius ke-13 berimpit, berapa nilai ukurnya?',
    options: ['35.65 mm', '35.13 mm', '35.30 mm', '35.75 mm'],
    correct: 0,
    explanation: '35 mm + (13 x 0,05 mm) = 35 mm + 0,65 mm = 35,65 mm.',
  },
  {
    id: 3,
    question: 'Bagian Jangka Sorong yang digunakan untuk mengukur kedalaman lubang silinder adalah...',
    options: ['Tangkai Pengukur Kedalaman (Depth Probe)', 'Rahang Atas (Inner Jaws)', 'Rahang Bawah (Outer Jaws)', 'Skala Utama'],
    correct: 0,
    explanation: 'Tangkai kedalaman (Depth probe / rod) yang memanjang di ujung penggaris digunakan khusus mengukur kedalaman.',
  },
  {
    id: 4,
    question: 'Skala utama menunjukkan 5 mm dan garis nonius ke-18 berimpit. Berapakah hasil pengukuran?',
    options: ['5.90 mm', '5.18 mm', '5.85 mm', '5.95 mm'],
    correct: 0,
    explanation: '5 mm + (18 x 0,05 mm) = 5 mm + 0,90 mm = 5,90 mm.',
  },
  {
    id: 5,
    question: 'Berapakah nilai ketelitian satu garis divisi nonius pada Jangka Sorong 20 skala?',
    options: ['0.05 mm', '0.01 mm', '0.10 mm', '0.02 mm'],
    correct: 0,
    explanation: '1 mm / 20 divisi = 0,05 mm.',
  },
];

export default function VernierLatihanPage() {
  const { completeModule } = useProgressStore();
  const { updatePoints } = useAuthStore();
  const [shuffledQuestions, setShuffledQuestions] = useState(VERNIER_PRACTICE_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showXpBadge, setShowXpBadge] = useState(false);

  useEffect(() => {
    const randomized = VERNIER_PRACTICE_QUESTIONS.map((q) => {
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
  }, []);

  const q = shuffledQuestions[currentIdx];

  const handleSelect = (idx: number) => {
    if (!isSubmitted) setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null) return;
    setIsSubmitted(true);
    if (selectedOpt === q.correct) {
      setScore((prev) => prev + 1);
      updatePoints(5); // Realtime +5 XP update to Zustand store & UI
      setShowXpBadge(true);
    }
  };

  const handleNext = () => {
    setShowXpBadge(false);
    if (currentIdx + 1 < shuffledQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
      completeModule('vernier_latihan');
      confetti({ particleCount: 80, spread: 60 });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        <Link
          href="/belajar"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pusat Belajar</span>
        </Link>

        {!isCompleted ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 relative">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Latihan Soal Jangka Sorong ({currentIdx + 1} / {VERNIER_PRACTICE_QUESTIONS.length})
              </span>

              <div className="flex items-center gap-3">
                {showXpBadge && (
                  <span className="animate-bounce inline-flex items-center gap-1 text-xs font-black text-[#047857] bg-[#E8F8F0] border border-[#D1F2E2] px-2.5 py-1 rounded-full shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-[#10B981] text-[#10B981]" />
                    +5 XP!
                  </span>
                )}
                <span className="text-xs font-bold text-slate-400 font-mono">Skor: {score}</span>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-relaxed">{q.question}</h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                if (selectedOpt === idx) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                }

                if (isSubmitted) {
                  if (idx === q.correct) {
                    btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                  } else if (selectedOpt === idx && idx !== q.correct) {
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
                    {isSubmitted && idx === q.correct && <CheckCircle2 className="w-5 h-5" />}
                    {isSubmitted && selectedOpt === idx && idx !== q.correct && (
                      <XCircle className="w-5 h-5" />
                    )}
                  </button>
                );
              })}
            </div>

            {isSubmitted && (
              <div className="p-4 bg-slate-100 rounded-xl text-xs font-medium text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Penjelasan:</span>
                <p>{q.explanation}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedOpt === null}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-colors"
                >
                  Jawab Soal
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors"
                >
                  {currentIdx + 1 < VERNIER_PRACTICE_QUESTIONS.length ? 'Soal Berikutnya →' : 'Selesai & Rekam Result 🎉'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Latihan Jangka Sorong Selesai!</h2>
              <p className="text-sm text-slate-500">
                Kamu berhasil menjawab <strong className="text-emerald-600">{score}</strong> dari {VERNIER_PRACTICE_QUESTIONS.length} soal dengan benar!
              </p>
            </div>
            <Link
              href="/belajar"
              className="inline-block px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors"
            >
              Kembali ke Menu Belajar
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
