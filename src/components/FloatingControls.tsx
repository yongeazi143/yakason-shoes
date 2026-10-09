'use client';

import React, { useState } from 'react';
import { VolumeX, MessageCircle } from 'lucide-react';

interface FloatingControlsProps {
  onOpenContact: () => void;
}

export default function FloatingControls({ onOpenContact }: FloatingControlsProps) {
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isMuted ? 520 : 260, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // ignore
    }
  };

  return (
    <aside className="fixed bottom-7 right-6 md:right-10 z-40 flex flex-col items-center gap-3">
      {/* WhatsApp Button */}
      <button
        onClick={onOpenContact}
        title="Chat on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] flex items-center justify-center transition shadow-lg group cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* SFX Audio Feedback Button */}
      <button
        onClick={toggleSound}
        title={isMuted ? 'Enable Sound FX' : 'Mute Sound FX'}
        className="w-12 h-12 rounded-full bg-[#F6EEE3] border border-[#6A3527]/30 hover:border-[#6A3527] text-[#6A3527] flex flex-col items-center justify-center transition shadow-lg backdrop-blur-md group cursor-pointer"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-[#6A3527]" />
        ) : (
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-3 bg-[#6A3527] animate-pulse" />
            <span className="w-0.5 h-2 bg-[#6A3527] animate-pulse delay-75" />
            <span className="w-0.5 h-3.5 bg-[#6A3527] animate-pulse delay-150" />
            <span className="w-0.5 h-1.5 bg-[#6A3527] animate-pulse delay-100" />
          </div>
        )}
        <span className="text-[8px] font-num font-bold tracking-widest text-[#6A3527] mt-0.5">
          SFX
        </span>
      </button>
    </aside>
  );
}
