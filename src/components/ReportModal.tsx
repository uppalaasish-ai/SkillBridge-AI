import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  FileText,
  Award,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CVAnalysisResult } from '../types';
import { downloadAnalysisPDF } from '../utils/pdfExport';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CVAnalysisResult | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !result) return null;

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      downloadAnalysisPDF(result);
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopySummary = () => {
    const markdown = `# SKILL BRIDGE — Placement Readiness & Skill Gap Report
**Candidate:** ${result.candidateName}
**Target Role:** ${result.targetRole} (${result.targetDomain})
**Match Score:** ${result.matchScore}%
**Analyzed Date:** ${result.analyzedAt}

## Executive Summary
${result.summary}

## Academic Curriculum Alignment
${result.academicCurriculumAlignment}

## Matched Skills
${result.matchedSkills.map((s) => `- [x] ${s.name} (${s.level})`).join('\n')}

## Missing Skills
${result.missingSkills.map((s) => `- [ ] ${s.name} (${s.importance.toUpperCase()}): ${s.reason}`).join('\n')}

## 4-Phase Roadmap
${result.learningRoadmap.map((p) => `### ${p.phase} (${p.duration}): ${p.title}\n- Focus: ${p.focusSkills.join(', ')}\n- Milestones: ${p.keyMilestones.join('; ')}`).join('\n\n')}

## Projects Recommended to Build After Learning Missing Skills
${result.recommendedProjects.map((proj) => `### ${proj.title} [${proj.difficulty} Level]
- Targeted Missing Skills Mastered: ${(proj.targetedMissingSkills && proj.targetedMissingSkills.length > 0) ? proj.targetedMissingSkills.join(', ') : 'Validates critical missing role requirements'}
- Why Build After Learning: ${proj.whyBuildAfterLearning || 'Proves production-readiness on GitHub before applying to target recruiters'}
- Tech Stack: ${proj.techStack.join(', ')}
- Key Deliverables: ${proj.keyDeliverables.join('; ')}
- Portfolio Impact: ${proj.portfolioHighlight}`).join('\n\n')}

## Recommended Types of Paid Internships (Advisory Recommendations in INR)
${result.recommendedInternships.map((i) => `### ${i.roleTitle} [Type: ${i.internshipType || 'Technical Project Internship'}]
- Compensation: Paid Internship (${i.typicalStipend})
- Readiness: ${i.applicationReadiness}
- Why Recommended: ${i.whyRecommended || 'Targeted recommendation based on verified skill profile'}
- Target Organizations: ${i.organizationTypes.join(', ')}
- Screening Prep Tip: ${i.prepTip}`).join('\n\n')}
`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden my-8 border border-slate-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-slate-900 text-sm sm:text-base">
              SKILL BRIDGE — Placement Readiness Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition hidden sm:flex"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Dossier Body */}
        <div id="printable-dossier" className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Header Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Official Candidate Evaluation</span>
              <h2 className="text-2xl font-bold font-heading">{result.candidateName}</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Target Role: <span className="font-semibold text-white">{result.targetRole}</span> • {result.targetDomain}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Verified on: {result.analyzedAt}</p>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/10 p-4 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-300">Match Score</span>
              <p className="text-3xl font-extrabold text-emerald-400 font-heading">{result.matchScore}%</p>
              <span className="text-[10px] font-semibold text-slate-200">
                {result.matchScore >= 75 ? 'Placement Ready' : 'Gap Identified'}
              </span>
            </div>
          </div>

          {/* Section 1: Executive Assessment */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Executive Assessment</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {result.summary}
            </p>
          </div>

          {/* Section 2: Academic vs Industry Gap */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. College Syllabus vs Industry Gap</h3>
            <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3.5 text-xs text-amber-900">
              {result.academicCurriculumAlignment}
            </div>
          </div>

          {/* Section 3: Skill Comparison */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Verified vs Missing Skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-900">Available Skills ({result.matchedSkills.length})</span>
                <div className="space-y-1">
                  {result.matchedSkills.map((s) => (
                    <div key={s.name} className="flex items-center gap-1.5 text-xs text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{s.name} ({s.level})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 space-y-2">
                <span className="text-xs font-bold text-rose-900">Missing Skills ({result.missingSkills.length})</span>
                <div className="space-y-1">
                  {result.missingSkills.map((s) => (
                    <div key={s.name} className="flex items-center gap-1.5 text-xs text-rose-800">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                      <span>{s.name} — {s.importance.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Roadmap Highlights */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">4. Recommended Learning Roadmap</h3>
            <div className="space-y-2">
              {result.learningRoadmap.map((p) => (
                <div key={p.phase} className="rounded-xl border border-slate-200 p-3 text-xs bg-slate-50/50">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{p.phase}: {p.title}</span>
                    <span className="text-blue-600">{p.duration}</span>
                  </div>
                  <p className="text-slate-500 mt-1">Focus: {p.focusSkills.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Projects Recommended to Build After Learning Missing Skills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                5. Projects Recommended to Build After Learning Missing Skills
              </h3>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                {result.recommendedProjects.length} Capstones
              </span>
            </div>
            <div className="space-y-3">
              {result.recommendedProjects.map((proj, pIdx) => {
                const missingReinforced = (proj.targetedMissingSkills && proj.targetedMissingSkills.length > 0)
                  ? proj.targetedMissingSkills
                  : result.missingSkills.slice(0, 2).map((m) => m.name);
                return (
                  <div key={pIdx} className="rounded-2xl border border-slate-200 p-4 bg-white shadow-xs space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                      <span className="rounded bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                        {proj.difficulty} Level
                      </span>
                    </div>

                    <div className="rounded-lg bg-indigo-50/70 border border-indigo-100 p-2 text-[11px] text-indigo-950">
                      <strong className="text-indigo-700">Validates Missing Skills: </strong>
                      <span>{missingReinforced.join(', ') || 'Core Role Frameworks'}</span>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="rounded-lg bg-slate-50 p-2 text-[11px] text-slate-700">
                      <strong>Why Build After Learning: </strong>
                      <span>{proj.whyBuildAfterLearning || 'Directly validates practical mastery of your missing skills to recruiters.'}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 mr-1">Stack:</span>
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 6: Recommended Types of Paid Internships (Advisory Only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                6. Recommended Types of Paid Internships (Advisory Recommendations)
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                INR Stipends (₹)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {result.recommendedInternships.map((intern, iIdx) => (
                <div key={iIdx} className="rounded-2xl border border-slate-200 p-4 bg-white shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-slate-900 text-xs">{intern.roleTitle}</span>
                    <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                      {intern.applicationReadiness}
                    </span>
                  </div>
                  <div className="inline-block rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                    Paid Internship: {intern.typicalStipend}
                  </div>
                  <p className="text-[11px] text-indigo-700 font-semibold">
                    Category: {intern.internshipType || 'Technical Project Internship'}
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    <strong>Why Recommended: </strong>{intern.whyRecommended || 'Matches profile strengths and targets gap closure.'}
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    <strong>Target Orgs: </strong>{intern.organizationTypes.join(', ')}
                  </p>
                  <p className="text-amber-800 text-[10px] bg-amber-50 p-1.5 rounded border border-amber-200">
                    <strong>Screening Tip: </strong>{intern.prepTip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification stamp footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Verified by SkillBridge AI Placement Engine</span>
            <span>Ref ID: SB-{Math.random().toString(36).substring(2, 9).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
