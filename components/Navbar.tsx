'use client'

import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User, LogOut, Command } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';

interface NavbarProps {
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const { user, logout } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Add global keyboard listener for Cmd+K here to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearchClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchClick]);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">LinguoFlow</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onSearchClick}
              className="group flex items-center gap-2 px-3 py-2 text-slate-500 bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all rounded-md w-64"
              title="Search lessons (Cmd+K)"
            >
              <Search size={16} />
              <span className="text-sm text-slate-400 group-hover:text-indigo-500">Search...</span>
              <div className="ml-auto flex items-center gap-0.5 text-xs text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                <Command size={10} />
                <span>K</span>
              </div>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-slate-900">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {user.isGuest ? 'Guest' : user.email}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Exit
                </Button>
              </div>
            ) : (
              <span className="text-sm text-slate-500">Not Logged In</span>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            <button onClick={onSearchClick} className="p-2 text-slate-500">
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && (
              <div className="px-3 py-2 border-b border-slate-100 mb-2">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email || 'Guest Account'}</p>
              </div>
            )}
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            {user && (
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};