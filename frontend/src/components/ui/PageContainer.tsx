'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface PageContainerProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
}

export function PageContainer({ children, title, subtitle, action, className }: PageContainerProps) {
    return (
        <div className={clsx('max-w-[1400px] mx-auto px-6 py-6', className)}>
            {(title || action) && (
                <motion.div
                    className="flex items-start justify-between mb-6 gap-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div>
                        {title && <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>}
                        {subtitle && <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>}
                    </div>
                    {action && <div className="flex-shrink-0">{action}</div>}
                </motion.div>
            )}
            {children}
        </div>
    );
}
