'use client';

import React from 'react';
import { ArrowUp, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { SITE } from '@/lib/constants';

export default function Footer() {
  const scrollToTop = () => {
    const lenis = (window as any).__LENIS__;
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#6A3527] to-[#3B1E16] text-[#F6EEE3] border-t border-[#6A3527]/30 pt-20 pb-12 px-6 md:px-12 overflow-hidden">

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-4 pointer-events-auto">
            <Image src={SITE.logo.path} alt={SITE.logo.alt} width={SITE.logo.width} height={SITE.logo.height} priority className='w-[20vw] object-cover mix-blend-difference' />
          </div>
          <p className="text-sm text-[#F6EEE3]/80 font-body max-w-sm leading-relaxed">
            {SITE.footer.brandDescription}
          </p>
          <div className="pt-2 text-xs font-semibold text-[#D4A24C] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4A24C]" />
            {SITE.certificationBadge}
          </div>
        </div>

        {/* Showroom & Hours */}
        <div className="space-y-3 font-body">
          <h4 className="font-heading text-lg text-[#F6EEE3] tracking-wider">
            FACTORY & SHOWROOM
          </h4>
          <p className="text-sm text-[#F6EEE3]/80 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#D4A24C] shrink-0 mt-0.5" />
            <span>{SITE.address.factoryAndShowroom}</span>
          </p>
          <p className="text-sm text-[#F6EEE3]/80 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4A24C] shrink-0" />
            <span>{SITE.address.hours}</span>
          </p>
        </div>

        {/* Contact & Orders */}
        <div className="space-y-3 font-body">
          <h4 className="font-heading text-lg text-[#F6EEE3] tracking-wider">
            DIRECT INQUIRIES
          </h4>
          <p className="text-sm text-[#F6EEE3]/80 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#D4A24C] shrink-0" />
            <span>{SITE.contact.phoneDisplay}</span>
          </p>
          <p className="text-xs text-[#F6EEE3]/70">
            {SITE.address.dispatchNote}
          </p>
        </div>
      </div>

      {/* Bottom Bar & Scroll to Top Progress */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#F6EEE3]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-[#F6EEE3]/70">
        <div className="space-y-1">
          <div>
            {SITE.footer.copyright}
          </div>
          <div className="text-[11px] text-[#F6EEE3]/60 leading-normal">
            3D model:{' '}
            <a
              href={SITE.model3d.modelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#D4A24C] transition"
            >
              {SITE.model3d.title}
            </a>{' '}
            by {SITE.model3d.author}, licensed under{' '}
            <a
              href={SITE.model3d.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#D4A24C] transition"
            >
              {SITE.model3d.licenseName}
            </a>
            . {SITE.model3d.modificationNote}
          </div>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 font-heading tracking-wider uppercase text-sm text-[#F6EEE3] hover:text-[#D4A24C] transition"
        >
          <span>BACK TO SUMMIT</span>
          <div className="w-8 h-8 rounded-full border border-[#F6EEE3]/30 hover:border-[#D4A24C] flex items-center justify-center">
            <ArrowUp className="w-4 h-4" />
          </div>
        </button>
      </div>
      {/* Massive Watermark Lettering */}
      <div className="text-center pointer-events-none select-none opacity-5">
        <span className="font-heading text-[17vw] leading-0 tracking-wide text-[#F6EEE3] whitespace-nowrap">
          {SITE.footer.watermark}
        </span>
      </div>
    </footer>
  );
}
