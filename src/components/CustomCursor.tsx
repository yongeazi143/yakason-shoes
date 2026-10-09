'use client';

import React, { useEffect, useRef, useState } from 'react';

// ── Tuning Constants ────────────────────────────────────────────────────────
const LERP_RING = 0.16;   // smoothness of the outer ring following mouse
const RING_DEFAULT = 32;  // default ring diameter in px
const RING_HOVER = 52;    // ring diameter when hovering interactive elements
const RING_MAGNETIC = 36; // ring diameter when hovering magnetic large text
// ─────────────────────────────────────────────────────────────────────────────

export default function CustomCursor() {
  const [isPointerFine, setIsPointerFine] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const blendRef = useRef<HTMLDivElement>(null);

  const posRef = useRef({
    // mouse position
    x: -200,
    y: -200,
    // lerped ring position
    rx: -200,
    ry: -200,
    // ring size lerp
    sizeCur: RING_DEFAULT,
    sizeTgt: RING_DEFAULT,
    isInteractive: false,
    isMagnetic: false,
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

      const target = e.target as HTMLElement | null;
      if (target) {
        const magTarget = Boolean(target.closest('[data-magnetic-text]'));
        const interactiveTarget = Boolean(
          target.closest('a, button, [role="button"], input, select, textarea, [tabindex="0"]')
        );
        pos.isMagnetic = magTarget;
        pos.isInteractive = interactiveTarget && !magTarget;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    let rafId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      const pos = posRef.current;

      pos.rx = lerp(pos.rx, pos.x, LERP_RING);
      pos.ry = lerp(pos.ry, pos.y, LERP_RING);

      if (pos.isMagnetic) {
        pos.sizeTgt = RING_MAGNETIC;
      } else if (pos.isInteractive) {
        pos.sizeTgt = RING_HOVER;
      } else {
        pos.sizeTgt = RING_DEFAULT;
      }

      pos.sizeCur = lerp(pos.sizeCur, pos.sizeTgt, 0.2);
      const r = pos.sizeCur / 2;

      // Inner dot (stays right at mouse pointer)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`;
        dotRef.current.style.opacity = pos.isInteractive ? '0' : '1';
      }

      // Outer ring with thin espresso border
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.rx - r}px, ${pos.ry - r}px, 0)`;
        ringRef.current.style.width = `${pos.sizeCur}px`;
        ringRef.current.style.height = `${pos.sizeCur}px`;
      }

      // Difference invert layer inside ring
      if (blendRef.current) {
        blendRef.current.style.opacity = pos.isInteractive ? '0.85' : '0.22';
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
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      {/* Center point */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-[#6A3527] will-change-transform shadow-xs"
      />

      {/* Outer ring: thin espresso border with mix-blend-mode difference */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border-[1.5px] border-[#6A3527] pointer-events-none will-change-transform overflow-hidden flex items-center justify-center transition-[border-color] duration-200"
        style={{
          width: `${RING_DEFAULT}px`,
          height: `${RING_DEFAULT}px`,
        }}
      >
        {/* Difference blend background: inverts underlying colors (espresso over cream, cream over espresso) */}
        <div
          ref={blendRef}
          className="w-full h-full rounded-full bg-white will-change-transform"
          style={{
            mixBlendMode: 'difference',
          }}
        />
      </div>
    </div>
  );
}
