// components/ui/event-card.tsx

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils"; // Assumes you have a `cn` utility from shadcn

// Prop definitions for the EventCard component
export interface EventCardProps {
    heading: string;
    description: string;
    date: Date | string; // Allow string or Date
    imageUrl: string;
    imageAlt: string;
    eventName: string;
    location: string;
    time: string;
    actionLabel: string;
    onActionClick: () => void;
    className?: string;
}

const EventCard = React.forwardRef<HTMLDivElement, EventCardProps>(
    (
        {
            heading,
            description,
            date,
            imageUrl,
            imageAlt,
            eventName,
            location,
            time,
            actionLabel,
            onActionClick,
            className,
        },
        ref
    ) => {
        // Format date parts for display
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
        const day = dateObj.getDate();

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                ref={ref}
                className={cn(
                    "w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] shadow-sm font-sans flex flex-col justify-between hover:border-[var(--primary)]/50 transition-colors duration-200",
                    className
                )}
                aria-labelledby="event-name"
            >
                <div className="flex flex-col h-full">
                    {/* Header Section */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <h2 className="text-[11px] font-bold text-[var(--primary)] uppercase tracking-wider">{heading}</h2>
                            <h3 id="event-name" className="text-lg font-semibold text-[var(--text-primary)] mt-1 line-clamp-2">
                                {eventName}
                            </h3>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[10px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">
                                {dayOfWeek}
                            </p>
                            <p className="text-2xl font-bold text-[var(--text-primary)] leading-none mt-1">
                                <span className="mr-1 text-lg">{month}</span>
                                {day}
                            </p>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="mb-5 aspect-video w-full overflow-hidden rounded-[8px] border border-[var(--border)]">
                        <img
                            src={imageUrl}
                            alt={imageAlt}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col flex-1">
                        <p className="text-[13px] text-[var(--text-secondary)] line-clamp-3 mb-4 flex-1">
                            {description}
                        </p>

                        <div className="flex flex-col space-y-2 text-[12px] text-[var(--text-muted)] mb-5">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-[14px] w-[14px] flex-shrink-0" aria-hidden="true" />
                                <span className="capitalize">{location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-[14px] w-[14px] flex-shrink-0" aria-hidden="true" />
                                <span>{time}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto pt-4 border-t border-[var(--border)]">
                        <button
                            onClick={onActionClick}
                            className="w-full text-[13px] font-medium transition-colors hover:text-[var(--bg-primary)] hover:bg-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[6px] border border-[var(--border)] py-2 text-[var(--text-secondary)]"
                        >
                            {actionLabel}
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }
);

EventCard.displayName = "EventCard";

export { EventCard };
