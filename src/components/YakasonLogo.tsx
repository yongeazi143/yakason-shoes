'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/lib/constants';

interface YakasonLogoProps {
  /** Wrap the logo in a Next.js Link to "/" */
  linked?: boolean;
  /** Extra className on the root element */
  className?: string;
  /**
   * Tailwind width class for the image, e.g. "w-[10vw]" or "w-32".
   */
  sizeClassName?: string;
  /** aria-label override for the link wrapper */
  ariaLabel?: string;
}

/**
 * YakasonLogo — single source-of-truth for the brand logo image.
 * Uses SITE.logo constants so path, alt, and native dimensions
 * are always in sync with the constants file.
 */
export default function YakasonLogo({
  linked = true,
  className = '',
  sizeClassName = 'w-[10vw] min-w-[72px] max-w-[160px]',
  ariaLabel,
}: YakasonLogoProps) {
  const img = (
    <Image
      src={SITE.logo.svgPath}
      alt={SITE.logo.alt}
      width={SITE.logo.width}
      height={SITE.logo.height}
      priority
      className={`object-contain ${sizeClassName}`}
    />
  );

  if (!linked) {
    return (
      <div className={`flex items-center ${className}`} aria-label={ariaLabel}>
        {img}
      </div>
    );
  }

  return (
    <Link
      href="/"
      className={`flex items-center ${className}`}
      aria-label={ariaLabel ?? `${SITE.name} — Home`}
    >
      {img}
    </Link>
  );
}
