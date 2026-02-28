'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Trophy,
    Code,
    Users,
    Rocket,
    LogOut,
    User,
    X,
    BookOpen,
    Briefcase,
    GraduationCap
} from 'lucide-react';
import { removeToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Opportunities', icon: Rocket, path: '/opportunities' },
    { label: 'Practice', icon: Code, path: '/practice' },
    { label: 'Mentorship', icon: Users, path: '/mentorship' },
    { label: 'Rewards', icon: Trophy, path: '/profile/rewards' },
];

const subItems = [
    { label: 'Research Papers', icon: BookOpen, path: '/opportunities?type=research' },
    { label: 'Jobs', icon: Briefcase, path: '/opportunities?type=job' },
    { label: 'Internships', icon: GraduationCap, path: '/opportunities?type=internship' },
];

interface GlobalSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GlobalSidebar({ isOpen, onClose }: GlobalSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        removeToken();
        router.push('/login');
    };

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar — sharp, structured */}
            <aside className={`fixed left-0 top-0 bottom-0 w-[260px] bg-[var(--bg-secondary)] border-r border-[var(--border)] z-50 flex flex-col transition-transform duration-200 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>

                {/* Header */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--border)]">
                    <span className="text-[15px] font-bold text-[var(--text-primary)] tracking-[-0.02em]">
                        Zyphor
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-[background,color] duration-150"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                    <div className="space-y-0.5">
                        <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.08em] px-3 mb-2">
                            Navigation
                        </p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-medium transition-[background,color] duration-150 ${isActive
                                        ? 'bg-[var(--primary-muted)] text-[var(--primary-light)]'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-[var(--primary)]' : ''}`} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Explore */}
                    <div className="space-y-0.5 pt-3 border-t border-[var(--border)]">
                        <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.08em] px-3 mb-2">
                            Explore
                        </p>
                        {subItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-medium text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-[background,color] duration-150"
                            >
                                <item.icon className="w-[16px] h-[16px]" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-[var(--border)] space-y-1">
                    <Link
                        href="/profile"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] hover:bg-[var(--bg-hover)] transition-[background] duration-150 group"
                    >
                        <div className="w-7 h-7 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">Profile</p>
                            <p className="text-[11px] text-[var(--text-muted)]">Settings & preferences</p>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-medium text-[var(--danger)] hover:bg-[rgba(239,68,68,0.08)] transition-[background] duration-150"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
