import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Mail, 
  CheckCircle, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare, 
  MapPin, 
  Facebook, 
  Instagram, 
  Github 
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { fireConfetti } from '../utils/confetti';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Project Opportunity', message: '' });
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.developer.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fireConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#11131c] border border-amber-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#202538] bg-[#141724]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-base">Hire / Contact Mishuk Babu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Quick Contact & Location Bar */}
          <div className="space-y-2">
            <div className="bg-[#0b0c10] p-3 rounded-xl border border-[#22273d] flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-mono text-slate-300 truncate">{portfolioData.developer.email}</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Direct Connect Chips */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <a
                href={portfolioData.developer.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#0b0c10] border border-[#22273d] hover:border-emerald-500/40 text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">WhatsApp: @mishuk_babu_shoukhin</span>
              </a>

              <div className="p-2 rounded-lg bg-[#0b0c10] border border-[#22273d] text-slate-300 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{portfolioData.developer.location}</span>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-emerald-300 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-base">Message Sent Successfully!</p>
              <p className="text-xs text-emerald-300/80">
                Thank you for reaching out. Mishuk will get back to you promptly at your email address.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-[#2b3046] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-[#2b3046] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Message / Requirements</label>
                <textarea
                  rows={3}
                  required
                  placeholder="We are looking for a Web & Software Developer for..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-[#2b3046] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href={`mailto:${portfolioData.developer.email}?subject=Project%20Inquiry`}
                  className="text-slate-400 hover:text-amber-400 font-mono text-[11px] underline"
                >
                  Or open default mail client
                </a>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
