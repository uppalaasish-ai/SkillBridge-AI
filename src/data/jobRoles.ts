import { DomainCategory, JobRoleDefinition, CollegeCohortSkill, CandidateProfile } from '../types';

export const DOMAINS: { name: DomainCategory; icon: string; count: number; description: string }[] = [
  {
    name: 'AI & Technology',
    icon: 'Bot',
    count: 21,
    description: 'Autonomous systems, GenAI, Fullstack, Cloud, Security & Data',
  },
  {
    name: 'Creative Fields',
    icon: 'Palette',
    count: 17,
    description: 'Design, visual storytelling, 3D animation, media production',
  },
  {
    name: 'Finance & Business',
    icon: 'TrendingUp',
    count: 16,
    description: 'Quantitative modeling, investment banking, analytics & fintech',
  },
  {
    name: 'Science & Research',
    icon: 'Microscope',
    count: 18,
    description: 'Biotechnology, computational biology, materials science & physics',
  },
  {
    name: 'Sports & Fitness',
    icon: 'Medal',
    count: 17,
    description: 'Sports data analytics, biomechanics, coaching & performance',
  },
];

export const JOB_ROLES: JobRoleDefinition[] = [
  // AI & Technology
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    domain: 'AI & Technology',
    description: 'Builds, fine-tunes, and deploys scalable artificial intelligence and deep neural network systems into production environments.',
    coreRequiredSkills: ['Python', 'PyTorch or TensorFlow', 'Transformers', 'Model Deployment (FastAPI/Docker)', 'Vector Databases', 'LangChain/LlamaIndex', 'API Integration'],
    niceToHaveSkills: ['MLOps', 'Kubernetes', 'ONNX Runtime', 'Triton Server', 'Quantization'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 35,
    typicalProjects: ['Multi-modal RAG Agent with Hybrid Search', 'Fine-Tuned Small Language Model for Code Generation', 'Real-time Edge Inference Pipeline'],
    internshipRoles: ['AI Research Intern', 'Applied AI Engineering Intern', 'Generative AI Developer Trainee'],
    prerequisites: ['Linear Algebra', 'Python Data Structures', 'Basic Machine Learning'],
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    domain: 'AI & Technology',
    description: 'Bridges data science and software engineering by creating resilient ML pipelines and real-time model serving infrastructure.',
    coreRequiredSkills: ['Python', 'Scikit-Learn', 'Feature Engineering', 'SQL', 'MLflow or Weights & Biases', 'Docker', 'Cloud ML (AWS SageMaker/GCP Vertex)'],
    niceToHaveSkills: ['Airflow', 'Spark', 'Kafka', 'CI/CD for ML'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 45,
    typicalProjects: ['End-to-End Customer Churn Prediction Pipeline with CI/CD', 'Automated Fraud Detection Stream Engine'],
    internshipRoles: ['ML Systems Intern', 'Predictive Modeling Intern', 'Data Engineering Intern'],
    prerequisites: ['Probability & Statistics', 'Object-Oriented Python', 'SQL'],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    domain: 'AI & Technology',
    description: 'Extracts strategic business insights and builds predictive statistical models from massive multi-source datasets.',
    coreRequiredSkills: ['Python', 'R or Julia', 'Advanced SQL', 'Statistical Hypothesis Testing', 'Machine Learning', 'Pandas & NumPy', 'Tableau or Power BI'],
    niceToHaveSkills: ['A/B Testing Frameworks', 'BigQuery/Snowflake', 'Deep Learning Basics', 'Storytelling with Data'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 55,
    typicalProjects: ['Causal Inference & A/B Test Simulation Platform', 'E-Commerce Recommendation Engine using Matrix Factorization'],
    internshipRoles: ['Data Science Associate Intern', 'Decision Science Intern', 'Quantitative Research Trainee'],
    prerequisites: ['Multivariate Calculus', 'Applied Statistics', 'Relational Databases'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    domain: 'AI & Technology',
    description: 'Transforms raw operational and user data into actionable dashboards, KPIs, and data-informed business strategies.',
    coreRequiredSkills: ['SQL', 'Power BI or Tableau', 'Excel (VLOOKUP, Pivot, Power Query)', 'Python (Pandas/Matplotlib)', 'Exploratory Data Analysis', 'Business Metric Calculation'],
    niceToHaveSkills: ['dbt', 'Data Modeling', 'Alteryx', 'Google Analytics'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 65,
    typicalProjects: ['Executive Sales & Churn Analytics Dashboard in Power BI', 'Cohort Retention & LTV Analysis Notebook'],
    internshipRoles: ['Business Data Analyst Intern', 'Operations Analytics Intern', 'Reporting Analyst Intern'],
    prerequisites: ['Spreadsheets', 'Basic Math', 'Basic SQL'],
  },
  {
    id: 'computer-vision-engineer',
    title: 'Computer Vision Engineer',
    domain: 'AI & Technology',
    description: 'Develops visual perception models, real-time object tracking, segmentation, and camera perception algorithms.',
    coreRequiredSkills: ['Python & C++', 'OpenCV', 'PyTorch', 'YOLO / Object Detection', 'Image Segmentation', 'CUDA / GPU Optimization'],
    niceToHaveSkills: ['TensorRT', 'Embedded Vision (Raspberry Pi/Jetson)', 'ROS (Robot Operating System)'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 30,
    typicalProjects: ['Industrial Defect Detection Camera System', 'Real-time Multi-Object Traffic Flow Tracker'],
    internshipRoles: ['Computer Vision Intern', 'Perception Engineer Trainee', 'Video Analytics Intern'],
    prerequisites: ['Linear Algebra', 'Signal Processing', 'C++ or Python'],
  },
  {
    id: 'nlp-engineer',
    title: 'NLP Engineer',
    domain: 'AI & Technology',
    description: 'Specializes in computational linguistics, semantic search, sentiment classification, and modern LLM application engineering.',
    coreRequiredSkills: ['Python', 'Hugging Face Transformers', 'SpaCy / NLTK', 'Text Embeddings', 'Vector Search (FAISS/Pinecone)', 'Prompt Engineering & Fine-tuning'],
    niceToHaveSkills: ['LoRA / QLoRA', 'vLLM', 'Information Extraction', 'Graph RAG'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 35,
    typicalProjects: ['Domain-Specific Legal Contract Analyzer with RAG', 'Multi-lingual Support Intent Classifier'],
    internshipRoles: ['NLP Research Intern', 'Conversational AI Intern', 'Text Analytics Trainee'],
    prerequisites: ['Linguistics Basics', 'Probability', 'Python'],
  },
  {
    id: 'robotics-engineer',
    title: 'Robotics Engineer',
    domain: 'AI & Technology',
    description: 'Designs control systems, kinematics, path planning algorithms, and sensory integration for robotic devices.',
    coreRequiredSkills: ['C++', 'Python', 'ROS / ROS2', 'Kinematics & Dynamics', 'SLAM & Sensor Fusion', 'Gazebo / Simulation'],
    niceToHaveSkills: ['Embedded Systems (STM32/Arduino)', 'Micro-ROS', 'Reinforcement Learning for Control'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 40,
    typicalProjects: ['Autonomous Warehouse Rover Simulation with SLAM & Nav2', 'Pick-and-Place Robotic Arm with Vision Feedback'],
    internshipRoles: ['Robotics Software Intern', 'Autonomous Systems Intern', 'Mechatronics Trainee'],
    prerequisites: ['Control Theory', 'Physics Mechanics', 'C++'],
  },
  {
    id: 'generative-ai-developer',
    title: 'Generative AI Developer',
    domain: 'AI & Technology',
    description: 'Creates modern application layer software utilizing foundation models, agentic workflows, function calling, and multimodal inputs.',
    coreRequiredSkills: ['TypeScript / Python', 'Gemini / OpenAI API SDKs', 'LangChain / LangGraph', 'Vector DBs (Chroma/Qdrant)', 'RAG Architecture', 'Structured Output Parsing'],
    niceToHaveSkills: ['Evals Frameworks (Ragas/DeepEval)', 'Guardrails', 'Next.js Fullstack', 'Streaming SSE'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 20,
    typicalProjects: ['Autonomous Research & Synthesis Agent with Web Grounding', 'Code Review & Automated Refactoring CLI Assistant'],
    internshipRoles: ['GenAI Solutions Intern', 'AI Application Developer Intern', 'Agentic Workflow Trainee'],
    prerequisites: ['Modern Web Architecture', 'REST APIs', 'Python or TS'],
  },
  {
    id: 'python-developer',
    title: 'Python Developer',
    domain: 'AI & Technology',
    description: 'Builds backend microservices, web scrapers, data pipelines, and automation tools using idiomatic Python.',
    coreRequiredSkills: ['Python 3.x (Asyncio/Type Hints)', 'FastAPI or Django', 'PostgreSQL / SQLAlchemy', 'PyTest / Unit Testing', 'Docker', 'Git & CI/CD'],
    niceToHaveSkills: ['Redis / Celery', 'GraphQL', 'AWS Lambdas', 'Poetry / Packaging'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 60,
    typicalProjects: ['High-Concurrency Task Queue Service with FastAPI & Redis', 'E-Commerce RESTful Backend API with JWT Auth'],
    internshipRoles: ['Backend Python Intern', 'Python Automation Engineer Intern', 'Software Trainee'],
    prerequisites: ['Object Oriented Programming', 'Basic Database Queries'],
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer',
    domain: 'AI & Technology',
    description: 'Constructs end-to-end web applications covering user interfaces, responsive styling, secure APIs, and relational databases.',
    coreRequiredSkills: ['React / Next.js', 'Node.js / Express', 'TypeScript', 'PostgreSQL or MongoDB', 'Tailwind CSS', 'REST / GraphQL APIs', 'Git'],
    niceToHaveSkills: ['Docker', 'AWS / Vercel Deployments', 'Redis Caching', 'Authentication (OAuth/JWT)'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 45,
    typicalProjects: ['Collaborative Project Management SaaS with Realtime Updates', 'E-Learning Portal with Stripe Billing & Role Access'],
    internshipRoles: ['Full Stack Web Intern', 'Junior Web Developer', 'Frontend & Backend Trainee'],
    prerequisites: ['HTML/CSS/JS', 'Relational Databases', 'HTTP Protocols'],
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    domain: 'AI & Technology',
    description: 'Crafts accessible, high-performance, and responsive browser interfaces with modern component architectures and state systems.',
    coreRequiredSkills: ['React / Vue', 'TypeScript', 'Tailwind CSS', 'State Management (Zustand/Redux)', 'Responsive Web Design', 'Browser Performance & SEO'],
    niceToHaveSkills: ['Next.js App Router', 'Framer Motion', 'Web Accessibility (a11y)', 'Jest / React Testing Library'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 50,
    typicalProjects: ['Financial Portfolio Analytics Dashboard with Recharts', 'Component Design System with Storybook'],
    internshipRoles: ['Frontend UI Intern', 'Web Interface Developer Intern', 'React Developer Trainee'],
    prerequisites: ['Core JavaScript', 'CSS Flexbox/Grid', 'DOM Manipulation'],
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    domain: 'AI & Technology',
    description: 'Engineers robust database architectures, business logic layers, caching layers, and high-throughput server APIs.',
    coreRequiredSkills: ['Node.js, Go or Java', 'SQL & Database Optimization', 'RESTful API Design', 'Authentication & Security', 'Redis / In-Memory Caching', 'Docker'],
    niceToHaveSkills: ['Message Brokers (Kafka/RabbitMQ)', 'Microservices Architecture', 'Kubernetes', 'gRPC'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 50,
    typicalProjects: ['Distributed Order Processing Service with Event Sourcing', 'High-throughput Rate Limiter & API Gateway'],
    internshipRoles: ['Backend Systems Intern', 'Server Architecture Trainee', 'API Developer Intern'],
    prerequisites: ['Data Structures & Algorithms', 'Databases', 'Operating Systems'],
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    domain: 'AI & Technology',
    description: 'Provisions, monitors, and optimizes scalable cloud infrastructure across AWS, GCP, or Azure.',
    coreRequiredSkills: ['AWS or GCP Fundamentals', 'Terraform (Infrastructure as Code)', 'Linux Administration', 'Docker & Containerization', 'Cloud Networking (VPC, Subnets, DNS)', 'Cloud Security & IAM'],
    niceToHaveSkills: ['Kubernetes (EKS/GKE)', 'Serverless Architectures', 'Cost Optimization (FinOps)', 'Ansible'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 25,
    typicalProjects: ['Multi-Region Highly Available Web App Deployment via Terraform', 'Automated Cloud Backup & Disaster Recovery Framework'],
    internshipRoles: ['Cloud Operations Intern', 'AWS/GCP Cloud Support Intern', 'Infrastructure Trainee'],
    prerequisites: ['Computer Networks', 'Operating Systems', 'Command Line'],
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    domain: 'AI & Technology',
    description: 'Streamlines software delivery pipelines, automated testing, observability, and container orchestration.',
    coreRequiredSkills: ['CI/CD (GitHub Actions/GitLab CI)', 'Docker', 'Kubernetes', 'Linux Bash Scripting', 'Monitoring (Prometheus/Grafana)', 'GitOps (ArgoCD)'],
    niceToHaveSkills: ['Helm Charts', 'Terraform', 'ELK Stack', 'Chaos Engineering'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 20,
    typicalProjects: ['Automated Zero-Downtime Blue/Green Deployment Pipeline', 'Cluster Observability & Alerting Dashboard with Prometheus'],
    internshipRoles: ['DevOps / SRE Intern', 'Release Engineering Intern', 'Build & Automation Trainee'],
    prerequisites: ['Linux Fundamentals', 'Git Version Control', 'Basic Networking'],
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    domain: 'AI & Technology',
    description: 'Monitors threat vectors, conducts vulnerability assessments, investigates security incidents, and enforces defenses.',
    coreRequiredSkills: ['Network Security & Protocols (TCP/IP, DNS, SSL)', 'SIEM Tools (Splunk/Wazuh)', 'Vulnerability Scanning (Nessus/Nmap)', 'Incident Response', 'Security Fundamentals (OWASP Top 10)', 'Linux Security'],
    niceToHaveSkills: ['Wireshark Packet Analysis', 'Python for Security Automation', 'CompTIA Security+ / CEH', 'Cloud Security'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 40,
    typicalProjects: ['SOC Threat Hunting & SIEM Alert Rule Implementation', 'Web Application Vulnerability Assessment & Remediation Report'],
    internshipRoles: ['SOC Analyst Intern', 'Information Security Intern', 'Cyber Defense Trainee'],
    prerequisites: ['Computer Networks', 'Operating Systems', 'Basic Cryptography'],
  },
  {
    id: 'ethical-hacker',
    title: 'Ethical Hacker',
    domain: 'AI & Technology',
    description: 'Conducts authorized offensive penetration tests to uncover security flaws in networks, APIs, and systems.',
    coreRequiredSkills: ['Penetration Testing Methodology', 'Burp Suite / OWASP ZAP', 'Metasploit', 'Web App Vulnerability Exploitation (SQLi, XSS, CSRF)', 'Kali Linux Tools', 'Reconnaissance & OSINT'],
    niceToHaveSkills: ['Bug Bounty Experience', 'Binary Exploitation', 'Active Directory Hacking', 'Reverse Engineering'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 25,
    typicalProjects: ['Full-Scope Pen-Test of Simulated Enterprise Network', 'Automated API Security Scanner Script in Python'],
    internshipRoles: ['Penetration Testing Intern', 'AppSec Intern', 'Red Team Trainee'],
    prerequisites: ['Networking', 'Web Security Basics', 'Linux Command Line'],
  },
  {
    id: 'blockchain-developer',
    title: 'Blockchain Developer',
    domain: 'AI & Technology',
    description: 'Develops decentralized applications (dApps), smart contracts, token standards, and consensus protocol integrations.',
    coreRequiredSkills: ['Solidity or Rust', 'EVM Architecture', 'Hardhat / Foundry', 'Web3.js or Ethers.js', 'Smart Contract Security Auditing', 'IPFS'],
    niceToHaveSkills: ['Zero-Knowledge Proofs', 'DeFi Protocols', 'Layer 2 Rollups', 'Subgraphs'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Medium',
    academicCurriculumCoverage: 15,
    typicalProjects: ['Decentralized Escrow & Milestone Payment dApp', 'ERC-721 Dynamic NFT Marketplace with Gas Optimization'],
    internshipRoles: ['Web3 Engineering Intern', 'Smart Contract Auditor Intern', 'dApp Developer Trainee'],
    prerequisites: ['Cryptography Basics', 'Object Oriented Programming', 'Web Architecture'],
  },
  {
    id: 'iot-engineer',
    title: 'IoT Engineer',
    domain: 'AI & Technology',
    description: 'Connects hardware microcontrollers, sensors, MQTT telemetry protocols, and cloud edge computing systems.',
    coreRequiredSkills: ['C/C++', 'Microcontrollers (ESP32/Raspberry Pi)', 'MQTT / HTTP / CoAP', 'Sensor Interfacing (I2C/SPI)', 'IoT Cloud (AWS IoT Core)', 'Edge Data Processing'],
    niceToHaveSkills: ['PCB Design Basics (KiCad)', 'TinyML', 'Bluetooth Low Energy (BLE)', 'Industrial Automation'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 45,
    typicalProjects: ['Smart Agriculture Environmental Sensor Grid with MQTT & Cloud Dashboard', 'Predictive Motor Vibration Monitor using TinyML'],
    internshipRoles: ['IoT Systems Intern', 'Embedded IoT Developer Intern', 'Smart Hardware Trainee'],
    prerequisites: ['Circuit Basics', 'C Programming', 'Networking Basics'],
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    domain: 'AI & Technology',
    description: 'Designs intuitive digital interfaces, user flows, design systems, interactive prototypes, and usability tests.',
    coreRequiredSkills: ['Figma (Auto-layout, Components, Variables)', 'User Research & Journey Mapping', 'Wireframing & Prototyping', 'Design Systems & Typography', 'Usability Testing', 'Information Architecture'],
    niceToHaveSkills: ['Design Tokens', 'HTML/CSS Awareness', 'Micro-interactions', 'WCAG Accessibility Standards'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 30,
    typicalProjects: ['Complete Mobile Banking Redesign with Usability Case Study', 'Design System Library with 50+ Responsive Tokens & Components'],
    internshipRoles: ['Product Design Intern', 'UX Research Intern', 'UI Design Trainee'],
    prerequisites: ['Visual Hierarchy', 'Empathy & User Interviewing', 'Design Fundamentals'],
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    domain: 'AI & Technology',
    description: 'Aligns business vision, engineering feasibility, user feedback, roadmaps, and metric-driven product launches.',
    coreRequiredSkills: ['Product Strategy & Roadmapping', 'User Story Writing & PRDs', 'Product Analytics (Mixpanel/Amplitude)', 'Agile / Scrum Methodologies', 'Market & Competitor Analysis', 'A/B Testing'],
    niceToHaveSkills: ['Technical Literacy (APIs/Databases)', 'Growth Loops', 'Financial Unit Economics', 'Customer Discovery'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 20,
    typicalProjects: ['Product Requirements Document (PRD) & MVP Launch Plan for B2B Tool', 'Funnel Optimization Case Study with Data-Backed Hypotheses'],
    internshipRoles: ['Associate Product Manager (APM) Intern', 'Technical Product Intern', 'Product Operations Intern'],
    prerequisites: ['Critical Thinking', 'Communication Skills', 'Analytical Mindset'],
  },
  {
    id: 'qa-test-engineer',
    title: 'QA/Test Engineer',
    domain: 'AI & Technology',
    description: 'Ensures software reliability through automated test suites, end-to-end testing, performance benchmarks, and regression checks.',
    coreRequiredSkills: ['Test Automation (Playwright/Cypress/Selenium)', 'API Testing (Postman/Newman)', 'JavaScript or Python', 'Test Case Design & Bug Tracking (Jira)', 'CI/CD Test Integration', 'Performance Testing (k6/JMeter)'],
    niceToHaveSkills: ['Security Testing Basics', 'Mobile Testing (Appium)', 'Mocking / Stubbing', 'BDD (Cucumber)'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 35,
    typicalProjects: ['Full End-to-End Automated Test Suite for E-Commerce Checkout', 'Automated REST API Smoke & Load Testing Suite in CI/CD'],
    internshipRoles: ['QA Automation Intern', 'Software Test Engineer Trainee', 'Quality Assurance Associate Intern'],
    prerequisites: ['Basic Programming', 'Testing Principles', 'Web Basics'],
  },

  // Creative Fields
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    domain: 'Creative Fields',
    description: 'Produces brand collateral, promotional graphics, typography systems, editorial layouts, and digital visual assets.',
    coreRequiredSkills: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Typography & Color Theory', 'Brand Identity Systems', 'Print & Digital Asset Preparation'],
    niceToHaveSkills: ['Motion Graphics (After Effects)', 'Figma', 'Package Design', 'Art Direction'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 60,
    typicalProjects: ['Complete Brand Visual Identity & Style Guide Book', 'Social Media & Marketing Campaign Multi-Platform Collateral'],
    internshipRoles: ['Graphic Design Intern', 'Brand Design Intern', 'Creative Media Trainee'],
    prerequisites: ['Visual Principles', 'Color Theory', 'Adobe Suite Basics'],
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    domain: 'Creative Fields',
    description: 'Drives holistic product experiences, uniting strategic business objectives, user research, interaction design, and visual polish.',
    coreRequiredSkills: ['Figma', 'Design Systems', 'Interactive Prototyping', 'User Research & Synthesis', 'Cross-Functional Collaboration', 'Visual Craft & Typography'],
    niceToHaveSkills: ['Framer', 'Product Metrics', 'Accessibility Audits', 'Design Operations'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 30,
    typicalProjects: ['End-to-End B2B SaaS Dashboard Redesign with Documented Case Study', 'Design System with Accessible Components & Interaction Specs'],
    internshipRoles: ['Product Design Intern', 'Digital Experience Intern', 'UI/UX Design Trainee'],
    prerequisites: ['Figma Basics', 'Empathy', 'Portfolio Presentation'],
  },
  {
    id: 'motion-graphics-designer',
    title: 'Motion Graphics Designer',
    domain: 'Creative Fields',
    description: 'Creates kinetic typography, animated explainer videos, logo reveals, product animations, and visual effects.',
    coreRequiredSkills: ['Adobe After Effects', 'Adobe Illustrator', 'Cinema 4D or Blender Basics', 'Principles of Animation (Timing/Easing)', 'Audio Sync & Sound Design', 'Video Rendering & Codecs'],
    niceToHaveSkills: ['Lottie / Web Animation', '3D Motion Design', 'Compositing', 'Character Animation'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 35,
    typicalProjects: ['60-Second Product Explainer Animation with Kinetic Typography', 'Brand Animated Logo Reveal & Social Motion Kit'],
    internshipRoles: ['Motion Design Intern', 'Animation Studio Intern', 'Video & Motion Trainee'],
    prerequisites: ['Vector Graphic Design', 'Keyframing Principles'],
  },
  {
    id: '3d-artist',
    title: '3D Artist',
    domain: 'Creative Fields',
    description: 'Models, textures, lights, and renders 3D assets for games, visual effects, industrial products, and virtual environments.',
    coreRequiredSkills: ['Blender, Maya or 3ds Max', 'Substance Painter / PBR Texturing', 'UV Unwrapping', 'Lighting & Rendering (Cycles/Arnold)', 'Hard Surface or Character Modeling', 'Optimization for Real-time Engines'],
    niceToHaveSkills: ['Unreal Engine 5', 'ZBrush Sculpting', 'Rigging Basics', 'V-Ray'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 30,
    typicalProjects: ['Photorealistic Hard-Surface Product Render & Asset Pack', 'Game-Ready Optimized Environment Diorama in Unreal Engine'],
    internshipRoles: ['3D Modeling Intern', 'Game Art Intern', 'VFX 3D Artist Trainee'],
    prerequisites: ['Spatial Awareness', '3D Software Basics', 'Digital Texturing'],
  },
  {
    id: 'video-editor',
    title: 'Video Editor',
    domain: 'Creative Fields',
    description: 'Assembles footage, dialogues, music, sound effects, and color grading to produce compelling visual stories.',
    coreRequiredSkills: ['Adobe Premiere Pro or DaVinci Resolve', 'Color Grading & Scopes', 'Audio Mixing & Noise Cleanup', 'Pacing & Narrative Storytelling', 'Multi-Camera Editing', 'Short-Form & Long-Form Formatting'],
    niceToHaveSkills: ['After Effects Compositing', 'Sound Design', 'Media Management / Proxy Workflows'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 50,
    typicalProjects: ['Documentary-Style Mini Film with Color Grade & Sound Design', 'High-Retention Short-Form Video Series for Brand Campaign'],
    internshipRoles: ['Post-Production Intern', 'Video Content Intern', 'Studio Assistant Trainee'],
    prerequisites: ['Editing Software Basics', 'Storytelling Sense'],
  },
  {
    id: 'content-creator',
    title: 'Content Creator',
    domain: 'Creative Fields',
    description: 'Ideates, scripts, films, edits, and distributes multi-platform media that captivates audiences and builds organic community.',
    coreRequiredSkills: ['Scriptwriting & Hook Formulation', 'Smartphone/DSLR Videography', 'Short-Form Video (CapCut/Premiere)', 'Social Media Platform Algorithms', 'Thumbnail Design & Visual Branding', 'Community Engagement & Analytics'],
    niceToHaveSkills: ['Podcast Production', 'Live Streaming Tech (OBS)', 'Brand Sponsorship Pitching'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 15,
    typicalProjects: ['30-Day Growth Campaign Strategy with 15 Published High-Engagement Reels', 'Podcast Launch with Full Audio/Video Branding Package'],
    internshipRoles: ['Digital Media Intern', 'Social Video Intern', 'Creator Assistant'],
    prerequisites: ['Creative Communication', 'Video Editing Basics'],
  },

  // Finance & Business
  {
    id: 'financial-analyst',
    title: 'Financial Analyst',
    domain: 'Finance & Business',
    description: 'Constructs financial models, analyzes fiscal statements, forecasts revenues, and evaluates corporate capital allocations.',
    coreRequiredSkills: ['Financial Modeling (DCF, LBO, 3-Statement)', 'Advanced Excel (Macros, Financial Formulas)', 'Financial Statement Analysis', 'Valuation Methodologies', 'Corporate Finance Principles', 'PowerPoint Deck Presentation'],
    niceToHaveSkills: ['Python for Finance', 'Bloomberg Terminal / Capital IQ', 'SQL', 'CFA Candidate'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 60,
    typicalProjects: ['Discounted Cash Flow (DCF) & Comparable Valuation of Public Company', 'Corporate 3-Statement Budget & Variance Forecasting Model in Excel'],
    internshipRoles: ['Financial Planning & Analysis (FP&A) Intern', 'Corporate Finance Intern', 'Valuation Analyst Trainee'],
    prerequisites: ['Accounting Basics', 'Excel', 'Microeconomics'],
  },
  {
    id: 'investment-banker',
    title: 'Investment Banker',
    domain: 'Finance & Business',
    description: 'Structures merger and acquisition transactions, debt/equity capital market raises, and strategic restructuring advisory.',
    coreRequiredSkills: ['M&A Modeling & Pitchbook Preparation', 'Trading & Transaction Comparables', 'DCF & Accretion/Dilution Analysis', 'Due Diligence Procedures', 'Executive Financial Presentation', 'Deep Excel & Pitchbook Modeling'],
    niceToHaveSkills: ['Series 79 / 63 Knowledge', 'Industry Vertical Specialization', 'Capital Markets Knowledge'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 40,
    typicalProjects: ['Comprehensive M&A Buy-Side Pitchbook with Valuation & Synergy Estimates', 'LBO Model with Debt Waterfall & Return Sensitivities'],
    internshipRoles: ['Investment Banking Summer Analyst', 'M&A Advisory Intern', 'Capital Markets Intern'],
    prerequisites: ['Corporate Finance', 'Financial Accounting', 'High Stress Tolerance'],
  },
  {
    id: 'business-intelligence-analyst',
    title: 'Business Intelligence Analyst',
    domain: 'Finance & Business',
    description: 'Builds enterprise data models, ETL workflows, and semantic reporting dashboards that guide executive business decisions.',
    coreRequiredSkills: ['SQL & Data Warehousing Concepts', 'Power BI (DAX, Power Query) or Tableau', 'Data Modeling (Star Schema)', 'Business KPI Formulation', 'Data Cleansing & Validation', 'Stakeholder Requirement Gathering'],
    niceToHaveSkills: ['dbt', 'Python / R Basics', 'Snowflake / BigQuery', 'SSIS / ETL Pipelines'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 45,
    typicalProjects: ['Automated Revenue & Customer Retention BI Dashboard with DAX', 'Data Mart Dimensional Model for Multi-Branch Retail Operations'],
    internshipRoles: ['BI Analyst Intern', 'Enterprise Data Reporting Intern', 'Analytics Associate Trainee'],
    prerequisites: ['Relational Database Basics', 'Spreadsheets', 'Business Acumen'],
  },
  {
    id: 'quantitative-analyst',
    title: 'Quantitative Analyst',
    domain: 'Finance & Business',
    description: 'Applies sophisticated mathematical models, stochastic calculus, and algorithmic pipelines to financial trading strategies.',
    coreRequiredSkills: ['Python or C++', 'Stochastic Calculus & Probability', 'Time Series Econometrics', 'Algorithmic Trading Backtesting', 'NumPy / Pandas / SciPy', 'Numerical Methods & Optimization'],
    niceToHaveSkills: ['Options Pricing (Black-Scholes)', 'Machine Learning for Trading', 'Tick Data Architecture', 'C++ Low-Latency'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 50,
    typicalProjects: ['Statistical Arbitrage Pairs Trading Backtester with Transaction Cost Model', 'Monte Carlo Derivative Pricing Engine in Python/C++'],
    internshipRoles: ['Quantitative Research Intern', 'Algo Trading Analyst Intern', 'Quant Developer Trainee'],
    prerequisites: ['Multivariate Calculus', 'Linear Algebra', 'Strong Programming'],
  },
  {
    id: 'management-consultant',
    title: 'Management Consultant',
    domain: 'Finance & Business',
    description: 'Analyzes organizational bottlenecks, competitive threats, cost structures, and crafts executive transformation roadmaps.',
    coreRequiredSkills: ['Structured Problem Solving (MECE Frameworks)', 'Case Study Analysis', 'Quantitative Business Sizing', 'Executive Slide Deck Storytelling (Think-Cell/PowerPoint)', 'Stakeholder Interviewing', 'Financial Business Case Modeling'],
    niceToHaveSkills: ['Data Analytics (Alteryx/Tableau)', 'Change Management', 'Market Research Tools'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'Very High',
    academicCurriculumCoverage: 30,
    typicalProjects: ['Market Entry & Profitability Turnaround Strategy Deck for Retail Client', 'Cost Optimization & Operational Diagnostic Sizing Model'],
    internshipRoles: ['Summer Associate Consultant', 'Strategy Analyst Intern', 'Business Advisory Trainee'],
    prerequisites: ['Critical Thinking', 'Business Fundamentals', 'Communication'],
  },

  // Science & Research
  {
    id: 'bioinformatics-scientist',
    title: 'Bioinformatics Scientist',
    domain: 'Science & Research',
    description: 'Applies computational algorithms, genomic sequencing pipelines, and statistical modeling to biological and molecular datasets.',
    coreRequiredSkills: ['Python / R', 'Next-Generation Sequencing (NGS) Analysis', 'Bioconductor / BioPython', 'Genomic Data Formats (FASTQ, BAM, VCF)', 'Linux HPC Clusters & SLURM', 'Statistical Genetics'],
    niceToHaveSkills: ['Snakemake / Nextflow', 'Machine Learning for Protein Folding', 'BLAST / Alignment Algorithms'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 50,
    typicalProjects: ['RNA-Seq Differential Expression & Pathway Enrichment Pipeline', 'Variant Calling & Annotation Workflow using Nextflow'],
    internshipRoles: ['Bioinformatics Intern', 'Computational Biology Trainee', 'Genomics Data Intern'],
    prerequisites: ['Molecular Biology Basics', 'Python or R', 'Statistics'],
  },
  {
    id: 'biotechnologist',
    title: 'Biotechnologist',
    domain: 'Science & Research',
    description: 'Develops biological products, fermentation processes, cell culture assays, and genetic manipulation protocols.',
    coreRequiredSkills: ['Aseptic Cell Culture Technique', 'PCR & Gel Electrophoresis', 'Microbial Fermentation Protocols', 'Enzyme Assays & ELISA', 'GLP / GMP Regulatory Documentation', 'Laboratory Equipment Calibration'],
    niceToHaveSkills: ['CRISPR-Cas9 Protocols', 'Bioreactor Operation', 'Chromatography (HPLC/FPLC)'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 70,
    typicalProjects: ['Optimization of Microbial Yield via Batch Fermentation Kinetic Study', 'Recombinant Protein Purification & Western Blot Verification Report'],
    internshipRoles: ['Biotech Lab Intern', 'Bioprocess Engineering Intern', 'Quality Control Bio-Analyst Intern'],
    prerequisites: ['Biochemistry', 'Microbiology', 'Wet Lab Safety'],
  },
  {
    id: 'research-scientist',
    title: 'Research Scientist',
    domain: 'Science & Research',
    description: 'Designs novel scientific experiments, formulates hypotheses, executes peer-reviewed publications, and develops innovations.',
    coreRequiredSkills: ['Scientific Methodology & Experimental Design', 'Peer-Reviewed Literature Review', 'Advanced Data Analysis (Python/R/Matlab)', 'Scientific Writing & Grant Formulation', 'Instrumentation & Data Collection', 'Error Analysis & Uncertainty Quantification'],
    niceToHaveSkills: ['LaTeX', 'Patent Filing Knowledge', 'Conference Presentation'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 75,
    typicalProjects: ['Full Scientific Research Manuscript with Statistical Validation', 'Automated Lab Instrumentation Sensor Logging System'],
    internshipRoles: ['Graduate Research Assistant Intern', 'R&D Scientist Intern', 'Laboratory Research Fellow'],
    prerequisites: ['Domain Fundamentals', 'Scientific Writing', 'Statistical Rigor'],
  },

  // Sports & Fitness
  {
    id: 'sports-analyst',
    title: 'Sports Analyst',
    domain: 'Sports & Fitness',
    description: 'Evaluates athlete tracking metrics, opposition scouting videos, tactical heatmaps, and game strategies using sports analytics.',
    coreRequiredSkills: ['Python or R for Sports Analytics', 'SQL & Event Data Processing', 'Data Visualization (Tableau/ggplot2)', 'Tactical Video Breakdown & Tagging (Hudl)', 'Player Performance Modeling (xG, EPA, PER)', 'Scouting & Matchup Report Writing'],
    niceToHaveSkills: ['Computer Vision for Tracking', 'Tracking Data (StatsBomb/Second Spectrum)', 'Machine Learning in Athletics'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 30,
    typicalProjects: ['Expected Goals (xG) & Shot Quality Prediction Model for Soccer', 'Player Load & Performance Index Scouting Report with Interactive Visuals'],
    internshipRoles: ['Sports Analytics Intern', 'Club Performance Analyst Intern', 'Scouting & Strategy Trainee'],
    prerequisites: ['Sports Knowledge', 'Statistics Basics', 'Python or R'],
  },
  {
    id: 'sports-data-scientist',
    title: 'Sports Data Scientist',
    domain: 'Sports & Fitness',
    description: 'Builds predictive injury risk models, spatial tracking algorithms, and roster value optimization algorithms for professional franchises.',
    coreRequiredSkills: ['Python (PyTorch/Scikit-Learn)', 'Spatial-Temporal Data Modeling', 'GPS / Wearable Accelerometer Analytics', 'Machine Learning', 'BigQuery / Large Dataset Wrangling', 'Mathematical Roster Optimization'],
    niceToHaveSkills: ['Biomechanical Modeling', 'Computer Vision Object Tracking', 'Survival Analysis for Injury'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 25,
    typicalProjects: ['Predictive Hamstring Strain Risk Model from Wearable GPS Metrics', 'Pitcher/Striker Kinematic Trajectory Classifier from Optical Tracking Data'],
    internshipRoles: ['Franchise Data Science Intern', 'Athletic Performance Data Intern', 'Sports Science Researcher'],
    prerequisites: ['Machine Learning', 'Kinematics', 'Advanced Python'],
  },
  {
    id: 'strength-and-conditioning-coach',
    title: 'Strength and Conditioning Coach',
    domain: 'Sports & Fitness',
    description: 'Programs athletic periodization, velocity-based training, Olympic lifting mechanics, and return-to-play conditioning protocols.',
    coreRequiredSkills: ['Periodization & Program Design', 'Movement Screening (FMS)', 'Velocity-Based Training (VBT) Principles', 'Biomechanics & Kinesiology', 'Load Management & Recovery Protocols', 'Athlete Coaching & Cueing'],
    niceToHaveSkills: ['CSCS Certification', 'Force Plate Data Interpretation', 'Nutrition Protocols'],
    averageSalaryOrStipend: '₹8 – ₹18 LPA (Intern: ₹25,000 – ₹45,000 / month)',
    industryDemand: 'High',
    academicCurriculumCoverage: 65,
    typicalProjects: ['Annual Periodization Plan for Collegiate Track or Basketball Team', 'Velocity-Based Training (VBT) Progression Protocol with Force Plate Logs'],
    internshipRoles: ['Strength & Conditioning Assistant Intern', 'Collegiate Athletic Development Intern', 'Performance Facility Coach Trainee'],
    prerequisites: ['Kinesiology', 'Exercise Physiology', 'Lifting Technique'],
  },
];

export const SAMPLE_CV_PRESETS = [
  {
    id: 'cs-sophomore',
    name: 'Alex Rivera — CS Sophomore (Target: Data Analyst / ML)',
    targetRole: 'Data Analyst',
    domain: 'AI & Technology' as DomainCategory,
    cvText: `ALEX RIVERA
Email: alex.rivera@university.edu | GitHub: github.com/arivera-code
Education: B.S. in Computer Science, State University (Graduation: June 2026)
GPA: 3.65 / 4.0 | Relevant Coursework: Intro to Programming (Python, C++), Data Structures & Algorithms, Discrete Math, Database Systems, Elementary Statistics.

TECHNICAL SKILLS:
- Languages: Python, C++, SQL (PostgreSQL, MySQL), HTML, CSS, JavaScript (basic)
- Libraries & Tools: Pandas, NumPy, Matplotlib, Jupyter Notebooks, Git, GitHub, VS Code, Microsoft Excel (Formulas, Pivot Tables)
- Conceptual Knowledge: Object-Oriented Programming, Relational Databases, Basic Exploratory Data Analysis, Linear Regression, Sorting Algorithms

PROJECTS:
1. University Student Enrollment Explorer (Python & SQL):
   - Wrote SQL queries to join and filter academic database of 12,000+ course enrollments.
   - Built a Pandas data pipeline to compute faculty-student ratios and drop-out rates.
   - Visualized trend charts using Matplotlib and exported findings into CSV.

2. Simple Housing Price Predictor (Python):
   - Implemented multiple linear regression using Scikit-Learn on Boston housing dataset.
   - Performed data cleaning, missing value imputation, and feature scaling with Pandas.
   - Evaluated model performance using Mean Squared Error (MSE) and R² metrics.

CAMPUS ACTIVITIES & LEADERSHIP:
- Member, ACM Student Chapter
- Peer Tutor for Computer Science 101 (Intro to Python Programming)`,
  },
  {
    id: 'web-dev-junior',
    name: 'Maya Chen — Junior Software Developer (Target: Full Stack Developer)',
    targetRole: 'Full Stack Developer',
    domain: 'AI & Technology' as DomainCategory,
    cvText: `MAYA CHEN
Email: maya.chen@tech.io | Portfolio: mayachen.dev | LinkedIn: linkedin.com/in/mayachen
Education: B.Tech in Information Technology, City Engineering College (Expected 2025)

SKILLS:
- Frontend: JavaScript (ES6+), React.js, HTML5, CSS3, Tailwind CSS, Bootstrap
- Backend: Node.js, Express.js, RESTful APIs, basic Python
- Databases: MongoDB, Mongoose, basic PostgreSQL
- Tools: Git, GitHub, Postman, Vite, Vercel

PROJECTS:
1. Campus Resource Sharing Portal:
   - Developed full-stack web application using React and Express.
   - Implemented JWT authentication and protected routes for students.
   - Stored book exchange listings in MongoDB with search and filtering features.

2. Interactive Quiz Web App:
   - Built with React hooks and Tailwind CSS with real-time scoring and localStorage persistence.
   - Integrated Open Trivia API to fetch randomized category questions.

INTERNSHIP EXPERIENCE:
- Web Development Intern at Local Tech Solutions (3 Months):
  Assisted in building responsive landing pages using React and Tailwind CSS. Tested REST endpoints using Postman.`,
  },
  {
    id: 'finance-student',
    name: 'David Patel — BBA Finance Undergrad (Target: Financial Analyst)',
    targetRole: 'Financial Analyst',
    domain: 'Finance & Business' as DomainCategory,
    cvText: `DAVID PATEL
Email: d.patel@business-school.edu | LinkedIn: linkedin.com/in/davidpatel-fin
Education: Bachelor of Business Administration (Finance Major), College of Commerce (2025)

CORE SKILLS:
- Financial Analysis: Financial Statement Analysis (Balance Sheet, Income Statement, Cash Flow), Ratio Analysis, Break-Even Modeling
- Software: Microsoft Excel (VLOOKUP, INDEX/MATCH, Pivot Tables, Data Tables), PowerPoint
- Concepts: Corporate Finance, Capital Budgeting, Net Present Value (NPV), Internal Rate of Return (IRR), Microeconomics

ACADEMIC PROJECTS:
1. Valuation Analysis of Retail Consumer Tech Corp:
   - Analyzed 5-year SEC 10-K filings to compute profitability, liquidity, and debt ratios.
   - Built a simplified 3-year revenue projection model in Excel using historical CAGR.
   - Prepared a 15-slide executive presentation summarizing investment feasibility.

ACTIVITIES:
- Treasurer, Finance & Investment Student Society
- Runner-Up, Inter-College Stock Trading Simulation Competition`,
  },
  {
    id: 'creative-designer',
    name: 'Sophie Laurent — Graphic Design Graduate (Target: UI/UX Designer)',
    targetRole: 'UI/UX Designer',
    domain: 'AI & Technology' as DomainCategory,
    cvText: `SOPHIE LAURENT
Portfolio: sophielaurent.design | Email: sophie@designcraft.com
Education: B.A. in Visual Communication & Digital Media (2025)

SKILLS:
- Design Software: Figma (Wireframing, Basic Components), Adobe Illustrator, Adobe Photoshop, InDesign
- Design Disciplines: Typography, Color Theory, Layout Grid Systems, Iconography, Visual Branding
- UX Basics: User Persona Creation, Empathy Mapping, Simple Clickable Prototypes

PROJECTS:
1. EcoTrack Mobile App Case Study:
   - Conducted interviews with 8 users to identify carbon footprint tracking habits.
   - Designed low-fidelity paper wireframes and converted them into high-fidelity Figma screens.
   - Designed custom vector icons and cohesive brand style guide in Illustrator.

2. University Canteen Redesign Mockup:
   - Created mobile order-ahead concept screens in Figma to streamline campus lunch queues.`,
  },
];

export const COLLEGE_COHORT_DATA: CollegeCohortSkill[] = [
  { skill: 'Python Programming', percentage: 85, industryBenchmark: 90, category: 'Core Language', gap: 5, status: 'Well Covered', recommendedAction: 'Maintain current syllabus depth, introduce async programming.' },
  { skill: 'Relational SQL & Queries', percentage: 75, industryBenchmark: 85, category: 'Database', gap: 10, status: 'Well Covered', recommendedAction: 'Add complex window functions and query profiling to lab curriculum.' },
  { skill: 'Java & OOP Principles', percentage: 70, industryBenchmark: 75, category: 'Core Language', gap: 5, status: 'Well Covered', recommendedAction: 'Align with modern Spring Boot microservices frameworks.' },
  { skill: 'Machine Learning Fundamentals', percentage: 52, industryBenchmark: 80, category: 'AI & Data', gap: 28, status: 'Moderate Gap', recommendedAction: 'Organize hands-on ML pipeline workshops with Scikit-Learn & PyTorch.' },
  { skill: 'Cloud Computing (AWS/GCP)', percentage: 40, industryBenchmark: 85, category: 'Infrastructure', gap: 45, status: 'Critical Gap', recommendedAction: 'Organize 6-week Cloud Certification boot camp & practical sandbox labs.' },
  { skill: 'Power BI & Data Visualization', percentage: 35, industryBenchmark: 75, category: 'Analytics', gap: 40, status: 'Critical Gap', recommendedAction: 'Host industry dashboard masterclass with real company datasets.' },
  { skill: 'Docker & Containerization', percentage: 28, industryBenchmark: 80, category: 'DevOps', gap: 52, status: 'Critical Gap', recommendedAction: 'Integrate container deployment into Capstone project requirements.' },
  { skill: 'CI/CD & Git Automation', percentage: 32, industryBenchmark: 75, category: 'DevOps', gap: 43, status: 'Critical Gap', recommendedAction: 'Implement automated GitHub Actions grading for student repositories.' },
];

export const SAMPLE_CANDIDATE_POOL: CandidateProfile[] = [
  {
    id: 'cand-1',
    name: 'Aarav Sharma',
    college: 'Apex Institute of Technology',
    degree: 'B.Tech Computer Science',
    graduationYear: 2025,
    skills: ['Python', 'SQL', 'Scikit-Learn', 'Pandas', 'Power BI', 'FastAPI', 'Docker'],
    matchScore: 92,
    targetRole: 'Data Analyst',
    cvSummary: 'Strong technical background with 2 data analytics internships and live production dashboard portfolio.',
    status: 'Shortlisted',
  },
  {
    id: 'cand-2',
    name: 'Priya Nair',
    college: 'Metro College of Engineering',
    degree: 'B.E. Information Science',
    graduationYear: 2025,
    skills: ['Python', 'SQL', 'Tableau', 'Excel', 'Statistics'],
    matchScore: 84,
    targetRole: 'Data Analyst',
    cvSummary: 'Solid foundations in business intelligence, SQL window functions, and financial metrics reporting.',
    status: 'Interviewing',
  },
  {
    id: 'cand-3',
    name: 'Rohan Gupta',
    college: 'State Technical University',
    degree: 'B.Sc. Data Science',
    graduationYear: 2026,
    skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Matplotlib'],
    matchScore: 71,
    targetRole: 'Data Analyst',
    cvSummary: 'Good theoretical grounding in Python; currently learning Power BI and business data modeling.',
    status: 'Under Review',
  },
  {
    id: 'cand-4',
    name: 'Elena Rostova',
    college: 'Polytechnic University',
    degree: 'B.S. Software Engineering',
    graduationYear: 2025,
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Docker'],
    matchScore: 95,
    targetRole: 'Full Stack Developer',
    cvSummary: 'Full-stack builder with open source contributions and production Next.js SaaS app in portfolio.',
    status: 'Shortlisted',
  },
  {
    id: 'cand-5',
    name: 'Liam O’Connor',
    college: 'Trinity Institute of Tech',
    degree: 'B.S. Computer Science',
    graduationYear: 2026,
    skills: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'Git'],
    matchScore: 88,
    targetRole: 'AI Engineer',
    cvSummary: 'Published conference paper in computer vision; built real-time defect segmentation model.',
    status: 'Shortlisted',
  },
];
