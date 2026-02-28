'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket, Brain, Target, Shield, TrendingUp,
    GitBranch, Users, Activity, ChevronLeft, Zap, MessageSquare, X, Send,
    ArrowRight, Sparkles
} from 'lucide-react';
import { projects as projectsApi, ai, getToken, removeToken } from '@/lib/api';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { PageSkeleton } from '@/components/ui/Skeleton';

interface Project {
    _id: string;
    title: string;
    status: string;
    hackathonMode: boolean;
    collaborators: Array<{ user: { _id: string; name: string; avatar: string } }>;
}

const stages = [
    { key: 'idea', label: 'Idea', icon: Brain, path: '/idea' },
    { key: 'planning', label: 'Plan', icon: Target, path: '/plan' },
    { key: 'development', label: 'Dev', icon: GitBranch, path: '/dev' },
    { key: 'judging', label: 'Judge', icon: Shield, path: '/judge' },
    { key: 'startup', label: 'Startup', icon: TrendingUp, path: '/pitch' },
];

const navItems = [
    { label: 'Idea Validator', icon: Brain, path: '/idea' },
    { label: 'Kanban & Roadmap', icon: Target, path: '/plan' },
    { label: 'Development', icon: GitBranch, path: '/dev' },
    { label: 'Judge Simulator', icon: Shield, path: '/judge' },
    { label: 'Pitch & Startup', icon: TrendingUp, path: '/pitch' },
    { label: 'Activity', icon: Activity, path: '/activity' },
    { label: 'Team', icon: Users, path: '/team' },
];

export default function WorkspaceLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = use(params);
    const pathname = usePathname();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [aiOpen, setAiOpen] = useState(false);
    const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [aiInput, setAiInput] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (!token) { router.push('/login'); return; }
        projectsApi.get(projectId)
            .then(data => setProject(data.project))
            .catch(() => router.push('/dashboard'));
    }, [projectId, router]);

    const currentStageIndex = stages.findIndex(s => project?.status === s.key);

    const sendAiMessage = async () => {
        if (!aiInput.trim()) return;
        const userMsg = aiInput;
        setAiMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setAiInput('');
        setAiLoading(true);
        try {
            const data = await ai.chat({ projectId, message: userMsg, context: pathname });
            setAiMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch {
            setAiMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        }
        setAiLoading(false);
    };

    if (!project) {
        return <PageSkeleton />;
    }

    return (
        <div className="min-h-screen flex">
            {/* ─── Sidebar ─── */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-r border-[var(--border)] z-40 flex flex-col">
                {/* Project Header */}
                <div className="p-4 border-b border-[var(--border)]">
                    <div className="flex items-center justify-between mb-3">
                        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                            <ChevronLeft className="w-4 h-4" /> Hub
                        </Link>
                        <div className="px-2 py-0.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[10px] font-bold text-[var(--primary-light)]">WORKSPACE</div>
                    </div>
                    <h2 className="font-semibold text-sm truncate" title={project.title}>{project.title}</h2>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: '#6C5CE7' }} />
                        <span className="text-xs text-[var(--text-muted)] capitalize">{project.status}</span>
                        {project.hackathonMode && <Zap className="w-3 h-3 text-[var(--warning)]" />}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map(item => {
                        const isActive = pathname.endsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                href={`/workspace/${projectId}${item.path}`}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                                    ? 'bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/20'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* AI Button */}
                <div className="p-3 border-t border-[var(--border)]">
                    <button
                        onClick={() => setAiOpen(true)}
                        className="w-full btn-primary text-sm flex items-center justify-center gap-2 py-2.5"
                    >
                        <Sparkles className="w-4 h-4" /> AI Assistant
                    </button>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <div className="flex-1 ml-64 min-w-0 flex flex-col min-h-screen">
                {/* Event Banner for Hackathon Mode */}
                {project.hackathonMode && (
                    <div className="bg-gradient-to-r from-[var(--primary)]/90 to-[var(--accent)]/90 text-white px-6 py-2 flex items-center justify-between shadow-md z-40 relative">
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 animate-pulse text-yellow-300" />
                            <span className="font-semibold text-sm tracking-wide shadow-sm">EVENT MODE ACTIVE</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-medium">
                            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                <Target className="w-4 h-4 text-emerald-300" />
                                <span>Focus: MVP Core</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm font-mono tracking-wider">
                                ⏱️ 36:12:45
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Timeline */}
                <div className="sticky top-0 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)] px-6 py-3">
                    <div className="flex items-center gap-2 max-w-[1400px] mx-auto">
                        {stages.map((stage, i) => (
                            <div key={stage.key} className="flex items-center gap-2">
                                <Link
                                    href={`/workspace/${projectId}${stage.path}`}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${i <= currentStageIndex
                                        ? 'bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30'
                                        : 'text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-hover)]'
                                        }`}
                                >
                                    <stage.icon className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{stage.label}</span>
                                </Link>
                                {i < stages.length - 1 && <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />}
                            </div>
                        ))}
                        <div className="ml-auto flex items-center gap-2 shrink-0">
                            <div className="progress-bar w-24 sm:w-32">
                                <div className="progress-bar-fill" style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }} />
                            </div>
                            <span className="text-xs text-[var(--text-muted)]">{Math.round(((currentStageIndex + 1) / stages.length) * 100)}%</span>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* ─── AI Slide-over Panel ─── */}
            <AnimatePresence>
                {aiOpen && (
                    <motion.div
                        className="fixed right-0 top-0 bottom-0 w-96 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-l border-[var(--border)] z-50 flex flex-col shadow-2xl"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                                <span className="font-semibold text-sm">AI Assistant</span>
                            </div>
                            <button onClick={() => setAiOpen(false)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {aiMessages.length === 0 && (
                                <div className="text-center py-8">
                                    <Sparkles className="w-10 h-10 text-[var(--primary)] mx-auto mb-3 opacity-40" />
                                    <p className="text-sm text-[var(--text-secondary)] mb-1">Ask me anything about your project</p>
                                    <p className="text-xs text-[var(--text-muted)] mb-4">I can help with roadmaps, code, risks, and more</p>
                                    <div className="space-y-2">
                                        {['Explain my roadmap', 'Detect project risks', 'Suggest next steps', 'Generate code snippet'].map(q => (
                                            <button key={q} onClick={() => setAiInput(q)}
                                                className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)] hover:bg-[var(--bg-glass)] transition-all">
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {aiMessages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className={`max-w-[85%] px-3 py-2.5 rounded-xl text-sm ${msg.role === 'user'
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)]'
                                        }`}>
                                        <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                                    </div>
                                </motion.div>
                            ))}
                            {aiLoading && (
                                <div className="flex justify-start">
                                    <div className="px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                                        <span className="flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" />
                                            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0.1s' }} />
                                            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-[var(--border)]">
                            <form onSubmit={e => { e.preventDefault(); sendAiMessage(); }} className="flex gap-2">
                                <input className="input-field text-sm flex-1" placeholder="Ask AI..." value={aiInput} onChange={e => setAiInput(e.target.value)} />
                                <button type="submit" className="btn-primary px-3" disabled={aiLoading}>
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Command Palette with project context */}
            <CommandPalette projectId={projectId} />
        </div>
    );
}
