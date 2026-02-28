'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Flame, Code, Terminal, CheckCircle2, ChevronRight, Trophy, Circle } from 'lucide-react';
import { getToken } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { PageSkeleton } from '@/components/ui/Skeleton';

export default function PracticeHub() {
    const router = useRouter();
    const [challenges, setChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchChallenges = async () => {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }
            try {
                // Mocking fetch from '/api/practice'
                setChallenges([
                    {
                        _id: 'p1',
                        title: 'Two Sum',
                        difficulty: 'Easy',
                        category: 'Algorithms',
                        description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
                        points: 10,
                        submissionsCount: 15420,
                        successRate: 85,
                        completed: true
                    },
                    {
                        _id: 'p2',
                        title: 'LRU Cache Design',
                        difficulty: 'Medium',
                        category: 'System Design',
                        description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
                        points: 30,
                        submissionsCount: 8900,
                        successRate: 42,
                        completed: false
                    },
                    {
                        _id: 'p3',
                        title: 'Distributed Message Queue',
                        difficulty: 'Hard',
                        category: 'Architecture',
                        description: 'Design a highly available distributed message queue system similar to Kafka.',
                        points: 50,
                        submissionsCount: 2300,
                        successRate: 15,
                        completed: false
                    }
                ]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, [router]);

    const getDifficultyColor = (diff: string) => {
        if (diff === 'Easy') return '#22C55E';
        if (diff === 'Medium') return '#F59E0B';
        return '#EF4444';
    };

    /* ── Filtering logic ── */
    const filtered = challenges.filter(c => {
        const matchesSearch = !search ||
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase());

        const matchesDifficulty = !difficulty || c.difficulty === difficulty;
        const matchesCategory = !category || c.category === category;

        return matchesSearch && matchesDifficulty && matchesCategory;
    });

    /* ── Derive unique categories from data ── */
    const categories = [...new Set(challenges.map(c => c.category))];

    if (loading) return <PageSkeleton />;

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-[1100px] mx-auto px-6 py-6">

                {/* ═══ Header ═══ */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-[15px] font-semibold text-[var(--text-secondary)]">
                        Practice Hub
                    </h1>
                </div>

                {/* ═══ System Status Bar ═══ */}
                <div className="grid grid-cols-3 gap-px bg-[var(--border)] rounded-[8px] overflow-hidden mb-6">
                    <StatusCell
                        label="Evaluation Streak"
                        value="14 Days"
                        sub="Active right now"
                        dot="#F59E0B"
                    />
                    <StatusCell
                        label="Scenarios Passed"
                        value="84"
                        sub={`Out of ${challenges.length} available`}
                        dot="#22C55E"
                    />
                    <StatusCell
                        label="Reputation Points"
                        value="1,250"
                        sub="Top 5% bracket"
                        dot="#3B82F6"
                    />
                </div>

                {/* ═══ Filters ═══ */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[13px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">
                        Engineering Exercises
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Filter conceptually..."
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[6px] pl-9 pr-3 py-1.5 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none transition-[border-color] duration-100"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-[6px] px-3 py-1.5 text-[13px] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-[border-color] duration-100 min-w-[120px] appearance-none"
                            value={difficulty}
                            onChange={e => setDifficulty(e.target.value)}
                        >
                            <option value="">Difficulty: All</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        <select
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-[6px] px-3 py-1.5 text-[13px] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-[border-color] duration-100 min-w-[140px] appearance-none"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="">Domain: All</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ═══ Work Surface Grid ═══ */}
                <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                    <div className="grid grid-cols-[40px_minmax(0,1fr)_100px_90px_60px] gap-4 px-5 py-2.5 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                        <span></span>
                        <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">Specification</span>
                        <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">Load Weight</span>
                        <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">Pass Rate</span>
                        <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.05em]">Bounty</span>
                    </div>

                    <div className="divide-y divide-[var(--border)]">
                        {filtered.length === 0 ? (
                            <div className="px-5 py-8 text-center text-[13px] text-[var(--text-muted)]">
                                No exercises match filter payload
                            </div>
                        ) : (
                            filtered.map((challenge) => (
                                <Link
                                    key={challenge._id}
                                    href={`/practice/${challenge._id}`}
                                    className="grid grid-cols-[40px_minmax(0,1fr)_100px_90px_60px] gap-4 px-5 py-3 items-center hover:bg-[var(--bg-hover)] transition-[background] duration-100 group"
                                >
                                    <div className="flex justify-center">
                                        {challenge.completed ? (
                                            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                                        ) : (
                                            <div className="w-2.5 h-2.5 rounded-full border border-[var(--border-hover)] group-hover:border-[var(--text-muted)] transition-colors duration-100" />
                                        )}
                                    </div>
                                    <div className="min-w-0 pr-4">
                                        <p className="text-[13px] font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--primary-light)] transition-colors duration-100">
                                            {challenge.title}
                                        </p>
                                        <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                                            {challenge.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Circle className="w-[6px] h-[6px] fill-current" style={{ color: getDifficultyColor(challenge.difficulty) }} />
                                        <span className="text-[12px] text-[var(--text-secondary)]">{challenge.difficulty}</span>
                                    </div>
                                    <div className="text-[12px] text-[var(--text-muted)]">
                                        {challenge.successRate}%
                                    </div>
                                    <div className="text-[12px] font-mono text-[var(--primary-light)]">
                                        +{challenge.points}
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

            </div>
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
