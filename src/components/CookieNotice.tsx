'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieNotice() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl bg-[#FBF8F3]/95 border border-[#6A3527]/15 rounded-2xl px-5 py-3.5 shadow-[0_4px_24px_rgba(59,30,22,0.12)] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-full bg-[#B9814F]/15 text-[#B9814F] flex items-center justify-center text-sm shrink-0">
            🍪
          </div>
          <div>
            <div className="font-heading font-black text-xs tracking-wider text-[#3B1E16]">
              COOKIE NOTICE
            </div>
            <p className="text-[11px] text-[#241B17]/75 leading-snug">
              We use cookies to enhance your browsing experience and analyse site traffic.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShow(false)}
            className="bg-[#3B1E16] hover:bg-[#6A3527] text-[#F6EEE3] px-4 py-1.5 rounded-full text-xs font-heading font-bold tracking-wider uppercase transition shadow-sm cursor-pointer"
          >
            ACCEPT
          </button>
          <button
            onClick={() => setShow(false)}
            className="border border-[#6A3527] hover:bg-[#6A3527]/[0.08] text-[#6A3527] px-4 py-1.5 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition cursor-pointer"
          >
            DECLINE
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
