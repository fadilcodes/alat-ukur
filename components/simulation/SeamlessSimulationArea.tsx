'use client';

import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore, PRESET_TASKS } from '@/lib/zustand/useSimulationStore';
import { calculateVernierReading, calculateMicrometerReading } from '@/lib/utils/measurement';
import VernierCaliperSVG from './VernierCaliperSVG';
import MicrometerSVG from './MicrometerSVG';
import { CheckCircle2, RotateCcw, Move, RotateCw } from 'lucide-react';

export default function SeamlessSimulationArea() {
  const {
    activeTool,
    vernierSliderX,
    micrometerThimbleX,
    feedbackMessage,
    setActiveTool,
    setVernierSliderX,
    setMicrometerThimbleX,
    resetSimulation,
  } = useSimulationStore();

  // Main Simulation Canvas Boundary Ref for Draggable Objects
  const canvasRef = useRef<HTMLDivElement>(null);

  // Rotation angles for 4 sample objects (in degrees)
  const [rotations, setRotations] = useState<{ [key: string]: number }>({
    'baut-side': 0,
    'baut-top': 0,
    'kampas-side': 0,
    'kampas-top': 0,
  });

  const handleRotate = (key: string) => {
    setRotations((prev) => ({
      ...prev,
      [key]: (prev[key] + 90) % 360,
    }));
  };

  // Readouts
  const currentVernierReading = calculateVernierReading(vernierSliderX, 600, 150);
  const currentMicrometerReading = calculateMicrometerReading(micrometerThimbleX, 500, 25);
  const activeReadingMm =
    activeTool === 'vernier' ? currentVernierReading.totalMm : currentMicrometerReading.totalMm;

  const displayReadingFormatted = activeReadingMm.toFixed(2);

  const handleReset = () => {
    resetSimulation();
    setRotations({
      'baut-side': 0,
      'baut-top': 0,
      'kampas-side': 0,
      'kampas-top': 0,
    });
  };

  return (
    <div className="w-full space-y-6 select-none max-w-5xl mx-auto">
      {/* Centered Tool Switcher Tabs */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1 bg-slate-200/60 p-1.5 rounded-full border border-slate-200/40">
          <button
            onClick={() => setActiveTool('vernier')}
            className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all ${
              activeTool === 'vernier'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Vernier Caliper
          </button>
          <button
            onClick={() => setActiveTool('micrometer')}
            className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all ${
              activeTool === 'micrometer'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Micrometer
          </button>
        </div>
      </div>

      {/* Main Interactive Simulation Canvas Box (Boundary for Draggable Items) */}
      <div
        ref={canvasRef}
        className="relative bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-5"
      >
        {/* Inner Grid Canvas Container */}
        <div className="bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-[#FBFDFB] rounded-2xl p-3 sm:p-6 border border-slate-200/60 flex flex-col items-center justify-center relative min-h-[360px] overflow-x-auto w-full">
          {/* Top Labels */}
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 pointer-events-none absolute top-3 left-3 sm:top-4 sm:left-4 tracking-wider">
            Zona Pengukuran
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 pointer-events-none absolute top-3 right-3 sm:top-4 sm:right-4 tracking-wider flex items-center gap-1">
            ● Siap
          </span>

          {/* Reset Button Top Right inside Canvas */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-16 p-1.5 text-slate-400 hover:text-slate-700 bg-white/80 rounded-lg border border-slate-200/60 shadow-2xs transition-colors z-20"
            title="Reset Posisi Alat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* SVG Measurement Tool */}
          <div className="relative w-full flex items-center justify-center py-2">
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
          </div>

          {/* Floating Measurement Readout Pill */}
          <div className="bg-white shadow-md border border-slate-100/90 rounded-2xl px-6 py-2.5 flex items-center gap-2 my-2 text-xs font-bold text-slate-500 z-10">
            <span>Pembacaan:</span>
            <span className="text-[#10B981] font-black text-xl font-mono">
              {displayReadingFormatted} mm
            </span>
          </div>

          {/* Helper Text */}
          <span className="text-[11px] font-semibold text-slate-400 text-center block pt-1">
            Bebas tarik benda dari rak bawah & geser rahang alat untuk mengukur
          </span>
        </div>

        {/* 2D Draggable Sample Objects Shelf (Rak Benda Uji - Free Floating Drag & Rotate) */}
        <div className="relative bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
                <Move className="w-4 h-4 text-[#10B981]" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-800 block">Rak Benda Uji 2D (Bebas Ditarik & Diputar)</span>
                <span className="text-[11px] font-bold text-slate-400 block">
                  Tarik benda ke rahang alat ukur. Klik "Putar 🔄" untuk memutar arah pandang benda 90°
                </span>
              </div>
            </div>
          </div>

          {/* Grid of 4 Sample Objects: Baut Samping, Baut Atas, Kampas Samping, Kampas Atas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            {/* 1. Baut Tampak Samping */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center gap-2 relative">
              <motion.img
                src="/assets/baut-side.webp"
                alt="Baut Tampak Samping"
                drag
                dragMomentum={false}
                dragConstraints={canvasRef}
                dragElastic={0}
                animate={{ rotate: rotations['baut-side'] }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.08 }}
                whileDrag={{ scale: 1.15, zIndex: 100 }}
                style={{ touchAction: 'none' }}
                className="w-16 h-16 object-contain cursor-grab active:cursor-grabbing relative z-50 drop-shadow-md select-none"
              />
              <span className="text-[10px] font-extrabold text-slate-700 block text-center">
                ⚙️ Baut (Samping)
              </span>
              <button
                onClick={() => handleRotate('baut-side')}
                className="w-full py-1 px-2 text-[10px] font-extrabold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                title="Putar Benda 90 Derajat"
              >
                <RotateCw className="w-3 h-3 text-[#10B981]" />
                <span>Putar ({rotations['baut-side']}°)</span>
              </button>
            </div>

            {/* 2. Baut Tampak Atas */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center gap-2 relative">
              <motion.img
                src="/assets/baut-top-view.webp"
                alt="Baut Tampak Atas"
                drag
                dragMomentum={false}
                dragConstraints={canvasRef}
                dragElastic={0}
                animate={{ rotate: rotations['baut-top'] }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.08 }}
                whileDrag={{ scale: 1.15, zIndex: 100 }}
                style={{ touchAction: 'none' }}
                className="w-16 h-16 object-contain cursor-grab active:cursor-grabbing relative z-50 drop-shadow-md select-none"
              />
              <span className="text-[10px] font-extrabold text-slate-700 block text-center">
                ⚙️ Baut (Tampak Atas)
              </span>
              <button
                onClick={() => handleRotate('baut-top')}
                className="w-full py-1 px-2 text-[10px] font-extrabold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                title="Putar Benda 90 Derajat"
              >
                <RotateCw className="w-3 h-3 text-[#10B981]" />
                <span>Putar ({rotations['baut-top']}°)</span>
              </button>
            </div>

            {/* 3. Kampas Rem Tampak Samping */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center gap-2 relative">
              <motion.img
                src="/assets/kampas-rem-side.webp"
                alt="Kampas Rem Tampak Samping"
                drag
                dragMomentum={false}
                dragConstraints={canvasRef}
                dragElastic={0}
                animate={{ rotate: rotations['kampas-side'] }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.08 }}
                whileDrag={{ scale: 1.15, zIndex: 100 }}
                style={{ touchAction: 'none' }}
                className="w-20 h-16 object-contain cursor-grab active:cursor-grabbing relative z-50 drop-shadow-md select-none"
              />
              <span className="text-[10px] font-extrabold text-slate-700 block text-center">
                🛑 Kampas Rem (Samping)
              </span>
              <button
                onClick={() => handleRotate('kampas-side')}
                className="w-full py-1 px-2 text-[10px] font-extrabold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                title="Putar Benda 90 Derajat"
              >
                <RotateCw className="w-3 h-3 text-[#10B981]" />
                <span>Putar ({rotations['kampas-side']}°)</span>
              </button>
            </div>

            {/* 4. Kampas Rem Tampak Atas */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center gap-2 relative">
              <motion.img
                src="/assets/kampas-rem-top.webp"
                alt="Kampas Rem Tampak Atas"
                drag
                dragMomentum={false}
                dragConstraints={canvasRef}
                dragElastic={0}
                animate={{ rotate: rotations['kampas-top'] }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.08 }}
                whileDrag={{ scale: 1.15, zIndex: 100 }}
                style={{ touchAction: 'none' }}
                className="w-20 h-16 object-contain cursor-grab active:cursor-grabbing relative z-50 drop-shadow-md select-none"
              />
              <span className="text-[10px] font-extrabold text-slate-700 block text-center">
                🛑 Kampas Rem (Tampak Atas)
              </span>
              <button
                onClick={() => handleRotate('kampas-top')}
                className="w-full py-1 px-2 text-[10px] font-extrabold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                title="Putar Benda 90 Derajat"
              >
                <RotateCw className="w-3 h-3 text-[#10B981]" />
                <span>Putar ({rotations['kampas-top']}°)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Message Banner */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-3 bg-[#E8F8F0] border border-[#D1F2E2] rounded-xl text-xs font-bold text-[#047857] flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>{feedbackMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

