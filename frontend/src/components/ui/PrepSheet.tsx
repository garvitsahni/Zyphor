'use client';

import { X, Check } from 'lucide-react';

interface PrepSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: () => void;
    opportunity: any;
}

export function PrepSheet({ isOpen, onClose, onProceed, opportunity }: PrepSheetProps) {
    if (!isOpen || !opportunity) return null;

    const { title, fit } = opportunity;
    // Derive data from FitData matching the old PrepItem structure
    const qualifications = [
        { label: 'Baseline requirements met', done: fit.skillsMatched >= fit.skillsTotal * 0.6 },
        { label: `${fit.skillsMatched}/${fit.skillsTotal} core skills aligned`, done: fit.skillsMatched > 0 },
        ...(fit.missingSkills.length > 0
            ? [{ label: `Skill gap identified: ${fit.missingSkills.join(', ')}`, done: false }]
            : [{ label: 'All target skills covered', done: true }]
        ),
    ];

    const qualifiedCount = qualifications.filter(q => q.done).length;
    const allQualified = qualifiedCount === qualifications.length;

    const tips = [
        opportunity.insight || '',
        `Estimated review cycle: ${fit.prepTime}`,
        opportunity.type === 'hackathon' ? 'Team formation recommended prior to kickoff.' : 'Customized application payload required.',
    ].filter(Boolean);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onClick={onClose}>
            <div
                className="w-full max-w-[480px] mx-4 rounded-[10px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--shadow-lg)] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-card)]">
                    <div>
                        <h2 className="text-[14px] font-semibold text-[var(--text-primary)] leading-snug">
                            Pre-Deployment Analysis
                        </h2>
                        <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                            Target: {title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-[4px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors duration-100 self-start mt-[-4px] mr-[-4px]"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Qualifications Check ── */}
                <div className="p-5">
                    <p className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em] mb-3">
                        Alignment Verification
                    </p>
                    <div className="space-y-[1px] bg-[var(--border)] rounded-[6px] overflow-hidden mb-4 border border-[var(--border)]">
                        {qualifications.map((q, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)]">
                                <div className="flex items-center justify-center w-3 h-3 flex-shrink-0">
                                    {q.done ? (
                                        <Check className="w-3.5 h-3.5 text-[var(--success)]" strokeWidth={3} />
                                    ) : (
                                        <div className="w-[4px] h-[4px] bg-[var(--warning)] rounded-full" />
                                    )}
                                </div>
                                <span className="text-[13px] text-[var(--text-secondary)]">{q.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6">
                        <p className={`text-[12px] ${allQualified ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
                            {allQualified
                                ? "System check clear. You meet all target requirements."
                                : `System check partial: ${qualifiedCount}/${qualifications.length} checks passed. Proceeding carries moderate risk.`
                            }
                        </p>
                    </div>

                    {/* ── Telemetry / Tips ── */}
                    {tips.length > 0 && (
                        <div className="mb-6">
                            <p className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em] mb-2">
                                Execution Directives
                            </p>
                            <ul className="space-y-1.5 list-none">
                                {tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-[12px] text-[var(--text-secondary)] leading-relaxed">
                                        <span className="text-[var(--primary)] text-[10px] font-mono mt-[3px]">-</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* ── Actions ── */}
                <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--bg-card)] flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 text-[12px] font-medium border border-[var(--border)] text-[var(--text-secondary)] rounded-[6px] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-100"
                    >
                        Abort
                    </button>
                    <button
                        onClick={() => {
                            onProceed();
                            onClose(); // ensure it closes in all cases
                        }}
                        className="px-4 py-1.5 text-[12px] font-medium bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-[6px] hover:opacity-90 transition-opacity duration-100 flex items-center gap-1.5"
                    >
                        Initiate Application
                    </button>
                </div>
            </div>
        </div>
    );
}
