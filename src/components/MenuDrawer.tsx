'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SITE } from '@/lib/constants';
import YakasonLogo from '@/components/YakasonLogo';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrder?: (product?: string) => void;
}

export default function MenuDrawer({ isOpen, onClose, onOpenOrder }: MenuDrawerProps) {
  const navItems = SITE.navigation;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.3 } }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#241B17]/40 backdrop-blur-xs"
          />

          {/* Slide-Out Navigation Drawer Panel */}
          {/* Duration increased by 40% (0.4s * 1.4 = 0.56s). Outro slides out fully before fading opacity */}
          <motion.div
            initial={{ x: '100%', opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{
              x: '100%',
              opacity: 1, // Opacity remains fully visible so content slide-out is fully seen
              transition: { duration: 0.56, ease: [0.32, 0.72, 0, 1] },
            }}
            transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 w-full bg-[#FBF8F3] shadow-2xl flex flex-col justify-between p-8 sm:p-12 md:p-16 text-[#241B17] border-l border-[#6A3527]/20"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[#6A3527]/15 pb-6">
              <YakasonLogo
                linked={false}
                sizeClassName="w-28 sm:w-36"
                className="opacity-90"
                ariaLabel={SITE.name}
              />
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-[#6A3527]/25 hover:border-[#6A3527] text-[#6A3527] flex items-center justify-center transition cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-6 py-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    if (item.href.startsWith('#')) {
                      const el = document.getElementById(item.href.slice(1));
                      if (el) {
                        setTimeout(() => {
                          const lenis = (window as any).__LENIS__;
                          if (lenis) {
                            lenis.scrollTo(el, { offset: 0, duration: 1.3 });
                          } else {
                            el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 120);
                      } else {
                        window.location.href = `/${item.href}`;
                      }
                    }
                  }}
                  className="font-heading font-black text-2xl sm:text-4xl md:text-5xl text-[#3B1E16]/80 justify-end hover:text-[#6A3527] transition tracking-tight flex items-center gap-4 group cursor-pointer"
                >
                  {/* <span className="text-xs sm:text-sm font-num text-[#B9814F]">{item.num}</span> */}
                  <span className="group-hover:translate-x-2 transition-transform duration-200">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>

            {/* Footer Details */}
            <div className="border-t border-[#6A3527]/15 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-body tracking-wider uppercase text-[#241B17]/75">
              <div>
                <p className="text-[#3B1E16] font-bold">{SITE.address.factoryShortUppercase}</p>
                <p className="text-[#6A3527]">{SITE.registrationTextShort}</p>
              </div>
              <Link
                href="/bulk-order?product=Corporate%20Oxford"
                onClick={onClose}
                className="bg-[#3B1E16] hover:bg-[#6A3527] text-[#F6EEE3] px-6 py-2.5 rounded font-heading font-bold text-xs tracking-widest uppercase transition cursor-pointer shadow-sm inline-flex items-center justify-center"
              >
                ORDER IN BULK
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
