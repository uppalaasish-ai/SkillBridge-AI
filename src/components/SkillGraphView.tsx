import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  BookOpen,
  Filter,
  Layers,
  Compass,
  Cpu,
  Brain,
  Code,
  Shield,
  Cloud,
  Smartphone,
  BarChart3,
  Palette,
  Dna,
  Activity,
  Search,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Server,
  Database,
  Target,
  Radio,
} from 'lucide-react';
import { CVAnalysisResult, DomainCategory } from '../types';

interface SkillGraphViewProps {
  currentResult: CVAnalysisResult | null;
  onNavigateToAnalyzer: () => void;
}

interface GraphTrack {
  id: string;
  name: string;
  domain: DomainCategory;
  shortDesc: string;
  careerRoles: string[];
  nodes: {
    id: string;
    label: string;
    level: number; // 0=Foundation, 1=Core, 2=Applied, 3=Specialization
    category: 'foundation' | 'core' | 'framework' | 'specialization';
    prerequisites: string[];
    unlocks: string[];
    hours: number;
    description: string;
  }[];
}

const GRAPH_TRACKS: GraphTrack[] = [
  // 1. Data Science & Machine Learning
  {
    id: 'data-science',
    name: 'Data Science & Machine Learning Track',
    domain: 'AI & Technology',
    shortDesc: 'Mathematical modeling, predictive algorithms, statistical analysis, and end-to-end ML pipelines.',
    careerRoles: ['Data Scientist', 'Machine Learning Engineer', 'Data Analyst'],
    nodes: [
      { id: 'math', label: 'Linear Algebra & Statistics', level: 0, category: 'foundation', prerequisites: [], unlocks: ['python', 'ml'], hours: 40, description: 'Multivariate calculus, probability distributions, matrix operations, hypothesis testing.' },
      { id: 'python', label: 'Python Programming', level: 1, category: 'core', prerequisites: ['math'], unlocks: ['sql', 'eda', 'ml'], hours: 50, description: 'Data structures, OOP, functional programming, virtual environments, algorithm complexity.' },
      { id: 'sql', label: 'Relational SQL', level: 1, category: 'core', prerequisites: ['python'], unlocks: ['powerbi', 'eda'], hours: 35, description: 'Window functions, CTEs, indexing, schema design, database normalization.' },
      { id: 'eda', label: 'Pandas & Exploratory Analysis', level: 2, category: 'framework', prerequisites: ['python', 'sql'], unlocks: ['ml', 'powerbi'], hours: 30, description: 'Exploratory data analysis, handling missing values, grouped aggregations, data reshaping.' },
      { id: 'powerbi', label: 'Power BI & Visual Analytics', level: 2, category: 'framework', prerequisites: ['sql', 'eda'], unlocks: ['business-analytics'], hours: 25, description: 'DAX formulas, interactive dashboard modeling, executive reporting, KPI tracking.' },
      { id: 'ml', label: 'Machine Learning (Scikit-Learn)', level: 2, category: 'core', prerequisites: ['eda', 'math'], unlocks: ['dl', 'mlops'], hours: 60, description: 'Regression, classification, random forests, feature engineering, cross-validation metrics.' },
      { id: 'dl', label: 'Deep Learning (PyTorch)', level: 3, category: 'specialization', prerequisites: ['ml'], unlocks: ['nlp', 'cv'], hours: 80, description: 'Neural networks, backpropagation, CNNs, transformers, GPU acceleration.' },
      { id: 'nlp', label: 'NLP & LLM Applications', level: 3, category: 'specialization', prerequisites: ['dl'], unlocks: [], hours: 65, description: 'Transformers, embeddings, vector databases, RAG pipelines, fine-tuning.' },
      { id: 'mlops', label: 'MLOps & Model Deployment', level: 3, category: 'specialization', prerequisites: ['ml'], unlocks: [], hours: 45, description: 'Docker containerization, FastAPI model serving, MLflow experiment tracking, CI/CD pipelines.' },
    ],
  },

  // 2. Generative AI, LLMs & Autonomous Agents
  {
    id: 'genai-agents',
    name: 'Generative AI, LLMs & Autonomous Agents Track',
    domain: 'AI & Technology',
    shortDesc: 'Frontier AI engineering: prompt architectures, vector retrieval, embeddings, fine-tuning, and multi-agent systems.',
    careerRoles: ['Generative AI Engineer', 'AI Agent Architect', 'LLM Solutions Engineer'],
    nodes: [
      { id: 'genai-python', label: 'Python & REST API Foundations', level: 0, category: 'foundation', prerequisites: [], unlocks: ['prompt-eng', 'embeddings'], hours: 35, description: 'Asynchronous Python, HTTP streaming protocols, Pydantic data schemas, JSON validation.' },
      { id: 'prompt-eng', label: 'Prompt Architecture & Tool Calling', level: 1, category: 'core', prerequisites: ['genai-python'], unlocks: ['rag', 'agents'], hours: 25, description: 'Few-shot prompting, structured JSON schema output, tool calling, system instruction design.' },
      { id: 'embeddings', label: 'Vector Embeddings & Semantic Search', level: 1, category: 'core', prerequisites: ['genai-python'], unlocks: ['vector-db', 'rag'], hours: 30, description: 'Cosine similarity, dense vector spaces, chunking algorithms, hybrid keyword-vector search.' },
      { id: 'vector-db', label: 'Vector Databases (Chroma & Pinecone)', level: 2, category: 'framework', prerequisites: ['embeddings'], unlocks: ['rag'], hours: 25, description: 'HNSW indexing, metadata filtering, namespace isolation, scalable index management.' },
      { id: 'rag', label: 'Advanced RAG Systems (LangChain/LlamaIndex)', level: 2, category: 'framework', prerequisites: ['prompt-eng', 'vector-db'], unlocks: ['fine-tuning', 'agents'], hours: 55, description: 'Hierarchical chunking, re-ranking models (Cohere), contextual query rewriting, multi-document retrieval.' },
      { id: 'agents', label: 'Autonomous Multi-Agent Systems', level: 3, category: 'specialization', prerequisites: ['rag'], unlocks: ['llmops'], hours: 65, description: 'ReAct loops, human-in-the-loop validation, memory persistence, multi-agent task orchestration.' },
      { id: 'fine-tuning', label: 'LoRA & PEFT Model Fine-Tuning', level: 3, category: 'specialization', prerequisites: ['rag'], unlocks: ['llmops'], hours: 60, description: 'Instruction datasets, parameter-efficient fine-tuning (LoRA, QLoRA), quantization, evaluation benchmarks.' },
      { id: 'llmops', label: 'LLMOps, Security & Guardrails', level: 3, category: 'specialization', prerequisites: ['agents', 'fine-tuning'], unlocks: [], hours: 40, description: 'Prompt injection defenses, token budget caching, latency optimization, observability with Langfuse.' },
    ],
  },

  // 3. Full Stack Web & Distributed Cloud Systems
  {
    id: 'fullstack',
    name: 'Full Stack & Distributed Cloud Systems Track',
    domain: 'AI & Technology',
    shortDesc: 'Modern responsive frontends, type-safe API architectures, database optimization, and cloud microservices.',
    careerRoles: ['Full Stack Engineer', 'Frontend Developer', 'Backend Architect'],
    nodes: [
      { id: 'js', label: 'Modern JavaScript (ES6+)', level: 0, category: 'foundation', prerequisites: [], unlocks: ['ts', 'react', 'node'], hours: 45, description: 'Closures, promises, async/await, DOM APIs, event loop, module systems.' },
      { id: 'ts', label: 'TypeScript Systems', level: 1, category: 'core', prerequisites: ['js'], unlocks: ['react', 'node'], hours: 30, description: 'Generics, interface types, union narrowing, mapped types, utility types.' },
      { id: 'react', label: 'React.js & State Architecture', level: 2, category: 'framework', prerequisites: ['ts'], unlocks: ['nextjs', 'tailwind'], hours: 55, description: 'Hooks, custom hooks, state machines, component lifecycles, performance profiling.' },
      { id: 'tailwind', label: 'Tailwind CSS & UI Systems', level: 2, category: 'framework', prerequisites: ['react'], unlocks: ['nextjs'], hours: 20, description: 'Responsive layouts, design tokens, fluid typography, dark mode styling.' },
      { id: 'node', label: 'Node.js & Express / NestJS APIs', level: 2, category: 'core', prerequisites: ['ts'], unlocks: ['db', 'nextjs'], hours: 45, description: 'RESTful API architecture, middleware pipelines, JWT auth, input validation, rate limiting.' },
      { id: 'db', label: 'PostgreSQL & Modern ORMs', level: 2, category: 'core', prerequisites: ['node'], unlocks: ['nextjs'], hours: 35, description: 'ACID transactions, migration management, foreign keys, Prisma/Drizzle ORM patterns.' },
      { id: 'nextjs', label: 'Full-Stack Next.js (App Router)', level: 3, category: 'specialization', prerequisites: ['react', 'node', 'db'], unlocks: ['cloud'], hours: 50, description: 'Server components, streaming SSR, Server Actions, route handlers, caching tiers.' },
      { id: 'cloud', label: 'Docker & Cloud Deployment', level: 3, category: 'specialization', prerequisites: ['nextjs'], unlocks: [], hours: 35, description: 'Containerization, Cloud Run, GitHub Actions CI/CD, reverse proxies, automated deployments.' },
    ],
  },

  // 4. Backend Architecture & High-Scale Microservices Track (NEW)
  {
    id: 'backend-microservices',
    name: 'Backend Architecture & Microservices Track',
    domain: 'AI & Technology',
    shortDesc: 'High-throughput APIs, distributed concurrency, gRPC protocols, message brokers, and transactional integrity.',
    careerRoles: ['Backend Engineer', 'Distributed Systems Architect', 'API Platform Engineer'],
    nodes: [
      { id: 'backend-lang', label: 'Go & Java Concurrency Foundations', level: 0, category: 'foundation', prerequisites: [], unlocks: ['grpc-api', 'rdbms-perf'], hours: 45, description: 'Goroutines, channels, thread pools, garbage collection tuning, memory allocation.' },
      { id: 'grpc-api', label: 'gRPC & Protocol Buffers', level: 1, category: 'core', prerequisites: ['backend-lang'], unlocks: ['kafka-stream', 'distributed-cache'], hours: 35, description: 'Binary serialization, bidirectional streaming, Protobuf schema contracts, HTTP/2 multiplexing.' },
      { id: 'rdbms-perf', label: 'Database Indexing & Query Tuning', level: 1, category: 'core', prerequisites: ['backend-lang'], unlocks: ['distributed-cache'], hours: 35, description: 'B-Tree indexes, EXPLAIN ANALYZE execution plans, connection pooling, isolation levels.' },
      { id: 'distributed-cache', label: 'Redis & Distributed Caching', level: 2, category: 'framework', prerequisites: ['grpc-api', 'rdbms-perf'], unlocks: ['distributed-systems'], hours: 30, description: 'Cache stampede defenses, Redis Sentinel, Redlock distributed locking, TTL strategies.' },
      { id: 'kafka-stream', label: 'Apache Kafka & Event-Driven Pub/Sub', level: 2, category: 'framework', prerequisites: ['grpc-api'], unlocks: ['distributed-systems'], hours: 45, description: 'Topic partitioning, consumer rebalancing, exactly-once delivery, event sourcing pipelines.' },
      { id: 'distributed-systems', label: 'High-Scale Microservices & CAP Theorem', level: 3, category: 'specialization', prerequisites: ['distributed-cache', 'kafka-stream'], unlocks: ['resilience'], hours: 55, description: 'Idempotent endpoints, Saga distributed transactions, Raft consensus, rate limiting algorithms.' },
      { id: 'resilience', label: 'System Resilience & Chaos Engineering', level: 3, category: 'specialization', prerequisites: ['distributed-systems'], unlocks: [], hours: 35, description: 'Circuit breakers (Resilience4j), bulkhead isolation, chaos engineering, graceful degradation.' },
    ],
  },

  // 5. Cloud Infrastructure, DevOps & Kubernetes
  {
    id: 'devops-cloud',
    name: 'Cloud Infrastructure, DevOps & Kubernetes Track',
    domain: 'AI & Technology',
    shortDesc: 'Automated CI/CD pipelines, container orchestration, infrastructure as code, and production observability.',
    careerRoles: ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer (SRE)'],
    nodes: [
      { id: 'linux', label: 'Linux Systems & Shell Scripting', level: 0, category: 'foundation', prerequisites: [], unlocks: ['networking', 'docker'], hours: 40, description: 'Bash automation, user permissions, systemd services, SSH tunneling, process monitoring.' },
      { id: 'networking', label: 'Networking & Protocol Fundamentals', level: 1, category: 'core', prerequisites: ['linux'], unlocks: ['cloud-foundations'], hours: 30, description: 'TCP/IP, DNS routing, HTTP/HTTPS, SSL/TLS certificates, load balancers, firewalls.' },
      { id: 'docker', label: 'Docker Containerization', level: 1, category: 'core', prerequisites: ['linux'], unlocks: ['k8s', 'cicd'], hours: 35, description: 'Dockerfile optimization, multi-stage builds, container networking, volume mounting.' },
      { id: 'cloud-foundations', label: 'Cloud Architecture (AWS/GCP)', level: 2, category: 'core', prerequisites: ['networking'], unlocks: ['terraform', 'k8s'], hours: 50, description: 'VPC subnets, IAM role security, compute instances, object storage, serverless services.' },
      { id: 'terraform', label: 'Infrastructure as Code (Terraform)', level: 2, category: 'framework', prerequisites: ['cloud-foundations'], unlocks: ['cicd'], hours: 40, description: 'HCL syntax, state management, provider configuration, reusable modular infrastructure.' },
      { id: 'k8s', label: 'Kubernetes Cluster Orchestration', level: 3, category: 'specialization', prerequisites: ['docker', 'cloud-foundations'], unlocks: ['observability'], hours: 65, description: 'Pods, Deployments, Services, Ingress controllers, Helm charts, autoscaling policies.' },
      { id: 'cicd', label: 'CI/CD Pipelines (GitHub Actions)', level: 2, category: 'framework', prerequisites: ['docker', 'terraform'], unlocks: ['observability'], hours: 30, description: 'Automated test runners, security scanning, artifact publishing, zero-downtime deployment.' },
      { id: 'observability', label: 'Observability (Prometheus & Grafana)', level: 3, category: 'specialization', prerequisites: ['k8s', 'cicd'], unlocks: [], hours: 40, description: 'Metrics scraping, alert rules, distributed tracing (OpenTelemetry), dashboard visualizations.' },
    ],
  },

  // 6. Modern Data Engineering & Streaming Pipelines (NEW)
  {
    id: 'data-engineering',
    name: 'Modern Data Engineering & Streaming Track',
    domain: 'AI & Technology',
    shortDesc: 'Lakehouse architectures, distributed PySpark computing, Airflow orchestration, and streaming analytics.',
    careerRoles: ['Data Engineer', 'Analytics Engineer', 'Big Data Architect'],
    nodes: [
      { id: 'de-python-sql', label: 'Advanced SQL & Data Structures', level: 0, category: 'foundation', prerequisites: [], unlocks: ['airflow', 'pyspark'], hours: 40, description: 'Analytic window functions, recursive CTEs, partitioning, memory-efficient data structures.' },
      { id: 'airflow', label: 'Workflow Orchestration (Apache Airflow)', level: 1, category: 'core', prerequisites: ['de-python-sql'], unlocks: ['data-lakehouse', 'dbt-transforms'], hours: 35, description: 'Directed Acyclic Graphs (DAGs), task dependencies, dynamic task mapping, SLA alerting.' },
      { id: 'pyspark', label: 'Distributed Computing (Apache Spark / PySpark)', level: 2, category: 'framework', prerequisites: ['de-python-sql'], unlocks: ['streaming-de', 'data-lakehouse'], hours: 55, description: 'RDDs, DataFrames, cluster resource managers, Catalyst optimizer, wide/narrow shuffle transforms.' },
      { id: 'data-lakehouse', label: 'Modern Data Lakehouse (Delta Lake & Snowflake)', level: 2, category: 'framework', prerequisites: ['airflow', 'pyspark'], unlocks: ['dbt-transforms'], hours: 45, description: 'Parquet columnar storage, ACID on object storage, schema evolution, medallion architecture.' },
      { id: 'dbt-transforms', label: 'dbt & Data Modeling Analytics Engineering', level: 2, category: 'framework', prerequisites: ['data-lakehouse'], unlocks: ['streaming-de'], hours: 30, description: 'Modular SQL transformations, automated data testing, data lineage graphs, dimensional Kimball models.' },
      { id: 'streaming-de', label: 'Real-Time Streaming Pipelines (Kafka & Flink)', level: 3, category: 'specialization', prerequisites: ['pyspark', 'dbt-transforms'], unlocks: [], hours: 50, description: 'Event time processing, watermarking, stateful stream computations, dead-letter queues.' },
    ],
  },

  // 7. Cybersecurity, Threat Defense & Ethical Hacking
  {
    id: 'cybersecurity',
    name: 'Cybersecurity, Threat Defense & Ethical Hacking Track',
    domain: 'AI & Technology',
    shortDesc: 'Vulnerability assessment, penetration testing, cryptographic protocols, security auditing, and SOC operations.',
    careerRoles: ['Cybersecurity Analyst', 'Security Engineer', 'Penetration Tester'],
    nodes: [
      { id: 'sec-net', label: 'Network Protocols & Packet Analysis', level: 0, category: 'foundation', prerequisites: [], unlocks: ['linux-sec', 'crypto'], hours: 35, description: 'Wireshark packet sniffing, TCP handshakes, subnetting, ARP spoofing detection.' },
      { id: 'linux-sec', label: 'Linux Hardening & Command Line', level: 1, category: 'core', prerequisites: ['sec-net'], unlocks: ['web-sec', 'soc'], hours: 40, description: 'File permissions, sudo auditing, iptables, SELinux policies, log analysis.' },
      { id: 'crypto', label: 'Applied Cryptography & PKI', level: 1, category: 'core', prerequisites: ['sec-net'], unlocks: ['web-sec'], hours: 30, description: 'Symmetric/asymmetric encryption, hashing algorithms, digital signatures, certificate authorities.' },
      { id: 'web-sec', label: 'Web Security & OWASP Top 10', level: 2, category: 'framework', prerequisites: ['linux-sec', 'crypto'], unlocks: ['pentesting'], hours: 50, description: 'SQL injection, XSS, CSRF, SSRF, broken access control, Burp Suite intercepting.' },
      { id: 'soc', label: 'SIEM & SOC Threat Hunting', level: 2, category: 'framework', prerequisites: ['linux-sec'], unlocks: ['cloud-sec'], hours: 45, description: 'Log ingestion, Splunk / ELK queries, incident response workflows, MITRE ATT&CK mapping.' },
      { id: 'pentesting', label: 'Network & System Penetration Testing', level: 3, category: 'specialization', prerequisites: ['web-sec'], unlocks: ['cloud-sec'], hours: 65, description: 'Metasploit, Nmap reconnaissance, privilege escalation, vulnerability reporting, remediation.' },
      { id: 'cloud-sec', label: 'Cloud Security & Zero-Trust Architecture', level: 3, category: 'specialization', prerequisites: ['soc', 'pentesting'], unlocks: [], hours: 45, description: 'Cloud IAM policies, container security, zero-trust network boundaries, compliance auditing.' },
    ],
  },

  // 8. Cross-Platform Mobile Application Engineering
  {
    id: 'mobile-app',
    name: 'Cross-Platform Mobile Application Track',
    domain: 'AI & Technology',
    shortDesc: 'Native-feel mobile apps, offline-first architectures, mobile state sync, and app store release pipelines.',
    careerRoles: ['Mobile Application Developer', 'React Native Engineer', 'Flutter Specialist'],
    nodes: [
      { id: 'mob-prog', label: 'Mobile Programming Foundations', level: 0, category: 'foundation', prerequisites: [], unlocks: ['react-native', 'flutter'], hours: 40, description: 'Modern JavaScript/TypeScript or Dart, asynchronous event handling, reactive layouts.' },
      { id: 'react-native', label: 'React Native & Expo Ecosystem', level: 1, category: 'core', prerequisites: ['mob-prog'], unlocks: ['mob-state', 'native-apis'], hours: 50, description: 'Native components, Flexbox layouts, navigation routers, animations, platform styling.' },
      { id: 'flutter', label: 'Flutter & Dart Widgets', level: 1, category: 'core', prerequisites: ['mob-prog'], unlocks: ['mob-state'], hours: 50, description: 'Stateless/Stateful widgets, render trees, Material/Cupertino design, custom paints.' },
      { id: 'mob-state', label: 'Mobile State Management & Caching', level: 2, category: 'framework', prerequisites: ['react-native'], unlocks: ['offline-sync'], hours: 35, description: 'Zustand / Redux Toolkit / Riverpod, persistent cache, background sync.' },
      { id: 'native-apis', label: 'Native Device APIs & Sensors', level: 2, category: 'framework', prerequisites: ['react-native'], unlocks: ['offline-sync'], hours: 30, description: 'Geolocation, camera feeds, push notifications, biometric auth (FaceID/Fingerprint).' },
      { id: 'offline-sync', label: 'Offline-First SQLite & WatermelonDB', level: 2, category: 'framework', prerequisites: ['mob-state', 'native-apis'], unlocks: ['store-deploy'], hours: 40, description: 'Local database syncing, conflict resolution strategies, queueing background uploads.' },
      { id: 'store-deploy', label: 'App Store & Play Store CI/CD Pipelines', level: 3, category: 'specialization', prerequisites: ['offline-sync'], unlocks: [], hours: 30, description: 'Fastlane automation, code signing, provisioning profiles, OTA updates via EAS, Play Console.' },
    ],
  },

  // 9. Quantitative Finance, Financial Modeling & FinTech
  {
    id: 'finance-quant',
    name: 'Quantitative Finance & Investment Banking Track',
    domain: 'Finance & Business',
    shortDesc: 'DCF valuations, 3-statement financial modeling, algorithmic backtesting, and portfolio optimization.',
    careerRoles: ['Quantitative Analyst', 'Financial Modeling Associate', 'Investment Banking Analyst'],
    nodes: [
      { id: 'accounting', label: 'Financial Accounting & Reporting', level: 0, category: 'foundation', prerequisites: [], unlocks: ['modeling', 'excel'], hours: 40, description: 'Balance sheet, income statement, cash flow reconciliation, GAAP standards.' },
      { id: 'excel', label: 'Advanced Financial Excel & VBA', level: 1, category: 'core', prerequisites: ['accounting'], unlocks: ['modeling'], hours: 30, description: 'INDEX/MATCH, XLOOKUP, dynamic arrays, scenario managers, data tables, sensitivity grids.' },
      { id: 'modeling', label: '3-Statement & DCF Financial Modeling', level: 2, category: 'framework', prerequisites: ['excel', 'accounting'], unlocks: ['valuation', 'py-fin'], hours: 55, description: 'Revenue drivers, working capital schedules, debt waterfalls, WACC calculations, terminal value.' },
      { id: 'valuation', label: 'Valuation & Pitchbook Advisory', level: 3, category: 'specialization', prerequisites: ['modeling'], unlocks: [], hours: 45, description: 'Comparable company analysis, precedent transactions, LBO sensitivity analysis, equity research.' },
      { id: 'py-fin', label: 'Python for Quant Finance & Portfolios', level: 2, category: 'core', prerequisites: ['modeling'], unlocks: ['algo-trading'], hours: 50, description: 'Pandas time-series, historical volatility, Sharpe ratio, Markowitz mean-variance optimization.' },
      { id: 'algo-trading', label: 'Algorithmic Trading & Backtesting', level: 3, category: 'specialization', prerequisites: ['py-fin'], unlocks: [], hours: 60, description: 'Moving average crossovers, statistical arbitrage, backtesting with Backtrader, slippage modeling.' },
    ],
  },

  // 10. AI Product Management & Strategic Roadmapping Track (NEW)
  {
    id: 'ai-pm',
    name: 'AI Product Management & Strategy Track',
    domain: 'Finance & Business',
    shortDesc: 'Technical PRD writing, customer discovery, North Star metrics, A/B testing, and AI product evaluation.',
    careerRoles: ['Associate Product Manager (APM)', 'Technical Product Manager', 'AI Product Lead'],
    nodes: [
      { id: 'product-foundations', label: 'Product Discovery & Market Sizing', level: 0, category: 'foundation', prerequisites: [], unlocks: ['prd-specs', 'metrics-analytics'], hours: 30, description: 'TAM/SAM/SOM, customer interviews, opportunity-solution trees, competitive moats.' },
      { id: 'prd-specs', label: 'Technical PRD Writing & User Stories', level: 1, category: 'core', prerequisites: ['product-foundations'], unlocks: ['ai-eval-metrics', 'agile-delivery'], hours: 35, description: 'Functional specs, acceptance criteria, technical constraint identification, API contract understanding.' },
      { id: 'metrics-analytics', label: 'Product Analytics & Retention Funnels', level: 1, category: 'core', prerequisites: ['product-foundations'], unlocks: ['ab-testing'], hours: 35, description: 'North Star metrics, Mixpanel/Amplitude event taxonomies, cohort retention, churn drop-offs.' },
      { id: 'ab-testing', label: 'A/B Experimentation & Hypothesis Testing', level: 2, category: 'framework', prerequisites: ['metrics-analytics'], unlocks: ['ai-eval-metrics'], hours: 35, description: 'Statistical power, sample size calculation, p-values, multi-armed bandits, feature flagging.' },
      { id: 'agile-delivery', label: 'Agile Sprint Leadership & Dev Alignment', level: 2, category: 'framework', prerequisites: ['prd-specs'], unlocks: ['ai-eval-metrics'], hours: 25, description: 'Scrum/Kanban management, backlog grooming, sprint velocity tracking, release management.' },
      { id: 'ai-eval-metrics', label: 'GenAI Product Evaluation & Guardrails', level: 3, category: 'specialization', prerequisites: ['ab-testing', 'agile-delivery'], unlocks: [], hours: 45, description: 'RAG evaluation (Ragas, TruLens), hallucination benchmarking, token cost modeling, user trust UX.' },
    ],
  },

  // 11. Digital Product Design, UI/UX & Design Systems
  {
    id: 'uiux-design',
    name: 'Product Design & UI/UX Systems Track',
    domain: 'Creative Fields',
    shortDesc: 'User research, wireframing, high-fidelity Figma design systems, accessibility (WCAG), and developer handoff.',
    careerRoles: ['UI/UX Designer', 'Product Designer', 'Design Systems Engineer'],
    nodes: [
      { id: 'design-thinking', label: 'User Research & Design Thinking', level: 0, category: 'foundation', prerequisites: [], unlocks: ['wireframing'], hours: 30, description: 'User interviews, persona building, empathy maps, journey mapping, heuristic evaluation.' },
      { id: 'wireframing', label: 'Information Architecture & Wireframes', level: 1, category: 'core', prerequisites: ['design-thinking'], unlocks: ['figma-ui'], hours: 35, description: 'Sitemaps, user flow diagrams, low-fidelity wireframes, card sorting, content structure.' },
      { id: 'figma-ui', label: 'Advanced Figma & Interactive Prototypes', level: 2, category: 'framework', prerequisites: ['wireframing'], unlocks: ['design-systems'], hours: 55, description: 'Auto-layout, nested component variants, interactive micro-prototypes, smart animate.' },
      { id: 'design-systems', label: 'Design Systems & Token Architecture', level: 2, category: 'framework', prerequisites: ['figma-ui'], unlocks: ['accessibility', 'handoff'], hours: 45, description: 'Color palettes, fluid typography scales, reusable component libraries, design token sync.' },
      { id: 'accessibility', label: 'Accessibility & Usability Testing (WCAG)', level: 3, category: 'specialization', prerequisites: ['design-systems'], unlocks: ['handoff'], hours: 30, description: 'Color contrast ratios, screen reader hierarchies, focus state management, unmoderated user tests.' },
      { id: 'handoff', label: 'Design Handoff & Frontend Alignment', level: 3, category: 'specialization', prerequisites: ['design-systems', 'accessibility'], unlocks: [], hours: 30, description: 'Figma Dev Mode, specs documentation, CSS variable alignment, responsive breakpoint specs.' },
    ],
  },

  // 12. Computational Biology, Bioinformatics & Scientific Research
  {
    id: 'bioinformatics',
    name: 'Bioinformatics & Computational Biology Track',
    domain: 'Science & Research',
    shortDesc: 'Genomic sequence analysis, protein structure prediction, Biopython scripting, and statistical research pipelines.',
    careerRoles: ['Bioinformatics Scientist', 'Computational Biologist', 'Genomics Data Analyst'],
    nodes: [
      { id: 'genetics-foundations', label: 'Molecular Genetics & Genomics', level: 0, category: 'foundation', prerequisites: [], unlocks: ['biopython'], hours: 40, description: 'DNA replication, transcription, translation, genetic variants, NCBI and Ensembl databases.' },
      { id: 'biopython', label: 'Biopython & Sequence Algorithms', level: 1, category: 'core', prerequisites: ['genetics-foundations'], unlocks: ['ngs-analysis', 'protein-modeling'], hours: 50, description: 'FASTA parsing, pairwise sequence alignment (Needleman-Wunsch/Smith-Waterman), BLAST API integration.' },
      { id: 'ngs-analysis', label: 'Next-Generation Sequencing (NGS) Pipelines', level: 2, category: 'framework', prerequisites: ['biopython'], unlocks: ['bio-stats'], hours: 60, description: 'Quality control (FastQC), read mapping (BWA), variant calling (GATK), RNA-seq differential expression.' },
      { id: 'protein-modeling', label: 'Protein Structure & Molecular Docking', level: 2, category: 'framework', prerequisites: ['biopython'], unlocks: ['alphafold-tools'], hours: 50, description: 'PDB file parsing, PyMOL visualization, ligand-receptor binding, molecular dynamics principles.' },
      { id: 'bio-stats', label: 'Statistical Genomics & Hypothesis Testing', level: 3, category: 'specialization', prerequisites: ['ngs-analysis'], unlocks: [], hours: 45, description: 'False discovery rates (Benjamini-Hochberg), principal component analysis, survival analysis.' },
      { id: 'alphafold-tools', label: 'Structural Bioinformatics & AI Folding', level: 3, category: 'specialization', prerequisites: ['protein-modeling'], unlocks: [], hours: 45, description: 'AlphaFold structure predictions, contact map generation, de novo protein design principles.' },
    ],
  },

  // 13. Sports Analytics, Biomechanics & Performance Science
  {
    id: 'sports-analytics',
    name: 'Sports Performance Analytics & Biomechanics Track',
    domain: 'Sports & Fitness',
    shortDesc: 'Wearable IMU sensor analysis, player load monitoring, tactical video CV tracking, and athletic injury forecasting.',
    careerRoles: ['Sports Data Analyst', 'Biomechanics Specialist', 'Athletic Performance Scientist'],
    nodes: [
      { id: 'kinesiology', label: 'Kinesiology & Movement Mechanics', level: 0, category: 'foundation', prerequisites: [], unlocks: ['sports-python'], hours: 35, description: 'Anatomical movement planes, muscle activation patterns, joint torque principles, force-velocity curves.' },
      { id: 'sports-python', label: 'Python for Spatial & Sports Tracking', level: 1, category: 'core', prerequisites: ['kinesiology'], unlocks: ['wearables', 'video-tracking'], hours: 45, description: 'Spatial plotting with Matplotlib, athlete event data parsing, pitch coordinates transformation.' },
      { id: 'wearables', label: 'Wearable Sensor & GPS Load Monitoring', level: 2, category: 'framework', prerequisites: ['sports-python'], unlocks: ['fatigue-modeling'], hours: 45, description: 'Catapult / STATSports GPS metrics, accelerometer PlayerLoad calculations, sprint distance metrics.' },
      { id: 'video-tracking', label: 'Computer Vision & Tactical Video Tracking', level: 2, category: 'framework', prerequisites: ['sports-python'], unlocks: ['tactical-dashboards'], hours: 55, description: 'YOLO player detection, OpenPose body keypoint tracking, pitch homography perspective transforms.' },
      { id: 'fatigue-modeling', label: 'Injury Risk & Acute:Chronic Workload (ACWR)', level: 3, category: 'specialization', prerequisites: ['wearables'], unlocks: ['tactical-dashboards'], hours: 40, description: 'Exponentially weighted moving averages, rolling workload ratios, recovery optimization metrics.' },
      { id: 'tactical-dashboards', label: 'Coaching & Tactical Decision Dashboards', level: 3, category: 'specialization', prerequisites: ['video-tracking', 'fatigue-modeling'], unlocks: [], hours: 35, description: 'Executive team briefing dashboards in Tableau/Power BI, expected goals (xG/xT) modeling, opposition scouting.' },
    ],
  },

  // 14. Embedded Systems, IoT & Edge Computing Track (NEW)
  {
    id: 'embedded-iot',
    name: 'Embedded Systems & Edge Computing Track',
    domain: 'Science & Research',
    shortDesc: 'C/C++ firmware, RTOS scheduling, bus protocols (SPI/I2C/CAN), IoT wireless, and TinyML on microcontrollers.',
    careerRoles: ['Embedded Software Engineer', 'Firmware Developer', 'IoT Systems Architect'],
    nodes: [
      { id: 'c-embedded', label: 'C / C++ & Computer Architecture', level: 0, category: 'foundation', prerequisites: [], unlocks: ['mcu-protocols', 'rtos'], hours: 45, description: 'Pointers, memory layout, bitwise manipulation, interrupts, registers, memory-mapped I/O.' },
      { id: 'mcu-protocols', label: 'Hardware Protocols (I2C, SPI, UART, CAN)', level: 1, category: 'core', prerequisites: ['c-embedded'], unlocks: ['rtos', 'iot-wireless'], hours: 35, description: 'Bus arbitration, timing diagrams, logic analyzers, peripheral interfacing.' },
      { id: 'rtos', label: 'Real-Time Operating Systems (FreeRTOS)', level: 2, category: 'framework', prerequisites: ['c-embedded', 'mcu-protocols'], unlocks: ['iot-wireless', 'edge-ai'], hours: 45, description: 'Task scheduling, preemptive priorities, semaphores, mutexes, message queues, memory fragmentation.' },
      { id: 'iot-wireless', label: 'Wireless Networking (MQTT, BLE, WiFi)', level: 2, category: 'framework', prerequisites: ['mcu-protocols', 'rtos'], unlocks: ['edge-ai'], hours: 40, description: 'GATT profiles, MQTT publish-subscribe over TLS, low-power sleep modes, OTA firmware updates.' },
      { id: 'edge-ai', label: 'TinyML & Edge AI Deployment', level: 3, category: 'specialization', prerequisites: ['rtos', 'iot-wireless'], unlocks: [], hours: 50, description: 'TensorFlow Lite for Microcontrollers, INT8 quantization, inference on ARM Cortex-M/ESP32.' },
    ],
  },
];

export const SkillGraphView: React.FC<SkillGraphViewProps> = ({
  currentResult,
  onNavigateToAnalyzer,
}) => {
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('data-science');

  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-detect best pathway if candidate has analyzed a role
  useEffect(() => {
    if (currentResult) {
      const targetLower = currentResult.targetRole.toLowerCase();
      const domain = currentResult.targetDomain;

      let matchedId = '';
      if (targetLower.includes('gen') || targetLower.includes('llm') || targetLower.includes('agent')) {
        matchedId = 'genai-agents';
      } else if (targetLower.includes('data engineering') || targetLower.includes('spark') || targetLower.includes('airflow')) {
        matchedId = 'data-engineering';
      } else if (targetLower.includes('data') || targetLower.includes('ml') || targetLower.includes('machine learning')) {
        matchedId = 'data-science';
      } else if (targetLower.includes('backend') || targetLower.includes('microservice') || targetLower.includes('api')) {
        matchedId = 'backend-microservices';
      } else if (targetLower.includes('web') || targetLower.includes('full stack') || targetLower.includes('frontend') || targetLower.includes('react')) {
        matchedId = 'fullstack';
      } else if (targetLower.includes('cloud') || targetLower.includes('devops') || targetLower.includes('sre')) {
        matchedId = 'devops-cloud';
      } else if (targetLower.includes('security') || targetLower.includes('cyber') || targetLower.includes('penetration')) {
        matchedId = 'cybersecurity';
      } else if (targetLower.includes('mobile') || targetLower.includes('android') || targetLower.includes('ios')) {
        matchedId = 'mobile-app';
      } else if (targetLower.includes('product manager') || targetLower.includes('apm') || targetLower.includes('product lead')) {
        matchedId = 'ai-pm';
      } else if (domain === 'Finance & Business' || targetLower.includes('finance') || targetLower.includes('quant')) {
        matchedId = 'finance-quant';
      } else if (domain === 'Creative Fields' || targetLower.includes('design') || targetLower.includes('ui') || targetLower.includes('ux')) {
        matchedId = 'uiux-design';
      } else if (targetLower.includes('embedded') || targetLower.includes('iot') || targetLower.includes('firmware')) {
        matchedId = 'embedded-iot';
      } else if (domain === 'Science & Research' || targetLower.includes('bio') || targetLower.includes('science')) {
        matchedId = 'bioinformatics';
      } else if (domain === 'Sports & Fitness' || targetLower.includes('sport') || targetLower.includes('fitness')) {
        matchedId = 'sports-analytics';
      }

      if (matchedId) {
        setSelectedTrackId(matchedId);
        const trk = GRAPH_TRACKS.find((t) => t.id === matchedId);
        if (trk) {
          setSelectedNodeId(trk.nodes[0].id);
        }
      }
    }
  }, [currentResult]);

  const filteredTracks = GRAPH_TRACKS.filter((track) => {
    const matchesDomain = selectedDomainFilter === 'All' || track.domain === selectedDomainFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.careerRoles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      track.nodes.some((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesSearch;
  });

  const activeTrack =
    GRAPH_TRACKS.find((t) => t.id === selectedTrackId) || GRAPH_TRACKS[0];

  const currentTrackIndex = GRAPH_TRACKS.findIndex((t) => t.id === activeTrack.id);

  const [selectedNodeId, setSelectedNodeId] = useState<string>(activeTrack.nodes[0].id);

  // Sync selected node when track changes
  const handleTrackChange = (newTrackId: string) => {
    setSelectedTrackId(newTrackId);
    const track = GRAPH_TRACKS.find((t) => t.id === newTrackId);
    if (track) {
      setSelectedNodeId(track.nodes[0].id);
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + GRAPH_TRACKS.length) % GRAPH_TRACKS.length;
    handleTrackChange(GRAPH_TRACKS[prevIdx].id);
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % GRAPH_TRACKS.length;
    handleTrackChange(GRAPH_TRACKS[nextIdx].id);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const selectedNode =
    activeTrack.nodes.find((n) => n.id === selectedNodeId) || activeTrack.nodes[0];

  // Helper to check if user has node skill
  const isPossessed = (label: string) => {
    if (!currentResult) return false;
    const lower = label.toLowerCase();
    return currentResult.matchedSkills.some(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        lower.includes(s.name.toLowerCase())
    );
  };

  const isMissing = (label: string) => {
    if (!currentResult) return false;
    const lower = label.toLowerCase();
    return currentResult.missingSkills.some(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        lower.includes(s.name.toLowerCase())
    );
  };

  // Domain icon helper
  const getDomainIcon = (domain: DomainCategory) => {
    switch (domain) {
      case 'AI & Technology':
        return <Cpu className="h-3.5 w-3.5" />;
      case 'Finance & Business':
        return <BarChart3 className="h-3.5 w-3.5" />;
      case 'Creative Fields':
        return <Palette className="h-3.5 w-3.5" />;
      case 'Science & Research':
        return <Dna className="h-3.5 w-3.5" />;
      case 'Sports & Fitness':
        return <Activity className="h-3.5 w-3.5" />;
      default:
        return <Compass className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-8 py-6 pb-20">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
              <Share2 className="h-3.5 w-3.5" />
              <span>Interactive Knowledge Graph • {GRAPH_TRACKS.length} Comprehensive Career Pathways</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
              Skill Dependency Graph Explorer
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Explore {GRAPH_TRACKS.length} interconnected career pathways spanning Tech, Backend, AI, Cloud, Finance, Design, Science, and Sports. Switch pathways to view prerequisite trees, estimated hours, and downstream unlocks.
            </p>
          </div>

          {currentResult && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3 text-xs max-w-xs shadow-xs">
              <span className="font-bold text-blue-950 flex items-center gap-1 mb-0.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Active Target Role:</span>
              </span>
              <p className="text-blue-900 font-semibold">
                {currentResult.targetRole} ({currentResult.matchScore}% Match)
              </p>
            </div>
          )}
        </div>

        {/* Domain Filter Pills & View Controls */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">
              Domain:
            </span>
            {['All', 'AI & Technology', 'Finance & Business', 'Creative Fields', 'Science & Research', 'Sports & Fitness'].map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomainFilter(dom)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  selectedDomainFilter === dom
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {dom === 'All' ? `All (${GRAPH_TRACKS.length} Pathways)` : dom}
              </button>
            ))}
          </div>

          {/* Search & Layout Toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search pathway or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 sm:w-56"
              />
            </div>

            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5">
              <button
                onClick={() => setViewMode('carousel')}
                title="Horizontal Flow"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'carousel' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Flow</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="View All Pathways Grid"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="h-3 w-3" />
                <span>All ({filteredTracks.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pathway Carousel Mode with scroll arrows */}
        {viewMode === 'carousel' ? (
          <div className="relative mt-4">
            {/* Left & Right quick scroll buttons */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                <span>Showing {filteredTracks.length} Career Pathways</span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-600 font-semibold">Active: {activeTrack.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-100 shadow-2xs"
                  title="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-100 shadow-2xs"
                  title="Scroll right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scroll-smooth"
            >
              {filteredTracks.map((track) => {
                const isSelected = track.id === activeTrack.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleTrackChange(track.id)}
                    className={`shrink-0 text-left p-3.5 rounded-2xl border transition-all min-w-[240px] max-w-[280px] ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/90 shadow-sm ring-2 ring-blue-500/50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-[10px] font-bold text-slate-500 mb-1">
                      <div className="flex items-center gap-1">
                        {getDomainIcon(track.domain)}
                        <span>{track.domain}</span>
                      </div>
                      {isSelected && (
                        <span className="rounded bg-blue-600 text-white px-1.5 py-0.2 text-[9px] font-bold uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                      {track.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {track.shortDesc}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-semibold text-blue-600 flex items-center justify-between">
                      <span>{track.nodes.length} Skill Nodes</span>
                      <span className="font-bold">{isSelected ? '● Selected' : 'Explore →'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Grid View Mode: Displays all pathways cleanly */
          <div className="mt-4 space-y-2">
            <div className="text-[11px] font-bold text-slate-500">
              Showing All {filteredTracks.length} Pathways • Click any pathway below to view its complete skill graph
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto p-1">
              {filteredTracks.map((track) => {
                const isSelected = track.id === activeTrack.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      handleTrackChange(track.id);
                      setViewMode('carousel');
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/90 shadow-sm ring-2 ring-blue-500/50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <div className="flex items-center gap-1">
                        {getDomainIcon(track.domain)}
                        <span>{track.domain}</span>
                      </div>
                      {isSelected && (
                        <span className="rounded bg-blue-600 text-white px-1.5 py-0.2 text-[9px] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                      {track.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {track.shortDesc}
                    </p>
                    <div className="mt-2 text-[10px] font-semibold text-blue-600 flex items-center justify-between">
                      <span>{track.nodes.length} Nodes</span>
                      <span>{isSelected ? 'Viewing' : 'Select →'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Graph Grid: 8 cols Visual Graph + 4 cols Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Visual Hierarchical Tree (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl space-y-8 relative overflow-hidden">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  {activeTrack.domain} Specialization Pathway ({currentTrackIndex + 1} of {GRAPH_TRACKS.length})
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {activeTrack.name}
              </h3>
            </div>

            {/* Quick Next/Prev Pathway Buttons & Legend */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl bg-slate-800 border border-slate-700 p-0.5 text-xs">
                <button
                  onClick={handlePrevTrack}
                  className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg flex items-center gap-1 text-[11px]"
                  title="Previous Pathway"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={handleNextTrack}
                  className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg flex items-center gap-1 text-[11px]"
                  title="Next Pathway"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2.5 text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/60">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50" />
                  <span>Possessed</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-400 shadow-xs shadow-rose-400/50" />
                  <span>Gap</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-sky-400 shadow-xs shadow-sky-400/50" />
                  <span>Next</span>
                </span>
              </div>
            </div>
          </div>

          {/* Render levels as hierarchical stages */}
          <div className="relative z-10 space-y-6">
            {[0, 1, 2, 3].map((lvl) => {
              const nodesAtLevel = activeTrack.nodes.filter((n) => n.level === lvl);
              if (nodesAtLevel.length === 0) return null;
              const levelTitles = [
                'Stage 0: Mathematical & Academic Foundations',
                'Stage 1: Core Languages & Protocols',
                'Stage 2: Applied Frameworks & Production Pipelines',
                'Stage 3: Advanced Specializations & Capstone Implementations',
              ];

              return (
                <div key={lvl} className="space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 pb-1 flex items-center justify-between">
                    <span>{levelTitles[lvl]}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {nodesAtLevel.length} nodes
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {nodesAtLevel.map((node) => {
                      const possessed = isPossessed(node.label);
                      const missing = isMissing(node.label);
                      const isSelected = selectedNodeId === node.id;

                      return (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`group relative flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all text-left ${
                            isSelected
                              ? 'ring-2 ring-sky-400 bg-sky-500/25 text-white shadow-lg scale-[1.02]'
                              : 'bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-slate-700/80 hover:border-slate-600'
                          }`}
                        >
                          {possessed ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0 ring-2 ring-emerald-500/30" />
                          ) : missing ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-400 shrink-0 ring-2 ring-rose-500/30" />
                          ) : (
                            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shrink-0 ring-2 ring-sky-500/30" />
                          )}

                          <span className="line-clamp-1">{node.label}</span>

                          {node.prerequisites.length > 0 && (
                            <span className="text-[10px] text-slate-400 font-mono ml-auto">
                              ({node.prerequisites.length} req)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              * Following the Skill Graph sequence ensures prerequisite mastery and reduces learning curve by ~40%.
            </span>
            <span className="text-slate-300 font-semibold">
              Total Track Learning: ~{activeTrack.nodes.reduce((acc, n) => acc + n.hours, 0)} Hours
            </span>
          </div>
        </div>

        {/* Right: Node Inspector Details (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Selected Skill Node
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isPossessed(selectedNode.label)
                    ? 'bg-emerald-100 text-emerald-800'
                    : isMissing(selectedNode.label)
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                {isPossessed(selectedNode.label)
                  ? '✓ In Your CV'
                  : isMissing(selectedNode.label)
                  ? '⚠ Critical Gap'
                  : 'Pathway Step'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 font-heading mt-1.5">
              {selectedNode.label}
            </h3>

            <div className="mt-2.5 flex items-center gap-2">
              <span className="rounded-md bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-semibold">
                {selectedNode.category.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Clock className="h-3 w-3" />
                <span>~{selectedNode.hours} Hours Learning</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-1">Curriculum Scope & Competencies:</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedNode.description}
            </p>
          </div>

          {/* Prerequisites */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-1.5">Direct Prerequisites:</h4>
            {selectedNode.prerequisites.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.prerequisites.map((pId) => {
                  const prereqNode = activeTrack.nodes.find((n) => n.id === pId);
                  return (
                    <button
                      key={pId}
                      onClick={() => setSelectedNodeId(pId)}
                      className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition"
                    >
                      ← {prereqNode ? prereqNode.label : pId}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No prior technical prerequisites required (Entry Level Foundation).</p>
            )}
          </div>

          {/* Unlocks */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-1.5">Unlocks Downstream:</h4>
            {selectedNode.unlocks.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.unlocks.map((uId) => {
                  const unlockNode = activeTrack.nodes.find((n) => n.id === uId);
                  return (
                    <button
                      key={uId}
                      onClick={() => setSelectedNodeId(uId)}
                      className="rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 text-xs font-medium transition"
                    >
                      → {unlockNode ? unlockNode.label : uId}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Terminal advanced specialization or capstone project phase.</p>
            )}
          </div>

          {/* Applicable Career Roles */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-1.5">Applicable Career Roles:</h4>
            <div className="flex flex-wrap gap-1">
              {activeTrack.careerRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-md bg-blue-50 text-blue-700 px-2 py-0.5 text-[11px] font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="pt-2">
            <button
              onClick={onNavigateToAnalyzer}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <span>Analyze My CV Against This Pathway</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
