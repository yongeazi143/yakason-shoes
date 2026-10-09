'use client';

import React, { useState, useRef } from 'react';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import YakasonPreloader from '@/components/YakasonPreloader';
import CustomCursor from '@/components/CustomCursor';
import TimelineNav from '@/components/TimelineNav';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ManifestoSection from '@/components/ManifestoSection';
import AnatomyOfCraft from '@/components/AnatomyOfCraft';
import HorizontalCollection from '@/components/HorizontalCollection';
import PerspectiveGridBackground from '@/components/PerspectiveGridBackground';
import BentoServices from '@/components/BentoServices';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import MenuDrawer from '@/components/MenuDrawer';
import ContactForm from '@/components/ContactForm';
import OrderModal from '@/components/OrderModal';
import FloatingControls from '@/components/FloatingControls';
import CookieNotice from '@/components/CookieNotice';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('Corporate Oxford');
  const heroRef = useRef<HTMLElement>(null);

  const handleOpenOrder = (prodName?: string) => {
    if (prodName) setSelectedProduct(prodName);
    setIsModalOpen(true);
  };

  return (
    <SmoothScrollProvider>
      {/* Bootloader */}
      <YakasonPreloader />

      {/* Custom Cursor with thin espresso border, difference blending & magnetic responsiveness */}
      <CustomCursor />

      {/* Vertical Timeline Navbar from user screenshot */}
      <TimelineNav />

      <main className="relative min-h-screen bg-[#F6EEE3] text-[#241B17]">
        {/* Navigation Bar: triggers background only once scrolled past hero */}
        <Navbar onOpenMenu={() => setIsMenuOpen(true)} heroRef={heroRef} />

        {/* 1. Hero Section with Colossal Headline & Magnetic Micro Animation */}
        <HeroSection heroRef={heroRef} onOpenOrder={handleOpenOrder} />

        {/* 2. Our Sole Belief: Pinned Letter-by-Letter Scroll Reveal on Cream Background */}
        <ManifestoSection />

        {/* 3 & 4. Anatomy of Craft + Collection with continuous Fixed 3D Perspective Grid */}
        <div
          id="anatomy-and-collection-wrap"
          className="relative bg-[#FBF8F3]"
          style={{ clipPath: 'inset(0)' }}
        >
          {/* Phase A: Fixed 3D Perspective Grid Background */}
          <PerspectiveGridBackground />

          {/* 3. Anatomy of Craft (3D Exploded Layers) */}
          <div className="relative z-10 border-t border-[#6A3527]/10">
            <AnatomyOfCraft />
          </div>

          {/* 4. Bespoke Collection Showcase */}
          <div className="relative z-10">
            <HorizontalCollection onSelectProduct={handleOpenOrder} />
          </div>
        </div>

        {/* 5. Bento Capabilities & Contract Manufacturing */}
        <div className="bg-gradient-to-b from-[#FBF8F3] via-[#F6EEE3] to-[#E8D2B8]">
          <BentoServices onOpenQuote={handleOpenOrder} />
        </div>

        {/* 6. Newsletter Subscription */}
        <NewsletterSection />

        {/* Footer */}
        <Footer />

        {/* Floating Controls: WhatsApp + SFX Audio */}
        <FloatingControls onOpenContact={() => setIsContactOpen(true)} />

        {/* Cookie Notice Banner */}
        <CookieNotice />

        {/* Menu Drawer with 40% increased duration & fully visible outro slide-out */}
        <MenuDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onOpenOrder={handleOpenOrder}
        />

        {/* Contact Form Modal */}
        <ContactForm
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />

        {/* Order Modal */}
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultProduct={selectedProduct}
        />
      </main>
    </SmoothScrollProvider>
  );
}
