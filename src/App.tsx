/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { TabBar } from './components/TabBar';
import { Sidebar } from './components/Sidebar';
import { LivePreview } from './components/LivePreview';
import { OpeningAnimation } from './components/OpeningAnimation';
import { portfolioData as initialPortfolioData } from './data/portfolioData';
import { EditorTabId, ViewMode, ThemeMode, Project, PortfolioData } from './types';
import { syncGithubProjects } from './utils/githubSync';
import { syncGoogleDrivePhotos, getCachedPhotos } from './services/driveSync';
import { useAnimatedFavicon } from './hooks/useAnimatedFavicon';
import { fireConfetti } from './utils/confetti';

// Lazy-load non-critical components and modals to dramatically shrink initial main-thread bundle
const JsonCodeViewer = lazy(() => import('./components/JsonCodeViewer').then(m => ({ default: m.JsonCodeViewer })));
const AboutTsxViewer = lazy(() => import('./components/CodeViewers').then(m => ({ default: m.AboutTsxViewer })));
const ProjectsTsViewer = lazy(() => import('./components/CodeViewers').then(m => ({ default: m.ProjectsTsViewer })));
const SkillsJsonViewer = lazy(() => import('./components/CodeViewers').then(m => ({ default: m.SkillsJsonViewer })));
const ExperienceJsonViewer = lazy(() => import('./components/CodeViewers').then(m => ({ default: m.ExperienceJsonViewer })));
const ContactShViewer = lazy(() => import('./components/CodeViewers').then(m => ({ default: m.ContactShViewer })));

const TerminalComponent = lazy(() => import('./components/Terminal').then(m => ({ default: m.TerminalComponent })));
const ProjectModal = lazy(() => import('./components/ProjectModal').then(m => ({ default: m.ProjectModal })));
const ContactModal = lazy(() => import('./components/ContactModal').then(m => ({ default: m.ContactModal })));
const PortfolioEditorModal = lazy(() => import('./components/PortfolioEditorModal').then(m => ({ default: m.PortfolioEditorModal })));
const CvPreviewModal = lazy(() => import('./components/CvPreviewModal').then(m => ({ default: m.CvPreviewModal })));

export default function App() {
  // Website opens in GUI mode and Light mode by default
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [activeTab, setActiveTab] = useState<EditorTabId>('portfolio.json');
  const [openTabs, setOpenTabs] = useState<EditorTabId[]>([
    'portfolio.json',
    'about.tsx',
    'projects.ts',
    'skills.json',
    'experience.json',
    'contact.sh',
    'terminal'
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isCvModalOpen, setIsCvModalOpen] = useState<boolean>(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState<boolean>(false);
  const [terminalCommand, setTerminalCommand] = useState<string>('');
  const [isTerminalBottomOpen, setIsTerminalBottomOpen] = useState<boolean>(false);

  // Dynamic animated browser tab favicon with user's photo and glowing neon aura
  useAnimatedFavicon(data.developer.avatar || '/avatar_optimized.webp');

  // Opening animation state - instant skip if user already booted or prefers reduced motion
  const [isAppLoading, setIsAppLoading] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        if (sessionStorage.getItem('mishuk_has_booted') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return false;
        }
      }
    } catch {
      // ignore
    }
    return true;
  });

  // Load custom photo from localStorage if user previously uploaded one
  useEffect(() => {
    try {
      const savedAvatar = localStorage.getItem('mishuk_custom_avatar');
      if (savedAvatar) {
        setData(prev => ({
          ...prev,
          developer: {
            ...prev.developer,
            avatar: savedAvatar
          }
        }));
      }
    } catch {
      // Local storage unavailable
    }
  }, []);

  const handleUpdateAvatar = (newAvatarDataUrl: string) => {
    try {
      localStorage.setItem('mishuk_custom_avatar', newAvatarDataUrl);
    } catch {
      // ignore
    }
    setData(prev => ({
      ...prev,
      developer: {
        ...prev.developer,
        avatar: newAvatarDataUrl
      }
    }));
  };

  // Sync developer profile pictures with Google Drive folder unless custom avatar is set
  useEffect(() => {
    let isMounted = true;
    let hasCustomAvatar = false;
    try {
      hasCustomAvatar = Boolean(localStorage.getItem('mishuk_custom_avatar'));
    } catch {
      // ignore
    }

    const applyDrivePhotos = (photos: string[]) => {
      if (!isMounted || !photos || photos.length === 0) return;
      setData(prev => ({
        ...prev,
        developer: {
          ...prev.developer,
          avatar: hasCustomAvatar ? prev.developer.avatar : photos[0],
          avatars: photos
        }
      }));
    };

    // Apply cached Drive photos immediately
    applyDrivePhotos(getCachedPhotos());

    // Fetch live updates from Google Drive folder
    const syncDrive = async () => {
      try {
        const latest = await syncGoogleDrivePhotos();
        if (latest && latest.length > 0) {
          applyDrivePhotos(latest);
        }
      } catch {
        // Keep cached/default Drive photos
      }
    };

    syncDrive();
    const driveInterval = setInterval(syncDrive, 30000);

    return () => {
      isMounted = false;
      clearInterval(driveInterval);
    };
  }, []);

  // Sync projects from GitHub @mishuk08 - deferred to idle time to preserve initial paint speed
  useEffect(() => {
    let isMounted = true;

    async function loadGithubRepos() {
      try {
        const result = await syncGithubProjects('mishuk08');
        if (isMounted && result.projects.length > 0) {
          setData(prev => {
            // Merge GitHub projects ensuring no duplicates by id or title
            const existingNonGh = prev.projects.filter(p => !p.id.startsWith('gh-'));
            return {
              ...prev,
              projects: [...result.projects, ...existingNonGh]
            };
          });
        }
      } catch (err) {
        console.warn('GitHub initial sync notice:', err);
      }
    }

    const timer = setTimeout(loadGithubRepos, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const toggleThemeMode = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleRequestViewMode = (newMode: ViewMode) => {
    if (newMode === viewMode) return;
    setViewMode(newMode);
  };

  const selectedProject: Project | null = selectedProjectId
    ? data.projects.find(p => p.id === selectedProjectId) || null
    : null;

  const handleOpenTab = (tabId: EditorTabId) => {
    if (!openTabs.includes(tabId)) {
      setOpenTabs([...openTabs, tabId]);
    }
    setActiveTab(tabId);
  };

  const handleCloseTab = (tabId: EditorTabId, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = openTabs.filter(t => t !== tabId);
    setOpenTabs(filtered);
    if (activeTab === tabId && filtered.length > 0) {
      setActiveTab(filtered[filtered.length - 1]);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${data.developer.name.replace(/\s+/g, '_')}_Portfolio.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    fireConfetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleRunTerminalCommand = (cmd: string) => {
    setTerminalCommand(cmd);
    setIsTerminalBottomOpen(true);
  };

  const handleOpenTerminalFromHeader = () => {
    setIsTerminalBottomOpen(prev => !prev);
  };

  const handleScrollToSection = (sectionId: string) => {
    handleOpenTab('portfolio.json');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  // Render active code file inside editor
  const renderCodeEditor = () => {
    switch (activeTab) {
      case 'portfolio.json':
        return (
          <JsonCodeViewer
            portfolioData={data}
            onOpenProject={(id) => setSelectedProjectId(id)}
            onOpenContact={() => setIsContactOpen(true)}
            onRunTerminalCommand={handleRunTerminalCommand}
            themeMode={themeMode}
          />
        );
      case 'about.tsx':
        return (
          <AboutTsxViewer
            portfolioData={data}
            onOpenProject={(id) => setSelectedProjectId(id)}
            onOpenContact={() => setIsContactOpen(true)}
            onRunTerminalCommand={handleRunTerminalCommand}
            themeMode={themeMode}
          />
        );
      case 'projects.ts':
        return (
          <ProjectsTsViewer
            portfolioData={data}
            onOpenProject={(id) => setSelectedProjectId(id)}
            onOpenContact={() => setIsContactOpen(true)}
            onRunTerminalCommand={handleRunTerminalCommand}
            themeMode={themeMode}
          />
        );
      case 'skills.json':
        return (
          <SkillsJsonViewer
            portfolioData={data}
            onOpenProject={(id) => setSelectedProjectId(id)}
            onOpenContact={() => setIsContactOpen(true)}
            onRunTerminalCommand={handleRunTerminalCommand}
            themeMode={themeMode}
          />
        );
      case 'experience.json':
        return (
          <ExperienceJsonViewer
            portfolioData={data}
            onOpenProject={(id) => setSelectedProjectId(id)}
            onOpenContact={() => setIsContactOpen(true)}
            onRunTerminalCommand={handleRunTerminalCommand}
            themeMode={themeMode}
          />
        );
      case 'contact.sh':
        return (
          <ContactShViewer
            portfolioData={data}
            onOpenProject={(id) => setSelectedProjectId(id)}
            onOpenContact={() => setIsContactOpen(true)}
            onRunTerminalCommand={handleRunTerminalCommand}
            themeMode={themeMode}
          />
        );
      case 'terminal':
        return (
          <TerminalComponent
            onOpenProject={(id) => setSelectedProjectId(id)}
            onOpenContact={() => setIsContactOpen(true)}
            initialCommand={terminalCommand}
            themeMode={themeMode}
          />
        );
      default:
        return (
          <JsonCodeViewer
            portfolioData={data}
            onOpenProject={(id) => setSelectedProjectId(id)}
            onOpenContact={() => setIsContactOpen(true)}
            onRunTerminalCommand={handleRunTerminalCommand}
            themeMode={themeMode}
          />
        );
    }
  };

  const isDark = themeMode === 'dark';

  return (
    <div className={`h-screen w-screen max-w-full flex flex-col overflow-x-hidden overflow-y-hidden font-sans ${
      isDark ? 'bg-[#0d0e13] text-slate-200' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Visual Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Application Bar with macOS Window Buttons, GUI/JSON mode switch, and Dark/Light toggle */}
        <HeaderBar
          viewMode={viewMode}
          setViewMode={handleRequestViewMode}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          openContact={() => setIsContactOpen(true)}
          handleExportJson={handleExportJson}
          activeFileName={activeTab}
          themeMode={themeMode}
          toggleThemeMode={toggleThemeMode}
          onOpenTerminal={handleOpenTerminalFromHeader}
        />

        {/* Main Container */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full max-w-full relative">
          {/* Collapsible Left File Explorer (Shown only in JSON / IDE mode) */}
          {viewMode === 'editor' && isSidebarOpen && (
            <div className="w-full md:w-auto shrink-0 z-30">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={handleOpenTab}
                openContact={() => setIsContactOpen(true)}
                onScrollToSection={handleScrollToSection}
                themeMode={themeMode}
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>
          )}

          {/* View Content Area */}
          <div className={`flex-1 flex flex-col overflow-hidden w-full max-w-full ${
            isDark ? 'bg-[#0d0e13]' : 'bg-white'
          }`}>
            {/* Top Tab Bar (in JSON/Code mode) */}
            {viewMode === 'editor' && (
              <TabBar
                activeTab={activeTab}
                setActiveTab={handleOpenTab}
                openTabs={openTabs}
                closeTab={handleCloseTab}
                themeMode={themeMode}
              />
            )}

            {/* Main View Display: GUI Mode (Live App) or JSON Mode (IDE Code Viewer) */}
            <div className="flex-1 overflow-hidden flex flex-col w-full max-w-full">
              <div className="flex-1 overflow-hidden w-full max-w-full">
                {viewMode === 'preview' ? (
                  <div className="h-full w-full overflow-hidden">
                    <LivePreview
                      portfolioData={data}
                      onOpenProject={(id) => setSelectedProjectId(id)}
                      onOpenContact={() => setIsContactOpen(true)}
                      onOpenCvPreview={() => setIsCvModalOpen(true)}
                      onOpenEditor={() => setIsEditorModalOpen(true)}
                      onExportJson={handleExportJson}
                      themeMode={themeMode}
                    />
                  </div>
                ) : (
                  <div className="h-full w-full overflow-hidden flex flex-col">
                    <Suspense fallback={<div className="p-4 text-xs font-mono text-slate-500">Loading editor environment...</div>}>
                      {renderCodeEditor()}
                    </Suspense>
                  </div>
                )}
              </div>

              {/* Bottom Overlay Terminal (When opened, occupies a sleek lower portion of the screen with close & fullscreen controls) */}
              {isTerminalBottomOpen && (
                <div className="w-full shrink-0 z-40">
                  <Suspense fallback={<div className="p-4 bg-slate-950 text-xs font-mono text-slate-400">Loading terminal...</div>}>
                    <TerminalComponent
                      onOpenProject={(id) => setSelectedProjectId(id)}
                      onOpenContact={() => setIsContactOpen(true)}
                      initialCommand={terminalCommand}
                      themeMode={themeMode}
                      isOverlay={true}
                      onClose={() => setIsTerminalBottomOpen(false)}
                    />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Opening Loading Animation (on initial site load) */}
      {isAppLoading && (
        <OpeningAnimation
          onFinish={() => setIsAppLoading(false)}
          themeMode={themeMode}
          avatarUrl={data.developer.avatar || '/avatar_optimized.webp'}
          developerName={data.developer.name}
        />
      )}

      {/* Interactive Modals */}
      <Suspense fallback={null}>
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
          onOpenContact={() => setIsContactOpen(true)}
        />

        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />

        <CvPreviewModal
          isOpen={isCvModalOpen}
          onClose={() => setIsCvModalOpen(false)}
          portfolioData={data}
          themeMode={themeMode}
        />

        <PortfolioEditorModal
          isOpen={isEditorModalOpen}
          onClose={() => setIsEditorModalOpen(false)}
          portfolioData={data}
          onSave={(updatedData) => setData(updatedData)}
          onReset={() => setData(initialPortfolioData)}
          themeMode={themeMode}
        />
      </Suspense>
    </div>
  );
}
