'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Activity as ActivityIcon, Clock, Brain, GitCommit, Target, Shield, Presentation, Users, TrendingUp } from 'lucide-react';
import { projects as projectsApi } from '@/lib/api';
import { PageContainer } from '@/components/ui/PageContainer';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';

const typeIcons: Record<string, typeof Brain> = {
    task_created: Target, task_moved: Target, task_completed: Target,
    member_joined: Users, idea_validated: Brain, judge_scored: Shield,
    commit_pushed: GitCommit, presentation_generated: Presentation,
    startup_plan_generated: TrendingUp, comment: ActivityIcon,
};

const typeColors: Record<string, string> = {
    task_created: '#00CEC9', task_moved: '#FDCB6E', task_completed: '#00B894',
    member_joined: '#6C5CE7', idea_validated: '#A29BFE', judge_scored: '#FF7675',
    commit_pushed: '#55EFC4', presentation_generated: '#6C5CE7',
    startup_plan_generated: '#00CEC9', comment: '#FDCB6E',
};

interface ActivityItem {
    _id: string;
    type: string;
    message: string;
    user: { name: string; avatar: string };
    createdAt: string;
}

export default function ActivityPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        projectsApi.activity(projectId)
            .then(data => setActivities(data.activities || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [projectId]);

    if (loading) {
        return (
            <PageContainer title="Activity Feed" subtitle="Real-time project events and updates">
                <div className="space-y-3">{[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}</div>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Activity Feed" subtitle="Real-time project events and updates">
            {activities.length === 0 ? (
                <EmptyState
                    icon={<ActivityIcon className="w-12 h-12" />}
                    title="No activity yet"
                    description="Actions on this project will show up here"
                />
            ) : (
                <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-[var(--border)]" />
                    <div className="space-y-4">
                        {activities.map((activity, i) => {
                            const Icon = typeIcons[activity.type] || ActivityIcon;
                            const color = typeColors[activity.type] || '#6C5CE7';
                            return (
                                <motion.div key={activity._id} className="flex items-start gap-4 relative pl-12"
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                                    <div className="absolute left-3.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${color}30` }}>
                                        <Icon className="w-3 h-3" style={{ color }} />
                                    </div>
                                    <Card className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm">
                                                <span className="font-medium">{activity.user?.name || 'User'}</span>{' '}
                                                <span className="text-[var(--text-secondary)]">{activity.message}</span>
                                            </p>
                                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 shrink-0 ml-4">
                                                <Clock className="w-3 h-3" /> {new Date(activity.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </PageContainer>
    );
}
