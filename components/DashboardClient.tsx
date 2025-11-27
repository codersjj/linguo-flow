'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle, Play, Clock, BarChart3 } from 'lucide-react'
import { ProgressChart } from '@/components/ProgressChart'
import { STAGE_LABELS } from '@/constants/lessons'
import { useStore } from '@/context/StoreContext'
import { UserProgress } from '@/types'

export function DashboardClient() {
    const { user, progress: progressMap, lessons, streak: currentStreak, longestStreak, totalActiveDays } = useStore()
    const isGuest = !user

    const stages = ['intermediate', 'advanced', 'movies']


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="mt-2 text-slate-600">
                    {isGuest
                        ? "You are browsing as a guest. Your progress is temporary."
                        : `Welcome back, ${user?.name}.`}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="h-72">
                        <ProgressChart lessons={lessons} progress={progressMap} />
                    </div>

                    {/* Course Cards */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Play size={20} className="text-indigo-600" />
                            Your Courses
                        </h2>

                        {stages.map(stage => {
                            const stageLessons = lessons.filter(l => l.stage === stage);
                            const completedCount = stageLessons.filter(l => progressMap?.[l.id]?.isCompleted).length;
                            const percent = stageLessons.length > 0 ? Math.round((completedCount / stageLessons.length) * 100) : 0;

                            return (
                                <div key={stage} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-slate-900">{STAGE_LABELS[stage as keyof typeof STAGE_LABELS]}</h3>
                                            <span className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                                                {completedCount === stageLessons.length && stageLessons.length > 0 ? '🎉 ' : ''}
                                                {completedCount} / {stageLessons.length} Completed
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                                            <div
                                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>

                                        {/* Quick Lesson List (Preview first 2) */}
                                        <div className="space-y-3">
                                            {stageLessons.slice(0, 2).map(lesson => (
                                                <Link
                                                    key={lesson.id}
                                                    href={`/lesson/${lesson.id}`}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 group border border-transparent hover:border-slate-100"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${progressMap?.[lesson.id]?.isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                                            {progressMap?.[lesson.id]?.isCompleted ? <CheckCircle size={16} /> : <Play size={12} fill="currentColor" />}
                                                        </div>
                                                        <div className='flex-1'>
                                                            <p className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:text-indigo-600">{lesson.title}</p>
                                                            <p className="text-xs text-slate-500">{lesson.duration}</p>
                                                        </div>
                                                    </div>
                                                    {progressMap?.[lesson.id] && progressMap?.[lesson.id].reviewCount > 1 && (
                                                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                                            Review x{progressMap?.[lesson.id].reviewCount}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
                                        <Link href={`/stage/${stage}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                            View all {STAGE_LABELS[stage as keyof typeof STAGE_LABELS]} lessons <Clock size={14} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <div className="h-72 bg-linear-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
                        <h3 className="font-semibold text-indigo-100 uppercase text-xs tracking-wider mb-4">Your Streak</h3>

                        {/* Current Streak */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold">{currentStreak}</span>
                                <span className="text-indigo-200 text-lg">{currentStreak === 1 ? 'day' : 'days'}</span>
                            </div>
                            <p className="text-sm text-indigo-200 mt-1">Current streak</p>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-indigo-400/30 my-4"></div>

                        {/* Longest Streak */}
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-indigo-100 text-sm">Longest streak</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold">{longestStreak}</span>
                                <span className="text-indigo-200 text-xs">{longestStreak === 1 ? 'day' : 'days'}</span>
                            </div>
                        </div>

                        {/* Total Active Days */}
                        <div className="flex items-center justify-between">
                            <span className="text-indigo-100 text-sm">Total active days</span>
                            <span className="text-2xl font-bold">{totalActiveDays}</span>
                        </div>

                        {/* Motivational Message */}
                        <p className="text-sm text-indigo-200 mt-4">
                            {currentStreak === 0
                                ? "Start your streak today! 🚀"
                                : currentStreak === 1
                                    ? "Great start! Keep it going! 💪"
                                    : currentStreak < 7
                                        ? "You're building a habit! 🔥"
                                        : currentStreak < 30
                                            ? "Amazing consistency! 🌟"
                                            : "Legendary dedication! 👑"}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <BarChart3 size={18} className="text-slate-400" />
                            Total Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 text-sm">Total Lessons</span>
                                <span className="font-bold text-slate-900">{lessons.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 text-sm">Completed</span>
                                <span className="font-bold text-slate-900">{Object.values(progressMap ?? {}).filter((p) => p.isCompleted).length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 text-sm">Total Reviews</span>
                                <span className="font-bold text-slate-900">
                                    {Object.values(progressMap ?? {}).reduce((acc, curr) => acc + curr.reviewCount, 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
