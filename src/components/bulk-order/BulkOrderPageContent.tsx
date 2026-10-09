'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import MenuDrawer from '@/components/MenuDrawer';
import ContactForm from '@/components/ContactForm';
import FloatingControls from '@/components/FloatingControls';
import CookieNotice from '@/components/CookieNotice';
import Footer from '@/components/Footer';
import PerspectiveGridBackground from '@/components/PerspectiveGridBackground';
import BulkOrderForm from '@/components/bulk-order/BulkOrderForm';
import { SITE } from '@/lib/constants';

export default function BulkOrderPageContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <SmoothScrollProvider>
      <CustomCursor />

      <div className="relative min-h-screen bg-[#F6EEE3] text-[#241B17] flex flex-col justify-between selection:bg-[#D4A24C] selection:text-[#3B1E16]">
        {/* Header - solid mode on non-hero pages */}
        <Navbar onOpenMenu={() => setIsMenuOpen(true)} isSolid={true} />

        {/* Fixed Perspective 3D Grid Background on off-white base */}
        <PerspectiveGridBackground lineOpacity={0.12} />

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 pt-28 sm:pt-32 md:pt-36 pb-20 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto w-full">
          {/* Quiet 'Back to home' link */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-widest text-[#6A3527] hover:text-[#3B1E16] transition group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to home</span>
            </Link>
          </div>

          {/* Page Top Header */}
          <div className="mb-10">
            {/* Small Label Pill */}
            <div className="w-full flex items-center gap-4 mb-4 select-none">
              <div className="h-[1px] w-8 md:w-16 shrink-0 bg-[#6A3527]/30" />
              <span className="text-[10px] md:text-xs font-heading font-bold tracking-[0.3em] uppercase whitespace-nowrap px-3.5 py-1 rounded-full border text-[#6A3527] bg-[#FBF8F3]/90 backdrop-blur-md border-[#6A3527]/25 shadow-xs">
                BESPOKE & VOLUME PRODUCTION
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#6A3527]/30 via-[#6A3527]/10 to-transparent" />
            </div>

            {/* Display H1 */}
            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#3B1E16] tracking-tight uppercase leading-[1.05]">
              REQUEST A BULK QUOTE / ORDER
            </h1>

            {/* Subtitle reading RC from SITE */}
            <p className="text-sm sm:text-base text-[#241B17]/75 font-body mt-3 max-w-2xl leading-relaxed">
              Direct from our Lagos factory floor. CAC (RC {SITE.rcNumber}) & SON Certified Quality.
            </p>
          </div>

          {/* Form & Guarantee Layout */}
          <Suspense
            fallback={
              <div className="w-full py-20 text-center font-heading text-xs tracking-widest uppercase text-[#6A3527]">
                LOADING FORM…
              </div>
            }
          >
            <BulkOrderForm />
          </Suspense>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Floating WhatsApp and Sound Controls */}
        <FloatingControls onOpenContact={() => setIsContactOpen(true)} />

        {/* Cookie Notice */}
        <CookieNotice />

        {/* Slide-out Menu Drawer */}
        <MenuDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        {/* Contact Form Modal */}
        <ContactForm
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      </div>
    </SmoothScrollProvider>
  );
}
