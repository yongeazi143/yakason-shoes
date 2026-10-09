'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { HERO_3D_CONFIG } from '@/components/ShoeHeroCanvas';
import MagneticText from '@/components/MagneticText';

const ShoeHeroCanvas = dynamic(() => import('@/components/ShoeHeroCanvas'), {
  ssr: false,
});

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLElement | null>;
  onOpenOrder?: (productName?: string) => void;
}

export default function HeroSection({ heroRef, onOpenOrder }: HeroSectionProps) {
  return (
    <section
      id="hero"
      data-hero-zone="true"
      ref={heroRef as any}
      className="relative min-h-screen w-full text-[#241B17] flex flex-col justify-between px-6 sm:px-12 md:px-16 pt-24 pb-16 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 85% 90%, rgba(106,53,39,0.22) 0%, transparent 55%), radial-gradient(ellipse at 10% 0%, rgba(212,162,76,0.18) 0%, transparent 50%), linear-gradient(135deg, #FBF8F3 0%, #F6EEE3 45%, #E8D2B8 80%, #D9B48C 100%)',
      }}
    >
      {/* Full-Hero 3D Shoe Canvas */}
      <ShoeHeroCanvas />

      {/* Dark Backdrop covering lower portion of hero */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-[5]"
        style={{
          height: HERO_3D_CONFIG.backdrop.coverage,
          background: `linear-gradient(to top, ${HERO_3D_CONFIG.backdrop.gradientBottom} 0%, ${HERO_3D_CONFIG.backdrop.gradientMid} 52%, ${HERO_3D_CONFIG.backdrop.gradientTop} 100%)`,
          backdropFilter: `blur(${HERO_3D_CONFIG.backdrop.blur})`,
          WebkitBackdropFilter: `blur(${HERO_3D_CONFIG.backdrop.blur})`,
          maskImage:
            'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Split Hero Stage: Monumental Typography (Left) + Positioning Copy (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end flex-1 z-10 pt-8 sm:pt-12">
        {/* Left: Colossal Headline with magnetic micro-animation instead of color inversion */}
        <div
          data-cursor-invert="true"
          className="lg:col-span-8 xl:col-span-8 select-none relative -translate-y-16 sm:-translate-y-20 md:-translate-y-24"
        >
          {/* header */}
          <div
            className={`sticky top-[82px] sm:-top-[6px] z-30 w-full py-2.5 select-none transition-all`}
          >
            <div className="w-full flex items-center gap-4">
              {/* Left rule */}
              <div
                className={`h-[1px] w-8 md:w-16 shrink-0 bg-[#6A3527]/30`}
              />

              {/* Center Pill */}
              <span
                className={`text-[10px] md:text-xs font-heading font-bold tracking-[0.3em] uppercase whitespace-nowrap px-3.5 py-1 rounded-full border transition-shadow text-[#6A3527] bg-[#FBF8F3]/90 backdrop-blur-md border-[#6A3527]/25 shadow-xs`}
              >
                Quality Footwear at Best Prices
              </span>

              {/* Right rule fading out */}
              <div
                className={`h-[1px] flex-1 bg-gradient-to-r from-[#6A3527]/30 via-[#6A3527]/10 to-transparent`}
              />
            </div>
          </div>
          {/* header */}

          <MagneticText strength={16}>
            <h1 className="font-heading font-black text-[clamp(2.85rem,7.8vw,9.5vw)] tracking-tight leading-[0.9] uppercase flex flex-col relative z-10 text-shadow-md">
              <span className="text-[#FBF8F3]">WE MAKE</span>
              <span className="text-[#FBF8F3]">FOOTWEAR</span>
              <span
                className="text-[#D9B48C]"
                style={{
                  display: 'inline-block',
                  paddingRight: '0.12em',
                  overflow: 'visible',
                }}
              >
                THAT LASTS
              </span>
            </h1>
          </MagneticText>
        </div>

        {/* Right: Studio Positioning Copy & Actions */}
        <div
          data-cursor-invert="true"
          className="lg:col-span-4 xl:col-span-4 space-y-6 pb-4 relative z-10 -translate-y-10 sm:-translate-y-14 md:-translate-y-18"
        >
          <p className="font-body text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[#FBF8F3]/90 leading-relaxed max-w-md">
            We prioritize{' '}
            <span className="dotted-underline">durability</span> and{' '}
            <span className="dotted-underline">attractive design</span> in our
            operations and operate with a quality culture.
          </p>

          <div className="flex items-center gap-6 pt-1">
            {/* EXPLORE link */}
            <a
              href="#manifesto"
              className="relative inline-flex items-center gap-2 font-heading font-bold text-xs md:text-sm tracking-[0.25em] uppercase text-[#FBF8F3] hover:text-[#D9B48C] transition group"
            >
              <span>EXPLORE</span>
              <span className="text-[#D9B48C] group-hover:translate-y-0.5 transition-transform">
                ↓
              </span>
            </a>

            {/* ORDER IN BULK Button */}
            <Link
              href="/bulk-order?product=Corporate%20Oxford"
              className="bg-[#FBF8F3] hover:bg-[#E8D2B8] text-[#241B17] font-heading font-black text-xs tracking-widest uppercase px-5 py-2.5 rounded transition shadow-sm cursor-pointer inline-flex items-center justify-center"
            >
              ORDER IN BULK
            </Link>
          </div>
        </div>
      </div>

      {/* Touch Devices Static Scroll Indicator */}
      <div className="md:hidden flex flex-col items-center gap-1.5 absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
        <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#FBF8F3]/75">
          SCROLL
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-[#FBF8F3] animate-bounce" />
      </div>
    </section>
  );
}
