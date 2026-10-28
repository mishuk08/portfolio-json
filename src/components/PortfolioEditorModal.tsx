import React, { useState } from 'react';
import { X, Save, Sparkles, User, Briefcase, GraduationCap, Code2, Layers, RotateCcw } from 'lucide-react';
import { PortfolioData, ThemeMode } from '../types';
import { fireConfetti } from '../utils/confetti';

interface PortfolioEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioData: PortfolioData;
  onSave: (updatedData: PortfolioData) => void;
  onReset: () => void;
  themeMode?: ThemeMode;
}

export const PortfolioEditorModal: React.FC<PortfolioEditorModalProps> = ({
  isOpen,
  onClose,
  portfolioData,
  onSave,
  onReset,
  themeMode = 'dark'
}) => {
  if (!isOpen) return null;

  const isDark = themeMode === 'dark';
  const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'experience' | 'skills'>('profile');
  const [formData, setFormData] = useState<PortfolioData>(JSON.parse(JSON.stringify(portfolioData)));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    fireConfetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`relative w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
        isDark ? 'bg-[#0f1118] border-[#22273d] text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isDark ? 'bg-[#141724] border-[#1f2438]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Customize & Edit Portfolio Data
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Changes sync live to GUI Mode, JSON Mode & Downloadable CV
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex items-center gap-2 px-5 py-2.5 border-b overflow-x-auto ${
          isDark ? 'bg-[#11131e] border-[#1c2032]' : 'bg-slate-100/70 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Bio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('education')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'education'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Education</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'experience'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Experience</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'skills'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skills</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Developer Name</label>
                  <input
                    type="text"
                    value={formData.developer.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      developer: { ...formData.developer, name: e.target.value }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-amber-500 ${
                      isDark ? 'bg-[#151824] border-[#2a3048] text-slate-200' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Professional Role</label>
                  <input
                    type="text"
                    value={formData.developer.role}
                    onChange={(e) => setFormData({
                      ...formData,
                      developer: { ...formData.developer, role: e.target.value }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-amber-500 ${
                      isDark ? 'bg-[#151824] border-[#2a3048] text-slate-200' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.developer.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      developer: { ...formData.developer, email: e.target.value }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-amber-500 ${
                      isDark ? 'bg-[#151824] border-[#2a3048] text-slate-200' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.developer.location}
                    onChange={(e) => setFormData({
                      ...formData,
                      developer: { ...formData.developer, location: e.target.value }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-amber-500 ${
                      isDark ? 'bg-[#151824] border-[#2a3048] text-slate-200' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={formData.developer.yearsOfExperience}
                    onChange={(e) => setFormData({
                      ...formData,
                      developer: { ...formData.developer, yearsOfExperience: Number(e.target.value) }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-amber-500 ${
                      isDark ? 'bg-[#151824] border-[#2a3048] text-slate-200' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">WhatsApp URL</label>
                  <input
                    type="text"
                    value={formData.developer.socials.whatsapp}
                    onChange={(e) => setFormData({
                      ...formData,
                      developer: {
                        ...formData.developer,
                        socials: { ...formData.developer.socials, whatsapp: e.target.value }
                      }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-amber-500 ${
                      isDark ? 'bg-[#151824] border-[#2a3048] text-slate-200' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Hero Tagline</label>
                <input
                  type="text"
                  value={formData.developer.tagline}
                  onChange={(e) => setFormData({
                    ...formData,
                    developer: { ...formData.developer, tagline: e.target.value }
                  })}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-amber-500 ${
                    isDark ? 'bg-[#151824] border-[#2a3048] text-slate-200' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Biography Paragraphs (one per line)</label>
                <textarea
                  rows={4}
                  value={formData.developer.bio.join('\n')}
                  onChange={(e) => setFormData({
                    ...formData,
                    developer: { ...formData.developer, bio: e.target.value.split('\n').filter(Boolean) }
                  })}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:border-amber-500 ${
                    isDark ? 'bg-[#151824] border-[#2a3048] text-slate-200' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-bold text-amber-500">Degree & Academic Information</h3>
                {formData.education.map((edu, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border space-y-3 ${
                    isDark ? 'bg-[#151824] border-[#272d42]' : 'bg-slate-50 border-slate-300'
                  }`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium mb-1">Degree Title</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...formData.education];
                            newEdu[idx].degree = e.target.value;
                            setFormData({ ...formData, education: newEdu });
                          }}
                          className={`w-full px-3 py-1.5 rounded-lg border ${
                            isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">University / Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const newEdu = [...formData.education];
                            newEdu[idx].institution = e.target.value;
                            setFormData({ ...formData, education: newEdu });
                          }}
                          className={`w-full px-3 py-1.5 rounded-lg border ${
                            isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Time Period</label>
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => {
                            const newEdu = [...formData.education];
                            newEdu[idx].period = e.target.value;
                            setFormData({ ...formData, education: newEdu });
                          }}
                          className={`w-full px-3 py-1.5 rounded-lg border ${
                            isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const newEdu = [...formData.education];
                            newEdu[idx].location = e.target.value;
                            setFormData({ ...formData, education: newEdu });
                          }}
                          className={`w-full px-3 py-1.5 rounded-lg border ${
                            isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Coursework / Specialization Details</label>
                      <textarea
                        rows={2}
                        value={edu.details}
                        onChange={(e) => {
                          const newEdu = [...formData.education];
                          newEdu[idx].details = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg border ${
                          isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4">
              {formData.experiences.map((exp, idx) => (
                <div key={idx} className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#151824] border-[#272d42]' : 'bg-slate-50 border-slate-300'
                }`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">Role</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const newExp = [...formData.experiences];
                          newExp[idx].role = e.target.value;
                          setFormData({ ...formData, experiences: newExp });
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg border ${
                          isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...formData.experiences];
                          newExp[idx].company = e.target.value;
                          setFormData({ ...formData, experiences: newExp });
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg border ${
                          isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Timeline</label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const newExp = [...formData.experiences];
                          newExp[idx].period = e.target.value;
                          setFormData({ ...formData, experiences: newExp });
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg border ${
                          isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={exp.technologies.join(', ')}
                        onChange={(e) => {
                          const newExp = [...formData.experiences];
                          newExp[idx].technologies = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setFormData({ ...formData, experiences: newExp });
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg border ${
                          isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...formData.experiences];
                        newExp[idx].description = e.target.value;
                        setFormData({ ...formData, experiences: newExp });
                      }}
                      className={`w-full px-3 py-1.5 rounded-lg border ${
                        isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              {formData.skills.map((cat, cIdx) => (
                <div key={cIdx} className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#151824] border-[#272d42]' : 'bg-slate-50 border-slate-300'
                }`}>
                  <h4 className="font-bold text-amber-500">{cat.category}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const newSkills = [...formData.skills];
                            newSkills[cIdx].skills[sIdx].name = e.target.value;
                            setFormData({ ...formData, skills: newSkills });
                          }}
                          className={`flex-1 px-2.5 py-1 rounded border text-xs ${
                            isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                          }`}
                        />
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={skill.level}
                          onChange={(e) => {
                            const newSkills = [...formData.skills];
                            newSkills[cIdx].skills[sIdx].level = Number(e.target.value);
                            setFormData({ ...formData, skills: newSkills });
                          }}
                          className={`w-16 px-2 py-1 rounded border text-xs text-center ${
                            isDark ? 'bg-[#0d0e14] border-[#2d344d]' : 'bg-white border-slate-300'
                          }`}
                        />
                        <span className="text-xs font-mono">%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className={`pt-4 border-t flex items-center justify-between gap-3 ${
            isDark ? 'border-[#1f2438]' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => {
                onReset();
                setFormData(JSON.parse(JSON.stringify(portfolioData)));
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isDark ? 'border-[#2d344d] hover:bg-slate-800 text-slate-400' : 'border-slate-300 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer border ${
                  isDark ? 'border-[#2d344d] text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save & Sync All Modes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
