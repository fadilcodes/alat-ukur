'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useSimulationStore, PRESET_TASKS, HitboxZone } from '@/lib/zustand/useSimulationStore';
import { calculateVernierReading, calculateMicrometerReading } from '@/lib/utils/measurement';
import VernierCaliperSVG from './VernierCaliperSVG';
import MicrometerSVG from './MicrometerSVG';
import Canvas3D from './Canvas3D';
import { CheckCircle2, RotateCcw, AlertTriangle, ArrowRight, Compass, ShieldAlert, Sparkles } from 'lucide-react';

export default function HybridSimulationCanvas() {
  const {
    activeTool,
    mode,
    currentTaskIndex,
    activeTask,
    selected3DObject,
    vernierSliderX,
    micrometerThimbleX,
    snapState,
    feedbackMessage,
    setActiveTool,
    setMode,
    setSelected3DObject,
    setVernierSliderX,
    setMicrometerThimbleX,
    setTaskIndex,
    handleDrop3DObject,
    resetSimulation,
  } = useSimulationStore();

  const [userInputMm, setUserInputMm] = useState<string>('');
  const [taskSuccess, setTaskSuccess] = useState<boolean>(false);
  const [taskError, setTaskError] = useState<string | null>(null);

  // Live readout based on active tool
  const currentVernierReading = calculateVernierReading(vernierSliderX, 600, 150);
  const currentMicrometerReading = calculateMicrometerReading(micrometerThimbleX, 500, 25);

  const activeReadingMm =
    activeTool === 'vernier' ? currentVernierReading.totalMm : currentMicrometerReading.totalMm;

  // Handle Drag & Drop Snapping onto target hitboxes
  const onTriggerHitboxDrop = (hitbox: HitboxZone) => {
    const success = handleDrop3DObject(hitbox);
    if (!success) {
      // Auto-bounce sound / feedback animation triggered in state
    }
  };

  // Validate user measurement input in Task Mode
  const handleValidateInput = (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError(null);

    const val = parseFloat(userInputMm);
    if (isNaN(val)) {
      setTaskError('Masukkan angka yang valid dalam satuan mm!');
      return;
    }

    if (activeTask) {
      const diff = Math.abs(val - activeTask.expectedValueMm);
      if (diff <= activeTask.toleranceMm) {
        setTaskSuccess(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        setTaskError(
          `Hasil belum tepat. Nilai pengukuran kamu (${val} mm) selisih terlalu jauh dari toleransi (${activeTask.expectedValueMm} ± ${activeTask.toleranceMm} mm). Periksa kembali himpitan skala!`
        );
      }
    }
  };

  const handleNextTask = () => {
    setTaskSuccess(false);
    setUserInputMm('');
    setTaskError(null);
    const nextIdx = (currentTaskIndex + 1) % PRESET_TASKS.length;
    setTaskIndex(nextIdx);
  };

  return (
    <div className="w-full space-y-6">
      {/* Simulation Top Bar Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tool Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTool('vernier')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              activeTool === 'vernier'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jangka Sorong (2D/3D)
          </button>
          <button
            onClick={() => setActiveTool('micrometer')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              activeTool === 'micrometer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mikrometer Sekrup (2D/3D)
          </button>
        </div>

        {/* Mode Switcher: Mode Bebas vs Latihan Mengukur */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('free')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              mode === 'free'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Mode Bebas
          </button>
          <button
            onClick={() => setMode('task')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              mode === 'task'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Latihan Mengukur
          </button>
          <button
            onClick={resetSimulation}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Reset Posisi Alat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Instruction Banner (When in Task Mode) */}
      {mode === 'task' && activeTask && (
        <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-md">
              Task {currentTaskIndex + 1} dari {PRESET_TASKS.length}: {activeTask.title}
            </span>
            <div className="flex items-center gap-2">
              {PRESET_TASKS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTaskIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentTaskIndex ? 'bg-emerald-600 ring-2 ring-emerald-300 scale-125' : 'bg-emerald-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm font-medium text-emerald-950 leading-relaxed">
            {activeTask.instruction}
          </p>
        </div>
      )}

      {/* Main Simulation Viewport (Split 2D SVG + 3D Canvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: 2D Interactive SVG Tool */}
        <div className="lg:col-span-2 space-y-4">
          {activeTool === 'vernier' ? (
            <VernierCaliperSVG
              sliderX={vernierSliderX}
              onSliderChange={setVernierSliderX}
            />
          ) : (
            <MicrometerSVG
              thimbleX={micrometerThimbleX}
              onThimbleChange={setMicrometerThimbleX}
            />
          )}

          {/* Interactive Target Hitboxes Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Hitbox Drop-Zone (Simulasi Snap 3D ke 2D):
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {activeTool === 'vernier' ? (
                <>
                  <button
                    onClick={() => onTriggerHitboxDrop('outer_jaw')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 border border-slate-200 transition-colors"
                  >
                    🎯 Rahang Luar (Outer Jaw)
                  </button>
                  <button
                    onClick={() => onTriggerHitboxDrop('inner_jaw')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 border border-slate-200 transition-colors"
                  >
                    🎯 Rahang Dalam (Inner Jaw)
                  </button>
                  <button
                    onClick={() => onTriggerHitboxDrop('depth_rod')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 border border-slate-200 transition-colors"
                  >
                    🎯 Tangkai Kedalaman (Depth Rod)
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onTriggerHitboxDrop('micrometer_gap')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 border border-slate-200 transition-colors"
                >
                  🎯 Celah Spindel & Anvil Mikrometer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 1/3: 3D Object Dock & Viewport */}
        <div className="space-y-4 flex flex-col">
          {/* 3D Object Selector Dock */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Pilih Objek 3D Ukur (GLB):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelected3DObject('kampas_rem')}
                className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                  selected3DObject === 'kampas_rem'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center font-black">
                  K
                </div>
                <span>Kampas Rem 3D</span>
              </button>

              <button
                onClick={() => setSelected3DObject('baut')}
                className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                  selected3DObject === 'baut'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-500 text-white flex items-center justify-center font-black">
                  B
                </div>
                <span>Baut Presisi 3D</span>
              </button>
            </div>
          </div>

          {/* 3D R3F Viewport */}
          <div className="h-[280px] w-full flex-grow">
            <Canvas3D selectedObject={selected3DObject} snapState={snapState} />
          </div>
        </div>
      </div>

      {/* Task Measurement Input & Validation Card */}
      {mode === 'task' && activeTask && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-base">Input Hasil Pembacaan Pengukuran</h4>
            <span className="text-xs text-slate-500 font-mono">Ketelitian Toleransi: ± {activeTask.toleranceMm} mm</span>
          </div>

          {!taskSuccess ? (
            <form onSubmit={handleValidateInput} className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-grow">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Masukkan angka (contoh: 15.00)"
                    value={userInputMm}
                    onChange={(e) => setUserInputMm(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    mm
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Validasi Jawaban</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {taskError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{taskError}</span>
                </div>
              )}
            </form>
          ) : (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-3 text-emerald-800 font-bold text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Luar Biasa! Jawaban Kamu 100% Presisi!</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium">
                Hasil pengukuran {userInputMm} mm sesuai dengan spesifikasi teknis objek. Kamu telah menguasai teknik membaca alat ukur ini!
              </p>
              <button
                onClick={handleNextTask}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <span>Lanjut ke Task Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
