import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode } from '../types';

interface ThemeSwitchAnimationProps {
  isActive: boolean;
  targetTheme: ThemeMode;
  origin?: { x: number; y: number };
  onComplete: () => void;
}

export const ThemeSwitchAnimation: React.FC<ThemeSwitchAnimationProps> = ({
  isActive,
  targetTheme,
  origin,
  onComplete
}) => {
  const isTargetLight = targetTheme === 'light';

  // Default origin to top-right button location if coordinate not captured
  const clickX = origin?.x ?? (typeof window !== 'undefined' ? window.innerWidth - 80 : 300);
  const clickY = origin?.y ?? 36;

  // Generate water splash droplet particles radiating from the click point
  const droplets = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2 + (Math.random() * 0.3 - 0.15);
      const distance = 35 + Math.random() * 45;
      return {
        id: i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size: 3 + Math.random() * 3,
        duration: 0.35 + Math.random() * 0.2,
        delay: Math.random() * 0.06
      };
    });
  }, [isActive]);

  // Concentric water wave rings data (staggered delay, expansion scale, border weights)
  const waveRings = [
    { delay: 0.0, duration: 0.85, maxScale: 38, borderW: 'border-[3px]', opacity: [0.9, 0.7, 0.3, 0] },
    { delay: 0.08, duration: 0.82, maxScale: 34, borderW: 'border-[2px]', opacity: [0.85, 0.6, 0.25, 0] },
    { delay: 0.16, duration: 0.80, maxScale: 30, borderW: 'border-[2.5px]', opacity: [0.8, 0.55, 0.2, 0] },
    { delay: 0.24, duration: 0.78, maxScale: 25, borderW: 'border-[1.5px]', opacity: [0.75, 0.45, 0.15, 0] },
    { delay: 0.32, duration: 0.75, maxScale: 20, borderW: 'border-[1px]', opacity: [0.7, 0.4, 0.1, 0] }
  ];

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isActive && (
        <div
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden select-none"
          aria-hidden="true"
        >
          {/* Progressive Water Frosted Blur Layer */}
          <div
            className={`absolute inset-0 water-theme-blur-overlay pointer-events-none ${
              isTargetLight
                ? 'bg-sky-100/10'
                : 'bg-slate-950/15'
            }`}
          />

          {/* Liquid Water Sheet Expansion (Translucent water wave that lets the blurred page shine through) */}
          <motion.div
            initial={{
              clipPath: `circle(0px at ${clickX}px ${clickY}px)`,
              opacity: 0.95
            }}
            animate={{
              clipPath: `circle(160vmax at ${clickX}px ${clickY}px)`,
              opacity: [0.95, 0.75, 0.35, 0]
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.25, 0.7, 1]
            }}
            className={`absolute inset-0 ${
              isTargetLight
                ? 'bg-gradient-to-br from-cyan-400/25 via-sky-200/15 to-transparent'
                : 'bg-gradient-to-br from-cyan-500/25 via-indigo-900/20 to-transparent'
            }`}
          />

          {/* Concentric Water Waves (পানির ঢেউয়ের তরঙ্গ) */}
          {waveRings.map((wave, idx) => (
            <motion.div
              key={`wave-ring-${idx}`}
              initial={{
                width: 70,
                height: 70,
                scale: 0.05,
                x: clickX,
                y: clickY,
                opacity: 0.95
              }}
              animate={{
                scale: wave.maxScale,
                opacity: wave.opacity
              }}
              exit={{
                opacity: 0
              }}
              transition={{
                duration: wave.duration,
                delay: wave.delay,
                ease: [0.1, 0.8, 0.25, 1]
              }}
              style={{
                translateX: '-50%',
                translateY: '-50%'
              }}
              className={`absolute rounded-full pointer-events-none ${wave.borderW} ${
                isTargetLight
                  ? 'border-cyan-400/90 shadow-[0_0_35px_rgba(6,182,212,0.6),inset_0_0_20px_rgba(255,255,255,0.8)]'
                  : 'border-cyan-300/80 shadow-[0_0_40px_rgba(56,189,248,0.7),inset_0_0_25px_rgba(99,102,241,0.5)]'
              }`}
            />
          ))}

          {/* Liquid Wave Caustic Shimmer Ring */}
          <motion.div
            initial={{
              scale: 0.1,
              x: clickX,
              y: clickY,
              opacity: 0.8
            }}
            animate={{
              scale: [0.1, 15, 35],
              opacity: [0.8, 0.4, 0]
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.85,
              ease: 'easeOut'
            }}
            style={{
              translateX: '-50%',
              translateY: '-50%'
            }}
            className={`absolute w-36 h-36 rounded-full border-[1.5px] border-dashed ${
              isTargetLight
                ? 'border-amber-300/70 shadow-[0_0_50px_rgba(251,191,36,0.5)]'
                : 'border-indigo-400/70 shadow-[0_0_50px_rgba(129,140,248,0.6)]'
            }`}
          />

          {/* Water Splash Droplets (পানির ছিটা কণা) */}
          {droplets.map((d) => (
            <motion.div
              key={`droplet-${d.id}`}
              initial={{
                x: clickX,
                y: clickY,
                scale: 1,
                opacity: 0.95
              }}
              animate={{
                x: clickX + d.dx,
                y: clickY + d.dy + 8, // slight gravity drop
                scale: [1, 1.3, 0],
                opacity: [0.95, 0.8, 0]
              }}
              exit={{
                opacity: 0
              }}
              transition={{
                duration: d.duration,
                delay: d.delay,
                ease: 'easeOut'
              }}
              style={{
                width: d.size,
                height: d.size,
                translateX: '-50%',
                translateY: '-50%'
              }}
              className={`absolute rounded-full ${
                isTargetLight
                  ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                  : 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]'
              }`}
            />
          ))}

          {/* Center Ripple Core Splash (পানির কেন্দ্রবিন্দুতে তৈরি হওয়া রিপল ডট) */}
          <motion.div
            initial={{
              scale: 0.2,
              x: clickX,
              y: clickY,
              opacity: 1
            }}
            animate={{
              scale: [0.2, 2.5, 0],
              opacity: [1, 0.6, 0]
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.4,
              ease: 'easeOut'
            }}
            style={{
              translateX: '-50%',
              translateY: '-50%'
            }}
            className={`absolute w-12 h-12 rounded-full border-2 ${
              isTargetLight
                ? 'border-cyan-500 bg-cyan-200/30'
                : 'border-cyan-400 bg-cyan-500/20'
            }`}
          />
        </div>
      )}
    </AnimatePresence>
  );
};
