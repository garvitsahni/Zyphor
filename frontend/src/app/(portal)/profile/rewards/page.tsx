'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Star, Shield, Download, ChevronRight, Zap, Globe } from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import Link from 'next/link';

export default function RewardsHub() {
    // Mock user gamification data based on the updated User model
    const userRewards = {
        name: 'Alex Developer',
        zyphorCoins: 2450,
        badges: [
            { id: 1, name: 'AI Pioneer', icon: 'Sparkles', color: 'text-purple-400', bg: 'bg-purple-500/20', earnedAt: '2023-10-15' },
            { id: 2, name: 'Top 10 Finisher', icon: 'Medal', color: 'text-yellow-400', bg: 'bg-yellow-500/20', earnedAt: '2023-11-02' },
            { id: 3, name: 'Web3 Innovator', icon: 'Globe', color: 'text-blue-400', bg: 'bg-blue-500/20', earnedAt: '2024-01-20' },
            { id: 4, name: '7-Day Streak', icon: 'Flame', color: 'text-orange-400', bg: 'bg-orange-500/20', earnedAt: '2024-02-18' }
        ],
        certificates: [
            { id: 'c1', title: 'Global AI Summit 2023 - Finalist', issuer: 'Zyphra Hackathons', date: 'Nov 2023' },
            { id: 'c2', title: 'Advanced React Patterns', issuer: 'Zyphra Learning', date: 'Jan 2024' }
        ]
    };

    const renderIcon = (iconName: string, className: string) => {
        switch (iconName) {
            case 'Sparkles': return <Star className={className} />;
            case 'Medal': return <Medal className={className} />;
            case 'Globe': return <Globe className={className} />;
            case 'Flame': return <Zap className={className} />;
            default: return <Shield className={className} />;
        }
    };

    return (
        <PageContainer title="Rewards & Achievements" subtitle="Track your Zyphor Coins, Badges, and Certificates">

            {/* Top Banner - Coins */}
            <motion.div className="card p-8 mb-10 overflow-hidden relative border-[var(--warning)]/30"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-[var(--text-secondary)] font-medium mb-2 uppercase tracking-wider flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" /> Total Balance
                        </p>
                        <h2 className="text-5xl font-bold gradient-text pb-2">{userRewards.zyphorCoins.toLocaleString()} <span className="text-2xl text-[var(--text-muted)] font-semibold">Coins</span></h2>
                        <p className="text-sm text-[var(--text-muted)] mt-2">Earn more by solving challenges and winning hackathons.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Link href="/practice" className="btn-secondary py-3 px-6 flex-1 md:flex-none justify-center whitespace-nowrap">Earn Coins</Link>
                        <button className="btn-primary py-3 px-6 flex-1 md:flex-none justify-center whitespace-nowrap shadow-[0_0_20px_rgba(108,92,231,0.3)]">Redeem Store</button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Badges Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2"><Award className="w-5 h-5 text-[var(--primary)]" /> My Badges</h3>
                        <span className="text-sm font-semibold text-[var(--text-muted)]">{userRewards.badges.length} Unlocked</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {userRewards.badges.map((badge, i) => (
                            <motion.div key={badge.id} className="card p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.1 }}>
                                <div className={`w-16 h-16 rounded-full ${badge.bg} flex items-center justify-center mb-3 shadow-inner`}>
                                    {renderIcon(badge.icon, `w-8 h-8 ${badge.color}`)}
                                </div>
                                <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                                <p className="text-[10px] text-[var(--text-muted)] uppercase">{new Date(badge.earnedAt).toLocaleDateString()}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Certificates Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" /> Certificates</h3>
                        <span className="text-sm font-semibold text-[var(--text-muted)]">{userRewards.certificates.length} Earned</span>
                    </div>

                    <div className="space-y-4">
                        {userRewards.certificates.map((cert, i) => (
                            <motion.div key={cert.id} className="card p-5 flex items-center gap-4 group cursor-pointer hover:border-[var(--primary)]/50 transition-colors"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                                <div className="w-12 h-12 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 border border-[var(--border)] group-hover:bg-[var(--primary)]/10 transition-colors">
                                    <Award className="w-6 h-6 text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-base truncate mb-1">{cert.title}</h4>
                                    <p className="text-xs text-[var(--text-secondary)]">Issued by <span className="font-semibold text-white">{cert.issuer}</span> • {cert.date}</p>
                                </div>
                                <button className="p-2 text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-secondary)] rounded-md transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    <Link href="/opportunities" className="mt-6 p-4 rounded-xl border border-dashed border-[var(--border)] text-center text-[var(--text-muted)] hover:text-white hover:border-[var(--text-muted)] transition-colors flex items-center justify-center gap-2 text-sm font-semibold block">
                        Join a Hackathon to earn more certifications <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </PageContainer>
    );
}
