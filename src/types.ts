export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Full-Stack' | 'Frontend' | 'Backend' | 'AI & Tools';
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  metrics?: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: {
    name: string;
    level: number; // 1-100
    experience: string;
    badge?: string;
  }[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  type: 'Full-time' | 'Remote' | 'Freelance';
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  details: string;
}

export interface PortfolioData {
  developer: {
    name: string;
    role: string;
    tagline: string;
    status: string;
    avatar?: string;
    email: string;
    phone: string;
    location: string;
    yearsOfExperience: number;
    bio: string[];
    socials: {
      github: string;
      linkedin: string;
      facebook: string;
      instagram: string;
      twitter: string;
      whatsapp: string;
      whatsappUsername?: string;
      portfolio: string;
    };
  };
  skills: SkillCategory[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
  }[];
  services: {
    title: string;
    description: string;
    icon: string;
    deliverables: string[];
  }[];
}

export type EditorTabId = 'portfolio.json' | 'about.tsx' | 'projects.ts' | 'skills.json' | 'experience.json' | 'contact.sh' | 'terminal';

export type ViewMode = 'preview' | 'editor';

export type ThemeMode = 'dark' | 'light';

export type EditorTheme = 'dark-ide' | 'cyberpunk' | 'tokyo-night' | 'monokai' | 'matrix';
