'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface SectionProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
}

export function Section({ children, title, subtitle, action, className }: SectionProps) {
    return (
        <div className={clsx('mb-8', className)}>
            {(title || action) && (
                <div className="flex items-center justify-between mb-4">
                    <div>
                        {title && <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>}
                        {subtitle && <p className="text-sm text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
