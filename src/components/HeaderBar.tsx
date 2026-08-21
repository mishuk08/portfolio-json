import React from 'react';
import { 
  Folder, 
  FolderOpen, 
  Download, 
  Code2, 
  Layout, 
  Terminal, 
  Sun,
  Moon
} from 'lucide-react';
import { ViewMode, ThemeMode } from '../types';

interface HeaderBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  openContact: () => void;
  handleExportJson: () => void;
  activeFileName: string;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  onOpenTerminal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  viewMode,
  setViewMode,
  isSidebarOpen,
  setIsSidebarOpen,
  handleExportJson,
  activeFileName,
  themeMode,
  toggleThemeMode,
  onOpenTerminal
}) => {
  const toggleViewMode = () => {
    setViewMode(viewMode === 'preview' ? 'editor' : 'preview');
  };

  const isDark = themeMode === 'dark';

  return (
    <header className={`border-b select-none sticky top-0 z-30 transition-colors duration-200 w-full max-w-full overflow-hidden ${
      isDark 
        ? 'bg-[#121318] border-[#232634] text-slate-300' 
        : 'bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
    }`}>
      {/* Top macOS-style window header */}
      <div className={`flex items-center justify-between px-2.5 sm:px-4 py-2 border-b transition-colors duration-200 gap-2 w-full max-w-full ${
        isDark ? 'border-[#1b1d27]' : 'border-slate-200'
      }`}>
        {/* Left: Window controls & Name with distance */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Smaller macOS Window Control Dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-[#dc2626]/50 inline-block transition-transform hover:scale-125 cursor-pointer shadow-xs" title="Close" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-[#d97706]/50 inline-block transition-transform hover:scale-125 cursor-pointer shadow-xs" title="Minimize" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] border border-[#059669]/50 inline-block transition-transform hover:scale-125 cursor-pointer shadow-xs" title="Maximize" />
          </div>

          {/* Name: Bigger, bolder, separated from icons */}
          <div className="flex items-center ml-2 sm:ml-4 min-w-0">
            <span className={`font-mono font-extrabold text-sm sm:text-base md:text-lg tracking-tight truncate ${
              isDark ? 'text-slate-100' : 'text-slate-950 font-black'
            }`}>
              Mishuk Babu Shoukhin
            </span>
          </div>
        </div>

        {/* Right: Terminal button (JSON mode only), Light/Dark Switch, and Single GUI/JSON Switch button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Terminal Toggle Button (Shown only in JSON / Code mode) */}
          {viewMode === 'editor' && (
            <button
              onClick={onOpenTerminal}
              className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeFileName === 'terminal'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                  : (isDark
                      ? 'bg-slate-800/80 border-slate-700/70 text-emerald-400 hover:bg-slate-700 hover:text-emerald-300'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100')
              }`}
              title="Open Interactive Terminal"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Terminal</span>
            </button>
          )}

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleThemeMode}
            className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
              isDark
                ? 'bg-slate-800/80 border-slate-700/70 text-amber-300 hover:bg-slate-700 hover:text-amber-200'
                : 'bg-amber-100/80 border-amber-300 text-amber-900 hover:bg-amber-200'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline text-[11px] font-mono">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-800" />
                <span className="hidden md:inline text-[11px] font-mono">Dark</span>
              </>
            )}
          </button>

          {/* SINGLE GUI / JSON Mode Switch Button */}
          <button
            onClick={toggleViewMode}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 transition-all shadow-sm cursor-pointer active:scale-95"
            title={viewMode === 'preview' ? 'Switch to JSON / Code Mode' : 'Switch to GUI / Live Mode'}
          >
            {viewMode === 'preview' ? (
              <>
                <Code2 className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                <span className="font-sans font-extrabold whitespace-nowrap">JSON Mode</span>
              </>
            ) : (
              <>
                <Layout className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                <span className="font-sans font-extrabold whitespace-nowrap">GUI Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-header Toolbar: Shown in Editor/JSON mode for File explorer and Export */}
      {viewMode === 'editor' && (
        <div className={`flex items-center justify-between px-2.5 sm:px-4 py-1 text-xs font-mono gap-2 transition-colors duration-200 max-w-full overflow-hidden ${
          isDark ? 'bg-[#0e0f14]' : 'bg-white border-b border-slate-200'
        }`}>
          <div className="flex items-center gap-1 sm:gap-2 truncate">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                isSidebarOpen 
                  ? (isDark ? 'text-amber-400 bg-amber-500/10' : 'text-amber-700 bg-amber-100') 
                  : (isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
              }`}
              title="Toggle File Explorer"
            >
              {isSidebarOpen ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px]">Files</span>
            </button>

            <button
              onClick={handleExportJson}
              className={`p-1 sm:px-2 sm:py-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px] shrink-0 ${
                isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Download Portfolio.json"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            <span>JSON IDE Mode</span>
          </div>
        </div>
      )}
    </header>
  );
};
