'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import confetti from 'canvas-confetti';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Star } from 'lucide-react';

const MICROMETER_PRACTICE_QUESTIONS = [
  {
    id: 1,
    question: 'Skala sleeve utama menunjukkan 7 mm, garis setengah (0,5 mm) terlihat jelas terbuka, dan garis thimble berimpit pada angka 32. Berapakah hasil pengukurannya?',
    options: ['7.82 mm', '7.32 mm', '7.52 mm', '7.85 mm'],
    correct: 0,
    explanation: '7.00 mm + 0.50 mm + (32 x 0.01 mm) = 7.50 mm + 0.32 mm = 7.82 mm.',
  },
  {
    id: 2,
    question: 'Pada Mikrometer Sekrup 0-25 mm, berapakah pergeseran spindel dalam milimeter untuk 1 putaran penuh thimble (50 divisi)?',
    options: ['0.50 mm', '0.01 mm', '1.00 mm', '0.05 mm'],
    correct: 0,
    explanation: '1 putaran penuh thimble (50 divisi x 0.01 mm) memajukan atau memundurkan spindel sejauh 0.50 mm.',
  },
  {
    id: 3,
    question: 'Jika skala sleeve utama menunjukkan 12 mm (garis 0,5 mm TIDAK terlihat), dan divisi thimble berimpit di angka 45, berapakah nilainya?',
    options: ['12.45 mm', '12.95 mm', '12.05 mm', '12.50 mm'],
    correct: 0,
    explanation: '12.00 mm + 0.00 mm + (45 x 0.01 mm) = 12.45 mm.',
  },
  {
    id: 4,
    question: 'Bagian Mikrometer Sekrup yang berfungsi mencegah pengencangan berlebihan pada benda kerja adalah...',
    options: ['Ratchet Stopper', 'Lock Nut', 'Thimble', 'Anvil'],
    correct: 0,
    explanation: 'Ratchet stopper berbunyi "klik-klik" ketika tekanan jepitan ideal tercapai, mencegah deformasi benda kerja.',
  },
  {
    id: 5,
    question: 'Berapakah nilai ketelitian 1 divisi skala thimble pada Mikrometer Sekrup standar?',
    options: ['0.01 mm', '0.05 mm', '0.10 mm', '0.001 mm'],
    correct: 0,
    explanation: 'Satu garis pada thimble bernilai 0.01 mm.',
  },
];

export default function MicrometerLatihanPage() {
  const { completeModule } = useProgressStore();
  const { updatePoints } = useAuthStore();
  const [shuffledQuestions, setShuffledQuestions] = useState(MICROMETER_PRACTICE_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showXpBadge, setShowXpBadge] = useState(false);

  useEffect(() => {
    const randomized = MICROMETER_PRACTICE_QUESTIONS.map((q) => {
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
      completeModule('micrometer_latihan');
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Latihan Soal Mikrometer Sekrup ({currentIdx + 1} / {MICROMETER_PRACTICE_QUESTIONS.length})
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
                  {currentIdx + 1 < MICROMETER_PRACTICE_QUESTIONS.length ? 'Soal Berikutnya →' : 'Selesai & Rekam Result 🎉'}
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
              <h2 className="text-2xl font-black text-slate-900">Latihan Mikrometer Sekrup Selesai!</h2>
              <p className="text-sm text-slate-500">
                Kamu berhasil menjawab <strong className="text-emerald-600">{score}</strong> dari {MICROMETER_PRACTICE_QUESTIONS.length} soal dengan benar!
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
