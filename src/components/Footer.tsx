'use client';

import React from 'react';
import { ArrowUp, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#6A3527] to-[#3B1E16] text-[#F6EEE3] border-t border-[#6A3527]/30 pt-20 pb-12 px-6 md:px-12 overflow-hidden">
      {/* Massive Watermark Lettering */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none opacity-5">
        <span className="font-heading text-[12vw] tracking-wider text-[#F6EEE3] whitespace-nowrap">
          YAKASONSHOES · EST. 2005
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img src="/brand/logo.png" alt="Yakason Shoes Logo" className="h-10 w-auto object-contain" />
            <span className="font-heading text-2xl text-[#F6EEE3] tracking-wider">
              YAKASON SHOES
            </span>
          </div>
          <p className="text-sm text-[#F6EEE3]/80 font-body max-w-sm leading-relaxed">
            Quality Express in Footwears. Handcrafted in Lagos, Nigeria since 2005. Supplying corporate executives, schools, and paramilitary institutions with durable Nigerian excellence.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#D4A24C] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4A24C]" />
            Yakason Global Best Venture · RC 9908327 · SON Registered
          </div>
        </div>

        {/* Showroom & Hours */}
        <div className="space-y-3 font-body">
          <h4 className="font-heading text-lg text-[#F6EEE3] tracking-wider">
            FACTORY & SHOWROOM
          </h4>
          <p className="text-sm text-[#F6EEE3]/80 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#D4A24C] shrink-0 mt-0.5" />
            <span>99 Abeokuta Expressway, Lagos State, Nigeria</span>
          </p>
          <p className="text-sm text-[#F6EEE3]/80 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4A24C] shrink-0" />
            <span>Mon – Sat: 8:00 AM – 6:00 PM</span>
          </p>
        </div>

        {/* Contact & Orders */}
        <div className="space-y-3 font-body">
          <h4 className="font-heading text-lg text-[#F6EEE3] tracking-wider">
            DIRECT INQUIRIES
          </h4>
          <p className="text-sm text-[#F6EEE3]/80 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#D4A24C] shrink-0" />
            <span>+234 803 000 0000 / +234 802 000 0000</span>
          </p>
          <p className="text-xs text-[#F6EEE3]/70">
            Wholesale Carton Dispatches · Inter-State Transit Nationwide
          </p>
        </div>
      </div>

      {/* Bottom Bar & Scroll to Top Progress */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#F6EEE3]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-[#F6EEE3]/70">
        <div className="space-y-1">
          <div>
            © 2005 – 2026 Yakason Global Best Venture. All rights reserved.
          </div>
          <div className="text-[11px] text-[#F6EEE3]/60 leading-normal">
            3D model:{' '}
            <a
              href="https://sketchfab.com/3d-models/mens-black-dress-shoes-5a256faa6cf94de08482ba98565c2269"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#D4A24C] transition"
            >
              Men&apos;s Black Dress Shoes
            </a>{' '}
            by CherilusUploads (Sketchfab), licensed under{' '}
            <a
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#D4A24C] transition"
            >
              CC BY 4.0
            </a>
            . Modified: split into two pairs and rescaled.
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
    </footer>
  );
}
