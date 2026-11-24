import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Trash2,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Globe,
  ExternalLink,
  Cpu,
  Compass,
  Briefcase,
  Zap,
  Search,
} from 'lucide-react';
import { CVAnalysisResult } from '../types';

type ChatRoleId = 'mentor' | 'architect' | 'coach' | 'fast' | 'researcher';

interface GroundingSource {
  title: string;
  uri: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  roleId?: ChatRoleId;
  modelUsed?: string;
  groundedWithSearch?: boolean;
  sources?: GroundingSource[];
  suggestedTab?: string;
  suggestedActionLabel?: string;
  isError?: boolean;
  retryPrompt?: string;
}

interface AIChatBotProps {
  currentResult: CVAnalysisResult | null;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenReportModal?: () => void;
}

interface RoleOption {
  id: ChatRoleId;
  label: string;
  shortDesc: string;
  modelLabel: string;
  icon: React.ReactNode;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'mentor',
    label: 'Career Mentor',
    shortDesc: 'Balanced skill-gap, roadmap & ₹ internship guidance',
    modelLabel: 'Gemini 4 Hydrogen',
    icon: <Compass className="h-3.5 w-3.5" />,
  },
  {
    id: 'architect',
    label: 'Deep Strategist',
    shortDesc: 'High-reasoning project architecture & technical trade-offs',
    modelLabel: 'Gemini 4 Hydrogen · XHigh Thinking',
    icon: <Cpu className="h-3.5 w-3.5" />,
  },
  {
    id: 'coach',
    label: 'Interview Coach',
    shortDesc: 'Mock interviews, STAR feedback & resume bullet upgrades',
    modelLabel: 'Gemini 4 Hydrogen · High Thinking',
    icon: <Briefcase className="h-3.5 w-3.5" />,
  },
  {
    id: 'fast',
    label: 'Fast Help',
    shortDesc: 'Instant UI navigation & upload troubleshooting',
    modelLabel: 'Gemini 3.1 Flash-Lite',
    icon: <Zap className="h-3.5 w-3.5" />,
  },
  {
    id: 'researcher',
    label: 'Web Researcher',
    shortDesc: 'Live Google Search for hiring trends, ₹ stipends & docs',
    modelLabel: 'Gemini 4 Hydrogen · Search',
    icon: <Search className="h-3.5 w-3.5" />,
  },
];

const STARTER_PROMPTS: Record<ChatRoleId, string[]> = {
  mentor: [
    'How can I bridge my missing skills?',
    'Explain paid internships in Rupees (₹)',
    'Which capstone project should I build?',
  ],
  architect: [
    'Design an end-to-end capstone architecture for my target role',
    'How do my missing skills connect in production systems?',
    'What tech stack trade-offs should I explain in interviews?',
  ],
  coach: [
    'Start a 3-question mock interview for my target role',
    'Help me rewrite my project bullets using STAR impact metrics',
    'What tough questions will recruiters ask about my skill gaps?',
  ],
  fast: [
    'How do I fix resume upload issues?',
    'Where can I download my PDF report?',
    'How do the 14 Skill Graph pathways work?',
  ],
  researcher: [
    'Latest 2026 Indian internship stipends (₹) for my target role',
    'Most in-demand tools recruiters want right now',
    'Best free official courses for my missing skills',
  ],
};

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sb-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({
  currentResult,
  activeTab,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ChatRoleId>('mentor');
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);

  const sessionIdRef = useRef<string>(createSessionId());
  const pendingResetRef = useRef<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      roleId: 'mentor',
      text: `Hello! I am your **SkillBridge AI Assistant** with multi-turn memory, selectable specialist roles, and live **Google Search Grounding**.

Choose a mode above (**Career Mentor**, **Deep Strategist**, **Interview Coach**, **Fast Help**, or **Web Researcher**) or toggle **Web Search** anytime to get real-time cited answers. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeRoleOption = ROLE_OPTIONS.find((r) => r.id === selectedRole) || ROLE_OPTIONS[0];
  const effectiveSearchEnabled = selectedRole === 'researcher' || useSearchGrounding;

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string, isRetry = false) => {
    const query = (textToSend ?? inputMessage).trim();
    if (!query || isLoading) return;

    // Exclude prior error bubbles when retrying or continuing
    const cleanedExisting = messages.filter((m) => !m.isError);

    // History sent to backend MUST only include turns BEFORE the current query
    let priorMessages = cleanedExisting;
    if (isRetry && priorMessages.length > 0 && priorMessages[priorMessages.length - 1].role === 'user') {
      priorMessages = priorMessages.slice(0, -1);
    }

    const historyPayload = priorMessages
      .filter((m) => !m.id.startsWith('welcome-'))
      .slice(-10)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.text,
      }));

    if (isRetry) {
      setMessages(cleanedExisting);
    } else {
      const userMsgId = `user-${Date.now()}`;
      const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([
        ...cleanedExisting,
        {
          id: userMsgId,
          role: 'user',
          text: query,
          timestamp: userTimestamp,
        },
      ]);
      if (!textToSend) {
        setInputMessage('');
      }
    }

    setIsLoading(true);

    try {
      const chatContext = {
        activeTab,
        candidateName: currentResult?.candidateName,
        targetRole: currentResult?.targetRole,
        targetDomain: currentResult?.targetDomain,
        matchScore: currentResult?.matchScore,
        missingSkills: currentResult?.missingSkills?.map((s) => s.name),
        matchedSkills: currentResult?.matchedSkills?.map((s) => s.name),
      };

      const shouldReset = pendingResetRef.current;
      pendingResetRef.current = false;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          context: chatContext,
          sessionId: sessionIdRef.current,
          roleId: selectedRole,
          useSearchGrounding: effectiveSearchEnabled,
          resetSession: shouldReset,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `Request failed with HTTP ${response.status}`);
      }

      const botReply = data.reply || 'I am here to help. Could you please rephrase your question?';

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleId: (data.roleId as ChatRoleId) || selectedRole,
          modelUsed: data.modelUsed,
          groundedWithSearch: Boolean(data.groundedWithSearch),
          sources: Array.isArray(data.sources) ? data.sources : [],
          suggestedTab: data.suggestedTab,
          suggestedActionLabel: data.suggestedActionLabel,
        },
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          text: err?.message || 'Unable to reach the AI service right now. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          retryPrompt: query,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    sessionIdRef.current = createSessionId();
    pendingResetRef.current = true;
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        roleId: selectedRole,
        text: `Started a fresh conversation in **${activeRoleOption.label}** mode. Ask me anything about your resume, skill gaps, projects, or live hiring insights.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-indigo-700"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={idx}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 underline decoration-blue-300 hover:text-blue-800"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }

      if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
        const headingText = trimmed.replace(/^#{2,3}\s+/, '');
        return (
          <h4 key={idx} className="mt-2.5 mb-1 text-[12px] font-bold text-slate-900">
            {renderInlineFormatting(headingText)}
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
          className={`${idx > 0 ? 'mt-1' : ''} ${
            isBullet ? 'pl-2 text-slate-700 leading-relaxed' : 'text-slate-700 leading-relaxed'
          }`}
        >
          {renderInlineFormatting(cleanLine)}
        </p>
      );
    });
  };

  const currentStarterPrompts = STARTER_PROMPTS[selectedRole] || STARTER_PROMPTS.mentor;

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/95 px-3.5 py-2 shadow-lg border border-slate-200 text-xs font-semibold text-slate-800 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span>Need help or live web insights? Ask AI</span>
          </div>

          <button
            id="ai-chatbot-open-trigger"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Open AI Chatbot"
          >
            <Bot className="h-7 w-7 transition-transform group-hover:rotate-6" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
              </span>
            )}
          </button>
        </div>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div
          id="ai-chatbot-window"
          className={`fixed bottom-5 right-5 z-50 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'h-16 w-80'
              : 'h-[620px] max-h-[calc(100vh-3.5rem)] w-[390px] sm:w-[450px] max-w-[calc(100vw-2rem)]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-xs sm:text-sm font-bold tracking-tight truncate">
                    SkillBridge AI Assistant
                  </h3>
                  <span className="text-[10px] font-semibold text-sky-300 shrink-0">
                    · {activeRoleOption.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium truncate">
                  {currentResult
                    ? `${currentResult.targetRole} (${currentResult.matchScore}% match)`
                    : activeRoleOption.shortDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300 shrink-0">
              <button
                onClick={handleClearChat}
                className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition"
                title="Start new conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Role Selector & Search Grounding Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 space-y-2">
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
                  {ROLE_OPTIONS.map((role) => {
                    const isActive = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        title={role.shortDesc}
                        className={`flex items-center gap-1 shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition border ${
                          isActive
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {role.icon}
                        <span>{role.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px] px-0.5">
                  <div className="flex items-center gap-1.5 text-slate-600 truncate">
                    {currentResult ? (
                      <>
                        <Sparkles className="h-3 w-3 text-blue-600 shrink-0" />
                        <span className="truncate font-medium">
                          {currentResult.candidateName} · {currentResult.missingSkills.length} gaps tracked
                        </span>
                      </>
                    ) : (
                      <span className="truncate text-slate-500">{activeRoleOption.shortDesc}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={selectedRole === 'researcher'}
                    onClick={() => setUseSearchGrounding((prev) => !prev)}
                    title={
                      selectedRole === 'researcher'
                        ? 'Google Search Grounding is always active in Web Researcher mode'
                        : 'Toggle live Google Search Grounding for citations'
                    }
                    className={`flex items-center gap-1 shrink-0 rounded-lg border px-2 py-1 text-[10px] font-bold transition ${
                      effectiveSearchEnabled
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700'
                    } ${selectedRole === 'researcher' ? 'opacity-90 cursor-default' : ''}`}
                  >
                    <Globe className="h-3 w-3" />
                    <span>{effectiveSearchEnabled ? 'Search On' : 'Web Search'}</span>
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white shadow-xs mt-0.5 ${
                          msg.isError ? 'bg-red-600' : 'bg-blue-600'
                        }`}
                      >
                        {msg.isError ? <AlertCircle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                    )}

                    <div className="max-w-[85%] space-y-1.5">
                      <div
                        className={`rounded-2xl p-3.5 shadow-2xs ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                            : msg.isError
                              ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-none'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          msg.isError ? (
                            <div className="space-y-2.5 text-[12px]">
                              <p className="font-medium text-red-900 leading-relaxed">{msg.text}</p>
                              {msg.retryPrompt && (
                                <button
                                  type="button"
                                  onClick={() => handleSendMessage(msg.retryPrompt, true)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-red-700 transition"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  <span>Retry Request</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="text-[12px]">{renderFormattedText(msg.text)}</div>
                          )
                        ) : (
                          <p className="text-[12px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        )}

                        {/* Verified Google Search Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              <Globe className="h-3 w-3 text-blue-600" />
                              <span>Google Search Sources</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              {msg.sources.map((src, sIdx) => (
                                <a
                                  key={`${src.uri}-${sIdx}`}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 text-[11px] font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition"
                                >
                                  <span className="truncate">{src.title}</span>
                                  <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Suggestion / Navigation Action */}
                        {msg.suggestedTab && !msg.isError && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => onNavigateTab(msg.suggestedTab!)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-2xs"
                            >
                              <span>{msg.suggestedActionLabel || `Go to ${msg.suggestedTab}`}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Clean typographic metadata row */}
                      <div
                        className={`flex items-center gap-1.5 text-[10px] text-slate-400 ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {msg.role === 'assistant' && msg.modelUsed && (
                          <>
                            <span>·</span>
                            <span className="font-medium text-slate-500">{msg.modelUsed}</span>
                          </>
                        )}
                        {msg.role === 'assistant' && msg.groundedWithSearch && (
                          <>
                            <span>·</span>
                            <span className="font-semibold text-blue-600">Google Search</span>
                          </>
                        )}
                      </div>
                    </div>

                    {msg.role === 'user' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white shadow-xs mt-0.5">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs pl-9">
                    <div className="flex items-center gap-1.5 rounded-2xl bg-white border border-slate-200 px-3 py-2 shadow-2xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[11px] text-slate-500 font-medium ml-1">
                        {effectiveSearchEnabled ? 'Searching web & thinking...' : `${activeRoleOption.label} thinking...`}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Starter Prompt Quick Actions */}
              <div className="px-3 pt-2 pb-1.5 bg-white border-t border-slate-100 overflow-x-auto scrollbar-thin">
                <div className="flex items-center gap-1.5 text-[10px] whitespace-nowrap">
                  <span className="text-slate-400 font-bold uppercase tracking-wider mr-1">Prompts:</span>
                  {currentStarterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSendMessage(prompt)}
                      className="rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-2.5 py-1 text-slate-600 font-medium transition disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-slate-200"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Ask ${activeRoleOption.label}... (Enter to send)`}
                    disabled={isLoading}
                    className="flex-1 max-h-24 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 transition"
                    title="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-0.5">
                  <span>
                    {effectiveSearchEnabled && selectedRole === 'fast'
                      ? 'Gemini 4 Hydrogen + Google Search'
                      : activeRoleOption.modelLabel}
                  </span>
                  <span>Shift+Enter for new line</span>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
