import React from 'react';
import { X, Palette, Type, Check, RefreshCw, Sun, Moon } from 'lucide-react';
import { EditorTheme } from '../types';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: EditorTheme;
  setTheme: (t: EditorTheme) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  showLineNumbers: boolean;
  setShowLineNumbers: (show: boolean) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  showLineNumbers,
  setShowLineNumbers
}) => {
  if (!isOpen) return null;

  const themes: { id: EditorTheme; name: string; desc: string; bg: string; accent: string }[] = [
    {
      id: 'dark-ide',
      name: 'Dark Obsidian (Default)',
      desc: 'Matches picture style with amber braces & emerald strings',
      bg: 'bg-[#0d0e13]',
      accent: 'bg-amber-400'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      desc: 'High contrast neon pink and cyan highlights',
      bg: 'bg-[#0b0813]',
      accent: 'bg-pink-500'
    },
    {
      id: 'tokyo-night',
      name: 'Tokyo Night',
      desc: 'Deep indigo with lavender and sky blue',
      bg: 'bg-[#1a1b26]',
      accent: 'bg-indigo-400'
    },
    {
      id: 'monokai',
      name: 'Monokai Pro',
      desc: 'Warm charcoal with yellow, magenta and mint',
      bg: 'bg-[#1e1e1e]',
      accent: 'bg-yellow-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#12141c] border-l border-[#202538] w-full max-w-sm h-full overflow-y-auto shadow-2xl text-slate-200 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#202538]">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-slate-100 text-sm">IDE Editor Settings</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Theme Selector */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              Color Theme
            </label>
            <div className="space-y-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    theme === t.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-slate-100'
                      : 'bg-[#0a0b10] border-[#1f2334] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${t.bg} border border-slate-700 flex items-center justify-center`}>
                      <span className={`w-2 h-2 rounded-full ${t.accent}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{t.name}</div>
                      <div className="text-[10px] text-slate-500">{t.desc}</div>
                    </div>
                  </div>
                  {theme === t.id && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>Font Size</span>
              <span className="text-amber-400 font-bold">{fontSize}px</span>
            </div>
            <input
              type="range"
              min={12}
              max={18}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Line Numbers Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#0a0b10] border border-[#1f2334] rounded-xl">
            <span className="text-xs font-mono text-slate-300">Show Line Numbers</span>
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) => setShowLineNumbers(e.target.checked)}
              className="accent-amber-400 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[#202538] text-center">
          <p className="text-[11px] font-mono text-slate-500">
            Portfolio v2.4.0 • Mishuk Babu Shoukhin
          </p>
        </div>
      </div>
    </div>
  );
};
