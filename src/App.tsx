/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { TabBar } from './components/TabBar';
import { Sidebar } from './components/Sidebar';
import { JsonCodeViewer } from './components/JsonCodeViewer';
import { 
  AboutTsxViewer, 
  ProjectsTsViewer, 
  SkillsJsonViewer, 
  ExperienceJsonViewer, 
  ContactShViewer 
} from './components/CodeViewers';
import { TerminalComponent } from './components/Terminal';
import { LivePreview } from './components/LivePreview';
import { ProjectModal } from './components/ProjectModal';
import { ContactModal } from './components/ContactModal';
import { PortfolioEditorModal } from './components/PortfolioEditorModal';
import { OpeningAnimation } from './components/OpeningAnimation';
import { ModeTransitionOverlay } from './components/ModeTransitionOverlay';
import { portfolioData as initialPortfolioData } from './data/portfolioData';
import { EditorTabId, ViewMode, ThemeMode, Project, PortfolioData } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  // Website opens in GUI mode by default
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
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
  const [isEditorModalOpen, setIsEditorModalOpen] = useState<boolean>(false);
  const [terminalCommand, setTerminalCommand] = useState<string>('');
  const [isTerminalBottomOpen, setIsTerminalBottomOpen] = useState<boolean>(false);

  // Opening animation state
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  // Theme switch blur effect
  const [isThemeBlurring, setIsThemeBlurring] = useState<boolean>(false);

  // Full-screen mode transition (JSON <-> GUI) with 0-100% circle progress
  const [transitioningMode, setTransitioningMode] = useState<ViewMode | null>(null);

  const toggleThemeMode = () => {
    setIsThemeBlurring(true);
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
    setTimeout(() => {
      setIsThemeBlurring(false);
    }, 450);
  };

  const handleRequestViewMode = (newMode: ViewMode) => {
    if (newMode === viewMode || transitioningMode) return;
    setTransitioningMode(newMode);
  };

  const handleModeTransitionComplete = () => {
    if (transitioningMode) {
      setViewMode(transitioningMode);
      setTransitioningMode(null);
    }
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

    confetti({
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
    <div className={`h-screen w-screen max-w-full flex flex-col overflow-x-hidden overflow-y-hidden font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#0d0e13] text-slate-200' : 'bg-slate-50 text-slate-800'
    }`}>
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
                    onOpenEditor={() => setIsEditorModalOpen(true)}
                    onExportJson={handleExportJson}
                    themeMode={themeMode}
                  />
                </div>
              ) : (
                <div className="h-full w-full overflow-hidden flex flex-col">
                  {renderCodeEditor()}
                </div>
              )}
            </div>

            {/* Bottom Overlay Terminal (When opened, occupies a sleek lower portion of the screen with close & fullscreen controls) */}
            {isTerminalBottomOpen && (
              <div className="w-full shrink-0 z-40">
                <TerminalComponent
                  onOpenProject={(id) => setSelectedProjectId(id)}
                  onOpenContact={() => setIsContactOpen(true)}
                  initialCommand={terminalCommand}
                  themeMode={themeMode}
                  isOverlay={true}
                  onClose={() => setIsTerminalBottomOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Opening Loading Animation (on initial site load) */}
      {isAppLoading && (
        <OpeningAnimation
          onFinish={() => setIsAppLoading(false)}
          themeMode={themeMode}
        />
      )}

      {/* Light / Dark Mode Blur Animation Overlay */}
      {isThemeBlurring && (
        <div className="fixed inset-0 z-50 pointer-events-none backdrop-blur-md bg-black/10 dark:bg-white/5 transition-opacity duration-300 animate-pulse" />
      )}

      {/* Fullscreen JSON <-> GUI Mode Transition Circular Loading Animation */}
      {transitioningMode && (
        <ModeTransitionOverlay
          targetMode={transitioningMode}
          themeMode={themeMode}
          onComplete={handleModeTransitionComplete}
        />
      )}

      {/* Interactive Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProjectId(null)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <PortfolioEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        data={data}
        onSave={(updatedData) => setData(updatedData)}
      />
    </div>
  );
}
