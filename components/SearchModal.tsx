import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, PlayCircle, Command } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Link from 'next/link';
import Fuse from 'fuse.js';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { lessons } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(lessons);
  const [fuse, setFuse] = useState<Fuse<typeof lessons[0]> | null>(null);

  // Initialize Fuse.js
  useEffect(() => {
    const fuseInstance = new Fuse(lessons, {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'description', weight: 0.5 },
        { name: 'transcript', weight: 0.3 }
      ],
      threshold: 0.4, // Match algorithm sensitivity (0.0 = perfect match, 1.0 = match anything)
      includeScore: true,
      shouldSort: true
    });
    setFuse(fuseInstance);
  }, [lessons]);

  // Handle Global Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Since we can't open it directly from here without lifting state up to App, 
        // we assume the parent handles the open state, but we can trigger onClose if open.
        // NOTE: The actual open logic is in App.tsx/Navbar.tsx. 
        // This component only handles searching when mounted.
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    if (fuse) {
      const fuseResults = fuse.search(query);
      setResults(fuseResults.map(result => result.item));
    }
  }, [query, fuse]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-start justify-center px-4 pt-16 pb-24 text-center sm:p-0 sm:pt-24">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:w-full sm:max-w-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="relative">
            <Search className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-slate-900 placeholder:text-slate-500 focus:ring-0 sm:text-sm"
              placeholder="Search lessons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center rounded border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                ESC
              </span>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="sr-only">Close</span>
                <X size={20} />
              </button>
            </div>
          </div>

          {query && (
            <div className="border-t border-slate-100 max-h-[60vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <div className="p-12 text-center">
                  <Search size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm text-slate-500">No results found for "{query}"</p>
                </div>
              ) : (
                <>
                  <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {results.length} Matches Found
                  </p>
                  <ul className="text-sm text-slate-700">
                    {results.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          href={`/lesson/${lesson.id}`}
                          onClick={onClose}
                          className="group flex cursor-pointer select-none items-center justify-between px-4 py-3 hover:bg-indigo-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 rounded-full bg-indigo-100 p-2 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <PlayCircle size={16} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-medium text-slate-900 group-hover:text-indigo-700 truncate">{lesson.title}</p>
                              <p className="text-xs text-slate-500 truncate">{lesson.description}</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-500 flex-shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {!query && (
            <div className="bg-slate-50 px-4 py-8 text-center text-slate-500">
              <p className="text-sm mb-2">Search across titles, descriptions, and transcripts.</p>
              <div className="flex justify-center gap-2 text-xs text-slate-400">
                <span className="bg-white border border-slate-200 rounded px-1.5 py-0.5">Small Talk</span>
                <span className="bg-white border border-slate-200 rounded px-1.5 py-0.5">Cinema</span>
                <span className="bg-white border border-slate-200 rounded px-1.5 py-0.5">Grammar</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};