import React from 'react';
import {
  GraduationCap,
  Sparkles,
  FileText,
  MapPin,
  BarChart3,
  Briefcase,
  Share2,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { CVAnalysisResult } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  analysisResult: CVAnalysisResult | null;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  analysisResult,
  onOpenReportModal,
}) => {
  const navItems = [
    { id: 'overview', label: 'Home Overview', icon: GraduationCap },
    { id: 'analyzer', label: 'CV Analyzer', icon: FileText, badge: 'AI Core' },
    { id: 'roadmap', label: 'Roadmap & Projects', icon: MapPin },
    { id: 'college', label: 'College Analytics', icon: BarChart3 },
    { id: 'placement', label: 'Placement Portal', icon: Briefcase },
    { id: 'graph', label: 'Skill Graph', icon: Share2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => setActiveTab('overview')}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 shadow-md shadow-indigo-100">
            {/* Custom geometric bridge & cap SVG mark */}
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <path d="M8 21h8" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg sm:text-xl font-black tracking-tight text-slate-900">
                SKILL <span className="text-blue-600">BRIDGE</span>
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200/60 hidden sm:inline-block">
                AI Placement
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Header Button & Candidate Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {analysisResult ? (
            <div className="flex items-center gap-2">
              <button
                id="header-download-report-btn"
                onClick={onOpenReportModal}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download Report</span>
                <span className="sm:hidden">Report</span>
                <span className="ml-1 rounded bg-emerald-500 px-1.5 py-0.2 text-[10px] font-bold">
                  {analysisResult.matchScore}%
                </span>
              </button>
              <div
                id="header-candidate-role-badge"
                className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600"
              >
                <span className="text-slate-400">Target:</span>
                <span className="font-semibold text-slate-800">{analysisResult.targetRole}</span>
              </div>
            </div>
          ) : (
            <button
              id="header-analyze-cta-btn"
              onClick={() => setActiveTab('analyzer')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-200" />
              <span>Analyze CV</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 py-1 px-2 text-xs font-medium text-slate-700 focus:outline-none"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
