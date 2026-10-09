'use client';

import React, { useEffect, useRef, useState } from 'react';

// ── Tuning Constants ────────────────────────────────────────────────────────
// C1: Lower lerp factor (0.10 → 0.12) for trailing blob to lag noticeably behind dot
const LERP_RING = 0.11;
const RING_DEFAULT = 36;   // base outer blob diameter in px
// ─────────────────────────────────────────────────────────────────────────────

export default function CustomCursor() {
  const [isPointerFine, setIsPointerFine] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const blendRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  const posRef = useRef({
    // mouse position
    x: -200,
    y: -200,
    // lerped ring position
    rx: -200,
    ry: -200,
    // velocity & motion direction
    angle: 0,
    // ring size / scale lerp
    scaleCur: 1,
    scaleTgt: 1,
    // state tracking
    hoverType: 'default' as 'default' | 'interactive' | 'magnetic',
    isInsideHero: false,
    isInvert: false,
    prevIsHeroPrompt: false,
    prevIsInvert: false,
  });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const onMq = () => setIsPointerFine(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    if (!mq.matches) return () => mq.removeEventListener('change', onMq);

    document.documentElement.classList.add('custom-cursor-active');

    const onMove = (e: MouseEvent) => {
      const pos = posRef.current;
      pos.x = e.clientX;
      pos.y = e.clientY;
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    let rafId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      const pos = posRef.current;

      // 1. Position lerping with C1 lower lerp factor (0.11)
      pos.rx = lerp(pos.rx, pos.x, LERP_RING);
      pos.ry = lerp(pos.ry, pos.y, LERP_RING);

      // 2. Velocity tracking & motion stretching (C1)
      const vx = pos.x - pos.rx;
      const vy = pos.y - pos.ry;
      const dist = Math.hypot(vx, vy);

      // Normalized speed: 0 when resting, ~0.7-1.0 on brisk movement, capped at 1.5
      const rawSpeed = dist * 0.025;
      const speed = Math.min(rawSpeed, 1.5);

      // Stretch in direction of motion: scaleX = 1 + speed * 0.4, scaleY = 1 - speed * 0.2
      const stretchX = Math.min(1.65, Math.max(1.0, 1 + speed * 0.4));
      const stretchY = Math.max(0.65, Math.min(1.0, 1 - speed * 0.2));

      // Update orientation angle when in motion
      if (dist > 0.8) {
        pos.angle = Math.atan2(vy, vx);
      }

      // 3. Dynamic target element & context detection under cursor
      if (
        pos.x >= 0 &&
        pos.y >= 0 &&
        pos.x <= window.innerWidth &&
        pos.y <= window.innerHeight &&
        typeof document !== 'undefined'
      ) {
        const el = document.elementFromPoint(pos.x, pos.y);
        if (el) {
          // Hover category
          const isInteractive = Boolean(
            el.closest('a, button, [role="button"], input, select, textarea, [tabindex="0"]')
          );
          const isMagnetic = Boolean(el.closest('[data-magnetic-text]'));

          if (isInteractive) {
            pos.hoverType = 'interactive';
          } else if (isMagnetic) {
            pos.hoverType = 'magnetic';
          } else {
            pos.hoverType = 'default';
          }

          // Hero zone detection (C2)
          const inHeroDom = Boolean(el.closest('#hero, [data-hero-zone]'));
          let inHeroRect = false;
          const heroEl = document.getElementById('hero');
          if (heroEl) {
            const rect = heroEl.getBoundingClientRect();
            inHeroRect = pos.y >= rect.top && pos.y <= rect.bottom;
          }
          pos.isInsideHero = inHeroDom || inHeroRect;

          // Selective cursor invert detection (C3)
          pos.isInvert = Boolean(el.closest('[data-cursor-invert]'));
        }
      }

      // 4. Target scale based on state
      if (pos.hoverType === 'interactive') {
        pos.scaleTgt = 1.45;
      } else if (pos.hoverType === 'magnetic') {
        pos.scaleTgt = 1.15;
      } else if (pos.isInsideHero && pos.hoverType === 'default') {
        pos.scaleTgt = 1.25;
      } else {
        pos.scaleTgt = 1.0;
      }
      pos.scaleCur = lerp(pos.scaleCur, pos.scaleTgt, 0.15);

      // 5. C1 — Gooey Outer Blob: scaleX/scaleY + borderRadius distortion driven by velocity
      if (ringRef.current) {
        const totalScaleX = pos.scaleCur * stretchX;
        const totalScaleY = pos.scaleCur * stretchY;

        // Dynamic fluid border-radius deformation
        const r1 = Math.round(Math.min(65, 50 + speed * 8));
        const r2 = Math.round(Math.max(35, 50 - speed * 8));
        ringRef.current.style.borderRadius = `${r1}% ${r2}% ${r1}% ${r2}% / ${r2}% ${r1}% ${r2}% ${r1}%`;

        // Direct GPU transform: position, center alignment, velocity rotation, and scale deformation
        ringRef.current.style.transform = `translate3d(${pos.rx}px, ${pos.ry}px, 0) translate(-50%, -50%) rotate(${pos.angle}rad) scale(${totalScaleX}, ${totalScaleY})`;
      }

      // 6. C3 — Selective mix-blend-mode inversion
      if (blendRef.current && pos.isInvert !== pos.prevIsInvert) {
        pos.prevIsInvert = pos.isInvert;
        if (pos.isInvert) {
          blendRef.current.style.mixBlendMode = 'difference';
          blendRef.current.style.opacity = '1';
          if (ringRef.current) {
            ringRef.current.style.borderColor = 'transparent';
          }
        } else {
          blendRef.current.style.mixBlendMode = 'normal';
          blendRef.current.style.opacity = pos.hoverType === 'interactive' ? '0.35' : '0.18';
          if (ringRef.current) {
            ringRef.current.style.borderColor = 'rgba(106, 53, 39, 0.45)';
          }
        }
      }

      // 7. C2 — Inner dot → Down-arrow on scroll prompt (inside hero zone when hoverType === 'default')
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
        dotRef.current.style.opacity = pos.hoverType === 'interactive' ? '0' : '1';

        const isHeroPrompt = pos.hoverType === 'default' && pos.isInsideHero;
        if (isHeroPrompt !== pos.prevIsHeroPrompt) {
          pos.prevIsHeroPrompt = isHeroPrompt;
          if (isHeroPrompt) {
            // Swap 12px dot for a ↓ SVG chevron with ~28px bubble around it
            dotRef.current.style.width = '28px';
            dotRef.current.style.height = '28px';
            dotRef.current.style.backgroundColor = '#241B17';
            dotRef.current.style.border = '1px solid rgba(212, 162, 76, 0.55)';
            if (chevronRef.current) chevronRef.current.style.opacity = '1';
          } else {
            // Return to 12px dot
            dotRef.current.style.width = '12px';
            dotRef.current.style.height = '12px';
            dotRef.current.style.backgroundColor = '#6A3527';
            dotRef.current.style.border = 'none';
            if (chevronRef.current) chevronRef.current.style.opacity = '0';
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      mq.removeEventListener('change', onMq);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!isPointerFine) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* C2: Center Point / Hero Scroll Prompt Bubble */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full flex items-center justify-center pointer-events-none will-change-transform transition-[width,height,background-color,border-color,opacity] duration-300 ease-out shadow-xs"
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#6A3527',
        }}
      >
        <div
          ref={chevronRef}
          className="transition-opacity duration-200 flex items-center justify-center opacity-0 pointer-events-none text-[#FBF8F3]"
        >
          {/* ↓ SVG Chevron scroll prompt */}
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          // className="animate-bounce"
          >
            <path d="M12 4v16" />
            <path d="M18 14l-6 6-6-6" />
          </svg>
        </div>
      </div>

      {/* C1: Gooey Outer Blob (velocity scaleX/scaleY + borderRadius distortion) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border border-[#6A3527]/40 pointer-events-none will-change-transform flex items-center justify-center transition-colors duration-200 overflow-hidden"
        style={{
          width: `${RING_DEFAULT}px`,
          height: `${RING_DEFAULT}px`,
        }}
      >
        {/* C3: White Blob with Selective mix-blend-mode inversion */}
        <div
          ref={blendRef}
          className="w-full h-full rounded-full bg-white will-change-transform transition-opacity duration-150"
          style={{
            mixBlendMode: 'normal',
            opacity: 0.18,
          }}
        />
      </div>
    </div>
  );
}
