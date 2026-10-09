'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

export default function OrderModal({ isOpen, onClose, defaultProduct = 'Corporate Oxford' }: OrderModalProps) {
  const [product, setProduct] = useState(defaultProduct);
  const [orderType, setOrderType] = useState<'bulk' | 'sample'>('bulk');
  const [quantity, setQuantity] = useState('10');
  const [sizeRange, setSizeRange] = useState('40 - 45');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Lagos, Nigeria');
  const [timeline, setTimeline] = useState('Within 2 Weeks');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    const text = `Hello Yakason Shoes! I want to request a quote:\n\n*Product:* ${product}\n*Order Type:* ${orderType.toUpperCase()}\n*Quantity:* ${quantity} pairs\n*Size Range:* ${sizeRange}\n*Name:* ${fullName || 'Client'}\n*Location:* ${location}\n*Timeline:* ${timeline}`;
    window.open(`https://wa.me/2348000000000?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#241B17]/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#FBF8F3] border border-[#6A3527]/20 rounded-xl shadow-2xl p-6 md:p-8 z-10 text-[#241B17] max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#6A3527]/10 transition-colors"
            >
              <X className="w-5 h-5 text-[#6A3527]" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#6A3527]">
                Bespoke & Volume Production
              </span>
              <h2 className="text-3xl md:text-4xl font-heading tracking-wide mt-1 text-[#3B1E16]">
                REQUEST A BULK QUOTE / ORDER
              </h2>
              <p className="text-sm text-[#241B17]/75 font-body mt-1">
                Direct from our Lagos factory floor. CAC (RC 9908327) & SON Certified Quality.
              </p>
            </div>

            {/* 5-Step Production Milestone Strip */}
            <div className="mb-6 bg-[#F6EEE3] p-4 rounded-lg border border-[#6A3527]/15">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#3B1E16] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4A24C]" />
                Yakason 5-Step Order Guarantee
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] md:text-xs font-semibold">
                <div className="p-1.5 rounded bg-[#FBF8F3] border border-[#6A3527]/20">1. Sample</div>
                <div className="p-1.5 rounded bg-[#FBF8F3] border border-[#6A3527]/20">2. Agree Price</div>
                <div className="p-1.5 rounded bg-[#FBF8F3] border border-[#6A3527]/20 font-bold text-[#6A3527]">3. 60% Advance</div>
                <div className="p-1.5 rounded bg-[#FBF8F3] border border-[#6A3527]/20">4. Production</div>
                <div className="p-1.5 rounded bg-[#FBF8F3] border border-[#6A3527]/20 font-bold text-[#2F4A3A]">5. 40% Delivery</div>
              </div>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[#2F4A3A] mx-auto animate-bounce" />
                <h3 className="text-2xl font-heading text-[#3B1E16]">INQUIRY TRANSMITTED</h3>
                <p className="text-sm text-[#241B17]/75 max-w-md mx-auto">
                  Thank you! Our factory team at 99 Abeokuta Expressway will contact you within 2 hours with wholesale sample pricing and batch timelines.
                </p>
                <button
                  onClick={handleWhatsAppDirect}
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded text-sm font-bold tracking-wider uppercase hover:bg-[#20ba5a] transition"
                >
                  <Phone className="w-4 h-4" /> Chat on WhatsApp Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Shoe Silhouette */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1">
                      Product Silhouette
                    </label>
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded px-3 py-2.5 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527]"
                    >
                      <option>Corporate Oxford</option>
                      <option>Corporate Brown Derby</option>
                      <option>Monk Strap</option>
                      <option>Cortina School Shoe</option>
                      <option>Back-to-School Shoes (12 pairs/carton)</option>
                      <option>Palm Slippers</option>
                      <option>Safety Boot (Steel Toe)</option>
                      <option>Military / Tactical Boot</option>
                      <option>Children's Shoes</option>
                      <option>Bespoke Leather Bags</option>
                      <option>Full-Grain Leather Belts</option>
                    </select>
                  </div>

                  {/* Order Mode */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1">
                      Order Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('bulk')}
                        className={`py-2 px-3 text-xs font-bold uppercase rounded border transition ${
                          orderType === 'bulk'
                            ? 'bg-[#3B1E16] text-[#F6EEE3] border-transparent'
                            : 'bg-transparent border-[#6A3527]/20 text-[#6A3527]'
                        }`}
                      >
                        Bulk Order
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('sample')}
                        className={`py-2 px-3 text-xs font-bold uppercase rounded border transition ${
                          orderType === 'sample'
                            ? 'bg-[#3B1E16] text-[#F6EEE3] border-transparent'
                            : 'bg-transparent border-[#6A3527]/20 text-[#6A3527]'
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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1">
                      Quantity (Pairs / Cartons)
                    </label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 50 pairs or 5 cartons"
                      required
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded px-3 py-2 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527]"
                    />
                  </div>

                  {/* Size Range */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1">
                      Size Distribution
                    </label>
                    <input
                      type="text"
                      value={sizeRange}
                      onChange={(e) => setSizeRange(e.target.value)}
                      placeholder="e.g. EU 39 - 46 (Assorted)"
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded px-3 py-2 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1">
                      Contact Name / Organization
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Capt. Adeyemi / Corona Schools PTA"
                      required
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded px-3 py-2 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 80..."
                      required
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded px-3 py-2 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1">
                      Delivery State / Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Ikeja, Lagos or Abuja FCT"
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded px-3 py-2 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527]"
                    />
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-1">
                      Desired Delivery Timeline
                    </label>
                    <input
                      type="text"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      placeholder="e.g. Within 10 Days"
                      className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded px-3 py-2 text-sm text-[#241B17] focus:outline-none focus:border-[#6A3527]"
                    />
                  </div>
                </div>

                {/* Terms Fine Print */}
                <div className="text-[11px] text-[#241B17]/75 flex items-start gap-1.5 pt-1">
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
                    className="flex-1 bg-[#3B1E16] hover:bg-[#6A3527] text-[#F6EEE3] py-3 rounded font-heading text-lg tracking-wider flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <Send className="w-4 h-4" /> SUBMIT WHOLESALE INQUIRY
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="flex-1 bg-[#25D366] text-white py-3 rounded font-heading text-lg tracking-wider flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition shadow-md"
                  >
                    <Phone className="w-4 h-4" /> DISCUSS ON WHATSAPP
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
