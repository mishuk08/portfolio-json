import { PortfolioData } from '../types';
import avatarImg from '../assets/avatar.png';

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
      "I am Mishuk Babu Shoukhin, a driven and passionate technologist focused on software engineering, modern web technologies, and computational problem solving.",
      "Dedicated to the craft of writing clean, maintainable code and building high-performance digital products with intuitive user experiences.",
      "Driven by continuous learning, strong architectural foundations, and transforming creative ideas into impactful software solutions."
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
      category: "Programming Foundations",
      icon: "Code2",
      skills: [
        { name: "JavaScript (ES6+)", status: "Learning", badge: "Learning" },
        { name: "TypeScript", status: "Learning", badge: "Learning" },
        { name: "HTML5 & CSS3", status: "Learning", badge: "Learning" },
        { name: "Python", status: "Learning", badge: "Learning" }
      ]
    },
    {
      category: "Web Engineering",
      icon: "Layout",
      skills: [
        { name: "React.js", status: "Learning", badge: "Learning" },
        { name: "Tailwind CSS", status: "Learning", badge: "Learning" },
        { name: "Node.js & Express", status: "Learning", badge: "Learning" },
        { name: "REST APIs & JSON", status: "Learning", badge: "Learning" }
      ]
    },
    {
      category: "Tools & Development",
      icon: "Terminal",
      skills: [
        { name: "Git & GitHub", status: "Learning", badge: "Learning" },
        { name: "Problem Solving & DSA", status: "Learning", badge: "Learning" },
        { name: "VS Code & Debugging", status: "Learning", badge: "Learning" },
        { name: "Vercel Deployment", status: "Learning", badge: "Learning" }
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

