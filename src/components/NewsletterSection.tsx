'use client';

import React, { useState, FormEvent } from 'react';
import { SITE } from '@/lib/constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Client-side email validation
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      setStatus('error');
      setErrorMessage(SITE.newsletter.errorMessage);
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          honeypot,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(data?.error || SITE.newsletter.errorMessage);
      }
    } catch {
      setStatus('error');
      setErrorMessage(SITE.newsletter.errorMessage);
    }
  };

  return (
    <section
      id="newsletter"
      aria-label="Newsletter Subscription"
      className="w-full bg-[#241B17] text-[#FBF8F3] py-20 sm:py-24 md:py-28 px-6 sm:px-8 border-t border-[#6A3527]/25"
    >
      <div className="max-w-[640px] mx-auto text-center">
        {/* Label Pill matching hero design token */}
        <div className="flex justify-center mb-6">
          <span className="text-[10px] md:text-xs font-heading font-bold tracking-[0.3em] uppercase whitespace-nowrap px-3.5 py-1 rounded-full border border-[#D4A24C]/35 text-[#D4A24C] bg-[#3B1E16]/80 shadow-xs">
            {SITE.newsletter.badge}
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight uppercase leading-tight mb-4">
          {SITE.newsletter.headline}
        </h2>

        {/* Supporting Line */}
        <p className="font-body text-xs sm:text-sm md:text-base text-[#FBF8F3]/80 leading-relaxed mb-8 max-w-lg mx-auto">
          {SITE.newsletter.description}
        </p>

        {/* Form without card boundary */}
        <form onSubmit={handleSubmit} noValidate className="w-full">
          {/* Honeypot field for bot mitigation */}
          <div aria-hidden="true" className="hidden">
            <label htmlFor="b_comment">Leave this field empty</label>
            <input
              type="text"
              id="b_comment"
              name="b_comment"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            {/* Visually hidden label */}
            <label htmlFor="newsletter-email-input" className="sr-only">
              Your email address
            </label>

            {/* Email Input */}
            <input
              id="newsletter-email-input"
              type="email"
              required
              autoComplete="email"
              placeholder={SITE.newsletter.placeholder}
              value={email}
              disabled={status === 'loading'}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setErrorMessage('');
                }
              }}
              className="flex-1 min-h-[48px] px-4 py-3 bg-[#1A120E] border border-[#D4A24C]/35 rounded text-sm text-[#FBF8F3] placeholder-[#FBF8F3]/40 focus:outline-none focus:ring-2 focus:ring-[#D4A24C] focus:border-transparent transition-all disabled:opacity-50"
            />

            {/* Subscribe Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="min-h-[48px] px-6 py-3 bg-[#D4A24C] hover:bg-[#B9814F] text-[#241B17] font-heading font-bold text-xs tracking-widest uppercase rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBF8F3] focus:ring-offset-2 focus:ring-offset-[#241B17] disabled:opacity-50 cursor-pointer shrink-0"
            >
              {status === 'loading' ? SITE.newsletter.subscribingText : SITE.newsletter.buttonText}
            </button>
          </div>

          {/* Inline Feedback States */}
          <div aria-live="polite" className="min-h-[24px] mt-3 text-xs font-semibold">
            {status === 'success' && (
              <p className="text-[#D4A24C]">{SITE.newsletter.successMessage}</p>
            )}
            {status === 'error' && (
              <p className="text-[#E58B7B]">{errorMessage}</p>
            )}
          </div>
        </form>

        {/* Privacy Note */}
        <p className="font-body text-[11px] sm:text-xs text-[#FBF8F3]/60 mt-1">
          {SITE.newsletter.privacyNote}
        </p>
      </div>
    </section>
  );
}
