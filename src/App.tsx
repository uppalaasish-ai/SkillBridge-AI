import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { CVAnalyzer } from './components/CVAnalyzer';
import { RoadmapView } from './components/RoadmapView';
import { CollegeDashboard } from './components/CollegeDashboard';
import { PlacementRecruiterHub } from './components/PlacementRecruiterHub';
import { SkillGraphView } from './components/SkillGraphView';
import { ReportModal } from './components/ReportModal';
import { AIChatBot } from './components/AIChatBot';
import { CVAnalysisResult, DomainCategory } from './types';
import { SAMPLE_CV_PRESETS } from './data/jobRoles';

// Default initial analysis so users can immediately test Roadmap & PDF without waiting
const DEFAULT_INITIAL_ANALYSIS: CVAnalysisResult = {
  candidateName: 'Alex Rivera',
  currentTitle: 'B.S. in Computer Science (Sophomore)',
  targetRole: 'Data Analyst',
  targetDomain: 'AI & Technology',
  matchScore: 78,
  summary:
    'Alex demonstrates strong foundational competency in core procedural programming (Python) and relational data querying (PostgreSQL, SQL Server). Coursework in Discrete Math and Database Systems provides a solid quantitative base. To attain placement readiness for competitive Data Analyst openings, Alex needs targeted training in commercial BI tooling (Power BI/Tableau) and statistical exploratory modeling.',
  extractedSkills: [
    { name: 'Python', category: 'core', confidence: 0.98, normalizedFrom: 'python' },
    { name: 'SQL', category: 'core', confidence: 0.95, normalizedFrom: 'postgresql' },
    { name: 'Excel', category: 'framework', confidence: 0.88, normalizedFrom: 'ms excel' },
    { name: 'Data Structures', category: 'core', confidence: 0.92, normalizedFrom: 'data structures' },
    { name: 'Git', category: 'tool', confidence: 0.85, normalizedFrom: 'github' },
  ],
  matchedSkills: [
    { name: 'Python', level: 'Intermediate', evidenceInCv: 'Proficient in Python scripting, pandas, numpy for data extraction.' },
    { name: 'SQL', level: 'Intermediate', evidenceInCv: 'PostgreSQL, complex JOINs, aggregations, database modeling course.' },
    { name: 'Excel', level: 'Familiar', evidenceInCv: 'Pivot tables, VLOOKUP, financial math lab assignments.' },
    { name: 'Data Structures', level: 'Proficient', evidenceInCv: 'CS201 Data Structures with C++ (Grade: A).' },
    { name: 'Git & GitHub', level: 'Familiar', evidenceInCv: 'Maintains personal repo with coursework projects.' },
  ],
  missingSkills: [
    { name: 'Power BI / Tableau', importance: 'critical', reason: 'Industry analytics teams require self-serve dashboarding and executive BI reporting.', industryDemand: 'Very High (88% of job postings)' },
    { name: 'Machine Learning Basics', importance: 'high', reason: 'Modern analytics roles require predictive classification and churn modeling capabilities.', industryDemand: 'High (72% of job postings)' },
    { name: 'Data Pipeline Automation', importance: 'medium', reason: 'Scheduled cron/Airflow ingestion scripts are preferred over manual CSV extracts.', industryDemand: 'Moderate (55% of job postings)' },
  ],
  learningRoadmap: [
    {
      phase: 'Phase 1: Commercial Business Intelligence',
      duration: 'Weeks 1–3',
      title: 'Power BI DAX & Executive Visual Storytelling',
      focusSkills: ['Power BI', 'DAX Formulas', 'Data Modeling (Star Schema)'],
      keyMilestones: [
        'Master star schema relationship building and dimensional modeling',
        'Write custom DAX measures (CALCULATE, FILTER, Time Intelligence)',
        'Build and publish an interactive retail sales performance dashboard',
      ],
      recommendedResources: ['Microsoft Learn Power BI Data Analyst Path', 'SQLBI DAX Guide'],
    },
    {
      phase: 'Phase 2: Predictive & Statistical Machine Learning',
      duration: 'Weeks 4–7',
      title: 'Scikit-Learn Exploratory Modeling & Feature Engineering',
      focusSkills: ['Machine Learning Basics', 'Scikit-Learn', 'Feature Engineering'],
      keyMilestones: [
        'Perform exploratory data analysis (EDA) on messy real-world datasets',
        'Train logistic regression and random forest classification pipelines',
        'Evaluate models using ROC-AUC, Precision-Recall, and confusion matrices',
      ],
      recommendedResources: ['Kaggle Learn: Intermediate Machine Learning', 'Hands-On ML with Scikit-Learn'],
    },
    {
      phase: 'Phase 3: Portfolio Capstone Engineering',
      duration: 'Weeks 8–10',
      title: 'End-to-End Analytics Pipeline Construction',
      focusSkills: ['Automated Pipeline', 'SQL Window Functions', 'Documentation'],
      keyMilestones: [
        'Extract live transactional data via public REST APIs',
        'Automate cleaning and loading into a cloud database with Python scripts',
        'Publish dynamic dashboard with comprehensive README and case study write-up',
      ],
      recommendedResources: ['GitHub Open Source Data Repositories', 'Towards Data Science Best Practices'],
    },
    {
      phase: 'Phase 4: Placement Preparation & Mock Interviews',
      duration: 'Weeks 11–12',
      title: 'Technical Case Studies & Recruiter Screening',
      focusSkills: ['SQL Interview Speed', 'Business Metrics Interpretation', 'Portfolio Presentation'],
      keyMilestones: [
        'Solve 30 LeetCode Database medium/hard SQL challenges (Window functions, CTEs)',
        'Practice articulating business value and ROI using the STAR interview method',
        'Submit tailored applications to curated Tier-1 analytics and tech internships',
      ],
      recommendedResources: ['StrataScratch SQL Interview Prep', 'Cracking the Data Science Interview'],
    },
  ],
  recommendedProjects: [
    {
      title: 'SaaS Customer Churn Prediction & Executive Dashboard',
      description: 'An end-to-end data product that predicts customer churn risk for a subscription service and displays live cohort retention metrics on an interactive Power BI dashboard.',
      techStack: ['Python', 'Pandas', 'Scikit-Learn', 'Power BI', 'PostgreSQL'],
      difficulty: 'Intermediate',
      targetedMissingSkills: ['Power BI / Tableau', 'Machine Learning Basics'],
      whyBuildAfterLearning: 'Directly validates practical mastery of your missing skills (Power BI DAX & Scikit-Learn modeling) by shipping an executive-ready business dashboard.',
      keyDeliverables: [
        'Complete Jupyter Notebook with feature engineering and cross-validated Random Forest model',
        'Interactive 3-page Power BI dashboard showing customer lifetime value and churn risk drivers',
        'Production Python inference script outputting churn probabilities to a SQL database',
      ],
      portfolioHighlight: 'Demonstrates both technical machine learning acumen and business stakeholder communication skills.',
    },
    {
      title: 'E-Commerce Marketing ROI & Attribution Analyzer',
      description: 'Ingests multi-channel marketing campaign data (Google Ads, Meta, TikTok) to compute return on ad spend (ROAS) and customer acquisition cost across customer cohorts.',
      techStack: ['Python', 'SQL Window Functions', 'Tableau / Power BI', 'Statsmodels'],
      difficulty: 'Intermediate',
      targetedMissingSkills: ['Power BI / Tableau', 'Data Pipeline Automation'],
      whyBuildAfterLearning: 'Provides concrete proof of ETL pipeline automation and multi-touch data attribution that hiring managers look for in Data Analyst candidates.',
      keyDeliverables: [
        'Advanced SQL queries calculating cohort retention curves and multi-touch attribution',
        'Automated ETL script cleaning currency conversions and campaign UTM tags',
        'One-page executive briefing memo recommending budget re-allocations',
      ],
      portfolioHighlight: 'Directly mirrors the day-to-day analytics deliverables at modern high-growth tech companies.',
    },
  ],
  recommendedInternships: [
    {
      roleTitle: 'Commercial Operations & Analytics Intern',
      internshipType: 'Growth & Business Analytics Intern',
      isPaid: true,
      typicalStipend: '₹30,000 – ₹45,000 / month',
      organizationTypes: ['Tier-1 Tech Companies', 'Fintech Startups', 'E-Commerce Unicorns'],
      targetCompanies: ['Swiggy', 'Razorpay', 'Flipkart', 'CRED'],
      keyRequirements: ['SQL Fluency', 'Python / Pandas', 'Power BI or Tableau', 'Strong Communication'],
      applicationReadiness: 'Ready in 4 Weeks',
      whyRecommended: 'Highly recommended for Alex: leverages strong SQL and Python foundations while directly closing the commercial analytics gap through mentorship in live sprint cycles.',
      prepTip: 'Be prepared to write live SQL window functions on a virtual whiteboard and discuss how you handle missing or corrupted data in transactional tables.',
    },
    {
      roleTitle: 'Business Intelligence Strategy Trainee',
      internshipType: 'Enterprise BI Trainee',
      isPaid: true,
      typicalStipend: '₹22,000 – ₹35,000 / month',
      organizationTypes: ['Global Strategy Consultancies', 'Enterprise Technology GCCs', 'Supply Chain Analytics'],
      targetCompanies: ['Deloitte India', 'EY GDS', 'PwC', 'Fractal Analytics'],
      keyRequirements: ['Advanced Excel', 'Data Visualization', 'Problem-Solving Frameworks', 'Stakeholder Presentations'],
      applicationReadiness: 'Ready Now',
      whyRecommended: 'Immediate placement recommendation: Alex already possesses the fundamental analytical mindset and coursework to qualify for early screening rounds.',
      prepTip: 'Emphasize your CS analytical mindset and focus on how data models translate into concrete operational decisions.',
    },
    {
      roleTitle: 'Product Data Science Fellow',
      internshipType: 'Early-Stage Startup Innovation Fellow',
      isPaid: true,
      typicalStipend: '₹25,000 – ₹40,000 / month',
      organizationTypes: ['Series-A/B SaaS Startups', 'B2B Product Companies'],
      targetCompanies: ['Postman', 'Hasura', 'BrowserStack'],
      keyRequirements: ['A/B Testing Basics', 'Python ETL', 'Product Metrics (DAU/MAU, Retention)'],
      applicationReadiness: 'Ready in 4 Weeks',
      whyRecommended: 'Recommended for rapid portfolio acceleration: early-stage product teams give direct ownership of end-to-end data pipelines.',
      prepTip: 'Highlight independent projects where you derived insights from real open datasets and explained business takeaways in a GitHub README.',
    },
  ],
  academicCurriculumAlignment:
    'Alex’s CS university curriculum covers approximately 45% of real-world Data Analyst demands (algorithms, basic SQL, programming fundamentals). The university does not teach commercial BI tooling or practical MLOps pipelines. Completing the recommended 4-phase bridge curriculum will close the remaining 55% gap.',
  analyzedAt: new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  // Initialized to null so the input is given by the user themselves
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainCategory>('AI & Technology');
  const [selectedRoleForAnalyzer, setSelectedRoleForAnalyzer] = useState<string>('Data Analyst');

  const handleStartAnalysis = (role?: string) => {
    if (role) {
      setSelectedRoleForAnalyzer(role);
    }
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisComplete = (result: CVAnalysisResult) => {
    setAnalysisResult(result);
    // Smooth transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Menu */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        analysisResult={analysisResult}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <HomeHero
            onStartAnalysis={handleStartAnalysis}
            onExploreCollege={() => setActiveTab('college')}
            onExplorePlacements={() => setActiveTab('placement')}
            onExploreGraph={() => setActiveTab('graph')}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
          />
        )}

        {activeTab === 'analyzer' && (
          <CVAnalyzer
            onAnalysisComplete={handleAnalysisComplete}
            currentResult={analysisResult}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            initialRole={selectedRoleForAnalyzer}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            result={analysisResult}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onNavigateToAnalyzer={() => setActiveTab('analyzer')}
          />
        )}

        {activeTab === 'college' && <CollegeDashboard />}

        {activeTab === 'placement' && <PlacementRecruiterHub />}

        {activeTab === 'graph' && (
          <SkillGraphView
            currentResult={analysisResult}
            onNavigateToAnalyzer={() => setActiveTab('analyzer')}
          />
        )}
      </main>

      {/* PDF & Dossier Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        result={analysisResult}
      />

      {/* 24/7 AI Chatbot for User Guidance & Technical Support */}
      <AIChatBot
        currentResult={analysisResult}
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
              SB
            </div>
            <span className="font-semibold text-slate-800">SKILL BRIDGE</span>
            <span>— Academia–Industry Skill Mapping & Placement Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setActiveTab('overview')}
              className="hover:text-blue-600 transition"
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('analyzer')}
              className="hover:text-blue-600 transition"
            >
              CV Analyzer
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="hover:text-blue-600 transition"
            >
              Roadmap & Projects
            </button>
            <button
              onClick={() => setActiveTab('college')}
              className="hover:text-blue-600 transition"
            >
              College Analytics
            </button>
            <button
              onClick={() => setActiveTab('placement')}
              className="hover:text-blue-600 transition"
            >
              Placement Portal
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Empowering students to become job-ready for the careers they aspire to.
          </div>
        </div>
      </footer>
    </div>
  );
}
