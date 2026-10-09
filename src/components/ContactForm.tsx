'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send } from 'lucide-react';
import { SITE } from '@/lib/constants';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string>(
    SITE.whatsapp.prefilledMessage
  );
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const text = encodeURIComponent(`Hi, my name is ${name}.\n\n${message}`);
    window.open(`https://wa.me/${SITE.whatsapp.number}?text=${text}`, '_blank', 'noopener,noreferrer');
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
      setName('');
      setMessage(SITE.whatsapp.prefilledMessage);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#241B17]/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[#FBF8F3] border border-[#6A3527]/20 rounded-2xl shadow-2xl p-6 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-[10px] font-heading font-bold tracking-[0.3em] uppercase text-[#6A3527]">
                  SEND A MESSAGE
                </span>
                <h2 className="text-2xl font-heading font-black text-[#3B1E16] tracking-wide mt-0.5">
                  GET IN TOUCH
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-[#6A3527]/25 hover:border-[#6A3527] text-[#6A3527] flex items-center justify-center transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-8 text-center"
              >
                <MessageCircle className="w-12 h-12 text-[#25D366] mx-auto mb-3" />
                <p className="font-heading text-lg text-[#3B1E16]">OPENING WHATSAPP…</p>
                <p className="text-xs text-[#241B17]/60 font-body mt-1">
                  Your message has been prepared.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-heading font-bold tracking-[0.25em] uppercase text-[#6A3527] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chukwuemeka Obi"
                    required
                    className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded-lg px-4 py-2.5 text-sm text-[#241B17] font-body focus:outline-none focus:border-[#6A3527] transition placeholder:text-[#241B17]/35"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-bold tracking-[0.25em] uppercase text-[#6A3527] mb-1.5">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-[#F6EEE3] border border-[#6A3527]/20 rounded-lg px-4 py-2.5 text-sm text-[#241B17] font-body focus:outline-none focus:border-[#6A3527] transition resize-none placeholder:text-[#241B17]/35"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-heading font-black text-sm tracking-widest uppercase py-3 rounded-lg transition shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  SEND ON WHATSAPP
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
