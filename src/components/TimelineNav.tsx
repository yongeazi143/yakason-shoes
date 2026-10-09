'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionItem {
  id: string;
  name: string;
  num: string;
}

// Hero link removed from timeline items; numbers start from 01 with Manifesto
const SECTIONS: SectionItem[] = [
  { id: 'manifesto', name: 'OUR SOLE BELIEF', num: '01' },
  { id: 'anatomy', name: 'ANATOMY OF CRAFT', num: '02' },
  { id: 'collection', name: 'BESPOKE COLLECTION', num: '03' },
  { id: 'services', name: 'CONTRACT MANUFACTURING', num: '04' },
];

export default function TimelineNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('manifesto');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      // Visibility: Only show timeline navigation once user has scrolled past hero section
      const heroEl = document.getElementById('hero');
      let pastHero = false;
      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        // Hero has scrolled up enough that the next section is entering
        pastHero = heroRect.bottom <= windowH * 0.55;
      } else {
        pastHero = scrollY > windowH * 0.6;
      }
      setIsVisible(pastHero);

      if (scrollY + windowH >= docH - 100) {
        setActiveSection('services');
        return;
      }

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If section top has scrolled past upper half of viewport, it is current
          if (rect.top <= windowH * 0.45) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as any).__LENIS__;
    if (lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          aria-label="Section Timeline Navigation"
          className="fixed right-5 sm:right-7 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-5 select-none pointer-events-auto"
        >
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            const isHovered = hoveredSection === sec.id;

            return (
              <div
                key={sec.id}
                className="relative flex items-center justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredSection(sec.id)}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={() => scrollTo(sec.id)}
              >
                {/* Section Name Popover / Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 8, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-9 mr-2 pointer-events-none whitespace-nowrap bg-[#241B17]/95 backdrop-blur-md text-[#FBF8F3] px-3 py-1.5 rounded-md border border-[#6A3527]/30 shadow-lg flex items-center gap-2"
                    >
                      <span className="font-num text-[9px] text-[#D4A24C]">{sec.num}</span>
                      <span className="font-heading font-black text-[10px] tracking-[0.25em] uppercase">
                        {sec.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Horizontal timeline tick bar */}
                <button
                  aria-label={`Scroll to ${sec.name}`}
                  className="p-1.5 flex items-center justify-end focus:outline-none cursor-pointer"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-8 sm:w-10 h-[2.5px] bg-[#3B1E16] shadow-[0_0_8px_rgba(59,30,22,0.4)]'
                        : isHovered
                        ? 'w-6 h-[2px] bg-[#6A3527]'
                        : 'w-3.5 sm:w-4 h-[1.5px] bg-[#6A3527]/35 group-hover:bg-[#6A3527]/70'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
