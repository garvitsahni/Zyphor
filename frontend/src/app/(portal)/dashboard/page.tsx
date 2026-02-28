'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Plus, Zap, ArrowUpRight, Users, X,
    Circle, GitBranch
} from 'lucide-react';
import { projects as projectsApi, auth, getToken, removeToken } from '@/lib/api';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface Project {
    _id: string;
    title: string;
    description: string;
    domain: string;
    status: string;
    hackathonMode: boolean;
    collaborators: Array<{ user: { name: string; avatar: string } }>;
    updatedAt: string;
    ideaValidation?: { innovationScore: number };
    judgeScores?: { totalScore: number };
}

const statusConfig: Record<string, { label: string; dot: string }> = {
    idea: { label: 'Idea', dot: '#3B82F6' },
    planning: { label: 'Planning', dot: '#8B5CF6' },
    development: { label: 'Active', dot: '#22C55E' },
    judging: { label: 'Review', dot: '#F59E0B' },
    startup: { label: 'Shipped', dot: '#14B8A6' },
};

/* ═══════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════ */

export default function DashboardPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [projectList, setProjectList] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNew, setShowNew] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '', domain: '', hackathonMode: false });

    useEffect(() => {
        const token = getToken();
        if (!token) { router.push('/login'); return; }
        Promise.all([auth.me(), projectsApi.list()])
            .then(([, projData]) => {
                setProjectList(projData.projects || []);
            })
            .catch(() => { removeToken(); router.push('/login'); })
            .finally(() => setLoading(false));
    }, [router]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await projectsApi.create(newProject);
            setProjectList(prev => [data.project, ...prev]);
            setShowNew(false);
            setNewProject({ title: '', description: '', domain: '', hackathonMode: false });
            toast('Project created', 'success');
        } catch {
            toast('Failed to create project', 'error');
        }
    };

    const devCount = projectList.filter(p => p.status === 'development').length;
    const hackathonCount = projectList.filter(p => p.hackathonMode).length;
    const avgScore = projectList.length
        ? Math.round(projectList.reduce((a, p) => a + (p.judgeScores?.totalScore || 0), 0) / projectList.length)
        : 0;

    if (loading) return <PageSkeleton />;

    return (
        <div className="min-h-screen">
            <div className="max-w-[1100px] mx-auto px-6 py-6">

                {/* ═══ Header — minimal, tool-like ═══ */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-[15px] font-semibold text-[var(--text-secondary)]">
                        Dashboard
                    </h1>
                    <button
                        onClick={() => setShowNew(true)}
                        className="h-8 px-3 text-[12px] font-medium bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-[6px] hover:opacity-90 transition-opacity duration-100 flex items-center gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New Project
                    </button>
                </div>

                {/* ═══ System Status Bar ═══ */}
                <div className="grid grid-cols-4 gap-px bg-[var(--border)] rounded-[8px] overflow-hidden mb-6">
                    <StatusCell
                        label="Workspace"
                        value={`${projectList.length} project${projectList.length !== 1 ? 's' : ''}`}
                        sub={projectList.length > 0 ? 'Active' : 'Nothing created yet'}
                        dot={projectList.length > 0 ? '#22C55E' : '#6B7280'}
                    />
                    <StatusCell
                        label="Active Runs"
                        value={devCount > 0 ? `${devCount} running` : 'Idle'}
                        sub={devCount > 0 ? 'In progress' : 'No running builds'}
                        dot={devCount > 0 ? '#22C55E' : '#6B7280'}
                    />
                    <StatusCell
                        label="Execution Mode"
                        value={hackathonCount > 0 ? 'Sprint' : 'Standard'}
                        sub={hackathonCount > 0 ? `${hackathonCount} sprint${hackathonCount !== 1 ? 's' : ''} active` : 'No sprints'}
                        dot={hackathonCount > 0 ? '#F59E0B' : '#6B7280'}
                    />
                    <StatusCell
                        label="Evaluation Health"
                        value={avgScore > 0 ? `${avgScore} avg` : 'No data'}
                        sub={avgScore > 0 ? `Across ${projectList.length} projects` : 'No evaluations'}
                        dot={avgScore > 60 ? '#22C55E' : avgScore > 0 ? '#F59E0B' : '#6B7280'}
                    />
                </div>

                {/* ═══ Projects Section ═══ */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[13px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">
                        Projects
                    </h2>
                    {projectList.length > 0 && (
                        <span className="text-[12px] text-[var(--text-muted)]">
                            {projectList.length} total
                        </span>
                    )}
                </div>

                {projectList.length === 0 ? (
                    /* ── Empty: compact, left-aligned, not centered ── */
                    <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)]">
                        <div className="px-5 py-4 flex items-center justify-between">
                            <div>
                                <p className="text-[13px] text-[var(--text-secondary)] mb-0.5">
                                    No projects
                                </p>
                                <p className="text-[12px] text-[var(--text-muted)]">
                                    Create one to begin tracking work
                                </p>
                            </div>
                            <button
                                onClick={() => setShowNew(true)}
                                className="h-8 px-3 text-[12px] font-medium border border-[var(--border)] text-[var(--text-secondary)] rounded-[6px] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-[border-color,color] duration-100 flex items-center gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Create Project
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Project Table ── */
                    <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-[minmax(0,1fr)_120px_100px_80px_80px_40px] gap-4 px-5 py-2.5 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                            <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">Name</span>
                            <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">Status</span>
                            <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">Domain</span>
                            <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">Team</span>
                            <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">Score</span>
                            <span></span>
                        </div>

                        {/* Rows */}
                        {projectList.map((project) => {
                            const status = statusConfig[project.status] || statusConfig.idea;
                            return (
                                <Link
                                    key={project._id}
                                    href={`/workspace/${project._id}`}
                                    className="grid grid-cols-[minmax(0,1fr)_120px_100px_80px_80px_40px] gap-4 px-5 py-3 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-hover)] transition-[background] duration-100 group items-center"
                                >
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--primary-light)] transition-colors duration-100">
                                            {project.title}
                                        </p>
                                        {project.description && (
                                            <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Circle className="w-2 h-2 fill-current" style={{ color: status.dot }} />
                                        <span className="text-[12px] text-[var(--text-secondary)]">{status.label}</span>
                                        {project.hackathonMode && <Zap className="w-3 h-3 text-[var(--warning)]" />}
                                    </div>
                                    <span className="text-[12px] text-[var(--text-muted)] truncate">
                                        {project.domain || '—'}
                                    </span>
                                    <span className="text-[12px] text-[var(--text-muted)] flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {project.collaborators?.length || 1}
                                    </span>
                                    <span className="text-[12px] text-[var(--text-muted)]">
                                        {project.ideaValidation?.innovationScore || '—'}
                                    </span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ═══ Create Modal ═══ */}
            <AnimatePresence>
                {showNew && (
                    <div
                        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50"
                        onClick={() => setShowNew(false)}
                    >
                        <div
                            className="w-full max-w-[480px] mx-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[var(--shadow-lg)] overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
                                <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">New Project</h2>
                                <button
                                    onClick={() => setShowNew(false)}
                                    className="p-1 rounded-[4px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-[background,color] duration-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-5 space-y-4">
                                <Field label="Name" placeholder="e.g. traffic-optimizer" value={newProject.title}
                                    onChange={v => setNewProject(p => ({ ...p, title: v }))} required />
                                <div>
                                    <label className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em] mb-1.5 block">Description</label>
                                    <textarea
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[6px] px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none resize-none h-16 transition-[border-color] duration-100"
                                        placeholder="Optional description"
                                        value={newProject.description}
                                        onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))}
                                    />
                                </div>
                                <Field label="Domain" placeholder="e.g. HealthTech, FinTech" value={newProject.domain}
                                    onChange={v => setNewProject(p => ({ ...p, domain: v }))} />

                                <label className="flex items-center gap-2.5 cursor-pointer py-0.5">
                                    <input type="checkbox" className="sr-only peer" checked={newProject.hackathonMode}
                                        onChange={e => setNewProject(p => ({ ...p, hackathonMode: e.target.checked }))} />
                                    <div className="w-8 h-[18px] rounded-full bg-[var(--bg-primary)] border border-[var(--border)] peer-checked:bg-[var(--primary)] peer-checked:border-[var(--primary)] transition-[background,border-color] duration-100 relative">
                                        <div className="w-3 h-3 rounded-full bg-[var(--text-muted)] peer-checked:bg-white absolute top-[2px] left-[2px] peer-checked:translate-x-[14px] transition-transform duration-100" />
                                    </div>
                                    <span className="text-[12px] text-[var(--text-secondary)] flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-[var(--warning)]" /> Sprint mode
                                    </span>
                                </label>

                                <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                                    <button type="button" onClick={() => setShowNew(false)}
                                        className="flex-1 h-8 text-[12px] font-medium border border-[var(--border)] text-[var(--text-secondary)] rounded-[6px] hover:border-[var(--border-hover)] transition-[border-color] duration-100">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        className="flex-1 h-8 text-[12px] font-medium bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-[6px] hover:opacity-90 transition-opacity duration-100 flex items-center justify-center gap-1.5">
                                        <Plus className="w-3.5 h-3.5" />
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════
   SYSTEM STATUS CELL
   ═══════════════════════════════════════════ */

function StatusCell({ label, value, sub, dot }: { label: string; value: string; sub: string; dot: string }) {
    return (
        <div className="bg-[var(--bg-card)] px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1.5">
                <Circle className="w-[6px] h-[6px] fill-current flex-shrink-0" style={{ color: dot }} />
                <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">{label}</span>
            </div>
            <p className="text-[13px] font-medium text-[var(--text-primary)] mb-0.5">{value}</p>
            <p className="text-[11px] text-[var(--text-muted)]">{sub}</p>
        </div>
    );
}

/* ═══════════════════════════════════════════
   FORM FIELD
   ═══════════════════════════════════════════ */

function Field({ label, placeholder, value, onChange, required = false }: {
    label: string; placeholder: string; value: string;
    onChange: (v: string) => void; required?: boolean;
}) {
    return (
        <div>
            <label className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em] mb-1.5 block">{label}</label>
            <input
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[6px] px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none transition-[border-color] duration-100"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                required={required}
            />
        </div>
    );
}
