'use client';

import { useState, use } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Presentation, Sparkles, RefreshCw, DollarSign, Users, Layers, ArrowRight, Mic, HelpCircle } from 'lucide-react';
import { ai } from '@/lib/api';
import { PageContainer } from '@/components/ui/PageContainer';

export default function PitchPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [tab, setTab] = useState<'presentation' | 'startup'>('presentation');
    const [presentation, setPresentation] = useState<{
        slides: Array<{ title: string; content: string; notes: string }>;
        speakingScript: string;
        demoFlow: Array<{ step: string; description: string }>;
        judgeQuestions: Array<{ question: string; answer: string }>;
    } | null>(null);
    const [startup, setStartup] = useState<{
        businessModel: string; targetCustomers: string; pricing: string; scalingRoadmap: string; futureFeatures: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const generatePresentation = async () => {
        setLoading(true);
        try {
            const data = await ai.generatePresentation({ projectId });
            setPresentation(data.presentation);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const generateStartup = async () => {
        setLoading(true);
        try {
            const data = await ai.generateStartup({ projectId });
            setStartup(data.startup);
        } catch { /* ignore */ }
        setLoading(false);
    };

    return (
        <PageContainer title="Pitch & Startup" subtitle="Generate presentation and startup conversion plan">

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6">
                {[
                    { key: 'presentation', label: 'Presentation', icon: Presentation },
                    { key: 'startup', label: 'Startup Plan', icon: TrendingUp },
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key as 'presentation' | 'startup')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-[var(--primary)]/15 text-[var(--primary-light)] border border-[var(--primary)]/30'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)]'
                            }`}>
                        <t.icon className="w-4 h-4" /> {t.label}
                    </button>
                ))}
            </div>

            {tab === 'presentation' ? (
                <div>
                    {!presentation ? (
                        <motion.div className="card p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Presentation className="w-16 h-16 text-[var(--primary)] mx-auto mb-4 opacity-30" />
                            <h3 className="text-lg font-semibold mb-2">Generate Your Pitch Deck</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-6">AI will create slides, speaking script, demo flow, and anticipate judge questions</p>
                            <button onClick={generatePresentation} className="btn-primary inline-flex items-center gap-2" disabled={loading}>
                                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                {loading ? 'Generating...' : 'Generate Presentation'}
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {/* Slides */}
                            <div className="space-y-4">
                                <h2 className="font-semibold flex items-center gap-2"><Layers className="w-4 h-4" /> Slides</h2>
                                {presentation.slides.map((slide, i) => (
                                    <motion.div key={i} className="card p-5"
                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 flex items-center justify-center text-sm font-bold text-[var(--primary-light)]">{i + 1}</span>
                                            <h3 className="font-semibold">{slide.title}</h3>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-2">{slide.content}</p>
                                        <p className="text-xs text-[var(--text-muted)] italic mt-2 p-2 rounded bg-[var(--bg-glass)]">💡 {slide.notes}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Speaking Script */}
                            <motion.div className="card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                <h2 className="font-semibold mb-3 flex items-center gap-2"><Mic className="w-4 h-4 text-[var(--accent)]" /> Speaking Script</h2>
                                <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap font-sans leading-relaxed">{presentation.speakingScript}</pre>
                            </motion.div>

                            {/* Demo Flow */}
                            <motion.div className="card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                                <h2 className="font-semibold mb-3">Demo Flow</h2>
                                <div className="space-y-3">
                                    {presentation.demoFlow.map((step, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[var(--primary)]/15 flex items-center justify-center text-xs font-bold text-[var(--primary-light)] shrink-0">{i + 1}</div>
                                            <div>
                                                <p className="text-sm font-medium">{step.step}</p>
                                                <p className="text-xs text-[var(--text-muted)]">{step.description}</p>
                                            </div>
                                            {i < presentation.demoFlow.length - 1 && <ArrowRight className="w-4 h-4 text-[var(--text-muted)] ml-auto" />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Judge Q&A */}
                            <motion.div className="card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                                <h2 className="font-semibold mb-3 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-[var(--warning)]" /> Anticipated Judge Questions</h2>
                                <div className="space-y-4">
                                    {presentation.judgeQuestions.map((qa, i) => (
                                        <div key={i} className="p-3 rounded-lg bg-[var(--bg-glass)] border border-[var(--border)]">
                                            <p className="text-sm font-medium mb-2">Q: {qa.question}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">A: {qa.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {!startup ? (
                        <motion.div className="card p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <TrendingUp className="w-16 h-16 text-[var(--accent)] mx-auto mb-4 opacity-30" />
                            <h3 className="text-lg font-semibold mb-2">Convert to Startup</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-6">Transform your hackathon project into a real business plan</p>
                            <button onClick={generateStartup} className="btn-primary inline-flex items-center gap-2" disabled={loading}>
                                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                {loading ? 'Generating...' : 'Generate Startup Plan'}
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Business Model', content: startup.businessModel, icon: Layers, color: '#6C5CE7' },
                                { title: 'Target Customers', content: startup.targetCustomers, icon: Users, color: '#00CEC9' },
                                { title: 'Pricing Strategy', content: startup.pricing, icon: DollarSign, color: '#FDCB6E' },
                                { title: 'Scaling Roadmap', content: startup.scalingRoadmap, icon: TrendingUp, color: '#55EFC4' },
                                { title: 'Future Features', content: startup.futureFeatures, icon: Sparkles, color: '#FF7675' },
                            ].map((section, i) => (
                                <motion.div key={section.title} className="card p-6"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${section.color}20` }}>
                                            <section.icon className="w-4 h-4" style={{ color: section.color }} />
                                        </div>
                                        <h3 className="font-semibold text-sm">{section.title}</h3>
                                    </div>
                                    <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap font-sans leading-relaxed">{section.content}</pre>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </PageContainer>
    );
}
