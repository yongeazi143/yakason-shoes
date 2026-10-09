'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Hammer, Sparkles } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import MagneticText from '@/components/MagneticText';

const CRAFT_LAYERS = [
  {
    step: 'LAYER 01',
    title: 'Leather Upper & Breathable Lining',
    subtitle: 'Full-Grain Nigerian & Imported Hides',
    desc: 'Cut and skived by hand. Carefully selected top-tier leather, wet-molded to eliminate tension spots and lined with sweat-absorbing goat or calf lining for Lagos all-day comfort.',
    features: ['Hand-dyed edges', 'Reinforced eyelets', 'Double-needle structural stitch'],
  },
  {
    step: 'LAYER 02',
    title: 'Insole, Shank, Toe Puff & Back Stiff',
    subtitle: 'The Architectural Backbone',
    desc: 'An orthopedically tuned steel or composite shank balances body weight across the arch. High-density thermoplastic toe puffs and heel counters ensure the silhouette never collapses.',
    features: ['Tempered spring steel shank', 'Moisture-wicking veg-tan insole', 'Resilient shape retention'],
  },
  {
    step: 'LAYER 03',
    title: 'Heavy-Duty Outsole & Welt Joint',
    subtitle: 'Tread for African Terrain',
    desc: 'Mounted with high-tensile bonding or Goodyear welt stitching. Available in dense anti-slip vulcanized rubber, lightweight polyurethane (PU), Nora crepe, or traditional burnished leather.',
    features: ['Oil & acid resistant options', 'Deep lug traction', '100% resolable architecture'],
  },
];

export default function AnatomyOfCraft() {
  return (
    <section id="anatomy" className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Sticky section cross-guide header */}
      <SectionHeader label="DECONSTRUCTED EXCELLENCE" theme="cream" />

      {/* Section Header Content */}
      <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
        <MagneticText as="h2" strength={12}>
          <span className="text-4xl md:text-6xl font-heading text-[#3B1E16] tracking-wide inline-block">
            THE ANATOMY OF CRAFT
          </span>
        </MagneticText>
        <p className="text-base md:text-lg text-[#241B17]/80 font-body mt-3">
          Behind every finished pair at Yakason is an exacting triple-layer engineering standard designed to outlast commercial imports.
        </p>
      </div>

      {/* Cards — horizontal scroll carousel at 70vw per card */}
      <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:-mx-12 md:px-12 scrollbar-hide">
        {CRAFT_LAYERS.map((layer, idx) => (
          <motion.div
            key={layer.step}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#FBF8F3]/70 backdrop-blur-md border border-[#6A3527]/15 rounded-xl p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(59,30,22,0.08)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group snap-start shrink-0"
            style={{ width: 'min(70vw, 480px)', minWidth: '280px' }}
          >
            {/* Top Indicator */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading text-lg text-[#B9814F] tracking-wider">
                  {layer.step}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#6A3527]/10 flex items-center justify-center text-[#6A3527]">
                  {idx === 0 && <Sparkles className="w-4 h-4" />}
                  {idx === 1 && <Hammer className="w-4 h-4" />}
                  {idx === 2 && <Layers className="w-4 h-4" />}
                </div>
              </div>

              <h3 className="text-2xl font-heading text-[#3B1E16] leading-tight mb-1">
                {layer.title}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6A3527] mb-4">
                {layer.subtitle}
              </p>

              <p className="text-sm text-[#241B17]/75 font-body leading-relaxed mb-6">
                {layer.desc}
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="border-t border-[#6A3527]/15 pt-4">
              <ul className="space-y-2">
                {layer.features.map((f) => (
                  <li key={f} className="text-xs text-[#241B17] flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B9814F] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
