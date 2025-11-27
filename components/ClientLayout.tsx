'use client';

import { StoreProvider } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import { SearchModal } from '@/components/SearchModal';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { User, Lesson } from '@/types';

const ScrollToTop = () => {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

function LayoutContent({ children }: { children: React.ReactNode }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar onSearchClick={() => setIsSearchOpen(true)} />
            <main className="pb-16">{children}</main>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}

interface ClientLayoutProps {
    children: React.ReactNode;
    initialUser: User | null;
    initialLessons: Lesson[];
    initialProgress: any;
    initialStreak: number;
    initialLongestStreak: number;
    initialTotalActiveDays: number;
}

export function ClientLayout({ children, initialUser, initialLessons, initialProgress, initialStreak, initialLongestStreak, initialTotalActiveDays }: ClientLayoutProps) {
    return (
        <StoreProvider
            initialUser={initialUser}
            initialLessons={initialLessons}
            initialProgress={initialProgress}
            initialStreak={initialStreak}
            initialLongestStreak={initialLongestStreak}
            initialTotalActiveDays={initialTotalActiveDays}
        >
            <ScrollToTop />
            <LayoutContent>
                {children}
            </LayoutContent>
        </StoreProvider>
    );
}
