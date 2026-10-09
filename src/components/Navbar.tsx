'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface NavbarProps {
  onOpenMenu: () => void;
  heroRef: React.RefObject<HTMLElement | null>;
}

export default function Navbar({ onOpenMenu, heroRef }: NavbarProps) {
  const [lagosTime, setLagosTime] = useState('19:56');
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  // Trigger navbar background ONLY after the user has completely scrolled past the hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = heroRef.current;
      if (!heroEl) {
        setIsScrolledPastHero(window.scrollY > window.innerHeight);
        return;
      }
      const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
      // Only trigger once user actually exits the hero section
      setIsScrolledPastHero(window.scrollY >= heroBottom * 4 - 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroRef]);

  // Real-time Lagos Clock (WAT UTC+1)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Africa/Lagos',
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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 px-6 sm:px-12 md:px-16 transition-all duration-300 flex items-center justify-between pointer-events-none ${isScrolledPastHero
        ? 'py-4 bg-[#FBF8F3]/90 backdrop-blur-md border-b border-[#6A3527]/[0.12] shadow-sm'
        : 'py-2 bg-transparent'
        }`}
    >
      {/* Top Left: Outlined circular emblem + Brand Title */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <Image src="/brand/logo.png" alt="Logo" width={854} height={352} priority className='w-[10vw] object-cover' />
      </div>

      {/* Top Right: Digital City Clock + Minimalist Hamburger Menu */}
      <div className="flex items-center gap-6 md:gap-9 pointer-events-auto">
        <span className="font-num text-xs tracking-[0.25em] text-[#6A3527] font-semibold select-none">
          RC NO: 9908327 • LAGOS {lagosTime}
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
