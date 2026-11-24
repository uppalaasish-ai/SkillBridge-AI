import express from 'express';
import path from 'path';
import { GoogleGenAI, Type, ThinkingLevel, Chat } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { JOB_ROLES, DOMAINS } from './src/data/jobRoles';
import { CVAnalysisResult, DomainCategory } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy GoogleGenAI initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const ai = getGeminiClient();
  res.json({
    status: 'ok',
    hasGeminiKey: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Roles and Domains endpoints
app.get('/api/roles', (req, res) => {
  res.json({ roles: JOB_ROLES });
});

app.get('/api/domains', (req, res) => {
  res.json({ domains: DOMAINS });
});

// CV File Parser endpoint (PDF, DOCX, TXT with PDFParse, Mammoth & Gemini Vision OCR)
app.post('/api/parse-cv-file', async (req, res) => {
  try {
    const { fileName, fileData, mimeType } = req.body;

    if (!fileData || typeof fileData !== 'string') {
      res.status(400).json({ error: 'No file data received' });
      return;
    }

    const base64Clean = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');
    const lowerName = (fileName || '').toLowerCase();
    const effectiveMime = (mimeType || '').toLowerCase();

    let extractedText = '';

    // 1. PDF Documents
    if (lowerName.endsWith('.pdf') || effectiveMime.includes('pdf')) {
      try {
        const { PDFParse } = await import('pdf-parse');
        const parser = new PDFParse({ data: buffer });
        const pdfResult = await parser.getText();
        if (pdfResult && typeof pdfResult.text === 'string') {
          // Remove page boundary markers like "-- 1 of 2 --"
          extractedText = pdfResult.text.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '').trim();
        }
      } catch (pdfErr) {
        console.warn('PDFParse failed on server:', pdfErr);
      }

      // If PDF text is still sparse or empty (e.g. scanned image resume), try Gemini Multimodal OCR
      if (extractedText.length < 50) {
        const ai = getGeminiClient();
        if (ai) {
          try {
            console.log('Using Gemini Vision OCR for PDF document...');
            const ocrResponse = await ai.models.generateContent({
              model: 'gemini-4-hydrogen',
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      inlineData: {
                        data: base64Clean,
                        mimeType: 'application/pdf',
                      },
                    },
                    {
                      text: 'Transcribe and extract all resume/CV text from this document accurately. Preserve sections, headings, candidate details, skills, education, experience, and project descriptions. Return only the extracted plain text.',
                    },
                  ],
                },
              ],
            });
            const geminiText = ocrResponse.text?.trim() || '';
            if (geminiText.length > 50) {
              extractedText = geminiText;
            }
          } catch (geminiOcrErr) {
            console.warn('Gemini OCR for PDF failed:', geminiOcrErr);
          }
        }
      }
    }
    // 2. DOCX / Word Documents
    else if (
      lowerName.endsWith('.docx') ||
      effectiveMime.includes('word') ||
      effectiveMime.includes('officedocument')
    ) {
      try {
        const mammoth = await import('mammoth');
        const docResult = await mammoth.extractRawText({ buffer });
        extractedText = (docResult.value || '').trim();
      } catch (docxErr) {
        console.warn('Mammoth docx parsing failed:', docxErr);
      }
    }
    // 3. Plain Text / Markdown / RTF / CSV
    else {
      extractedText = buffer.toString('utf-8').trim();
    }

    // Clean up formatting: line breaks, excess spacing
    extractedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!extractedText || extractedText.length < 20) {
      res.status(422).json({
        error: `Could not extract readable text from "${fileName}". The file may be image-only, protected, or empty. Please copy and paste your resume text directly into the box.`,
      });
      return;
    }

    res.json({
      success: true,
      text: extractedText,
      fileName,
      wordCount: extractedText.split(/\s+/).length,
      characterCount: extractedText.length,
    });
  } catch (err: any) {
    console.error('Error in /api/parse-cv-file:', err);
    res.status(500).json({ error: 'Server error parsing resume file: ' + err.message });
  }
});

// Fallback rule-based NLP and analysis engine if Gemini key is missing or model throws
function generateRuleBasedAnalysis(
  cvText: string,
  targetRoleTitle: string,
  domain: DomainCategory
): CVAnalysisResult {
  const role = JOB_ROLES.find(
    (r) => r.title.toLowerCase() === targetRoleTitle.toLowerCase()
  ) || JOB_ROLES[0];

  const lowerCv = cvText.toLowerCase();

  // Extract candidate name from first lines
  const firstLines = cvText.split('\n').filter((l) => l.trim().length > 0);
  let candidateName = 'Student Candidate';
  if (firstLines.length > 0) {
    const candidateMatch = firstLines[0].replace(/[^a-zA-Z\s]/g, '').trim();
    if (candidateMatch.length > 2 && candidateMatch.length < 35) {
      candidateName = candidateMatch;
    }
  }

  // Normalization dictionary
  const normalizationMap: Record<string, string> = {
    'ml': 'Machine Learning',
    'ai': 'Artificial Intelligence',
    'dl': 'Deep Learning',
    'nlp': 'Natural Language Processing',
    'cv': 'Computer Vision',
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'py': 'Python',
    'reactjs': 'React',
    'react.js': 'React',
    'node': 'Node.js',
    'nodejs': 'Node.js',
    'postgres': 'PostgreSQL',
    'bi': 'Power BI',
    'powerbi': 'Power BI',
  };

  const detectedPossessedSkills: { name: string; evidence: string }[] = [];
  const checkedKeys = new Set<string>();

  // Check role skills
  for (const skill of [...role.coreRequiredSkills, ...role.niceToHaveSkills]) {
    const rawTerms = skill.split(/[/(),]/).map((s) => s.trim().toLowerCase()).filter(Boolean);
    let matched = false;
    let evidence = '';

    for (const term of rawTerms) {
      if (term.length > 1 && lowerCv.includes(term)) {
        matched = true;
        // Find line containing term
        const matchingLine = firstLines.find((l) => l.toLowerCase().includes(term)) || `Found mention of ${skill}`;
        evidence = matchingLine.trim();
        break;
      }
    }

    if (matched && !checkedKeys.has(skill)) {
      checkedKeys.add(skill);
      detectedPossessedSkills.push({ name: skill, evidence });
    }
  }

  // Detect any generic skills mentioned
  const commonTechs = [
    'Python', 'SQL', 'Excel', 'C++', 'Java', 'JavaScript', 'HTML', 'CSS',
    'React', 'Git', 'GitHub', 'Linux', 'Pandas', 'NumPy', 'Scikit-Learn',
    'Docker', 'Figma', 'Tableau', 'Power BI', 'AWS', 'FastAPI', 'PostgreSQL'
  ];

  for (const tech of commonTechs) {
    if (lowerCv.includes(tech.toLowerCase()) && !checkedKeys.has(tech)) {
      checkedKeys.add(tech);
      detectedPossessedSkills.push({
        name: tech,
        evidence: `Demonstrated in resume coursework or projects`,
      });
    }
  }

  // Calculate missing skills from core required skills
  const missingFromCore: { name: string; importance: 'critical' | 'high' | 'medium'; industryDemand: string; reason: string }[] = [];
  for (const core of role.coreRequiredSkills) {
    const isPossessed = detectedPossessedSkills.some(
      (p) => p.name.toLowerCase() === core.toLowerCase() || core.toLowerCase().includes(p.name.toLowerCase())
    );
    if (!isPossessed) {
      missingFromCore.push({
        name: core,
        importance: 'critical',
        industryDemand: '90%+ of job postings require this skill',
        reason: `Crucial foundation for entry-level ${role.title} positions.`,
      });
    }
  }

  // Calculate match score
  const coreTotal = role.coreRequiredSkills.length;
  const coreMatched = coreTotal - missingFromCore.length;
  let rawScore = Math.round((coreMatched / Math.max(1, coreTotal)) * 85);
  if (detectedPossessedSkills.length >= 6) rawScore += 10;
  const matchScore = Math.min(95, Math.max(30, rawScore));

  const roadmap = [
    {
      phase: 'Phase 1: Foundations & Core Gaps',
      duration: 'Weeks 1–3',
      title: `Bridge Essential Foundations for ${role.title}`,
      focusSkills: missingFromCore.slice(0, 2).map((m) => m.name).concat(['Core Tooling Setup']),
      keyMilestones: [
        `Complete guided hands-on tutorials on ${missingFromCore[0]?.name || 'advanced tooling'}`,
        'Set up automated dev environment with Git version control and proper testing habits',
        'Solve 10+ practical algorithmic or domain-specific problem sets',
      ],
      recommendedResources: [
        'Interactive Documentation & Official Quickstarts',
        'Coursera / freeCodeCamp Specialization Tracks',
        'GitHub curated awesome-lists for ' + role.title,
      ],
    },
    {
      phase: 'Phase 2: Intermediate Synthesis & Tooling',
      duration: 'Weeks 4–7',
      title: 'Practical Workflows & System Architecture',
      focusSkills: missingFromCore.slice(2, 4).map((m) => m.name).concat(['Testing & Profiling']),
      keyMilestones: [
        `Build working prototypes integrating ${detectedPossessedSkills[0]?.name || 'Python'} with newly learned skills`,
        'Implement clean data pipelines / state architectures with documentation',
        'Peer review code and refactor for production performance benchmarks',
      ],
      recommendedResources: [
        'Real World Production Codebases on GitHub',
        'Domain-specific Case Studies and Engineering Blogs',
      ],
    },
    {
      phase: 'Phase 3: Portfolio Capstone Build',
      duration: 'Weeks 8–10',
      title: 'Industry-Grade Capstone Development',
      focusSkills: [role.coreRequiredSkills[0] || 'Core', 'End-to-End Deployment', 'CI/CD'],
      keyMilestones: [
        `Build and deploy: ${role.typicalProjects[0]}`,
        'Write comprehensive README with architecture diagram, demo GIF, and live link',
        'Package code using Docker containers and cloud hosting',
      ],
      recommendedResources: [
        'Cloud Free Tier Hosting (Cloud Run, Vercel, Railway)',
        'Technical writing guides for developer portfolios',
      ],
    },
    {
      phase: 'Phase 4: Interview Prep & Placement Launch',
      duration: 'Weeks 11–12',
      title: 'Targeted Applications & Technical Screenings',
      focusSkills: ['System Design Basics', 'Behavioral STAR Stories', 'Technical Presentation'],
      keyMilestones: [
        'Tailor CV bullet points with quantified outcomes (X% improved, Y ms reduced)',
        'Reach out to 15+ university alumni working in targeted organizations',
        'Complete 3 mock technical interviews under timed conditions',
      ],
      recommendedResources: [
        'Levels.fyi Interview Guides',
        'GitHub Tech Interview Handbook',
        'SkillBridge AI Placement Matching Engine',
      ],
    },
  ];

  const projects = [
    {
      title: role.typicalProjects[0] || `Production ${role.title} System`,
      difficulty: 'Intermediate' as const,
      targetedMissingSkills: missingFromCore.slice(0, 2).map((m) => m.name),
      whyBuildAfterLearning: `Build directly after completing foundational learning phases to demonstrate hands-on mastery of missing skills: ${missingFromCore.slice(0, 2).map((m) => m.name).join(' & ') || 'production frameworks'}.`,
      techStack: [role.coreRequiredSkills[0] || 'Python', role.coreRequiredSkills[1] || 'SQL', missingFromCore[0]?.name || 'Docker', 'FastAPI'],
      description: `A fully realized, end-to-end implementation solving a legitimate business problem in ${role.domain}. Includes automated data ingestion, validation, processing logic, and an interactive dashboard.`,
      keyDeliverables: [
        'Interactive live web interface or dashboard hosted on cloud',
        'Containerized backend with health-checks and unit tests (>80% coverage)',
        'Production README with system architecture diagram and benchmark results',
      ],
      portfolioHighlight: 'Demonstrates enterprise-readiness, error-resilience, and the ability to ship working systems independently.',
    },
    {
      title: role.typicalProjects[1] || `Automated Analytics & Predictive Pipeline`,
      difficulty: 'Advanced' as const,
      targetedMissingSkills: (missingFromCore.length > 1 ? missingFromCore.slice(1, 3) : missingFromCore).map((m) => m.name),
      whyBuildAfterLearning: `Build after roadmap completion to prove advanced competence in ${missingFromCore.slice(1, 3).map((m) => m.name).join(' & ') || 'scalable systems'} and stand out in campus placement interviews.`,
      techStack: [role.coreRequiredSkills[0] || 'Python', 'PostgreSQL', missingFromCore[1]?.name || 'Cloud Infrastructure', 'CI/CD'],
      description: `Scalable data processing and analytics platform with automated scheduling, alerting, and automated metric reporting.`,
      keyDeliverables: [
        'Automated CI/CD deployment pipeline via GitHub Actions',
        'Modular architecture with separated service layers and type safety',
        'Clean, reproducible documentation and benchmark reports',
      ],
      portfolioHighlight: 'Proves advanced data modeling capability and architectural maturity beyond university assignments.',
    },
  ];

  const internships = [
    {
      roleTitle: role.internshipRoles[0] || `${role.title} Intern`,
      internshipType: 'Product Engineering & Development Internship',
      isPaid: true,
      organizationTypes: ['High-growth Tech Startups', 'Mid-market SaaS Providers', 'Enterprise Innovation GCCs'],
      targetCompanies: ['Swiggy', 'Razorpay', 'Flipkart', 'CRED', 'Product Startups'],
      keyRequirements: role.coreRequiredSkills.slice(0, 4),
      typicalStipend: role.averageSalaryOrStipend.includes('Intern')
        ? role.averageSalaryOrStipend.split('Intern:')[1].replace(')', '').trim()
        : '₹25,000 – ₹45,000 / month',
      applicationReadiness: matchScore >= 75 ? ('Ready Now' as const) : ('Ready in 4 Weeks' as const),
      whyRecommended: `Strategic Recommendation: Best-fit internship type to convert candidate's foundational knowledge in ${detectedPossessedSkills[0]?.name || 'core tech'} into production-grade systems while closing critical tooling gaps.`,
      prepTip: `Highlight your work on ${detectedPossessedSkills[0]?.name || 'core technologies'} in your top CV project section and emphasize hands-on lab experience.`,
    },
    {
      roleTitle: role.internshipRoles[1] || `Associate ${role.title} Trainee`,
      internshipType: 'Corporate Graduate & Innovation Trainee',
      isPaid: true,
      organizationTypes: ['Global Technology Consultancies', 'Product Engineering Studios', 'Enterprise IT'],
      targetCompanies: ['Deloitte India', 'TCS Research', 'Infosys Labs', 'Wipro Digital'],
      keyRequirements: [role.coreRequiredSkills[0] || 'Core Language', 'Problem Solving', 'Git Version Control'],
      typicalStipend: '₹20,000 – ₹35,000 / month',
      applicationReadiness: ('Ready Now' as const),
      whyRecommended: `Strategic Recommendation: Structured corporate trainee track providing structured onboarding, industry certifications, and high conversion into full-time placement offers.`,
      prepTip: 'Prepare clear 2-minute project walkthroughs using the STAR method (Situation, Task, Action, Result).',
    },
    {
      roleTitle: role.internshipRoles[2] || `Junior Research & Applied Analytics Fellow`,
      internshipType: 'Applied R&D & Open Source Fellowship',
      isPaid: true,
      organizationTypes: ['Applied AI & Technology Labs', 'DeepTech Incubators', 'Open Source Fellowships'],
      targetCompanies: ['C-DAC', 'IIT Incubator Labs', 'Specialized Innovation Studios'],
      keyRequirements: [role.coreRequiredSkills[1] || 'Foundations', 'Analytical Thinking', 'System Architecture'],
      typicalStipend: '₹22,000 – ₹40,000 / month',
      applicationReadiness: matchScore >= 70 ? ('Ready Now' as const) : ('Needs Roadmap Completion' as const),
      whyRecommended: `Strategic Recommendation: High-credibility research fellowship to publish technical write-ups, solve novel edge cases, and stand out for elite campus placements.`,
      prepTip: 'Bring code samples with detailed README documentation and GitHub commit history to interview screenings.',
    },
  ];

  return {
    candidateName,
    currentTitle: firstLines[1]?.slice(0, 40) || 'Aspiring Professional',
    targetRole: role.title,
    targetDomain: role.domain,
    analyzedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    matchScore,
    summary: `Candidate displays foundational competence in ${detectedPossessedSkills.slice(0, 3).map((s) => s.name).join(', ') || 'core concepts'}. To bridge the gap to a competitive ${role.title} role, the immediate priority is mastering ${missingFromCore.slice(0, 2).map((m) => m.name).join(' and ') || 'advanced tools'} and creating portfolio capstone projects with tangible business impact.`,
    academicCurriculumAlignment: `College curriculum typically covers ~${role.academicCurriculumCoverage}% of the industry requirements for ${role.title}. The remaining ${100 - role.academicCurriculumCoverage}% consists of modern tooling, automated deployment, and enterprise frameworks that must be bridged through targeted project-based learning.`,
    extractedSkills: detectedPossessedSkills.map((s) => ({
      name: s.name,
      category: 'core',
      confidence: 0.92,
      normalizedFrom: normalizationMap[s.name.toLowerCase()] || s.name,
    })),
    matchedSkills: detectedPossessedSkills.map((s) => ({
      name: s.name,
      level: 'Proficient',
      evidenceInCv: s.evidence,
    })),
    missingSkills: missingFromCore,
    learningRoadmap: roadmap,
    recommendedProjects: projects,
    recommendedInternships: internships,
  };
}

// CV Analysis Route with Gemini 3.8 Flash
app.post('/api/analyze-cv', async (req, res) => {
  try {
    const {
      cvText,
      targetRole,
      domain,
      targetCompanyType,
      collegeSyllabus,
      customJobDescription,
      candidateNameOverride,
    } = req.body;

    if (!cvText || typeof cvText !== 'string' || cvText.trim().length < 20) {
      res.status(400).json({ error: 'Please provide a valid CV text (minimum 20 characters) or upload a resume file.' });
      return;
    }

    const effectiveRoleTitle = (targetRole || 'Software Engineer').trim();
    const matchedRoleDef = JOB_ROLES.find(
      (r) => r.title.toLowerCase() === effectiveRoleTitle.toLowerCase()
    ) || {
      id: 'custom-role',
      title: effectiveRoleTitle,
      domain: (domain as DomainCategory) || 'AI & Technology',
      description: `Target career role: ${effectiveRoleTitle}`,
      coreRequiredSkills: customJobDescription ? [] : ['Core Problem Solving', 'Domain Fundamentals', 'Industry Tools'],
      niceToHaveSkills: ['Communication', 'Version Control'],
      industryDemand: 'High',
      academicCurriculumCoverage: 45,
      internshipRoles: [`${effectiveRoleTitle} Intern`],
      typicalProjects: [`${effectiveRoleTitle} Production System`],
      averageSalaryOrStipend: '₹8 – ₹16 LPA (Intern: ₹25,000 – ₹40,000 / month)',
    };

    const selectedDomain = (domain as DomainCategory) || matchedRoleDef.domain;
    const ai = getGeminiClient();

    if (!ai) {
      console.log('Gemini API key not configured or empty, using high-fidelity NLP analysis engine');
      const fallbackResult = generateRuleBasedAnalysis(cvText, effectiveRoleTitle, selectedDomain);
      if (candidateNameOverride && candidateNameOverride.trim()) {
        fallbackResult.candidateName = candidateNameOverride.trim();
      }
      res.json({ result: fallbackResult, source: 'nlp-engine' });
      return;
    }

    // Call Gemini 3.8 Flash with structured JSON
    const systemPrompt = `You are AI RESUME JOB SKILL GAP ANALYZER, an expert Academia-Industry Skill Mapping & Placement Intelligence System.
Analyze the user's uploaded CV/Resume against the target job role "${effectiveRoleTitle}" in the domain "${selectedDomain}".
${customJobDescription ? `USER PROVIDED CUSTOM JOB DESCRIPTION:\n"${customJobDescription}"\nExtract the required and nice-to-have skills directly from this job description!` : `Standard required skills for this role: ${matchedRoleDef.coreRequiredSkills.join(', ')}.\nNice-to-have skills: ${matchedRoleDef.niceToHaveSkills.join(', ')}.`}

Your task:
1. Extract candidate name (or use "${candidateNameOverride || ''}" if provided) and current academic/professional standing from the CV text.
2. Identify all skills present in the CV and normalize abbreviations (e.g. ML -> Machine Learning, ReactJS -> React, AWS EC2 -> Cloud Infrastructure).
3. Compare student's actual skills with the target industry role requirements.
4. Calculate an honest, realistic match score percentage (0-100).
5. Identify matched skills with exact evidence from the CV.
6. Identify critical missing skills that companies demand for this role.
7. Provide an exact 4-phase learning roadmap on how the student can start and learn each missing skill.
8. Recommend 2-3 impressive, hands-on capstone projects the student should build AFTER learning to prove their readiness.
9. INTERNSHIP ADVISORY RECOMMENDATIONS: Recommend 3-4 specific TYPES OF INTERNSHIPS the candidate should target based on their skill gaps and placement goals.
   - All monthly stipends MUST be specified in Indian Rupees (₹), e.g., "₹25,000 – ₹45,000 / month", "₹20,000 – ₹35,000 / month", "₹30,000 – ₹50,000 / month".
   - Explicitly indicate that these are Paid Internships ("isPaid": true).
   - FOCUS ON STRATEGIC RECOMMENDATIONS & ADVICE: Provide the specific "internshipType" (e.g., "Product Engineering Internship", "Data Analytics Trainee", "Startup Growth Fellow", "Applied R&D Fellowship") and a comprehensive "whyRecommended" advisory explaining WHY this type of internship matches the candidate's verified skills and what specific career gap it bridges.
10. Highlight how the college curriculum maps to industry demand (academic gap).

Return strictly valid JSON matching this schema:
{
  "candidateName": "string",
  "currentTitle": "string",
  "targetRole": "${effectiveRoleTitle}",
  "targetDomain": "${selectedDomain}",
  "analyzedAt": "string",
  "matchScore": number (0-100),
  "summary": "string",
  "academicCurriculumAlignment": "string",
  "extractedSkills": [{"name": "string", "category": "core"|"framework"|"tool"|"soft", "confidence": number, "normalizedFrom": "string"}],
  "matchedSkills": [{"name": "string", "level": "Proficient"|"Intermediate"|"Familiar", "evidenceInCv": "string"}],
  "missingSkills": [{"name": "string", "importance": "critical"|"high"|"medium", "industryDemand": "string", "reason": "string"}],
  "learningRoadmap": [{"phase": "string", "duration": "string", "title": "string", "focusSkills": ["string"], "keyMilestones": ["string"], "recommendedResources": ["string"]}],
  "recommendedProjects": [{"title": "string", "difficulty": "Beginner"|"Intermediate"|"Advanced", "targetedMissingSkills": ["string (exact missing skill names from missingSkills that this project reinforces)"], "whyBuildAfterLearning": "string (concrete reason why building this project after learning proves the missing skills to recruiters)", "techStack": ["string"], "description": "string", "keyDeliverables": ["string"], "portfolioHighlight": "string"}],
  "recommendedInternships": [
    {
      "roleTitle": "string",
      "internshipType": "string",
      "isPaid": true,
      "typicalStipend": "string (in Indian Rupees ₹ e.g. ₹25,000 – ₹45,000 / month)",
      "organizationTypes": ["string"],
      "targetCompanies": ["string"],
      "keyRequirements": ["string"],
      "applicationReadiness": "Ready Now"|"Ready in 4 Weeks"|"Needs Roadmap Completion",
      "whyRecommended": "string (clear advisory rationale for why this type of internship is recommended for the candidate)",
      "prepTip": "string"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            {
              text: `USER CV / RESUME CONTENT:\n${cvText}\n\nTARGET ROLE: ${effectiveRoleTitle}\n${customJobDescription ? `USER PROVIDED JOB DESCRIPTION:\n${customJobDescription}\n` : ''}OPTIONAL COLLEGE SYLLABUS: ${collegeSyllabus || 'Standard University Undergraduate Curriculum'}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    let parsedData: CVAnalysisResult;
    try {
      parsedData = JSON.parse(responseText.trim());
      // Ensure required properties exist
      if (!parsedData.matchedSkills || !parsedData.missingSkills || !parsedData.learningRoadmap) {
        throw new Error('Incomplete JSON schema');
      }
      res.json({ result: parsedData, source: 'gemini-4-hydrogen' });
    } catch (parseErr) {
      console.warn('Could not parse Gemini JSON response, falling back to NLP engine:', parseErr);
      const fallbackResult = generateRuleBasedAnalysis(cvText, matchedRoleDef.title, selectedDomain);
      res.json({ result: fallbackResult, source: 'nlp-engine-fallback' });
    }
  } catch (error: any) {
    console.error('Error in /api/analyze-cv:', error);
    // Graceful fallback rather than crashing client
    const fallbackResult = generateRuleBasedAnalysis(
      req.body.cvText || '',
      req.body.targetRole || 'Data Analyst',
      req.body.domain || 'AI & Technology'
    );
    res.json({ result: fallbackResult, source: 'resilient-nlp-engine', errorNote: error.message });
  }
});

// Multi-turn Chat Session Store (maintains Gemini Chat instances per sessionId)
interface StoredChatSession {
  chat: Chat;
  model: string;
  roleId: string;
  useSearch: boolean;
  lastUsed: number;
}
const chatSessions = new Map<string, StoredChatSession>();

// Periodically prune stale chat sessions (> 1 hour)
setInterval(() => {
  const cutoff = Date.now() - 60 * 60 * 1000;
  for (const [key, session] of chatSessions.entries()) {
    if (session.lastUsed < cutoff) {
      chatSessions.delete(key);
    }
  }
}, 15 * 60 * 1000);

function extractGroundingSources(response: any): { title: string; uri: string }[] {
  const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!Array.isArray(chunks)) return [];
  const seen = new Set<string>();
  const sources: { title: string; uri: string }[] = [];
  for (const chunk of chunks) {
    const uri = chunk?.web?.uri;
    const title = chunk?.web?.title;
    if (uri && !seen.has(uri)) {
      seen.add(uri);
      let fallbackHost = uri;
      try {
        fallbackHost = new URL(uri).hostname;
      } catch {
        // Use raw URI if URL parsing fails
      }
      sources.push({
        uri,
        title: title || fallbackHost,
      });
    }
  }
  return sources.slice(0, 6);
}

function mapGeminiApiError(err: any): { status: number; message: string } {
  let rawMessage = err?.message || String(err || '');
  try {
    if (rawMessage.trim().startsWith('{')) {
      const parsed = JSON.parse(rawMessage);
      if (parsed?.error?.message) {
        rawMessage = parsed.error.message;
      }
    }
  } catch {
    // Keep original message if not JSON
  }

  const msg = rawMessage.toLowerCase();
  const status = err?.status || err?.code;
  if (status === 403 || msg.includes('permission_denied') || msg.includes('api_key_invalid') || (status === 400 && msg.includes('api key'))) {
    return {
      status: 403,
      message: 'Invalid or unauthorized Gemini API key. Please check or select your API key in Settings > Secrets.',
    };
  }
  if (status === 429 || msg.includes('resource_exhausted') || msg.includes('quota')) {
    return {
      status: 429,
      message: 'API quota limit reached. Please wait a moment and try again.',
    };
  }
  if (status === 503 || msg.includes('unavailable') || msg.includes('high demand') || msg.includes('overloaded')) {
    return {
      status: 503,
      message: 'The AI model is temporarily experiencing high demand. Please wait a moment and click Retry.',
    };
  }
  if (status === 404 || msg.includes('not_found')) {
    return {
      status: 404,
      message: 'Requested Gemini model could not be found. Please try switching assistant modes.',
    };
  }
  return {
    status: 500,
    message: rawMessage || 'Unable to reach Gemini AI service right now. Please try again.',
  };
}

function isTransientGeminiError(err: any): boolean {
  const mapped = mapGeminiApiError(err);
  return mapped.status === 503 || mapped.status === 429;
}

const sleepMs = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function sanitizeChatHistory(
  rawHistory: any[],
  incomingMessage: string
): { role: 'user' | 'model'; parts: { text: string }[] }[] {
  if (!Array.isArray(rawHistory)) return [];

  const cleaned: { role: 'user' | 'model'; text: string }[] = [];
  for (const item of rawHistory) {
    const text = typeof (item?.content ?? item?.text) === 'string' ? (item.content ?? item.text).trim() : '';
    if (!text) continue;
    const role: 'user' | 'model' = item?.role === 'user' ? 'user' : 'model';

    // Ensure history starts with a 'user' message
    if (cleaned.length === 0 && role !== 'user') continue;

    // Merge consecutive messages of the same role to preserve strict user/model alternation
    const prev = cleaned[cleaned.length - 1];
    if (prev && prev.role === role) {
      prev.text = `${prev.text}\n\n${text}`;
    } else {
      cleaned.push({ role, text });
    }
  }

  // Ensure history ends on a 'model' turn so the next sendMessage('user') alternates cleanly
  if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === 'user') {
    if (cleaned[cleaned.length - 1].text === incomingMessage.trim() || cleaned.length === 1) {
      cleaned.pop();
    } else {
      cleaned.pop();
    }
  }

  return cleaned.slice(-10).map((entry) => ({
    role: entry.role,
    parts: [{ text: entry.text }],
  }));
}

// AI Chat Bot Endpoint (Multi-turn ai.chats.create + Role Personas + Search Grounding + Resilient Retry/Fallback)
app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      history = [],
      context = {},
      sessionId = 'default-session',
      roleId = 'mentor',
      useSearchGrounding = false,
      resetSession = false,
    } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Gemini API key is not configured. Please add or select a GEMINI_API_KEY in Settings > Secrets to use the live AI chatbot.',
      });
      return;
    }

    const cleanMessage = message.trim();

    // Determine suggested navigational action
    const lowerMsg = cleanMessage.toLowerCase();
    let suggestedTab: string | undefined;
    let suggestedActionLabel: string | undefined;

    if (lowerMsg.includes('roadmap') || lowerMsg.includes('milestone') || lowerMsg.includes('internship') || lowerMsg.includes('stipend') || lowerMsg.includes('project') || lowerMsg.includes('capstone')) {
      suggestedTab = 'roadmap';
      suggestedActionLabel = 'Open Roadmap & Projects';
    } else if (lowerMsg.includes('graph') || lowerMsg.includes('pathway') || lowerMsg.includes('prerequisite') || lowerMsg.includes('dependency')) {
      suggestedTab = 'graph';
      suggestedActionLabel = 'Explore 14 Pathways in Skill Graph';
    } else if (lowerMsg.includes('upload') || lowerMsg.includes('cv') || lowerMsg.includes('resume') || lowerMsg.includes('analyze') || lowerMsg.includes('match score')) {
      suggestedTab = 'analyzer';
      suggestedActionLabel = 'Go to CV Analyzer';
    } else if (lowerMsg.includes('college') || lowerMsg.includes('tpo') || lowerMsg.includes('dean') || lowerMsg.includes('curriculum') || lowerMsg.includes('batch')) {
      suggestedTab = 'college';
      suggestedActionLabel = 'View College Analytics';
    } else if (lowerMsg.includes('recruiter') || lowerMsg.includes('placement portal') || lowerMsg.includes('hire') || lowerMsg.includes('candidate list')) {
      suggestedTab = 'placement';
      suggestedActionLabel = 'Open Placement Portal';
    }

    // Candidate profile context
    let candidateContextSnippet = 'Candidate has not analyzed a CV yet in this session.';
    if (context.targetRole) {
      candidateContextSnippet = `
Active Candidate Context:
- Candidate Name: ${context.candidateName || 'Student'}
- Target Role: ${context.targetRole} (${context.targetDomain || 'Technology'})
- Current Match Score: ${context.matchScore || 0}%
- Verified Demonstrated Skills: ${Array.isArray(context.matchedSkills) ? context.matchedSkills.join(', ') : 'N/A'}
- Critical Missing Skill Gaps: ${Array.isArray(context.missingSkills) ? context.missingSkills.join(', ') : 'N/A'}
- Current View Tab: ${context.activeTab || 'overview'}`;
    }

    const isSearchRole = roleId === 'researcher' || Boolean(useSearchGrounding);
    let primaryModel = 'gemini-4-hydrogen';
    let thinkingLevel: ThinkingLevel = ThinkingLevel.MEDIUM;
    let rolePersonaPrompt = '';

    switch (roleId) {
      case 'architect':
        primaryModel = 'gemini-4-hydrogen';
        thinkingLevel = ThinkingLevel.XHIGH;
        rolePersonaPrompt = `YOUR ROLE: Deep Technical & Career Strategist.
Perform thorough, multi-step architectural and career-strategy reasoning. Break down system design trade-offs, explain how missing technical skills connect across production systems, and give concrete project architecture recommendations tailored to the candidate's target role.`;
        break;
      case 'coach':
        primaryModel = 'gemini-4-hydrogen';
        thinkingLevel = ThinkingLevel.HIGH;
        rolePersonaPrompt = `YOUR ROLE: Interactive Interview & Resume Coach.
Conduct interactive mock technical/behavioral interview practice, evaluate candidate answers with constructive STAR-method feedback, and help refine CV bullet points with quantified impact metrics.`;
        break;
      case 'fast':
        primaryModel = 'gemini-3.1-flash-lite';
        thinkingLevel = ThinkingLevel.MINIMAL;
        rolePersonaPrompt = `YOUR ROLE: Quick Help & Instant Platform Troubleshooter.
Give crisp, ultra-concise, immediate answers (under 120 words) for UI navigation, resume upload troubleshooting (PDF/DOCX/paste), and quick SkillBridge feature lookups.`;
        break;
      case 'researcher':
        primaryModel = 'gemini-4-hydrogen';
        thinkingLevel = ThinkingLevel.MEDIUM;
        rolePersonaPrompt = `YOUR ROLE: Live Market & Hiring Researcher (Google Search Grounded).
Use live Google Search results to provide accurate, up-to-date facts about 2026 hiring trends, Indian internship stipends in INR (₹), emerging frameworks, and verified learning resources.`;
        break;
      case 'mentor':
      default:
        primaryModel = 'gemini-4-hydrogen';
        thinkingLevel = ThinkingLevel.MEDIUM;
        rolePersonaPrompt = `YOUR ROLE: SkillBridge Career & Skill Gap Mentor.
Guide students warmly and clearly through closing their missing skill gaps, choosing capstone projects to build after learning, targeting paid internships in INR (₹), and resolving platform questions.`;
        break;
    }

    if (isSearchRole) {
      primaryModel = 'gemini-4-hydrogen';
      if (thinkingLevel === ThinkingLevel.MINIMAL) {
        thinkingLevel = ThinkingLevel.LOW;
      }
    }

    const systemInstruction = `${rolePersonaPrompt}

SkillBridge Platform Knowledge:
1. CV Analyzer (Tab: 'analyzer'): Supports PDF, DOCX, TXT, MD, RTF uploads or pasted text. Evaluates against 47 industry roles across 5 domains with Match Score %, verified skills, missing gaps, and academic alignment. If a file upload fails or shows corrupted text, advise checking file size (<10MB), unlocking password-protected PDFs, or pasting text directly.
2. Roadmap & Projects (Tab: 'roadmap'): 4-Phase learning roadmap, Capstone Projects Recommended to Build After Learning Missing Skills, Recommended Types of Paid Internships (advisory recommendations in Indian Rupees ₹, e.g., ₹25,000 – ₹45,000 / month, Ready Now vs Ready in 4 Weeks), and Live Market Intel powered by Google Search.
3. Skill Dependency Graph (Tab: 'graph'): 14 career pathways across 5 domains with Flow and Grid views showing prerequisites, study hours, and unlocks.
4. College Analytics (Tab: 'college') & Placement Portal (Tab: 'placement'): Institutional TPO dashboards and recruiter candidate discovery.
5. Report Modal: Downloads certified PDF placement dossiers including projects to build after learning missing skills.

${candidateContextSnippet}

Response Guidelines:
- Keep responses well-structured, concise (2-4 short paragraphs or clean bullets, ~120-250 words unless deep architectural breakdown is requested).
- Reference the candidate's target role and missing skills when relevant.
- Never fabricate URLs; only cite real sources returned by Google Search if Search Grounding is active.`;

    const formattedHistory = sanitizeChatHistory(history, cleanMessage);

    const buildChat = (modelName: string, level: ThinkingLevel, withSearch: boolean) => {
      const chatConfig: any = {
        systemInstruction,
        thinkingConfig: { thinkingLevel: level },
      };
      if (withSearch) {
        chatConfig.tools = [{ googleSearch: {} }];
      }
      return ai.chats.create({
        model: modelName,
        history: formattedHistory,
        config: chatConfig,
      });
    };

    const sessionKey = `${sessionId}:${roleId}:${isSearchRole ? 'search' : 'std'}`;
    let storedSession = resetSession ? undefined : chatSessions.get(sessionKey);

    if (!storedSession) {
      const chat = buildChat(primaryModel, thinkingLevel, isSearchRole);
      storedSession = {
        chat,
        model: primaryModel,
        roleId,
        useSearch: isSearchRole,
        lastUsed: Date.now(),
      };
      chatSessions.set(sessionKey, storedSession);
    } else {
      storedSession.lastUsed = Date.now();
    }

    let response: any;
    let actualModelUsed = storedSession.model;
    let actualSearchUsed = storedSession.useSearch;

    try {
      response = await storedSession.chat.sendMessage({ message: cleanMessage });
    } catch (firstErr: any) {
      if (!isTransientGeminiError(firstErr)) {
        throw firstErr;
      }

      chatSessions.delete(sessionKey);

      if (primaryModel === 'gemini-3.1-flash-lite') {
        await sleepMs(600);
        const retryChat = buildChat(primaryModel, thinkingLevel, isSearchRole);
        response = await retryChat.sendMessage({ message: cleanMessage });
        storedSession = {
          chat: retryChat,
          model: primaryModel,
          roleId,
          useSearch: isSearchRole,
          lastUsed: Date.now(),
        };
        chatSessions.set(sessionKey, storedSession);
      } else {
        // Fallback immediately to gemini-3.1-flash-lite when gemini-4-hydrogen hits 503/429
        console.warn(`Primary model ${primaryModel} unavailable/rate-limited, falling back to gemini-3.1-flash-lite...`);
        const fallbackModel = 'gemini-3.1-flash-lite';
        try {
          const fallbackChat = buildChat(fallbackModel, ThinkingLevel.LOW, isSearchRole);
          response = await fallbackChat.sendMessage({ message: cleanMessage });
          actualModelUsed = fallbackModel;
          actualSearchUsed = isSearchRole;
        } catch (fallbackSearchErr: any) {
          if (isSearchRole && roleId !== 'researcher') {
            const plainFallbackChat = buildChat(fallbackModel, ThinkingLevel.LOW, false);
            response = await plainFallbackChat.sendMessage({ message: cleanMessage });
            actualModelUsed = fallbackModel;
            actualSearchUsed = false;
          } else {
            throw fallbackSearchErr;
          }
        }
      }
    }

    const reply = response?.text?.trim() || '';
    if (!reply) {
      res.status(502).json({
        error: 'The AI assistant returned an empty response. Please try rephrasing your question.',
      });
      return;
    }

    const sources = actualSearchUsed ? extractGroundingSources(response) : [];

    res.json({
      reply,
      modelUsed: actualModelUsed,
      roleId,
      groundedWithSearch: actualSearchUsed,
      sources,
      suggestedTab,
      suggestedActionLabel,
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    const { sessionId = 'default-session', roleId = 'mentor', useSearchGrounding = false } = req.body || {};
    const isSearchRole = roleId === 'researcher' || Boolean(useSearchGrounding);
    chatSessions.delete(`${sessionId}:${roleId}:${isSearchRole ? 'search' : 'std'}`);

    const mapped = mapGeminiApiError(err);
    res.status(mapped.status).json({
      error: mapped.message,
    });
  }
});

// Live Google Search Grounding Endpoint for Market, Stipend & Learning Intelligence
app.post('/api/market-insights', async (req, res) => {
  try {
    const {
      targetRole = 'Data Analyst',
      targetDomain = 'AI & Technology',
      missingSkills = [],
      queryType = 'hiring_trends',
      customQuery = '',
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Gemini API key is not configured. Please add a GEMINI_API_KEY in Settings > Secrets to fetch live Google Search insights.',
      });
      return;
    }

    const missingList = Array.isArray(missingSkills) && missingSkills.length > 0
      ? missingSkills.join(', ')
      : 'core industry frameworks';

    let promptText = '';
    if (queryType === 'custom' && customQuery.trim()) {
      promptText = `Using up-to-date web search data, answer this career & industry question specifically for someone targeting "${targetRole}" (${targetDomain}) who is currently learning ${missingList}:\n\n"${customQuery.trim()}"`;
    } else if (queryType === 'stipend_benchmarks') {
      promptText = `Search for current 2025–2026 paid internship monthly stipends in Indian Rupees (₹ / INR) and entry-level fresher salary packages in India for "${targetRole}" (${targetDomain}). Break down typical ranges across early-stage startups, mid-size product companies, and enterprise GCCs/consultancies, plus top hiring hubs in India.`;
    } else if (queryType === 'learning_resources') {
      promptText = `Search for the best current, verified official documentation, interactive courses, and free/high-value certifications in 2025–2026 to master these missing skills for a "${targetRole}": ${missingList}. Provide a concise, actionable resource guide.`;
    } else {
      promptText = `Search for current 2025–2026 hiring trends, most in-demand technical skills, and interview expectations for "${targetRole}" (${targetDomain}) candidates, especially regarding ${missingList}. Highlight what separates top applicants right now.`;
    }

    const runMarketSearch = (modelName: string) =>
      ai.models.generateContent({
        model: modelName,
        contents: promptText,
        config: {
          systemInstruction: 'You are an expert Indian Tech & Career Market Analyst. Provide accurate, well-structured Markdown insights (clear headings and bullet points, ~220-320 words) grounded in the latest Google Search results. Use Indian Rupees (₹) when referencing Indian stipends or salaries.',
          tools: [{ googleSearch: {} }],
        },
      });

    let response: any;
    let modelUsed = 'gemini-4-hydrogen';

    try {
      response = await runMarketSearch('gemini-4-hydrogen');
    } catch (err: any) {
      if (!isTransientGeminiError(err)) throw err;
      modelUsed = 'gemini-3.1-flash-lite';
      response = await runMarketSearch('gemini-3.1-flash-lite');
    }

    const insights = response?.text?.trim() || '';
    if (!insights) {
      res.status(502).json({
        error: 'Google Search grounding returned an empty response. Please try again.',
      });
      return;
    }

    const sources = extractGroundingSources(response);
    const searchQueries: string[] = response?.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    res.json({
      insights,
      sources,
      searchQueries,
      modelUsed,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (err: any) {
    console.error('Error in /api/market-insights:', err);
    const mapped = mapGeminiApiError(err);
    res.status(mapped.status).json({ error: mapped.message });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillBridge AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
