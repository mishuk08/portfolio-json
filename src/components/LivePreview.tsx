import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  ExternalLink, 
  Github, 
  Mail, 
  Code2, 
  Layers, 
  CheckCircle, 
  Copy, 
  Check, 
  ArrowRight,
  ArrowUp,
  Zap,
  MapPin,
  GraduationCap,
  Briefcase,
  Bot,
  Download,
  Calendar,
  Award,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioData, ThemeMode } from '../types';
import { ElloChatWidget } from './ElloChatWidget';
import { RangpurDivisionMap } from './RangpurDivisionMap';
import { downloadDeveloperCv } from '../utils/cvDownload';
import avatar1Opt from '../assets/avatar_optimized.webp';
import avatar2Opt from '../assets/avatar2_optimized.webp';
import avatar1 from '../assets/drive_avatar_1.png';
import avatar2 from '../assets/drive_avatar_2.webp';
import confetti from 'canvas-confetti';
import { syncGoogleDrivePhotos, getCachedPhotos, DEFAULT_PHOTOS } from '../services/driveSync';

interface LivePreviewProps {
  portfolioData: PortfolioData;
  onOpenProject: (projectId: string) => void;
  onOpenContact: () => void;
  onOpenCvPreview?: () => void;
  onOpenEditor?: () => void;
  onExportJson?: () => void;
  themeMode?: ThemeMode;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  portfolioData,
  onOpenProject,
  onOpenContact,
  onOpenCvPreview,
  onOpenEditor,
  themeMode = 'dark'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isPhotoPaused, setIsPhotoPaused] = useState(false);
  const [syncedPhotos, setSyncedPhotos] = useState<string[]>(() => {
    const cached = getCachedPhotos();
    return cached.length > 0 ? cached : [
      avatar1 || '/drive_avatar_1.png',
      avatar2 || '/drive_avatar_2.webp'
    ];
  });

  // Dynamic Google Drive Folder Real-time Synchronizer
  useEffect(() => {
    let isMounted = true;

    const doSync = async () => {
      try {
        const latest = await syncGoogleDrivePhotos();
        if (isMounted && latest && latest.length > 0) {
          setSyncedPhotos(prev => {
            // Check if lists are different
            if (JSON.stringify(prev) !== JSON.stringify(latest)) {
              return latest;
            }
            return prev;
          });
        }
      } catch (err) {
        console.info('Drive sync background check completed');
      }
    };

    // Initial background sync
    doSync();

    // Auto sync on window focus (e.g. when user switches tabs after uploading to Drive)
    window.addEventListener('focus', doSync);

    // Periodic live sync every 45 seconds
    const syncInterval = setInterval(doSync, 45000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', doSync);
      clearInterval(syncInterval);
    };
  }, []);

  // Combined active photo playlist
  const photoList = (syncedPhotos.length > 0 ? syncedPhotos : DEFAULT_PHOTOS).filter(Boolean);

  // Preload photos in browser cache for instant instant-switch rendering
  useEffect(() => {
    photoList.forEach(url => {
      if (url && typeof window !== 'undefined') {
        const img = new Image();
        img.referrerPolicy = 'no-referrer';
        img.src = url;
      }
    });
  }, [photoList]);

  // Animated cyclic transition through Drive photos (each photo stays 8 seconds)
  useEffect(() => {
    if (photoList.length <= 1 || isPhotoPaused) return;
    const interval = setInterval(() => {
      setActivePhotoIdx((prev) => (prev + 1) % photoList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [photoList.length, isPhotoPaused]);

  // Guarantee the page starts at the very top on load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const isDark = themeMode === 'dark';
  const categories = ['All', 'Full-Stack', 'Frontend', 'Backend', 'AI & Tools'];

  const filteredProjects = selectedCategory === 'All'
    ? portfolioData.projects
    : portfolioData.projects.filter(p => p.category === selectedCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    setScrollProgress(progress);
    setShowScrollTop(scrollTop > 260);

    const sections = ['about', 'skills', 'experience', 'education', 'projects', 'ello', 'contact'];
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(`section-${sections[i]}`);
      if (el) {
        const top = el.offsetTop - 220;
        if (scrollTop >= top) {
          setActiveSection(sections[i]);
          break;
        }
      }
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Glassmorphism styling classes - enhanced transparency and crystal glass look
  const glassCardClass = isDark
    ? 'backdrop-blur-2xl bg-[#0d101e]/45 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.28)] hover:border-amber-500/50 hover:bg-[#141829]/60 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)] transition-all duration-300'
    : 'backdrop-blur-2xl bg-white/55 border border-white/70 shadow-[0_8px_30px_rgba(148,163,184,0.14)] hover:border-amber-400/70 hover:bg-white/75 hover:shadow-[0_12px_36px_rgba(245,158,11,0.12)] transition-all duration-300';

  const glassCardStatic = isDark
    ? 'backdrop-blur-2xl bg-[#0d101e]/45 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.28)]'
    : 'backdrop-blur-2xl bg-white/55 border border-white/70 shadow-[0_8px_30px_rgba(148,163,184,0.14)]';

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className={`h-full w-full max-w-full overflow-y-auto overflow-x-hidden antialiased transition-colors duration-200 relative scroll-smooth ${
      isDark 
        ? 'bg-[#08090d] text-slate-200 selection:bg-amber-500/30 selection:text-amber-300' 
        : 'bg-[#f4f6fa] text-slate-800 selection:bg-amber-500/30 selection:text-amber-900'
    }`}>
      {/* Interactive Sticky Scroll Progress Bar */}
      <div className="sticky top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
        <motion.div
          style={{ width: `${scrollProgress}%` }}
          className={`h-full transition-all duration-75 ${
            isDark
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
              : 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
          }`}
        />
      </div>
      
      {/* Background ambient lighting with dynamic floating animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            x: [0, 40, 0], 
            y: [0, -30, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full blur-[140px] opacity-25 ${
            isDark ? 'bg-amber-500' : 'bg-amber-300'
          }`} 
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 0], 
            y: [0, 40, 0],
            scale: [1, 1.25, 1] 
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[160px] opacity-20 ${
            isDark ? 'bg-cyan-500' : 'bg-cyan-300'
          }`} 
        />
        <motion.div 
          animate={{ 
            x: [0, 35, 0], 
            y: [0, -45, 0],
            scale: [1, 1.15, 1] 
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className={`absolute bottom-20 left-1/4 w-[460px] h-[460px] rounded-full blur-[150px] opacity-20 ${
            isDark ? 'bg-purple-600' : 'bg-purple-300'
          }`} 
        />
      </div>

      <div className="relative z-10 w-full">
        {/* HERO SECTION */}
        <section className={`relative px-3 sm:px-6 lg:px-8 py-8 sm:py-14 border-b transition-colors duration-200 w-full max-w-full overflow-hidden ${
          isDark 
            ? 'border-[#1b1e2c]/80 bg-gradient-to-b from-[#10121d]/90 to-[#08090d]/90' 
            : 'border-slate-200/80 bg-gradient-to-b from-amber-50/50 via-white/80 to-slate-50/80'
        }`}>
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Top Navigation & Status Bar */}
            <motion.div 
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex flex-wrap items-center justify-between gap-2"
            >
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border backdrop-blur-md ${
                isDark
                  ? 'bg-slate-900/70 border-slate-700/60 text-slate-300'
                  : 'bg-white/80 border-slate-300 text-slate-700 font-medium shadow-xs'
              }`}>
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{portfolioData.developer.location}</span>
              </div>

              {/* Quick Navigation Links with Active Scrollspy Highlighting */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono py-1">
                {['about', 'skills', 'experience', 'education', 'projects'].map((sec) => {
                  const isActive = activeSection === sec;
                  return (
                    <button
                      key={sec}
                      onClick={() => scrollToSection(`section-${sec}`)}
                      className={`relative px-2.5 py-1 rounded-lg transition-all cursor-pointer capitalize font-medium ${
                        isActive
                          ? (isDark 
                              ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30 font-bold shadow-xs' 
                              : 'text-amber-800 bg-amber-100 border border-amber-300 font-bold shadow-xs')
                          : (isDark 
                              ? 'hover:bg-white/10 text-slate-400 hover:text-slate-100' 
                              : 'hover:bg-black/5 text-slate-600 hover:text-slate-950')
                      }`}
                    >
                      {sec}
                    </button>
                  );
                })}
                <button
                  onClick={() => scrollToSection('section-ello')}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                    activeSection === 'ello'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-amber-500/15 text-amber-500 border-amber-500/30 hover:bg-amber-500/25'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask Ello</span>
                </button>
              </div>
            </motion.div>

            {/* Profile Identity & User's Permanent Photo (Circular / Rounded) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8 pt-2"
            >
              {/* Left Bio Info */}
              <div className="space-y-3.5 flex-1 text-center md:text-left">
                <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Hi, I'm <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent">{portfolioData.developer.name}</span>
                </h1>
                <p className={`text-base sm:text-xl font-mono font-semibold ${
                  isDark ? 'text-cyan-400' : 'text-cyan-700'
                }`}>
                  &gt; {portfolioData.developer.role}
                </p>
                <p className={`max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {portfolioData.developer.tagline}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                  <button
                    onClick={() => {
                      confetti({ particleCount: 80, spread: 60 });
                      onOpenContact();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Hire Me / Contact</span>
                  </button>

                  <button
                    onClick={() => scrollToSection('section-ello')}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer border backdrop-blur-md active:scale-95 ${
                      isDark 
                        ? 'bg-[#141624]/80 hover:bg-[#1e2238] text-cyan-400 border-cyan-500/30 shadow-md shadow-cyan-950/20' 
                        : 'bg-white/90 hover:bg-cyan-50 text-cyan-800 border-cyan-300 shadow-xs'
                    }`}
                  >
                    <Bot className="w-4 h-4 text-cyan-500" />
                    <span>Chat with Ello AI</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenCvPreview) {
                        onOpenCvPreview();
                      } else {
                        downloadDeveloperCv(portfolioData);
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer border backdrop-blur-md shadow-xs active:scale-95 ${
                      isDark 
                        ? 'bg-[#141724]/80 hover:bg-[#1f2438] text-amber-400 border-amber-500/30' 
                        : 'bg-white/90 hover:bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                    }`}
                    title="Preview & Download Developer CV"
                  >
                    <Download className="w-4 h-4 text-amber-500" />
                    <span>Download CV</span>
                  </button>
                </div>
              </div>

              {/* Right: Round Profile Picture with Glowing Ring & Blur Transition Auto-Changing Photos */}
              <div 
                className="shrink-0 relative group flex flex-col items-center select-none"
                onMouseEnter={() => setIsPhotoPaused(true)}
                onMouseLeave={() => setIsPhotoPaused(false)}
              >
                <div className="relative">
                  {/* Ambient glowing halo */}
                  <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-500 opacity-60 blur-md group-hover:opacity-95 transition duration-500 animate-pulse" />
                  
                  {/* Circular container */}
                  <div 
                    className={`relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full p-1.5 border-2 shadow-2xl backdrop-blur-xl flex items-center justify-center overflow-hidden ${
                      isDark 
                        ? 'bg-[#0e1017]/90 border-amber-500/60 shadow-amber-500/20' 
                        : 'bg-white/90 border-amber-400 shadow-amber-400/20'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activePhotoIdx}
                        src={photoList[activePhotoIdx] || avatar1Opt || avatar1 || '/avatar_optimized.webp'}
                        alt={`${portfolioData.developer.name} - Photo ${activePhotoIdx + 1}`}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Resilient auto-fallback to local optimized avatar if remote link fails
                          const target = e.currentTarget;
                          if (target.src !== (avatar1Opt || avatar1)) {
                            target.src = avatar1Opt || avatar1 || '/avatar_optimized.webp';
                          }
                        }}
                        initial={{ opacity: 0, filter: 'blur(16px)', scale: 1.05 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                        exit={{ opacity: 0, filter: 'blur(16px)', scale: 0.95 }}
                        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                        className="w-full h-full object-cover rounded-full shadow-inner"
                      />
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Highlights Bar with Frosted Glass Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-4 w-full"
            >
              <div className={`p-4 rounded-2xl ${glassCardClass}`}>
                <div className="text-lg sm:text-xl font-bold text-amber-500 font-mono">Web & Software</div>
                <div className={`text-[11px] sm:text-xs mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Development Craft</div>
              </div>
              <div className={`p-4 rounded-2xl ${glassCardClass}`}>
                <div className="text-lg sm:text-xl font-bold text-cyan-400 font-mono">{portfolioData.projects.length}+ Projects</div>
                <div className={`text-[11px] sm:text-xs mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Repositories</div>
              </div>
              <div className={`p-4 rounded-2xl ${glassCardClass}`}>
                <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">Modern Stack</div>
                <div className={`text-[11px] sm:text-xs mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>React, TS & Node</div>
              </div>
              <div className={`p-4 rounded-2xl ${glassCardClass}`}>
                <div className="text-lg sm:text-xl font-bold text-purple-400 font-mono">Problem Solver</div>
                <div className={`text-[11px] sm:text-xs mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Clean Architecture</div>
              </div>
            </motion.div>

            {/* Scroll to Explore Bouncing Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="pt-2 flex flex-col items-center justify-center cursor-pointer group select-none"
              onClick={() => scrollToSection('section-about')}
            >
              <span className={`text-[11px] font-mono tracking-widest uppercase transition-colors flex items-center gap-1 ${
                isDark ? 'text-slate-500 group-hover:text-amber-400' : 'text-slate-400 group-hover:text-amber-600'
              }`}>
                <span>Scroll to explore</span>
              </span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className={`mt-0.5 p-1 rounded-full ${
                  isDark ? 'text-amber-400/80 group-hover:text-amber-400' : 'text-amber-600/80 group-hover:text-amber-600'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION: ABOUT */}
        <section id="section-about" className={`px-3 sm:px-6 lg:px-8 py-10 sm:py-16 border-b transition-colors duration-200 w-full max-w-full overflow-hidden ${
          isDark ? 'border-[#1b1e2c]/70' : 'border-slate-200/70'
        }`}>
          <div className="max-w-5xl mx-auto space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="space-y-1.5"
            >
              <div className="text-amber-500 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Identity & Philosophy</span>
              </div>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                About
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-2 space-y-3.5 text-xs sm:text-sm leading-relaxed"
              >
                {portfolioData.developer.bio.map((para, pIdx) => (
                  <div key={pIdx} className={`p-4 sm:p-5 rounded-2xl ${glassCardClass}`}>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {para}
                    </p>
                  </div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`p-5 sm:p-6 rounded-2xl ${glassCardClass} space-y-4 h-fit`}
              >
                <h3 className="font-bold font-mono text-xs text-amber-500 uppercase tracking-wider">Professional Profile</h3>
                <div className="space-y-3 text-xs">
                  <div className="border-b pb-2.5 border-slate-700/30 dark:border-white/5">
                    <span className={`block text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Full Name:</span>
                    <span className="font-semibold text-sm">{portfolioData.developer.name}</span>
                  </div>
                  <div className="border-b pb-2.5 border-slate-700/30 dark:border-white/5">
                    <span className={`block text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Core Discipline:</span>
                    <span className="font-semibold text-cyan-400">{portfolioData.developer.role}</span>
                  </div>
                  <div className="border-b pb-2.5 border-slate-700/30 dark:border-white/5">
                    <span className={`block text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Location:</span>
                    <span className="font-semibold">{portfolioData.developer.location}</span>
                  </div>
                  <div>
                    <span className={`block text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Core Focus:</span>
                    <span className="font-semibold text-amber-500">Continuous Growth & Clean Architecture</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION: TECHNICAL SKILLS */}
        <section id="section-skills" className={`px-3 sm:px-6 lg:px-8 py-10 sm:py-14 border-b transition-colors duration-200 w-full max-w-full overflow-hidden ${
          isDark ? 'border-[#1b1e2c]/70' : 'border-slate-200/70'
        }`}>
          <div className="max-w-5xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Coding Foundations</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Core Technical Skills & Fundamentals
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {portfolioData.skills.map((group, gIdx) => (
                <motion.div 
                  key={group.category} 
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: gIdx * 0.08 }}
                  className={`p-4 sm:p-5 rounded-2xl ${glassCardClass} flex flex-col justify-between`}
                >
                  <div>
                    <h3 className="text-sm font-bold text-amber-500 font-mono mb-3.5 flex items-center justify-between">
                      <span>{group.category}</span>
                      <span className={`text-xs font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {group.skills.length} skills
                      </span>
                    </h3>

                    <div className="space-y-2">
                      {group.skills.map((skill) => (
                        <div 
                          key={skill.name}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                            isDark 
                              ? 'bg-[#10121b]/80 border-slate-800/80 hover:border-amber-500/40 hover:bg-[#151928]' 
                              : 'bg-slate-50/90 border-slate-200/90 hover:border-amber-400 hover:bg-amber-50/30'
                          }`}
                        >
                          <span className={`text-xs font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {skill.name}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border shrink-0 ${
                            isDark
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>{skill.status || skill.badge || 'Learning'}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: WORK EXPERIENCE */}
        <section id="section-experience" className={`px-3 sm:px-6 lg:px-8 py-10 sm:py-14 border-b transition-colors duration-200 w-full max-w-full overflow-hidden ${
          isDark ? 'border-[#1b1e2c]/70' : 'border-slate-200/70'
        }`}>
          <div className="max-w-5xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-purple-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>Career & Experience</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Professional Work Experience
              </h2>
            </motion.div>

            <div className="space-y-4">
              {portfolioData.experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`p-5 sm:p-6 rounded-2xl ${glassCardClass}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs font-mono">
                        <a 
                          href="https://robosuperior.org" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-amber-500 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>{exp.company} (RoboSuperior.org)</span>
                          <ExternalLink className="w-3 h-3 text-amber-500/80" />
                        </a>
                        <span className="text-slate-500">•</span>
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{exp.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono border ${
                        isDark ? 'bg-purple-950/40 text-purple-300 border-purple-800/40' : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}>
                        {exp.type}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono border ${
                        isDark ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {exp.description}
                  </p>

                  {/* Achievements List */}
                  <div className="space-y-1.5 mb-4">
                    {exp.achievements.map((ach, aIdx) => (
                      <div key={aIdx} className={`flex items-start gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-700/30 dark:border-white/5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className={`text-[11px] px-2.5 py-0.5 rounded-md font-mono border ${
                          isDark 
                            ? 'bg-[#181b28]/80 text-cyan-300 border-cyan-500/20' 
                            : 'bg-slate-100 text-cyan-800 border-slate-200'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: EDUCATIONAL BACKGROUND */}
        <section id="section-education" className={`px-3 sm:px-6 lg:px-8 py-10 sm:py-14 border-b transition-colors duration-200 w-full max-w-full overflow-hidden ${
          isDark ? 'border-[#1b1e2c]/70' : 'border-slate-200/70'
        }`}>
          <div className="max-w-5xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Journey</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Educational Background
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Degree Information */}
              {portfolioData.education.map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  className={`p-5 rounded-2xl ${glassCardClass} space-y-3 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-xs">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {edu.degree}
                        </h3>
                        <p className="text-xs font-mono text-amber-500 font-semibold mt-0.5">
                          {edu.institution}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                          <span className="font-semibold text-cyan-400">{edu.period}</span>
                          <span>•</span>
                          <span>{edu.location}</span>
                        </div>
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed pt-3 mt-3 border-t ${isDark ? 'text-slate-300 border-white/5' : 'text-slate-600 border-slate-100'}`}>
                      {edu.details}
                    </p>
                  </div>
                </motion.div>
              ))}

              {portfolioData.certifications && portfolioData.certifications.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                  className={`p-5 rounded-2xl ${glassCardClass} space-y-3`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      Industry Certifications
                    </h3>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {portfolioData.certifications.map((cert, cIdx) => (
                      <div key={cIdx} className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 backdrop-blur-md ${
                        isDark ? 'bg-[#0f1118]/70 border-white/5' : 'bg-white/80 border-slate-200'
                      }`}>
                        <div>
                          <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cert.name}</div>
                          <div className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cert.issuer}</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                          {cert.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION: FEATURED PROJECTS */}
        <section id="section-projects" className={`px-3 sm:px-6 lg:px-8 py-10 sm:py-14 border-b transition-colors duration-200 w-full max-w-full overflow-hidden ${
          isDark ? 'border-[#1b1e2c]/70' : 'border-slate-200/70'
        }`}>
          <div className="max-w-5xl mx-auto space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="text-amber-500 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>Featured Work</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 mt-1">
                  <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    Software Projects & Apps
                  </h2>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border backdrop-blur-md ${
                    isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}>
                    <Github className="w-3 h-3 text-amber-500" />
                    <span>Synced with GitHub @mishuk08</span>
                  </span>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className={`flex flex-wrap gap-1 p-1 rounded-xl border max-w-full overflow-x-auto backdrop-blur-md ${
                isDark ? 'bg-[#12141e]/80 border-[#23273b]' : 'bg-slate-200/60 border-slate-300'
              }`}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Projects Grid with Frosted Glass Cards & Scroll Reveal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {filteredProjects.map((project, pIdx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: pIdx * 0.08 }}
                  className={`p-4 sm:p-5 rounded-2xl ${glassCardClass} group flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-medium border ${
                        isDark 
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {project.category}
                      </span>
                      {project.metrics && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                          isDark 
                            ? 'bg-blue-950/60 text-blue-300 border-blue-800/40' 
                            : 'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {project.metrics}
                        </span>
                      )}
                    </div>

                    <h3 className={`text-base sm:text-lg font-bold group-hover:text-amber-500 transition-colors ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      {project.title}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-mono border ${
                            isDark 
                              ? 'bg-[#191c2b]/80 text-cyan-300 border-[#272d45]' 
                              : 'bg-slate-100 text-cyan-800 border-slate-200'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`flex items-center justify-between pt-4 mt-4 border-t ${
                    isDark ? 'border-white/5' : 'border-slate-100'
                  }`}>
                    <button
                      onClick={() => onOpenProject(project.id)}
                      className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Architecture</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark 
                            ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title="GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isDark 
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40' 
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                        }`}
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: ELLO AI ASSISTANT CHATBOX */}
        <section id="section-ello" className={`px-3 sm:px-6 lg:px-8 py-10 sm:py-14 border-b transition-colors duration-200 w-full max-w-full overflow-hidden ${
          isDark 
            ? 'border-[#1b1e2c]/70 bg-gradient-to-b from-[#08090d] via-[#10121c]/70 to-[#08090d]' 
            : 'border-slate-200/70 bg-gradient-to-b from-slate-50/70 via-amber-50/30 to-white/70'
        }`}>
          <div className="max-w-5xl mx-auto space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="text-amber-500 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  <span>Interactive AI Chatbot</span>
                </div>
                <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Talk With Ello - Portfolio AI
                </h2>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Ask Ello anything about Mishuk's skills, work experience, education, or projects in English or Bengali.
                </p>
              </div>
            </motion.div>

            {/* Embedded Ello Chat Interface with Frosted Glass Container */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <ElloChatWidget
                portfolioData={portfolioData}
                themeMode={themeMode}
                onOpenProject={onOpenProject}
                onOpenContact={onOpenContact}
              />
            </motion.div>
          </div>
        </section>

        {/* SECTION: SERVICES */}
        <section className={`px-3 sm:px-6 lg:px-8 py-10 sm:py-14 border-b transition-colors duration-200 w-full max-w-full overflow-hidden ${
          isDark ? 'border-[#1b1e2c]/70' : 'border-slate-200/70'
        }`}>
          <div className="max-w-5xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-purple-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>What I Deliver</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Engineering Services
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {portfolioData.services.map((srv, sIdx) => (
                <motion.div 
                  key={srv.title} 
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: sIdx * 0.1 }}
                  className={`p-5 rounded-2xl ${glassCardClass} space-y-3`}
                >
                  <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{srv.title}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{srv.description}</p>
                  <div className="pt-1 space-y-1">
                    {srv.deliverables.map((d, dIdx) => (
                      <div key={dIdx} className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: CONTACT */}
        <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-14 w-full max-w-full overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className={`p-5 sm:p-8 rounded-3xl border space-y-6 backdrop-blur-2xl ${
                isDark 
                  ? 'bg-[#121424]/80 border-amber-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.45)]' 
                  : 'bg-white/85 border-amber-300/80 shadow-[0_12px_36px_rgba(245,158,11,0.12)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-amber-500 font-mono text-xs font-bold uppercase">Ready to Build?</span>
                  <h2 className={`text-xl sm:text-3xl font-bold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    Get In Touch With Mishuk
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1 max-w-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Whether you have an upcoming project, freelance inquiry, or full-time opportunity, feel free to reach out directly.
                  </p>
                </div>

                <a
                  href={portfolioData.developer.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-600/30 self-start sm:self-auto shrink-0 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {contactSubmitted ? (
                <div className="p-4 bg-emerald-950/60 border border-emerald-700/50 rounded-2xl text-emerald-300 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">Thank you! Your message has been sent.</p>
                    <p>Mishuk will respond to your email at <span className="text-amber-400">{portfolioData.developer.email}</span> shortly.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-mono mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 border backdrop-blur-md ${
                        isDark 
                          ? 'bg-[#08090d]/80 border-white/10 text-slate-200' 
                          : 'bg-white/90 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-mono mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 border backdrop-blur-md ${
                        isDark 
                          ? 'bg-[#08090d]/80 border-white/10 text-slate-200' 
                          : 'bg-white/90 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={`block text-xs font-mono mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Project Details / Message</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Tell me about your requirements, timeline, or open role..."
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 resize-none border backdrop-blur-md ${
                        isDark 
                          ? 'bg-[#08090d]/80 border-white/10 text-slate-200' 
                          : 'bg-white/90 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/25 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message to Mishuk</span>
                    </button>

                    <a
                      href={`mailto:${portfolioData.developer.email}`}
                      className={`px-4 py-2.5 text-xs rounded-xl flex items-center gap-2 transition-colors border truncate backdrop-blur-md ${
                        isDark 
                          ? 'bg-[#1e2235]/70 hover:bg-[#282d45] text-slate-200 border-white/10' 
                          : 'bg-white/90 hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span className="truncate">Direct Mail ({portfolioData.developer.email})</span>
                    </a>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Stylized Rangpur Division Map */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <RangpurDivisionMap themeMode={themeMode} />
            </motion.div>
          </div>

          {/* Dedicated Social Media Links & Signature Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 ${
              isDark ? 'border-[#202538]/70' : 'border-slate-200/70'
            }`}
          >
            {/* Left: Social Media Channel Glass Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              {portfolioData.developer.socials.facebook && (
                <a
                  href={portfolioData.developer.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
                    isDark 
                      ? 'bg-[#141622]/80 hover:bg-[#1f2338] text-blue-400 border-blue-500/30 shadow-xs' 
                      : 'bg-white/90 hover:bg-blue-50 text-blue-600 border-blue-200 shadow-xs'
                  }`}
                  title="Connect on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
              )}

              {portfolioData.developer.socials.instagram && (
                <a
                  href={portfolioData.developer.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
                    isDark 
                      ? 'bg-[#141622]/80 hover:bg-[#1f2338] text-pink-400 border-pink-500/30 shadow-xs' 
                      : 'bg-white/90 hover:bg-pink-50 text-pink-600 border-pink-200 shadow-xs'
                  }`}
                  title="Follow on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              )}

              {portfolioData.developer.socials.github && (
                <a
                  href={portfolioData.developer.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
                    isDark 
                      ? 'bg-[#141622]/80 hover:bg-[#1f2338] text-slate-300 border-white/10' 
                      : 'bg-white/90 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                  }`}
                  title="GitHub Repositories"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}

              {portfolioData.developer.socials.whatsapp && (
                <a
                  href={portfolioData.developer.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
                    isDark 
                      ? 'bg-[#141622]/80 hover:bg-[#1f2338] text-emerald-400 border-emerald-500/30' 
                      : 'bg-white/90 hover:bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs'
                  }`}
                  title="WhatsApp Direct Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>

            {/* Right: Developed by Mishuk Babu Shoukhin (Clickable to Facebook) */}
            <div className="text-center md:text-right text-xs">
              <p className={`font-mono flex items-center justify-center md:justify-end gap-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span>Developed by</span>
                <a
                  href={portfolioData.developer.socials.facebook || "https://www.facebook.com/mdmishukbabu192"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-amber-500 hover:text-amber-400 inline-flex items-center gap-1 group underline underline-offset-4 decoration-amber-500/40 hover:decoration-amber-400 transition-all cursor-pointer"
                  title="Open Mishuk's Facebook Account"
                >
                  <span className="group-hover:scale-105 transition-transform">Mishuk Babu Shoukhin</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </p>
              <p className={`text-[11px] mt-1 font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                © {new Date().getFullYear()} All Rights Reserved.
              </p>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Scroll to Top Floating Button with Circular Progress Indicator */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 15 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToTop}
            className={`fixed bottom-20 right-6 z-40 w-11 h-11 rounded-full shadow-xl backdrop-blur-xl border flex items-center justify-center cursor-pointer transition-colors group ${
              isDark
                ? 'bg-[#10121d]/90 border-amber-500/40 text-amber-400 shadow-amber-500/15 hover:border-amber-400 hover:bg-[#181c2e]'
                : 'bg-white/95 border-amber-400/60 text-amber-600 shadow-amber-400/20 hover:bg-amber-50'
            }`}
            title="Back to Top"
            aria-label="Scroll back to top"
          >
            {/* SVG Radial Scroll Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 p-0.5" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15"
                className={`fill-none stroke-current ${isDark ? 'text-slate-800' : 'text-slate-200'}`}
                strokeWidth="2.5"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                className={`fill-none stroke-current transition-all duration-75 ${isDark ? 'text-amber-400' : 'text-amber-500'}`}
                strokeWidth="2.5"
                strokeDasharray="94.25"
                strokeDashoffset={94.25 - (94.25 * scrollProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <ArrowUp className="w-4 h-4 relative z-10 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Ello AI Launcher Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => scrollToSection('section-ello')}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold text-xs border border-amber-300 cursor-pointer"
        title="Chat with Ello AI"
      >
        <Bot className="w-5 h-5 text-slate-950" />
        <span className="hidden sm:inline">Ask Ello</span>
      </motion.button>
    </div>
  );
};
