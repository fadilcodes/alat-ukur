'use client';

import React, { useRef, useEffect, memo } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { calculateVernierReading } from '@/lib/utils/measurement';

interface VernierCaliperSVGProps {
  sliderX: number; // Measurement in mm (0 to 150 mm)
  onSliderChange?: (newMm: number) => void;
  maxMm?: number;
}

function VernierCaliperSVGInner({
  sliderX,
  onSliderChange,
  maxMm = 150,
}: VernierCaliperSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Vernier Scale math: 0 mm = -315.5 SVG px offset, 1 mm = 12.6 SVG px
  const ZERO_OFFSET_PX = -315.5;
  const SCALE_PX_PER_MM = 12.6;

  const currentTranslateX = ZERO_OFFSET_PX + sliderX * SCALE_PX_PER_MM;
  const maxTranslateX = ZERO_OFFSET_PX + maxMm * SCALE_PX_PER_MM;

  const reading = calculateVernierReading(sliderX, maxMm, maxMm);

  // 1. DOM-only MotionValue for zero-rerender 60fps dragging
  const dragX = useMotionValue(currentTranslateX);

  useEffect(() => {
    dragX.set(currentTranslateX);
  }, [currentTranslateX, dragX]);

  // 2. Defer state update EXCLUSIVELY to onDragEnd
  const handleDragEnd = () => {
    if (onSliderChange) {
      const currentX = dragX.get();
      const newMm = Math.max(0, Math.min((currentX - ZERO_OFFSET_PX) / SCALE_PX_PER_MM, maxMm));
      onSliderChange(newMm);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-video max-w-4xl mx-auto flex items-center justify-center p-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs select-none overflow-hidden">
      {/* Live Measurement Readout HUD Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-md flex items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
            Pembacaan Jangka Sorong
          </span>
          <span className="text-2xl font-black text-[#10B981] font-mono">
            {reading.displayValue}
          </span>
        </div>
        <div className="text-xs text-slate-300 border-l border-slate-700 pl-3 space-y-0.5 font-mono">
          <div>Skala Utama: <span className="font-bold text-white">{reading.mainScaleMm} mm</span></div>
          <div>Skala Nonius: <span className="font-bold text-white">{reading.vernierScaleMm.toFixed(2)} mm</span></div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 5283.5 1080"
          className="w-full h-full drop-shadow-md select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <style>{`
            .st0{fill:#999999;stroke:#000000;stroke-width:3;}
            .st1{fill:#CCCCCC;stroke:#000000;stroke-width:3;}
            .st2{font-family:'ArialMT';}
            .st3{font-size:24.2px;}
            .st4{fill:#E5E5E5;stroke:#000000;stroke-width:3;}
            .st5{stroke:#000000;stroke-width:2;}
            .st6{stroke:#000000;stroke-width:1.5;}
            .st7{stroke:#000000;stroke-width:1.75;}
            .st8{font-size:40px;}
            .st9{font-size:24px;}
            .st10{font-size:32px;}
            .st11{fill:#B2B2B2;stroke:#000000;stroke-width:3;}
            .st12{stroke:#000000;}
            .st13{font-size:20px;}
            .st14{fill:#CDCDCD;stroke:#000000;stroke-width:3;}
          `}</style>

          {/* DOM LAYER 1 (BOTTOM): BATANG (Depth Probe Stick - renders UNDER Base) */}
          <motion.g
            id="batang"
            style={{ x: dragX }}
          >
            <path className="st0" d="M754,392.3h2204.9v17.5h61v23H753.1L754,392.3z" />
          </motion.g>

          {/* DOM LAYER 2 (MIDDLE): BASE (Stationary Main Scale Ruler Frame) */}
          <g id="base">
            <path
              id="path1873"
              className="st1"
              d="M180.9,244.2H94.5c-9.7,0-10.2,4.9-10.2,10.2V571l74.8,314c19.3,80.9,46.9,106.2,105.2,106.2V630h-8V501.5H335v8h2364.3V310.8H335v8h-72.4v-68.1c0-125.1-71.3-197.9-91.6-212.3v126.1h9.9V244.2z"
            />
            <text transform="matrix(0.8182 0 0 1 114.2036 453.9697)" className="st2 st3">
              INOX TEMP
            </text>
            <text transform="matrix(0.8182 0 0 1 146.3594 481.7998)" className="st2 st3">
              20°C
            </text>
            <path
              id="path2760"
              className="st4"
              d="M218.3,854.6c-8.7,0-9.6,3.2-9.6,9.6v113.4c15.2,10.5,36.7,13.8,55.6,13.6V854.6H218.3z"
            />
            <path
              id="path2765"
              className="st4"
              d="M171,38.4v126.1h9.9l-0.1,26h23.5l-0.4-117.9C195,61,184.4,48.7,171,38.4z"
            />

            {/* Main CM Scale Major (10mm) Lines */}
            <path
              id="scale-cm-1"
              className="st5"
              stroke="#000000"
              strokeWidth="2"
              d="M296.5,434v56V434z M422.5,434v56V434z M548.5,434v56V434z M674.5,434v56V434z M800.5,434v56V434z M926.5,434v56V434z M1052.5,434v56V434z M1178.5,434v56V434z M1304.5,434v56V434z M1430.5,434v56V434z M1556.5,434v56V434z M1682.5,434v56V434z M1808.5,434v56V434z M1934.5,434v56V434z M2060.5,434v56V434z M2186.5,434v56V434z M2312.5,434v56V434z M2438.5,434v56V434z M2564.5,434v56V434z"
            />

            {/* Main CM Scale Minor (1mm) Lines */}
            <path
              id="scale-cm-10"
              className="st6"
              stroke="#000000"
              strokeWidth="1.5"
              d="M309.1,456v34V456z M321.7,456v34V456z M334.3,456v34V456z M346.9,456v34V456z M372.1,456v34V456z M384.7,456v34V456z M397.3,456v34V456z M409.9,456v34V456z M435.1,456v34V456z M447.7,456v34V456z M460.3,456v34V456z M472.9,456v34V456z M498.1,456v34V456z M510.7,456v34V456z M523.3,456v34V456z M535.9,456v34V456z M561.1,456v34V456z M573.7,456v34V456z M586.3,456v34V456z M598.9,456v34V456z M624.1,456v34V456z M636.7,456v34V456z M649.3,456v34V456z M661.9,456v34V456z M687.1,456v34V456z M699.7,456v34V456z M712.3,456v34V456z M724.9,456v34V456z M750.1,456v34V456z M762.7,456v34V456z M775.3,456v34V456z M787.9,456v34V456z M813.1,456v34V456z M825.7,456v34V456z M838.3,456v34V456z M850.9,456v34V456z M876.1,456v34V456z M888.7,456v34V456z M901.3,456v34V456z M913.9,456v34V456z M939.1,456v34V456z M951.7,456v34V456z M964.3,456v34V456z M976.9,456v34V456z M1002.1,456v34V456z M1014.7,456v34V456z M1027.3,456v34V456z M1039.9,456v34V456z M1065.1,456v34V456z M1077.7,456v34V456z M1090.3,456v34V456z M1102.9,456v34V456z M1128.1,456v34V456z M1140.7,456v34V456z M1153.3,456v34V456z M1165.9,456v34V456z M1191.1,456v34V456z M1203.7,456v34V456z M1216.3,456v34V456z M1228.9,456v34V456z M1254.1,456v34V456z M1266.7,456v34V456z M1279.3,456v34V456z M1291.9,456v34V456z M1317.1,456v34V456z M1329.7,456v34V456z M1342.3,456v34V456z M1354.9,456v34V456z M1380.1,456v34V456z M1392.7,456v34V456z M1405.3,456v34V456z M1417.9,456v34V456z M1443.1,456v34V456z M1455.7,456v34V456z M1468.3,456v34V456z M1480.9,456v34V456z M1506.1,456v34V456z M1518.7,456v34V456z M1531.3,456v34V456z M1543.9,456v34V456z M1569.1,456v34V456z M1581.7,456v34V456z M1594.3,456v34V456z M1606.9,456v34V456z M1632.1,456v34V456z M1644.7,456v34V456z M1657.3,456v34V456z M1669.9,456v34V456z M1695.1,456v34V456z M1707.7,456v34V456z M1720.3,456v34V456z M1732.9,456v34V456z M1758.1,456v34V456z M1770.7,456v34V456z M1783.3,456v34V456z M1795.9,456v34V456z M1821.1,456v34V456z M1833.7,456v34V456z M1846.3,456v34V456z M1858.9,456v34V456z M1884.1,456v34V456z M1896.7,456v34V456z M1909.3,456v34V456z M1921.9,456v34V456z M1947.1,456v34V456z M1959.7,456v34V456z M1972.3,456v34V456z M1984.9,456v34V456z M2010.1,456v34V456z M2022.7,456v34V456z M2035.3,456v34V456z M2047.9,456v34V456z M2073.1,456v34V456z M2085.7,456v34V456z M2098.3,456v34V456z M2110.9,456v34V456z M2136.1,456v34V456z M2148.7,456v34V456z M2161.3,456v34V456z M2173.9,456v34V456z M2199.1,456v34V456z M2211.7,456v34V456z M2224.3,456v34V456z M2236.9,456v34V456z M2262.1,456v34V456z M2274.7,456v34V456z M2287.3,456v34V456z M2299.9,456v34V456z M2325.1,456v34V456z M2337.7,456v34V456z M2350.3,456v34V456z M2362.9,456v34V456z M2388.1,456v34V456z M2400.7,456v34V456z M2413.3,456v34V456z M2425.9,456v34V456z M2451.1,456v34V456z M2463.7,456v34V456z M2476.3,456v34V456z M2488.9,456v34V456z M2514.1,456v34V456z M2526.7,456v34V456z M2539.3,456v34V456z M2551.9,456v34V456z M2564.5,456v34V456z"
            />

            {/* Main CM Scale Mid (5mm) Lines */}
            <path
              id="scale-cm-2"
              className="st7"
              stroke="#000000"
              strokeWidth="1.75"
              d="M359.5,447.5V490V447.5z M485.5,447.5V490V447.5z M611.5,447.5V490V447.5z M737.5,447.5V490V447.5z M863.5,447.5V490V447.5z M989.5,447.5V490V447.5z M1115.5,447.5V490V447.5z M1241.5,447.5V490V447.5z M1367.5,447.5V490V447.5z M1493.5,447.5V490V447.5z M1619.5,447.5V490V447.5z M1745.5,447.5V490V447.5z M1871.5,447.5V490V447.5z M1997.5,447.5V490V447.5z M2123.5,447.5V490V447.5z M2249.5,447.5V490V447.5z M2375.5,447.5V490V447.5z M2501.5,447.5V490V447.5z"
            />

            <g id="text-cm">
              <text transform="matrix(1 0 0 1 306.77 442)" className="st2 st8 font-bold">0</text>
              <text transform="matrix(1 0 0 1 432.77 442)" className="st2 st8 font-bold">1</text>
              <text transform="matrix(1 0 0 1 558.77 442)" className="st2 st8 font-bold">2</text>
              <text transform="matrix(1 0 0 1 684.77 442)" className="st2 st8 font-bold">3</text>
              <text transform="matrix(1 0 0 1 810.77 442)" className="st2 st8 font-bold">4</text>
              <text transform="matrix(1 0 0 1 936.77 442)" className="st2 st8 font-bold">5</text>
              <text transform="matrix(1 0 0 1 1062.77 442)" className="st2 st8 font-bold">6</text>
              <text transform="matrix(1 0 0 1 1188.77 442)" className="st2 st8 font-bold">7</text>
              <text transform="matrix(1 0 0 1 1314.77 442)" className="st2 st8 font-bold">8</text>
              <text transform="matrix(1 0 0 1 1440.77 442)" className="st2 st8 font-bold">9</text>
              <text transform="matrix(1 0 0 1 1555.647 442)" className="st2 st8 font-bold">10</text>
              <text transform="matrix(1 0 0 1 1683.1313 442)" className="st2 st8 font-bold">11</text>
              <text transform="matrix(1 0 0 1 1807.647 442)" className="st2 st8 font-bold">12</text>
              <text transform="matrix(1 0 0 1 1933.647 442)" className="st2 st8 font-bold">13</text>
              <text transform="matrix(1 0 0 1 2059.647 442)" className="st2 st8 font-bold">14</text>
              <text transform="matrix(1 0 0 1 2185.647 442)" className="st2 st8 font-bold">15</text>
              <text transform="matrix(1 0 0 1 2631.3931 437.124)" className="st2 st9 font-bold">cm</text>
            </g>
          </g>

          {/* DOM LAYER 3 (TOP): SLIDER (Draggable Sliding Jaw - renders ON TOP of Base) */}
          <motion.g
            id="slider"
            drag="x"
            style={{ x: dragX }}
            dragConstraints={{ left: ZERO_OFFSET_PX, right: maxTranslateX }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className="cursor-ew-resize hover:filter hover:brightness-105"
          >
            <path
              className="st11"
              d="M557.4,36.3v127.4h-11.8v79.7h135.3v66.8h-202v-90.6C478.9,162.1,496,92.4,557.4,36.3L557.4,36.3z"
            />
            <path className="st4" d="M585.2,232.9l0.1,96.9h630.4v-96.9L585.2,232.9z" />
            <path className="st1" d="M585.2,232.9h630.5v48.7H585.3L585.2,232.9z" />

            <path
              className="st1"
              d="M594.7,579.1v44l-11.7,0.2v367.5c0,0,60,9.6,90.9-106.5l56.9-213.8c6.7-25.2,22.9-35.1,61.1-35.3h423.7v-56.1H594.7z"
            />
            <path
              className="st11"
              d="M866.2,588.5c0,0,0,59.6,0,64.4s2.1,7,12.1,7s167,6.3,167,6.3s49.9,32.1,91.3,31.9c47.1-0.2,78-24.5,78-24.5l1.9-66.6L866.2,588.5z"
            />
            <path className="st4" d="M585.1,486.3h630.5v102H585.1V486.3z" />
            <path className="st14" d="M585.1,537.6v50.7h630.5v-50.7H585.1z" />

            {/* Vernier Scale Lines (0.1mm & 0.05mm ticks) */}
            <path
              id="path5972"
              className="st5"
              stroke="#000000"
              strokeWidth="2"
              d="M607.7,486.2v41.7V486.2z M656.9,486.2v41.7V486.2z M706,486.2v41.7V486.2z M755.1,486.2v41.7V486.2z M804.3,486.2v41.7V486.2z M853.4,486.2v41.7V486.2z M902.6,486.2v41.7V486.2z M951.7,486.2v41.7V486.2z M1000.8,486.2v41.7V486.2z M1050,486.2v41.7V486.2z M1099.1,486.2v41.7V486.2z"
            />
            <path
              id="path5978"
              className="st12"
              stroke="#000000"
              strokeWidth="1.5"
              d="M632.3,486.6v28.2V486.6z M681.4,486.6v28.2V486.6z M730.6,486.6v28.2V486.6z M779.7,486.6v28.2V486.6z M828.8,486.6v28.2V486.6z M878,486.6v28.2V486.6z M927.1,486.6v28.2V486.6z M976.3,486.6v28.2V486.6z M1025.4,486.6v28.2V486.6z M1074.5,486.6v28.2V486.6z"
            />

            <g id="text-cm-venier">
              <text transform="matrix(1 0 0 1 612.0375 523.4275)" className="st2 st9">0</text>
              <text transform="matrix(1 0 0 1 661.1776 523.4275)" className="st2 st9">1</text>
              <text transform="matrix(1 0 0 1 710.3175 523.4275)" className="st2 st9">2</text>
              <text transform="matrix(1 0 0 1 759.4576 523.4275)" className="st2 st9">3</text>
              <text transform="matrix(1 0 0 1 808.5975 523.4275)" className="st2 st9">4</text>
              <text transform="matrix(1 0 0 1 857.7375 523.4275)" className="st2 st9">5</text>
              <text transform="matrix(1 0 0 1 906.8776 523.4275)" className="st2 st9">6</text>
              <text transform="matrix(1 0 0 1 956.0175 523.4275)" className="st2 st9">7</text>
              <text transform="matrix(1 0 0 1 1005.1576 523.4275)" className="st2 st9">8</text>
              <text transform="matrix(1 0 0 1 1054.2977 523.4275)" className="st2 st9">9</text>
              <text transform="matrix(1 0 0 1 1103.4376 523.4275)" className="st2 st9">0</text>
              <text transform="matrix(1 0 0 1 1132.3114 507.2615)" className="st2 st13">0.05 mm</text>
            </g>
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

const VernierCaliperSVG = memo(VernierCaliperSVGInner, (prev, next) => {
  return prev.sliderX === next.sliderX;
});

export default VernierCaliperSVG;

