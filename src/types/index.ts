export type DomainCategory =
  | 'AI & Technology'
  | 'Creative Fields'
  | 'Finance & Business'
  | 'Science & Research'
  | 'Sports & Fitness';

export interface JobRoleDefinition {
  id: string;
  title: string;
  domain: DomainCategory;
  description: string;
  coreRequiredSkills: string[];
  niceToHaveSkills: string[];
  averageSalaryOrStipend: string;
  industryDemand: 'Very High' | 'High' | 'Medium';
  academicCurriculumCoverage: number; // e.g. 45% taught in college
  typicalProjects: string[];
  internshipRoles: string[];
  prerequisites: string[];
}

export interface ExtractedSkill {
  name: string;
  category: 'core' | 'framework' | 'tool' | 'soft';
  normalizedFrom?: string;
  confidence: number;
}

export interface MatchedSkill {
  name: string;
  level: 'Proficient' | 'Intermediate' | 'Familiar';
  evidenceInCv: string;
}

export interface MissingSkill {
  name: string;
  importance: 'critical' | 'high' | 'medium';
  industryDemand: string;
  reason: string;
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  title: string;
  focusSkills: string[];
  keyMilestones: string[];
  recommendedResources: string[];
}

export interface RecommendedProject {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
  description: string;
  targetedMissingSkills: string[];
  whyBuildAfterLearning: string;
  keyDeliverables: string[];
  portfolioHighlight: string;
}

export interface RecommendedInternship {
  roleTitle: string;
  internshipType: string;
  isPaid: boolean;
  organizationTypes: string[];
  targetCompanies: string[];
  keyRequirements: string[];
  typicalStipend: string;
  applicationReadiness: 'Ready Now' | 'Ready in 4 Weeks' | 'Needs Roadmap Completion';
  whyRecommended: string;
  prepTip: string;
}

export interface CVAnalysisResult {
  candidateName: string;
  currentTitle: string;
  targetRole: string;
  targetDomain: DomainCategory;
  analyzedAt: string;
  matchScore: number;
  summary: string;
  academicCurriculumAlignment: string;
  extractedSkills: ExtractedSkill[];
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  learningRoadmap: RoadmapPhase[];
  recommendedProjects: RecommendedProject[];
  recommendedInternships: RecommendedInternship[];
  skillGraphNodes?: SkillGraphNode[];
}

export interface SkillGraphNode {
  id: string;
  label: string;
  category: 'fundamental' | 'core' | 'advanced' | 'tool';
  status: 'possessed' | 'missing' | 'in_progress';
  level: number;
  dependencies: string[];
}

export interface CollegeCohortSkill {
  skill: string;
  percentage: number;
  industryBenchmark: number;
  category: string;
  gap: number;
  status: 'Critical Gap' | 'Moderate Gap' | 'Well Covered';
  recommendedAction: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  college: string;
  degree: string;
  graduationYear: number;
  skills: string[];
  matchScore: number;
  targetRole: string;
  cvSummary: string;
  status: 'Shortlisted' | 'Interviewing' | 'Under Review';
}
