'use client';

import { ReactNode, useEffect, useState } from 'react';
import { GlobalSidebar } from '@/components/ui/GlobalSidebar';
import { FloatingDock } from '@/components/ui/FloatingDock';
import { User, Menu, Search, Command } from 'lucide-react';
import { getToken, auth, removeToken } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { PageSkeleton } from '@/components/ui/Skeleton';

export default function PortalLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        auth.me()
            .then(data => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => {
                removeToken();
                router.push('/login');
            });
    }, [router]);

    if (loading) {
        return <PageSkeleton />;
    }

    return (
        <div className="min-h-screen flex bg-[var(--bg-primary)]">
            <GlobalSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <FloatingDock onMenuToggle={() => setIsSidebarOpen(true)} />

            <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
                {/* Top Bar — structured, not floating */}
                <nav className="fixed top-0 right-0 left-0 z-30 border-b border-[var(--border)] bg-[var(--bg-primary)]">
                    <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
                        {/* Left: menu + identity */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-1.5 -ml-1.5 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-[background,color] duration-150"
                                aria-label="Open menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <span className="text-[15px] font-bold text-[var(--text-primary)] tracking-[-0.02em]">
                                Zyphor
                            </span>
                        </div>

                        {/* Center: command bar */}
                        <div className="hidden md:flex flex-1 max-w-[400px]">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search projects, teammates..."
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[8px] pl-9 pr-16 py-[7px] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none transition-[border-color] duration-150"
                                />
                                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-[4px] px-1.5 py-0.5 font-mono">
                                    Ctrl K
                                </kbd>
                            </div>
                        </div>

                        {/* Right: user */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
                                    <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                </div>
                                <span className="hidden md:inline text-[13px] font-medium text-[var(--text-secondary)]">
                                    {user?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-1 pt-14">
                    {children}
                </main>
            </div>
        </div>
    );
}
