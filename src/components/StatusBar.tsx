import React from 'react';
import { GitBranch, CheckCircle2, Bell } from 'lucide-react';
import { EditorTabId, ThemeMode } from '../types';

interface StatusBarProps {
  activeTab: EditorTabId;
  openContact: () => void;
  themeMode?: ThemeMode;
}

export const StatusBar: React.FC<StatusBarProps> = ({ activeTab, openContact, themeMode = 'dark' }) => {
  const isDark = themeMode === 'dark';

  return (
    <footer className={`h-6 border-t text-[11px] font-mono flex items-center justify-between px-3 select-none z-20 transition-colors duration-200 ${
      isDark ? 'bg-[#090a0e] border-[#1b1d28] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
    }`}>
      {/* Left items */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1 cursor-pointer ${isDark ? 'text-slate-300 hover:text-amber-400' : 'text-slate-700 hover:text-amber-600'}`}>
          <GitBranch className="w-3 h-3 text-amber-500" />
          <span>main*</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Mishuk Babu Shoukhin • Web & Software Developer</span>
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-slate-500">UTF-8</span>
        
        <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
          isDark ? 'bg-slate-800 text-amber-300' : 'bg-amber-100 text-amber-900 border border-amber-200'
        }`}>
          {activeTab.endsWith('.json') ? 'JSON' : activeTab.endsWith('.tsx') ? 'TypeScript React' : activeTab.endsWith('.ts') ? 'TypeScript' : 'Shell'}
        </span>

        <button
          onClick={openContact}
          className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
        >
          <Bell className="w-3 h-3" />
          <span className="hidden sm:inline">Contact</span>
        </button>
      </div>
    </footer>
  );
};
