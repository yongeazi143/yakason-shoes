'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Layers, Hammer, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';
import MagneticText from '@/components/MagneticText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CRAFT_LAYERS = [
  {
    step: 'LAYER 01',
    title: 'Leather Upper & Breathable Lining',
    subtitle: 'Full-Grain Nigerian & Imported Hides',
    desc: 'Cut and skived by hand. Carefully selected top-tier leather, wet-molded to eliminate tension spots and lined with sweat-absorbing goat or calf lining for Lagos all-day comfort.',
    features: ['Hand-dyed edges', 'Reinforced eyelets', 'Double-needle structural stitch'],
  },
  {
    step: 'LAYER 02',
    title: 'Insole, Shank, Toe Puff & Back Stiff',
    subtitle: 'The Architectural Backbone',
    desc: 'An orthopedically tuned steel or composite shank balances body weight across the arch. High-density thermoplastic toe puffs and heel counters ensure the silhouette never collapses.',
    features: ['Tempered spring steel shank', 'Moisture-wicking veg-tan insole', 'Resilient shape retention'],
  },
  {
    step: 'LAYER 03',
    title: 'Heavy-Duty Outsole & Welt Joint',
    subtitle: 'Tread for African Terrain',
    desc: 'Mounted with high-tensile bonding or Goodyear welt stitching. Available in dense anti-slip vulcanized rubber, lightweight polyurethane (PU), Nora crepe, or traditional burnished leather.',
    features: ['Oil & acid resistant options', 'Deep lug traction', '100% resolable architecture'],
  },
];

export default function AnatomyOfCraft() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (reducedMotion) return;

    const sectionEl = sectionRef.current;
    const trackEl = trackRef.current;
    if (!sectionEl || !trackEl) return;

    const ctx = gsap.context(() => {
      // Calculate horizontal translation distance: track scrollWidth minus viewport width
      const getDistance = () => {
        if (!trackEl) return 0;
        return Math.max(0, trackEl.scrollWidth - window.innerWidth);
      };

      // Horizontal carousel scroll animation driven by vertical scroll scrub
      gsap.to(trackEl, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          id: 'anatomy-carousel',
          trigger: sectionEl,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Synchronize ScrollTrigger with layout
      ScrollTrigger.refresh();
    }, sectionEl);

    // Refresh after fonts and assets load so pin spacing is exact
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    const onWindowLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onWindowLoad);

    return () => {
      window.removeEventListener('load', onWindowLoad);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="anatomy"
      ref={sectionRef}
      className={`relative w-full overflow-hidden select-none ${
        reducedMotion
          ? 'py-16 md:py-24'
          : 'h-screen min-h-[640px] flex flex-col justify-between py-8 sm:py-12 md:py-16'
      }`}
    >
      {/* Sticky section cross-guide header */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full shrink-0">
        <SectionHeader label="DECONSTRUCTED EXCELLENCE" theme="cream" />
      </div>

      {/* Section Header Content */}
      <div className="text-center max-w-3xl mx-auto px-6 md:px-12 w-full my-auto shrink-0 pt-4 pb-2">
        <MagneticText as="h2" strength={12}>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-[#3B1E16] tracking-wide inline-block">
            THE ANATOMY OF CRAFT
          </span>
        </MagneticText>
        <p className="text-xs sm:text-sm md:text-base text-[#241B17]/80 font-body mt-2 sm:mt-3 max-w-2xl mx-auto leading-relaxed">
          Behind every finished pair at Yakason is an exacting triple-layer engineering standard designed to outlast commercial imports.
        </p>
      </div>

      {/* Horizontal Carousel Track */}
      <div className="w-full shrink-0 overflow-hidden pb-4 sm:pb-6">
        <div
          ref={trackRef}
          className={`flex gap-6 md:gap-8 ${
            reducedMotion
              ? 'overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2 px-6 md:px-12'
              : 'will-change-transform'
          }`}
          style={{
            // Left margin aligns first card with page content left edge; right margin ensures last card finishes cleanly in view
            paddingLeft: 'max(1.5rem, calc((100vw - 80rem) / 2 + 3rem))',
            paddingRight: 'max(1.5rem, calc((100vw - 80rem) / 2 + 3rem))',
          }}
        >
          {CRAFT_LAYERS.map((layer, idx) => (
            <div
              key={layer.step}
              className={`relative bg-[#FBF8F3]/75 backdrop-blur-md border border-[#6A3527]/15 rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(59,30,22,0.08)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group shrink-0 ${
                reducedMotion ? 'snap-start' : ''
              }`}
              style={{
                width: 'min(80vw, 460px)',
                minWidth: '280px',
              }}
            >
              {/* Top Indicator */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-base sm:text-lg text-[#B9814F] tracking-wider">
                    {layer.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#6A3527]/10 flex items-center justify-center text-[#6A3527]">
                    {idx === 0 && <Sparkles className="w-4 h-4" />}
                    {idx === 1 && <Hammer className="w-4 h-4" />}
                    {idx === 2 && <Layers className="w-4 h-4" />}
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-heading text-[#3B1E16] leading-tight mb-1">
                  {layer.title}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-3 sm:mb-4">
                  {layer.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-[#241B17]/75 font-body leading-relaxed mb-6">
                  {layer.desc}
                </p>
              </div>

              {/* Feature Bullets */}
              <div className="border-t border-[#6A3527]/15 pt-4">
                <ul className="space-y-2">
                  {layer.features.map((f) => (
                    <li key={f} className="text-xs text-[#241B17] flex items-center gap-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B9814F] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
