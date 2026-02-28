'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import {
    Rocket, Star, GitBranch, Users, Code2, Target, Shield,
    ExternalLink, Award, BarChart3, Globe
} from 'lucide-react';
import { projects as projectsApi } from '@/lib/api';

interface PortfolioProject {
    _id: string;
    title: string;
    description: string;
    domain: string;
    problemStatement: string;
    solution: string;
    targetUsers: string;
    owner: { name: string; avatar: string; githubUsername: string };
    collaborators: Array<{ user: { name: string; avatar: string; githubUsername: string }; role: string }>;
    githubRepo: string;
    ideaValidation: {
        innovationScore: number;
        researchPapers?: Array<{ title: string; summary: string }>;
        considerations?: { noveltyGap: string };
    };
    judgeScores: {
        innovation: number; technicalComplexity: number; feasibility: number;
        realWorldImpact: number; presentationClarity: number; totalScore: number;
    };
}

const scoreLabels = [
    { key: 'innovation', label: 'Innovation', color: '#6C5CE7' },
    { key: 'technicalComplexity', label: 'Technical', color: '#00CEC9' },
    { key: 'feasibility', label: 'Feasibility', color: '#55EFC4' },
    { key: 'realWorldImpact', label: 'Impact', color: '#FDCB6E' },
    { key: 'presentationClarity', label: 'Presentation', color: '#FF7675' },
];

export default function PortfolioPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [project, setProject] = useState<PortfolioProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        projectsApi.portfolio(projectId)
            .then(data => setProject(data.project))
            .catch(() => setError('Portfolio not found or is private'))
            .finally(() => setLoading(false));
    }, [projectId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Rocket className="w-8 h-8 text-[var(--primary)]" />
                </motion.div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-12 text-center max-w-md">
                    <Globe className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Portfolio Not Available</h2>
                    <p className="text-sm text-[var(--text-secondary)]">{error || 'This project portfolio is not public.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-b from-[var(--primary)]/10 to-transparent border-b border-[var(--border)]">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Rocket className="w-5 h-5 text-[var(--primary)]" />
                            <span className="text-sm gradient-text font-semibold">Zyphra Portfolio</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3">{project.title}</h1>
                        <p className="text-lg text-[var(--text-secondary)] mb-4">{project.description}</p>
                        <div className="flex items-center gap-4 flex-wrap">
                            {project.domain && <span className="tag">{project.domain}</span>}
                            {project.githubRepo && (
                                <a href={project.githubRepo} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                                    <GitBranch className="w-4 h-4" /> Repository <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {/* Problem & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div className="glass-card p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-red-400" /> The Problem</h2>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.problemStatement || 'No problem statement provided.'}</p>
                    </motion.div>
                    <motion.div className="glass-card p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 className="font-semibold mb-3 flex items-center gap-2"><Code2 className="w-4 h-4 text-[var(--accent)]" /> The Solution</h2>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.solution || 'No solution description provided.'}</p>
                    </motion.div>
                </div>

                {/* Judge Score */}
                {project.judgeScores?.totalScore > 0 && (
                    <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold flex items-center gap-2"><Award className="w-4 h-4 text-[var(--warning)]" /> Judge Score</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold gradient-text">{project.judgeScores.totalScore}</span>
                                <span className="text-sm text-[var(--text-muted)]">/100</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {scoreLabels.map((s, i) => {
                                const value = project.judgeScores[s.key as keyof typeof project.judgeScores] as number;
                                return (
                                    <motion.div key={s.key} className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                                        <div className="flex justify-center mb-1">
                                            {[...Array(10)].map((_, j) => (
                                                <Star key={j} className="w-2.5 h-2.5" style={{ color: j < value ? s.color : 'var(--bg-secondary)' }} fill={j < value ? s.color : 'none'} />
                                            ))}
                                        </div>
                                        <p className="text-lg font-bold" style={{ color: s.color }}>{value}</p>
                                        <p className="text-[10px] text-[var(--text-muted)]">{s.label}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Research Backing */}
                {project.ideaValidation?.researchPapers && project.ideaValidation.researchPapers.length > 0 && (
                    <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                        <h2 className="font-semibold mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-[var(--accent)]" /> AI Research Backing</h2>
                        <div className="space-y-4">
                            {project.ideaValidation.considerations?.noveltyGap && (
                                <div className="p-4 bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/20">
                                    <h4 className="text-xs font-semibold text-[var(--primary-light)] mb-1 uppercase tracking-wider">Novelty Gap</h4>
                                    <p className="text-sm text-[var(--text-secondary)]">{project.ideaValidation.considerations.noveltyGap}</p>
                                </div>
                            )}
                            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Foundational Research</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.ideaValidation.researchPapers.map((paper, idx) => (
                                    <div key={idx} className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm">
                                        <h5 className="font-medium text-[var(--primary-light)] mb-2">{paper.title}</h5>
                                        <p className="text-xs text-[var(--text-secondary)]">{paper.summary}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Team */}
                <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 className="font-semibold mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Team</h2>
                    <div className="flex flex-wrap gap-3">
                        {project.collaborators?.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-glass)] border border-[var(--border)]">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-xs font-bold text-[var(--primary-light)]">
                                    {c.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{c.user?.name}</p>
                                    {c.user?.githubUsername && (
                                        <p className="text-xs text-[var(--text-muted)]">@{c.user.githubUsername}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer */}
                <div className="text-center py-6 text-xs text-[var(--text-muted)]">
                    Built with <Rocket className="w-3 h-3 inline text-[var(--primary)]" /> Zyphra
                </div>
            </div>
        </div>
    );
}
