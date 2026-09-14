import React, { useState } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  Sparkles, 
  Send, 
  Terminal as TerminalIcon, 
  Github, 
  Mail, 
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { portfolioData as defaultPortfolioData } from '../data/portfolioData';
import { PortfolioData, ThemeMode } from '../types';
import confetti from 'canvas-confetti';

interface CodeViewerProps {
  portfolioData?: PortfolioData;
  onOpenProject: (projectId: string) => void;
  onOpenContact: () => void;
  onRunTerminalCommand: (cmd: string) => void;
  themeMode?: ThemeMode;
}

// 1. About.tsx Viewer
export const AboutTsxViewer: React.FC<CodeViewerProps> = ({ 
  portfolioData = defaultPortfolioData, 
  onOpenContact, 
  onRunTerminalCommand, 
  themeMode = 'dark' 
}) => {
  const [copied, setCopied] = useState(false);
  const isDark = themeMode === 'dark';

  const handleCopy = () => {
    navigator.clipboard.writeText(`// About ${portfolioData.developer.name} - ${portfolioData.developer.role}
export const DeveloperProfile = {
  name: "${portfolioData.developer.name}",
  role: "${portfolioData.developer.role}",
  email: "${portfolioData.developer.email}",
  location: "${portfolioData.developer.location}",
  bio: ${JSON.stringify(portfolioData.developer.bio, null, 2)}
};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col h-full font-mono text-xs sm:text-sm leading-relaxed select-text overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-[#0d0e13] text-[#d1d5db]' : 'bg-[#ffffff] text-slate-800'
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b text-xs ${
        isDark ? 'bg-[#12141c] border-[#1f2333]' : 'bg-slate-100 border-slate-200'
      }`}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>About.tsx</span>
          <span className="text-slate-500">• React Component</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenContact}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30 hover:bg-amber-500/25 transition-all text-xs font-semibold cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Connect</span>
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs cursor-pointer border ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/50' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
            }`}
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="text-slate-500 italic">// About {portfolioData.developer.name} - {portfolioData.developer.role}</div>
        <div className="text-slate-500 italic">// Email: {portfolioData.developer.email}</div>
        <div className="h-2"></div>
        
        <div>
          <span className={isDark ? "text-purple-400 font-semibold" : "text-purple-700 font-semibold"}>import</span> <span className={isDark ? "text-amber-300" : "text-amber-700"}>React</span>, <span className={isDark ? "text-cyan-400" : "text-cyan-700"}>{'{'} useState, useEffect {'}'}</span> <span className={isDark ? "text-purple-400 font-semibold" : "text-purple-700 font-semibold"}>from</span> <span className={isDark ? "text-emerald-400" : "text-emerald-700"}>'react'</span>;
        </div>
        <div className="h-2"></div>

        <div>
          <span className={isDark ? "text-purple-400 font-semibold" : "text-purple-700 font-semibold"}>export const</span> <span className={isDark ? "text-yellow-300 font-bold" : "text-amber-800 font-bold"}>DeveloperProfile</span> = () =&gt; {'{'}
        </div>

        <div className="pl-4 space-y-1">
          <div>
            <span className={isDark ? "text-purple-400 font-semibold" : "text-purple-700 font-semibold"}>const</span> <span className={isDark ? "text-cyan-300" : "text-cyan-700"}>developer</span> = {'{'}
          </div>
          <div className="pl-4 space-y-0.5">
            <div><span className={isDark ? "text-amber-400" : "text-amber-700 font-medium"}>name</span>: <span className={isDark ? "text-emerald-400" : "text-emerald-700"}>"{portfolioData.developer.name}"</span>,</div>
            <div><span className={isDark ? "text-amber-400" : "text-amber-700 font-medium"}>role</span>: <span className={isDark ? "text-emerald-400" : "text-emerald-700"}>"{portfolioData.developer.role}"</span>,</div>
            <div><span className={isDark ? "text-amber-400" : "text-amber-700 font-medium"}>email</span>: <span className={isDark ? "text-emerald-400" : "text-emerald-700"}>"{portfolioData.developer.email}"</span>,</div>
            <div><span className={isDark ? "text-amber-400" : "text-amber-700 font-medium"}>location</span>: <span className={isDark ? "text-emerald-400" : "text-emerald-700"}>"{portfolioData.developer.location}"</span>,</div>
            <div><span className={isDark ? "text-amber-400" : "text-amber-700 font-medium"}>yearsOfExperience</span>: <span className="text-blue-500 font-bold">{portfolioData.developer.yearsOfExperience}</span></div>
          </div>
          <div>{'}'};</div>
          <div className="h-2"></div>

          <div className="text-slate-500 italic">// Developer Philosophy & Background</div>
          <div>
            <span className={isDark ? "text-purple-400 font-semibold" : "text-purple-700 font-semibold"}>const</span> <span className={isDark ? "text-cyan-300" : "text-cyan-700"}>statement</span> = <span className="text-emerald-500">`</span>
          </div>
          <div className="pl-4 font-mono text-xs leading-relaxed text-emerald-600">
            {portfolioData.developer.bio.map((line, i) => (
              <p key={i} className="my-1">&gt; {line}</p>
            ))}
          </div>
          <div><span className="text-emerald-500">`</span>;</div>
        </div>
        <div>{'}'};</div>
      </div>
    </div>
  );
};

// 2. Projects.ts Viewer
export const ProjectsTsViewer: React.FC<CodeViewerProps> = ({ 
  portfolioData = defaultPortfolioData, 
  onOpenProject, 
  onOpenContact, 
  themeMode = 'dark' 
}) => {
  const isDark = themeMode === 'dark';

  return (
    <div className={`flex flex-col h-full font-mono text-xs sm:text-sm select-text overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-[#0d0e13] text-[#d1d5db]' : 'bg-[#ffffff] text-slate-800'
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b text-xs ${
        isDark ? 'bg-[#12141c] border-[#1f2333]' : 'bg-slate-100 border-slate-200'
      }`}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Projects.ts</span>
          <span className="text-slate-500">• {portfolioData.projects.length} Total Projects</span>
        </span>
        <button
          onClick={onOpenContact}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30 text-xs cursor-pointer font-semibold"
        >
          <Sparkles className="w-3 h-3" />
          <span>Hire for Project</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-slate-500 italic">// Interactive Project Manifest</div>
        <div className="text-slate-500 italic">// Click 'inspect()' to view architecture & details</div>

        <div className="space-y-4">
          {portfolioData.projects.map((p, idx) => (
            <div 
              key={p.id} 
              className={`p-3.5 rounded-xl border transition-all ${
                isDark ? 'bg-[#12141c] border-[#22273d]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="font-bold text-amber-500">[{idx + 1}] {p.title}</span>
                <button
                  onClick={() => onOpenProject(p.id)}
                  className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs flex items-center gap-1 hover:bg-blue-500/30 transition-all cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5 fill-blue-400" />
                  <span>inspect('{p.id}')</span>
                </button>
              </div>

              <div className="text-xs space-y-1 text-slate-400 pl-2">
                <div><span className="text-cyan-400">category</span>: "{p.category}"</div>
                <div><span className="text-cyan-400">metrics</span>: "{p.metrics || 'Production'}"</div>
                <div><span className="text-cyan-400">stack</span>: [{p.tags.map(t => `"${t}"`).join(', ')}]</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Skills.json Viewer
export const SkillsJsonViewer: React.FC<CodeViewerProps> = ({ 
  portfolioData = defaultPortfolioData, 
  themeMode = 'dark' 
}) => {
  const isDark = themeMode === 'dark';

  return (
    <div className={`flex flex-col h-full font-mono text-xs sm:text-sm select-text overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-[#0d0e13] text-[#d1d5db]' : 'bg-[#ffffff] text-slate-800'
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b text-xs ${
        isDark ? 'bg-[#12141c] border-[#1f2333]' : 'bg-slate-100 border-slate-200'
      }`}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>skills.json</span>
          <span className="text-slate-500">• Technical Arsenal</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <pre className="text-xs leading-relaxed text-emerald-400">
          {JSON.stringify({ skills: portfolioData.skills }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// 4. Experience.json Viewer
export const ExperienceJsonViewer: React.FC<CodeViewerProps> = ({ 
  portfolioData = defaultPortfolioData, 
  themeMode = 'dark' 
}) => {
  const isDark = themeMode === 'dark';

  return (
    <div className={`flex flex-col h-full font-mono text-xs sm:text-sm select-text overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-[#0d0e13] text-[#d1d5db]' : 'bg-[#ffffff] text-slate-800'
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b text-xs ${
        isDark ? 'bg-[#12141c] border-[#1f2333]' : 'bg-slate-100 border-slate-200'
      }`}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>experience.json</span>
          <span className="text-slate-500">• Career Timeline</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <pre className="text-xs leading-relaxed text-purple-400">
          {JSON.stringify({ experiences: portfolioData.experiences, education: portfolioData.education }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// 5. Contact.sh Viewer
export const ContactShViewer: React.FC<CodeViewerProps> = ({ 
  portfolioData = defaultPortfolioData, 
  onOpenContact, 
  onRunTerminalCommand, 
  themeMode = 'dark' 
}) => {
  const isDark = themeMode === 'dark';

  return (
    <div className={`flex flex-col h-full font-mono text-xs sm:text-sm select-text overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-[#0d0e13] text-[#d1d5db]' : 'bg-[#ffffff] text-slate-800'
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b text-xs ${
        isDark ? 'bg-[#12141c] border-[#1f2333]' : 'bg-slate-100 border-slate-200'
      }`}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>contact.sh</span>
          <span className="text-slate-500">• Bash Script</span>
        </span>
        <button
          onClick={() => onRunTerminalCommand('contact')}
          className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-amber-400 transition-all"
        >
          <Play className="w-3 h-3 fill-slate-950" />
          <span>Execute Script</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
        <div className="text-slate-500">#!/usr/bin/env bash</div>
        <div className="text-slate-500"># Fast Developer Contact & Outreach Utility</div>
        <div className="h-1"></div>

        <div><span className="text-purple-400">DEVELOPER_NAME</span>=<span className="text-emerald-400">"{portfolioData.developer.name}"</span></div>
        <div><span className="text-purple-400">EMAIL</span>=<span className="text-emerald-400">"{portfolioData.developer.email}"</span></div>
        <div><span className="text-purple-400">WHATSAPP</span>=<span className="text-emerald-400">"{portfolioData.developer.socials.whatsapp}"</span></div>
        <div><span className="text-purple-400">LOCATION</span>=<span className="text-emerald-400">"{portfolioData.developer.location}"</span></div>
        <div className="h-1"></div>

        <div className="text-cyan-400">echo "Initializing outreach to $DEVELOPER_NAME..."</div>
        <div className="text-cyan-400">curl -s -X POST https://api.mishuk.dev/contact \</div>
        <div className="pl-4 text-emerald-400">-H "Content-Type: application/json" \</div>
        <div className="pl-4 text-emerald-400">-d '{"{"}"email": "your-email@domain.com", "msg": "Let\'s collaborate"{"}"}'</div>
      </div>
    </div>
  );
};
