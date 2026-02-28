'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken } from '@/lib/api';
import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setToken(token);
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Rocket className="w-8 h-8 text-[var(--primary)]" />
            </motion.div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Rocket className="w-8 h-8 text-[var(--primary)] animate-spin" />
            </div>
        }>
            <CallbackHandler />
        </Suspense>
    );
}
