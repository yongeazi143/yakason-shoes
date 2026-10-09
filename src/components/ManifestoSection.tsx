'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import MagneticText from '@/components/MagneticText';

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
    <span className="relative inline whitespace-normal">
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
        className="absolute left-0 right-0 -bottom-1 h-[2px] border-b-[2.5px] border-dotted border-[#6A3527] pointer-events-none"
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
  const textSegments = [
    { type: 'text', content: '“' },
    { type: 'underlined', content: 'SINCE 2005' },
    {
      type: 'text',
      content: ', ONE BELIEF HAS GUIDED EVERY PAIR WE MAKE: NIGERIANS DESERVE ',
    },
    { type: 'underlined', content: 'SHOES THAT LAST' },
    { type: 'text', content: '. CUT, CLOSED, LASTED AND FINISHED BY ' },
    { type: 'underlined', content: 'TRAINED HANDS' },
    {
      type: 'text',
      content:
        ' IN LAGOS, BUILT TO COMPETE WITH IMPORTS AT A PRICE THAT MAKES SENSE.”',
    },
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
      ref={containerRef}
      className="relative min-h-[220vh] bg-[#F6EEE3] text-[#241B17]"
    >
      {/* Sticky viewport frame that pins to the screen until the reveal finishes */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between px-6 sm:px-12 md:px-16 pt-20 pb-10 overflow-hidden">
        {/* Sticky section header with unified HR effect */}
        <SectionHeader label="OUR SOLE BELIEF" theme="cream" />

        {/* Center: Monumental Letter-by-Letter Reveal Quote */}
        <div className="max-w-5xl mx-auto my-auto text-center px-2 sm:px-4">
          <MagneticText strength={10}>
            <blockquote
              data-cursor="text"
              className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl font-heading font-black leading-snug tracking-wide select-none"
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
            className="mt-8 font-body text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-[#6A3527]"
          >
            — YAKASON MASTER COBBLERS · 99 ABEOKUTA EXPRESSWAY
          </motion.div>
        </div>

        {/* Bottom: Smooth scroll down link */}
        <motion.div
          style={{ opacity: attributionOpacity }}
          className="flex flex-col items-center justify-center pb-2 select-none"
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
