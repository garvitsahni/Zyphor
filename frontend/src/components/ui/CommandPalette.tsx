'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Search, Brain, Target, GitBranch, Shield, MonitorPlay, Users,
    Activity, Plus, Sparkles, Command, ArrowRight
} from 'lucide-react';

interface CommandItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    action: () => void;
    section: string;
}

interface CommandPaletteProps {
    projectId?: string;
}

export function CommandPalette({ projectId }: CommandPaletteProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const commands: CommandItem[] = [
        // Navigation
        { id: 'dashboard', label: 'Go to Dashboard', icon: <Command className="w-4 h-4" />, action: () => router.push('/dashboard'), section: 'Navigation' },
        ...(projectId ? [
            { id: 'idea', label: 'Idea Validator', icon: <Brain className="w-4 h-4" />, action: () => router.push(`/workspace/${projectId}/idea`), section: 'Navigation' },
            { id: 'plan', label: 'Kanban & Roadmap', icon: <Target className="w-4 h-4" />, action: () => router.push(`/workspace/${projectId}/plan`), section: 'Navigation' },
            { id: 'dev', label: 'Development', icon: <GitBranch className="w-4 h-4" />, action: () => router.push(`/workspace/${projectId}/dev`), section: 'Navigation' },
            { id: 'judge', label: 'Judge Simulator', icon: <Shield className="w-4 h-4" />, action: () => router.push(`/workspace/${projectId}/judge`), section: 'Navigation' },
            { id: 'pitch', label: 'Pitch & Startup', icon: <MonitorPlay className="w-4 h-4" />, action: () => router.push(`/workspace/${projectId}/pitch`), section: 'Navigation' },
            { id: 'activity', label: 'Activity Feed', icon: <Activity className="w-4 h-4" />, action: () => router.push(`/workspace/${projectId}/activity`), section: 'Navigation' },
            { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" />, action: () => router.push(`/workspace/${projectId}/team`), section: 'Navigation' },
        ] : []),
        // Actions
        { id: 'new-project', label: 'Create New Project', icon: <Plus className="w-4 h-4" />, action: () => { router.push('/dashboard'); }, section: 'Actions' },
        { id: 'ai', label: 'Open AI Assistant', icon: <Sparkles className="w-4 h-4" />, action: () => { }, section: 'Actions' },
    ];

    const filtered = commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase())
    );

    const sections = [...new Set(filtered.map(c => c.section))];

    // Keyboard shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
                setQuery('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    // Arrow key navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && filtered[selectedIndex]) {
            filtered[selectedIndex].action();
            setOpen(false);
        }
    }, [filtered, selectedIndex]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[9998] flex items-start justify-center pt-[20vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

                    {/* Palette */}
                    <motion.div
                        className="relative w-full max-w-lg mx-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.15 }}
                    >
                        {/* Search */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                            <Search className="w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a command or search…"
                                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                            />
                            <kbd className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-primary)] px-1.5 py-0.5 rounded border border-[var(--border)]">ESC</kbd>
                        </div>

                        {/* Results */}
                        <div className="max-h-[300px] overflow-y-auto py-2">
                            {filtered.length === 0 ? (
                                <p className="text-sm text-[var(--text-muted)] text-center py-8">No commands found</p>
                            ) : (
                                sections.map(section => (
                                    <div key={section}>
                                        <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-1.5">{section}</p>
                                        {filtered.filter(c => c.section === section).map(cmd => {
                                            const globalIdx = filtered.indexOf(cmd);
                                            return (
                                                <button
                                                    key={cmd.id}
                                                    onClick={() => { cmd.action(); setOpen(false); }}
                                                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${globalIdx === selectedIndex
                                                            ? 'bg-[var(--primary)]/10 text-[var(--primary-light)]'
                                                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)]'
                                                        }`}
                                                >
                                                    <span className="opacity-60">{cmd.icon}</span>
                                                    <span className="flex-1 text-left">{cmd.label}</span>
                                                    {globalIdx === selectedIndex && <ArrowRight className="w-3 h-3 opacity-40" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
