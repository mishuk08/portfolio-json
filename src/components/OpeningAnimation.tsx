import React, { useEffect, useState } from 'react';
import { Sparkles, Terminal, Code2, Cpu, Check } from 'lucide-react';
import { ThemeMode } from '../types';

interface OpeningAnimationProps {
  onFinish: () => void;
  themeMode?: ThemeMode;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  onFinish,
  themeMode = 'dark'
}) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const steps = [
    { text: 'Booting developer environment...', icon: Terminal },
    { text: 'Loading portfolio data schema...', icon: Code2 },
    { text: 'Configuring interactive modules...', icon: Cpu },
    { text: 'Portfolio Ready!', icon: Check }
  ];

  useEffect(() => {
    const duration = 1600; // 1.6s
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentPct);

      if (currentPct < 30) {
        setStepIndex(0);
      } else if (currentPct < 65) {
        setStepIndex(1);
      } else if (currentPct < 90) {
        setStepIndex(2);
      } else {
        setStepIndex(3);
      }

      if (currentPct >= 100) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onFinish();
        }, 350);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onFinish]);

  const isDark = themeMode === 'dark';

  return (
    <div
      onClick={() => {
        setIsFadingOut(true);
        setTimeout(onFinish, 200);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none transition-opacity duration-350 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${
        isDark 
          ? 'bg-[#0a0b0f] text-slate-100' 
          : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDark ? 'bg-amber-500' : 'bg-amber-300'
        }`} />
        <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDark ? 'bg-cyan-500' : 'bg-cyan-300'
        }`} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Developer Badge / Monogram */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-tr from-amber-500 via-yellow-400 to-cyan-500 shadow-2xl shadow-amber-500/30 flex items-center justify-center animate-pulse">
            <div className={`w-full h-full rounded-[22px] flex flex-col items-center justify-center font-extrabold ${
              isDark ? 'bg-[#0d0e14] text-amber-400' : 'bg-white text-amber-600 shadow-inner'
            }`}>
              <span className="text-2xl sm:text-3xl font-mono tracking-tight">MB</span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Dev</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0a0b0f] shadow-md">
            <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
          </div>
        </div>

        {/* Developer Name & Role */}
        <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight mb-1">
          Mishuk Babu Shoukhin
        </h1>
        <p className="text-xs sm:text-sm font-mono font-medium text-amber-500 mb-6 tracking-wide">
          &lt;Web & Software Developer /&gt;
        </p>

        {/* Dynamic Progress Bar */}
        <div className="w-64 sm:w-72 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-400">
              {React.createElement(steps[stepIndex].icon, { className: 'w-3.5 h-3.5 text-amber-500' })}
              <span className="truncate">{steps[stepIndex].text}</span>
            </div>
            <span className="font-bold text-amber-500">{progress}%</span>
          </div>

          {/* Bar track */}
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-400 transition-all duration-75 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tap to skip hint */}
        <p className="text-[11px] font-mono text-slate-500 mt-6 tracking-tight">
          Click anywhere to skip
        </p>
      </div>
    </div>
  );
};
