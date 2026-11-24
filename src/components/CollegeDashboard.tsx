import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Award,
  CheckCircle2,
  Plus,
  BookOpen,
  Users,
  Lightbulb,
} from 'lucide-react';
import { COLLEGE_COHORT_DATA } from '../data/jobRoles';
import { CollegeCohortSkill } from '../types';

export const CollegeDashboard: React.FC = () => {
  const [skills, setSkills] = useState<CollegeCohortSkill[]>(COLLEGE_COHORT_DATA);
  const [newWorkshop, setNewWorkshop] = useState('');
  const [plannedWorkshops, setPlannedWorkshops] = useState<string[]>([
    'AWS & GCP Cloud Practitioner Boot Camp (6-Week Intensive)',
    'Enterprise Power BI & DAX Visualization Masterclass',
    'Hands-on Machine Learning Pipeline with Docker Workshop',
  ]);

  const handleAddWorkshop = () => {
    if (newWorkshop.trim()) {
      setPlannedWorkshops([...plannedWorkshops, newWorkshop.trim()]);
      setNewWorkshop('');
    }
  };

  const avgReadiness = Math.round(
    skills.reduce((acc, s) => acc + s.percentage, 0) / skills.length
  );

  return (
    <div className="space-y-10 py-6 pb-20">
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5" />
              <span>Academic Curriculum & Cohort Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
              College Skill Gap Analytics
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Benchmark student syllabus coverage against real-time industry placement criteria and organize targeted training workshops.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-center">
              <span className="text-[10px] font-bold uppercase text-indigo-600">Cohort Skill Average</span>
              <p className="text-2xl font-bold text-indigo-950 font-heading">{avgReadiness}%</p>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-center">
              <span className="text-[10px] font-bold uppercase text-amber-600">Critical Gaps</span>
              <p className="text-2xl font-bold text-amber-950 font-heading">
                {skills.filter((s) => s.status === 'Critical Gap').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Table & Bar Chart: College Syllabus vs Industry Demand */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Student Cohort Skill Distribution vs. Industry Benchmark
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated from 1,250+ undergraduate resumes across Computer Science and Engineering departments.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Fall Placement Cycle
          </span>
        </div>

        <div className="space-y-4">
          {skills.map((item) => (
            <div
              key={item.skill}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2 hover:bg-slate-50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.skill}</span>
                  <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px] font-medium text-slate-600">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-600">
                    Student Proficiency: <strong className="text-slate-900">{item.percentage}%</strong>
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600">
                    Industry Needs: <strong className="text-blue-600">{item.industryBenchmark}%</strong>
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      item.status === 'Critical Gap'
                        ? 'bg-rose-100 text-rose-800'
                        : item.status === 'Moderate Gap'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status} ({item.gap}% Gap)
                  </span>
                </div>
              </div>

              {/* Stacked Visual Bar */}
              <div className="space-y-1">
                <div className="relative h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  {/* Industry Target Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-slate-900 z-10"
                    style={{ left: `${item.industryBenchmark}%` }}
                    title={`Industry Requirement: ${item.industryBenchmark}%`}
                  />
                  {/* Current Student Skill Fill */}
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.status === 'Critical Gap'
                        ? 'bg-rose-500'
                        : item.status === 'Moderate Gap'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>

              {/* Recommended Action */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="font-semibold text-slate-800">Actionable Academic Strategy: </span>
                <span>{item.recommendedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workshop & Bridge Program Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Academic Recommendation Formula (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider">
              The 3-Step College Intervention Framework
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            When cohort analytics reveal an industry deficit (e.g. Cloud Computing at 40%), colleges deploy the SkillBridge 3-Step Acceleration Cycle:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="rounded-xl bg-white p-3 border border-blue-200/80 shadow-xs flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-xs">
                1
              </span>
              <div>
                <span className="font-bold text-slate-900">Industry Workshop: </span>
                <span className="text-slate-600">Intensive weekend crash courses led by verified industry practitioners.</span>
              </div>
            </div>

            <div className="rounded-xl bg-white p-3 border border-blue-200/80 shadow-xs flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-xs">
                2
              </span>
              <div>
                <span className="font-bold text-slate-900">Recognized Certification: </span>
                <span className="text-slate-600">Subsidized vouchers for AWS Certified Cloud Practitioner, Microsoft Power BI, etc.</span>
              </div>
            </div>

            <div className="rounded-xl bg-white p-3 border border-blue-200/80 shadow-xs flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-xs">
                3
              </span>
              <div>
                <span className="font-bold text-slate-900">Practical Capstone Training: </span>
                <span className="text-slate-600">Mandating deployment of real cloud containers in semester laboratory evaluations.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active Interventions & Planned Workshops (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Planned Campus Training Workshops
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {plannedWorkshops.length} Scheduled
            </span>
          </div>

          <div className="space-y-2">
            {plannedWorkshops.map((ws, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-800">{ws}</span>
                </div>
                <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                  Enrolling
                </span>
              </div>
            ))}
          </div>

          {/* Add Workshop Form */}
          <div className="pt-2 flex gap-2">
            <input
              type="text"
              value={newWorkshop}
              onChange={(e) => setNewWorkshop(e.target.value)}
              placeholder="e.g. Generative AI Prompt & Agentic Architecture Seminar"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddWorkshop}
              className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
