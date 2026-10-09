'use client';

import React, { useEffect, useState, useRef } from 'react';
import { SITE } from '@/lib/constants';

const LOG_MESSAGES = [
  { label: 'CRAFT INITIALIZATION', status: 'OK' },
  { label: '3D LAST ARCHITECTURE', status: 'ONLINE' },
  { label: 'HERITAGE LEATHER ENGINE', status: 'LOADED' },
  { label: 'GOODYEAR WELT SHADERS', status: 'COMPILED' },
  { label: 'ATELIER SHOWROOM', status: 'READY' },
];

export default function YakasonPreloader({ onLoaded }: { onLoaded?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('STREAMING LEATHER GRAIN 1/5');
  const [sessionHex, setSessionHex] = useState('0x9908');
  const [clockTime, setClockTime] = useState('00.000');
  const [logIndex, setLogIndex] = useState(1);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const N_TICKS = 32;
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = performance.now();
    setSessionHex('0x' + Math.floor(0x9000 + Math.random() * 0x0FFF).toString(16).toUpperCase());

    let animId: number;
    const updateClock = (now: number) => {
      const elapsed = ((now - startTimeRef.current) / 1000).toFixed(3);
      setClockTime(elapsed.padStart(6, '0'));
      if (!isDone) {
        animId = requestAnimationFrame(updateClock);
      }
    };
    animId = requestAnimationFrame(updateClock);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        const jump = Math.floor(Math.random() * 3) + 1;
        const next = Math.min(100, prev + jump);

        if (next < 30) {
          setStage(`STREAMING LEATHER GRAIN ${Math.max(1, Math.floor((next / 30) * 5))}/5`);
        } else if (next < 60) {
          setStage(`LASTING 3D SHOE SHAPE`);
          setLogIndex(2);
        } else if (next < 80) {
          setStage(`INSPECTING WELT STITCHING`);
          setLogIndex(3);
        } else if (next < 95) {
          setStage(`CALIBRATING LIGHTING`);
          setLogIndex(4);
        } else {
          setStage('ATELIER READY');
          setLogIndex(5);
        }

        return next;
      });
    }, 40);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, [isDone]);

  useEffect(() => {
    if (progress === 100) {
      const exitTimeout = setTimeout(() => {
        setIsExiting(true);
      }, 350);

      const doneTimeout = setTimeout(() => {
        setIsDone(true);
        if (onLoaded) onLoaded();
      }, 1350);

      return () => {
        clearTimeout(exitTimeout);
        clearTimeout(doneTimeout);
      };
    }
  }, [progress, onLoaded]);

  if (isDone) return null;

  const litCount = Math.round((progress / 100) * N_TICKS);

  return (
    <div
      id="preloader"
      className={isExiting ? 'pl-exit' : ''}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: '#3B1E16',
        overflow: 'hidden',
        pointerEvents: isExiting ? 'none' : 'auto',
        transform: isExiting ? 'translateY(-100%)' : 'translateY(0)',
        borderBottom: isExiting ? '2px solid rgba(212, 162, 76, 0.85)' : 'none',
        boxShadow: isExiting ? '0 15px 45px rgba(59, 30, 22, 0.35)' : 'none',
        transition: 'transform 0.82s cubic-bezier(0.76, 0, 0.24, 1) 0.15s',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* Background warm radial lighting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(212, 162, 76, 0.14) 0%, rgba(59, 30, 22, 0.98) 75%)',
          pointerEvents: 'none',
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Grid Pattern */}
      <div
        className="pl-grid"
        style={{
          opacity: isExiting ? 0 : 0.45,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Scanline Sweep */}
      <div
        className="pl-scan"
        style={{
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Corner Brackets */}
      <div
        style={{
          position: 'absolute',
          top: '4vh',
          left: '4vw',
          width: '28px',
          height: '28px',
          borderTop: '1.5px solid rgba(212, 162, 76, 0.7)',
          borderLeft: '1.5px solid rgba(212, 162, 76, 0.7)',
          pointerEvents: 'none',
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '4vh',
          right: '4vw',
          width: '28px',
          height: '28px',
          borderTop: '1.5px solid rgba(212, 162, 76, 0.7)',
          borderRight: '1.5px solid rgba(212, 162, 76, 0.7)',
          pointerEvents: 'none',
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '4vh',
          left: '4vw',
          width: '28px',
          height: '28px',
          borderBottom: '1.5px solid rgba(212, 162, 76, 0.7)',
          borderLeft: '1.5px solid rgba(212, 162, 76, 0.7)',
          pointerEvents: 'none',
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '4vh',
          right: '4vw',
          width: '28px',
          height: '28px',
          borderBottom: '1.5px solid rgba(212, 162, 76, 0.7)',
          borderRight: '1.5px solid rgba(212, 162, 76, 0.7)',
          pointerEvents: 'none',
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Top Left: Brand Heritage & CAC Registration */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(4vh + 6px)',
          left: 'calc(4vw + 38px)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: '0.72rem',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'rgba(184, 173, 156, 0.85)',
          whiteSpace: 'nowrap',
          zIndex: 10,
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      >
        YAKASON//CRAFT <span style={{ color: '#D4A24C' }}>EST. 2005 · RC 9908327</span>
      </div>

      {/* Top Right: Lagos Factory Coordinates */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(4vh + 6px)',
          right: 'calc(4vw + 38px)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: '0.72rem',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'rgba(184, 173, 156, 0.85)',
          whiteSpace: 'nowrap',
          zIndex: 10,
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      >
        LAGOS <span style={{ color: '#D4A24C' }}>6.52°N 3.37°E</span>
      </div>

      {/* Center Core HUD */}
      <div
        className="pl-core"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: isExiting ? 'translate(-50%, -62%) scale(0.97)' : 'translate(-50%, -50%) scale(1)',
          opacity: isExiting ? 0 : 1,
          transition: 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <div
          className="font-heading loader-brand"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.4rem, 3.2vw, 2.2rem)',
            letterSpacing: isExiting ? '0.36em' : '0.25em',
            marginRight: isExiting ? '-0.36em' : '-0.25em',
            color: '#F6EEE3',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: 'letter-spacing 0.48s cubic-bezier(0.16, 1, 0.3, 1), margin-right 0.48s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          YAKASON GLOBAL BEST VENTURE
        </div>

        <div
          className="font-num"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginTop: '2.5vh',
            fontFamily: "'Orbitron', monospace, sans-serif",
          }}
        >
          <span
            id="loader-progress"
            style={{
              fontSize: 'clamp(4.5rem, 9vw, 8rem)',
              color: '#F6EEE3',
              fontWeight: 700,
              letterSpacing: '0.06em',
              lineHeight: 1,
              textShadow: '0 0 35px rgba(212, 162, 76, 0.25)',
            }}
          >
            {String(progress).padStart(3, '0')}
          </span>
          <em
            style={{
              fontStyle: 'normal',
              fontSize: 'clamp(1.4rem, 2.4vw, 2.4rem)',
              color: '#D4A24C',
              marginLeft: '0.25em',
              marginTop: '0.35em',
            }}
          >
            %
          </em>
        </div>

        {/* 32 Step Indicator Ticks */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '2.8vh' }}>
          {Array.from({ length: N_TICKS }).map((_, i) => (
            <i
              key={i}
              style={{
                width: '6px',
                height: '15px',
                borderRadius: '1px',
                transition: 'background 0.2s, box-shadow 0.2s',
                background:
                  i < litCount - 1
                    ? 'rgba(212, 162, 76, 0.85)'
                    : i === litCount - 1
                      ? '#ffffff'
                      : 'rgba(239, 232, 220, 0.08)',
                boxShadow:
                  i === litCount - 1
                    ? '0 0 12px rgba(212, 162, 76, 1), 0 0 3px #ffffff'
                    : i < litCount - 1
                      ? '0 0 6px rgba(212, 162, 76, 0.5)'
                      : 'none',
              }}
            />
          ))}
        </div>

        <div
          className="font-body"
          style={{
            marginTop: '2.2vh',
            color: '#D4A24C',
            fontWeight: 600,
            letterSpacing: '0.3em',
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {stage}
        </div>
      </div>

      {/* Bottom Left: Craft Diagnostic Logs */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(4vw + 38px)',
          bottom: 'calc(4vh + 8px)',
          fontFamily: "'Orbitron', monospace, sans-serif",
          zIndex: 10,
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      >
        {LOG_MESSAGES.map((item, idx) => (
          <div
            key={item.label}
            style={{
              height: '1.9em',
              whiteSpace: 'nowrap',
              color: 'rgba(184, 173, 156, 0.9)',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              opacity: idx < logIndex ? 1 : 0,
              transform: idx < logIndex ? 'none' : 'translateX(-8px)',
              transition: 'opacity 0.35s, transform 0.35s',
            }}
          >
            &gt; {item.label} <b style={{ color: '#D4A24C' }}>{item.status}</b>
          </div>
        ))}
      </div>

      {/* Bottom Right: Session & Precision HUD Clock */}
      <div
        style={{
          position: 'absolute',
          right: 'calc(4vw + 38px)',
          bottom: 'calc(4vh + 8px)',
          fontFamily: "'Orbitron', monospace, sans-serif",
          fontSize: '0.66rem',
          letterSpacing: '0.16em',
          color: 'rgba(184, 173, 156, 0.85)',
          textTransform: 'uppercase',
          zIndex: 10,
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      >
        SESSION <span style={{ color: '#D4A24C' }}>{sessionHex}</span> ·{' '}
        <span style={{ color: '#efe8dc' }}>{clockTime}</span>S
      </div>

    </div>
  );
}
