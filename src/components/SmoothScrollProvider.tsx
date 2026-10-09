'use client';

import React, { useEffect, useRef, createContext, useContext, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const SmoothScrollContext = createContext<Lenis | null>(null);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // High-performance smooth scroll configuration
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      infinite: false,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);
    (window as any).__LENIS__ = lenis;

    // ── Lenis ↔ ScrollTrigger full integration ─────────────────────────────
    // Step 1: Tell ScrollTrigger to read scroll position AND element offsets
    //         through Lenis rather than mixing native scrollY with smooth values.
    //         Without this proxy, ScrollTrigger measures section offsets via
    //         getBoundingClientRect() at native-scroll coordinates while progress
    //         is driven by lenis.scroll — creating the mismatch that makes the
    //         anatomy pin trigger at the wrong position, especially after the
    //         async 3D hero canvas shifts the layout.
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          // ScrollTrigger wants to set scroll position (e.g. on refresh)
          lenis.scrollTo(value, { immediate: true, force: true });
        }
        // ScrollTrigger reads scroll position → always use Lenis smooth value
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      // Lenis controls the scroll direction; pin-type must be 'transform'
      // so ScrollTrigger doesn't fight Lenis over the native scroll position.
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    });

    // Step 2: Push every Lenis scroll tick into ScrollTrigger so progress
    //         updates are perfectly in sync with the smooth scroll value.
    lenis.on('scroll', ScrollTrigger.update);

    // Step 3: Drive Lenis from the GSAP ticker so animations and scroll
    //         are on the same clock, with no lag smoothing fighting Lenis.
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Global interceptor for all internal anchor clicks (#hero, #manifesto, #anatomy, #collection, etc.)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const id = href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, {
            offset: 0,
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
          window.history.pushState(null, '', href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Refresh ScrollTrigger calculations after initial paint and layout settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).__LENIS__;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenisInstance}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
