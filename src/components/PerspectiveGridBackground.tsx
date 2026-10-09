'use client';

import React from 'react';

export interface PerspectiveGridBackgroundProps {
  /** Grid line opacity between 0.10 and 0.18. Defaults to 0.14 */
  lineOpacity?: number;
  /** Perspective distance in px. Defaults to 550 */
  perspective?: number;
  /** Grid tilt angle in degrees. Defaults to 62 */
  rotateX?: number;
}

export default function PerspectiveGridBackground({
  lineOpacity = 0.14,
  perspective = 550,
  rotateX = 62,
}: PerspectiveGridBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 
        Perspective container with perspective-origin anchored at TOP CENTER (50% 0%).
        Ancestor has clip-path: inset(0) without transform/filter so position:fixed stays truly viewport-fixed.
      */}
      <div
        className="w-full h-full flex items-start justify-center"
        style={{
          perspective: `${perspective}px`,
          perspectiveOrigin: '50% 0%',
        }}
      >
        {/*
          Tilted grid plane using pure CSS.
          Vertical lines converge upward toward vanishing point at top center and spread wider toward the bottom.
          Soft radial mask gradient fades out toward the edges and top for atmospheric depth.
        */}
        <div
          className="w-[220vw] h-[190vh] shrink-0 will-change-transform"
          style={{
            transform: `rotateX(${rotateX}deg)`,
            transformOrigin: '50% 0%',
            backgroundImage: `
              linear-gradient(to right, rgba(106, 53, 39, ${lineOpacity}) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(106, 53, 39, ${lineOpacity}) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            WebkitMaskImage:
              'radial-gradient(ellipse 75% 65% at 50% 45%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 80%)',
            maskImage:
              'radial-gradient(ellipse 75% 65% at 50% 45%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 80%)',
          }}
        />
      </div>
    </div>
  );
}
