import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Sparkles, Star } from 'lucide-react';
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
  
  // Default origin to top-right if not provided (near the toggle button)
  const clickX = origin?.x ?? (typeof window !== 'undefined' ? window.innerWidth - 100 : 300);
  const clickY = origin?.y ?? 36;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isActive && (
        <div 
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden select-none"
          aria-hidden="true"
        >
          {/* Radial Expanding Ripple from the Toggle Button Click Coordinate */}
          <motion.div
            initial={{
              clipPath: `circle(0px at ${clickX}px ${clickY}px)`,
              opacity: 0.95
            }}
            animate={{
              clipPath: `circle(150vmax at ${clickX}px ${clickY}px)`,
              opacity: [0.95, 0.98, 0.6, 0]
            }}
            transition={{
              duration: 0.68,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.35, 0.7, 1]
            }}
            className={`absolute inset-0 ${
              isTargetLight
                ? 'bg-gradient-to-br from-amber-200/90 via-amber-100/85 to-white/95 backdrop-blur-md'
                : 'bg-gradient-to-br from-[#07090e]/95 via-[#0b0f19]/90 to-[#121629]/95 backdrop-blur-md'
            }`}
          />

          {/* Luminous Expanding Energy Ring */}
          <motion.div
            initial={{
              scale: 0,
              x: clickX,
              y: clickY,
              opacity: 1
            }}
            animate={{
              scale: [0, 4, 12],
              opacity: [0.9, 0.4, 0]
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut'
            }}
            style={{
              translateX: '-50%',
              translateY: '-50%'
            }}
            className={`absolute w-32 h-32 rounded-full border-2 ${
              isTargetLight
                ? 'border-amber-400/80 shadow-[0_0_80px_rgba(251,191,36,0.8)]'
                : 'border-cyan-400/80 shadow-[0_0_80px_rgba(34,211,238,0.8)]'
            }`}
          />

          {/* Center Floating Celestial HUD Notification Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.6, y: 30, opacity: 0, filter: 'blur(10px)' }}
              animate={{ 
                scale: [0.6, 1.05, 1], 
                y: [30, -5, 0], 
                opacity: [0, 1, 1],
                filter: 'blur(0px)'
              }}
              exit={{ scale: 0.85, y: -20, opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={`relative px-5 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3.5 ${
                isTargetLight
                  ? 'bg-white/95 border-amber-300/80 text-slate-900 shadow-amber-400/25'
                  : 'bg-[#0f121d]/95 border-cyan-500/40 text-white shadow-cyan-500/20'
              }`}
            >
              {/* Animated Glowing Icon Orbit */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: isTargetLight ? 180 : -180 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className={`p-2.5 rounded-xl ${
                    isTargetLight
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md shadow-amber-400/40'
                      : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/40'
                  }`}
                >
                  {isTargetLight ? (
                    <Sun className="w-5 h-5 animate-spin-slow stroke-[2.2]" />
                  ) : (
                    <Moon className="w-5 h-5 stroke-[2.2]" />
                  )}
                </motion.div>

                {/* Sparkling Mini Satellite Star */}
                <motion.div
                  animate={{ 
                    scale: [0, 1.2, 0.8, 1],
                    rotate: [0, 45, 90]
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isTargetLight ? 'text-amber-500' : 'text-cyan-300'}`} />
                </motion.div>
              </div>

              {/* Text Label */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight">
                    {isTargetLight ? 'Light Mode' : 'Dark IDE Mode'}
                  </span>
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    isTargetLight
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {isTargetLight ? 'Daylight' : 'Night'}
                  </span>
                </div>
                <span className={`text-[11px] font-medium ${isTargetLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {isTargetLight ? 'Crisp & vibrant high-contrast view' : 'Ultra-sleek dark developer contrast'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
