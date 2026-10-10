'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { VolumeX } from 'lucide-react';
import { SITE } from '@/lib/constants';

interface YakasonPreloaderProps {
  onLoaded?: () => void;
}

const BRAND_TITLE_LETTERS = 'YAKASON SHOES'.split('');
const BRAND_TAGLINE = 'QUALITY EXPRESS IN FOOTWEARS';
const TAGLINE_WORDS = BRAND_TAGLINE.split(' ');

export default function YakasonPreloader({ onLoaded }: YakasonPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [activePhase, setActivePhase] = useState<'title' | 'tagline'>('title');

  // DOM Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const workshopBgRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const taglineWrapperRef = useRef<HTMLDivElement>(null);
  const audioBtnRef = useRef<HTMLButtonElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize or get Web Audio Context
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Synthesize gentle harmonic tones
  const playSoundTone = useCallback(
    (freq: number, type: OscillatorType = 'sine', duration = 0.22, gainVal = 0.04) => {
      if (isMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Ignore audio play errors
      }
    },
    [isMuted, getAudioContext]
  );

  // Toggle Sound FX Button
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(nextMuted ? 260 : 520, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  };

  // Luxury GSAP Master Choreography
  useEffect(() => {
    const logoWrapper = logoWrapperRef.current;
    const titleWrapper = titleWrapperRef.current;
    const taglineWrapper = taglineWrapperRef.current;
    const workshopBg = workshopBgRef.current;
    const ambientGlow = ambientGlowRef.current;

    // 1. Shoe Factory Background: Slow, elegant atmospheric cinematic drift
    if (workshopBg) {
      gsap.fromTo(
        workshopBg,
        { scale: 1.08, opacity: 0.88 },
        {
          scale: 1.0,
          opacity: 0.98,
          duration: 6.0,
          ease: 'sine.out',
        }
      );
    }

    // 2. Ambient Warm Glow breathing
    if (ambientGlow) {
      gsap.fromTo(
        ambientGlow,
        { scale: 0.85, opacity: 0.3 },
        {
          scale: 1.25,
          opacity: 0.65,
          duration: 5.5,
          ease: 'power1.inOut',
        }
      );
    }

    // 3. Brand Logo Entrance: Starts centered, gentle vertical settle
    if (logoWrapper) {
      gsap.fromTo(
        logoWrapper,
        {
          y: -25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          onComplete: () => {
            gsap.to(logoWrapper, {
              y: -4,
              duration: 2.8,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            });
          },
        }
      );
    }

    // 4. Act 1: "YAKASON SHOES" - Masked character reveal
    if (titleWrapper) {
      const charInners = titleWrapper.querySelectorAll('.title-char-inner');
      if (charInners.length > 0) {
        gsap.fromTo(
          charInners,
          {
            yPercent: 110,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.035,
            ease: 'power3.out',
            delay: 0.3,
          }
        );
      }
    }

    // 5. Main Progress Timeline (5.6s total)
    const progressObj = { value: 0 };
    let hasSwappedText = false;

    const tween = gsap.to(progressObj, {
      value: 100,
      duration: 5.6,
      ease: 'power1.inOut',
      onUpdate: () => {
        const currentVal = Math.round(progressObj.value);
        setProgress(currentVal);

        // Subtle audio cues
        if (currentVal === 20) playSoundTone(329.63, 'sine', 0.2, 0.03); // E4
        if (currentVal === 45) playSoundTone(392.0, 'sine', 0.22, 0.04); // G4

        // At 46%: Crossfade smoothly between Title and Tagline
        if (currentVal >= 46 && !hasSwappedText) {
          hasSwappedText = true;
          setActivePhase('tagline');

          if (titleWrapper && taglineWrapper) {
            // Animate Title OUT smoothly straight upward
            const charInners = titleWrapper.querySelectorAll('.title-char-inner');
            gsap.to(charInners, {
              yPercent: -110,
              opacity: 0,
              duration: 0.5,
              stagger: 0.015,
              ease: 'power3.in',
            });

            // Animate Tagline IN smoothly from below
            const wordInners = taglineWrapper.querySelectorAll('.tagline-word-inner');
            const lines = taglineWrapper.querySelectorAll('.tagline-accent-line');

            gsap.to(taglineWrapper, {
              opacity: 1,
              duration: 0.4,
              delay: 0.2,
            });

            gsap.fromTo(
              wordInners,
              {
                yPercent: 110,
                opacity: 0,
              },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.75,
                stagger: 0.08,
                ease: 'power3.out',
                delay: 0.25,
                onStart: () => {
                  playSoundTone(493.88, 'sine', 0.3, 0.05); // B4
                },
              }
            );

            // Golden accent lines expansion
            if (lines.length > 0) {
              gsap.fromTo(
                lines,
                { scaleX: 0, opacity: 0 },
                {
                  scaleX: 1,
                  opacity: 1,
                  duration: 0.8,
                  ease: 'power2.out',
                  delay: 0.35,
                }
              );
            }
          }
        }
      },
      onComplete: () => {
        // Luxury finish chords
        playSoundTone(523.25, 'sine', 0.45, 0.06);
        setTimeout(() => playSoundTone(659.25, 'sine', 0.5, 0.05), 80);
        setTimeout(() => playSoundTone(783.99, 'sine', 0.55, 0.06), 160);
        setTimeout(() => playSoundTone(987.77, 'sine', 0.6, 0.05), 240);

        // Smooth exit to hero header
        runFinishTransition();
      },
    });

    return () => {
      tween.kill();
    };
  }, [playSoundTone]);

  // Finish Transition: Split-Curtain Reveal + Logo FLIP transition to Navbar logo
  const runFinishTransition = () => {
    const logoWrapper = logoWrapperRef.current;
    const stageWrapper = stageWrapperRef.current;
    const audioBtn = audioBtnRef.current;
    const topCurtain = topCurtainRef.current;
    const bottomCurtain = bottomCurtainRef.current;
    const workshopBg = workshopBgRef.current;
    const ambientGlow = ambientGlowRef.current;

    if (!logoWrapper || !topCurtain || !bottomCurtain) {
      setIsDone(true);
      onLoaded?.();
      return;
    }

    gsap.killTweensOf(logoWrapper);

    // Target header logo in Navbar
    const targetHeaderLogo =
      document.getElementById('header-brand-logo') ||
      document.querySelector('header a img, header [aria-label*="Yakason"]');

    let targetBounds = {
      left: window.innerWidth > 768 ? 64 : 24,
      top: 24,
      width: window.innerWidth > 768 ? 140 : 80,
      height: window.innerWidth > 768 ? 58 : 33,
    };

    if (targetHeaderLogo) {
      const rect = targetHeaderLogo.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetBounds = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
      }
    }

    const currentBounds = logoWrapper.getBoundingClientRect();
    const deltaX = targetBounds.left - currentBounds.left;
    const deltaY = targetBounds.top - currentBounds.top;
    const scale = targetBounds.width / currentBounds.width;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        onLoaded?.();
      },
    });

    // 1. Text & Stage Clean Fade-Out
    if (stageWrapper) {
      tl.to(
        stageWrapper,
        {
          opacity: 0,
          y: -15,
          duration: 0.5,
          ease: 'power2.in',
        },
        0
      );
    }

    // 2. Audio button & ambient glow fade out cleanly
    if (audioBtn) {
      tl.to(audioBtn, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0);
    }

    if (ambientGlow) {
      tl.to(ambientGlow, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 0);
    }

    if (workshopBg) {
      tl.to(workshopBg, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.1);
    }

    // 3. Smooth Logo morph to header position
    tl.to(
      logoWrapper,
      {
        x: deltaX,
        y: deltaY,
        scale: scale,
        rotation: 0,
        transformOrigin: 'top left',
        duration: 1.1,
        ease: 'power3.inOut',
      },
      0.12
    );

    // 4. Background Split-Curtain Reveal
    tl.to(
      topCurtain,
      {
        yPercent: -100,
        duration: 0.9,
        ease: 'power3.inOut',
      },
      0.45
    );

    tl.to(
      bottomCurtain,
      {
        yPercent: 100,
        duration: 0.9,
        ease: 'power3.inOut',
      },
      0.45
    );
  };

  if (isDone) return null;

  // Title phase progress (0% - 46%)
  const titlePhaseProgress = Math.min(100, (progress / 46) * 100);

  return (
    <div
      ref={containerRef}
      id="yakason-preloader"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden pointer-events-auto select-none"
      aria-label="Loading Yakason Shoes"
    >
      {/* Top Background Curtain Panel */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#0C0604] z-0 will-change-transform"
      />

      {/* Bottom Background Curtain Panel */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#0C0604] z-0 will-change-transform"
      />

      {/* Shoe Factory Atelier Visual Atmosphere Layer */}
      <div
        ref={workshopBgRef}
        className="absolute inset-0 z-[1] pointer-events-none will-change-transform overflow-hidden"
      >
        {/* Crisp background photo of the shoe workshop */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-95 contrast-115"
          style={{
            backgroundImage: "url('/brand/shoe_factory_bg.jpg')",
          }}
        />

        {/* Soft vignette to guarantee high text contrast without darkening the whole scene */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(14, 7, 4, 0.45) 0%, rgba(12, 6, 4, 0.78) 72%, #0C0604 100%)',
          }}
        />

        {/* Warm Golden Atmosphere Lighting */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(212, 162, 76, 0.08) 0%, transparent 40%, rgba(59, 30, 22, 0.35) 100%)',
          }}
        />
      </div>

      {/* Dynamic Ambient Center Light */}
      <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden flex items-center justify-center">
        <div
          ref={ambientGlowRef}
          className="w-[80vw] max-w-[850px] h-[80vw] max-h-[850px] rounded-full will-change-transform"
          style={{
            background:
              'radial-gradient(circle, rgba(212, 162, 76, 0.22) 0%, rgba(185, 129, 79, 0.08) 45%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* SFX Audio Button */}
      <button
        ref={audioBtnRef}
        type="button"
        onClick={toggleSound}
        title={isMuted ? 'Enable Sound FX' : 'Mute Sound FX'}
        className="fixed bottom-7 right-6 md:right-10 z-50 w-12 h-12 rounded-full bg-[#1A0E0A]/90 border border-[#D4A24C]/40 hover:border-[#D4A24C] text-[#D4A24C] flex flex-col items-center justify-center transition shadow-2xl backdrop-blur-md group cursor-pointer"
        aria-label={isMuted ? 'Enable Sound FX' : 'Mute Sound FX'}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-[#D4A24C]" />
        ) : (
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-3 bg-[#D4A24C] animate-pulse" />
            <span className="w-0.5 h-2 bg-[#D4A24C] animate-pulse delay-75" />
            <span className="w-0.5 h-3.5 bg-[#D4A24C] animate-pulse delay-150" />
            <span className="w-0.5 h-1.5 bg-[#D4A24C] animate-pulse delay-100" />
          </div>
        )}
        <span className="text-[8px] font-num font-bold tracking-widest text-[#D4A24C] mt-0.5">
          SFX
        </span>
      </button>

      {/* Main Center Stage */}
      <div
        ref={stageWrapperRef}
        className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-6xl mx-auto"
      >
        {/* Brand Logo — Exact original brand logo with authentic warm gold badge for dark background clarity */}
        <div
          ref={logoWrapperRef}
          className="will-change-transform flex items-center justify-center mb-6 md:mb-10"
        >
          <div className="px-5 py-2.5 rounded-2xl bg-[#FFF9F2] shadow-[0_12px_32px_rgba(0,0,0,0.7),0_0_20px_rgba(212,162,76,0.35)] border border-[#D4A24C]/40 flex items-center justify-center">
            <img
              ref={logoImgRef}
              src={SITE.logo.svgPath}
              alt="Yakason Shoes Logo"
              className="w-[170px] sm:w-[210px] md:w-[250px] h-auto object-contain pointer-events-none select-none"
            />
          </div>
        </div>

        {/* Luxury Typography Display Window */}
        <div
          className="relative min-h-[110px] sm:min-h-[140px] md:min-h-[170px] flex items-center justify-center w-full"
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {/* Act 1: "YAKASON SHOES" - Masked Letter Reveal & Liquid Gold Fill */}
          <div
            ref={titleWrapperRef}
            className={`absolute flex items-center justify-center flex-wrap leading-none select-none px-4 py-2 transition-opacity duration-300 ${
              activePhase === 'tagline' ? 'pointer-events-none' : ''
            }`}
          >
            {BRAND_TITLE_LETTERS.map((char, index) => {
              if (char === ' ') {
                return (
                  <span
                    key={`space-${index}`}
                    className="inline-block w-[0.34em]"
                    aria-hidden="true"
                  />
                );
              }

              // Liquid dye wave for title (0% to 100% of title phase)
              const totalChars = BRAND_TITLE_LETTERS.length;
              const charStart = (index / totalChars) * 45;
              const charEnd = charStart + 55;
              const charProgress = Math.min(
                100,
                Math.max(
                  0,
                  ((titlePhaseProgress - charStart) / (charEnd - charStart)) * 100
                )
              );

              return (
                <span
                  key={`title-${index}-${char}`}
                  className="title-char-mask inline-block overflow-hidden py-1"
                >
                  <span className="title-char-inner relative inline-block">
                    {/* Outline Wireframe Layer */}
                    <span
                      className="font-black text-[clamp(2.4rem,7.5vw,6.5rem)] uppercase text-transparent select-none inline-block tracking-[0.06em]"
                      style={{
                        WebkitTextStroke: '1.5px rgba(212, 162, 76, 0.55)',
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
                      }}
                    >
                      {char}
                    </span>

                    {/* Rising Solid Dye Layer */}
                    <span
                      className="absolute inset-0 font-black text-[clamp(2.4rem,7.5vw,6.5rem)] uppercase text-[#FFFDF9] select-none pointer-events-none will-change-[clip-path] inline-block tracking-[0.06em]"
                      style={{
                        clipPath: `inset(${100 - charProgress}% 0 0 0)`,
                        WebkitClipPath: `inset(${100 - charProgress}% 0 0 0)`,
                        textShadow:
                          '0 4px 18px rgba(0, 0, 0, 0.9), 0 0 18px rgba(212, 162, 76, 0.6)',
                        filter:
                          charProgress > 0 && charProgress < 100
                            ? 'drop-shadow(0 -2px 6px rgba(212, 162, 76, 0.8))'
                            : 'none',
                      }}
                    >
                      {char}
                    </span>
                  </span>
                </span>
              );
            })}
          </div>

          {/* Act 2: "QUALITY EXPRESS IN FOOTWEARS" - Crisp, Clear, Razor-Sharp Mask Reveal */}
          <div
            ref={taglineWrapperRef}
            className={`absolute flex items-center justify-center flex-wrap gap-x-4 sm:gap-x-6 gap-y-3 select-none px-4 py-2 opacity-0 max-w-5xl text-center transition-opacity duration-300 ${
              activePhase === 'tagline' ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            {TAGLINE_WORDS.map((word, wIdx) => (
              <div
                key={`tagline-word-${wIdx}-${word}`}
                className="tagline-word relative inline-flex flex-col items-center justify-center overflow-hidden py-1"
              >
                {/* Subtle top golden accent line */}
                <span
                  className="tagline-accent-line w-full h-[2px] mb-2 rounded-full origin-center bg-gradient-to-r from-transparent via-[#D4A24C] to-transparent shadow-[0_0_8px_rgba(212,162,76,0.8)]"
                />

                {/* Crystal Clear Word Inner */}
                <span className="tagline-word-inner inline-block">
                  <span
                    className="font-extrabold text-[clamp(1.4rem,4.2vw,3.2rem)] uppercase tracking-[0.14em] inline-block text-[#FFFDF9]"
                    style={{
                      textShadow:
                        '0 4px 16px rgba(0, 0, 0, 0.95), 0 0 12px rgba(212, 162, 76, 0.45)',
                    }}
                  >
                    {word}
                  </span>
                </span>

                {/* Subtle bottom golden accent line */}
                <span
                  className="tagline-accent-line w-3/4 h-[1.5px] mt-2 rounded-full border-t border-dashed border-[#D4A24C]/60 origin-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Minimalist Luxury Progress Bar & Craft Status */}
        <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-xs">
          {/* Thin Gold Progress Track */}
          <div className="w-full h-[2px] bg-white/15 rounded-full overflow-hidden relative">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#B9814F] to-[#D4A24C] rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 12px rgba(212, 162, 76, 0.8)',
              }}
            />
          </div>

          {/* Metric Labels */}
          <div className="w-full flex items-center justify-between text-[10px] tracking-[0.25em] uppercase font-mono text-[#D4A24C]/90">
            <span>
              {activePhase === 'title' ? 'ARTISANAL WORKSHOP' : 'BESPOKE FINISHING'}
            </span>
            <span className="text-[#FFFDF9] font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
