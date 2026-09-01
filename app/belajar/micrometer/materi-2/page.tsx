'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useProgressStore } from '@/lib/zustand/useProgressStore';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, ArrowRight, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';

export default function MicrometerMateri2Page() {
  const supabase = createClient();
  const { completeModule } = useProgressStore();

  const [title, setTitle] = useState('Cara Membaca Skala Sleeve & Thimble');
  const [description, setDescription] = useState('Rumus pembacaan hasil ukur mikrometer sekrup dan langkah-langkah praktis.');
  const [contentBody, setContentBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModule() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .eq('slug', 'micrometer-materi-2')
          .maybeSingle();

        if (data && !error) {
          setTitle(data.title);
          setDescription(data.description || '');
          setContentBody(data.content_body || '');
        } else {
          setContentBody(`## Rumus Utama Pembacaan Mikrometer Sekrup

Hasil (mm) = Skala Sleeve Utama + Skala Sleeve Setengah (0,5 mm) + (Garis Thimble x 0,01 mm)

### Langkah-Langkah Pengukuran:

1. **Baca Skala Sleeve Atas**: Perhatikan garis milimeter utuh (0, 1, 2, 3... mm) yang terbuka di sebelah kiri beveled thimble.
2. **Periksa Skala Sleeve Bawah (0.5 mm)**: Periksa apakah garis setengah milimeter di bagian bawah horizontal datum line terlihat terbuka setelah garis utama terakhir. Jika terbuka, tambahkan 0,50 mm.
3. **Baca Skala Thimble**: Perhatikan garis divisi thimble (0-49) yang tepat berimpit horizontal dengan datum line sleeve. Kalikan divisi tersebut dengan 0,01 mm.
4. **Jumlahkan Ketiganya**: Contoh: 8.00 mm + 0.50 mm + (24 x 0.01 mm) = 8.74 mm.`);
        }
      } catch (err) {
        console.error('Error fetching micrometer-materi-2:', err);
      } finally {
        setLoading(false);
      }
    }
    loadModule();
  }, []);

  const handleFinish = () => {
    completeModule('micrometer_materi_2');
  };

  const renderFormattedText = (rawText: string) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return (
      <div className="space-y-4 text-slate-800 text-sm leading-relaxed w-full">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-xl font-black text-slate-900 pt-2 border-b border-slate-100 pb-2">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-xs font-extrabold text-[#047857] uppercase tracking-wider pt-3">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^\d+/)?.[0];
            const rest = trimmed.replace(/^\d+\.\s/, '');
            const parts = rest.split(/\*\*(.*?)\*\*/g);

            return (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3 w-full">
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

          if (trimmed.toLowerCase().includes('rumus') || trimmed.toLowerCase().includes('hasil =')) {
            return (
              <div key={idx} className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs space-y-1 border border-slate-700 shadow-xs w-full">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block">
                  Rumus Utama Pengukuran:
                </span>
                <p className="text-amber-300 font-extrabold text-sm leading-relaxed">{trimmed}</p>
              </div>
            );
          }

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

        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 w-full">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Materi 2 • Mikrometer Sekrup
              </span>
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Dynamic CMS Content
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{title}</h1>
            {description && <p className="text-xs sm:text-sm text-slate-500 font-medium">{description}</p>}
          </div>

          <div className="w-full">
            {loading ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-[#10B981]" />
                <span className="text-xs font-medium">Memuat materi dari database...</span>
              </div>
            ) : (
              renderFormattedText(contentBody)
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
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
