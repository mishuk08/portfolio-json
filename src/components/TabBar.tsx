import React from 'react';
import { 
  FileCode, 
  Terminal, 
  Briefcase, 
  Layers,
  X
} from 'lucide-react';
import { EditorTabId, ThemeMode } from '../types';

interface TabBarProps {
  activeTab: EditorTabId;
  setActiveTab: (tab: EditorTabId) => void;
  openTabs: EditorTabId[];
  closeTab: (tab: EditorTabId, e: React.MouseEvent) => void;
  themeMode?: ThemeMode;
}

interface TabDef {
  id: EditorTabId;
  index: number;
  label: string;
  icon: React.ReactNode;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  setActiveTab,
  openTabs,
  closeTab,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';

  const tabs: TabDef[] = [
    {
      id: 'portfolio.json',
      index: 1,
      label: 'Portfolio.json',
      icon: <span className="text-amber-500 font-bold text-xs">JSON</span>
    },
    {
      id: 'about.tsx',
      index: 2,
      label: 'About.tsx',
      icon: <FileCode className="w-3.5 h-3.5 text-cyan-500" />
    },
    {
      id: 'projects.ts',
      index: 3,
      label: 'Projects.ts',
      icon: <Layers className="w-3.5 h-3.5 text-blue-500" />
    },
    {
      id: 'skills.json',
      index: 4,
      label: 'Skills.json',
      icon: <span className="text-emerald-500 font-bold text-xs">Skills</span>
    },
    {
      id: 'experience.json',
      index: 5,
      label: 'Experience.json',
      icon: <Briefcase className="w-3.5 h-3.5 text-purple-500" />
    },
    {
      id: 'contact.sh',
      index: 6,
      label: 'Contact.sh',
      icon: <Terminal className="w-3.5 h-3.5 text-pink-500" />
    },
    {
      id: 'terminal',
      index: 7,
      label: 'Terminal',
      icon: <Terminal className="w-3.5 h-3.5 text-emerald-500" />
    }
  ];

  return (
    <div className={`flex items-center border-b overflow-x-auto select-none no-scrollbar transition-colors duration-200 ${
      isDark ? 'bg-[#090a0e] border-[#1b1d28]' : 'bg-slate-100 border-slate-200'
    }`}>
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isOpen = openTabs.includes(tab.id);

          if (!isOpen && !isActive) return null;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono border-r transition-all cursor-pointer ${
                isDark ? 'border-[#1b1d28]' : 'border-slate-200'
              } ${
                isActive
                  ? (isDark 
                      ? 'bg-[#0f1016] text-slate-100 font-semibold border-t-2 border-t-amber-400' 
                      : 'bg-white text-slate-900 font-semibold border-t-2 border-t-amber-500')
                  : (isDark 
                      ? 'bg-[#0a0b10] text-slate-400 hover:text-slate-200 hover:bg-[#12131b]' 
                      : 'bg-slate-100/70 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50')
              }`}
            >
              <span className={`text-[11px] font-mono ${
                isActive 
                  ? 'text-amber-500 font-bold' 
                  : (isDark ? 'text-slate-600' : 'text-slate-400')
              }`}>
                {tab.index}.
              </span>

              <span className="flex items-center justify-center">
                {tab.icon}
              </span>

              <span className="tracking-tight whitespace-nowrap">
                {tab.label}
              </span>

              {openTabs.length > 1 && (
                <span
                  onClick={(e) => closeTab(tab.id, e)}
                  className={`opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity ml-1 ${
                    isDark ? 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-300/60 text-slate-500 hover:text-slate-800'
                  }`}
                  title="Close tab"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
