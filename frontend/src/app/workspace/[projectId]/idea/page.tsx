'use client';

import { useState, use } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Lightbulb, ExternalLink, RefreshCw } from 'lucide-react';
import { ai } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageContainer } from '@/components/ui/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';

export default function IdeaPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [form, setForm] = useState({
        problemStatement: '', solution: '', domain: '', targetUsers: '',
    });
    const [result, setResult] = useState<{
        innovationScore: number;
        similarProjects: Array<{ name: string; similarity: number; url: string }>;
        improvedProblemStatement: string;
        suggestions: string[];
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await ai.validateIdea({ projectId, ...form });
            setResult(data.validation);
        } catch { /* ignore */ }
        setLoading(false);
    };

    return (
        <PageContainer title="Idea Validator" subtitle="AI analyzes uniqueness, finds similar projects, and refines your pitch">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Input Form */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Card>
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-[var(--warning)]" /> Your Idea
                        </h2>
                        <form onSubmit={handleValidate} className="space-y-4">
                            <div>
                                <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Problem Statement</label>
                                <textarea className="input-field resize-none h-24" placeholder="What problem are you solving?"
                                    value={form.problemStatement} onChange={e => setForm(p => ({ ...p, problemStatement: e.target.value }))} required />
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Solution</label>
                                <textarea className="input-field resize-none h-20" placeholder="How does your solution work?"
                                    value={form.solution} onChange={e => setForm(p => ({ ...p, solution: e.target.value }))} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Domain</label>
                                    <input className="input-field" placeholder="e.g. EdTech" value={form.domain}
                                        onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Target Users</label>
                                    <input className="input-field" placeholder="e.g. Students" value={form.targetUsers}
                                        onChange={e => setForm(p => ({ ...p, targetUsers: e.target.value }))} />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
                                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                {loading ? 'Analyzing...' : 'Validate Idea'}
                            </button>
                        </form>
                    </Card>
                </motion.div>

                {/* Results */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    {!result ? (
                        <EmptyState
                            icon={<Brain className="w-12 h-12" />}
                            title="Results will appear here"
                            description="Fill in your idea details and click Validate to get AI-powered analysis"
                            className="min-h-[400px]"
                        />
                    ) : (
                        <div className="space-y-4">
                            {/* Innovation Score */}
                            <Card>
                                <h3 className="text-sm text-[var(--text-secondary)] mb-3">Innovation Score</h3>
                                <div className="flex items-end gap-3">
                                    <motion.span className="text-5xl font-bold gradient-text"
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
                                        {result.innovationScore}
                                    </motion.span>
                                    <span className="text-lg text-[var(--text-muted)] mb-1">/100</span>
                                </div>
                                <div className="progress-bar mt-3 h-2">
                                    <motion.div className="progress-bar-fill h-full"
                                        initial={{ width: 0 }} animate={{ width: `${result.innovationScore}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }} />
                                </div>
                            </Card>

                            {/* Similar Projects */}
                            <Card>
                                <h3 className="text-sm text-[var(--text-secondary)] mb-3">Similar Projects Found</h3>
                                <div className="space-y-2">
                                    {result.similarProjects.map((p, i) => (
                                        <motion.div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-glass)] border border-[var(--border)]"
                                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                            <span className="text-sm font-medium">{p.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="tag text-xs">{p.similarity}% similar</span>
                                                <a href={p.url} target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--primary-light)]">
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>

                            {/* Suggestions */}
                            <Card>
                                <h3 className="text-sm text-[var(--text-secondary)] mb-3">AI Suggestions</h3>
                                <ul className="space-y-2">
                                    {result.suggestions.map((s, i) => (
                                        <motion.li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)]"
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                                            <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                                            {s}
                                        </motion.li>
                                    ))}
                                </ul>
                            </Card>

                            {/* Improved Statement */}
                            <Card>
                                <h3 className="text-sm text-[var(--text-secondary)] mb-3">Improved Problem Statement</h3>
                                <p className="text-sm text-[var(--text-primary)] leading-relaxed">{result.improvedProblemStatement}</p>
                            </Card>
                        </div>
                    )}
                </motion.div>
            </div>
        </PageContainer>
    );
}
