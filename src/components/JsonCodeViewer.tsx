import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  Sparkles, 
  Mail, 
  Terminal,
  Search,
  FileCode,
  Layers,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { portfolioData as defaultPortfolioData } from '../data/portfolioData';
import { PortfolioData, ThemeMode } from '../types';
import confetti from 'canvas-confetti';

interface JsonCodeViewerProps {
  portfolioData?: PortfolioData;
  onOpenProject: (projectId: string) => void;
  onOpenContact: () => void;
  onRunTerminalCommand: (cmd: string) => void;
  themeMode?: ThemeMode;
}

export const JsonCodeViewer: React.FC<JsonCodeViewerProps> = ({
  portfolioData = defaultPortfolioData,
  onOpenProject,
  onOpenContact,
  onRunTerminalCommand,
  themeMode = 'dark'
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = themeMode === 'dark';

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(portfolioData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Syntax highlighting classes based on theme
  const colors = isDark ? {
    bg: 'bg-[#0d0e13]',
    headerBg: 'bg-[#12141c]',
    headerBorder: 'border-[#1f2333]',
    text: 'text-[#d1d5db]',
    lineNum: 'text-slate-600',
    key: 'text-amber-400 font-medium',
    keySub: 'text-amber-300',
    string: 'text-emerald-400 font-normal',
    number: 'text-blue-400 font-bold',
    boolean: 'text-pink-400 font-bold',
    bracket1: 'text-amber-400 font-bold',
    bracket2: 'text-cyan-400 font-bold',
    bracket3: 'text-purple-400 font-bold',
    colon: 'text-slate-400 mr-2',
    comma: 'text-slate-500',
    comment: 'text-slate-500 italic',
    lineHover: 'hover:bg-slate-800/30'
  } : {
    bg: 'bg-[#ffffff]',
    headerBg: 'bg-[#f8fafc]',
    headerBorder: 'border-slate-200',
    text: 'text-slate-800',
    lineNum: 'text-slate-400',
    key: 'text-[#a16207] font-semibold',
    keySub: 'text-[#b45309]',
    string: 'text-[#15803d] font-normal',
    number: 'text-[#2563eb] font-bold',
    boolean: 'text-[#be185d] font-bold',
    bracket1: 'text-[#b45309] font-bold',
    bracket2: 'text-[#0284c7] font-bold',
    bracket3: 'text-[#7c3aed] font-bold',
    colon: 'text-slate-600 mr-2',
    comma: 'text-slate-400',
    comment: 'text-slate-500 italic',
    lineHover: 'hover:bg-amber-50/60'
  };

  return (
    <div className={`flex flex-col h-full font-mono text-xs sm:text-sm select-text transition-colors duration-200 ${colors.bg} ${colors.text}`}>
      {/* Editor Sub-Header / Tool Bar */}
      <div className={`flex items-center justify-between px-3 sm:px-4 py-2 border-b text-xs ${colors.headerBg} ${colors.headerBorder}`}>
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-amber-500" />
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>portfolio.json</span>
          <span className="hidden sm:inline text-slate-500">• Live Synchronized Data</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerConfetti();
              onOpenContact();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
            title="Open Contact / Send Email"
          >
            <Mail className="w-3.5 h-3.5 text-slate-950 stroke-[2.2]" />
            <span className="hidden sm:inline font-mono text-[11px]">Email</span>
          </button>

          <button
            onClick={handleCopyJson}
            className={`p-1.5 rounded-lg text-xs cursor-pointer border transition-colors ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/50' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
            }`}
            title={copied ? "Copied JSON" : "Copy full JSON code"}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Interactive JSON Code Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 leading-relaxed max-w-full">
        <div className="space-y-0.5 font-mono text-[11px] sm:text-xs md:text-sm w-full max-w-full">
          
          {/* Line 1 */}
          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>1.</span>
            <div className="flex items-center">
              <span className={colors.bracket1}>{'{'}</span>
              <span className={`ml-2 sm:ml-4 text-[10px] sm:text-xs ${colors.comment}`}>// Live Interactive Developer Profile</span>
            </div>
          </div>

          {/* SECTION: DEVELOPER - Bold & Prominent Heading */}
          <div id="json-developer" className={`flex items-center rounded py-1 w-full scroll-mt-4 ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>2.</span>
            <div className="flex items-center">
              <span className={`ml-2 sm:ml-4 text-sm sm:text-base font-extrabold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>"developer"</span>
              <span className={colors.colon}>:</span>
              <span className={colors.bracket2}>{'{'}</span>
            </div>
          </div>

          {/* Line 3: Name */}
          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>3.</span>
            <div className="flex items-center flex-wrap">
              <span className={`ml-4 sm:ml-8 ${colors.keySub}`}>"name"</span>
              <span className={colors.colon}>:</span>
              <span className={colors.string}>"{portfolioData.developer.name}"</span>
              <span className={colors.comma}>,</span>
            </div>
          </div>

          {/* Line 4: Role */}
          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>4.</span>
            <div className="flex items-center flex-wrap">
              <span className={`ml-4 sm:ml-8 ${colors.keySub}`}>"role"</span>
              <span className={colors.colon}>:</span>
              <span className={colors.string}>"{portfolioData.developer.role}"</span>
              <span className={colors.comma}>,</span>
            </div>
          </div>

          {/* Line 5: Email */}
          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>5.</span>
            <div className="flex items-center flex-wrap">
              <span className={`ml-4 sm:ml-8 ${colors.keySub}`}>"email"</span>
              <span className={colors.colon}>:</span>
              <a 
                href={`mailto:${portfolioData.developer.email}`}
                className={`underline cursor-pointer ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-700 hover:text-cyan-800'}`}
              >
                "{portfolioData.developer.email}"
              </a>
              <span className={colors.comma}>,</span>
            </div>
          </div>

          {/* Line 6: Location */}
          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>6.</span>
            <div className="flex items-center flex-wrap">
              <span className={`ml-4 sm:ml-8 ${colors.keySub}`}>"location"</span>
              <span className={colors.colon}>:</span>
              <span className={colors.string}>"{portfolioData.developer.location}"</span>
              <span className={colors.comma}>,</span>
            </div>
          </div>

          {/* Line 7: Years Of Exp */}
          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>7.</span>
            <div className="flex items-center flex-wrap">
              <span className={`ml-4 sm:ml-8 ${colors.keySub}`}>"yearsOfExperience"</span>
              <span className={colors.colon}>:</span>
              <span className={colors.number}>{portfolioData.developer.yearsOfExperience}</span>
              <span className={colors.comma}>,</span>
            </div>
          </div>

          {/* Line 8: Socials Block */}
          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>8.</span>
            <div className="flex items-center">
              <span className={`ml-4 sm:ml-8 ${colors.keySub}`}>"socials"</span>
              <span className={colors.colon}>:</span>
              <span className={colors.bracket3}>{'{'}</span>
            </div>
          </div>

          {Object.entries(portfolioData.developer.socials).map(([key, val], idx, arr) => (
            <div key={key} className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
              <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{9 + idx}.</span>
              <div className="flex items-center flex-wrap">
                <span className={`ml-6 sm:ml-12 ${colors.keySub}`}>"{key}"</span>
                <span className={colors.colon}>:</span>
                <a 
                  href={val} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 underline cursor-pointer truncate max-w-[280px] sm:max-w-md ${
                    isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-700 hover:text-cyan-800'
                  }`}
                >
                  "{val}"
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 ml-0.5" />
                </a>
                {idx < arr.length - 1 && <span className={colors.comma}>,</span>}
              </div>
            </div>
          ))}

          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{9 + Object.keys(portfolioData.developer.socials).length}.</span>
            <div className="flex items-center">
              <span className={`ml-4 sm:ml-8 ${colors.bracket3}`}>{'}'}</span>
            </div>
          </div>

          {/* Close developer */}
          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{10 + Object.keys(portfolioData.developer.socials).length}.</span>
            <div className="flex items-center">
              <span className={`ml-2 sm:ml-4 ${colors.bracket2}`}>{'}'}</span>
              <span className={colors.comma}>,</span>
            </div>
          </div>

          {/* SECTION: SKILLS - Bold & Prominent Heading */}
          <div id="json-skills" className={`flex items-center rounded py-1 w-full scroll-mt-4 ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{11 + Object.keys(portfolioData.developer.socials).length}.</span>
            <div className="flex items-center">
              <span className={`ml-2 sm:ml-4 text-sm sm:text-base font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>"skills"</span>
              <span className={colors.colon}>:</span>
              <span className={colors.bracket2}>{'['}</span>
            </div>
          </div>

          {portfolioData.skills.map((group, gIdx) => (
            <React.Fragment key={group.category}>
              <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
                <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{12 + Object.keys(portfolioData.developer.socials).length + gIdx * 2}.</span>
                <div className="flex items-center">
                  <span className={`ml-4 sm:ml-8 ${colors.bracket3}`}>{'{'}</span>
                  <span className={`ml-1.5 ${colors.keySub}`}>"category"</span>
                  <span className={colors.colon}>:</span>
                  <span className={colors.string}>"{group.category}"</span>
                  <span className={`${colors.comma} mr-2`}>,</span>
                  <span className={colors.keySub}>"skills"</span>
                  <span className={colors.colon}>:</span>
                  <span className={colors.bracket1}>{'['}</span>
                </div>
              </div>

              <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
                <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{13 + Object.keys(portfolioData.developer.socials).length + gIdx * 2}.</span>
                <div className="flex items-center flex-wrap gap-1 ml-6 sm:ml-12">
                  {group.skills.map((s, sIdx) => (
                    <span 
                      key={s.name} 
                      className={`inline-flex items-center gap-1 text-[10px] sm:text-xs px-1.5 py-0.5 rounded border ${
                        isDark 
                          ? 'bg-emerald-950/30 text-emerald-300 border-emerald-900/40' 
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      <span>"{s.name}"</span>
                      <span className="text-amber-500 font-bold">({s.level}%)</span>
                      {sIdx < group.skills.length - 1 && <span className={colors.comma}>,</span>}
                    </span>
                  ))}
                  <span className={colors.bracket1}>{']'}</span>
                  <span className={`ml-1 ${colors.bracket3}`}>{'}'}</span>
                  {gIdx < portfolioData.skills.length - 1 && <span className={colors.comma}>,</span>}
                </div>
              </div>
            </React.Fragment>
          ))}

          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{14 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2}.</span>
            <div className="flex items-center">
              <span className={`ml-2 sm:ml-4 ${colors.bracket2}`}>{']'}</span>
              <span className={colors.comma}>,</span>
            </div>
          </div>

          {/* SECTION: FEATURED PROJECTS - Bold & Prominent Heading */}
          <div id="json-projects" className={`flex items-center rounded py-1 w-full scroll-mt-4 ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{15 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2}.</span>
            <div className="flex items-center">
              <span className={`ml-2 sm:ml-4 text-sm sm:text-base font-extrabold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>"featuredProjects"</span>
              <span className={colors.colon}>:</span>
              <span className={colors.bracket2}>{'['}</span>
            </div>
          </div>

          {portfolioData.projects.map((proj, pIdx) => (
            <div key={proj.id} className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
              <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{16 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2 + pIdx}.</span>
              <div className="flex items-center flex-wrap gap-1.5">
                <span className={`ml-4 sm:ml-8 ${colors.bracket2}`}>{'{'}</span>
                <span className={colors.keySub}>"id"</span>
                <span className={colors.colon}>:</span>
                <span className={colors.string}>"{proj.id}"</span>
                <span className={`${colors.comma} mr-2`}>,</span>
                <span className={colors.keySub}>"title"</span>
                <span className={colors.colon}>:</span>
                <span className={colors.string}>"{proj.title}"</span>
                <span className={`${colors.comma} mr-2`}>,</span>
                
                <button
                  onClick={() => onOpenProject(proj.id)}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold cursor-pointer border ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-amber-500/20 text-amber-300 border-slate-700 hover:border-amber-500/40' 
                      : 'bg-white hover:bg-amber-100 text-amber-900 border-slate-300 hover:border-amber-400 shadow-xs'
                  }`}
                >
                  <Play className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                  <span>Inspect Architecture</span>
                </button>
              </div>
            </div>
          ))}

          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{17 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2 + portfolioData.projects.length}.</span>
            <div className="flex items-center">
              <span className={`ml-2 sm:ml-4 ${colors.bracket2}`}>{']'}</span>
              <span className={colors.comma}>,</span>
            </div>
          </div>

          {/* SECTION: EXPERIENCE - Bold & Prominent Heading */}
          <div id="json-experience" className={`flex items-center rounded py-1 w-full scroll-mt-4 ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{18 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2 + portfolioData.projects.length}.</span>
            <div className="flex items-center">
              <span className={`ml-2 sm:ml-4 text-sm sm:text-base font-extrabold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>"experience"</span>
              <span className={colors.colon}>:</span>
              <span className={colors.bracket2}>{'['}</span>
            </div>
          </div>

          {portfolioData.experiences.map((exp, eIdx) => (
            <div key={exp.company} className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
              <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{19 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2 + portfolioData.projects.length + eIdx}.</span>
              <div className="flex items-center flex-wrap">
                <span className={`ml-4 sm:ml-8 ${colors.bracket2}`}>{'{'}</span>
                <span className={`ml-1.5 ${colors.keySub}`}>"role"</span>
                <span className={colors.colon}>:</span>
                <span className={colors.string}>"{exp.role}"</span>
                <span className={`${colors.comma} mr-2`}>,</span>
                <span className={colors.keySub}>"company"</span>
                <span className={colors.colon}>:</span>
                <span className={colors.string}>"{exp.company}"</span>
                <span className={`ml-1.5 ${colors.bracket2}`}>{'}'}</span>
                {eIdx < portfolioData.experiences.length - 1 && <span className={colors.comma}>,</span>}
              </div>
            </div>
          ))}

          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{19 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2 + portfolioData.projects.length + portfolioData.experiences.length}.</span>
            <div className="flex items-center">
              <span className={`ml-2 sm:ml-4 ${colors.bracket2}`}>{']'}</span>
              <span className={colors.comma}>,</span>
            </div>
          </div>

          {/* SECTION: EDUCATION */}
          <div id="json-education" className={`flex items-center rounded py-1 w-full scroll-mt-4 ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{20 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2 + portfolioData.projects.length + portfolioData.experiences.length}.</span>
            <div className="flex items-center">
              <span className={`ml-2 sm:ml-4 text-sm sm:text-base font-extrabold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>"education"</span>
              <span className={colors.colon}>:</span>
              <span className={colors.bracket2}>{'['}</span>
            </div>
          </div>

          {portfolioData.education.map((edu, eduIdx) => (
            <div key={eduIdx} className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
              <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{21 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2 + portfolioData.projects.length + portfolioData.experiences.length + eduIdx}.</span>
              <div className="flex items-center flex-wrap">
                <span className={`ml-4 sm:ml-8 ${colors.bracket2}`}>{'{'}</span>
                <span className={`ml-1.5 ${colors.keySub}`}>"degree"</span>
                <span className={colors.colon}>:</span>
                <span className={colors.string}>"{edu.degree}"</span>
                <span className={`${colors.comma} mr-2`}>,</span>
                <span className={colors.keySub}>"institution"</span>
                <span className={colors.colon}>:</span>
                <span className={colors.string}>"{edu.institution}"</span>
                <span className={`ml-1.5 ${colors.bracket2}`}>{'}'}</span>
              </div>
            </div>
          ))}

          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{22 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2 + portfolioData.projects.length + portfolioData.experiences.length}.</span>
            <div className="flex items-center">
              <span className={`ml-2 sm:ml-4 ${colors.bracket2}`}>{']'}</span>
              <span className={colors.comma}>,</span>
            </div>
          </div>

          {/* Line End: Closing Brace */}
          <div className={`flex items-center rounded py-0.5 w-full ${colors.lineHover}`}>
            <span className={`w-7 sm:w-10 text-right pr-2 sm:pr-3 select-none text-[11px] shrink-0 ${colors.lineNum}`}>{23 + Object.keys(portfolioData.developer.socials).length + portfolioData.skills.length * 2 + portfolioData.projects.length + portfolioData.experiences.length}.</span>
            <div className="flex items-center">
              <span className={colors.bracket1}>{'}'}</span>
              <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse align-middle" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
