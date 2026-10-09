'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, ShieldAlert, Stamp, ArrowUpRight } from 'lucide-react';

import SectionHeader from '@/components/SectionHeader';
import MagneticText from '@/components/MagneticText';

interface BentoServicesProps {
  onOpenQuote?: (serviceName: string) => void;
}

export default function BentoServices({ onOpenQuote }: BentoServicesProps) {
  return (
    <section id="services" className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Sticky section cross-guide header */}
      <SectionHeader label="INSTITUTIONAL & CONTRACT MANUFACTURING" theme="cream" />

      <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
        <MagneticText as="h2" strength={12}>
          <span className="text-4xl md:text-6xl font-heading text-[#3B1E16] tracking-wide inline-block">
            BENTO CAPABILITIES & SERVICES
          </span>
        </MagneticText>
        <p className="text-base text-[#241B17]/80 font-body mt-3">
          Engineered for bulk procurement, corporate uniforming, and custom client requirements across Nigeria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 01 - Large Hero Bento */}
        <motion.div
          whileHover={{ y: -4 }}
          className="md:col-span-2 bg-[#FBF8F3]/70 backdrop-blur-md border border-[#6A3527]/15 rounded-xl p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(59,30,22,0.08)] relative overflow-hidden group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading text-xl text-[#B9814F]">01</span>
              <Building2 className="w-6 h-6 text-[#6A3527]" />
            </div>
            <h3 className="text-3xl md:text-4xl font-heading text-[#3B1E16] mb-3">
              BULK & CORPORATE CONTRACT ORDERS
            </h3>
            <p className="text-sm md:text-base text-[#241B17]/75 font-body leading-relaxed max-w-xl">
              We supply banks, security firms, hotels, and executive fleets. We deliver master physical samples for board approval before production. Volume pricing discounts scale automatically by carton tiers.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#6A3527]/15 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6A3527]">
              Samples First · Flexible Milestone Terms
            </span>
            <Link
              href="/bulk-order?product=Corporate%20Oxford&type=bulk"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6A3527] hover:text-[#3B1E16] group-hover:underline"
            >
              Inquire Corporate Rate <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Card 02 - School Supply */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#FBF8F3]/70 backdrop-blur-md border border-[#6A3527]/15 rounded-xl p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(59,30,22,0.08)] group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading text-xl text-[#B9814F]">02</span>
              <GraduationCap className="w-6 h-6 text-[#6A3527]" />
            </div>
            <h3 className="text-2xl md:text-3xl font-heading text-[#3B1E16] mb-3">
              ACADEMIC & SCHOOL SUPPLY
            </h3>
            <p className="text-sm text-[#241B17]/75 font-body leading-relaxed">
              Wholesale Cortina and back-to-school shoes (from ₦3,000/pair). Direct PTA, school proprietor, and cooperative distribution partnerships across Lagos and nationwide.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#6A3527]/15">
            <Link
              href="/bulk-order?product=Cortina%20School%20Shoe&type=bulk"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6A3527] hover:text-[#3B1E16] group-hover:underline"
            >
              Request School Tiers <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Card 03 - Military & Safety */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#FBF8F3]/70 backdrop-blur-md border border-[#6A3527]/15 rounded-xl p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(59,30,22,0.08)] group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading text-xl text-[#B9814F]">03</span>
              <ShieldAlert className="w-6 h-6 text-[#6A3527]" />
            </div>
            <h3 className="text-2xl md:text-3xl font-heading text-[#3B1E16] mb-3">
              MILITARY, PARAMILITARY & SAFETY
            </h3>
            <p className="text-sm text-[#241B17]/75 font-body leading-relaxed">
              Reinforced steel-toe industrial boots and lightweight tactical combat boots. Packaged 50 pairs per reinforced bag, built to survive the harshest site and tactical conditions.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#6A3527]/15">
            <Link
              href="/bulk-order?product=Safety%20Boot%20(Steel%20Toe)&type=bulk"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6A3527] hover:text-[#3B1E16] group-hover:underline"
            >
              Order Tender Batches <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Card 04 - Customer Specification (Wide Bento) */}
        <motion.div
          whileHover={{ y: -4 }}
          className="md:col-span-2 bg-[#FBF8F3]/70 backdrop-blur-md border border-[#6A3527]/15 rounded-xl p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(59,30,22,0.08)] group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading text-xl text-[#B9814F]">04</span>
              <Stamp className="w-6 h-6 text-[#6A3527]" />
            </div>
            <h3 className="text-3xl md:text-4xl font-heading text-[#3B1E16] mb-3">
              MADE TO CUSTOMER SPECIFICATION
            </h3>
            <p className="text-sm md:text-base text-[#241B17]/75 font-body leading-relaxed max-w-xl">
              Bring your design sketch, sample shoe, or brand requirements. We source the specific leather grade, forge custom lasts, and stamp each finished pair with the authentic Yakason emblem of guaranteed craftsmanship.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#6A3527]/15 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6A3527]">
              Bespoke Lasting · Private Labeling
            </span>
            <Link
              href="/bulk-order?type=sample"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6A3527] hover:text-[#3B1E16] group-hover:underline"
            >
              Start Custom Brief <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
