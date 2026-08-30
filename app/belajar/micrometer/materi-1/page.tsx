'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { ArrowLeft, ArrowRight, CheckCircle2, Info } from 'lucide-react';

export default function MicrometerMateri1Page() {
  const { completeModule } = useProgressStore();

  const handleFinish = () => {
    completeModule('micrometer_materi_1');
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
              Materi 1 • Mikrometer Sekrup
            </span>
            <h1 className="text-3xl font-black text-slate-900">Anatomi & Komponen Mikrometer Sekrup</h1>
          </div>

          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <p>
              <strong>Mikrometer Sekrup (Micrometer Outer Caliper)</strong> adalah alat ukur presisi tinggi yang digunakan untuk mengukur ketebalan atau diameter luar benda kecil dengan ketelitian hingga 0,01 mm.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <h4 className="font-bold text-emerald-900 text-base">1. Anvil & Spindle</h4>
                <p className="text-xs text-emerald-800">
                  Anvil (statis) dan Spindle (bergerak) menjepit benda ukur dengan tekanan konstan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <h4 className="font-bold text-blue-900 text-base">2. Sleeve (Skala Utama)</h4>
                <p className="text-xs text-blue-800">
                  Tabung utama tempat skala milimeter (atas) dan setengah milimeter (bawah) tercetak.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <h4 className="font-bold text-amber-900 text-base">3. Thimble (Skala Putar)</h4>
                <p className="text-xs text-amber-800">
                  Tabung putar dengan 50 divisi. Setiap 1 divisi = 0,01 mm pergeseran spindel.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">
                Layer SVG yang kita gunakan pada platform ini terbagi menjadi: <code>base</code> (frame U & sleeve), <code>spindel</code> (poros geser), dan <code>thimble-all</code> (tabung putar). Angka pada thimble di-overlay secara interaktif via React HTML.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Selesaikan modul ini untuk update progress</span>
            </div>

            <Link
              href="/belajar/micrometer/materi-2"
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
