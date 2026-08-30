'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import VernierCaliperSVG from '@/components/simulation/VernierCaliperSVG';
import MicrometerSVG from '@/components/simulation/MicrometerSVG';
import {
  CheckCircle2,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Lock,
  LogIn,
  BookOpen,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface LearningStep {
  tool: 'vernier' | 'micrometer';
  toolName: string;
  stepNumber: number; // 1, 2, 3
  totalSteps: number; // 3
  title: string;
  subtitle: string;
  staticMmValue: number;
  badge: string;
  content: React.ReactNode;
}

export default function BelajarPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { completeModule } = useProgressStore();
  const { isAuthenticated } = useAuthStore();

  const LEARNING_STEPS: LearningStep[] = [
    // ----------------------------------------------------
    // VERNIER CALIPER (3 PAGES)
    // ----------------------------------------------------
    {
      tool: 'vernier',
      toolName: 'Vernier Caliper (Jangka Sorong)',
      stepNumber: 1,
      totalSteps: 3,
      title: 'Halaman 1/3: Pengenalan & Komponen Utama Jangka Sorong',
      subtitle: 'Memahami konsep dasar, fungsi 3 cara pengukuran, dan bagian-bagian fisik alat.',
      staticMmValue: 0.0,
      badge: 'MODUL VERNIER - DASAR',
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800">
              Apa itu Vernier Caliper (Jangka Sorong)?
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              <strong>Vernier Caliper</strong> (Jangka Sorong) adalah alat ukur presisi tinggi yang digunakan dalam bidang teknik otomotif dan manufaktur untuk mengukur dimensi suatu benda kerja dengan ketelitian hingga <strong>0,05 mm</strong> atau <strong>0,02 mm</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              3 Fungsi Pengukuran Utama:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-1">
                <span className="font-extrabold text-[#047857] block">1. Dimensi Luar</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Mengukur tebal, lebar, atau diameter luar benda silinder menggunakan <strong>Rahang Bawah (Outer Jaws)</strong>.
                </p>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-1">
                <span className="font-extrabold text-blue-800 block">2. Dimensi Dalam</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Mengukur diameter dalam pipa atau celah lubang menggunakan <strong>Rahang Atas (Inner Jaws)</strong>.
                </p>
              </div>
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-1">
                <span className="font-extrabold text-amber-800 block">3. Kedalaman</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Mengukur kedalaman lubang atau ceruk menggunakan <strong>Tangkai Kedalaman (Depth Probe)</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Rincian Bagian-Bagian Fisik Alat:
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Rahang Tetap (Fixed Jaw):</strong> Bagian statis yang tersambung langsung dengan penggaris utama.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Rahang Geser (Sliding Jaw):</strong> Komponen bergerak yang membawa skala nonius dan tombol pendorong ibu jari.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Skala Utama (Main Scale):</strong> Garis skala dalam milimeter (mm) dari 0 hingga 150 mm.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Skala Nonius (Vernier Scale):</strong> Skala bantu bergerak untuk membaca pecahan pecahan milimeter.
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      tool: 'vernier',
      toolName: 'Vernier Caliper (Jangka Sorong)',
      stepNumber: 2,
      totalSteps: 3,
      title: 'Halaman 2/3: Prinsip Kerja & Ketelitian Skala Nonius',
      subtitle: 'Memahami rumus ketelitian 0,05 mm & 0,02 mm serta pentingnya kalibrasi titik nol.',
      staticMmValue: 10.0,
      badge: 'MODUL VERNIER - KETELITIAN',
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800">
              Bagaimana Cara Menentukan Nilai Ketelitian Jangka Sorong?
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Nilai ketelitian (nonius) ditentukan dari pembagian 1 garis skala utama (1 mm) dengan jumlah total divisi pada garis skala nonius.
            </p>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs space-y-2 border border-slate-700 shadow-sm">
            <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              Rumus Ketelitian Jangka Sorong:
            </div>
            <div className="text-sm font-black">
              Ketelitian = 1 mm / Jumlah Divisi Skala Nonius
            </div>
            <div className="pt-2 border-t border-slate-800 text-slate-300 text-[11px]">
              • Jangka Sorong 20 Skala: 1 mm / 20 divisi = <strong>0,05 mm</strong> (Setiap garis bernilai 0,05 mm)<br />
              • Jangka Sorong 50 Skala: 1 mm / 50 divisi = <strong>0,02 mm</strong> (Setiap garis bernilai 0,02 mm)
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Kalibrasi Titik Nol (Zero Check):
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sebelum mengukur benda kerja, tutuplah rahang jangka sorong hingga rapat sempurna. Garis angka <strong className="text-emerald-600 font-bold">0</strong> pada skala nonius harus berimpit lurus dengan garis <strong className="text-emerald-600 font-bold">0</strong> pada skala utama. Jika tidak berimpit, terdapat kesalahan nol (zero error) yang harus dikompensasi dalam hasil perhitungan akhir.
            </p>
          </div>
        </div>
      ),
    },
    {
      tool: 'vernier',
      toolName: 'Vernier Caliper (Jangka Sorong)',
      stepNumber: 3,
      totalSteps: 3,
      title: 'Halaman 3/3: Cara Membaca Skala & Contoh Perhitungan',
      subtitle: 'Langkah-langkah praktis membaca hasil ukur secara presisi beserta contoh studi kasus.',
      staticMmValue: 22.2,
      badge: 'MODUL VERNIER - LATIHAN BACA',
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800">
              3 Langkah Praktis Membaca Jangka Sorong:
            </h3>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-slate-900 block font-extrabold">Baca Skala Utama (Main Scale):</strong>
                  Lihat angka milimeter di sebelah kiri persis garis 0 skala nonius. (Misal: 22 mm).
                </div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-slate-900 block font-extrabold">Cari Garis Nonius Berimpit (Vernier Scale):</strong>
                  Cari satu garis pada skala nonius yang benar-benar LURUS / berimpit presisi dengan garis skala utama. (Misal: Garis ke-4).
                </div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-slate-900 block font-extrabold">Hitung Total Hasil Pengukuran:</strong>
                  Kalikan garis nonius dengan 0,05 mm, lalu tambahkan ke skala utama:<br />
                  <span className="font-mono font-bold text-emerald-700">Hasil = 22 mm + (4 × 0,05 mm) = 22,20 mm.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Case Study Example */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-[#047857]">
            <div className="flex items-center gap-2 font-black text-sm">
              <Sparkles className="w-4 h-4 text-[#10B981]" />
              <span>Studi Kasus Otomotif: Pengukuran Ketebalan Kampas Rem</span>
            </div>
            <p className="leading-relaxed">
              Hasil bacaan rahang luar menunjukkan skala utama berada di 14 mm dan garis nonius ke-7 berimpit presisi.<br />
              <strong>Perhitungan:</strong> 14 mm + (7 × 0,05 mm) = <strong>14,35 mm</strong>.
            </p>
          </div>
        </div>
      ),
    },

    // ----------------------------------------------------
    // MICROMETER SEKRUP (3 PAGES)
    // ----------------------------------------------------
    {
      tool: 'micrometer',
      toolName: 'Micrometer Sekrup',
      stepNumber: 1,
      totalSteps: 3,
      title: 'Halaman 1/3: Pengenalan & Komponen Presisi Mikrometer',
      subtitle: 'Memahami fungsi alat ukur ultra-presisi 0,01 mm dan 7 komponen penyusunnya.',
      staticMmValue: 7.5,
      badge: 'MODUL MIKROMETER - DASAR',
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800">
              Apa itu Mikrometer Sekrup?
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              <strong>Mikrometer Sekrup</strong> adalah instrumen pengukur metrologi presisi tinggi yang mampu mengukur benda kerja hingga ketelitian <strong>0,01 mm</strong> (10 mikron). Sangat ideal untuk mengukur tebal pelat, diameter poros engkol, dan katup mesin.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              7 Komponen Presisi Mikrometer:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-0.5">
                <strong className="text-slate-900 block font-bold">1. Anvil (Landasan Tetap)</strong>
                <span className="text-[11px] text-slate-500">Landasan стаtis tempat menahan bidang ukur benda.</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-0.5">
                <strong className="text-slate-900 block font-bold">2. Spindel (Poros Ukur)</strong>
                <span className="text-[11px] text-slate-500">Poros bergerak maju mundur dari ulir presisi.</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-0.5">
                <strong className="text-slate-900 block font-bold">3. Sleeve (Skala Utama)</strong>
                <span className="text-[11px] text-slate-500">Tabung stasioner berisi garis mm & 0,5 mm.</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-0.5">
                <strong className="text-slate-900 block font-bold">4. Thimble (Skala Putar)</strong>
                <span className="text-[11px] text-slate-500">Silinder pemutar dengan 50 divisi ketelitian 0,01 mm.</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-0.5">
                <strong className="text-slate-900 block font-bold">5. Ratchet Stopper</strong>
                <span className="text-[11px] text-slate-500">Roda pemutar presisi penentu tekanan jepitan standar.</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-0.5">
                <strong className="text-slate-900 block font-bold">6. Lock Nut (Pengunci)</strong>
                <span className="text-[11px] text-slate-500">Pengunci spindel agar posisi ukuran tidak bergeser.</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      tool: 'micrometer',
      toolName: 'Micrometer Sekrup',
      stepNumber: 2,
      totalSteps: 3,
      title: 'Halaman 2/3: Mekanisme Ulir Presisi & Ketelitian 0,01 mm',
      subtitle: 'Memahami cara kerja ulir mikrometer dan peran penting Ratchet Stopper.',
      staticMmValue: 12.45,
      badge: 'MODUL MIKROMETER - ULIR & RATCETH',
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800">
              Prinsip Kerja Ulir Presisi Mikrometer
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Mikrometer memanfaatkan mekanisme ulir dengan kisar (*pitch*) 0,50 mm. Ini berarti <strong>1 putaran penuh thimble (360°)</strong> menggeser spindel sejauh tepat <strong>0,50 mm</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs space-y-2 border border-slate-700 shadow-sm">
            <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              Rumus Ketelitian Mikrometer:
            </div>
            <div className="text-sm font-black">
              1 Divisi Thimble = Pitch Ulir / Jumlah Divisi Thimble
            </div>
            <div className="pt-2 border-t border-slate-800 text-slate-300 text-[11px]">
              0,50 mm / 50 Divisi = <strong>0,01 mm</strong>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Pentingnya Penggunaan Ratchet Stopper:
            </h4>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
              <p className="leading-relaxed">
                Saat menjepit benda kerja antara Anvil dan Spindel, putarlah ujung <strong>Ratchet Stopper</strong> secara perlahan hingga terdengar bunyi <em>"klik-klik"</em> 3 kali. Hal ini memastikan jepitan memiliki tekanan torsi terkalibrasi yang pas dan tidak merusak/membuat deformasi pada benda kerja.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      tool: 'micrometer',
      toolName: 'Micrometer Sekrup',
      stepNumber: 3,
      totalSteps: 3,
      title: 'Halaman 3/3: Cara Membaca Skala Sleeve & Thimble',
      subtitle: 'Langkah-langkah membaca kombinasi skala utama atas, garis 0,5 mm bawah, dan divisi thimble.',
      staticMmValue: 7.82,
      badge: 'MODUL MIKROMETER - LATIHAN BACA',
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800">
              3 Langkah Membaca Mikrometer Sekrup:
            </h3>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-slate-900 block font-extrabold">Baca Skala Utama Sleeve Atas:</strong>
                  Lihat angka milimeter bulat yang terbuka di bagian atas sleeve. (Misal: 7,00 mm).
                </div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-slate-900 block font-extrabold">Periksa Garis 0,5 mm Sleeve Bawah:</strong>
                  Apakah garis setengah milimeter di bagian bawah sleeve terlihat/terbuka? Jika ya, tambahkan 0,50 mm.
                </div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-slate-900 block font-extrabold">Baca Garis Thimble Putar:</strong>
                  Lihat angka garis thimble yang berimpit lurus dengan garis horizontal sleeve. (Misal: Garis 32 = 0,32 mm).
                  <br />
                  <span className="font-mono font-bold text-emerald-700 block pt-1">
                    Hasil Pembacaan = 7,00 mm + 0,50 mm + 0,32 mm = 7,82 mm.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-[#047857]">
            <div className="flex items-center gap-2 font-black text-sm">
              <Sparkles className="w-4 h-4 text-[#10B981]" />
              <span>Selamat! Kamu Telah Menyelesaikan Seluruh Modul Materi Teori!</span>
            </div>
            <p className="leading-relaxed font-medium">
              Selanjutnya, kamu dapat langsung menguji pengetahuan dan mengukur objek benda kerja 2D pada menu <strong>Latihan Simulasi</strong>!
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = LEARNING_STEPS[currentStepIdx];
  const isFirstStep = currentStepIdx === 0;
  const isLastStep = currentStepIdx === LEARNING_STEPS.length - 1;

  const handleNextStep = () => {
    if (!isLastStep) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);

      // Auto update progress store based on step completion
      if (currentStep.tool === 'vernier' && currentStep.stepNumber === 3) {
        completeModule('vernier_materi_1');
        completeModule('vernier_materi_2');
      }
    } else {
      // Completed all 6 steps! Mark modules complete and go to /simulasi
      completeModule('vernier_materi_1');
      completeModule('vernier_materi_2');
      completeModule('micrometer_materi_1');
      completeModule('micrometer_materi_2');
      completeModule('vernier_simulasi');
      completeModule('micrometer_simulasi');
      router.push('/simulasi');
    }
  };

  const handlePrevStep = () => {
    if (!isFirstStep) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

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
              Menu Modul Belajar hanya dapat diakses oleh siswa atau pengguna yang sudah masuk ke akun.
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
    <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6 font-sans select-none">
      {/* Top Header & Progress Stepper Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#10B981] block">
              {currentStep.badge}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              {currentStep.toolName}
            </h1>
          </div>

          {/* Step Indicator Counter */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-2xs">
            <BookOpen className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs font-black text-slate-700">
              Langkah {currentStepIdx + 1} dari {LEARNING_STEPS.length}
            </span>
          </div>
        </div>

        {/* Step Progress Bar Visual */}
        <div className="grid grid-cols-6 gap-2 w-full">
          {LEARNING_STEPS.map((step, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStepIdx
                  ? 'bg-[#10B981] shadow-xs'
                  : idx < currentStepIdx
                  ? 'bg-[#10B981]/60'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Static Tool Preview Card (Gambar Statis Tanpa Bisa Digeser) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 relative space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
            GAMBAR STATIS ALAT UKUR (PREVIEW ILUSTRASI)
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Posisi Contoh: {currentStep.staticMmValue.toFixed(2)} mm
          </span>
        </div>

        {/* Static Tool SVG Render Container */}
        <div className="flex items-center justify-center py-2 pointer-events-none overflow-x-auto w-full">
          <div className="relative w-full max-w-2xl flex flex-col items-center min-w-[320px]">
            {currentStep.tool === 'vernier' ? (
              <VernierCaliperSVG sliderX={currentStep.staticMmValue} />
            ) : (
              <MicrometerSVG thimbleX={currentStep.staticMmValue} />
            )}
          </div>
        </div>
      </div>

      {/* Learning Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 md:p-8 space-y-4">
        <div className="border-b border-slate-100 pb-4 space-y-1">
          <h2 className="text-lg md:text-xl font-black text-slate-900">{currentStep.title}</h2>
          <p className="text-xs text-slate-500 font-medium">{currentStep.subtitle}</p>
        </div>

        {currentStep.content}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrevStep}
          disabled={isFirstStep}
          className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-bold text-xs border border-slate-300 transition-all flex items-center gap-1.5 shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <button
          onClick={handleNextStep}
          className="w-full sm:w-auto justify-center px-7 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <span>
            {isLastStep
              ? 'Selesaikan Modul & Masuk Simulasi 🚀'
              : currentStep.stepNumber === 3 && currentStep.tool === 'vernier'
              ? 'Lanjut ke Modul Mikrometer Sekrup →'
              : 'Halaman Berikutnya →'}
          </span>
        </button>
      </div>
    </main>
  );
}

