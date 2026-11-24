import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Circle,
  FolderGit2,
  Briefcase,
  ExternalLink,
  ArrowRight,
  Download,
  Sparkles,
  BookOpen,
  Code2,
  DollarSign,
  Building,
  CheckSquare,
  IndianRupee,
  Compass,
  Award,
  TrendingUp,
  Lightbulb,
  Globe,
  Search,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { CVAnalysisResult, RoadmapPhase, RecommendedProject, RecommendedInternship } from '../types';

interface MarketInsightSource {
  title: string;
  uri: string;
}

interface MarketInsightsData {
  insights: string;
  sources: MarketInsightSource[];
  searchQueries: string[];
  modelUsed: string;
  generatedAt: string;
  queryType: string;
}

interface RoadmapViewProps {
  result: CVAnalysisResult | null;
  onOpenReportModal: () => void;
  onNavigateToAnalyzer: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  result,
  onOpenReportModal,
  onNavigateToAnalyzer,
}) => {
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'roadmap' | 'projects' | 'internships' | 'intel'>('roadmap');
  const [internshipFilter, setInternshipFilter] = useState<'all' | 'ready_now' | 'fast_track'>('all');
  const [copiedProjectId, setCopiedProjectId] = useState<number | null>(null);
  const [intelData, setIntelData] = useState<MarketInsightsData | null>(null);
  const [intelLoading, setIntelLoading] = useState(false);
  const [intelError, setIntelError] = useState<string | null>(null);
  const [customIntelQuery, setCustomIntelQuery] = useState('');
  const [lastIntelRequest, setLastIntelRequest] = useState<{ queryType: 'hiring_trends' | 'stipend_benchmarks' | 'learning_resources' | 'custom'; customQuery?: string }>({
    queryType: 'hiring_trends',
  });

  if (!result) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center my-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
          <MapPin className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-heading">
          No CV Analysis Found Yet
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Please upload or paste your CV in the CV Analyzer first to generate your custom step-by-step career roadmap, project blueprints, and internship matches.
        </p>
        <button
          onClick={onNavigateToAnalyzer}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <span>Go to CV Analyzer</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalMilestones = result.learningRoadmap.reduce(
    (acc, phase) => acc + phase.keyMilestones.length,
    0
  );
  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const progressPercent = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

  const fetchMarketInsights = async (
    queryType: 'hiring_trends' | 'stipend_benchmarks' | 'learning_resources' | 'custom',
    customText?: string
  ) => {
    setIntelLoading(true);
    setIntelError(null);
    setLastIntelRequest({ queryType, customQuery: customText });

    try {
      const response = await fetch('/api/market-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: result.targetRole,
          targetDomain: result.targetDomain,
          missingSkills: result.missingSkills.map((m) => m.name),
          queryType,
          customQuery: customText || '',
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch live insights (HTTP ${response.status})`);
      }

      setIntelData({
        insights: data.insights,
        sources: Array.isArray(data.sources) ? data.sources : [],
        searchQueries: Array.isArray(data.searchQueries) ? data.searchQueries : [],
        modelUsed: data.modelUsed || 'gemini-4-hydrogen',
        generatedAt: data.generatedAt || 'Just now',
        queryType,
      });
    } catch (err: any) {
      setIntelError(err?.message || 'Unable to load Google Search market insights right now.');
    } finally {
      setIntelLoading(false);
    }
  };

  const renderMarkdownBlock = (rawText: string) => {
    return rawText.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      const renderParts = (text: string) =>
        text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={pIdx} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-indigo-700">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });

      if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
        return (
          <h4 key={idx} className="mt-3 mb-1 text-sm font-bold text-slate-900 font-heading">
            {renderParts(trimmed.replace(/^#{1,3}\s+/, ''))}
          </h4>
        );
      }

      const isBullet =
        trimmed.startsWith('•') ||
        trimmed.startsWith('- ') ||
        trimmed.startsWith('* ') ||
        /^\d+\./.test(trimmed);

      const cleanLine = isBullet ? trimmed.replace(/^([•\-*])\s*/, '• ') : line;

      return (
        <p
          key={idx}
          className={`text-xs sm:text-[13px] leading-relaxed text-slate-700 ${isBullet ? 'pl-3 mt-1' : 'mt-1.5'}`}
        >
          {renderParts(cleanLine)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-10 py-6 pb-20">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Personalized Career Progression Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">
              Placement Roadmap for {result.candidateName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Target Role: <span className="text-white font-semibold">{result.targetRole}</span> ({result.targetDomain}) • Current Match: <span className="text-emerald-400 font-bold">{result.matchScore}%</span>
            </p>
          </div>

          {/* Progress and Download Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm border border-white/10 text-center min-w-[140px]">
              <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Roadmap Progress</span>
              <p className="text-xl font-bold text-emerald-400 font-heading mt-0.5">{progressPercent}%</p>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-xs font-bold text-white shadow-md transition"
            >
              <Download className="h-4 w-4" />
              <span>Download Full PDF Dossier</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'roadmap'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>1. How to Start / Learn (4 Phases)</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'projects'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>2. Projects to Build After Learning</span>
          </button>

          <button
            onClick={() => setActiveTab('internships')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'internships'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-blue-600" />
            <span>3. Internship Type Recommendations</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('intel');
              if (!intelData && !intelLoading) {
                fetchMarketInsights('hiring_trends');
              }
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'intel'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-sky-400" />
            <span>4. Live Market Intel (Google Search)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: How to Start / Learn */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Step-by-Step Learning Timeline
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Targeting your specific missing skills: {result.missingSkills.map((m) => m.name).join(', ')}
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {completedCount} of {totalMilestones} milestones completed
            </span>
          </div>

          <div className="space-y-6">
            {result.learningRoadmap.map((phase, idx) => (
              <div
                key={phase.phase}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-200 transition"
              >
                {/* Phase Number & Timeline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-xs font-bold text-blue-800">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{phase.title}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">{phase.phase}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 self-start sm:self-auto">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{phase.duration}</span>
                  </div>
                </div>

                {/* Focus Skills */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Focus Gaps</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {phase.focusSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-xs font-semibold text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Milestones Checklist */}
                <div className="mt-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Actionable Milestones</span>
                  <div className="space-y-2">
                    {phase.keyMilestones.map((m, mIdx) => {
                      const mId = `${phase.phase}-m-${mIdx}`;
                      const isDone = !!completedMilestones[mId];
                      return (
                        <div
                          key={mId}
                          onClick={() => toggleMilestone(mId)}
                          className={`flex items-start gap-2.5 rounded-xl p-3 border cursor-pointer transition text-xs ${
                            isDone
                              ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                              : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                          }`}
                        >
                          {isDone ? (
                            <CheckSquare className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                          )}
                          <span className={isDone ? 'line-through text-slate-400' : 'font-medium'}>
                            {m}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended Resources */}
                {phase.recommendedResources && phase.recommendedResources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium">Recommended Resources:</span>
                    {phase.recommendedResources.map((res, rIdx) => (
                      <span key={rIdx} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 font-mono">
                        {res}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Projects to Build After Learning */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>Skill Gap Closure Blueprint</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Projects Recommended to Build After Learning Missing Skills
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Once you complete the learning phases, build these industry-grade capstone projects to prove practical mastery of your <strong>missing skills</strong> on GitHub and during campus placement interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {result.recommendedProjects.map((project, pIdx) => {
              const missingReinforced = (project.targetedMissingSkills && project.targetedMissingSkills.length > 0)
                ? project.targetedMissingSkills
                : result.missingSkills.slice(0, 2).map((m) => m.name);

              return (
                <div
                  key={pIdx}
                  className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <span className="rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                        Capstone {pIdx + 1}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          project.difficulty === 'Advanced'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {project.difficulty} Level
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Targeted Missing Skills Mastered */}
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Validates & Proves These Missing Skills:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {missingReinforced.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-white border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700 shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Why Build After Learning */}
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs space-y-1">
                      <span className="font-bold text-blue-950">Why Build After Completing Learning:</span>
                      <p className="text-slate-700 text-xs leading-relaxed mt-0.5">
                        {project.whyBuildAfterLearning ||
                          'Proves independent project execution and translates newly learned theoretical skills into production-grade systems.'}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tech Stack</span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Deliverables */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Deliverables</span>
                      {project.keyDeliverables.map((deliv, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>

                    {/* Portfolio Highlight */}
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-700">
                      <strong className="text-slate-900">Portfolio & Interview Impact: </strong>
                      <span>{project.portfolioHighlight}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">Ready for GitHub Portfolio</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Project: ${project.title} (${project.difficulty} Level)\nTargeted Missing Skills Mastered: ${missingReinforced.join(', ')}\nWhy Build After Learning: ${project.whyBuildAfterLearning || 'Validates practical skills'}\nTech Stack: ${project.techStack.join(', ')}\nDescription: ${project.description}\nKey Deliverables:\n${project.keyDeliverables.map((d) => `- ${d}`).join('\n')}`
                        );
                        setCopiedProjectId(pIdx);
                        setTimeout(() => setCopiedProjectId(null), 2500);
                      }}
                      className="flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                      {copiedProjectId === pIdx ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Spec Copied!</span>
                        </>
                      ) : (
                        <>
                          <span>Copy Project Spec</span>
                          <ExternalLink className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Internship Type Recommendations */}
      {activeTab === 'internships' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-slate-200 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Strategic Placement Advisory</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Recommended Types of Paid Internships
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Tailored recommendations on the specific categories of paid internships you should target based on your skills and gap profile.
                </p>
              </div>

              {/* Filter chips */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
                <button
                  onClick={() => setInternshipFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    internshipFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Types ({result.recommendedInternships.length})
                </button>
                <button
                  onClick={() => setInternshipFilter('ready_now')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    internshipFilter === 'ready_now'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ready Now
                </button>
                <button
                  onClick={() => setInternshipFilter('fast_track')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    internshipFilter === 'fast_track'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ready in 4 Weeks
                </button>
              </div>
            </div>
          </div>

          {/* Strategic Advisory Banner */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white p-4 sm:p-5 text-xs text-slate-700 flex items-start gap-3 shadow-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                Strategic Guidance on Internship Targeting
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                Instead of applying randomly, our AI engine specifically recommends targeting these <strong>distinct types of paid internships</strong>. Each type matches your verified strengths, systematically bridges your critical gaps through practical experience, and provides a benchmark stipend in <strong>Indian Rupees (₹)</strong>.
              </p>
            </div>
          </div>

          {/* Internship Recommendation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {result.recommendedInternships
              .filter((intern) => {
                if (internshipFilter === 'ready_now') return intern.applicationReadiness === 'Ready Now';
                if (internshipFilter === 'fast_track') return intern.applicationReadiness !== 'Ready Now';
                return true;
              })
              .map((intern, iIdx) => (
                <div
                  key={iIdx}
                  className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-5 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Type Tag & Readiness */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                        <Award className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Type: {intern.internshipType || 'Technical Project Internship'}</span>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          intern.applicationReadiness === 'Ready Now'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {intern.applicationReadiness}
                      </span>
                    </div>

                    {/* Role Title & Stipend in Rupees */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{intern.roleTitle}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Paid Internship</span>
                          <span className="text-emerald-400">|</span>
                          <span className="text-emerald-700 font-extrabold">{intern.typicalStipend}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Monthly Compensation</span>
                      </div>
                    </div>

                    {/* Why This Type Is Recommended For You */}
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-blue-950">
                        <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                        <span>Why This Internship Type Is Recommended:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                        {intern.whyRecommended ||
                          `Matches candidate's foundational competencies while accelerating practical exposure to industry workflows.`}
                      </p>
                    </div>

                    {/* Target Organization Ecosystems */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Target Organization Types
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {intern.organizationTypes.map((org) => (
                          <span
                            key={org}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                          >
                            {org}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Target Companies */}
                    {intern.targetCompanies && intern.targetCompanies.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Representative Recruiters & Companies
                        </span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {intern.targetCompanies.map((comp) => (
                            <span
                              key={comp}
                              className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-800"
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Requirements to Demonstrate */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Key Requirements & Screening Focus
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {intern.keyRequirements.map((req) => (
                          <span
                            key={req}
                            className="rounded-md bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 text-xs font-medium"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Interview & Application Strategy Tip */}
                  <div className="rounded-2xl bg-amber-50/80 border border-amber-200/90 p-3.5 text-xs text-amber-950 mt-4 space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      <span>Screening & Application Tip:</span>
                    </span>
                    <p className="text-[11px] leading-relaxed text-amber-900/90">{intern.prepTip}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* Placement & Outreach Playbook */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="h-4 w-4 text-blue-600" />
              <span>How to Apply for These Recommended Internship Types</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-slate-900">Portfolio-First Outreach</h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  When reaching out to tech leads on LinkedIn or angel networks, share a 30-second demo of your Capstone Project instead of just attaching a plain resume.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-slate-900">Emphasize Gap Closure</h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Recruiters love proactive learners. In interviews, mention: <em>"I identified a gap in production tooling and completed a targeted roadmap project to bridge it."</em>
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-slate-900">College TPO Approval</h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Export your SkillBridge Placement Report (PDF) to submit to your College Training & Placement Officer for official semester internship credit and attendance clearance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Live Market Intel (Google Search Grounding) */}
      {activeTab === 'intel' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>Live Market & Hiring Intel (Google Search)</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Real-time web intelligence grounded via Google Search for <strong className="text-slate-900">{result.targetRole}</strong> ({result.targetDomain}) and your missing skill gaps.
              </p>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Powered by Gemini 4 Hydrogen · Google Search Grounding
            </span>
          </div>

          {/* Quick Intel Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              disabled={intelLoading}
              onClick={() => fetchMarketInsights('hiring_trends')}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                intelData?.queryType === 'hiring_trends'
                  ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
              } disabled:opacity-60`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Current Hiring Trends</h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  2025–2026 recruiter expectations & in-demand stack shifts
                </p>
              </div>
            </button>

            <button
              type="button"
              disabled={intelLoading}
              onClick={() => fetchMarketInsights('stipend_benchmarks')}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                intelData?.queryType === 'stipend_benchmarks'
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
              } disabled:opacity-60`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <IndianRupee className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Indian Stipend Benchmarks (₹)</h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Live ₹/month internship stipends & fresher CTC ranges
                </p>
              </div>
            </button>

            <button
              type="button"
              disabled={intelLoading}
              onClick={() => fetchMarketInsights('learning_resources')}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                intelData?.queryType === 'learning_resources'
                  ? 'border-indigo-500 bg-indigo-50/70 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
              } disabled:opacity-60`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Verified Courses & Docs</h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Up-to-date official guides for your missing skills
                </p>
              </div>
            </button>
          </div>

          {/* Custom Search Grounded Query */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!customIntelQuery.trim() || intelLoading) return;
              fetchMarketInsights('custom', customIntelQuery.trim());
            }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <label htmlFor="custom-market-query" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Ask a Custom Live Web Question
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="custom-market-query"
                  type="text"
                  value={customIntelQuery}
                  onChange={(e) => setCustomIntelQuery(e.target.value)}
                  disabled={intelLoading}
                  placeholder={`e.g., Top Indian startups hiring ${result.targetRole} interns right now or latest ${result.missingSkills[0]?.name || 'framework'} version`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={!customIntelQuery.trim() || intelLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40 transition shrink-0"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Search Live Web</span>
              </button>
            </div>
          </form>

          {/* Loading State */}
          {intelLoading && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-8 text-center space-y-3">
              <Loader2 className="h-7 w-7 text-blue-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">Querying Google Search & Synthesizing Insights...</p>
                <p className="text-xs text-slate-600">
                  Retrieving current industry sources for {result.targetRole}
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {intelError && !intelLoading && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-900">Could Not Retrieve Live Search Insights</h4>
                  <p className="text-xs text-red-800 mt-0.5">{intelError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fetchMarketInsights(lastIntelRequest.queryType, lastIntelRequest.customQuery)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition shrink-0"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Results Card */}
          {intelData && !intelLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-heading">
                      Grounded Market Intelligence Report
                    </h3>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    {intelData.modelUsed} · Updated {intelData.generatedAt}
                  </span>
                </div>

                <div>{renderMarkdownBlock(intelData.insights)}</div>

                {intelData.searchQueries.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Google Search Queries: </span>
                    <span>{intelData.searchQueries.join(' · ')}</span>
                  </div>
                )}
              </div>

              {/* Verified Web Citations Panel */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 self-start">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    Verified Web Sources ({intelData.sources.length})
                  </h3>
                </div>

                {intelData.sources.length > 0 ? (
                  <div className="space-y-2">
                    {intelData.sources.map((src, sIdx) => {
                      let hostname = '';
                      try {
                        hostname = new URL(src.uri).hostname.replace(/^www\./, '');
                      } catch {
                        hostname = src.uri;
                      }
                      return (
                        <a
                          key={`${src.uri}-${sIdx}`}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl border border-slate-200 bg-slate-50/70 p-3 hover:bg-blue-50/60 hover:border-blue-300 transition group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 line-clamp-2">
                              {src.title}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                          </div>
                          <span className="mt-1 block text-[10px] font-mono text-slate-500 truncate">
                            {hostname}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Insights synthesized directly from Gemini Google Search grounding. Try a more specific query if you need direct external citation links.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
