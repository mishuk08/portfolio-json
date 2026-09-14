import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Maximize2, 
  Minimize2, 
  X, 
  Trash2,
  Send
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { ThemeMode } from '../types';
import confetti from 'canvas-confetti';

interface TerminalProps {
  onOpenProject: (projectId: string) => void;
  onOpenContact: () => void;
  initialCommand?: string;
  themeMode?: ThemeMode;
  isOverlay?: boolean;
  onClose?: () => void;
}

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
  time: string;
}

export const TerminalComponent: React.FC<TerminalProps> = ({
  onOpenProject,
  onOpenContact,
  initialCommand,
  themeMode = 'dark',
  isOverlay = false,
  onClose
}) => {
  const [input, setInput] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isDark = themeMode === 'dark';

  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'welcome',
      output: (
        <div className="space-y-1 text-xs font-mono">
          <p className="text-emerald-500 font-bold">
            🚀 Mishuk Babu Shoukhin - Developer Terminal v2.4.0
          </p>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            Type <span className="text-amber-500 font-bold">help</span> to view commands, or <span className="text-amber-500 font-bold">hire</span> to collaborate.
          </p>
        </div>
      ),
      time: new Date().toLocaleTimeString()
    }
  ]);

  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedCommands, setSavedCommands] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (initialCommand) {
      executeCommand(initialCommand);
    }
  }, [initialCommand]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setSavedCommands(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    let outputNode: React.ReactNode = null;

    switch (mainCmd) {
      case 'help':
        outputNode = (
          <div className="space-y-1 text-xs">
            <p className="text-amber-500 font-bold">Available Commands:</p>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <div><span className="text-cyan-500 font-semibold">whoami / about</span> - Developer overview & bio</div>
              <div><span className="text-cyan-500 font-semibold">skills</span> - List all tech competencies</div>
              <div><span className="text-cyan-500 font-semibold">projects</span> - Display featured software projects</div>
              <div><span className="text-cyan-500 font-semibold">contact</span> - Show email, location & social handles</div>
              <div><span className="text-cyan-500 font-semibold">hire</span> - Trigger direct hiring prompt</div>
              <div><span className="text-cyan-500 font-semibold">cat &lt;file&gt;</span> - View file (e.g., Portfolio.json)</div>
              <div><span className="text-cyan-500 font-semibold">clear</span> - Clear terminal window</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
      case 'about':
        outputNode = (
          <div className={`space-y-1.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <p className="text-amber-500 font-bold text-sm">{portfolioData.developer.name}</p>
            <p className="text-cyan-500 font-semibold">{portfolioData.developer.role} • {portfolioData.developer.location}</p>
            <p className="text-emerald-500 font-semibold">{portfolioData.developer.status}</p>
            <div className="pt-1 space-y-0.5">
              {portfolioData.developer.bio.map((b, i) => (
                <p key={i}>• {b}</p>
              ))}
            </div>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-2 text-xs">
            <p className="text-emerald-500 font-bold">Tech Stack & Competencies:</p>
            {portfolioData.skills.map(group => (
              <div key={group.category} className="space-y-0.5">
                <span className="text-amber-500 font-semibold">{group.category}:</span>
                <p className={`pl-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {group.skills.map(s => `${s.name} (${s.level}%)`).join(' • ')}
                </p>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        outputNode = (
          <div className="space-y-2 text-xs">
            <p className="text-blue-500 font-bold">Featured Projects:</p>
            {portfolioData.projects.map(p => (
              <div key={p.id} className={`p-2 rounded border flex items-center justify-between gap-2 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div>
                  <span className="text-amber-500 font-semibold">{p.title}</span>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{p.tagline}</p>
                  <p className="text-cyan-600 text-[10px]">[{p.tags.join(', ')}]</p>
                </div>
                <button
                  onClick={() => onOpenProject(p.id)}
                  className="px-2 py-1 bg-amber-500/20 text-amber-500 border border-amber-500/40 rounded hover:bg-amber-500/30 text-[11px] font-semibold cursor-pointer shrink-0"
                >
                  Launch
                </button>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className={`space-y-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <p className="text-emerald-500 font-bold">Direct Contact Channels:</p>
            <p>📧 Email: <a href="mailto:mdmishukbabu192@gmail.com" className="text-amber-500 underline">mdmishukbabu192@gmail.com</a></p>
            <p>📍 Location: {portfolioData.developer.location}</p>
            <p>💬 WhatsApp: <a href={portfolioData.developer.socials.whatsapp} target="_blank" rel="noreferrer" className="text-cyan-500 underline">Message on WhatsApp</a></p>
            <div className="pt-2">
              <button
                onClick={onOpenContact}
                className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Open Message Form
              </button>
            </div>
          </div>
        );
        break;

      case 'hire':
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        outputNode = (
          <div className={`p-3 rounded text-xs space-y-2 border ${
            isDark ? 'bg-amber-950/40 border-amber-600/40 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <p className="font-bold text-sm text-amber-500">🎉 Let's Build Something Exceptional Together!</p>
            <p>Mishuk is available for immediate hire, full-time remote roles, and high-impact software development.</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={onOpenContact}
                className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400 cursor-pointer"
              >
                Send Message
              </button>
              <a
                href="mailto:mdmishukbabu192@gmail.com"
                className={`px-3 py-1 rounded border ${
                  isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Direct Email
              </a>
            </div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'cat':
        if (arg.toLowerCase().includes('portfolio')) {
          outputNode = (
            <pre className={`text-[11px] max-h-60 overflow-y-auto p-2 rounded ${
              isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-800'
            }`}>
              {JSON.stringify(portfolioData, null, 2)}
            </pre>
          );
        } else {
          outputNode = <span className="text-red-500">File not found: {arg || 'filename missing'}</span>;
        }
        break;

      default:
        outputNode = (
          <span className="text-red-500">
            command not found: {trimmed}. Type <span className="text-amber-500 font-bold">help</span> for a list of available commands.
          </span>
        );
        break;
    }

    setHistory(prev => [
      ...prev,
      {
        command: trimmed,
        output: outputNode,
        time: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (savedCommands.length > 0) {
        const nextIdx = historyIndex + 1 < savedCommands.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInput(savedCommands[savedCommands.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(savedCommands[savedCommands.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className={`flex flex-col font-mono text-xs sm:text-sm select-text overflow-hidden transition-colors duration-200 ${
        isFullScreen 
          ? 'fixed inset-0 z-50 shadow-2xl' 
          : isOverlay 
            ? 'h-80 sm:h-96 md:h-[420px] w-full border-t shadow-2xl' 
            : 'h-full w-full'
      } ${
        isDark ? 'bg-[#08090d] text-slate-200 border-[#23273c]' : 'bg-[#f8fafc] text-slate-800 border-slate-300'
      }`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Title Bar with Fullscreen and Close Controls */}
      <div className={`flex items-center justify-between px-3 sm:px-4 py-2 border-b text-xs shrink-0 select-none ${
        isDark ? 'bg-[#0f1016] border-[#1b1e2c]' : 'bg-slate-100 border-slate-200'
      }`}>
        <span className="flex items-center gap-1.5 truncate">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className={`font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            mishuk@terminal:~ {isFullScreen ? '(fullscreen)' : ''}
          </span>
        </span>

        {/* Controls: Clear, Fullscreen Toggle, Close */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={() => executeCommand('clear')}
            className={`px-2 py-0.5 rounded text-[11px] cursor-pointer border flex items-center gap-1 ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title="Clear Terminal logs"
          >
            <Trash2 className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`p-1 sm:px-2 sm:py-0.5 rounded text-[11px] cursor-pointer border flex items-center gap-1 ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullScreen ? <Minimize2 className="w-3 h-3 text-amber-400" /> : <Maximize2 className="w-3 h-3 text-cyan-400" />}
            <span className="hidden sm:inline">{isFullScreen ? 'Exit Full' : 'Full Screen'}</span>
          </button>

          {/* Close Button (Kete deouar button) */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-[11px] cursor-pointer bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 transition-colors"
              title="Close Terminal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal logs area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="text-emerald-500 font-bold">mishuk@portfolio</span>
              <span>:</span>
              <span className="text-cyan-500 font-semibold">~</span>
              <span className="text-amber-500 font-bold">$</span>
              <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.command}</span>
              <span className="text-[10px] ml-auto opacity-70">{item.time}</span>
            </div>
            <div className="pl-3 sm:pl-4">{item.output}</div>
          </div>
        ))}

        {/* Current Prompt line */}
        <div className="flex items-center gap-2 text-xs pt-1">
          <span className="text-emerald-500 font-bold shrink-0">mishuk@portfolio</span>
          <span className={`shrink-0 ${isDark ? "text-slate-600" : "text-slate-400"}`}>:</span>
          <span className="text-cyan-500 font-semibold shrink-0">~</span>
          <span className="text-amber-500 font-bold shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 min-w-[50px] bg-transparent focus:outline-none font-mono text-xs ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
            placeholder="Type 'help', 'hire', 'projects'..."
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

