'use client';

import React, { memo } from 'react';

interface MicrometerThimbleOverlayProps {
  thimbleValue: number; // Continuous value from 0.00 to 49.99 (thimble rotation division)
  thimbleX: number;
}

function MicrometerThimbleOverlayInner({ 
  thimbleValue,
}: MicrometerThimbleOverlayProps) {
  const ITEM_HEIGHT = 10; // Height in px per 1 division mark (50 divisions = 500px cycle)
  const CYCLE_HEIGHT = 50 * ITEM_HEIGHT; // 500px per cycle

  // Center cycle 0 starts at -CYCLE_HEIGHT (-500px)
  // Continuous translateY calculation for seamless 3D rotation simulation
  const translateY = -CYCLE_HEIGHT - thimbleValue * ITEM_HEIGHT;

  return (
    <div className="absolute top-[21.6%] left-[45.2%] w-[4.8%] h-[23.8%] min-w-[54px] min-h-[140px] pointer-events-none overflow-hidden flex items-center justify-start z-10 font-mono select-none rounded-r-xs">
      {/* Center Datum Line (Horizontal alignment line on thimble bevel) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-red-600 z-30 shadow-xs" />

      {/* 3D Cylindrical Shading Gradient (Simulates 3D curved thimble surface) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/60 z-20 pointer-events-none" />

      {/* Vertically Scrolling Numbers Column */}
      <div
        className="relative w-full flex flex-col items-start pl-2 z-10"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          willChange: 'transform',
        }}
      >
        {/* 3 Repeating Cycles [-1, 0, 1] for 100% seamless looping */}
        {[-1, 0, 1].map((cycle) => (
          <div key={cycle} className="flex flex-col">
            {Array.from({ length: 50 }).map((_, index) => {
              const divNum = index;
              const isMajor = divNum % 5 === 0;
              const roundedDiv = Math.round(thimbleValue) % 50;
              const isCurrent = divNum === roundedDiv;

              return (
                <div
                  key={`${cycle}-${index}`}
                  className="flex items-center gap-1 h-[10px] select-none shrink-0"
                >
                  <div
                    className={`h-[1.5px] transition-colors ${
                      isMajor ? 'w-3.5 bg-slate-900' : 'w-2 bg-slate-700'
                    } ${isCurrent ? 'bg-red-600 h-[2px]' : ''}`}
                  />

                  {isMajor ? (
                    <span
                      className={`text-[9px] font-mono leading-none transition-all ${
                        isCurrent
                          ? 'font-black text-red-600 scale-110'
                          : 'font-bold text-slate-800'
                      }`}
                    >
                      {divNum}
                    </span>
                  ) : (
                    <span className="w-3" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

const MicrometerThimbleOverlay = memo(MicrometerThimbleOverlayInner, (prev, next) => {
  return (
    Math.abs(prev.thimbleValue - next.thimbleValue) < 0.01 &&
    prev.thimbleX === next.thimbleX
  );
});

export default MicrometerThimbleOverlay;

