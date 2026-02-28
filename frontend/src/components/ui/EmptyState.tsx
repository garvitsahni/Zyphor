'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <motion.div
            className={clsx(
                'flex flex-col items-center justify-center py-16 px-8 text-center',
                'rounded-xl border border-[var(--border)] border-dashed',
                'bg-[var(--bg-card)]/50',
                className
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="text-[var(--text-muted)] mb-4 opacity-50">
                {icon}
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-5">{description}</p>
            )}
            {action && <div>{action}</div>}
        </motion.div>
    );
}
