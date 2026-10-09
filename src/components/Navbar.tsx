'use client';

import React, { useState, useEffect } from 'react';
import { SITE } from '@/lib/constants';
import YakasonLogo from '@/components/YakasonLogo';

interface NavbarProps {
  onOpenMenu: () => void;
  heroRef?: React.RefObject<HTMLElement | null>;
  isSolid?: boolean;
}

export default function Navbar({ onOpenMenu, heroRef, isSolid = false }: NavbarProps) {
  const [lagosTime, setLagosTime] = useState('19:56');
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(isSolid || !heroRef);

  // Trigger navbar background ONLY after the user has completely scrolled past the hero section
  useEffect(() => {
    if (isSolid || !heroRef) {
      setIsScrolledPastHero(true);
      return;
    }

    const handleScroll = () => {
      const heroEl = heroRef.current;
      if (!heroEl) {
        setIsScrolledPastHero(true);
        return;
      }
      const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
      // Only trigger once user actually exits the hero section
      setIsScrolledPastHero(window.scrollY >= heroBottom * 4 - 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroRef, isSolid]);

  // Real-time Lagos Clock (WAT UTC+1)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString(SITE.clock.locale, {
        timeZone: SITE.clock.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setLagosTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const showSolidBackground = isSolid || isScrolledPastHero;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 px-6 sm:px-12 md:px-16 transition-all duration-300 flex items-center justify-between pointer-events-none ${showSolidBackground
        ? 'py-4 bg-[#FBF8F3]/90 backdrop-blur-md border-b border-[#6A3527]/[0.12] shadow-sm'
        : 'py-6 bg-transparent'
        }`}
    >
      {/* Top Left: Brand logo — single source of truth via YakasonLogo */}
      <YakasonLogo
        linked
        className="pointer-events-auto"
        sizeClassName="w-[10vw] min-w-[64px] max-w-[140px]"
        ariaLabel="Yakason Shoes Home"
      />

      {/* Top Right: Digital City Clock + Minimalist Hamburger Menu */}
      <div className="flex items-center gap-6 md:gap-9 pointer-events-auto">
        <span className="hidden sm:block font-num text-xs tracking-[0.25em] text-[#6A3527] font-semibold select-none">
          {SITE.rcDisplay} • {SITE.clock.city} {lagosTime}
        </span>
        <button
          onClick={onOpenMenu}
          className="flex flex-col gap-1 w-6 items-end group p-1 focus:outline-none cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <span className="w-6 h-[1.5px] bg-[#3B1E16] transition-all group-hover:w-4" />
          <span className="w-6 h-[1.5px] bg-[#3B1E16] transition-all group-hover:w-6" />
          <span className="w-6 h-[1.5px] bg-[#3B1E16] transition-all group-hover:w-5" />
        </button>
      </div>
    </header>
  );
}
