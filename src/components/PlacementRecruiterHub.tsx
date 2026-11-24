import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowUpDown,
  Mail,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';
import { SAMPLE_CANDIDATE_POOL, JOB_ROLES } from '../data/jobRoles';
import { CandidateProfile } from '../types';

export const PlacementRecruiterHub: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('Data Analyst');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    'Python',
    'SQL',
    'Excel',
    'Power BI',
    'Statistics',
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [minMatchThreshold, setMinMatchThreshold] = useState<number>(70);
  const [candidates, setCandidates] = useState<CandidateProfile[]>(SAMPLE_CANDIDATE_POOL);
  const [invitedCandidateIds, setInvitedCandidateIds] = useState<Set<string>>(new Set());

  // Dynamic skill matching for candidate pool based on active requiredSkills
  const scoredCandidates = candidates
    .map((candidate) => {
      const matched = candidate.skills.filter((s) =>
        requiredSkills.some((req) => req.toLowerCase() === s.toLowerCase())
      );
      const computedScore = Math.min(
        98,
        Math.max(
          40,
          Math.round((matched.length / Math.max(1, requiredSkills.length)) * 85) +
            (candidate.skills.length >= 6 ? 12 : 5)
        )
      );
      return {
        ...candidate,
        dynamicMatchScore: computedScore,
        matchedSkillsList: matched,
        missingSkillsList: requiredSkills.filter(
          (req) => !candidate.skills.some((s) => s.toLowerCase() === req.toLowerCase())
        ),
      };
    })
    .filter((c) => c.dynamicMatchScore >= minMatchThreshold)
    .sort((a, b) => b.dynamicMatchScore - a.dynamicMatchScore);

  const handleAddRequiredSkill = () => {
    if (newSkillInput.trim() && !requiredSkills.includes(newSkillInput.trim())) {
      setRequiredSkills([...requiredSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skillToRemove));
  };

  const handleInvite = (id: string) => {
    const updated = new Set(invitedCandidateIds);
    updated.add(id);
    setInvitedCandidateIds(updated);
  };

  return (
    <div className="space-y-10 py-6 pb-20">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Enterprise Placement Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
              Recruiter Skill-Matching Engine
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Create specific job requirements and automatically rank verified student candidates by exact skill match percentage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700">
              Active Candidates: <strong>{scoredCandidates.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Recruiter Requirement Configurator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Job Opening Requirement Builder
            </h3>
            <p className="text-xs text-slate-500">
              Configure mandatory skills to filter applicant pool with zero resume spam.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600">Preset Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => {
                const roleTitle = e.target.value;
                setSelectedRole(roleTitle);
                const roleDef = JOB_ROLES.find((r) => r.title === roleTitle);
                if (roleDef) {
                  setRequiredSkills(roleDef.coreRequiredSkills.slice(0, 5));
                }
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {JOB_ROLES.map((role) => (
                <option key={role.id} value={role.title}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Required Skills Chips */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Required Job Skills (Match Criteria)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {requiredSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-800"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-blue-400 hover:text-blue-700 transition"
                >
                  ×
                </button>
              </span>
            ))}

            {/* Add Skill Input */}
            <div className="inline-flex items-center gap-1">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRequiredSkill()}
                placeholder="+ Add skill (e.g. Docker)"
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddRequiredSkill}
                className="rounded-lg bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-300 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Threshold Slider */}
        <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 min-w-[150px]">
            Minimum Match Score: <strong>{minMatchThreshold}%</strong>
          </label>
          <input
            type="range"
            min={40}
            max={95}
            value={minMatchThreshold}
            onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
            className="w-48 accent-blue-600"
          />
          <span className="text-[11px] text-slate-400">
            Filters out candidates below this threshold
          </span>
        </div>
      </div>

      {/* Candidate Matches Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Ranked Candidate Matches for {selectedRole}
            </h3>
            <p className="text-xs text-slate-500">
              Verified through curriculum analysis and hands-on project portfolios.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Sorted by Skill Match %
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {scoredCandidates.map((c) => {
            const isInvited = invitedCandidateIds.has(c.id);
            return (
              <div key={c.id} className="p-6 hover:bg-slate-50/70 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-sm">
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                      <p className="text-xs text-slate-500">
                        {c.degree} • {c.college} (Class of {c.graduationYear})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Dynamic Match Score */}
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-900 font-heading">
                          {c.dynamicMatchScore}%
                        </span>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Match</p>
                      </div>
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.dynamicMatchScore >= 85 ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${c.dynamicMatchScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Invite Button */}
                    <button
                      onClick={() => handleInvite(c.id)}
                      disabled={isInvited}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
                        isInvited
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isInvited ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Interview Invited</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5" />
                          <span>Invite to Interview</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {c.cvSummary}
                </p>

                {/* Skill Match Breakdown */}
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-400 font-medium">Matched Skills:</span>
                    {c.matchedSkillsList.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 text-[11px] font-semibold"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>

                  {c.missingSkillsList.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-400 font-medium">Missing:</span>
                      {c.missingSkillsList.map((skill) => (
                        <span
                          key={skill}
                          className="rounded bg-rose-50 text-rose-700 border border-rose-200/60 px-2 py-0.5 text-[11px] font-semibold"
                        >
                          ✗ {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
