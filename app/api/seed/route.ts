import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MOCK_LESSONS } from '@/constants/lessons';

export async function GET() {
  try {
    for (const lesson of MOCK_LESSONS) {
      await prisma.lesson.upsert({
        where: { id: lesson.id },
        update: {},
        create: {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          stage: lesson.stage,
          type: lesson.type,
          duration: lesson.duration,
          thumbnail: lesson.thumbnail,
          mediaUrl: lesson.mediaUrl || '',
          transcript: lesson.transcript
        }
      });
    }
    return NextResponse.json({ message: "Seeding successful" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}
