'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { ArrowLeft, ArrowRight, CheckCircle2, Info } from 'lucide-react';

export default function VernierMateri1Page() {
  const { completeModule } = useProgressStore();

  const handleFinish = () => {
    completeModule('vernier_materi_1');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        <Link
          href="/belajar"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pusat Belajar</span>
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Materi 1 • Jangka Sorong
            </span>
            <h1 className="text-3xl font-black text-slate-900">Anatomi & Bagian-Bagian Jangka Sorong</h1>
          </div>

          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <p>
              <strong>Jangka Sorong (Vernier Caliper)</strong> adalah alat ukur presisi yang digunakan untuk mengukur dimensi luar, dimensi dalam, dan kedalaman suatu benda kerja hingga ketelitian 0,05 mm.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <h4 className="font-bold text-emerald-900 text-base">1. Rahang Luar (Outer Jaws)</h4>
                <p className="text-xs text-emerald-800">
                  Digunakan untuk mengukur ketebalan, panjang, atau diameter luar benda kerja (contoh: Kampas Rem).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <h4 className="font-bold text-blue-900 text-base">2. Rahang Dalam (Inner Jaws)</h4>
                <p className="text-xs text-blue-800">
                  Digunakan untuk mengukur diameter dalam pipa, celah, atau lubang silinder.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                <h4 className="font-bold text-purple-900 text-base">3. Tangkai Kedalaman (Depth Probe)</h4>
                <p className="text-xs text-purple-800">
                  Digunakan untuk mengukur kedalaman lubang atau ceruk benda kerja (contoh: kedalaman baut).
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">
                Layer SVG yang kita gunakan pada platform ini terbagi menjadi 3 bagian utama: <code>base</code> (skala utama statis), <code>slider</code> (rahang geser), dan <code>batang</code> (tangkai pengukur kedalaman).
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Selesaikan modul ini untuk update progress</span>
            </div>

            <Link
              href="/belajar/vernier/materi-2"
              onClick={handleFinish}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <span>Lanjut ke Materi 2</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
