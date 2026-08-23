import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Terminal, Code2, Cpu, Check, MapPin, ShieldCheck, Zap } from 'lucide-react';
import { ThemeMode } from '../types';
import avatarImg from '../assets/avatar.png';

interface OpeningAnimationProps {
  onFinish: () => void;
  themeMode?: ThemeMode;
  avatarUrl?: string;
  developerName?: string;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  onFinish,
  themeMode = 'dark',
  avatarUrl,
  developerName = 'Mishuk Babu Shoukhin'
}) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [imgFallbackIndex, setImgFallbackIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const hasFinishedRef = useRef(false);

  const avatarCandidates = [
    avatarUrl,
    avatarImg,
    '/avatar.png',
    '/avatar.jpg',
    '/user_photo.jpg'
  ].filter(Boolean) as string[];
  const currentAvatar = avatarUrl || avatarCandidates[imgFallbackIndex] || avatarImg || '/avatar.png';

  const logs = [
    { text: 'Mounting Developer Environment & Core Modules...', tag: 'CORE' },
    { text: 'Loading Portfolio Architecture & Live Data Bindings...', tag: 'DATA' },
    { text: 'Connecting Rangpur, Bangladesh Network Nodes...', tag: 'GEO' },
    { text: 'Synchronizing Dual GUI & Code IDE Viewports...', tag: 'SYNC' },
    { text: 'Workspace Initialized. Ready for Mishuk Babu!', tag: 'READY' }
  ];

  const handleImgError = () => {
    if (imgFallbackIndex < avatarCandidates.length - 1) {
      setImgFallbackIndex(prev => prev + 1);
    } else {
      setImgError(true);
    }
  };

  const finishAnimation = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish();
    }, 280);
  };

  useEffect(() => {
    let isReadyOnDevice = false;

    // Fast device readiness check: fonts, DOM, and instant image preloading
    const checkReadiness = async () => {
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
        const img = new Image();
        img.src = currentAvatar;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 400);
        });
      } catch {
        // Continue safely
      }
      isReadyOnDevice = true;
    };

    checkReadiness();

    const totalDuration = 1450; // 1.45s ultra-crisp opening
    const startTime = performance.now();
    let animationFrameId: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      const rawProgress = Math.min(1, elapsed / totalDuration);
      
      // Smooth high-refresh rate eased progress
      const easedProgress = easeOutCubic(rawProgress) * 100;
      
      let finalProgress = easedProgress;
      if (rawProgress > 0.9 && !isReadyOnDevice && elapsed < 2200) {
        finalProgress = 90;
      }

      const clampedPct = Math.min(100, Math.round(finalProgress));
      setProgress(clampedPct);

      if (clampedPct < 22) setLogIndex(0);
      else if (clampedPct < 48) setLogIndex(1);
      else if (clampedPct < 72) setLogIndex(2);
      else if (clampedPct < 94) setLogIndex(3);
      else setLogIndex(4);

      if (rawProgress >= 1 || (clampedPct >= 100 && isReadyOnDevice)) {
        finishAnimation();
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        finishAnimation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentAvatar, onFinish]);

  const isDark = themeMode === 'dark';

  return (
    <div
      onClick={finishAnimation}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      } ${
        isDark ? 'bg-[#08090d] text-slate-100' : 'bg-[#f4f6fa] text-slate-900'
      }`}
    >
      {/* Ambient background glow & tech grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-[110px] opacity-30 ${
          isDark ? 'bg-amber-500' : 'bg-amber-300'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[110px] opacity-25 ${
          isDark ? 'bg-cyan-500' : 'bg-cyan-300'
        }`} />
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        
        {/* Top Status Pill */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-6 border backdrop-blur-md ${
          isDark ? 'bg-slate-900/90 border-amber-500/30 text-amber-400' : 'bg-white/90 border-amber-300 text-amber-800 shadow-xs'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">Loading Device Environment</span>
        </div>

        {/* Permanent Photo with High-Tech Biometric Circular Ring */}
        <div className="relative mb-5 group">
          {/* Circular SVG Progress Ring */}
          <svg className="w-32 h-32 sm:w-36 sm:h-36 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className={`stroke-current fill-none ${isDark ? 'text-slate-800' : 'text-slate-200'}`}
              strokeWidth="4"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-current text-amber-500 fill-none transition-all duration-75"
              strokeWidth="4"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* Centered Photo Container */}
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <div className={`w-full h-full rounded-full p-1 border-2 overflow-hidden flex items-center justify-center shadow-xl ${
              isDark 
                ? 'bg-[#0f1118] border-amber-500/50 shadow-amber-500/20' 
                : 'bg-white border-amber-400 shadow-amber-300/30'
            }`}>
              {!imgError ? (
                <img
                  src={currentAvatar}
                  alt={developerName}
                  onError={handleImgError}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black text-xl">
                  MB
                </div>
              )}
            </div>
          </div>

          {/* Floating verified badge */}
          <div className="absolute bottom-1 right-1 p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-md border-2 border-white dark:border-[#08090d]">
            <Sparkles className="w-3 h-3 fill-slate-950" />
          </div>
        </div>

        {/* Developer Identification */}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-1 font-sans">
          {developerName}
        </h1>
        
        <div className="flex items-center gap-2 text-xs font-mono mb-2">
          <span className="text-amber-500 font-semibold">&lt;Web & Software Developer /&gt;</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-6">
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Rangpur, Bangladesh</span>
        </div>

        {/* Terminal Log Console */}
        <div className={`w-full rounded-xl p-3 text-left font-mono text-[11px] border mb-4 backdrop-blur-md ${
          isDark ? 'bg-[#0e1017]/85 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-700 shadow-xs'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-700/40 pb-1.5 mb-2 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-amber-500" />
              <span>SYSTEM_BOOT</span>
            </span>
            <span className="text-amber-500 font-bold">{progress}%</span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              {logs[logIndex].tag}
            </span>
            <span className="truncate text-slate-300">{logs[logIndex].text}</span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className={`h-1.5 w-full rounded-full overflow-hidden ${
          isDark ? 'bg-slate-800' : 'bg-slate-200'
        }`}>
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-400 transition-all duration-75 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Quick entry hint */}
        <p className="text-[11px] font-mono text-slate-500 mt-4 tracking-tight">
          Click anywhere or press Enter to launch
        </p>

      </div>
    </div>
  );
};
