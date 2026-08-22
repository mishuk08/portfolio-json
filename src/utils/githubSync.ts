import { Project } from '../types';

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  fork: boolean;
}

// Repositories explicitly excluded by the user: mishuk08 and RS_Employ_Hosting / RS_Employee_Hosting
const EXCLUDED_REPOS = ['mishuk08', 'rs_employ_hosting', 'rs_employee_hosting'];

function isExcludedRepo(repoName: string): boolean {
  const normalized = repoName.toLowerCase().replace(/[-_]/g, '_');
  return EXCLUDED_REPOS.some(ex => {
    const exNorm = ex.toLowerCase().replace(/[-_]/g, '_');
    return normalized === exNorm || normalized.includes('rs_employ');
  });
}

function formatTitle(repoName: string): string {
  if (repoName.toLowerCase() === 'cod_store') {
    return 'Cod Store - Modern E-Commerce Platform';
  }
  return repoName
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function determineCategory(repo: GithubRepo): 'Full-Stack' | 'Frontend' | 'Backend' | 'AI & Tools' {
  const lang = (repo.language || '').toLowerCase();
  const name = repo.name.toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  const topics = (repo.topics || []).map(t => t.toLowerCase());

  if (topics.some(t => t.includes('ai') || t.includes('gemini') || t.includes('ml')) || name.includes('ai') || desc.includes('ai')) {
    return 'AI & Tools';
  }
  if (lang === 'typescript' || lang === 'javascript' || desc.includes('full') || desc.includes('store') || desc.includes('app')) {
    return 'Full-Stack';
  }
  if (lang === 'python' || lang === 'go' || desc.includes('api') || desc.includes('server') || desc.includes('backend')) {
    return 'Backend';
  }
  return 'Frontend';
}

export function transformGithubRepoToProject(repo: GithubRepo): Project {
  const title = formatTitle(repo.name);
  const category = determineCategory(repo);
  
  const tags = Array.from(
    new Set([
      repo.language || 'TypeScript',
      ...(repo.topics || []),
      'React',
      'Tailwind CSS',
      'GitHub'
    ])
  ).slice(0, 6);

  const tagline = repo.description 
    ? (repo.description.length > 10 ? repo.description : `${title} built with modern reactive web technologies.`)
    : `Production web application created and maintained by Mishuk Babu Shoukhin.`;

  const description = repo.description && repo.description.length > 20
    ? repo.description
    : `An open-source software project built by Mishuk Babu Shoukhin (@mishuk08) showcasing modern architecture, clean code structure, responsive design, and version-controlled Git workflow.`;

  const liveUrl = repo.homepage && repo.homepage.trim().length > 0 ? repo.homepage : repo.html_url;

  return {
    id: `gh-${repo.name.toLowerCase()}`,
    title,
    tagline,
    description,
    category,
    tags,
    githubUrl: repo.html_url,
    liveUrl,
    featured: true,
    metrics: `Stars: ${repo.stargazers_count} • Forks: ${repo.forks_count} • Synced with GitHub`,
    highlights: [
      `Repository: github.com/mishuk08/${repo.name}`,
      `Primary Architecture: ${repo.language || 'TypeScript / JavaScript'}`,
      repo.homepage ? `Live production demo: ${repo.homepage}` : `Complete source code and commit history on GitHub`
    ]
  };
}

const GITHUB_CACHE_KEY = 'mishuk_github_projects_cache_v2';

/**
 * Fetches all public repos from GitHub user @mishuk08,
 * strictly filtering out 'mishuk08' and 'RS_Employ_Hosting' / 'RS_Employee_Hosting'.
 */
export async function syncGithubProjects(username = 'mishuk08'): Promise<{
  projects: Project[];
  repoCount: number;
  lastSynced: string;
  source: 'live' | 'cache' | 'default';
}> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (res.ok) {
      const rawRepos: GithubRepo[] = await res.json();
      
      const filteredRepos = rawRepos.filter(repo => !isExcludedRepo(repo.name));
      const transformedProjects = filteredRepos.map(transformGithubRepoToProject);

      const syncResult = {
        projects: transformedProjects,
        repoCount: filteredRepos.length,
        lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'live' as const
      };

      try {
        localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(syncResult));
      } catch (err) {
        console.warn('LocalStorage error caching GitHub repos:', err);
      }

      return syncResult;
    }
  } catch (error) {
    console.warn('Live GitHub sync error, checking cache:', error);
  }

  // Check cached data
  try {
    const cached = localStorage.getItem(GITHUB_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        return {
          ...parsed,
          source: 'cache' as const
        };
      }
    }
  } catch (cacheErr) {
    console.warn('Cache read error:', cacheErr);
  }

  // Fallback defaults if GitHub API cannot be reached
  const defaultCodStore: Project = {
    id: 'gh-cod_store',
    title: 'Cod Store - Modern E-Commerce Platform',
    tagline: 'High-performance headless online store with live inventory and fast checkout.',
    description: 'A full-stack e-commerce web application built with TypeScript, React, and modern web tooling. Live deployed at shopjms.vercel.app with complete cart, catalog filtering, and responsive UI.',
    category: 'Full-Stack',
    tags: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Vercel', 'E-Commerce'],
    githubUrl: 'https://github.com/mishuk08/cod_store',
    liveUrl: 'https://shopjms.vercel.app',
    featured: true,
    metrics: 'Active GitHub Repository • Live on Vercel',
    highlights: [
      'Repository: github.com/mishuk08/cod_store',
      'Live deployed store: https://shopjms.vercel.app',
      'Clean TypeScript modular component architecture'
    ]
  };

  return {
    projects: [defaultCodStore],
    repoCount: 1,
    lastSynced: 'Default Seed',
    source: 'default' as const
  };
}
