'use client';

import { motion } from 'framer-motion';
import { Compass, Send, Star, Award, TrendingUp } from 'lucide-react';

interface MomentumTrackerProps {
    stage: 'exploring' | 'attempting' | 'shortlisted' | 'selected';
    stats: {
        explored: number;
        applied: number;
        shortlisted: number;
        selected: number;
    };
}

const stages = [
    { key: 'exploring', label: 'Exploring', icon: Compass, color: '#A29BFE' },
    { key: 'attempting', label: 'Attempting', icon: Send, color: '#00CEC9' },
    { key: 'shortlisted', label: 'Shortlisted', icon: Star, color: '#FDCB6E' },
    { key: 'selected', label: 'Selected', icon: Award, color: '#55EFC4' },
];

const encouragements: Record<string, string> = {
    exploring: "Great start — every journey begins here",
    attempting: "You're building momentum. Keep going!",
    shortlisted: "You're standing out. Almost there!",
    selected: "You made it! Time to aim higher.",
};

export function MomentumTracker({ stage, stats }: MomentumTrackerProps) {
    const currentIdx = stages.findIndex(s => s.key === stage);

    return (
        <div className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">Career Momentum</span>
                </div>
                <span className="text-xs text-[var(--text-muted)] italic">
                    {encouragements[stage]}
                </span>
            </div>

            {/* Stage Progress */}
            <div className="flex items-center gap-1">
                {stages.map((s, i) => {
                    const isActive = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    return (
                        <div key={s.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <motion.div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${isCurrent
                                        ? 'border-transparent shadow-[0_0_16px_rgba(108,92,231,0.4)]'
                                        : isActive
                                            ? 'border-transparent'
                                            : 'border-[var(--border)] bg-[var(--bg-secondary)]'
                                        }`}
                                    style={isActive ? { background: `${s.color}20`, borderColor: s.color } : {}}
                                    animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <s.icon className="w-4 h-4" style={{ color: isActive ? s.color : 'var(--text-muted)' }} />
                                </motion.div>
                                <span className={`text-[10px] mt-1.5 font-medium ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < stages.length - 1 && (
                                <div className="flex-shrink-0 w-full h-0.5 mx-1 rounded-full" style={{
                                    background: i < currentIdx
                                        ? `linear-gradient(90deg, ${stages[i].color}, ${stages[i + 1].color})`
                                        : 'var(--bg-secondary)'
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border)]">
                <div className="text-xs text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--text-primary)]">{stats.explored}</span> explored
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--text-primary)]">{stats.applied}</span> applied
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--text-primary)]">{stats.shortlisted}</span> shortlisted
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--accent)]">{stats.selected}</span> selected
                </div>
            </div>
        </div>
    );
}
