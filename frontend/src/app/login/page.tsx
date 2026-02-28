'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, GitBranch, Eye, EyeOff } from 'lucide-react';
import { auth, setToken } from '@/lib/api';
import { BackgroundCircles } from '@/components/ui/background-circles';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPw, setShowPw] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await auth.login(form);
            setToken(data.token);
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 z-0">
                <BackgroundCircles
                    variant="zyphra"
                    title=""
                    description=""
                    className="!h-full"
                />
            </div>

            {/* Form overlay */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <motion.div
                    className="auth-card w-full max-w-[420px]"
                    style={{ background: 'rgba(15, 15, 26, 0.85)', backdropFilter: 'blur(24px)' }}
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <span className="text-2xl font-bold gradient-text">Zyphra</span>
                        </motion.div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: 12, marginBottom: 4, color: 'var(--text-primary)' }}>
                            Welcome back
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Sign in to your workspace
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginBottom: 16, padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                                background: 'rgba(255,118,117,0.1)', border: '1px solid rgba(255,118,117,0.2)',
                                color: '#FF7675', fontSize: '0.85rem',
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Email */}
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15, duration: 0.4 }}
                        >
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                                Email
                            </label>
                            <div className="auth-input-wrap" style={{ position: 'relative' }}>
                                <Mail className="auth-icon" />
                                <input
                                    type="email"
                                    className="auth-input"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25, duration: 0.4 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    Password
                                </label>
                                <Link href="/forgot-password" style={{ fontSize: '0.72rem', color: 'var(--primary-light)', textDecoration: 'none' }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="auth-input-wrap" style={{ position: 'relative' }}>
                                <Lock className="auth-icon" />
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    className="auth-input"
                                    style={{ paddingRight: 44 }}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    required
                                    autoComplete="current-password"
                                />
                                <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                                    {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.4 }}
                        >
                            {loading ? <span className="auth-spinner" /> : <LogIn style={{ width: 16, height: 16 }} />}
                            <span>{loading ? 'Signing in…' : 'Sign In'}</span>
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>or</span>
                    </div>

                    {/* GitHub */}
                    <a
                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/github`}
                        className="auth-github"
                    >
                        <GitBranch style={{ width: 16, height: 16 }} />
                        Continue with GitHub
                    </a>

                    {/* Sign up links */}
                    <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                            Don&apos;t have an account? Register as:
                        </p>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <Link href="/register?role=candidate" style={{ flex: 1, textAlign: 'center', padding: '8px 0', fontSize: '0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.15s ease' }} className="hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]">
                                Candidate
                            </Link>
                            <Link href="/register?role=mentor" style={{ flex: 1, textAlign: 'center', padding: '8px 0', fontSize: '0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.15s ease' }} className="hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]">
                                Mentor
                            </Link>
                            <Link href="/register?role=organizer" style={{ flex: 1, textAlign: 'center', padding: '8px 0', fontSize: '0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.15s ease' }} className="hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]">
                                Organizer
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
