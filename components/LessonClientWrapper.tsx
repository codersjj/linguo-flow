'use client'

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export const LessonClientWrapper = ({ lesson, initialProgress }: { lesson: any, initialProgress: any }) => {
  const router = useRouter();
  const { markLessonComplete, undoLessonComplete, progress } = useStore();
  const [isPending, startTransition] = React.useTransition();
  const [showTranscript, setShowTranscript] = useState(true);

  // Get progress from store (for guest) or use initialProgress (for auth)
  const currentProgress = progress[lesson.id] || initialProgress;

  // Check if reviewed today
  const isDoneToday = !!(currentProgress &&
    new Date(currentProgress.lastReviewedDate).toDateString() === new Date().toDateString());

  const [optimisticIsDone, setOptimisticIsDone] = React.useOptimistic(
    isDoneToday,
    (state, newStatus: boolean) => newStatus
  );

  const handleToggleComplete = () => {
    const newStatus = !optimisticIsDone;
    startTransition(async () => {
      setOptimisticIsDone(newStatus);
      try {
        if (optimisticIsDone) {
          await undoLessonComplete(lesson.id);
        } else {
          await markLessonComplete(lesson.id);
        }
        router.refresh();
      } catch (error) {
        console.error('Failed to update lesson status', error);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900">
          <ArrowLeft size={20} /> Back
        </Link>

        <Button
          onClick={handleToggleComplete}
          disabled={isPending}
          variant={optimisticIsDone ? "outline" : "primary"}
          className={`cursor-pointer ${optimisticIsDone ? "bg-green-50 text-green-700 border-green-200" : ""}`}
        >
          {isPending ? 'Saving...' : (optimisticIsDone ? 'Reviewed Today (Undo)' : 'Mark Complete')}
        </Button>
      </div>

      {/* Content Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {lesson.type === 'text' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6 prose prose-slate max-w-none">
              <h1 className="text-2xl font-bold mb-6">{lesson.title}</h1>
              <div className="whitespace-pre-wrap leading-relaxed text-lg">
                {lesson.textContent || lesson.transcript}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-black aspect-video rounded-xl overflow-hidden mb-6">
                <video src={lesson.mediaUrl} controls className="w-full h-full object-cover" poster={lesson.thumbnail} />
              </div>
              <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
              <p className="text-slate-600">{lesson.description}</p>
            </>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl h-[600px] flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 flex justify-between bg-slate-50">
            <h3 className="font-semibold">{lesson.type === 'text' ? 'Notes / Vocabulary' : 'Transcript'}</h3>
            {lesson.type !== 'text' && (
              <button onClick={() => setShowTranscript(!showTranscript)}>
                {showTranscript ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          {(showTranscript || lesson.type === 'text') && (
            <div className="p-6 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {lesson.type === 'text' ? lesson.transcript : lesson.transcript}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
