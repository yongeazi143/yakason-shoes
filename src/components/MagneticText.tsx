'use client';

import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticTextProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // max pixels offset
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'blockquote';
  style?: React.CSSProperties;
}

export default function MagneticText({
  children,
  className = '',
  strength = 12,
  as = 'div',
  style = {},
}: MagneticTextProps) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 16, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 180, damping: 16, mass: 0.5 });

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // Gentle magnetic pull towards mouse
    mx.set(clamp(dx * 0.12, -strength, strength));
    my.set(clamp(dy * 0.12, -strength, strength));
  }, [mx, my, strength]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const Component = (motion as any)[as] || motion.div;

  return (
    <Component
      ref={ref}
      data-magnetic-text="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: sx, y: sy, ...style }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </Component>
  );
}
