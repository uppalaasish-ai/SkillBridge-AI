import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  FileUp,
  Download,
  BookOpen,
  Briefcase,
  User,
  Trash2,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SAMPLE_CV_PRESETS, JOB_ROLES, DOMAINS } from '../data/jobRoles';
import { CVAnalysisResult, DomainCategory } from '../types';
import { extractTextFromFile } from '../utils/fileParser';

interface CVAnalyzerProps {
  onAnalysisComplete: (result: CVAnalysisResult) => void;
  currentResult: CVAnalysisResult | null;
  onNavigateToRoadmap: () => void;
  onOpenReportModal: () => void;
  initialRole?: string;
}

export const CVAnalyzer: React.FC<CVAnalyzerProps> = ({
  onAnalysisComplete,
  currentResult,
  onNavigateToRoadmap,
  onOpenReportModal,
  initialRole,
}) => {
  // Empty by default — input is provided directly by the user
  const [cvText, setCvText] = useState<string>('');
  const [candidateNameOverride, setCandidateNameOverride] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>(initialRole || 'Data Analyst');
  const [useCustomRole, setUseCustomRole] = useState<boolean>(false);
  const [customJobRole, setCustomJobRole] = useState<string>('');
  const [targetDomain, setTargetDomain] = useState<DomainCategory>('AI & Technology');
  const [customJobDescription, setCustomJobDescription] = useState<string>('');
  const [showJobDescriptionInput, setShowJobDescriptionInput] = useState<boolean>(false);
  const [companyType, setCompanyType] = useState<string>('Tier-1 Product Tech Company');
  const [collegeSyllabus, setCollegeSyllabus] = useState<string>('');
  const [showSyllabusInput, setShowSyllabusInput] = useState<boolean>(false);
  const [showSampleSelector, setShowSampleSelector] = useState<boolean>(false);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isExtractingFile, setIsExtractingFile] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When domain changes, auto-select a role in that domain if current role is not in it
  const handleDomainChange = (domain: DomainCategory) => {
    setTargetDomain(domain);
    const domainRoles = JOB_ROLES.filter((r) => r.domain === domain);
    if (domainRoles.length > 0 && !domainRoles.some((r) => r.title === targetRole)) {
      setTargetRole(domainRoles[0].title);
    }
  };

  // Preset selector (optional testing helper)
  const handleSelectPreset = (presetId: string) => {
    const preset = SAMPLE_CV_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCvText(preset.cvText);
      setCandidateNameOverride(preset.name.split('—')[0].trim());
      setTargetRole(preset.targetRole);
      setTargetDomain(preset.domain);
      setUseCustomRole(false);
      setActiveFileName(`${preset.name.split('—')[0].trim().toLowerCase().replace(/\s+/g, '_')}_resume.txt`);
      setErrorMsg(null);
    }
  };

  // Clear Form
  const handleClearForm = () => {
    setCvText('');
    setActiveFileName(null);
    setCandidateNameOverride('');
    setCustomJobRole('');
    setUseCustomRole(false);
    setCustomJobDescription('');
    setCollegeSyllabus('');
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // File Upload Handlers (supports pdf, txt, md, docx, rtf)
  const handleFileUpload = async (file: File) => {
    setActiveFileName(file.name);
    setErrorMsg(null);
    setIsExtractingFile(true);

    try {
      const extracted = await extractTextFromFile(file);
      if (extracted && extracted.trim().length >= 20) {
        const trimmed = extracted.trim();
        setCvText(trimmed);

        // Auto-extract candidate name from first non-empty line if not already specified
        if (!candidateNameOverride.trim()) {
          const lines = trimmed.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
          if (lines.length > 0) {
            const firstLine = lines[0].replace(/[^a-zA-Z\s]/g, '').trim();
            const words = firstLine.split(/\s+/);
            if (words.length >= 2 && words.length <= 4 && firstLine.length <= 35) {
              setCandidateNameOverride(firstLine);
            }
          }
        }
      } else {
        setErrorMsg(
          `Could not extract readable text from "${file.name}". The document might be image-only scanned or empty. Please copy and paste your resume text directly into the box below.`
        );
      }
    } catch (err: any) {
      console.error('File extraction error:', err);
      setErrorMsg(
        err.message ||
          `Could not extract text from "${file.name}". Please ensure the file is not password-protected or paste your resume text below.`
      );
    } finally {
      setIsExtractingFile(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const effectiveTargetRole = useCustomRole && customJobRole.trim() ? customJobRole.trim() : targetRole;

  const runAnalysis = async () => {
    if (!cvText || cvText.trim().length < 20) {
      setErrorMsg('Please upload a resume file or paste your resume text (minimum 20 characters) to analyze skill gaps.');
      return;
    }

    if (useCustomRole && !customJobRole.trim()) {
      setErrorMsg('Please enter your custom target job title, or switch to selecting from standard roles.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText,
          targetRole: effectiveTargetRole,
          domain: targetDomain,
          targetCompanyType: companyType,
          collegeSyllabus: collegeSyllabus.trim() || undefined,
          customJobDescription: customJobDescription.trim() || undefined,
          candidateNameOverride: candidateNameOverride.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.result) {
        onAnalysisComplete(data.result);
      } else {
        throw new Error('Invalid analysis payload from server');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg('Encountered an issue running AI skill gap analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10 py-6 pb-20">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SKILL BRIDGE • Resume Skill Gap Analyzer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
              Analyze Your Resume Against Industry Roles
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Upload your own resume or paste text, choose your target job or paste a job description, and get instant skill gap analysis.
            </p>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-2">
            {cvText && (
              <button
                onClick={handleClearForm}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Input</span>
              </button>
            )}

            <button
              onClick={() => setShowSampleSelector(!showSampleSelector)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              <FileUp className="h-3.5 w-3.5 text-indigo-600" />
              <span>Sample Resumes</span>
              {showSampleSelector ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Expandable Sample Resumes helper (for test evaluation) */}
        {showSampleSelector && (
          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-indigo-950">Quick Test Profiles (Click to load sample for testing):</span>
              <span className="text-[11px] text-indigo-600">Replaces current input</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_CV_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    handleSelectPreset(preset.id);
                    setShowSampleSelector(false);
                  }}
                  className="rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 transition shadow-xs"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Form Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: CV Input & File Upload (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Candidate Name Input */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-blue-600" />
              <span>Candidate Name (Optional — Auto-extracted from resume if left blank)</span>
            </label>
            <input
              type="text"
              value={candidateNameOverride}
              onChange={(e) => setCandidateNameOverride(e.target.value)}
              placeholder="e.g. Jane Doe, Alex Rivera"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* File Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-600 bg-blue-50/70'
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.docx,.md,.rtf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-3">
              {isExtractingFile ? (
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              {isExtractingFile ? (
                <span className="text-blue-600">Extracting text from resume file...</span>
              ) : (
                <>
                  <span className="text-blue-600 underline">Upload your Resume / CV file</span> or drag and drop
                </>
              )}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports PDF, DOCX, TXT, Markdown, RTF (Max 10MB)
            </p>

            {activeFileName && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-medium text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>
                  Loaded: <strong className="font-semibold">{activeFileName}</strong>
                  {cvText ? ` (${cvText.trim().split(/\s+/).length} words extracted)` : ''}
                </span>
              </div>
            )}
          </div>

          {/* CV Text Editor / Viewer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-slate-800">Resume / CV Content</span>
                {activeFileName && (
                  <span className="hidden sm:inline-block rounded-md bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 font-medium border border-blue-100">
                    From {activeFileName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-slate-500 font-mono font-medium">
                  {cvText ? `${cvText.trim().split(/\s+/).length} words` : '0 words'}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-mono">
                  {cvText.length} chars
                </span>
              </div>
            </div>

            <textarea
              id="cv-text-input"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              rows={12}
              placeholder={`Paste your own resume content here...

Include sections such as:
• Education & Degree (e.g. B.Tech in Computer Science, GPA, Coursework)
• Technical Skills (e.g. Python, SQL, React, Git, Cloud)
• Academic or Personal Projects (e.g. Web scrapers, ML models, Mobile apps)
• Work Experience / Internships / Leadership
• Certifications & Competitions`}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50/40 p-3 text-xs font-mono text-slate-800 leading-relaxed focus:border-blue-500 focus:bg-white focus:outline-none transition resize-y"
            />

            {!cvText && (
              <p className="mt-2 text-[11px] text-slate-500 italic">
                Tip: You can either drag & drop your PDF resume file above or paste your text directly into the box.
              </p>
            )}
          </div>

          {/* Optional: Paste Target Job Description (JD) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <button
              onClick={() => setShowJobDescriptionInput(!showJobDescriptionInput)}
              className="flex w-full items-center justify-between text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span>Paste Target Job Description (Optional — Match against a specific JD)</span>
              </div>
              <span className="text-slate-400">{showJobDescriptionInput ? 'Hide' : 'Expand +'}</span>
            </button>

            {showJobDescriptionInput && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 mb-2">
                  Have a specific job posting from LinkedIn, Indeed, or a company careers portal? Paste the Job Description here to evaluate your resume specifically against it.
                </p>
                <textarea
                  value={customJobDescription}
                  onChange={(e) => setCustomJobDescription(e.target.value)}
                  rows={4}
                  placeholder="Paste job posting requirements, responsibilities, and required qualifications here..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono text-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Optional College Syllabus Integration */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <button
              onClick={() => setShowSyllabusInput(!showSyllabusInput)}
              className="flex w-full items-center justify-between text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span>Include College Curriculum / Syllabus (Optional)</span>
              </div>
              <span className="text-slate-400">{showSyllabusInput ? 'Hide' : 'Expand +'}</span>
            </button>

            {showSyllabusInput && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 mb-2">
                  Paste your university course codes or syllabus topics to evaluate how well your college curriculum covers the target role.
                </p>
                <textarea
                  value={collegeSyllabus}
                  onChange={(e) => setCollegeSyllabus(e.target.value)}
                  rows={3}
                  placeholder="e.g. CS201: Data Structures (C++), CS304: Database Management Systems, CS402: Intro to AI Theory..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-mono text-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Target Career Role, Domain & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Role Configuration
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseCustomRole(!useCustomRole)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  {useCustomRole ? 'Choose from Preset Roles' : 'Type Custom Role'}
                </button>
              </div>
            </div>

            {/* Career Domain Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. Career Discipline / Domain
              </label>
              <select
                id="target-domain-select"
                value={targetDomain}
                onChange={(e) => handleDomainChange(e.target.value as DomainCategory)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                {DOMAINS.map((domain) => (
                  <option key={domain.name} value={domain.name}>
                    {domain.name} ({domain.count} roles)
                  </option>
                ))}
              </select>
            </div>

            {/* Target Role Selection or Custom Input */}
            {useCustomRole ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>2. Custom Target Job Title</span>
                  <span className="text-[10px] text-blue-600 font-normal">Freeform entry</span>
                </label>
                <input
                  type="text"
                  value={customJobRole}
                  onChange={(e) => setCustomJobRole(e.target.value)}
                  placeholder="e.g. Junior React Developer, AI Solutions Architect, Quant Analyst"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Target Job Role
                </label>
                <select
                  id="target-role-select"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                >
                  {JOB_ROLES.filter((r) => r.domain === targetDomain).map((role) => (
                    <option key={role.id} value={role.title}>
                      {role.title} — {role.industryDemand} Demand
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selected Role Snapshot Preview (when using standard role) */}
            {!useCustomRole && (() => {
              const matchedRole = JOB_ROLES.find((r) => r.title === targetRole);
              if (!matchedRole) return null;
              return (
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{matchedRole.title}</span>
                    <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                      {matchedRole.industryDemand} Demand
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {matchedRole.description}
                  </p>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Industry Requires:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {matchedRole.coreRequiredSkills.map((s) => (
                        <span key={s} className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Target Company Benchmark */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                3. Target Organization Benchmark
              </label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                <option value="Tier-1 Product Tech Company">Tier-1 Product Company (High Bar, Deep Foundations)</option>
                <option value="High-Growth Startup">High-Growth Startup (Fullstack, Fast Shippers)</option>
                <option value="Global Consultancy">Global Technology & Strategy Consultancy</option>
                <option value="Enterprise / Research Lab">Enterprise R&D / Scientific Lab</option>
              </select>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              id="analyze-cv-submit-btn"
              onClick={runAnalysis}
              disabled={isAnalyzing || isExtractingFile}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 transition"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>AI Extracting Skills & Mapping Gaps...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-sky-200" />
                  <span>Extract Skills & Analyze Gap Score</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Explainer Card */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span>How Skill Gap Analysis Works</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              1. AI reads your resume and extracts every verified technical and soft skill.<br />
              2. It maps your profile against real industry requirements for <span className="font-semibold text-slate-800">{effectiveTargetRole}</span>.<br />
              3. It calculates your match score, highlights exact missing skills, and constructs a 4-phase learning roadmap with capstones and internships.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Result Display */}
      {currentResult && (
        <div id="cv-analysis-results-section" className="pt-8 border-t border-slate-200 space-y-8">
          {/* Match Score Card & Candidate Overview */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left: Candidate Summary */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
                    Target: {currentResult.targetRole}
                  </span>
                  <span className="text-xs text-slate-400">Analyzed {currentResult.analyzedAt}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                  {currentResult.candidateName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {currentResult.currentTitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                  {currentResult.summary}
                </p>
              </div>

              {/* Right: Score Gauge & Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-inner border-4 border-slate-100">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={currentResult.matchScore >= 75 ? 'text-emerald-500' : 'text-blue-600'}
                      strokeDasharray={`${currentResult.matchScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900 font-heading">
                      {currentResult.matchScore}%
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Match Score
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <button
                    onClick={onOpenReportModal}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Report (PDF)</span>
                  </button>
                  <button
                    onClick={onNavigateToRoadmap}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    <span>View Career Roadmap</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Gap Banner */}
            <div className="mt-6 rounded-xl bg-amber-50/80 border border-amber-200/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950">Academic Curriculum Insight: </span>
                <span>{currentResult.academicCurriculumAlignment}</span>
              </div>
            </div>
          </div>

          {/* Matched Skills vs Missing Skills Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills (Left) */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Available Skills ({currentResult.matchedSkills.length} Detected)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700">Demonstrated in CV</span>
              </div>

              <div className="space-y-2.5">
                {currentResult.matchedSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-xl border border-emerald-200/80 bg-white p-3 shadow-xs text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{skill.name}</span>
                      <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.2 text-[10px] font-semibold">
                        {skill.level}
                      </span>
                    </div>
                    {skill.evidenceInCv && (
                      <p className="text-[11px] text-slate-500 italic">
                        "{skill.evidenceInCv}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills (Right) */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                    <XCircle className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-rose-950">
                    Missing Skills ({currentResult.missingSkills.length} Gap Areas)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-rose-700">Needs Improvement</span>
              </div>

              <div className="space-y-2.5">
                {currentResult.missingSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-xl border border-rose-200/80 bg-white p-3 shadow-xs text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{skill.name}</span>
                      <span
                        className={`rounded px-2 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                          skill.importance === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {skill.importance}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {skill.reason}
                    </p>
                    <p className="text-[10px] font-medium text-rose-700">
                      Industry demand: {skill.industryDemand}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
