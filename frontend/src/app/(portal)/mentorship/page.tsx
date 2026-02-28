'use client';

import { PageContainer } from '@/components/ui/PageContainer';
import { MentorsSection } from '@/components/ui/mentor-section';

const mentorData = [
    {
        id: "m1",
        name: "Elena Rodriguez",
        role: "Senior AI Researcher",
        category: "Science & Engineering",
        gigs: 42,
        rating: 4.9,
        reviews: 124,
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
        description: "Helping builders scale AI agents. Former YC founder.",
        hourlyRate: 0,
    },
    {
        id: "m2",
        name: "David Chen",
        role: "Lead Blockchain Engineer",
        category: "Web3",
        gigs: 28,
        rating: 4.8,
        reviews: 89,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
        description: "Passionate about decentralized finance and complex tokenomics.",
        hourlyRate: 50,
    },
    {
        id: "m3",
        name: "Sarah Jenkins",
        role: "Staff Frontend Engineer",
        category: "Software Engineering",
        gigs: 105,
        rating: 5.0,
        reviews: 210,
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
        description: "I build fast web experiences and help others do the same.",
        hourlyRate: 25,
    },
    {
        id: "m4",
        name: "Benyamin Rolocov",
        role: "Python Developer",
        category: "Science & Engineering",
        gigs: 8,
        rating: 5.0,
        reviews: 126,
        imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=600&auto=format&fit=crop",
        description: "Learn from industry professionals offering their services.",
        hourlyRate: 15,
    },
    {
        id: "m5",
        name: "Alexandra Chabon",
        role: "Graphic Designer",
        category: "Graphic Design",
        gigs: 32,
        rating: 4.9,
        reviews: 154,
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
        description: "Creative guidance from seasoned design experts.",
        hourlyRate: 0,
    },
    {
        id: "m6",
        name: "Rezchwag Shibana",
        role: "Strategist & Manager",
        category: "Sustainability",
        gigs: 79,
        rating: 4.8,
        reviews: 231,
        imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600&auto=format&fit=crop",
        description: "Expert insights for sustainable business growth.",
        hourlyRate: 40,
    },
];

const categoryData = ["Science & Engineering", "Software Engineering", "Web3", "Graphic Design", "Sustainability"];

export default function MentorshipHub() {
    return (
        <PageContainer
            title="Mentorship Hub"
            subtitle="Book 1-on-1 sessions with industry experts and learn from the best."
        >
            <MentorsSection mentors={mentorData} categories={categoryData} />
        </PageContainer>
    );
}
