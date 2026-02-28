'use client';

import clsx from 'clsx';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return <div className={clsx('skeleton', className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <div className={clsx('rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5', className)}>
            <div className="skeleton h-4 w-24 mb-3 rounded" />
            <div className="skeleton h-3 w-full mb-2 rounded" />
            <div className="skeleton h-3 w-3/4 rounded" />
        </div>
    );
}

export function SkeletonText({ lines = 3, className }: SkeletonProps & { lines?: number }) {
    return (
        <div className={clsx('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className={clsx('skeleton h-3 rounded', i === lines - 1 ? 'w-2/3' : 'w-full')} />
            ))}
        </div>
    );
}

export function SkeletonLine({ className }: SkeletonProps) {
    return <div className={clsx('skeleton h-3 w-full rounded', className)} />;
}

export function PageSkeleton() {
    return (
        <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
            <div className="skeleton h-8 w-48 rounded mb-2" />
            <div className="skeleton h-4 w-72 rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                        <div className="skeleton h-4 w-20 mb-4 rounded" />
                        <SkeletonText lines={4} />
                    </div>
                ))}
            </div>
        </div>
    );
}
