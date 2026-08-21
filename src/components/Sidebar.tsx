import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  FileCode, 
  Layers, 
  Briefcase,
  Terminal,
  Github, 
  Linkedin, 
  Mail, 
  Zap,
  Hash,
  X
} from 'lucide-react';
import { EditorTabId, ThemeMode } from '../types';
import { portfolioData } from '../data/portfolioData';

interface SidebarProps {
  activeTab: EditorTabId;
  setActiveTab: (tab: EditorTabId) => void;
  openContact: () => void;
  onScrollToSection?: (sectionId: string) => void;
  themeMode?: ThemeMode;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openContact,
  onScrollToSection,
  themeMode = 'dark',
  onClose
}) => {
  const [srcFolderOpen, setSrcFolderOpen] = useState(true);
  const isDark = themeMode === 'dark';

  const handleSectionClick = (sectionId: string) => {
    setActiveTab('portfolio.json');
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  const sections = [
    { id: 'json-developer', label: 'developer (about)', icon: <Hash className="w-3 h-3 text-amber-500" /> },
    { id: 'json-skills', label: 'skills', icon: <Hash className="w-3 h-3 text-emerald-500" /> },
    { id: 'json-projects', label: 'featuredProjects', icon: <Hash className="w-3 h-3 text-blue-500" /> },
    { id: 'json-experience', label: 'experience', icon: <Hash className="w-3 h-3 text-purple-500" /> },
    { id: 'json-contact', label: 'quickActions', icon: <Hash className="w-3 h-3 text-pink-500" /> },
  ];

  return (
    <aside className={`w-full md:w-56 border-b md:border-b-0 md:border-r flex flex-col max-h-[70vh] md:max-h-full h-auto md:h-full select-none text-xs font-mono shrink-0 transition-all duration-300 shadow-lg md:shadow-none z-30 ${
      isDark ? 'bg-[#0f1016] border-[#1e2232]' : 'bg-slate-50 border-slate-200'
    }`}>
      {/* Optional Mobile Close header */}
      {onClose && (
        <div className="flex md:hidden items-center justify-end p-2 border-b border-slate-800/40">
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
            title="Close Explorer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* File Tree & Sections */}
      <div className="flex-1 overflow-y-auto py-2">
        <div>
          {/* src folder */}
          <button
            onClick={() => setSrcFolderOpen(!srcFolderOpen)}
            className={`w-full flex items-center gap-1.5 px-3 py-1 text-left transition-colors cursor-pointer ${
              isDark ? 'text-slate-300 hover:bg-slate-800/40' : 'text-slate-700 hover:bg-slate-200/60'
            }`}
          >
            {srcFolderOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            {srcFolderOpen ? <FolderOpen className="w-3.5 h-3.5 text-amber-500" /> : <Folder className="w-3.5 h-3.5 text-amber-500" />}
            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>src</span>
          </button>

          {srcFolderOpen && (
            <div className="pl-3 mt-0.5 space-y-0.5">
              {/* Portfolio.json */}
              <div>
                <button
                  onClick={() => {
                    setActiveTab('portfolio.json');
                    handleSectionClick('json-root');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-sm text-left transition-all cursor-pointer ${
                    activeTab === 'portfolio.json'
                      ? (isDark 
                          ? 'bg-amber-500/15 text-amber-300 font-semibold border-l-2 border-l-amber-400' 
                          : 'bg-amber-100 text-amber-900 font-semibold border-l-2 border-l-amber-500')
                      : (isDark 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50')
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-amber-500 font-bold text-xs">{}</span>
                    <span className="truncate font-semibold">Portfolio.json</span>
                  </div>
                  <span className={`text-[9px] px-1 py-0.2 rounded border ${
                    isDark 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    Main
                  </span>
                </button>

                {/* Sub-sections of JSON that smoothly scroll on click */}
                <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-700/30 ml-2">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleSectionClick(sec.id)}
                      className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left text-[11px] transition-colors cursor-pointer ${
                        isDark 
                          ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/30' 
                          : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                      }`}
                      title={`Jump to ${sec.label}`}
                    >
                      {sec.icon}
                      <span className="truncate">{sec.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terminal Item */}
              <button
                onClick={() => setActiveTab('terminal')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-sm text-left transition-all cursor-pointer mt-2 ${
                  activeTab === 'terminal'
                    ? (isDark 
                        ? 'bg-emerald-500/15 text-emerald-300 font-semibold border-l-2 border-l-emerald-400' 
                        : 'bg-emerald-100 text-emerald-900 font-semibold border-l-2 border-l-emerald-600')
                    : (isDark 
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50')
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="truncate">Terminal</span>
                </div>
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CLI
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className={`p-2.5 border-t ${isDark ? 'border-[#1b1e2c] bg-[#0c0d12]' : 'border-slate-200 bg-slate-100/70'}`}>
        <div className={`flex items-center justify-around ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <a
            href={portfolioData.developer.socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-1 rounded hover:text-amber-500 transition-colors"
            title="GitHub"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
          <a
            href={portfolioData.developer.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-1 rounded hover:text-amber-500 transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href={`mailto:${portfolioData.developer.email}`}
            className="p-1 rounded hover:text-amber-500 transition-colors"
            title="Email Mishuk"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
};

