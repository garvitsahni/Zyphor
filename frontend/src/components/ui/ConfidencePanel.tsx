'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, Clock, TrendingUp, Shield, Sparkles } from 'lucide-react';

interface FitData {
    skillsMatched: number;
    skillsTotal: number;
    missingSkills: string[];
    difficulty: 'Easy win' | 'Good stretch' | 'Bit challenging' | 'Real challenge';
    prepTime: string;
    selectionRate: 'High' | 'Good' | 'Moderate' | 'Competitive';
    verdict: 'Worth applying' | 'Strong match' | 'Start here' | 'Prepare first' | 'Stretch goal';
    verdictColor: string;
    reassurance: string;
}

interface ConfidencePanelProps {
    fit: FitData;
    compact?: boolean;
}

const verdictIcons: Record<string, typeof Check> = {
    'Worth applying': TrendingUp,
    'Strong match': Check,
    'Start here': Sparkles,
    'Prepare first': Clock,
    'Stretch goal': Shield,
};

export function ConfidencePanel({ fit, compact = false }: ConfidencePanelProps) {
    const [expanded, setExpanded] = useState(false);

    const VerdictIcon = verdictIcons[fit.verdict] || TrendingUp;
    const fillPct = Math.round((fit.skillsMatched / Math.max(fit.skillsTotal, 1)) * 100);

    // Color based on verdict
    const getVerdictStyle = () => {
        switch (fit.verdict) {
            case 'Strong match': return { bg: 'rgba(0,184,148,0.1)', border: 'rgba(0,184,148,0.3)', text: '#55EFC4' };
            case 'Worth applying': return { bg: 'rgba(0,206,201,0.1)', border: 'rgba(0,206,201,0.3)', text: '#00CEC9' };
            case 'Start here': return { bg: 'rgba(108,92,231,0.1)', border: 'rgba(108,92,231,0.3)', text: '#A29BFE' };
            case 'Prepare first': return { bg: 'rgba(253,203,110,0.1)', border: 'rgba(253,203,110,0.3)', text: '#FDCB6E' };
            case 'Stretch goal': return { bg: 'rgba(255,118,117,0.1)', border: 'rgba(255,118,117,0.3)', text: '#FF7675' };
            default: return { bg: 'rgba(0,206,201,0.1)', border: 'rgba(0,206,201,0.3)', text: '#00CEC9' };
        }
    };

    const style = getVerdictStyle();

    return (
        <div className="mt-3">
            {/* Verdict Badge + Toggle */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all hover:opacity-90"
                style={{ background: style.bg, border: `1px solid ${style.border}` }}
            >
                <div className="flex items-center gap-2">
                    <VerdictIcon className="w-3.5 h-3.5" style={{ color: style.text }} />
                    <span className="text-xs font-semibold" style={{ color: style.text }}>
                        {fit.verdict}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                        · {fit.skillsMatched}/{fit.skillsTotal} skills
                    </span>
                </div>
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </motion.div>
            </button>

            {/* Expanded Details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-2 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] space-y-3">
                            <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-[var(--primary-light)]" />
                                Your Fit
                            </h4>

                            {/* Skills Bar */}
                            <div>
                                <div className="flex items-center justify-between text-[10px] mb-1">
                                    <span className="text-[var(--text-muted)]">Skills matched</span>
                                    <span className="font-semibold text-[var(--text-primary)]">{fit.skillsMatched} / {fit.skillsTotal}</span>
                                </div>
                                <div className="h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, ${style.text}, var(--accent))` }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${fillPct}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>

                            {/* Missing Skills */}
                            {fit.missingSkills.length > 0 && (
                                <div>
                                    <span className="text-[10px] text-[var(--text-muted)]">Missing:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {fit.missingSkills.map(skill => (
                                            <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Facts */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 rounded-md bg-[var(--bg-primary)]">
                                    <p className="text-[10px] text-[var(--text-muted)]">Difficulty</p>
                                    <p className="text-xs font-semibold text-[var(--text-primary)]">{fit.difficulty}</p>
                                </div>
                                <div className="p-2 rounded-md bg-[var(--bg-primary)]">
                                    <p className="text-[10px] text-[var(--text-muted)]">Prep time</p>
                                    <p className="text-xs font-semibold text-[var(--text-primary)]">{fit.prepTime}</p>
                                </div>
                                <div className="col-span-2 p-2 rounded-md bg-[var(--bg-primary)]">
                                    <p className="text-[10px] text-[var(--text-muted)]">Selection rate for similar profiles</p>
                                    <p className="text-xs font-semibold text-[var(--text-primary)]">{fit.selectionRate}</p>
                                </div>
                            </div>

                            {/* Reassurance */}
                            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/10">
                                <Sparkles className="w-3.5 h-3.5 text-[var(--primary-light)] mt-0.5 flex-shrink-0" />
                                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                    {fit.reassurance}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
