'use client';

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, Star, CheckCircle, ChevronLeft } from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import Link from 'next/link';

export default function MentorBooking({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [bookingState, setBookingState] = useState<'idle' | 'confirming' | 'booked'>('idle');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    // Mock data for the specific mentor
    const mentor = {
        name: 'Elena Rodriguez',
        avatar: 'ER',
        title: 'Senior AI Researcher',
        company: 'Google DeepMind',
        bio: 'Helping builders scale AI agents. Former YC founder. I specialize in system architectures for LLMs and taking predictive models to production.',
        hourlyRate: 0,
        rating: 4.9,
        expertise: ['AI/ML', 'System Design', 'Python'],
        availableTimes: ['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM']
    };

    const handleBook = () => {
        if (!selectedDate || !selectedTime) return;

        setBookingState('confirming');
        setTimeout(() => {
            setBookingState('booked');
        }, 1500);
    };

    return (
        <PageContainer>
            <Link href="/mentorship" className="text-sm text-[var(--text-muted)] hover:text-white flex items-center gap-1 mb-8 w-max transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Mentors
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="lg:col-span-1">
                    <motion.div className="card p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-[var(--primary)]/20">
                            {mentor.avatar}
                        </div>
                        <h2 className="text-2xl font-bold text-center">{mentor.name}</h2>
                        <p className="text-center text-[var(--text-secondary)] mb-4">{mentor.title} @ {mentor.company}</p>

                        <div className="flex justify-center items-center gap-2 mb-6 p-3 bg-[var(--bg-glass)] rounded-xl border border-[var(--border)]">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold">{mentor.rating}</span>
                            </div>
                            <span className="text-[var(--text-muted)]">|</span>
                            <div className="font-semibold text-green-400">
                                {mentor.hourlyRate === 0 ? 'Free Mentorship' : `$${mentor.hourlyRate}/hr`}
                            </div>
                        </div>

                        <h3 className="font-semibold mb-2">About</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">{mentor.bio}</p>

                        <h3 className="font-semibold mb-2">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {mentor.expertise.map(s => (
                                <span key={s} className="px-2 py-1 bg-[var(--bg-secondary)] text-xs rounded-md">{s}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Booking Section */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="popLayout">
                        {bookingState === 'booked' ? (
                            <motion.div key="success" className="card p-8 text-center flex flex-col items-center border-[var(--primary)]/50"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Session Booked!</h2>
                                <p className="text-[var(--text-secondary)] mb-8">
                                    Your 1-on-1 session with {mentor.name} is confirmed for <span className="font-semibold text-white">{selectedDate}</span> at <span className="font-semibold text-white">{selectedTime}</span>.
                                </p>

                                <div className="p-4 bg-[var(--bg-glass)] border border-[var(--border)] rounded-xl w-full max-w-md flex items-center justify-center gap-3">
                                    <Video className="w-5 h-5 text-[var(--primary)]" />
                                    <span className="font-medium text-sm">Meeting link sent to your email</span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="booking" className="card p-8"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                                <h2 className="text-xl font-bold mb-6">Schedule a Session</h2>

                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-[var(--primary)]" /> Select Date</h3>
                                    {/* Simplified UI for demonstration */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Tomorrow', 'In 2 Days', 'Next Week'].map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setSelectedDate(d)}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${selectedDate === d ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-light)]' : 'border-[var(--border)] hover:border-[var(--text-muted)]'}`}>
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--primary)]" /> Select Time</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {mentor.availableTimes.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setSelectedTime(t)}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${selectedTime === t ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-light)]' : 'border-[var(--border)] hover:border-[var(--text-muted)]'}`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleBook}
                                    disabled={!selectedDate || !selectedTime || bookingState === 'confirming'}
                                    className="btn-primary w-full py-4 text-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {bookingState === 'confirming' ? 'Confirming...' : 'Confirm Booking'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageContainer>
    );
}
