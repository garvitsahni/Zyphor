'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Search, MapPin, Clock, Trophy, ArrowRight,
    TrendingUp, Star, Zap, BookOpen, Users,
    Award, CheckCircle2, ChevronRight, Circle
} from 'lucide-react';
import { getToken } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { PrepSheet } from '@/components/ui/PrepSheet';
import { EventCard } from '@/components/ui/event-card';

/* ═══════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════ */

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

interface Opportunity {
    _id: string;
    title: string;
    type: string;
    description: string;
    domain: string;
    difficulty: string;
    duration: number;
    reward: string;
    mode: string;
    matchScore?: number;
    whyRecommended?: string;
    whyMatters?: string;
    riskReward?: string;
    effort?: string;
    fit: FitData;
    isRecommended?: boolean;
    isBestPick?: boolean;
    similarCount?: number;
    insight?: string;
}

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */

const mockOpportunities: Opportunity[] = [
    {
        _id: '1',
        title: 'Global AI Summit Hackathon',
        type: 'hackathon',
        description: 'Build the next generation of predictive AI agents in a 48-hour innovation sprint.',
        domain: 'AI',
        difficulty: 'advanced',
        duration: 48,
        reward: '$10,000',
        mode: 'hybrid',
        matchScore: 0.95,
        isRecommended: true,
        isBestPick: true,
        similarCount: 6,
        whyMatters: 'Directly aligns with your project experience in AI agents',
        riskReward: 'High reward, manageable commitment',
        effort: '1 weekend of focused work',
        insight: 'Teams with your skill profile win 40% more often',
        fit: {
            skillsMatched: 7, skillsTotal: 9,
            missingSkills: ['React Testing', 'Docker'],
            difficulty: 'Good stretch',
            prepTime: '3–5 hrs',
            selectionRate: 'High',
            verdict: 'Strong match',
            verdictColor: '#22C55E',
            reassurance: "You meet most requirements. Students at your level usually attempt 3 before getting selected — this could be your one."
        }
    },
    {
        _id: '2',
        title: 'ClimateTech Research Challenge',
        type: 'research',
        description: 'Solve critical issues in urban climate management using data-driven approaches.',
        domain: 'Climate',
        difficulty: 'intermediate',
        duration: 168,
        reward: '$5,000',
        mode: 'online',
        matchScore: 0.8,
        isRecommended: true,
        whyMatters: 'Growing field — early involvement builds unique credibility',
        riskReward: 'Medium commitment, high learning value',
        effort: '~1 week at your own pace',
        insight: 'Judges usually look for data storytelling over pure accuracy',
        fit: {
            skillsMatched: 5, skillsTotal: 7,
            missingSkills: ['Climate Modeling', 'R'],
            difficulty: 'Good stretch',
            prepTime: '5–8 hrs',
            selectionRate: 'Good',
            verdict: 'Worth applying',
            verdictColor: '#3B82F6',
            reassurance: "You won't be disqualified for lacking climate expertise — it's about the analytical approach."
        }
    },
    {
        _id: '3',
        title: 'Web3 DeFi Innovators',
        type: 'hackathon',
        description: 'Create decentralized finance solutions for the next billion users.',
        domain: 'Web3',
        difficulty: 'intermediate',
        duration: 72,
        reward: '$8,000',
        mode: 'online',
        whyMatters: 'Web3 experience is increasingly valued on resumes',
        riskReward: 'Large prize pool, moderate competition',
        effort: '3-day sprint',
        insight: 'Most winning teams focus on simplicity over technical complexity',
        fit: {
            skillsMatched: 4, skillsTotal: 8,
            missingSkills: ['Solidity', 'Smart Contracts'],
            difficulty: 'Bit challenging',
            prepTime: '10–15 hrs',
            selectionRate: 'Moderate',
            verdict: 'Prepare first',
            verdictColor: '#F59E0B',
            reassurance: "Preparation needed: moderate. Focus on learning Solidity basics — you already have the frontend skills."
        }
    },
    {
        _id: '4',
        title: 'Healthcare Automation Challenge',
        type: 'contest',
        description: 'Automate hospital workflows to improve patient outcomes through technology.',
        domain: 'Healthcare',
        difficulty: 'beginner',
        duration: 24,
        reward: '$2,000',
        mode: 'in-person',
        whyMatters: 'Perfect for building confidence with a low-stakes first competition',
        riskReward: 'Low risk, meaningful learning',
        effort: 'Just one day',
        insight: 'Most students fail here because they overthink the solution — keep it simple',
        fit: {
            skillsMatched: 6, skillsTotal: 6,
            missingSkills: [],
            difficulty: 'Easy win',
            prepTime: 'Minimal',
            selectionRate: 'High',
            verdict: 'Start here',
            verdictColor: '#3B82F6',
            reassurance: "You already qualify for everything. This is the ideal first competition to build your track record."
        }
    },
    {
        _id: '5',
        title: 'Zyphra SWE Internship',
        type: 'internship',
        description: 'Join the core team building advanced agentic systems for the future of work.',
        domain: 'AI',
        difficulty: 'intermediate',
        duration: 480,
        reward: 'Paid',
        mode: 'hybrid',
        whyMatters: 'Real-world product experience that strengthens any resume',
        riskReward: 'Time investment pays long-term career dividends',
        effort: '6-month commitment',
        insight: 'Winning teams often include members with both frontend and AI experience',
        fit: {
            skillsMatched: 5, skillsTotal: 7,
            missingSkills: ['System Design', 'LLM Fine-tuning'],
            difficulty: 'Good stretch',
            prepTime: '5–10 hrs for prep',
            selectionRate: 'Competitive',
            verdict: 'Worth applying',
            verdictColor: '#3B82F6',
            reassurance: "You meet most requirements. Your project background makes you stronger than many applicants."
        }
    }
];

/* ═══════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════ */

function getActionProps(opp: Opportunity) {
    if (opp.fit.verdict === 'Strong match' || opp.fit.verdict === 'Worth applying' || opp.fit.verdict === 'Start here') {
        return { label: 'Apply', isPrimary: true };
    }
    return { label: 'Review Needs', isPrimary: false };
}

function getVerdictColorProps(colorHex: string) {
    return { color: colorHex };
}

function formatDuration(hours: number): string {
    if (hours === 0) return 'Full-time';
    if (hours <= 24) return `${hours} hrs`;
    if (hours <= 168) return `${Math.round(hours / 24)}d`;
    return `${Math.round(hours / (24 * 30))}m`;
}

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════ */

function OpportunitiesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
    const [prepSheet, setPrepSheet] = useState<Opportunity | null>(null);

    // Sync URL params to filter state safely
    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam !== null) {
            setTypeFilter(typeParam);
        }
    }, [searchParams]);

    useEffect(() => {
        const token = getToken();
        if (!token) { router.push('/login'); return; }

        setTimeout(() => {
            setOpportunities(mockOpportunities);
            setLoading(false);
        }, 400); // Simulate network
    }, [router]);

    // Smart filtering
    const filtered = useMemo(() => {
        return opportunities.filter(opp => {
            const matchesSearch = !searchQuery ||
                opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                opp.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                opp.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = !typeFilter || opp.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [opportunities, searchQuery, typeFilter]);

    const recommended = filtered.filter(o => o.isRecommended);
    const others = filtered.filter(o => !o.isRecommended);

    const handleApply = (opp: Opportunity) => {
        setPrepSheet(opp);
    };

    const handleProceed = () => {
        // Mock successful application registration
        alert('Application registered successfully!');
        setPrepSheet(null);
    };

    if (loading) return <PageSkeleton />;

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-[1100px] mx-auto px-6 py-6">

                {/* ═══ Header ═══ */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-[15px] font-semibold text-[var(--text-secondary)]">
                        Opportunities Directory
                    </h1>
                </div>

                {/* ═══ System Status Bar ═══ */}
                <div className="grid grid-cols-4 gap-px bg-[var(--border)] rounded-[8px] overflow-hidden mb-6">
                    <StatusCell label="Active Pool" value={`${opportunities.length} Total`} sub="Currently open" dot="#22C55E" />
                    <StatusCell label="Matches Found" value={`${recommended.length} Matches`} sub="High probability" dot="#3B82F6" />
                    <StatusCell label="Pipeline" value="1 Submitted" sub="Awaiting review" dot="#F59E0B" />
                    <StatusCell label="Requirements" value="70% Ready" sub="Skills alignment" dot="#8B5CF6" />
                </div>

                {/* ═══ Search & Filters ═══ */}
                <div className="flex flex-col md:flex-row gap-2 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search directory..."
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[6px] pl-9 pr-3 py-1.5 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none transition-[border-color] duration-100"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-[6px] px-3 py-1.5 text-[13px] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-[border-color] duration-100 min-w-[140px] appearance-none"
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value)}
                        >
                            <option value="">Type: All</option>
                            <option value="hackathon">Hackathon</option>
                            <option value="internship">Internship</option>
                            <option value="research">Research</option>
                            <option value="contest">Contest</option>
                            <option value="job">Job</option>
                        </select>
                    </div>
                </div>

                {/* ═══ Target List ═══ */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[13px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">
                        Found Matches
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-[13px] text-[var(--text-muted)] border border-[var(--border)] rounded-[8px] bg-[var(--bg-card)]">
                            No entries match criteria.
                        </div>
                    ) : (
                        // Render recommended then others
                        [...recommended, ...others].map((opp, i) => {
                            const action = getActionProps(opp);
                            const fallbackImages: Record<string, string> = {
                                'hackathon': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
                                'research': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop',
                                'internship': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
                                'contest': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop'
                            };

                            // Deterministic mock date string based on index
                            const dateStr = `2026-0${(i % 5) + 4}-${10 + (i * 3)}T10:00:00`;

                            return (
                                <EventCard
                                    key={opp._id}
                                    heading={opp.type.toUpperCase()}
                                    description={opp.description}
                                    date={dateStr}
                                    imageUrl={fallbackImages[opp.type] || fallbackImages['hackathon']}
                                    imageAlt={opp.title}
                                    eventName={opp.title}
                                    location={opp.mode}
                                    time={formatDuration(opp.duration)}
                                    actionLabel={action.label}
                                    onActionClick={() => handleApply(opp)}
                                />
                            );
                        })
                    )}
                </div>

                {/* ═══ Details/Prep Modal ═══ */}
                {prepSheet && (
                    <PrepSheet
                        isOpen={!!prepSheet}
                        onClose={() => setPrepSheet(null)}
                        onProceed={handleProceed}
                        opportunity={prepSheet}
                    />
                )}
            </div>
        </div>
    );
}

export default function OpportunitiesHub() {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <OpportunitiesContent />
        </Suspense>
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
