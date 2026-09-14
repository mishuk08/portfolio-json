import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  MessageSquare, 
  CornerDownLeft, 
  User, 
  RotateCcw,
  Layers,
  Code2,
  GraduationCap,
  Briefcase,
  Mail
} from 'lucide-react';
import { PortfolioData, ThemeMode } from '../types';
import { motion } from 'motion/react';

interface ElloChatProps {
  portfolioData: PortfolioData;
  themeMode?: ThemeMode;
  onOpenProject?: (projectId: string) => void;
  onOpenContact?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ello';
  text: string;
  timestamp: string;
  category?: 'skills' | 'projects' | 'experience' | 'education' | 'contact' | 'out-of-scope' | 'general';
  quickActions?: { label: string; action: () => void }[];
}

export const ElloChatWidget: React.FC<ElloChatProps> = ({
  portfolioData,
  themeMode = 'dark',
  onOpenProject,
  onOpenContact
}) => {
  const isDark = themeMode === 'dark';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ello',
      text: `Hello! 👋 I am Ello, Mishuk Babu Shoukhin's Personal Assistant.\n\nI can answer anything about Mishuk's Skills, Projects, Work Experience, Educational Background, or Contact details. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'general'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToBottom();
  }, [messages, isTyping]);

  const quickQuestions = [
    { label: '💼 Work Experience', query: 'What is Mishuk\'s work experience?' },
    { label: '⚡ Technical Skills', query: 'What programming languages and skills does Mishuk know?' },
    { label: '🎓 Education', query: 'What is Mishuk\'s educational background?' },
    { label: '🚀 Top Projects', query: 'Tell me about Mishuk\'s top projects' },
    { label: '📬 Contact Info', query: 'How can I contact or hire Mishuk?' }
  ];

  // Knowledge base resolution engine for Ello
  const generateElloResponse = (query: string): { text: string; category: ChatMessage['category'] } => {
    const q = query.toLowerCase().trim();

    // Out of scope detection: queries unrelated to Mishuk's portfolio
    const isBengali = /[\u0980-\u09FF]/.test(query);

    const portfolioKeywords = [
      'mishuk', 'babu', 'shoukhin', 'skill', 'skills', 'experience', 'work', 'job', 'company', 
      'project', 'projects', 'education', 'degree', 'university', 'study', 'college', 'school',
      'contact', 'hire', 'email', 'phone', 'location', 'tech', 'stack', 'frontend', 'backend',
      'react', 'node', 'database', 'devops', 'about', 'bio', 'who', 'role', 'resume', 'cv',
      'service', 'services', 'full-stack', 'developer', 'portfolio', 'expert', 'profile', 'ello',
      'hi', 'hello', 'hey', 'salam', 'assalamu', 'kemon', 'valo', 'help', 'ki', 'koren', 'dosh'
    ];

    const isRelated = portfolioKeywords.some(keyword => q.includes(keyword)) ||
      q.length < 10 ||
      q.includes('?') && (q.includes('you') || q.includes('he') || q.includes('his'));

    // Check for clearly unrelated general knowledge/topics
    const unrelatedKeywords = [
      'weather', 'capital of', 'recipe', 'cook', 'president', 'movie', 'song', 'lyrics',
      'cricket score', 'football score', 'write code for', 'generate python script', 'politics',
      'chatgpt', 'openai', 'biology', 'chemistry', 'math problem', 'solve this equation',
      'translate to spanish', 'joke about animals', 'bitcoin price prediction', 'who won'
    ];

    const isExplicitlyUnrelated = unrelatedKeywords.some(kw => q.includes(kw));

    if (isExplicitlyUnrelated || (!isRelated && q.split(' ').length > 2)) {
      if (isBengali) {
        return {
          text: `আমি এলো (Ello), মিশুক বাবুর পার্সোনাল অ্যাসিস্ট্যান্ট। 😊\n\nআমি শুধুমাত্র মিশুক বাবুর পোর্টফোলিও, প্রজেক্ট, টেকনিক্যাল স্কিল, শিক্ষাগত যোগ্যতা (Education) এবং কাজের অভিজ্ঞতা (Work Experience) সম্পর্কিত প্রশ্নের উত্তর দিতে পারি।\n\nমিশুক বাবুর যেকোনো তথ্য জানতে আমাকে প্রশ্ন করতে পারেন!`,
          category: 'out-of-scope'
        };
      }
      return {
        text: `I am Ello, Mishuk Babu Shoukhin's Personal Assistant. 😊\n\nI have complete information regarding Mishuk's portfolio, skills, projects, work experience, education, and contact details.\n\nFeel free to ask me anything about Mishuk's engineering work or background!`,
        category: 'out-of-scope'
      };
    }

    // Education inquiry
    if (q.includes('education') || q.includes('degree') || q.includes('university') || q.includes('study') || q.includes('college') || q.includes('school') || q.includes('academic') || q.includes('shikkha') || q.includes('ssc') || q.includes('hsc')) {
      const eduList = portfolioData.education.map(e => 
        `• Degree: ${e.degree}\n  Institution: ${e.institution} (${e.location})\n  Timeline: ${e.period}\n  Details: ${e.details}`
      ).join('\n\n');
      return {
        text: `🎓 Mishuk's Educational Background:\n\n${eduList}`,
        category: 'education'
      };
    }

    // Work Experience inquiry
    if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('career') || q.includes('company') || q.includes('robosuperior') || q.includes('history') || q.includes('obhiggota')) {
      const expList = portfolioData.experiences.map((exp, i) => 
        `${i + 1}. Role: ${exp.role} at ${exp.company} (RoboSuperior.org) [${exp.period}]\n   Type: ${exp.type} | Location: ${exp.location}\n   Focus: ${exp.description}\n   Tech Stack: ${exp.technologies.join(', ')}`
      ).join('\n\n');
      return {
        text: `💼 Mishuk's Professional Work Experience:\n\n${expList}`,
        category: 'experience'
      };
    }

    // Skills inquiry
    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('frontend') || q.includes('backend') || q.includes('database') || q.includes('react') || q.includes('node') || q.includes('tools') || q.includes('coding')) {
      const skillSummary = portfolioData.skills.map(cat => 
        `• ${cat.category}: ${cat.skills.map(s => `${s.name} [${s.status || 'Learning'}]`).join(', ')}`
      ).join('\n\n');
      return {
        text: `⚡ Coding Foundations & Technical Skills (Learning):\n\n${skillSummary}\n\nFocused on mastering core computer science foundations, modern web engineering with React, TypeScript, Node.js, and software development at RoboSuperior.`,
        category: 'skills'
      };
    }

    // Projects inquiry
    if (q.includes('project') || q.includes('projects') || q.includes('portfolio') || q.includes('build') || q.includes('apps') || q.includes('devhub') || q.includes('shopsphere') || q.includes('nexus')) {
      const projList = portfolioData.projects.slice(0, 4).map((p, i) => 
        `${i + 1}. ${p.title} [${p.category}]\n   Summary: ${p.tagline}\n   Stack: ${p.tags.slice(0, 4).join(', ')}\n   Metric: ${p.metrics || 'Production Ready'}`
      ).join('\n\n');
      return {
        text: `🚀 Featured Projects Built by Mishuk:\n\n${projList}\n\nYou can click on any project in the portfolio to view the full system architecture and live demo!`,
        category: 'projects'
      };
    }

    // Contact & Hiring inquiry
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('phone') || q.includes('whatsapp') || q.includes('linkedin') || q.includes('github') || q.includes('location')) {
      return {
        text: `📬 How to Contact & Hire Mishuk:\n\n• Email: ${portfolioData.developer.email}\n• Location: ${portfolioData.developer.location}\n• Status: ${portfolioData.developer.status}\n• WhatsApp: @mishuk_babu_shoukhin\n• GitHub: ${portfolioData.developer.socials.github}\n• LinkedIn: ${portfolioData.developer.socials.linkedin}\n\nYou can also submit a direct message using the contact form below!`,
        category: 'contact'
      };
    }

    // About / Bio inquiry
    if (q.includes('about') || q.includes('who is') || q.includes('bio') || q.includes('mishuk') || q.includes('shoukhin') || q.includes('role')) {
      return {
        text: `👋 About Mishuk Babu Shoukhin:\n\n${portfolioData.developer.bio.join('\n\n')}\n\n• Role: ${portfolioData.developer.role}\n• Location: ${portfolioData.developer.location}\n• Core Philosophy: Software craftsmanship, continuous learning, and clean code.`,
        category: 'general'
      };
    }

    // Default friendly portfolio greeting
    return {
      text: `Hello! I am Ello, Mishuk's Personal Assistant. I can give you detailed information about:\n\n1. 💼 Work Experience & Past Roles\n2. ⚡ Technical Skills & Tools\n3. 🎓 Educational Background\n4. 🚀 Featured Projects & Architecture\n5. 📬 Contact & Hiring Options\n\nWhat would you like to explore?`,
      category: 'general'
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.replace(/\*/g, ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateElloResponse(query);
      const elloMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ello',
        text: response.text.replace(/\*/g, ''),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: response.category
      };
      setMessages(prev => [...prev, elloMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ello',
        text: `Hello! 👋 I am Ello, Mishuk Babu Shoukhin's Personal Assistant.\n\nI can answer anything about Mishuk's Skills, Projects, Work Experience, Educational Background, or Contact details. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'general'
      }
    ]);
  };

  return (
    <div className={`rounded-2xl border transition-colors overflow-hidden flex flex-col h-[520px] max-h-[600px] w-full shadow-lg ${
      isDark 
        ? 'bg-[#10121a] border-[#22273d]' 
        : 'bg-white border-slate-200 shadow-md'
    }`}>
      {/* Ello Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${
        isDark 
          ? 'bg-[#151824] border-[#202538]' 
          : 'bg-amber-500/10 border-amber-500/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#10121a] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Ello
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold">
                Portfolio AI
              </span>
            </div>
            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Mishuk's Personal Assistant
            </div>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 ${
            isDark 
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Reset Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col gpu-layer ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[90%] sm:max-w-[85%]">
              {msg.sender === 'ello' && (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-amber-500" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs'
                    : isDark
                      ? 'bg-[#181b28] border border-[#272e45] text-slate-200 rounded-tl-xs'
                      : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
            <span className={`text-[10px] mt-1 px-2 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {msg.timestamp}
            </span>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className={`px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 ${
              isDark ? 'bg-[#181b28] text-slate-400 border border-[#272e45]' : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] ml-1">Ello is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar ${
        isDark ? 'bg-[#131520] border-[#1d2235]' : 'bg-slate-50 border-slate-200'
      }`}>
        <span className={`text-[10px] font-mono shrink-0 font-bold uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Ask:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.query)}
            className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer border shrink-0 ${
              isDark
                ? 'bg-[#191c2c] hover:bg-[#23283e] text-slate-300 border-[#2a314d]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className={`p-2.5 border-t flex items-center gap-2 ${
          isDark ? 'bg-[#151824] border-[#22273c]' : 'bg-white border-slate-200'
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Ello anything about Mishuk's portfolio..."
          className={`flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
            isDark
              ? 'bg-[#0d0e14] border-[#292f47] text-slate-200 placeholder-slate-500'
              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
          }`}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 transition-colors cursor-pointer shrink-0 shadow-xs"
          title="Send Question"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
