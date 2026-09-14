import React from 'react';
import { X, ExternalLink, Github, CheckCircle, Layers, Cpu, Sparkles, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenContact }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#10121a] border border-[#262b40] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-200 font-sans gpu-layer"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2438] sticky top-0 bg-[#10121a]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
              {project.category} Project
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{project.title}</h2>
            <p className="text-sm text-cyan-400 font-mono mt-1">{project.tagline}</p>
          </div>

          {/* Metrics Banner */}
          {project.metrics && (
            <div className="p-3.5 bg-blue-950/40 border border-blue-800/40 rounded-xl flex items-center gap-3 text-xs text-blue-300">
              <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
              <span><strong>Performance Metric:</strong> {project.metrics}</span>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Architecture & Summary</h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-[#0b0c10] p-4 rounded-xl border border-[#1b1f2e]">
              {project.description}
            </p>
          </div>

          {/* Key Engineering Highlights */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Key Highlights</h3>
            <div className="space-y-2">
              {project.highlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded bg-[#181b2a] text-cyan-300 font-mono border border-[#272e48]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1f2438]">
            <div className="flex items-center gap-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repo</span>
              </a>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Discuss a similar project →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
