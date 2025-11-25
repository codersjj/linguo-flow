'use client'

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { STAGE_LABELS } from '@/constants/lessons';
import { Stage } from '@/types';
import { Play, CheckCircle, Lock } from 'lucide-react';

interface StageViewClientProps {
    stage: Stage;
}

export const StageViewClient: React.FC<StageViewClientProps> = ({ stage }) => {
    const { lessons, progress } = useStore();

    const stageLessons = lessons.filter(l => l.stage === stage);

    if (!stageLessons.length) {
        return <div className="p-8 text-center">Stage not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="border-b border-slate-200 pb-6 mb-8">
                <h1 className="text-3xl font-bold text-slate-900">{STAGE_LABELS[stage]} Course</h1>
                <p className="mt-2 text-slate-600">Master these lessons to advance your fluency.</p>
            </div>

            <div className="space-y-4">
                {stageLessons.map((lesson, index) => {
                    const isCompleted = progress?.[lesson.id]?.isCompleted;
                    // Mock logic: Lock next lesson until previous is done (optional, but good for UX)
                    // For this demo, we'll leave everything unlocked
                    const isLocked = false;

                    return (
                        <div
                            key={lesson.id}
                            className={`relative bg-white rounded-xl border p-4 transition-all ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
                        >
                            <div className="flex items-center gap-4 sm:gap-6">
                                {/* Status Icon */}
                                <div className="flex-shrink-0">
                                    {isCompleted ? (
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <CheckCircle size={20} />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600">
                                            {isLocked ? <Lock size={18} /> : <span className="font-bold text-sm">{index + 1}</span>}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-semibold text-slate-900 truncate">{lesson.title}</h3>
                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                            {lesson.duration}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-1">{lesson.description}</p>
                                </div>

                                {/* Action */}
                                <div className="flex-shrink-0 flex items-center gap-3">
                                    {progress?.[lesson.id] && progress?.[lesson.id].reviewCount > 1 && (
                                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                            Review x{progress?.[lesson.id].reviewCount}
                                        </span>
                                    )}
                                    <Link
                                        href={`/lesson/${lesson.id}`}
                                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isCompleted
                                                ? 'text-green-700 bg-green-100 hover:bg-green-200'
                                                : 'text-white bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                    >
                                        {isCompleted ? 'Review' : 'Start'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
