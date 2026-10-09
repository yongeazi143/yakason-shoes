'use client';

import React from 'react';

interface SectionHeaderProps {
  label: string;
  className?: string;
  theme?: 'cream' | 'dark';
}

export default function SectionHeader({
  label,
  className = '',
  theme = 'cream',
}: SectionHeaderProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`sticky top-[72px] sm:top-[76px] z-30 w-full py-2.5 select-none transition-all ${className}`}
    >
      <div className="w-full flex items-center gap-4">
        {/* Left rule */}
        <div
          className={`h-[1px] w-8 md:w-16 shrink-0 ${
            isDark ? 'bg-[#D4A24C]/40' : 'bg-[#6A3527]/30'
          }`}
        />

        {/* Center Pill */}
        <span
          className={`text-[10px] md:text-xs font-heading font-bold tracking-[0.3em] uppercase whitespace-nowrap px-3.5 py-1 rounded-full border transition-shadow ${
            isDark
              ? 'text-[#D4A24C] bg-[#3B1E16]/80 backdrop-blur-md border-[#D4A24C]/35 shadow-xs'
              : 'text-[#6A3527] bg-[#FBF8F3]/90 backdrop-blur-md border-[#6A3527]/25 shadow-xs'
          }`}
        >
          {label}
        </span>

        {/* Right rule fading out */}
        <div
          className={`h-[1px] flex-1 ${
            isDark
              ? 'bg-gradient-to-r from-[#D4A24C]/40 via-[#D4A24C]/10 to-transparent'
              : 'bg-gradient-to-r from-[#6A3527]/30 via-[#6A3527]/10 to-transparent'
          }`}
        />
      </div>
    </div>
  );
}
