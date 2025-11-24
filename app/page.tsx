import React from 'react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { STAGE_LABELS } from '@/constants/lessons';
import Link from 'next/link';
import { CheckCircle, Play, Clock, BarChart3 } from 'lucide-react';
import { ProgressChart } from '@/components/ProgressChart'; // You'd need to adapt this component to accept props instead of context

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect('/auth');

  // Fetch all lessons (assuming seeded in DB, or use constants if not yet seeded)
  // For hybrid approach, we pull lessons from DB.
  const lessons = await prisma.lesson.findMany();

  // Fetch user progress
  const progressList = await prisma.progress.findMany({
    where: { userId: session.user.id }
  });

  // Create a map for easy lookup
  type UserProgress = Omit<typeof progressList[0], 'lastReviewedDate'> & {
    lastReviewedDate: string;
  };
  const progressMap = progressList.reduce((acc, p) => {
    acc[p.lessonId] = { ...p, lastReviewedDate: p.lastReviewedDate.toISOString() };
    return acc;
  }, {} as Record<string, UserProgress>);

  const stages = ['intermediate', 'advanced', 'movies'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome back, {session.user.name}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* We pass data as props now, avoiding Context */}
          <ProgressChart lessons={lessons} progress={progressMap} />

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Play size={20} className="text-indigo-600" />
              Your Courses
            </h2>

            {stages.map(stage => {
              const stageLessons = lessons.filter(l => l.stage === stage);
              const completedCount = stageLessons.filter(l => progressMap[l.id]?.isCompleted).length;
              const percent = stageLessons.length > 0 ? Math.round((completedCount / stageLessons.length) * 100) : 0;

              return (
                <div key={stage} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-900">{STAGE_LABELS[stage as keyof typeof STAGE_LABELS]}</h3>
                      <span className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                        {completedCount} / {stageLessons.length} Completed
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>

                    <div className="space-y-3">
                      {stageLessons.slice(0, 2).map(lesson => (
                        <Link
                          key={lesson.id}
                          href={`/lesson/${lesson.id}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${progressMap[lesson.id]?.isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                              {progressMap[lesson.id]?.isCompleted ? <CheckCircle size={16} /> : <Play size={12} fill="currentColor" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600">{lesson.title}</p>
                              <p className="text-xs text-slate-500">{lesson.duration}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
