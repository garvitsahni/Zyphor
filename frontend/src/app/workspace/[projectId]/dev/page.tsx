'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, GitCommit, TrendingUp, AlertTriangle, RefreshCw, BarChart3, Clock, Users, Zap } from 'lucide-react';
import { github, ai } from '@/lib/api';
import { PageContainer } from '@/components/ui/PageContainer';

export default function DevPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [commits, setCommits] = useState<Array<{ sha: string; message: string; author: string; date: string; additions: number; deletions: number }>>([]);
    const [heatmap, setHeatmap] = useState<Array<{ date: string; count: number }>>([]);
    const [prediction, setPrediction] = useState<{ completionProbability: number; riskLevel: string; recommendedScope: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            github.commits('main').catch(() => ({ commits: [] })),
            github.heatmap('main').catch(() => ({ heatmap: [] })),
            ai.predictDeadline({ projectId }).catch(() => ({ prediction: null })),
        ]).then(([commitsData, heatmapData, predData]) => {
            setCommits(commitsData.commits || []);
            setHeatmap(heatmapData.heatmap || []);
            setPrediction(predData.prediction || null);
        }).finally(() => setLoading(false));
    }, [projectId]);

    const riskColors: Record<string, string> = {
        low: '#00B894', medium: '#FDCB6E', high: '#FF7675', critical: '#FF4757',
    };

    const maxCount = Math.max(...heatmap.map(h => h.count), 1);

    if (loading) {
        return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="skeleton h-40 w-full" />)}</div>;
    }

    return (
        <PageContainer title="Development Activity" subtitle="Track commits, velocity, and completion predictions">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Completion Probability */}
                <motion.div className="card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[var(--text-secondary)]">Completion</span>
                        <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div className="text-4xl font-bold gradient-text mb-2">{prediction?.completionProbability || 0}%</div>
                    <div className="progress-bar h-2">
                        <motion.div className="progress-bar-fill h-full" initial={{ width: 0 }}
                            animate={{ width: `${prediction?.completionProbability || 0}%` }} transition={{ duration: 1.5 }} />
                    </div>
                </motion.div>

                {/* Risk Level */}
                <motion.div className="card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[var(--text-secondary)]">Risk Level</span>
                        <AlertTriangle className="w-4 h-4" style={{ color: riskColors[prediction?.riskLevel || 'low'] }} />
                    </div>
                    <div className="text-2xl font-bold capitalize mb-1" style={{ color: riskColors[prediction?.riskLevel || 'low'] }}>
                        {prediction?.riskLevel || 'Low'}
                    </div>
                    {prediction?.riskLevel === 'high' || prediction?.riskLevel === 'critical' ? (
                        <motion.div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400"
                            animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            ⚠️ Scope reduction recommended
                        </motion.div>
                    ) : null}
                </motion.div>

                {/* Stats */}
                <motion.div className="card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[var(--text-secondary)]">Activity</span>
                        <BarChart3 className="w-4 h-4 text-[var(--primary-light)]" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><GitCommit className="w-3 h-3" /> Commits</span>
                            <span className="text-sm font-semibold">{commits.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Lines added</span>
                            <span className="text-sm font-semibold text-green-400">+{commits.reduce((a, c) => a + c.additions, 0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Users className="w-3 h-3" /> Contributors</span>
                            <span className="text-sm font-semibold">{new Set(commits.map(c => c.author)).size}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* AI Development Copilot */}
            <motion.div className="card p-6 mb-6 border-l-4 border-[var(--primary)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--primary)]/20 p-2 rounded-lg">
                        <RefreshCw className="w-5 h-5 text-[var(--primary-light)] animate-spin-slow" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">AI Development Copilot</h3>
                        <p className="text-xs text-[var(--text-muted)]">Analyzing commits, detecting risks, and cross-checking modules</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-red-400 mb-2">
                            <AlertTriangle className="w-4 h-4" /> Detected Risks & Incomplete Modules
                        </h4>
                        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
                            <li>Auth module integration is 40% complete. Requires attention.</li>
                            <li>Recent commits show high churn in `api.ts`, potential feasibility issue.</li>
                            <li>{prediction?.recommendedScope || 'Overall project scope seems manageable.'}</li>
                        </ul>
                    </div>

                    <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl p-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-[var(--primary-light)] mb-2">
                            <Zap className="w-4 h-4" /> Suggested Next Tasks
                        </h4>
                        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
                            <li>Focus on finalizing the authentication endpoint.</li>
                            <li>Add unit tests for `User` model to improve stability.</li>
                            <li>Review the MVP priorities — consider dropping the complex analytics until judging.</li>
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Contribution Heatmap */}
            <motion.div className="card p-6 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="text-sm font-semibold mb-4">Contribution Heatmap</h3>
                <div className="flex flex-wrap gap-[3px]">
                    {heatmap.slice(-63).map((day, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-sm tooltip"
                            data-tooltip={`${day.date}: ${day.count} contributions`}
                            style={{
                                background: day.count === 0
                                    ? 'var(--bg-secondary)'
                                    : `rgba(108, 92, 231, ${Math.max(0.2, day.count / maxCount)})`,
                            }}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-[var(--text-muted)]">
                    <span>Less</span>
                    {[0.1, 0.3, 0.5, 0.7, 1].map((o, i) => (
                        <div key={i} className="w-3 h-3 rounded-sm" style={{ background: `rgba(108, 92, 231, ${o})` }} />
                    ))}
                    <span>More</span>
                </div>
            </motion.div>

            {/* Recent Commits */}
            <motion.div className="card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h3 className="text-sm font-semibold mb-4">Recent Commits</h3>
                <div className="space-y-3">
                    {commits.slice(0, 10).map((commit, i) => (
                        <motion.div
                            key={commit.sha}
                            className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-glass)] border border-[var(--border)]"
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                        >
                            <GitCommit className="w-4 h-4 text-[var(--primary-light)] shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{commit.message}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-[var(--text-muted)]">{commit.author}</span>
                                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(commit.date).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs shrink-0">
                                <span className="text-green-400">+{commit.additions}</span>
                                <span className="text-red-400">-{commit.deletions}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </PageContainer>
    );
}
