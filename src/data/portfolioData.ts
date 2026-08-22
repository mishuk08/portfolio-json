import { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
  developer: {
    name: "Mishuk Babu Shoukhin",
    role: "Web & Software Developer",
    tagline: "Crafting scalable web architectures, modern reactive frontends, and resilient backend systems.",
    status: "Available for full time",
    avatar: "/avatar.png",
    email: "mishukbabushoukhin@gmail.com",
    phone: "+880 1700-000000",
    location: "Rangpur, Bangladesh",
    yearsOfExperience: 4,
    bio: [
      "I am a passionate Web & Software Developer with a track record of designing, building, and deploying scalable full-stack applications.",
      "Specializing in modern JavaScript/TypeScript ecosystems (React, Next.js, Node.js, Express) combined with robust SQL/NoSQL databases, microservices, and cloud deployment pipelines.",
      "Dedicated to writing clean, maintainable code, optimizing runtime performance, and delivering frictionless user experiences."
    ],
    socials: {
      github: "https://www.github.com/mishuk08",
      linkedin: "https://linkedin.com",
      facebook: "https://www.facebook.com/mishuk008",
      instagram: "https://www.instagram.com/mi_sh_uk_008",
      twitter: "https://twitter.com",
      whatsapp: "https://wa.me/?text=Hi%20Mishuk%20Babu%20Shoukhin%20(@mishuk_babu_shoukhin)%2C%20contacting%20from%20portfolio",
      whatsappUsername: "mishuk_babu_shoukhin",
      portfolio: "https://mishuk-dev.io"
    }
  },
  skills: [
    {
      category: "Frontend Development",
      icon: "Layout",
      skills: [
        { name: "React 19 / Next.js", level: 95, experience: "4+ yrs", badge: "Expert" },
        { name: "TypeScript / JavaScript ES6+", level: 92, experience: "4+ yrs", badge: "Expert" },
        { name: "Tailwind CSS / CSS3 / SASS", level: 95, experience: "4+ yrs", badge: "Expert" },
        { name: "State Management (Redux/Zustand)", level: 88, experience: "3+ yrs", badge: "Advanced" },
        { name: "Motion / Animation / SVG", level: 85, experience: "3+ yrs", badge: "Advanced" },
        { name: "HTML5 / Web Accessibility (a11y)", level: 95, experience: "4+ yrs", badge: "Expert" }
      ]
    },
    {
      category: "Backend & Systems",
      icon: "Server",
      skills: [
        { name: "Node.js & Express.js", level: 92, experience: "4+ yrs", badge: "Expert" },
        { name: "RESTful APIs & GraphQL", level: 90, experience: "3+ yrs", badge: "Expert" },
        { name: "Python / FastAPI / Django", level: 80, experience: "2+ yrs", badge: "Proficient" },
        { name: "Authentication (OAuth, JWT, RBAC)", level: 88, experience: "3+ yrs", badge: "Advanced" },
        { name: "Real-time WebSockets / Socket.io", level: 85, experience: "3+ yrs", badge: "Advanced" }
      ]
    },
    {
      category: "Databases & ORMs",
      icon: "Database",
      skills: [
        { name: "PostgreSQL / Cloud SQL", level: 88, experience: "3+ yrs", badge: "Advanced" },
        { name: "MongoDB & Mongoose", level: 90, experience: "4+ yrs", badge: "Expert" },
        { name: "Redis (Caching & Queues)", level: 82, experience: "2+ yrs", badge: "Proficient" },
        { name: "Prisma & Drizzle ORM", level: 85, experience: "2+ yrs", badge: "Advanced" },
        { name: "Firebase / Firestore", level: 90, experience: "3+ yrs", badge: "Expert" }
      ]
    },
    {
      category: "DevOps, Cloud & Tools",
      icon: "Terminal",
      skills: [
        { name: "Git, GitHub & Version Control", level: 95, experience: "4+ yrs", badge: "Expert" },
        { name: "Docker & Containerization", level: 80, experience: "2+ yrs", badge: "Proficient" },
        { name: "CI/CD (GitHub Actions)", level: 82, experience: "2+ yrs", badge: "Proficient" },
        { name: "Vercel / Cloud Run / Linux VPS", level: 88, experience: "3+ yrs", badge: "Advanced" },
        { name: "Vite / Webpack / Tooling", level: 90, experience: "4+ yrs", badge: "Expert" }
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
    },
    {
      id: "devhub-cloud",
      title: "DevHub Cloud Management Platform",
      tagline: "High-performance dashboard for server telemetry, microservices orchestration, and log inspection.",
      description: "An enterprise-grade developer cockpit that monitors cloud instances, live memory/CPU consumption, docker containers, and automated deployment pipelines with sub-second alert triggers.",
      category: "Full-Stack",
      tags: ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "WebSockets", "Docker"],
      githubUrl: "https://github.com/mishuk08",
      liveUrl: "https://github.com/mishuk08",
      featured: true,
      metrics: "99.98% Telemetry Uptime, <50ms Stream Latency",
      highlights: [
        "Architected modular microservices backend with rate-limiting and JWT auth",
        "Built real-time SVG charting engine for live CPU & RAM usage telemetry",
        "Designed dark-mode developer UI with customized keyboard shortcuts"
      ]
    },
    {
      id: "shopsphere-commerce",
      title: "ShopSphere Enterprise E-Commerce",
      tagline: "Blazing fast headless commerce platform with instant search and automated inventory sync.",
      description: "A production-grade e-commerce application featuring dynamic product filtering, Redis-cached catalog queries, multi-currency checkout, and order lifecycle management.",
      category: "Full-Stack",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Stripe API", "Tailwind CSS"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com/shopsphere",
      featured: true,
      metrics: "Sub-100ms Page Load, 10k+ SKU Catalog Support",
      highlights: [
        "Implemented Redis caching layer reducing database queries by 65%",
        "Integrated secure Stripe webhook processing for idempotent order fulfillment",
        "Created an administrative inventory manager with instant CSV batch upload"
      ]
    },
    {
      id: "nexus-ai-engine",
      title: "Nexus AI Code Intelligence Engine",
      tagline: "Developer assistant for automated code refactoring, AST linting, and smart doc generation.",
      description: "An interactive AI coding assistant that parses source code files, identifies anti-patterns, generates unit test suites, and streams real-time syntax improvements directly to the user.",
      category: "AI & Tools",
      tags: ["React 19", "FastAPI", "Python", "Gemini API", "TypeScript", "Monaco Editor"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com/nexus-ai",
      featured: true,
      metrics: "Over 5,000 code snippets analyzed daily",
      highlights: [
        "Connected streaming LLM backend with custom context window optimization",
        "Constructed abstract syntax tree (AST) validator for real-time error detection",
        "Delivered a friction-free IDE web canvas with copyable diffs"
      ]
    },
    {
      id: "taskflow-pro",
      title: "TaskFlow Pro - Real-Time Kanban",
      tagline: "Collaborative project management board with live cursors, drag & drop, and sprint analytics.",
      description: "A real-time workspace collaboration tool allowing cross-functional engineering teams to organize sprint backlogs, track velocity charts, and coordinate with instant sync.",
      category: "Frontend",
      tags: ["React", "Motion", "Tailwind CSS", "Socket.io", "MongoDB", "Express"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com/taskflow",
      featured: false,
      metrics: "Live multi-user drag-drop under 15ms broadcast delay",
      highlights: [
        "Implemented optimistic UI updates for snappy drag-and-drop card interactions",
        "Created custom sprint burndown and velocity analytics visualizers",
        "Added role-based permissions for workspace admins, managers, and contributors"
      ]
    },
    {
      id: "pulse-api-gateway",
      title: "Pulse API Gateway & Rate Limiter",
      tagline: "Lightweight reverse proxy and security layer with distributed token-bucket rate limiting.",
      description: "A resilient middleware service written in TypeScript and Node.js designed to protect upstream REST and GraphQL endpoints against DDoS, scrapers, and spike traffic.",
      category: "Backend",
      tags: ["Node.js", "TypeScript", "Redis", "Docker", "Jest", "Prometheus"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com/pulse-gateway",
      featured: false,
      metrics: "Handles 15,000+ requests/sec with zero packet drops",
      highlights: [
        "Implemented distributed sliding-window token bucket algorithm with Redis",
        "Built automated Prometheus metrics exporter for Grafana dashboards",
        "Achieved 100% test coverage with Jest and Supertest suite"
      ]
    },
    {
      id: "cryptotrack-live",
      title: "CryptoTrack Financial Visualizer",
      tagline: "Live market analytics, order book visualizer, and customizable price threshold alerts.",
      description: "Comprehensive financial data dashboard streaming real-time cryptocurrency tick data, candlestick charts, portfolio PnL calculator, and browser push alerts.",
      category: "Frontend",
      tags: ["React", "TypeScript", "D3.js / Recharts", "Tailwind CSS", "WebSockets"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com/cryptotrack",
      featured: false,
      metrics: "Real-time 60fps streaming candlestick updates",
      highlights: [
        "Engineered smooth Canvas & SVG rendering for multi-timeframe candle charts",
        "Created local persistent portfolio storage with profit/loss analytics",
        "Integrated high-frequency Binance WebSocket live streams"
      ]
    }
  ],
  experiences: [
    {
      role: "Lead Full-Stack Web & Software Developer",
      company: "InnovateTech Solutions",
      period: "2023 - Present",
      location: "Dhaka / Remote",
      type: "Full-time",
      description: "Leading the engineering team in designing and scaling client web platforms, SaaS applications, and high-load REST APIs.",
      achievements: [
        "Spearheaded the migration of legacy monolith to modular React + Node.js architecture, improving time-to-market by 40%",
        "Mentored junior developers, instituted strict TypeScript guidelines and automated CI/CD workflows",
        "Optimized database query performance, reducing 95th percentile response times from 420ms to 85ms"
      ],
      technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS"]
    },
    {
      role: "Software Developer & Frontend Engineer",
      company: "CodeCraft Studios",
      period: "2021 - 2023",
      location: "Remote",
      type: "Full-time",
      description: "Built responsive frontend architectures, RESTful API integrations, and customized dashboard interfaces for enterprise clients.",
      achievements: [
        "Delivered 18+ high-conversion responsive web applications with 100% client satisfaction scores",
        "Implemented real-time WebSocket communication modules for collaborative dashboards",
        "Reduced bundle sizes by 35% through code splitting, tree shaking, and asset optimization"
      ],
      technologies: ["React", "JavaScript ES6+", "Express.js", "MongoDB", "Redux", "Tailwind CSS", "Git"]
    },
    {
      role: "Independent Software Consultant & Freelance Developer",
      company: "Self-Employed",
      period: "2020 - 2021",
      location: "Global Remote",
      type: "Freelance",
      description: "Designed custom software solutions, landing pages, and backend automations for international startups and businesses.",
      achievements: [
        "Engineered customized e-commerce stores, custom CMS platforms, and API integrations",
        "Maintained 5-star ratings across project delivery, meeting deadlines consistently"
      ],
      technologies: ["HTML5/CSS3", "JavaScript", "React", "Node.js", "Firebase", "REST APIs"]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science & Engineering (CSE)",
      institution: "Reputed University of Engineering & Technology",
      period: "2018 - 2022",
      location: "Bangladesh",
      details: "Specialized in Data Structures, Algorithms, Software Engineering, Database Systems, Computer Networks, and Object-Oriented Architecture."
    }
  ],
  certifications: [
    { name: "Full Stack Web Development Professional", issuer: "Meta / Coursera", year: "2022" },
    { name: "Advanced TypeScript & React Patterns", issuer: "Frontend Masters", year: "2023" },
    { name: "Cloud Architecture & Docker Containerization", issuer: "Linux Foundation", year: "2024" }
  ],
  services: [
    {
      title: "Full-Stack Web App Development",
      description: "End-to-end web applications built with modern frameworks (React/Next.js), robust APIs (Node/Express), and high-performance databases.",
      icon: "Layers",
      deliverables: ["Custom Frontend & Backend Architecture", "Responsive Mobile-First UI", "Database Design & Optimization", "Deployment & CI/CD Setup"]
    },
    {
      title: "Frontend Engineering & UI/UX",
      description: "Pixel-perfect, lightning-fast interfaces crafted with modern React, Tailwind CSS, TypeScript, and fluid animations.",
      icon: "Smartphone",
      deliverables: ["Interactive Dashboards", "Component Library Development", "Core Web Vitals Optimization", "Accessibility (WCAG) Compliance"]
    },
    {
      title: "API Development & Microservices",
      description: "Secure, documented, and scalable REST & GraphQL APIs with authentication, caching, rate-limiting, and 3rd party integrations.",
      icon: "Cpu",
      deliverables: ["RESTful & GraphQL Endpoints", "Stripe/Payment Gateway Integration", "Redis Caching Layers", "Comprehensive OpenAPI / Swagger Docs"]
    },
    {
      title: "Performance Optimization & Auditing",
      description: "Profiling web apps to fix bottlenecks, slash page load times, resolve memory leaks, and strengthen security.",
      icon: "Zap",
      deliverables: ["Speed & Bundle Size Audits", "Database Query Profiling", "Security Hardening (OWASP)", "SEO & Metadata Enhancement"]
    }
  ]
};
