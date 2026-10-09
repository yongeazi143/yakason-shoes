'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Send, CheckCircle2, Phone, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SITE } from '@/lib/constants';

const VALID_SILHOUETTES = [
  'Corporate Oxford',
  'Corporate Brown Derby',
  'Monk Strap',
  'Cortina School Shoe',
  'Back-to-School Shoes (12 pairs/carton)',
  'Palm Slippers',
  'Safety Boot (Steel Toe)',
  'Military / Tactical Boot',
  "Children's Shoes",
  'Bespoke Leather Bags',
  'Full-Grain Leather Belts',
] as const;

const PRODUCT_ALIASES: Record<string, string> = {
  'corporate oxford': 'Corporate Oxford',
  'corporate oxford classic': 'Corporate Oxford',
  'corporate brown derby': 'Corporate Brown Derby',
  'corporate brown derby (edition 2)': 'Corporate Brown Derby',
  'monk strap': 'Monk Strap',
  'bespoke double monk strap': 'Monk Strap',
  'cortina school shoe': 'Cortina School Shoe',
  'back-to-school cortina': 'Cortina School Shoe',
  'back-to-school shoes (12 pairs/carton)': 'Back-to-School Shoes (12 pairs/carton)',
  'palm slippers': 'Palm Slippers',
  'artisanal palm slippers': 'Palm Slippers',
  'safety boot (steel toe)': 'Safety Boot (Steel Toe)',
  'industrial safety boot (steel toe)': 'Safety Boot (Steel Toe)',
  'military / tactical boot': 'Military / Tactical Boot',
  'tactical military combat boot': 'Military / Tactical Boot',
  "children's shoes": "Children's Shoes",
  'bespoke leather bags': 'Bespoke Leather Bags',
  'full-grain leather belts': 'Full-Grain Leather Belts',
  'executive full-grain leather belts': 'Full-Grain Leather Belts',
  'bulk & corporate orders': 'Corporate Oxford',
  'school supply': 'Cortina School Shoe',
  'military & safety boots': 'Safety Boot (Steel Toe)',
  'made to customer specification': 'Corporate Oxford',
};

const GUARANTEE_STEPS = [
  {
    num: '1',
    chipText: '1. Sample',
    label: 'Physical Sample',
    desc: 'Approved prototype inspected before volume run begins.',
    colorClass: 'text-[#3B1E16]',
    isHighlight: false,
  },
  {
    num: '2',
    chipText: '2. Agree Price',
    label: 'Fixed Tier Pricing',
    desc: 'Volume discounts locked in written contract.',
    colorClass: 'text-[#3B1E16]',
    isHighlight: false,
  },
  {
    num: '3',
    chipText: '3. 60% Advance',
    label: '60% Production Advance',
    desc: 'Raw leather sourcing, cutting, and lasting commence.',
    colorClass: 'text-[#6A3527] font-bold',
    isHighlight: true,
  },
  {
    num: '4',
    chipText: '4. Production',
    label: 'Factory Production',
    desc: 'Quality control inspections at every lasted station.',
    colorClass: 'text-[#3B1E16]',
    isHighlight: false,
  },
  {
    num: '5',
    chipText: '5. 40% Delivery',
    label: '40% Balance on Delivery',
    desc: 'Waybill dispatched across Nigeria upon inspection.',
    colorClass: 'text-[#2F4A3A] font-bold',
    isHighlight: true,
  },
];

export default function BulkOrderForm() {
  const searchParams = useSearchParams();

  const [product, setProduct] = useState('Corporate Oxford');
  const [orderType, setOrderType] = useState<'bulk' | 'sample'>('bulk');
  const [quantity, setQuantity] = useState('10');
  const [sizeRange, setSizeRange] = useState('40 - 45');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Lagos, Nigeria');
  const [timeline, setTimeline] = useState('Within 2 Weeks');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize initial values from URL query parameters
  useEffect(() => {
    const rawProd = searchParams.get('product');
    if (rawProd) {
      const lower = rawProd.toLowerCase().trim();
      const matched = PRODUCT_ALIASES[lower] || VALID_SILHOUETTES.find((p) => p.toLowerCase() === lower);
      if (matched) {
        setProduct(matched);
      }
    }

    const rawType = searchParams.get('type');
    if (rawType) {
      const lowerType = rawType.toLowerCase().trim();
      if (lowerType === 'sample') {
        setOrderType('sample');
      } else if (lowerType === 'bulk') {
        setOrderType('bulk');
      }
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !quantity.trim()) {
      setErrorMessage('Please fill in your name, contact phone, and quantity.');
      return;
    }

    setErrorMessage('');
    setSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4A24C', '#6A3527', '#B9814F'],
      });
    } catch {
      // ignore
    }
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello ${SITE.shortName}! I want to request a quote:\n\n*Product:* ${product}\n*Order Type:* ${orderType.toUpperCase()}\n*Quantity:* ${quantity} pairs\n*Size Range:* ${sizeRange}\n*Name:* ${fullName || 'Client'}\n*Location:* ${location}\n*Timeline:* ${timeline}`;
    window.open(`https://wa.me/${SITE.whatsapp.orderNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMessage('');
  };

  return (
    <div className="w-full">
      {/* Mobile/Tablet Horizontal Chips (<1024px) */}
      <div className="lg:hidden mb-8 bg-[#FBF8F3]/80 backdrop-blur-sm border border-[#6A3527]/15 rounded-xl p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#3B1E16] mb-3 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#D4A24C]" />
          Yakason 5-Step Order Guarantee
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
          {GUARANTEE_STEPS.map((step) => (
            <div
              key={step.num}
              className={`snap-start shrink-0 px-3 py-2 rounded bg-[#F6EEE3] border border-[#6A3527]/20 text-xs font-semibold whitespace-nowrap ${step.colorClass}`}
            >
              {step.chipText}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (Desktop >=1024px): Sticky Guarantee Panel (~38%) */}
        <aside className="hidden lg:block lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-[#FBF8F3]/90 backdrop-blur-md border border-[#6A3527]/15 rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(59,30,22,0.06)]">
            <div className="flex items-center gap-2 mb-6 border-b border-[#6A3527]/15 pb-4">
              <ShieldCheck className="w-5 h-5 text-[#D4A24C]" />
              <h3 className="font-heading font-black text-sm tracking-wider uppercase text-[#3B1E16]">
                YAKASON 5-STEP ORDER GUARANTEE
              </h3>
            </div>

            {/* Vertical Numbered List connected by a thin brown line */}
            <div className="relative pl-2 space-y-6">
              <div
                aria-hidden="true"
                className="absolute left-[23px] top-4 bottom-4 w-[1.5px] bg-[#6A3527]/20"
              />
              {GUARANTEE_STEPS.map((step) => (
                <div key={step.num} className="relative flex items-start gap-4 z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-num font-bold shrink-0 shadow-xs border ${
                      step.isHighlight
                        ? 'bg-[#3B1E16] text-[#F6EEE3] border-[#3B1E16]'
                        : 'bg-[#F6EEE3] text-[#6A3527] border-[#6A3527]/30'
                    }`}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h4 className={`text-sm tracking-wide ${step.colorClass}`}>
                      {step.label}
                    </h4>
                    <p className="text-xs text-[#241B17]/70 font-body leading-relaxed mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Prefer to Talk Block */}
            <div className="mt-8 pt-6 border-t border-[#6A3527]/15 bg-[#F6EEE3]/60 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <span className="text-[10px] font-heading font-bold tracking-[0.25em] uppercase text-[#6A3527] block mb-1">
                DIRECT DESK
              </span>
              <h4 className="font-heading font-black text-sm text-[#3B1E16] mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4A24C]" />
                Prefer to talk directly?
              </h4>
              <p className="text-xs text-[#241B17]/75 font-body leading-relaxed mb-3">
                Call our Lagos factory floor or chat with our master production team on WhatsApp.
              </p>
              <div className="space-y-1.5 font-body text-xs">
                <p className="text-[#3B1E16] font-semibold">
                  Phone: <span className="font-num font-bold text-[#6A3527]">{SITE.contact.phoneDisplay}</span>
                </p>
                <p className="text-[#241B17]/65 text-[11px]">
                  Hours: {SITE.address.hours}
                </p>
              </div>
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-4 rounded-lg font-heading font-bold text-xs tracking-wider uppercase transition shadow-sm cursor-pointer min-h-[44px]"
              >
                <Phone className="w-4 h-4" /> Quick Chat on WhatsApp
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column: Form Panel (~62%) */}
        <section className="lg:col-span-7">
          <div className="w-full bg-[#FBF8F3]/90 backdrop-blur-md border border-[#6A3527]/10 rounded-2xl shadow-[0_4px_30px_rgba(59,30,22,0.06)] p-6 sm:p-8 md:p-10 text-[#241B17]">
            {submitted ? (
              /* Inline Success State */
              <div aria-live="polite" className="py-12 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#2F4A3A]/10 text-[#2F4A3A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-[#2F4A3A] animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] font-heading font-bold tracking-[0.3em] uppercase text-[#6A3527]">
                    CONFIRMATION
                  </span>
                  <h3 className="text-3xl font-heading font-black text-[#3B1E16] mt-1">
                    INQUIRY TRANSMITTED
                  </h3>
                  <p className="text-sm sm:text-base text-[#241B17]/75 font-body max-w-md mx-auto mt-3 leading-relaxed">
                    Thank you! Our factory team at {SITE.address.factoryShort} will contact you within 2 hours with wholesale sample pricing and batch timelines.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg text-xs font-heading font-bold tracking-wider uppercase hover:bg-[#20ba5a] transition shadow-md min-h-[44px] cursor-pointer"
                  >
                    <Phone className="w-4 h-4" /> Chat on WhatsApp Now
                  </button>

                  <Link
                    href="/"
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#3B1E16] hover:bg-[#6A3527] text-[#F6EEE3] px-6 py-3 rounded-lg text-xs font-heading font-bold tracking-wider uppercase transition shadow-md min-h-[44px]"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                  </Link>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-[#6A3527] hover:text-[#3B1E16] underline cursor-pointer"
                  >
                    Submit another quote request
                  </button>
                </div>
              </div>
            ) : (
              /* The Form */
              <form onSubmit={handleSubmit} className="space-y-5 font-body">
                {errorMessage && (
                  <div
                    aria-live="polite"
                    className="p-3.5 rounded-lg bg-[#E58B7B]/15 border border-[#E58B7B]/40 text-[#6A3527] text-xs font-semibold flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#E58B7B]" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Shoe Silhouette */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1.5">
                      Product Silhouette
                    </label>
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527] min-h-[44px]"
                    >
                      {VALID_SILHOUETTES.map((sil) => (
                        <option key={sil} value={sil}>
                          {sil}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Order Mode */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1.5">
                      Order Type
                    </label>
                    <div className="grid grid-cols-2 gap-2 min-h-[44px]">
                      <button
                        type="button"
                        onClick={() => setOrderType('bulk')}
                        className={`py-2.5 px-3 text-xs font-heading font-bold uppercase rounded-lg border transition cursor-pointer min-h-[44px] flex items-center justify-center ${
                          orderType === 'bulk'
                            ? 'bg-[#3B1E16] text-[#F6EEE3] border-transparent shadow-sm'
                            : 'bg-transparent border-[#6A3527]/20 text-[#6A3527] hover:bg-[#6A3527]/5'
                        }`}
                      >
                        Bulk Order
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('sample')}
                        className={`py-2.5 px-3 text-xs font-heading font-bold uppercase rounded-lg border transition cursor-pointer min-h-[44px] flex items-center justify-center ${
                          orderType === 'sample'
                            ? 'bg-[#3B1E16] text-[#F6EEE3] border-transparent shadow-sm'
                            : 'bg-transparent border-[#6A3527]/20 text-[#6A3527] hover:bg-[#6A3527]/5'
                        }`}
                      >
                        Sample First
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1.5">
                      Quantity (Pairs / Cartons)
                    </label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 50 pairs or 5 cartons"
                      required
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527] min-h-[44px]"
                    />
                  </div>

                  {/* Size Range */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1.5">
                      Size Distribution
                    </label>
                    <input
                      type="text"
                      value={sizeRange}
                      onChange={(e) => setSizeRange(e.target.value)}
                      placeholder="e.g. EU 39 - 46 (Assorted)"
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527] min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1.5">
                      Contact Name / Organization
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Capt. Adeyemi / Corona Schools PTA"
                      required
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527] min-h-[44px]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 80..."
                      required
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527] min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1.5">
                      Delivery State / Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Ikeja, Lagos or Abuja FCT"
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527] min-h-[44px]"
                    />
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1.5">
                      Desired Delivery Timeline
                    </label>
                    <input
                      type="text"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      placeholder="e.g. Within 10 Days"
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Terms Fine Print */}
                <div className="text-[11px] text-[#241B17]/75 flex items-start gap-2 pt-1 leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 text-[#B9814F] shrink-0 mt-0.5" />
                  <span>
                    Volume discounts apply automatically. Credit terms may be considered for established corporate & institutional partners. 
                    <strong> Note:</strong> Orders cannot be cancelled once leather cutting & lasting starts.
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#3B1E16] hover:bg-[#6A3527] text-[#F6EEE3] py-3.5 px-6 rounded-lg font-heading font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-md min-h-[48px] cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> SUBMIT WHOLESALE INQUIRY
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="flex-1 bg-[#25D366] text-white py-3.5 px-6 rounded-lg font-heading font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition shadow-md min-h-[48px] cursor-pointer"
                  >
                    <Phone className="w-4 h-4" /> DISCUSS ON WHATSAPP
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
