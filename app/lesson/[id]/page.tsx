import React from 'react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { LessonClientWrapper } from '@/components/LessonClientWrapper';

export default async function LessonPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect('/auth');

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id }
  });

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const progress = await prisma.progress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId: lesson.id
      }
    }
  });

  return (
    <LessonClientWrapper 
      lesson={lesson} 
      initialProgress={progress} 
    />
  );
}
