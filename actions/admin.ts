'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const LessonSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    stage: z.enum(['intermediate', 'advanced', 'movies']),
    type: z.enum(['audio', 'video', 'mixed', 'text']),
    duration: z.string(),
    thumbnail: z.string(),
    mediaUrl: z.string(),
    transcript: z.string(),
    textContent: z.string().optional(),
})

export async function createLesson(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData.entries())
    // Handle optional textContent
    if (data.textContent === '') delete data.textContent;

    const parsed = LessonSchema.safeParse(data)

    if (!parsed.success) {
        console.error(parsed.error)
        return { error: 'Invalid data' }
    }

    await prisma.lesson.create({
        data: parsed.data,
    })

    revalidatePath('/admin')
    redirect('/admin')
}

export async function updateLesson(id: string, prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData.entries())
    if (data.textContent === '') delete data.textContent;

    const parsed = LessonSchema.safeParse(data)

    if (!parsed.success) {
        console.error(parsed.error)
        return { error: 'Invalid data' }
    }

    await prisma.lesson.update({
        where: { id },
        data: parsed.data,
    })

    revalidatePath('/admin')
    redirect('/admin')
}

export async function deleteLesson(id: string) {
    try {
        // 1. 先删除所有相关的进度记录
        await prisma.progress.deleteMany({
            where: { lessonId: id },
        });

        // 2. 再删除课程
        await prisma.lesson.delete({
            where: { id },
        });

        console.log("✅ Lesson deleted successfully");
    } catch (error) {
        console.error("❌ Error deleting lesson:", error);
        throw error;
    } finally {
        revalidatePath('/admin')
    }
}
