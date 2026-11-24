import { jsPDF } from 'jspdf';
import { CVAnalysisResult } from '../types';

export function downloadAnalysisPDF(result: CVAnalysisResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const checkPageOverflow = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 18;
      // Add subtle header on continuation pages
      doc.setFontSize(8);
      doc.setTextColor(130, 140, 150);
      doc.text(`SKILL BRIDGE — Placement Readiness Dossier | ${result.candidateName}`, margin, 10);
      doc.line(margin, 12, pageWidth - margin, 12);
      doc.setTextColor(30, 41, 59);
    }
  };

  // Header banner
  doc.setFillColor(30, 58, 138); // Deep Navy/Slate
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('SKILL BRIDGE — AI PLACEMENT DOSSIER', margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Target Role: ${result.targetRole} (${result.targetDomain}) | Date: ${result.analyzedAt}`, margin + 6, y + 18);

  y += 30;

  // Candidate Info Block
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 22, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 22, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Candidate: ${result.candidateName}`, margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Academic Standing / Current Title: ${result.currentTitle}`, margin + 6, y + 15);

  // Score badge
  const scoreX = pageWidth - margin - 35;
  doc.setFillColor(result.matchScore >= 75 ? 22 : 234, result.matchScore >= 75 ? 163 : 88, result.matchScore >= 75 ? 74 : 12); // Green or Amber
  doc.roundedRect(scoreX, y + 3, 28, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${result.matchScore}%`, scoreX + 6, y + 13);
  doc.setFontSize(7);
  doc.text('MATCH SCORE', scoreX + 3, y + 18);

  y += 28;

  // Executive Summary
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. EXECUTIVE SKILL EVALUATION', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const splitSummary = doc.splitTextToSize(result.summary, contentWidth);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 4.5 + 4;

  // Academic vs Industry Gap
  doc.setFillColor(254, 243, 199); // Light amber
  doc.rect(margin, y, contentWidth, 14, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.rect(margin, y, contentWidth, 14, 'S');
  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('ACADEMIA-INDUSTRY GAP INSIGHT:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  const splitGap = doc.splitTextToSize(result.academicCurriculumAlignment, contentWidth - 8);
  doc.text(splitGap, margin + 4, y + 10);
  y += 18;

  // Skills Table: Matched vs Missing
  checkPageOverflow(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. SKILL GAP COMPARISON (Matched vs Missing)', margin, y);
  y += 6;

  const halfWidth = (contentWidth - 4) / 2;

  // Left Column: Matched Skills
  doc.setFillColor(240, 253, 244);
  doc.rect(margin, y, halfWidth, 34, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.rect(margin, y, halfWidth, 34, 'S');

  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`AVAILABLE SKILLS (${result.matchedSkills.length} Detected)`, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(21, 128, 61);
  let matchedY = y + 12;
  for (const m of result.matchedSkills.slice(0, 5)) {
    doc.text(`[x] ${m.name} (${m.level})`, margin + 4, matchedY);
    matchedY += 4.2;
  }

  // Right Column: Missing Skills
  doc.setFillColor(254, 242, 242);
  doc.rect(margin + halfWidth + 4, y, halfWidth, 34, 'F');
  doc.setDrawColor(254, 202, 202);
  doc.rect(margin + halfWidth + 4, y, halfWidth, 34, 'S');

  doc.setTextColor(153, 27, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`MISSING SKILLS (${result.missingSkills.length} Required)`, margin + halfWidth + 8, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28);
  let missingY = y + 12;
  for (const miss of result.missingSkills.slice(0, 5)) {
    doc.text(`[!] ${miss.name} - ${miss.importance.toUpperCase()}`, margin + halfWidth + 8, missingY);
    missingY += 4.2;
  }

  y += 40;

  // Learning Roadmap
  checkPageOverflow(45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. STEP-BY-STEP LEARNING ROADMAP (How to Learn & Start)', margin, y);
  y += 6;

  for (const phase of result.learningRoadmap) {
    checkPageOverflow(22);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 18, 1, 1, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 18, 1, 1, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 58, 138);
    doc.text(`${phase.phase} (${phase.duration}): ${phase.title}`, margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Focus: ${phase.focusSkills.join(', ')}`, margin + 4, y + 10);

    const firstMilestone = phase.keyMilestones[0] || 'Complete milestone tasks';
    const splitMilestone = doc.splitTextToSize(`Milestone: ${firstMilestone}`, contentWidth - 8);
    doc.text(splitMilestone[0], margin + 4, y + 15);

    y += 21;
  }

  // Recommended Projects to Build After Learning Missing Skills
  checkPageOverflow(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('4. PROJECTS RECOMMENDED TO BUILD AFTER LEARNING MISSING SKILLS', margin, y);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Capstone projects specifically designed to prove practical mastery of your missing skills to recruiters.', margin, y);
  y += 6;

  for (const project of result.recommendedProjects) {
    checkPageOverflow(34);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 31, 1, 1, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 31, 1, 1, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`${project.title} [${project.difficulty} Level]`, margin + 4, y + 5);

    // Targeted Missing Skills
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(79, 70, 229); // indigo
    const missingReinforced = (project.targetedMissingSkills && project.targetedMissingSkills.length > 0)
      ? project.targetedMissingSkills.join(', ')
      : result.missingSkills.slice(0, 2).map((m) => m.name).join(', ') || 'Critical Core Tools';
    const splitTargeted = doc.splitTextToSize(`Targeted Missing Skills Mastered: ${missingReinforced}`, contentWidth - 8);
    doc.text(splitTargeted[0], margin + 4, y + 10);

    // Why Build After Learning
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const whyBuildText = project.whyBuildAfterLearning || `Build after completing learning roadmap phases to validate hands-on readiness.`;
    const splitWhy = doc.splitTextToSize(`Why Build After Learning: ${whyBuildText}`, contentWidth - 8);
    doc.text(splitWhy[0], margin + 4, y + 15);

    // Tech stack
    doc.setTextColor(71, 85, 105);
    doc.text(`Tech Stack: ${project.techStack.join(', ')}`, margin + 4, y + 20);

    // Deliverable
    const firstDeliverable = project.keyDeliverables[0] || project.description;
    const splitDeliverable = doc.splitTextToSize(`Key Deliverable: ${firstDeliverable}`, contentWidth - 8);
    doc.text(splitDeliverable[0], margin + 4, y + 25);

    y += 34;
  }

  // Recommended Internships (Recommendations Only, in Rupees)
  checkPageOverflow(36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('5. RECOMMENDED TYPES OF PAID INTERNSHIPS (Advisory Recommendations)', margin, y);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Targeted advisory on the specific categories of paid internships to pursue based on your skill profile.', margin, y);
  y += 6;

  for (const intern of result.recommendedInternships) {
    checkPageOverflow(32);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 29, 1, 1, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 29, 1, 1, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const safeStipend = (intern.typicalStipend || 'Rs. 25,000 - 45,000 / month').replace(/₹/g, 'Rs. ');
    doc.text(`${intern.roleTitle} [Type: ${intern.internshipType || 'Technical Project Internship'}]`, margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(5, 150, 105);
    doc.text(`Status: Paid Internship (${safeStipend}) | Readiness: ${intern.applicationReadiness}`, margin + 4, y + 10);

    doc.setTextColor(71, 85, 105);
    const whyText = intern.whyRecommended ? `Why Recommended: ${intern.whyRecommended}` : `Target: ${intern.organizationTypes.join(', ')}`;
    const splitWhyIntern = doc.splitTextToSize(whyText, contentWidth - 8);
    doc.text(splitWhyIntern[0], margin + 4, y + 15);

    const prepText = `Preparation & Screening Tip: ${intern.prepTip}`;
    const splitPrep = doc.splitTextToSize(prepText, contentWidth - 8);
    doc.text(splitPrep[0], margin + 4, y + 20);

    const targetOrgs = `Target Organizations: ${intern.organizationTypes.join(', ')}`;
    const splitOrgs = doc.splitTextToSize(targetOrgs, contentWidth - 8);
    doc.text(splitOrgs[0], margin + 4, y + 25);

    y += 32;
  }

  // Footer / Verification Stamp
  checkPageOverflow(18);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated by SKILL BRIDGE — AI Placement Readiness & Skill Gap Engine. Certified for student & recruiter reference.', margin, y);

  // Trigger download
  const cleanFileName = `SkillBridge_Report_${result.candidateName.replace(/\s+/g, '_')}_${result.targetRole.replace(/\s+/g, '_')}.pdf`;
  doc.save(cleanFileName);
}
