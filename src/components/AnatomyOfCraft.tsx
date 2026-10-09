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

// ─── Card size constants ────────────────────────────────────────────────
const CARD_MIN_W = 300; // px — minimum card width safeguard on small screens
const CARD_GAP = 32;    // px — gap between cards (matches gap-8)

const CRAFT_LAYERS = [
  {
    step: 'LAYER 01',
    title: 'Leather Upper & Breathable Lining',
    subtitle: 'Full-Grain Nigerian & Imported Hides',
    desc: 'Cut and skived by hand. Carefully selected top-tier leather, wet-molded to eliminate tension spots and lined with sweat-absorbing goat or calf lining for Lagos all-day comfort.',
    features: ['Hand-dyed edges', 'Reinforced eyelets', 'Double-needle structural stitch'],
    icon: Sparkles,
  },
  {
    step: 'LAYER 02',
    title: 'Insole, Shank, Toe Puff & Back Stiff',
    subtitle: 'The Architectural Backbone',
    desc: 'An orthopedically tuned steel or composite shank balances body weight across the arch. High-density thermoplastic toe puffs and heel counters ensure the silhouette never collapses.',
    features: ['Tempered spring steel shank', 'Moisture-wicking veg-tan insole', 'Resilient shape retention'],
    icon: Hammer,
  },
  {
    step: 'LAYER 03',
    title: 'Heavy-Duty Outsole & Welt Joint',
    subtitle: 'Tread for African Terrain',
    desc: 'Mounted with high-tensile bonding or Goodyear welt stitching. Available in dense anti-slip vulcanized rubber, lightweight polyurethane (PU), Nora crepe, or traditional burnished leather.',
    features: ['Oil & acid resistant options', 'Deep lug traction', '100% resolable architecture'],
    icon: Layers,
  },
];

export default function AnatomyOfCraft() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dashRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // ── Respect prefers-reduced-motion ──────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── GSAP Pinned Horizontal Scroll ────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const sectionEl = sectionRef.current;
    const trackEl = trackRef.current;
    if (!sectionEl || !trackEl) return;

    let ctx: ReturnType<typeof gsap.context> | null = null;
    let roCleanup: (() => void) | null = null;

    /**
     * px distance the track must travel to show the last card.
     * Uses scrollWidth (the actual rendered width of the track) minus the
     * viewport width, so this is always correct regardless of scroll position.
     */
    const scrollDistancePx = () =>
      Math.max(0, trackEl.scrollWidth - window.innerWidth);

    const initCarousel = () => {
      // Kill any pre-existing trigger before recreating
      ScrollTrigger.getById('anatomy-carousel')?.kill();
      ctx?.revert();

      ctx = gsap.context(() => {
        gsap.to(trackEl, {
          x: () => -scrollDistancePx(),
          ease: 'none',
          scrollTrigger: {
            id: 'anatomy-carousel',
            trigger: sectionEl,
            start: 'top top',
            end: () => `+=${scrollDistancePx()}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            // Recalculate x and end on every ScrollTrigger.refresh()
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const activeIdx = Math.min(
                CRAFT_LAYERS.length - 1,
                Math.floor(self.progress * CRAFT_LAYERS.length),
              );
              dashRefs.current.forEach((el, idx) => {
                if (!el) return;
                el.style.backgroundColor =
                  idx === activeIdx ? '#3B1E16' : 'rgba(106, 53, 39, 0.3)';
                el.style.transform = idx === activeIdx ? 'scaleY(1.4)' : 'scaleY(1)';
                el.style.opacity = idx === activeIdx ? '1' : '0.5';
              });
            },
          },
        });
      }, sectionEl);

      // A single refresh ensures ScrollTrigger recalculates after the context
      // is fully created and any in-flight layout changes have settled.
      ScrollTrigger.refresh();

      // ── ResizeObserver: refresh when the track's width changes ──────────
      // This replaces the guesswork setTimeout chain. It fires precisely when
      // the track content changes size (e.g. images load, font swaps, 3D hero
      // canvas expands) — no unnecessary re-runs between those events.
      const ro = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });
      ro.observe(trackEl);
      ro.observe(document.body);
      roCleanup = () => ro.disconnect();
    };

    // ── IntersectionObserver: defer setup until section is near viewport ──
    // The async 3D hero canvas (next/dynamic, ssr:false) takes 300-800 ms
    // to load and pins itself, which shifts the page layout downwards.
    // By waiting until the anatomy section is within 200% of the viewport
    // height before registering the ScrollTrigger, we guarantee the hero
    // pin has already been applied and layout is stable.
    //
    // rootMargin '200% 0px' means the IO fires when the section is within
    // 2× viewport height of being in view — plenty of lead time to init
    // the carousel before the user scrolls to it.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          io.disconnect();
          // Wait one frame for any final layout paint after intersection
          requestAnimationFrame(() => {
            initCarousel();
          });
        }
      },
      { rootMargin: '200% 0px', threshold: 0 },
    );
    io.observe(sectionEl);

    // Fonts ready → refresh once more (handles FOUT from custom fonts)
    const onFontsReady = () => ScrollTrigger.refresh();
    if ('fonts' in document) document.fonts.ready.then(onFontsReady);

    // Resize → refresh (handles orientation changes, browser zoom, etc.)
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      io.disconnect();
      roCleanup?.();
      window.removeEventListener('resize', onResize);
      ctx?.revert();
    };
  }, [reducedMotion]);


  return (
    <section
      id="anatomy"
      ref={sectionRef}
      className={`relative w-full select-none ${
        reducedMotion
          ? 'py-16 md:py-24 overflow-hidden'
          : // Height: fill viewport. overflow-hidden is intentional to clip the
            // horizontal track; it does NOT trap position:fixed because this
            // element has NO transform / filter / clip-path (those break pinning).
            'h-screen min-h-[640px] flex flex-col justify-between pt-16 sm:pt-20 pb-6 sm:pb-8 overflow-hidden'
      }`}
    >
      {/* Section label */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full shrink-0">
        <SectionHeader label="DECONSTRUCTED EXCELLENCE" theme="cream" />
      </div>

      {/* H2 Headline — single line, clamped */}
      <div className="text-center max-w-4xl mx-auto px-6 md:px-12 w-full shrink-0 pt-2 pb-2">
        <MagneticText as="h2" strength={12}>
          <span className="text-[clamp(1.85rem,3.4vw,3.6rem)] md:text-[clamp(2.2rem,3.8vw,4.5rem)] font-heading font-black text-[#3B1E16] tracking-wide whitespace-nowrap inline-block leading-tight">
            THE ANATOMY OF CRAFT
          </span>
        </MagneticText>
        <p className="text-xs sm:text-sm text-[#241B17]/75 font-body mt-1 max-w-xl mx-auto leading-relaxed">
          Behind every finished pair at Yakason is an exacting triple-layer engineering standard
          designed to outlast commercial imports.
        </p>
      </div>

      {/* Vertical dash progress indicator (DOM-driven, no React state) */}
      {!reducedMotion && (
        <div
          className="hidden md:flex flex-col gap-2.5 absolute right-6 sm:right-8 md:right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          aria-hidden="true"
        >
          {CRAFT_LAYERS.map((layer, idx) => (
            <div
              key={layer.step}
              ref={(el) => { dashRefs.current[idx] = el; }}
              style={{
                backgroundColor: idx === 0 ? '#3B1E16' : 'rgba(106, 53, 39, 0.3)',
                transform: idx === 0 ? 'scaleY(1.4)' : 'scaleY(1)',
                opacity: idx === 0 ? 1 : 0.5,
                transition: 'background-color 0.3s, transform 0.3s, opacity 0.3s',
              }}
              className="h-8 w-1.5 rounded-full"
            />
          ))}
        </div>
      )}

      {/* ── Horizontal track wrapper ── */}
      {/*
        overflow-hidden here clips the scrolling cards while they move left.
        IMPORTANT: No transform / clip-path / filter on this element or any
        ancestor — those create a new containing block and break position:fixed
        ScrollTrigger pinning in Chromium-based browsers (Edge, Chrome).
      */}
      <div className="w-full shrink-0 my-auto py-2 overflow-hidden">
        {/*
          CSS custom properties for card size are set on the TRACK element
          (not on a global style tag), so they scope naturally to children.
          Tailwind's md: breakpoint handles the responsive switch via data attrs.
        */}
        <div
          ref={trackRef}
          className={`flex ${
            reducedMotion
              ? 'overflow-x-auto snap-x snap-mandatory py-2 px-6 md:px-12'
              : 'will-change-transform'
          }`}
          style={{
            gap: `${CARD_GAP}px`,
            // First card inset aligns with page content; last card finishes in view
            paddingLeft: 'max(1.5rem, calc((100vw - 80rem) / 2 + 3rem))',
            paddingRight: 'max(1.5rem, calc((100vw - 80rem) / 2 + 3rem))',
          }}
        >
          {CRAFT_LAYERS.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.step}
                className={`relative bg-[#FBF8F3]/85 backdrop-blur-md border border-[#6A3527]/15 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_4px_24px_rgba(59,30,22,0.08)] hover:shadow-xl transition-shadow duration-300 shrink-0 ${
                  reducedMotion ? 'snap-start' : ''
                }`}
                style={{
                  /*
                   * Card width: 60vw on desktop, min 300px on tiny screens.
                   * height: 60vh clamped to a safe range.
                   * No styled-jsx, no JS breakpoints — just plain inline CSS.
                   */
                  width: `max(${CARD_MIN_W}px, 60vw)`,
                  height: `clamp(400px, 60vh, 88vh)`,
                  minWidth: `${CARD_MIN_W}px`,
                }}
              >
                {/* Step label + icon */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading font-black text-base sm:text-lg text-[#B9814F] tracking-wider">
                      {layer.step}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#6A3527]/10 flex items-center justify-center text-[#6A3527]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-heading font-black text-[#3B1E16] leading-tight mb-1.5">
                    {layer.title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-4">
                    {layer.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#241B17]/80 font-body leading-relaxed">
                    {layer.desc}
                  </p>
                </div>

                {/* Feature bullets */}
                <div className="border-t border-[#6A3527]/15 pt-4 mt-4">
                  <ul className="space-y-2">
                    {layer.features.map((f) => (
                      <li key={f} className="text-xs text-[#241B17] flex items-center gap-2.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B9814F] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
