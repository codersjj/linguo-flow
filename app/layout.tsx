'use client';

import './globals.css';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import { SearchModal } from '@/components/SearchModal';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ScrollToTop />
          <LayoutContent>
            {children}
          </LayoutContent>
        </StoreProvider>
      </body>
    </html>
  );
}
