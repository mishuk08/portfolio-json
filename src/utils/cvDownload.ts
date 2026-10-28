import { PortfolioData } from '../types';
import { portfolioData as defaultPortfolioData } from '../data/portfolioData';
import { fireConfetti } from './confetti';
import avatarImg from '../assets/avatar_optimized.webp';

/**
 * Loads an image from multiple candidate sources and returns a base64 DataURL
 * suitable for embedding directly into jsPDF or canvas rendering.
 */
async function loadPhotoDataUrl(photoSrc?: string): Promise<string | null> {
  const candidateUrls = [
    photoSrc,
    avatarImg,
    '/avatar_optimized.webp',
    '/avatar2_optimized.webp'
  ].filter(Boolean) as string[];

  for (const src of candidateUrls) {
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width || 280;
            canvas.height = img.naturalHeight || img.height || 280;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Canvas context unavailable'));
              return;
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png', 0.95));
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
      });

      if (dataUrl && dataUrl.startsWith('data:image')) {
        return dataUrl;
      }
    } catch {
      // Try next candidate
    }
  }
  return null;
}

/**
 * Generates and downloads a clean, professional vector PDF CV of the developer
 * with developer profile photo embedded in the header.
 * 100% reliable across all browsers, iframes, and mobile devices.
 */
export async function downloadDeveloperCv(customData?: PortfolioData) {
  const data = customData || defaultPortfolioData;

  try {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    // Load photo before generating PDF
    const photoDataUrl = await loadPhotoDataUrl(data.developer.avatar);

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Header Background Accent Bar
    const headerHeight = 28;
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, y, contentWidth, headerHeight, 'F');

    // Header Golden Edge Accent Line
    doc.setFillColor(245, 158, 11); // Amber
    doc.rect(margin, y, 2.5, headerHeight, 'F');

    // Embed Developer Photo if available
    const hasPhoto = Boolean(photoDataUrl);
    const photoSize = 22; // 22mm x 22mm
    const photoX = margin + contentWidth - photoSize - 3;
    const photoY = y + (headerHeight - photoSize) / 2;

    if (hasPhoto && photoDataUrl) {
      try {
        // Photo border background
        doc.setFillColor(245, 158, 11); // Amber gold border
        doc.roundedRect(photoX - 0.7, photoY - 0.7, photoSize + 1.4, photoSize + 1.4, 1.5, 1.5, 'F');
        doc.addImage(photoDataUrl, 'PNG', photoX, photoY, photoSize, photoSize, undefined, 'FAST');
      } catch (imgErr) {
        console.warn('PDF image rendering skipped:', imgErr);
      }
    }

    // Header Text Layout (adjusted if photo exists)
    const textMaxWidth = hasPhoto ? contentWidth - photoSize - 12 : contentWidth - 8;

    doc.setTextColor(245, 158, 11); // Amber
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(data.developer.name.toUpperCase(), margin + 6, y + 9);

    doc.setTextColor(226, 232, 240); // Slate-200
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(data.developer.role, margin + 6, y + 15.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text(
      `${data.developer.location}  |  ${data.developer.email}  |  github.com/mishuk08`,
      margin + 6,
      y + 22,
      { maxWidth: textMaxWidth }
    );

    y += headerHeight + 6;

    // Helper to draw section titles
    const drawSectionTitle = (title: string) => {
      checkPageBreak(12);
      doc.setFillColor(245, 158, 11);
      doc.rect(margin, y, 3, 5.5, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text(title.toUpperCase(), margin + 5.5, y + 4.5);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(margin + 52, y + 3, margin + contentWidth, y + 3);
      y += 8.5;
    };

    // 1. PROFESSIONAL SUMMARY
    drawSectionTitle('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const summaryLines = doc.splitTextToSize(
      `${data.developer.tagline} ${data.developer.bio[0] || ''}`,
      contentWidth
    );
    checkPageBreak(summaryLines.length * 4.5);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 4.2 + 4;

    // 2. EDUCATION & CERTIFICATIONS
    drawSectionTitle('Education & Qualifications');
    data.education.forEach(edu => {
      checkPageBreak(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(edu.degree, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`${edu.institution} (${edu.location})  •  ${edu.period}`, margin, y + 4.5);

      doc.setTextColor(71, 85, 105);
      const detailLines = doc.splitTextToSize(edu.details, contentWidth);
      doc.text(detailLines, margin, y + 9);
      y += detailLines.length * 4 + 11;
    });

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Key Certifications: ', margin, y);
      
      const certsText = data.certifications.map(c => `${c.name} (${c.issuer}, ${c.year})`).join('  |  ');
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const certLines = doc.splitTextToSize(certsText, contentWidth - 30);
      doc.text(certLines, margin + 30, y);
      y += certLines.length * 4 + 4;
    }

    // 3. WORK EXPERIENCE
    drawSectionTitle('Work Experience');
    data.experiences.forEach(exp => {
      checkPageBreak(24);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${exp.role} - ${exp.company}`, margin, y);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`${exp.period}  |  ${exp.location}  |  ${exp.type}`, margin, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const descLines = doc.splitTextToSize(exp.description, contentWidth);
      doc.text(descLines, margin, y + 9);
      y += descLines.length * 4 + 10;

      // Key achievements bullet points
      exp.achievements.forEach(ach => {
        const achLines = doc.splitTextToSize(`• ${ach}`, contentWidth - 4);
        checkPageBreak(achLines.length * 4);
        doc.text(achLines, margin + 3, y);
        y += achLines.length * 3.8 + 1;
      });

      // Tech used
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(245, 158, 11);
      doc.text(`Stack: ${exp.technologies.join(', ')}`, margin + 3, y + 2);
      y += 7;
    });

    // 4. CORE TECHNICAL SKILLS
    drawSectionTitle('Core Technical Skills');
    data.skills.forEach(skillGroup => {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${skillGroup.category}: `, margin, y);

      const skillList = skillGroup.skills.map(s => `${s.name} (${s.status || s.badge || 'Learning'})`).join(', ');
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const skillLines = doc.splitTextToSize(skillList, contentWidth - 40);
      doc.text(skillLines, margin + 40, y);
      y += skillLines.length * 4 + 3;
    });
    y += 3;

    // 5. FEATURED PROJECTS
    drawSectionTitle('Featured Software Projects');
    data.projects.slice(0, 4).forEach((proj, idx) => {
      checkPageBreak(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. ${proj.title} [${proj.category}]`, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const pDesc = doc.splitTextToSize(`${proj.description} (Tech: ${proj.tags.join(', ')})`, contentWidth);
      doc.text(pDesc, margin, y + 4.5);
      y += pDesc.length * 3.8 + 6;
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `${data.developer.name} - Curriculum Vitae | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
    }

    // Trigger PDF download
    const filename = `${data.developer.name.replace(/\s+/g, '_')}_CV.pdf`;
    doc.save(filename);

    fireConfetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch (err) {
    console.error('Vector PDF generation error, downloading formatted text fallback:', err);
    // Fallback: download txt formatted
    downloadDeveloperCvText(data);
  }
}

export function downloadDeveloperCvText(customData?: PortfolioData) {
  const data = customData || defaultPortfolioData;
  const cvText = `========================================================================
CURRICULUM VITAE - ${data.developer.name.toUpperCase()}
========================================================================

Role: ${data.developer.role}
Email: ${data.developer.email}
Location: ${data.developer.location}
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
TECHNICAL SKILLS & CODING FOUNDATIONS
------------------------------------------------------------------------
${data.skills
  .map(
    (group) =>
      `• ${group.category.toUpperCase()}:\n  ${group.skills
        .map((s) => `${s.name} [${s.status || s.badge || 'Learning'}]`)
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
   Live Demo: ${p.liveUrl}`
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
}
