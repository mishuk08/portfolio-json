import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  ExternalLink, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { ThemeMode } from '../types';

interface RangpurDivisionMapProps {
  themeMode?: ThemeMode;
}

export const RangpurDivisionMap: React.FC<RangpurDivisionMapProps> = ({
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';

  // Live Bangladesh (Rangpur) Standard Time (Asia/Dhaka / UTC+6)
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      const dateStr = now.toLocaleDateString('en-US', {
        timeZone: 'Asia/Dhaka',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`mt-8 rounded-3xl border overflow-hidden transition-all duration-300 backdrop-blur-2xl shadow-xl ${
      isDark
        ? 'bg-[#0f111c]/90 border-[#262c45]'
        : 'bg-white/95 border-slate-200 shadow-[0_16px_40px_rgba(245,158,11,0.06)]'
    }`}>
      {/* Full Google Map Container with Highlight Overlay */}
      <div className="relative w-full h-[380px] sm:h-[460px] overflow-hidden bg-slate-900">
        
        {/* Full Interactive Google Map covering Rangpur Division & City */}
        <iframe
          title="Rangpur City & Division Map"
          src="https://maps.google.com/maps?q=Rangpur%2C%20Bangladesh&t=&z=11&ie=UTF8&iwloc=&output=embed"
          className={`w-full h-full border-0 ${
            isDark ? 'contrast-[1.08] brightness-[0.88] invert-[0.9] hue-rotate-180' : ''
          }`}
          loading="lazy"
          allowFullScreen
        />

        {/* Floating Rangpur City Highlight Pin Badge */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className={`px-3.5 py-2 rounded-2xl border flex items-center gap-2.5 shadow-xl backdrop-blur-md transition-all ${
            isDark 
              ? 'bg-[#0b0d17]/90 border-amber-500/50 text-slate-100' 
              : 'bg-white/95 border-amber-400 text-slate-900'
          }`}>
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping absolute"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 relative"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-mono text-amber-500">RANGPUR CITY</span>
                <span className="text-[10px] opacity-75 font-sans font-medium">(রংপুর)</span>
              </div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium`}>
                Division Headquarters • Mishuk's Location
              </div>
            </div>
          </div>
        </div>

        {/* Top-Right: Open in Full Google Maps Action */}
        <div className="absolute top-4 right-4 z-10">
          <a
            href="https://www.google.com/maps/place/Rangpur,+Bangladesh/@25.7439,89.2752,12z"
            target="_blank"
            rel="noreferrer"
            className={`px-3 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all cursor-pointer ${
              isDark
                ? 'bg-[#0f111c]/90 hover:bg-[#191d30] border-slate-700 text-slate-200 hover:text-amber-400'
                : 'bg-white/95 hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-amber-600'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Open Google Maps</span>
          </a>
        </div>
      </div>

      {/* Live Rangpur Local Time Bar directly under Map */}
      <div className={`px-4 sm:px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isDark 
          ? 'bg-[#0c0e17] border-[#22283f]' 
          : 'bg-slate-50/90 border-slate-200'
      }`}>
        {/* Location Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Rangpur, Bangladesh
            </div>
            <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              25.7439° N, 89.2752° E
            </div>
          </div>
        </div>

        {/* Live Clock Component */}
        <div className={`px-4 py-2 rounded-2xl border flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start ${
          isDark 
            ? 'bg-[#151928] border-[#262e49]' 
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500 animate-spin [animation-duration:8s]" />
            <span className={`text-[11px] font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Rangpur Local Time:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-mono font-black text-amber-500 tracking-wider">
              {currentTime || '--:--:-- --'}
            </span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
              isDark 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              BST (UTC+6)
            </span>
          </div>
        </div>

        {/* Date Display */}
        <div className={`text-xs font-mono hidden md:block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {currentDate}
        </div>
      </div>
    </div>
  );
};
