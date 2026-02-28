'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkspaceDefaultPage({ params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = use(params);
    const router = useRouter();

    useEffect(() => {
        router.replace(`/workspace/${projectId}/idea`);
    }, [projectId, router]);

    return null;
}
