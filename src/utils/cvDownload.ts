import { PortfolioData } from '../types';
import { portfolioData as defaultPortfolioData } from '../data/portfolioData';
import confetti from 'canvas-confetti';

export function downloadDeveloperCv(customData?: PortfolioData) {
  const data = customData || defaultPortfolioData;

  const cvText = `========================================================================
CURRICULUM VITAE - ${data.developer.name.toUpperCase()}
========================================================================

Role: ${data.developer.role}
Email: ${data.developer.email}
Location: ${data.developer.location}
Status: ${data.developer.status}
Experience: ${data.developer.yearsOfExperience} Years

GitHub: ${data.developer.socials.github}
LinkedIn: ${data.developer.socials.linkedin}
WhatsApp: ${data.developer.socials.whatsapp}

------------------------------------------------------------------------
EXECUTIVE SUMMARY
------------------------------------------------------------------------
${data.developer.tagline}

${data.developer.bio.join('\n\n')}

------------------------------------------------------------------------
EDUCATIONAL BACKGROUND & ACADEMIC ACHIEVEMENTS
------------------------------------------------------------------------
${data.education
  .map(
    (edu) =>
      `• Degree: ${edu.degree}\n  Institution: ${edu.institution} (${edu.location})\n  Period: ${edu.period}\n  Details: ${edu.details}`
  )
  .join('\n\n')}

Certifications:
${data.certifications
  .map((c) => `• ${c.name} - Issued by ${c.issuer} (${c.year})`)
  .join('\n')}

------------------------------------------------------------------------
PROFESSIONAL WORK EXPERIENCE
------------------------------------------------------------------------
${data.experiences
  .map(
    (exp, idx) =>
      `${idx + 1}. ${exp.role.toUpperCase()} | ${exp.company}
   Type: ${exp.type} | Period: ${exp.period} | Location: ${exp.location}
   Overview: ${exp.description}
   Key Achievements:
   ${exp.achievements.map((a) => `  - ${a}`).join('\n')}
   Technologies Used: ${exp.technologies.join(', ')}`
  )
  .join('\n\n')}

------------------------------------------------------------------------
TECHNICAL SKILLS & PROFICIENCIES
------------------------------------------------------------------------
${data.skills
  .map(
    (group) =>
      `• ${group.category.toUpperCase()}:\n  ${group.skills
        .map((s) => `${s.name} (${s.experience} exp - ${s.level}%)`)
        .join(', ')}`
  )
  .join('\n\n')}

------------------------------------------------------------------------
FEATURED PROJECTS & SOFTWARE ARCHITECTURE
------------------------------------------------------------------------
${data.projects
  .map(
    (p, i) =>
      `${i + 1}. ${p.title} [${p.category}]
   Summary: ${p.tagline}
   Description: ${p.description}
   Tech Stack: ${p.tags.join(', ')}
   GitHub: ${p.githubUrl}
   Live Demo: ${p.liveUrl}
   Metrics / Uptime: ${p.metrics || 'Production Ready'}`
  )
  .join('\n\n')}

------------------------------------------------------------------------
ENGINEERING SERVICES & DELIVERABLES
------------------------------------------------------------------------
${data.services
  .map(
    (s) =>
      `• ${s.title}:
  ${s.description}
  Deliverables: ${s.deliverables.join(' | ')}`
  )
  .join('\n\n')}

========================================================================
Generated dynamically from ${data.developer.name}'s Interactive Portfolio
========================================================================
`;

  const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `${data.developer.name.replace(/\s+/g, '_')}_CV.txt`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);

  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.7 }
  });
}
