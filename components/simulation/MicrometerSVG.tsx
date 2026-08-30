'use client';

import React, { useRef, useEffect, memo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { calculateMicrometerReading } from '@/lib/utils/measurement';

interface MicrometerSVGProps {
  thimbleX: number; // Measurement in mm (0 to 25 mm)
  onThimbleChange?: (newMm: number) => void;
  maxMm?: number;
}

function MicrometerSVGInner({
  thimbleX,
  onThimbleChange,
  maxMm = 25,
}: MicrometerSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Natural origin in original SVG is at ~8.4 mm (thimble nose at 1020.6 px, zero mark at 895.0 px)
  const SCALE_PX_PER_MM = 15.0;
  const NATURAL_SVG_MM = 8.4;

  // 1. Motion value initialized strictly relative to natural SVG origin
  const dragX = useMotionValue(0);

  useEffect(() => {
    const targetX = (thimbleX - NATURAL_SVG_MM) * SCALE_PX_PER_MM;
    dragX.set(targetX);
  }, [thimbleX, dragX]);

  const reading = calculateMicrometerReading(thimbleX, maxMm, maxMm);

  // 2. Transform for thimble rotation numbers: 0.50 mm (7.5 SVG px) = 1 full rotation (400 SVG px vertical scroll)
  const PIXELS_PER_ROTATION = 7.5;
  const Y_MAX_SCROLL_PIXELS = 400;

  const angkaY = useTransform(dragX, (x) => {
    const rawRatio = (x % PIXELS_PER_ROTATION) / PIXELS_PER_ROTATION;
    const normRatio = rawRatio < 0 ? rawRatio + 1 : rawRatio;
    return -normRatio * Y_MAX_SCROLL_PIXELS;
  });

  // 2. Defer state update EXCLUSIVELY to onDragEnd
  const handleDragEnd = () => {
    if (onThimbleChange) {
      const currentX = dragX.get();
      const newMm = Math.max(0, Math.min(NATURAL_SVG_MM + currentX / SCALE_PX_PER_MM, maxMm));
      onThimbleChange(newMm);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-video max-w-4xl mx-auto flex items-center justify-center p-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs select-none">
      {/* Live Readout HUD Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-md flex items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
            Pembacaan Mikrometer Sekrup
          </span>
          <span className="text-2xl font-black text-[#10B981] font-mono">
            {reading.displayValue}
          </span>
        </div>
        <div className="text-xs text-slate-300 border-l border-slate-700 pl-3 space-y-0.5 font-mono">
          <div>Skala Sleeve Utama: <span className="font-bold text-white">{(reading.sleeveMainMm + reading.sleeveHalfMm).toFixed(1)} mm</span></div>
          <div>Skala Thimble Putar: <span className="font-bold text-white">{reading.thimbleValueMm.toFixed(2)} mm</span> (Divisi {reading.thimbleDivision})</div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 2480 1047.8"
          className="w-full h-full drop-shadow-md select-none overflow-visible"
          overflow="visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* SVG Mask ClipPath for Thimble Bevel Numbers */}
            <clipPath id="thimble-bevel-clip">
              <polygon points="1020.6,226.3 1115.6,207.3 1115.6,457.3 1020.6,476.3" />
            </clipPath>
          </defs>

          <style>{`
            .st0{fill:#E5E5E5;stroke:#000000;stroke-width:3;}
            .st1{fill:#CCCCCC;stroke:#000000;stroke-width:3;}
            .st2{fill:#B2B2B2;stroke:#000000;stroke-width:3;}
            .st3{font-family:'Calibri', sans-serif;}
            .st4{font-size:39.2639px;}
            .st5{font-size:51.7519px;}
            .st6{fill:none;stroke:#000000;stroke-width:2;}
            .st7{fill:none;stroke:#000000;stroke-width:3;}
            .st-num{font-family:'Arial', sans-serif;font-size:22px;font-weight:bold;fill:#000000;}
            .st-line{stroke:#000000;stroke-width:2;}
            .st-line-major{stroke:#000000;stroke-width:3.5;}
          `}</style>

          {/* 1. DOM LAYER 1 (BOTTOM): SPINDLE (Renders UNDER Base) */}
          <motion.g id="spindle" style={{ x: dragX }}>
            <path id="spindel" className="st0" d="M852.6,275.8H374.8c-0.2,15.4-0.3,31-0.3,46.7c0,16.3,0.1,32.4,0.3,48.3h477.8V275.8z" />
          </motion.g>

          {/* 2. DOM LAYER 2 (MIDDLE): BASE (Stationary U-Frame & Sleeve Scale) */}
          <g id="Base">
            <g>
              <path className="st1" d="M258.2,371h-70.6v-95.2h70.6c0.2,17.2-0.2,25.8-0.1,48.3C258.3,345.9,259.1,355.3,258.2,371z" />
              <path id="path1824" className="st1" d="M126,285.9v50c0,40-60,180-80,260c-30,120,100,410,400,410c320,0,410-290,410-390s10-140,20-160v-40H656h220v-190c0.1-5.6-6.4-5.3-10-5H666c-5,0-10,5-10,10v255c0,120-80,240-210,240c-150,0-230-110-230-230v-125c-10,0-10-95,0-95h-80C131,275.9,126,280.9,126,285.9z" />
              <path id="path6826" className="st2" d="M741,205.9l-10,10v230l10,10h35l10-10v-230l-10-10v250v-250H741v250V205.9z" />
            </g>
            <g>
              <g>
                <path id="body" className="st0" d="M1260,316v-90H877.1v200H1260V316" />
                <g>
                  <text transform="matrix(1.0697 0 0 1 969.8379 269.4639)" className="st3 st4">5</text>
                  <text transform="matrix(1.0697 0 0 1 1044.6719 269.4639)" className="st3 st4">10</text>
                  <text transform="matrix(0.8116 0 0 1 893.583 269.416)" className="st3 st5">0</text>
                  <path id="path15589" className="st6" d="M906.3,279v35V279z M981.3,279v35V279z M921.3,294v20V294z M936.3,294v20V294z M951.3,294v20V294z M966.3,294v20V294z" />
                  <path className="st6" d="M1055.6,279v35V279z" />
                  <path className="st6" d="M995.6,294v20V294z" />
                  <path className="st6" d="M1010.6,294v20V294z" />
                  <path className="st6" d="M1025.6,294v20V294z" />
                  <path className="st6" d="M1040.6,294v20V294z" />
                  <text transform="matrix(1.0697 0 0 1 1119.4424 269.4639)" className="st3 st4">15</text>
                  <path className="st6" d="M1130.4,279v35V279z" />
                  <path className="st6" d="M1070.4,294v20V294z" />
                  <path className="st6" d="M1085.4,294v20V294z" />
                  <path className="st6" d="M1100.4,294v20V294z" />
                  <path className="st6" d="M1115.4,294v20V294z" />
                  <text transform="matrix(1.0697 0 0 1 1193.9727 269.4639)" className="st3 st4">20</text>
                  <path className="st6" d="M1204.9,279v35V279z" />
                  <path className="st6" d="M1144.9,294v20V294z" />
                  <path className="st6" d="M1159.9,294v20V294z" />
                  <path className="st6" d="M1174.9,294v20V294z" />
                  <path className="st6" d="M1189.9,294v20V294z" />
                  <path id="path15605" className="st6" d="M914.5,338.9v25V338.9z M929.5,338.9v25V338.9z M944.5,338.9v25V338.9z M959.5,338.9v25V338.9z M974.5,338.9v25V338.9z M989.5,338.9v25V338.9z M1004.5,338.9v25V338.9z" />
                  <path id="path15605_2" className="st6" d="M1019.1,338.9v25V338.9z M1034.1,338.9v25V338.9z M1049.1,338.9v25V338.9z M1064.1,338.9v25V338.9z M1079.1,338.9v25V338.9z M1094.1,338.9v25V338.9z M1109.1,338.9v25V338.9z" />
                  <path id="path15605_3" className="st6" d="M1123.7,338.9v25V338.9z M1138.8,338.9v25V338.9z M1153.9,338.9v25V338.9z M1169,338.9v25V338.9z M1184.1,338.9v25V338.9z M1199.2,338.9v25V338.9z" />
                </g>
              </g>
              <line className="st7" x1="875.3" y1="326" x2="1517.7" y2="326" />
            </g>
          </g>

          {/* 3. DOM LAYER 3 (TOP): THIMBLE-ALL (Renders ON TOP of Base, style={{ x: dragX }}, no initial/animate props) */}
          <motion.g
            id="thimble-all"
            drag="x"
            style={{ x: dragX }}
            dragConstraints={{ left: -126, right: 249 }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className="cursor-ew-resize hover:filter hover:brightness-105"
          >
            <g id="thimble-vertikal">
              <path
                id="path71522"
                className="st2"
                d="M1910.6,261.3l10-10c10,0,10,150,0,150c10,0,10-150,0-150l180,10c10,0,10,130,0,130l-180,10l-10-10V261.3z"
              />
              <path
                id="path6824"
                className="st1"
                d="M1020.6,226.3c0-5,0-5,5-6l95-19h250v250h-250l-95-19c-5-1-5-1-5-6V226.3z"
              />
              <path
                id="path16672"
                className="st2"
                d="M1365.6,201.3l10-10v270v-270h55c5,0,5,270,0,270c5,0,5-270,0-270c1,0,6.5,10,6.5,10h8.5c5,0,5,250,0,250c5,0,5-250,0-250l10-10c5,0,5,270,0,270c5,0,5-270,0-270h380c5,0,5,270,0,270c5,0,5-270,0-270h25c5,0,5,270,0,270c5,0,5-270,0-270c2,0,4,70,4,70h46c5,0,5,130,0,130h-46c0,0-2,70-4,70h-25h-380l-10-10h-8.5c0,0-5.5,10-6.5,10h-55l-10-10V201.3z"
              />
            </g>

            {/* SVG Masked Thimble Numbers Group: id="angka" driven by angkaY */}
            <g clipPath="url(#thimble-bevel-clip)">
              <motion.g id="angka" style={{ y: angkaY }}>
                {[-1, 0, 1].map((cycle) => (
                  <g key={cycle} transform={`translate(0, ${cycle * Y_MAX_SCROLL_PIXELS})`}>
                    {Array.from({ length: 50 }).map((_, index) => {
                      const divNum = index;
                      const isMajor = divNum % 5 === 0;
                      // Each division line spaced by 8 SVG px (50 divisions = 400 SVG px)
                      const yPos = 326 - index * 8;

                      return (
                        <g key={index}>
                          <line
                            x1="1022"
                            y1={yPos}
                            x2={isMajor ? "1055" : "1040"}
                            y2={yPos}
                            className={isMajor ? "st-line-major" : "st-line"}
                          />
                          {isMajor && (
                            <text x="1062" y={yPos + 7} className="st-num">
                              {divNum}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                ))}
              </motion.g>
            </g>
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

const MicrometerSVG = memo(MicrometerSVGInner, (prev, next) => {
  return prev.thimbleX === next.thimbleX;
});

export default MicrometerSVG;
