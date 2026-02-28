'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'active';
    padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ children, className, variant = 'default', padding = 'md' }: CardProps) {
    return (
        <div
            className={clsx(
                'rounded-[10px] border border-[var(--border)] transition-[border-color] duration-150',
                {
                    'bg-[var(--bg-card)]': variant === 'default',
                    'bg-[var(--bg-elevated)] shadow-[var(--shadow-md)]': variant === 'elevated',
                    'bg-[var(--bg-card)] border-[var(--primary)] shadow-[var(--shadow-glow)]': variant === 'active',
                },
                {
                    'p-4': padding === 'sm',
                    'p-5': padding === 'md',
                    'p-6': padding === 'lg',
                    'p-0': padding === 'none',
                },
                'hover:border-[var(--border-hover)]',
                className
            )}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={clsx('flex items-center justify-between mb-4', className)}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: ReactNode;
    className?: string;
    as?: 'h2' | 'h3' | 'h4';
}

export function CardTitle({ children, className, as: Tag = 'h3' }: CardTitleProps) {
    return (
        <Tag className={clsx('font-semibold text-[var(--text-primary)]', className)}>
            {children}
        </Tag>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return <div className={clsx(className)}>{children}</div>;
}
