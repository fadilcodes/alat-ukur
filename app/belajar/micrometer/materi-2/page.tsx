'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { ArrowLeft, ArrowRight, CheckCircle2, Calculator } from 'lucide-react';

export default function MicrometerMateri2Page() {
  const { completeModule } = useProgressStore();

  const handleFinish = () => {
    completeModule('micrometer_materi_2');
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
              Materi 2 • Mikrometer Sekrup
            </span>
            <h1 className="text-3xl font-black text-slate-900">Cara Membaca Skala Sleeve & Thimble</h1>
          </div>

          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                Rumus Utama Pembacaan Mikrometer
              </div>
              <div className="text-xl font-mono font-bold text-center py-2 bg-slate-800 rounded-xl border border-slate-700 text-amber-300">
                Hasil (mm) = Skala Sleeve Utama + Skala Sleeve Setengah (0.5) + (Garis Thimble x 0,01 mm)
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Langkah-Langkah Pengukuran:</h3>
              <ol className="list-decimal pl-5 space-y-3 font-medium text-slate-700">
                <li>
                  <strong className="text-slate-900">Baca Skala Sleeve Atas:</strong> Perhatikan garis milimeter utuh (0, 1, 2, 3... mm) yang terbuka di sebelah kiri beveled thimble.
                </li>
                <li>
                  <strong className="text-slate-900">Periksa Skala Sleeve Bawah (0.5 mm):</strong> Periksa apakah garis setengah milimeter di bagian bawah horizontal datum line terlihat terbuka setelah garis utama terakhir. Jika terbuka, tambahkan 0,50 mm.
                </li>
                <li>
                  <strong className="text-slate-900">Baca Skala Thimble:</strong> Perhatikan garis divisi thimble (0-49) yang tepat berimpit horizontal dengan datum line sleeve. Kalikan divisi tersebut dengan 0,01 mm.
                </li>
                <li>
                  <strong className="text-slate-900">Jumlahkan Ketiganya:</strong> Contoh: 8.00 mm + 0.50 mm + (24 x 0.01 mm) = 8.74 mm.
                </li>
              </ol>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Selesaikan modul ini untuk update progress</span>
            </div>

            <Link
              href="/simulasi"
              onClick={handleFinish}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <span>Lanjut ke Simulasi 2D/3D</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
