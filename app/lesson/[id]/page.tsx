import React from 'react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { LessonClientWrapper } from '@/components/LessonClientWrapper';

type Params = Promise<{ id: string }>

export default async function LessonPage({ params }: { params: Params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect('/auth');

  const lesson = await prisma.lesson.findUnique({
    where: { id }
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
