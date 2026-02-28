'use client';

// components/ui/mentor-section.tsx
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bookmark, Star, ExternalLink } from "lucide-react";
import Link from "next/link";

// --- TYPE DEFINITIONS ---
export interface Mentor {
    id: string | number;
    name: string;
    role: string;
    category: string;
    gigs: number;
    rating: number;
    reviews: number;
    imageUrl: string;
    description: string;
    hourlyRate?: number;
}

interface MentorsSectionProps {
    mentors: Mentor[];
    categories: string[];
}

// --- SUB-COMPONENTS ---

// A single mentor card with hover animation
const MentorCard = ({ mentor }: { mentor: Mentor }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-[var(--text-primary)] shadow-sm hover:border-[var(--primary)]/50 transition-colors"
    >
        {/* Bookmark Icon */}
        <button className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-colors hover:bg-black/80 text-white">
            <Bookmark className="w-4 h-4" />
        </button>

        <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-[var(--border)] relative">
            <img src={mentor.imageUrl} alt={mentor.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
        </div>

        <h3 className="text-lg font-bold mb-1">{mentor.name}</h3>
        <p className="text-sm text-[var(--text-secondary)]">{mentor.role} &middot; {mentor.gigs} Gigs</p>

        <div className="my-3 flex items-center gap-2">
            <span className="font-bold text-lg">{mentor.rating.toFixed(1)}</span>
            <div className="flex text-[var(--text-muted)] gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < Math.round(mentor.rating) ? "text-yellow-400 fill-yellow-400" : "text-[var(--text-muted)]/50")} />
                ))}
            </div>
            <span className="text-xs text-[var(--text-muted)] uppercase">({mentor.reviews} Reviews)</span>
        </div>

        <p className="text-sm text-[var(--text-secondary)] flex-grow line-clamp-3 mb-4">{mentor.description}</p>

        <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="text-sm">
                <span className="font-bold">{mentor.hourlyRate === 0 || !mentor.hourlyRate ? 'Free' : `$${mentor.hourlyRate}`}</span>
                {mentor.hourlyRate && mentor.hourlyRate > 0 ? <span className="text-[var(--text-muted)] text-xs"> / session</span> : null}
            </div>
            <Link href={`/mentorship/${mentor.id}`} className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm bg-[var(--border)] hover:bg-[var(--primary)]/20 hover:text-[var(--primary-light)] transition-colors rounded-md">
                View <ExternalLink className="w-4 h-4" />
            </Link>
        </div>
    </motion.div >
);

// --- MAIN COMPONENT ---
export const MentorsSection = ({ mentors, categories }: MentorsSectionProps) => {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredMentors = activeCategory === "All"
        ? mentors
        : mentors.filter((mentor) => mentor.category === activeCategory);

    return (
        <section className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    {["All", ...categories].map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors border",
                                activeCategory === category
                                    ? "bg-gradient-to-r from-[var(--primary)] to-[#5B4BD6] text-white border-transparent"
                                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--border)]/50 hover:text-[var(--text-primary)]"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Animated Mentor Grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredMentors.length > 0 ? filteredMentors.map((mentor) => (
                        <MentorCard key={mentor.id} mentor={mentor} />
                    )) : (
                        <div className="col-span-full py-12 text-center text-[var(--text-muted)]">
                            No mentors found in this category.
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};
