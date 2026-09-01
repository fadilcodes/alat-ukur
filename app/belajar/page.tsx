'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import VernierCaliperSVG from '@/components/simulation/VernierCaliperSVG';
import MicrometerSVG from '@/components/simulation/MicrometerSVG';
import {
  CheckCircle2,
  Lock,
  LogIn,
  BookOpen,
  ChevronLeft,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface DBModuleStep {
  id: string;
  tool: 'vernier' | 'micrometer';
  toolName: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  staticMmValue: number;
  badge: string;
  content_body: string;
}

export default function BelajarPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [modulesList, setModulesList] = useState<DBModuleStep[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);

  const { completeModule } = useProgressStore();
  const { isAuthenticated } = useAuthStore();

  const fetchDynamicModules = async () => {
    setLoadingModules(true);
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted: DBModuleStep[] = data.map((m, idx) => {
          const isVernier =
            m.category?.toLowerCase().includes('vernier') ||
            m.slug?.includes('jangka') ||
            m.title?.toLowerCase().includes('jangka');
          const toolType: 'vernier' | 'micrometer' = isVernier ? 'vernier' : 'micrometer';
          const staticValues = [0.0, 10.0, 22.2, 7.5, 12.45, 7.82];

          return {
            id: m.id,
            tool: toolType,
            toolName: toolType === 'vernier' ? 'Vernier Caliper (Jangka Sorong)' : 'Micrometer Sekrup',
            stepNumber: idx + 1,
            totalSteps: data.length,
            title: m.title,
            subtitle: m.description || 'Modul teori pembelajaran metrologi presisi.',
            staticMmValue: staticValues[idx % staticValues.length] || 0.0,
            badge: `MATERI PEMBELAJARAN #${idx + 1}`,
            content_body: m.content_body,
          };
        });

        setModulesList(formatted);
      } else {
        setModulesList(DEFAULT_STEPS);
      }
    } catch (err) {
      console.error('Error loading dynamic modules:', err);
      setModulesList(DEFAULT_STEPS);
    } finally {
      setLoadingModules(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDynamicModules();
  }, []);

  const handleNextStep = () => {
    if (currentStepIdx < modulesList.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);

      completeModule('vernier_materi_1');
      completeModule('vernier_materi_2');
    } else {
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
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  // Helper renderer to render Markdown/Text full-body in clean Tailwind typography
  const renderFormattedText = (rawText: string) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');

    return (
      <div className="space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed w-full font-sans">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // H2 Heading (## Title)
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-base sm:text-lg font-black text-slate-900 pt-2 border-b border-slate-100 pb-2">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }

          // H3 Heading (### Subtitle)
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-xs sm:text-sm font-extrabold text-[#047857] uppercase tracking-wider pt-3">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          // Numbered list item (1. Item)
          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^\d+/)?.[0];
            const rest = trimmed.replace(/^\d+\.\s/, '');
            const parts = rest.split(/\*\*(.*?)\*\*/g);

            return (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3 w-full">
                <span className="w-6 h-6 rounded-full bg-[#10B981] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {num}
                </span>
                <div className="flex-1 text-slate-700">
                  {parts.map((p, pIdx) =>
                    pIdx % 2 === 1 ? <strong key={pIdx} className="text-slate-900 font-extrabold">{p}</strong> : p
                  )}
                </div>
              </div>
            );
          }

          // Bullet list item (- Item)
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            const parts = content.split(/\*\*(.*?)\*\*/g);

            return (
              <div key={idx} className="flex items-start gap-2.5 pl-1 w-full">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <div className="flex-1 text-slate-700">
                  {parts.map((p, pIdx) =>
                    pIdx % 2 === 1 ? <strong key={pIdx} className="text-slate-900 font-extrabold">{p}</strong> : p
                  )}
                </div>
              </div>
            );
          }

          // Formula or Callout box (Formula / Ketelitian)
          if (trimmed.toLowerCase().includes('rumus') || trimmed.toLowerCase().includes('hasil =')) {
            return (
              <div key={idx} className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs space-y-1 border border-slate-700 shadow-xs w-full">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block">
                  Kalkulasi / Formula Metrologi:
                </span>
                <p className="text-slate-100 font-bold leading-relaxed">{trimmed}</p>
              </div>
            );
          }

          // Standard paragraph with bold text support (**text**)
          const parts = trimmed.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={idx} className="text-slate-700 leading-relaxed w-full">
              {parts.map((p, pIdx) =>
                pIdx % 2 === 1 ? <strong key={pIdx} className="text-slate-900 font-bold">{p}</strong> : p
              )}
            </p>
          );
        })}
      </div>
    );
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

  const currentStep = modulesList[currentStepIdx] || DEFAULT_STEPS[0];
  const isFirstStep = currentStepIdx === 0;
  const isLastStep = currentStepIdx === modulesList.length - 1;

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6 font-sans select-none">
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
              Langkah {currentStepIdx + 1} dari {modulesList.length}
            </span>
          </div>
        </div>

        {/* Step Progress Bar Visual (Dynamic Grid Template Columns) */}
        <div
          className="grid gap-2 w-full"
          style={{ gridTemplateColumns: `repeat(${modulesList.length || 6}, minmax(0, 1fr))` }}
        >
          {modulesList.map((step, idx) => (
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

      {/* Full-Text Learning Content Card (Dapat Di-edit & Ditambahkan via Dashboard Admin CMS) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 md:p-10 space-y-6 w-full">
        {/* Module Header */}
        <div className="border-b border-slate-100 pb-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              MATERI PEMBELAJARAN #{currentStepIdx + 1}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Dynamic CMS Sync
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {currentStep.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            {currentStep.subtitle}
          </p>
        </div>

        {/* Full Text Content Body Container */}
        <div className="w-full">
          {loadingModules ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#10B981]" />
              <span className="text-xs font-medium">Memuat teks materi dari database...</span>
            </div>
          ) : (
            renderFormattedText(currentStep.content_body)
          )}
        </div>
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
              : 'Halaman Berikutnya →'}
          </span>
        </button>
      </div>
    </main>
  );
}

// Fallback steps in case database is offline
const DEFAULT_STEPS: DBModuleStep[] = [
  {
    id: 'default-1',
    tool: 'vernier',
    toolName: 'Vernier Caliper (Jangka Sorong)',
    stepNumber: 1,
    totalSteps: 3,
    title: 'Pengenalan Jangka Sorong (Vernier Caliper)',
    subtitle: 'Pelajari komponen utama, prinsip skala nonius, dan teknik pembacaan jangka sorong ketelitian 0.05mm dan 0.02mm.',
    staticMmValue: 0.0,
    badge: 'MATERI PEMBELAJARAN #1',
    content_body: `## Apa itu Vernier Caliper (Jangka Sorong)?

Vernier Caliper (Jangka Sorong) adalah alat ukur presisi tinggi yang digunakan dalam bidang teknik otomotif dan manufaktur untuk mengukur dimensi suatu benda kerja dengan ketelitian hingga 0,05 mm atau 0,02 mm.

### 3 FUNGSI PENGUKURAN UTAMA:

1. **Dimensi Luar**: Mengukur tebal, lebar, atau diameter luar benda silinder menggunakan Rahang Bawah (Outer Jaws).
2. **Dimensi Dalam**: Mengukur diameter dalam pipa atau celah lubang menggunakan Rahang Atas (Inner Jaws).
3. **Kedalaman**: Mengukur kedalaman lubang atau ceruk menggunakan Tangkai Kedalaman (Depth Probe).

### RINCIAN BAGIAN-BAGIAN FISIK ALAT:

- **Rahang Tetap (Fixed Jaw)**: Bagian statis yang tersambung langsung dengan penggaris utama.
- **Rahang Geser (Sliding Jaw)**: Komponen bergerak yang membawa skala nonius dan tombol pendorong ibu jari.
- **Skala Utama (Main Scale)**: Garis skala dalam milimeter (mm) dari 0 hingga 150 mm.
- **Skala Nonius (Vernier Scale)**: Skala bantu bergerak untuk membaca pecahan milimeter.`,
  },
];
