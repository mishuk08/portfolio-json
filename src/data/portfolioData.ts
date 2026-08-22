import { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
  developer: {
    name: "Mishuk Babu Shoukhin",
    role: "Web & Software Developer",
    tagline: "Dedicated Web & Software Developer passionate about building clean, performant, and scalable applications.",
    status: "Available for Projects & Collaboration",
    avatar: "/avatar.png",
    email: "mdmishukbabu192@gmail.com",
    phone: "+880 1700-000000",
    location: "Rangpur, Bangladesh",
    yearsOfExperience: 1,
    bio: [
      "I am a dedicated Web and Software Developer at RoboSuperior (RoboSuperior.org), focused on crafting high-quality web applications, responsive user interfaces, and robust software solutions.",
      "Committed to continuous growth and deep foundational mastery in modern computer science, algorithms, JavaScript/TypeScript ecosystems, React, and server-side technologies.",
      "Passionate about writing clean, maintainable code, problem solving, and transforming ideas into functional, user-centric digital products."
    ],
    socials: {
      github: "https://www.github.com/mishuk08",
      linkedin: "https://linkedin.com",
      facebook: "https://www.facebook.com/mishuk008",
      instagram: "https://www.instagram.com/mi_sh_uk_008",
      twitter: "https://twitter.com",
      whatsapp: "https://wa.me/?text=Hi%20Mishuk%20Babu%20Shoukhin%20(@mishuk_babu_shoukhin)%2C%20contacting%20from%20portfolio",
      whatsappUsername: "mishuk_babu_shoukhin",
      portfolio: "https://robosuperior.org"
    }
  },
  skills: [
    {
      category: "Programming & Core Foundations",
      icon: "Code2",
      skills: [
        { name: "JavaScript (ES6+)", status: "Learning", badge: "Learning" },
        { name: "TypeScript", status: "Learning", badge: "Learning" },
        { name: "HTML5 & Semantic Markup", status: "Learning", badge: "Learning" },
        { name: "CSS3 & Modern Layouts", status: "Learning", badge: "Learning" },
        { name: "Python", status: "Learning", badge: "Learning" },
        { name: "C / C++ Basics", status: "Learning", badge: "Learning" }
      ]
    },
    {
      category: "Frontend & Web Technologies",
      icon: "Layout",
      skills: [
        { name: "React.js", status: "Learning", badge: "Learning" },
        { name: "Tailwind CSS", status: "Learning", badge: "Learning" },
        { name: "Responsive Web Design", status: "Learning", badge: "Learning" },
        { name: "DOM Manipulation & Events", status: "Learning", badge: "Learning" },
        { name: "Fetch & RESTful API Integration", status: "Learning", badge: "Learning" },
        { name: "Single Page Applications (SPA)", status: "Learning", badge: "Learning" }
      ]
    },
    {
      category: "Backend & Systems Foundations",
      icon: "Server",
      skills: [
        { name: "Node.js", status: "Learning", badge: "Learning" },
        { name: "Express.js", status: "Learning", badge: "Learning" },
        { name: "REST API Architecture", status: "Learning", badge: "Learning" },
        { name: "JSON Data Handling", status: "Learning", badge: "Learning" },
        { name: "Server Basics & Routing", status: "Learning", badge: "Learning" },
        { name: "Database Concepts (SQL/NoSQL)", status: "Learning", badge: "Learning" }
      ]
    },
    {
      category: "CS Concepts & Development Tools",
      icon: "Terminal",
      skills: [
        { name: "Data Structures & Algorithms (DSA)", status: "Learning", badge: "Learning" },
        { name: "Problem Solving", status: "Learning", badge: "Learning" },
        { name: "Git & Version Control", status: "Learning", badge: "Learning" },
        { name: "GitHub Collaboration", status: "Learning", badge: "Learning" },
        { name: "VS Code & Debugging", status: "Learning", badge: "Learning" },
        { name: "Vercel & Web Deployment", status: "Learning", badge: "Learning" }
      ]
    }
  ],
  projects: [
    {
      id: "gh-cod_store",
      title: "Cod Store - Modern E-Commerce Platform",
      tagline: "High-performance headless online store with live cart, catalog filtering, and instant checkout.",
      description: "A full-stack e-commerce web application built with TypeScript, React, and modern web tooling. Live deployed at shopjms.vercel.app with complete shopping cart, responsive UI, dynamic catalog search, and modern design.",
      category: "Full-Stack",
      tags: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Vercel", "E-Commerce", "GitHub"],
      githubUrl: "https://github.com/mishuk08/cod_store",
      liveUrl: "https://shopjms.vercel.app",
      featured: true,
      metrics: "Live on Vercel • Synced with GitHub @mishuk08",
      highlights: [
        "Repository: github.com/mishuk08/cod_store",
        "Live Production Deployment: https://shopjms.vercel.app",
        "Modular TypeScript architecture with reactive state management and responsive styling"
      ]
    }
  ],
  experiences: [
    {
      role: "Web and Software Developer",
      company: "RoboSuperior",
      period: "2024 - Present",
      location: "Rangpur, Bangladesh",
      type: "Full-time",
      description: "Working as a Web and Software Developer at RoboSuperior (RoboSuperior.org), building modern web applications, interactive software features, and performant user interfaces.",
      achievements: [
        "Developing and maintaining web applications and software tools for RoboSuperior (RoboSuperior.org).",
        "Designing responsive, mobile-first interfaces using React, TypeScript, JavaScript, and Tailwind CSS.",
        "Collaborating with engineering team on software architecture, code reviews, and Git/GitHub version control workflows."
      ],
      technologies: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js", "Git", "GitHub", "RoboSuperior.org"]
    }
  ],
  education: [
    {
      degree: "Higher Secondary Certificate (HSC) - Science",
      institution: "Rangpur Chamber Of Commerce And Industry Public School And College, Rangpur",
      period: "2024 - 2027",
      location: "Rangpur, Bangladesh",
      details: "Pursuing Higher Secondary Certificate (HSC) in Science group with academic coursework in Higher Mathematics, Physics, Chemistry, and Information & Communication Technology (ICT)."
    },
    {
      degree: "Secondary School Certificate (SSC) - Science",
      institution: "Vagabatipur High School",
      period: "2024",
      location: "Bangladesh",
      details: "Successfully completed Secondary School Certificate (SSC) in Science group (2024) with foundational excellence in Science and Mathematics."
    }
  ],
  certifications: [],
  services: [
    {
      title: "Web Application Development",
      description: "Building responsive, modern, and high-performance web applications using React, TypeScript, and Tailwind CSS.",
      icon: "Layers",
      deliverables: ["Responsive User Interfaces", "Frontend Component Architecture", "REST API Integration", "Fast & Mobile-First Design"]
    },
    {
      title: "Software & Web Tools Development",
      description: "Developing clean and maintainable software tools, dashboards, and interactive web experiences.",
      icon: "Cpu",
      deliverables: ["Interactive Web Utilities", "Clean Code Structure", "GitHub Version Control", "Live Cloud Deployment on Vercel"]
    }
  ]
};

