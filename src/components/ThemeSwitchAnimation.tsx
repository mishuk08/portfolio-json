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

  // Concentric water wave rings data (optimized 320ms duration for 60fps)
  const waveRings = [
    { delay: 0.0, duration: 0.34, maxScale: 32, borderW: 'border-[2px]', opacity: [0.9, 0.5, 0] },
    { delay: 0.05, duration: 0.32, maxScale: 26, borderW: 'border-[1.5px]', opacity: [0.8, 0.4, 0] },
    { delay: 0.1, duration: 0.30, maxScale: 20, borderW: 'border-[1px]', opacity: [0.7, 0.3, 0] }
  ];

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isActive && (
        <div
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden select-none gpu-layer"
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

          {/* Liquid Water Sheet Expansion */}
          <motion.div
            initial={{
              clipPath: `circle(0px at ${clickX}px ${clickY}px)`,
              opacity: 0.95
            }}
            animate={{
              clipPath: `circle(140vmax at ${clickX}px ${clickY}px)`,
              opacity: [0.95, 0.6, 0]
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.4, 1]
            }}
            className={`absolute inset-0 gpu-layer ${
              isTargetLight
                ? 'bg-gradient-to-br from-cyan-400/20 via-sky-200/10 to-transparent'
                : 'bg-gradient-to-br from-cyan-500/20 via-indigo-900/15 to-transparent'
            }`}
          />

          {/* Concentric Water Waves */}
          {waveRings.map((wave, idx) => (
            <motion.div
              key={`wave-ring-${idx}`}
              initial={{
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
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{
                translateX: '-50%',
                translateY: '-50%'
              }}
              className={`absolute w-16 h-16 rounded-full pointer-events-none gpu-layer ${wave.borderW} ${
                isTargetLight
                  ? 'border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'border-cyan-300/70 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
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
              scale: [0.1, 15, 30],
              opacity: [0.8, 0.3, 0]
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              translateX: '-50%',
              translateY: '-50%'
            }}
            className={`absolute w-32 h-32 rounded-full border-[1.5px] border-dashed gpu-layer ${
              isTargetLight
                ? 'border-amber-300/60 shadow-[0_0_25px_rgba(251,191,36,0.3)]'
                : 'border-indigo-400/60 shadow-[0_0_25px_rgba(129,140,248,0.3)]'
            }`}
          />

          {/* Water Splash Droplets */}
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
                y: clickY + d.dy + 4,
                scale: [1, 1.2, 0],
                opacity: [0.95, 0.6, 0]
              }}
              exit={{
                opacity: 0
              }}
              transition={{
                duration: 0.26,
                delay: d.delay,
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{
                width: d.size,
                height: d.size,
                translateX: '-50%',
                translateY: '-50%'
              }}
              className={`absolute rounded-full gpu-layer ${
                isTargetLight
                  ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]'
                  : 'bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.7)]'
              }`}
            />
          ))}

          {/* Center Ripple Core Splash */}
          <motion.div
            initial={{
              scale: 0.2,
              x: clickX,
              y: clickY,
              opacity: 1
            }}
            animate={{
              scale: [0.2, 2.2, 0],
              opacity: [1, 0.5, 0]
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              translateX: '-50%',
              translateY: '-50%'
            }}
            className={`absolute w-12 h-12 rounded-full border-2 gpu-layer ${
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
