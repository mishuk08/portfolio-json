import React, { useEffect, useState } from 'react';
import { ViewMode, ThemeMode } from '../types';

interface ModeTransitionOverlayProps {
  targetMode: ViewMode;
  themeMode: ThemeMode;
  onComplete: () => void;
}

export const ModeTransitionOverlay: React.FC<ModeTransitionOverlayProps> = ({
  targetMode,
  themeMode,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const isDark = themeMode === 'dark';

  const isSwitchingToGui = targetMode === 'preview';

  useEffect(() => {
    const duration = 1400; // 1.4s animation
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentPct);

      if (currentPct >= 100) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 250);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  // SVG Circular progress math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none transition-opacity duration-250 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${
        isDark 
          ? 'bg-[#0a0b0f] text-slate-100' 
          : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-15 ${
          isDark ? 'bg-amber-500' : 'bg-amber-300'
        }`} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Circular Progress Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            {/* Background track circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className={isDark ? 'text-slate-800' : 'text-slate-200'}
            />
            {/* Animated progress circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="url(#gradient-ring)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-75 ease-out"
            />
            <defs>
              <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Percentage Display */}
          <div className="absolute flex flex-col items-center justify-center font-mono">
            <span className="text-3xl font-extrabold tracking-tight">
              {progress}<span className="text-sm font-semibold text-amber-500">%</span>
            </span>
          </div>
        </div>

        {/* Mode Label */}
        <div className="text-center space-y-1">
          <p className="text-sm sm:text-base font-bold font-sans tracking-tight">
            {isSwitchingToGui ? 'Switching to GUI Mode' : 'Switching to JSON Mode'}
          </p>
          <p className="text-xs font-mono text-slate-500">
            {isSwitchingToGui ? 'Rendering Interactive Interface...' : 'Loading Schema & IDE Workspace...'}
          </p>
        </div>
      </div>
    </div>
  );
};
