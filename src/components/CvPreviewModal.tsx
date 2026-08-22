import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Mail, 
  MapPin, 
  Phone, 
  Github, 
  Linkedin, 
  Facebook, 
  Instagram, 
  MessageSquare, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Award, 
  ExternalLink,
  Sparkles,
  FileText,
  Loader2
} from 'lucide-react';
import { PortfolioData, ThemeMode } from '../types';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { downloadDeveloperCv } from '../utils/cvDownload';

interface CvPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioData: PortfolioData;
  themeMode?: ThemeMode;
}

export const CvPreviewModal: React.FC<CvPreviewModalProps> = ({
  isOpen,
  onClose,
  portfolioData,
  themeMode = 'dark'
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [imgFallbackIndex, setImgFallbackIndex] = useState(0);
  const cvRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isDark = themeMode === 'dark';
  const avatarSources = ['/avatar.png', '/avatar.jpg', '/user_photo.jpg'];
  const currentAvatar = avatarSources[imgFallbackIndex] || '/avatar.png';

  const handleImageError = () => {
    if (imgFallbackIndex < avatarSources.length - 1) {
      setImgFallbackIndex(prev => prev + 1);
    } else {
      setAvatarError(true);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    try {
      if (cvRef.current) {
        const element = cvRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
        }

        pdf.save(`Mishuk_Babu_Shoukhin_CV.pdf`);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        downloadDeveloperCv(portfolioData);
      }
    } catch (error) {
      console.warn('Canvas PDF fallback triggered, downloading vector PDF directly:', error);
      downloadDeveloperCv(portfolioData);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border transition-colors overflow-hidden ${
        isDark ? 'bg-[#0f111a] border-[#252a3d] text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
      }`}>
        
        {/* Top Control Bar */}
        <div className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b shrink-0 ${
          isDark ? 'bg-[#151824] border-[#22273d]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-sm sm:text-base">CV Preview</span>
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
              Professional Format
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Small Download PDF Button requested by user */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
              title="Download CV as PDF file"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 stroke-[2.4]" />
              )}
              <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
              title="Print CV"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ml-1"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable CV Document Canvas */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-900/40">
          <div 
            ref={cvRef}
            className="max-w-[794px] mx-auto bg-white text-slate-900 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-10 font-sans border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0"
          >
            
            {/* Header: Photo + Profile Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 border-b border-slate-200 pb-6">
              {/* Photo */}
              <div className="shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-500 shadow-md bg-slate-100 flex items-center justify-center p-0.5 ring-2 ring-amber-400/30">
                  {!avatarError ? (
                    <img
                      src={currentAvatar}
                      alt={portfolioData.developer.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-white font-bold text-2xl">
                      MB
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Contact details */}
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {portfolioData.developer.name}
                </h1>
                <p className="text-amber-700 font-bold text-sm sm:text-base tracking-wide">
                  {portfolioData.developer.role}
                </p>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 pt-2 font-medium">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{portfolioData.developer.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{portfolioData.developer.location}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Github className="w-3.5 h-3.5 text-slate-800 shrink-0" />
                    <span>github.com/mishuk08</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Facebook className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>facebook.com/mishuk008</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                    <span>instagram.com/mi_sh_uk_008</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>WhatsApp: @mishuk_babu_shoukhin</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="py-5 border-b border-slate-200 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Summary</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {portfolioData.developer.tagline} {portfolioData.developer.bio.join(' ')}
              </p>
            </div>

            {/* Technical Skills */}
            <div className="py-5 border-b border-slate-200 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Technical Skills & Proficiencies</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {portfolioData.skills.map((cat, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <span className="font-bold text-slate-800 block mb-1.5">{cat.category}</span>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-2 py-0.5 bg-white text-slate-700 border border-slate-200 rounded text-[11px] font-medium"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className="py-5 border-b border-slate-200 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Professional Experience</span>
              </h2>
              <div className="space-y-4">
                {portfolioData.experiences.map((exp, idx) => (
                  <div key={idx} className="text-xs space-y-1">
                    <div className="flex flex-wrap items-center justify-between font-bold text-slate-900">
                      <span className="text-sm font-extrabold text-slate-900">{exp.role}</span>
                      <span className="text-slate-500 font-normal">{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-700 font-semibold">
                      <span>{exp.company}</span>
                      <span>•</span>
                      <span className="text-slate-500 font-normal">{exp.location} ({exp.type})</span>
                    </div>
                    <p className="text-slate-600 pt-0.5 leading-relaxed">{exp.description}</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 pt-1">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="leading-snug">{ach}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {exp.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Projects */}
            <div className="py-5 border-b border-slate-200 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Featured Software Projects</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {portfolioData.projects.slice(0, 4).map((proj) => (
                  <div key={proj.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{proj.title}</span>
                      <span className="text-[10px] font-normal px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                        {proj.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1 font-mono text-[9px] text-slate-600">
                      {proj.tags.slice(0, 3).map((t, i) => (
                        <span key={i} className="px-1 bg-white border border-slate-200 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="pt-5 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {portfolioData.education.map((edu, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">{edu.degree}</span>
                    <span className="text-amber-700 font-medium block">{edu.institution}</span>
                    <span className="text-slate-500 text-[11px] block">{edu.period} • {edu.location}</span>
                    <p className="text-slate-600 text-[11px] pt-1">{edu.details}</p>
                  </div>
                ))}
                {portfolioData.certifications && portfolioData.certifications.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Credentials</span>
                    {portfolioData.certifications.map((c, i) => (
                      <div key={i} className="text-slate-600 text-[11px]">
                        • {c.name} - {c.issuer} ({c.year})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
