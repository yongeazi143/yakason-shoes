'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, PackageCheck, Eye } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import MagneticText from '@/components/MagneticText';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  packaging: string;
  badge?: string;
  specs: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'school-01',
    name: 'Back-to-School Cortina',
    category: 'Institutional Supply',
    price: '₦3,000',
    packaging: '12 pairs per carton',
    badge: 'High Demand',
    specs: 'Reinforced toe bumper · Scuff-resistant finish · Dual-density rubber sole',
  },
  {
    id: 'palm-01',
    name: 'Artisanal Palm Slippers',
    category: 'Casual Luxury',
    price: '₦2,900',
    packaging: 'Wholesale carton available',
    specs: 'Soft leather upper · Cushioned footbed · Lightweight flex outsole',
  },
  {
    id: 'corp-01',
    name: 'Corporate Oxford Classic',
    category: 'Executive Series',
    price: '₦10,000',
    packaging: '10 pairs per carton',
    badge: 'Flagship',
    specs: 'Full-grain calfskin · Burnished toe cap · Leather & rubber hybrid sole',
  },
  {
    id: 'corp-02',
    name: 'Corporate Brown Derby (Edition 2)',
    category: 'Executive Series',
    price: '₦14,500',
    packaging: '10 pairs per carton',
    badge: 'Hand-Patinated',
    specs: 'Open-lacing fit · Memory foam insole · Goodyear-welted look',
  },
  {
    id: 'mil-01',
    name: 'Tactical Military Combat Boot',
    category: 'Security & Paramilitary',
    price: 'Request a Quote',
    packaging: '50 pairs per bag',
    badge: 'Heavy Duty',
    specs: 'Water-repellent combat leather · Speed lacing system · Deep tread lug sole',
  },
  {
    id: 'safe-01',
    name: 'Industrial Safety Boot (Steel Toe)',
    category: 'Safety & Engineering',
    price: 'Request a Quote',
    packaging: '50 pairs per bag',
    badge: 'EN ISO Certified',
    specs: '200J Impact steel toe cap · Puncture-resistant steel midsole · Oil/Acid proof',
  },
  {
    id: 'monk-01',
    name: 'Bespoke Double Monk Strap',
    category: 'Special Commission',
    price: '₦18,500',
    packaging: 'Bespoke box / Bulk tier',
    specs: 'Polished solid brass buckles · Beveled waist sole · Hand-finished edge ink',
  },
  {
    id: 'acc-01',
    name: 'Executive Full-Grain Leather Belts',
    category: 'Accessories',
    price: '₦4,500',
    packaging: '24 pcs per carton',
    specs: '100% thick bridle hide · Solid nickel-free hardware · Edge burnished',
  },
];

export default function HorizontalCollection({ onSelectProduct }: { onSelectProduct?: (productName: string) => void }) {
  return (
    <section id="collection" className="py-16 md:py-24 overflow-hidden border-t border-b border-[#6A3527]/15">
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-8">
        <SectionHeader label="WHOLESALE & BESPOKE CATALOG" theme="cream" />
      </div>

      <div className="px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-12 pt-4">
        <div>
          <MagneticText as="h2" strength={12}>
            <span className="text-4xl md:text-6xl font-heading text-[#3B1E16] tracking-wide inline-block">
              FLAGSHIP SILHOUETTES
            </span>
          </MagneticText>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#241B17]/70">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B9814F] animate-ping" />
          SWIPE / DRAG HORIZONTALLY TO EXPLORE
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-8 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing">
        {PRODUCTS.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -6 }}
            className="flex-shrink-0 w-[300px] md:w-[360px] bg-[#FBF8F3]/70 backdrop-blur-md border border-[#6A3527]/15 rounded-xl p-6 snap-start flex flex-col justify-between shadow-[0_4px_20px_rgba(59,30,22,0.08)] relative group"
          >
            {/* Badge */}
            {item.badge && (
              <span className="absolute top-4 right-4 bg-[#3B1E16] text-[#F6EEE3] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                {item.badge}
              </span>
            )}

            <div>
              <span className="text-xs font-semibold text-[#6A3527] uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="text-2xl font-heading text-[#3B1E16] mt-1 mb-2">
                {item.name}
              </h3>
              <p className="text-xs text-[#241B17]/75 font-body mb-4 leading-relaxed">
                {item.specs}
              </p>
            </div>

            <div className="border-t border-[#6A3527]/15 pt-4 mt-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xl md:text-2xl font-heading text-[#3B1E16] font-bold">
                  {item.price}
                </span>
                <span className="text-[11px] font-semibold text-[#241B17]/70 flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-[#2F4A3A]" />
                  {item.packaging}
                </span>
              </div>

              <Link
                href={`/bulk-order?product=${encodeURIComponent(item.name)}&type=sample`}
                className="w-full border border-[#6A3527] hover:bg-[#6A3527]/[0.08] text-[#6A3527] py-2.5 rounded text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 mt-2"
              >
                Request Sample & Quote <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
