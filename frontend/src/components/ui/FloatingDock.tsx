'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Rocket,
    Code,
    User,
    Menu
} from 'lucide-react';

interface FloatingDockProps {
    onMenuToggle: () => void;
}

export function FloatingDock({ onMenuToggle }: FloatingDockProps) {
    const pathname = usePathname();

    const dockItems = [
        { label: 'Menu', icon: Menu, onClick: onMenuToggle, isAction: true },
        { label: 'Dash', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Opps', icon: Rocket, path: '/opportunities' },
        { label: 'Practice', icon: Code, path: '/practice' },
        { label: 'Profile', icon: User, path: '/profile' },
    ];

    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] md:hidden">
            <div className="flex items-center gap-1 px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[12px] shadow-[var(--shadow-lg)]">
                {dockItems.map((item) => {
                    const isActive = item.path && (pathname === item.path || pathname.startsWith(item.path + '/'));

                    if (item.isAction) {
                        return (
                            <button
                                key={item.label}
                                onClick={item.onClick}
                                className="relative flex flex-col items-center justify-center w-12 h-10 rounded-[8px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-[background,color] duration-150"
                            >
                                <item.icon className="w-5 h-5 mb-0.5" />
                                <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.path!}
                            className={`relative flex flex-col items-center justify-center w-12 h-10 rounded-[8px] transition-[background,color] duration-150 ${isActive
                                ? 'text-[var(--primary)] bg-[var(--primary-muted)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mb-0.5" />
                            <span className="text-[9px] font-medium tracking-wide">{item.label}</span>

                            {isActive && (
                                <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[var(--primary)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
