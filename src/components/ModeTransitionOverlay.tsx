import React, { useEffect, useState, useRef } from 'react';
import { ViewMode, ThemeMode } from '../types';
import { Code2, Layout, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ModeTransitionOverlayProps {
  targetMode: ViewMode;
  themeMode: ThemeMode;
  onApplyMode: () => void;
  onComplete: () => void;
}

export const ModeTransitionOverlay: React.FC<ModeTransitionOverlayProps> = ({
  targetMode,
  themeMode,
  onApplyMode,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const modeAppliedRef = useRef(false);
  const isDark = themeMode === 'dark';

  const isSwitchingToGui = targetMode === 'preview';

  const onApplyModeRef = useRef(onApplyMode);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onApplyModeRef.current = onApplyMode;
    onCompleteRef.current = onComplete;
  }, [onApplyMode, onComplete]);

  useEffect(() => {
    const duration = 320; // Snappy 320ms 60fps monotonic progression
    const startTime = performance.now();
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progressRatio = Math.min(1, Math.max(0, elapsed / duration));
      
      // Smooth natural curve (ease-out cubic for responsive 0-100%)
      const eased = 1 - Math.pow(1 - progressRatio, 3);

      const currentPct = Math.min(100, Math.round(eased * 100));
      setProgress(currentPct);

      // Pre-apply mode behind the backdrop at 40% so DOM has fully painted the new view
      if (progressRatio >= 0.4 && !modeAppliedRef.current) {
        modeAppliedRef.current = true;
        onApplyModeRef.current();
      }

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setIsFadingOut(true);
        setTimeout(() => {
          onCompleteRef.current();
        }, 160);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Run once on mount: never restart halfway

  // SVG Circular progress math
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none backdrop-blur-md gpu-layer transition-opacity duration-150 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${
        isDark 
          ? 'bg-[#08090ee6] text-slate-100' 
          : 'bg-[#f8fafcf2] text-slate-900'
      }`}
    >
      {/* Background ambient radial glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[90px] opacity-30 gpu-layer ${
          isDark ? 'bg-amber-500' : 'bg-amber-300'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-[80px] opacity-25 gpu-layer ${
          isDark ? 'bg-cyan-500' : 'bg-cyan-300'
        }`} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        
        {/* Mode Icon Badge */}
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono mb-6 border shadow-sm transition-colors duration-150 backdrop-blur-md ${
          isDark ? 'bg-[#121522]/90 border-amber-500/30 text-amber-400' : 'bg-white/90 border-amber-300 text-amber-800'
        }`}>
          {isSwitchingToGui ? (
            <Layout className="w-4 h-4 text-amber-500" />
          ) : (
            <Code2 className="w-4 h-4 text-cyan-400" />
          )}
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            {isSwitchingToGui ? 'Interactive GUI View' : 'JSON IDE Environment'}
          </span>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 128 128">
            {/* Background track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="5.5"
              fill="transparent"
              className={isDark ? 'text-slate-800/80' : 'text-slate-200'}
            />
            {/* Animated progress circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="url(#mode-gradient-ring)"
              strokeWidth="5.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="mode-gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content Display */}
          <div className="absolute flex flex-col items-center justify-center font-mono">
            {progress < 100 ? (
              <span className="text-3xl font-extrabold tracking-tight font-sans">
                {progress}<span className="text-sm font-semibold text-amber-500 font-mono">%</span>
              </span>
            ) : (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="gpu-layer"
              >
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Status Text with Dynamic Description */}
        <div className="space-y-1">
          <p className="text-base font-bold font-sans tracking-tight">
            {isSwitchingToGui ? 'Rendering GUI Experience' : 'Compiling JSON Workspace'}
          </p>
          <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {progress < 40 
              ? 'Synchronizing state tree...' 
              : progress < 90 
              ? (isSwitchingToGui ? 'Mounting reactive UI components...' : 'Formatting syntax tree & tokens...') 
              : 'Switch complete!'}
          </p>
        </div>

      </div>
    </div>
  );
};
