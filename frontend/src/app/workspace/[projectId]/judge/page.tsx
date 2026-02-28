'use client';

import { useState, use } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Sparkles, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { ai } from '@/lib/api';
import { PageContainer } from '@/components/ui/PageContainer';

const scoreLabels = [
    { key: 'innovation', label: 'Innovation', color: '#6C5CE7' },
    { key: 'technicalComplexity', label: 'Technical Complexity', color: '#00CEC9' },
    { key: 'feasibility', label: 'Feasibility', color: '#55EFC4' },
    { key: 'realWorldImpact', label: 'Real World Impact', color: '#FDCB6E' },
    { key: 'presentationClarity', label: 'Presentation Clarity', color: '#FF7675' },
];

export default function JudgePage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [result, setResult] = useState<{
        innovation: number; technicalComplexity: number; feasibility: number;
        realWorldImpact: number; presentationClarity: number; totalScore: number;
        feedback: string; improvements: string[];
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const runSimulation = async () => {
        setLoading(true);
        try {
            const data = await ai.simulateJudge({ projectId });
            setResult(data.judgeResult);
        } catch { /* ignore */ }
        setLoading(false);
    };

    return (
        <PageContainer
            title="Judge Simulator"
            subtitle="Get scored before you present — fix weaknesses proactively"
            action={
                <button onClick={runSimulation} className="btn-primary text-sm flex items-center gap-2" disabled={loading}>
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? 'Evaluating...' : 'Run Judge Simulation'}
                </button>
            }
        >

            {!result ? (
                <motion.div className="card p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Shield className="w-16 h-16 text-[var(--primary)] mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-semibold mb-2">Ready to be judged?</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">Click the button above to simulate hackathon judging</p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {/* Total Score */}
                    <motion.div className="card p-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">Overall Score</p>
                        <motion.div
                            className="text-7xl font-bold gradient-text inline-block"
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 8, stiffness: 100 }}
                        >
                            {result.totalScore}
                        </motion.div>
                        <p className="text-lg text-[var(--text-muted)]">/100</p>
                        <div className="progress-bar mt-4 h-3 max-w-md mx-auto">
                            <motion.div className="progress-bar-fill h-full" initial={{ width: 0 }}
                                animate={{ width: `${result.totalScore}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} />
                        </div>
                    </motion.div>

                    {/* Individual Scores */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {scoreLabels.map((s, i) => {
                            const value = result[s.key as keyof typeof result] as number;
                            return (
                                <motion.div key={s.key} className="card p-4 text-center"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="flex justify-center mb-2">
                                        {[...Array(10)].map((_, j) => (
                                            <Star key={j} className="w-3 h-3" style={{ color: j < value ? s.color : 'var(--bg-secondary)' }}
                                                fill={j < value ? s.color : 'none'} />
                                        ))}
                                    </div>
                                    <motion.p className="text-2xl font-bold" style={{ color: s.color }}
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 + 0.3 }}>
                                        {value}/10
                                    </motion.p>
                                    <p className="text-xs text-[var(--text-muted)] mt-1">{s.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Feedback */}
                    <motion.div className="card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[var(--accent)]" /> Judge Feedback
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{result.feedback}</p>
                    </motion.div>

                    {/* Improvements */}
                    <motion.div className="card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-[var(--warning)]" /> Improvement Suggestions
                        </h3>
                        <ul className="space-y-3">
                            {result.improvements.map((imp, i) => (
                                <motion.li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-glass)] border border-[var(--border)] text-sm"
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                                    <Sparkles className="w-4 h-4 text-[var(--warning)] shrink-0 mt-0.5" />
                                    {imp}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Final Submission Section */}
                    <motion.div className="card p-8 mt-8 border border-[var(--primary)]/30 bg-[var(--primary)]/5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-[var(--primary-light)]" /> Readiness Score: {result.totalScore}%
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {result.totalScore >= 80 ? "Your project is looking great! You are ready to submit." : "Consider addressing the improvement suggestions above before submitting to maximize your chances of winning."}
                                </p>
                            </div>
                            <button
                                className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${result.totalScore >= 80 ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white hover:opacity-90' : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)]'}`}
                                onClick={() => {
                                    alert("Project submitted successfully to the Zyphra Opportunities Hub!");
                                    // In production: call api.submitProject({ projectId })
                                }}
                            >
                                Submit Final Project
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </PageContainer>
    );
}
