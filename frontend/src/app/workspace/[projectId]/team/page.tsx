'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Crown, Mail, Send } from 'lucide-react';
import { projects as projectsApi } from '@/lib/api';
import { PageContainer } from '@/components/ui/PageContainer';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

interface Collaborator {
    user: { _id: string; name: string; email: string; avatar: string };
    role: string;
    joinedAt: string;
}

export default function TeamPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const { toast } = useToast();
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [showInvite, setShowInvite] = useState(false);

    useEffect(() => {
        projectsApi.get(projectId)
            .then(data => setCollaborators(data.project.collaborators || []))
            .finally(() => setLoading(false));
    }, [projectId]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        setInviting(true);
        try {
            const data = await projectsApi.addCollaborator(projectId, { email: inviteEmail });
            setCollaborators(data.project.collaborators || []);
            setInviteEmail('');
            setShowInvite(false);
            toast('Invite sent successfully!', 'success');
        } catch {
            toast('Failed to send invite', 'error');
        }
        setInviting(false);
    };

    if (loading) {
        return (
            <PageContainer title="Team" subtitle="Manage team members">
                <div className="space-y-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Team"
            subtitle={`${collaborators.length} member${collaborators.length !== 1 ? 's' : ''}`}
            action={
                <button onClick={() => setShowInvite(true)} className="btn-primary text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Invite
                </button>
            }
        >
            {collaborators.length === 0 ? (
                <EmptyState
                    icon={<Users className="w-12 h-12" />}
                    title="No team members yet"
                    description="Invite collaborators to work on this project together"
                    action={
                        <button onClick={() => setShowInvite(true)} className="btn-primary text-sm flex items-center gap-2">
                            <UserPlus className="w-4 h-4" /> Invite Member
                        </button>
                    }
                />
            ) : (
                <div className="space-y-3">
                    {collaborators.map((collab, i) => (
                        <motion.div key={collab.user?._id || i}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-sm font-bold text-[var(--primary-light)]">
                                    {collab.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{collab.user?.name || 'Unknown'}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{collab.user?.email || ''}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {collab.role === 'owner' && <Crown className="w-4 h-4 text-[var(--warning)]" />}
                                    <span className="tag text-xs capitalize">{collab.role}</span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Invite Modal */}
            <AnimatePresence>
                {showInvite && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowInvite(false)}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-sm mx-4"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <Card variant="elevated" padding="lg">
                                <h2 className="text-lg font-semibold mb-4">Invite Team Member</h2>
                                <form onSubmit={handleInvite} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                        <input className="input-field pl-10" placeholder="member@email.com" type="email"
                                            value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="button" className="btn-ghost flex-1" onClick={() => setShowInvite(false)}>Cancel</button>
                                        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={inviting}>
                                            <Send className="w-4 h-4" /> {inviting ? 'Sending...' : 'Send Invite'}
                                        </button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageContainer>
    );
}
