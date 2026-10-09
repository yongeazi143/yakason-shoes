'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import MagneticText from '@/components/MagneticText';
import { SITE } from '@/lib/constants';

interface LetterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function AnimatedLetter({ char, progress, range }: LetterProps) {
  const color = useTransform(progress, range, ['rgba(106, 53, 39, 0.18)', '#241B17']);
  return (
    <motion.span style={{ color }} className="inline">
      {char}
    </motion.span>
  );
}

interface UnderlineChunkProps {
  text: string;
  startIndex: number;
  totalChars: number;
  progress: MotionValue<number>;
}

function UnderlinedChunk({ text, startIndex, totalChars, progress }: UnderlineChunkProps) {
  const phraseStart = (startIndex / totalChars) * 0.82;
  const phraseEnd = Math.min(0.9, ((startIndex + text.length) / totalChars) * 0.82);
  const scaleX = useTransform(progress, [phraseStart, phraseEnd], [0, 1]);
  const opacity = useTransform(progress, [phraseStart, phraseStart + 0.02], [0, 1]);

  return (
    <span className="relative inline-block whitespace-nowrap">
      {text.split('').map((char, i) => {
        const charStart = ((startIndex + i) / totalChars) * 0.82;
        const charEnd = Math.min(0.95, charStart + 0.03);
        return (
          <AnimatedLetter
            key={i}
            char={char}
            progress={progress}
            range={[charStart, charEnd]}
          />
        );
      })}
      {/* Animated dotted underline that draws in as phrase lights up and stays on */}
      <motion.span
        style={{ scaleX, opacity, transformOrigin: 'left center' }}
        className="absolute left-0 right-0 -bottom-0.5 sm:-bottom-1 h-[2px] border-b-[2px] sm:border-b-[2.5px] border-dotted border-[#6A3527] pointer-events-none"
      />
    </span>
  );
}

export default function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const attributionOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);
  const attributionY = useTransform(scrollYProgress, [0.8, 0.95], [16, 0]);

  // Manifesto segmented by underlined and normal chunks:
  // Underlined items: Quality footwear, fair price, expertise, experience, efficient production, and real value.
  const textSegments = [
    { type: 'text', content: '“Since 2005, We make ' },
    { type: 'underlined', content: 'quality footwear' },
    { type: 'text', content: ' that rivals foreign brands, sold at a ' },
    { type: 'underlined', content: 'fair price' },
    { type: 'text', content: ' to local markets. By combining ' },
    { type: 'underlined', content: 'expertise' },
    { type: 'text', content: ', ' },
    { type: 'underlined', content: 'experience' },
    { type: 'text', content: ', marketing skills and ' },
    { type: 'underlined', content: 'efficient production' },
    { type: 'text', content: ', so we can deliver ' },
    { type: 'underlined', content: 'real value' },
    { type: 'text', content: ' to every customer.”' },
  ];

  // Calculate total character count and start indices
  let runningIndex = 0;
  const computedSegments = textSegments.map((seg) => {
    const start = runningIndex;
    runningIndex += seg.content.length;
    return { ...seg, start };
  });
  const totalChars = runningIndex;

  return (
    <div
      id="manifesto"
      data-cursor-invert="true"
      ref={containerRef}
      className="relative min-h-[230vh] bg-[#F6EEE3] text-[#241B17]"
    >
      {/* Sticky viewport frame that pins to the screen until the reveal finishes */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between px-6 sm:px-12 md:px-16 pt-20 pb-10 overflow-hidden">
        {/* Sticky section header with unified HR effect */}
        <SectionHeader label="OUR SOLE BELIEF" theme="cream" />

        {/* Center: Monumental Letter-by-Letter Reveal Quote scaled to perfectly fit the viewport */}
        <div className="max-w-4xl lg:max-w-5xl mx-auto my-auto text-center px-2 sm:px-4 py-2">
          <MagneticText strength={3}>
            <blockquote
              data-cursor="text"
              data-cursor-invert="true"
              className="text-[clamp(1.5rem,3.3vw,2.35rem)] font-heading font-black leading-[1.35] sm:leading-[1.3] md:leading-[1.28] tracking-normal select-none"
            >
              {computedSegments.map((seg, idx) => {
                if (seg.type === 'underlined') {
                  return (
                    <UnderlinedChunk
                      key={idx}
                      text={seg.content}
                      startIndex={seg.start}
                      totalChars={totalChars}
                      progress={scrollYProgress}
                    />
                  );
                }

                return (
                  <span key={idx}>
                    {seg.content.split('').map((char, cIdx) => {
                      const charStart = ((seg.start + cIdx) / totalChars) * 0.82;
                      const charEnd = Math.min(0.95, charStart + 0.03);
                      return (
                        <AnimatedLetter
                          key={cIdx}
                          char={char}
                          progress={scrollYProgress}
                          range={[charStart, charEnd]}
                        />
                      );
                    })}
                  </span>
                );
              })}
            </blockquote>
          </MagneticText>

          {/* Master Cobblers Attribution */}
          <motion.div
            style={{ opacity: attributionOpacity, y: attributionY }}
            className="mt-4 sm:mt-6 md:mt-8 font-body text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.22em] uppercase text-[#6A3527]"
          >
            {SITE.address.attribution}
          </motion.div>
        </div>

        {/* Bottom: Smooth scroll down link */}
        <motion.div
          style={{ opacity: attributionOpacity }}
          className="flex flex-col items-center justify-center pb-1 sm:pb-2 select-none"
        >
          <a
            href="#anatomy"
            className="inline-flex flex-col items-center gap-1.5 text-[#6A3527]/80 hover:text-[#3B1E16] transition group"
          >
            <span className="text-[10px] font-heading font-bold tracking-[0.3em] uppercase">
              ANATOMY OF CRAFT
            </span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
