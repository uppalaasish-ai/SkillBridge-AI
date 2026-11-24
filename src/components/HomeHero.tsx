import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building2,
  Users,
  Compass,
} from 'lucide-react';
import { DOMAINS, JOB_ROLES } from '../data/jobRoles';
import { DomainCategory } from '../types';

interface HomeHeroProps {
  onStartAnalysis: (role?: string) => void;
  onExploreCollege: () => void;
  onExplorePlacements: () => void;
  onExploreGraph: () => void;
  selectedDomain: DomainCategory;
  setSelectedDomain: (d: DomainCategory) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStartAnalysis,
  onExploreCollege,
  onExplorePlacements,
  onExploreGraph,
  selectedDomain,
  setSelectedDomain,
}) => {
  const filteredRoles = JOB_ROLES.filter((r) => r.domain === selectedDomain);

  return (
    <div className="space-y-16 py-6 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 px-6 py-16 sm:px-12 sm:py-20 text-white shadow-xl">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300 mb-6 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            <span>AI RESUME JOB SKILL GAP ANALYZER</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-heading">
            SKILL{' '}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              BRIDGE
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base font-semibold text-sky-200 tracking-wide uppercase">
            Academia–Industry Skill Mapping & Placement Intelligence
          </p>

          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Upload your resume, select your target role or paste a job description, and get instant skill gap analysis, personalized learning roadmaps, capstone projects, and matching internships.
          </p>

          {/* Key Flow Badge */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono">College Curriculum</span>
            <span className="text-sky-400 font-bold">→</span>
            <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono">Student Skills</span>
            <span className="text-sky-400 font-bold">→</span>
            <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono">AI Gap Analysis</span>
            <span className="text-sky-400 font-bold">→</span>
            <span className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 font-mono font-semibold">
              Industry Placement
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              id="hero-start-cv-btn"
              onClick={() => onStartAnalysis()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-all hover:scale-[1.02]"
            >
              <FileCheck className="h-4 w-4" />
              <span>Upload CV & Analyze Gap</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              id="hero-explore-graph-btn"
              onClick={onExploreGraph}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3.5 text-sm font-medium text-slate-200 hover:bg-slate-700/80 transition backdrop-blur-sm"
            >
              <Compass className="h-4 w-4 text-sky-400" />
              <span>Explore Skill Graph</span>
            </button>

            <button
              id="hero-college-stats-btn"
              onClick={onExploreCollege}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3.5 text-sm font-medium text-slate-200 hover:bg-slate-700/80 transition backdrop-blur-sm"
            >
              <Building2 className="h-4 w-4 text-indigo-400" />
              <span>College Cohort Insights</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="relative z-10 mt-14 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-8 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-sky-400">80+</p>
            <p className="text-xs text-slate-400 mt-1">Cross-Domain Career Roles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">100%</p>
            <p className="text-xs text-slate-400 mt-1">Explainable Skill Match</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-indigo-400">4-Phase</p>
            <p className="text-xs text-slate-400 mt-1">Personalized Roadmaps</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-amber-400">PDF</p>
            <p className="text-xs text-slate-400 mt-1">Downloadable Dossier</p>
          </div>
        </div>
      </section>

      {/* The 3 Core Problems We Solve */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">The Core Friction</h2>
          <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Three Critical Gaps in Campus Hiring
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Why traditional job boards fail students, academic institutions, and enterprise recruiters alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4 border border-amber-200/50">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">1. College vs Industry Gap</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Theoretical college syllabi cover roughly 30–50% of practical production tooling. Colleges struggle to pinpoint which modern tech stacks to introduce in lab coursework.
            </p>
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700 border border-slate-100 font-medium">
              <span className="text-amber-600 font-bold">Bridge Solution:</span> Cohort analytics benchmark curriculum against active job postings to recommend targeted workshops.
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 border border-blue-200/50">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">2. Students Don’t Know What's Missing</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Students know their dream target title (e.g. Data Analyst), but don’t know why their resumes are rejected or what exact frameworks, projects, or certifications are required.
            </p>
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700 border border-slate-100 font-medium">
              <span className="text-blue-600 font-bold">Bridge Solution:</span> Instant CV analysis identifies possessed vs missing skills, calculating an explainable match score.
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4 border border-indigo-200/50">
              <Building2 className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">3. Recruiters Drown in Resumes</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Hiring managers receive thousands of unstructured resumes. Manual screening overlooks high-potential candidates who possess 80% of skills and only need targeted onboarding.
            </p>
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700 border border-slate-100 font-medium">
              <span className="text-indigo-600 font-bold">Bridge Solution:</span> AI skill extraction standardizes candidates and provides instant skill-matching ranking for recruiters.
            </div>
          </div>
        </div>
      </section>

      {/* Concrete Example: How It Works */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <span>Real Example Walkthrough</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 font-heading">
            From Raw CV to Placement-Ready in 4 Stages
          </h3>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Stage 1: Target Requirement */}
            <div className="lg:col-span-4 rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Company Needs</span>
              <p className="text-sm font-bold text-slate-900 mt-1">Data Analyst Role</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 font-medium">Python</span>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 font-medium">SQL</span>
                <span className="rounded bg-rose-50 px-2 py-0.5 text-xs text-rose-700 font-medium">Power BI</span>
                <span className="rounded bg-rose-50 px-2 py-0.5 text-xs text-rose-700 font-medium">Machine Learning</span>
              </div>
            </div>

            {/* Middle: Student Skills Comparison */}
            <div className="lg:col-span-4 rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Student CV Has</span>
              <p className="text-sm font-bold text-slate-900 mt-1">Alex Rivera (Sophomore)</p>
              <div className="mt-3 space-y-1.5 text-xs">
                <p className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Available: Python, SQL</span>
                </p>
                <p className="flex items-center gap-1.5 text-rose-700 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                  <span>Missing: Power BI, ML</span>
                </p>
              </div>
            </div>

            {/* Stage 3: Recommendation */}
            <div className="lg:col-span-4 rounded-xl bg-emerald-900 text-white p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-emerald-300 tracking-wider">AI Recommendation</span>
              <p className="text-sm font-bold text-white mt-1">Match Score: 78%</p>
              <p className="mt-2 text-xs text-emerald-100 leading-relaxed">
                1. Master Power BI DAX formulas → 2. Build Churn Prediction Project → 3. Apply to Tier-1 Analytics Internships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Domains Explorer */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Comprehensive Role Taxonomy</h2>
            <h3 className="mt-1 text-2xl font-bold text-slate-900 font-heading">
              Explore 5 Major Career Disciplines
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Select a domain below to browse mapped industry roles, skill requirements, and curriculum coverage.
            </p>
          </div>
          <button
            onClick={() => onStartAnalysis()}
            className="self-start sm:self-auto rounded-lg border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Analyze Against Any Role →
          </button>
        </div>

        {/* Domain Switcher Pills */}
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((domain) => {
            const isSelected = selectedDomain === domain.name;
            return (
              <button
                key={domain.name}
                onClick={() => setSelectedDomain(domain.name)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{domain.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected ? 'bg-slate-700 text-sky-300' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {domain.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Roles Grid for Selected Domain */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{role.title}</h4>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      role.industryDemand === 'Very High'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {role.industryDemand} Demand
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {role.description}
                </p>

                {/* Core required skills */}
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Skills</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {role.coreRequiredSkills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {role.coreRequiredSkills.length > 4 && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        +{role.coreRequiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Academic Coverage Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>College Syllabus Coverage</span>
                    <span className="font-semibold text-slate-800">{role.academicCurriculumCoverage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${role.academicCurriculumCoverage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Industry gap: {100 - role.academicCurriculumCoverage}% practical tooling
                  </p>
                </div>
              </div>

              <button
                onClick={() => onStartAnalysis(role.title)}
                className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 py-2 text-xs font-semibold text-slate-700 transition"
              >
                <span>Analyze My CV For This Role</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
