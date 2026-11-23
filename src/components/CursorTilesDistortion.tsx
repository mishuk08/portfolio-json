import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { initCursorTiles } from '../cursor-tiles/init';
import { ThemeMode } from '../types';

interface CursorTilesDistortionProps {
  className?: string;
  themeMode?: ThemeMode;
  showBadge?: boolean;
  showControls?: boolean;
  enableWheel?: boolean;
  images?: string[];
  opacity?: number;
  onSlideChange?: (index: number) => void;
}

/**
 * Exact 1:1 integration of Anton Bobrov's Three.js Cursor Tiles Distortion
 * (https://github.com/antonbobrov/threejs-cursor-tiles-distortion)
 *
 * Directly executes the original Three.js, TSL shaders, DoubleFBO flow simulation,
 * pointer dampening, and Snap slides.
 */
export const CursorTilesDistortion: React.FC<CursorTilesDistortionProps> = ({
  className = '',
  showBadge = true,
  showControls = true,
  enableWheel = true,
  images = ['/0.jpg', '/1.jpg', '/2.jpg'],
  opacity,
  onSlideChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ReturnType<typeof initCursorTiles> | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setIsSupported(false);
        return;
      }
    }

    try {
      const instance = initCursorTiles(container, {
        images,
        wheel: enableWheel,
        grabCursor: true,
        inspector: false,
        onSlideChange: (idx) => {
          setActiveSlide(idx);
          if (onSlideChange) onSlideChange(idx);
        },
      });

      instanceRef.current = instance;
    } catch (err) {
      console.warn('Three.js Cursor Tiles Distortion initialization fallback:', err);
      setIsSupported(false);
    }

    return () => {
      try {
        instanceRef.current?.destroy();
      } catch (e) {
        console.error('Error disposing CursorTilesDistortion:', e);
      }
      instanceRef.current = null;
    };
  }, [images, enableWheel, onSlideChange]);

  const handleNext = () => {
    try {
      instanceRef.current?.snap?.next();
    } catch {
      // fallback
    }
  };

  const handlePrev = () => {
    try {
      instanceRef.current?.snap?.prev();
    } catch {
      // fallback
    }
  };

  return (
    <div
      style={opacity !== undefined ? { opacity } : undefined}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
    >
      {/* Exact scene container for Anton Bobrov's WebGL canvas */}
      <div
        ref={containerRef}
        id="scene"
        className="scene absolute inset-0 w-full h-full overflow-hidden"
        style={{ touchAction: 'none' }}
      />

      {/* Fallback if WebGL/WebGPU is disabled */}
      {!isSupported && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 text-white p-6 text-center">
          <div>
            <p className="font-semibold text-amber-400">WebGL Acceleration Disabled</p>
            <p className="text-xs text-slate-300 mt-1">Reduced motion is preferred or WebGL is not supported.</p>
          </div>
        </div>
      )}

      {/* Original Interactive Slide Controls & Navigation */}
      {showControls && isSupported && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg text-xs font-mono text-white">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tile FX</span>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-200">
            Slide {activeSlide + 1} / {images.length}
          </span>
          <div className="flex items-center ml-1 space-x-1">
            <button
              onClick={handlePrev}
              title="Previous Slide"
              aria-label="Previous Slide"
              className="p-1 hover:bg-white/20 rounded transition text-slate-300 hover:text-white"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              title="Next Slide"
              aria-label="Next Slide"
              className="p-1 hover:bg-white/20 rounded transition text-slate-300 hover:text-white"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Original Attribution Badge from Anton Bobrov's Demo */}
      {showBadge && (
        <a
          href="https://github.com/antonbobrov/threejs-cursor-tiles-distortion"
          target="_blank"
          rel="noopener noreferrer"
          className="github absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 border border-slate-300 shadow-md backdrop-blur-md text-xs font-sans hover:bg-white transition hover:scale-105"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="w-4 h-4 fill-current">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          <span className="font-medium text-[11px] sm:text-xs">Original Three.js Demo on GitHub</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>
      )}
    </div>
  );
};
