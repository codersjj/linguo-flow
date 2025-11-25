import LessonForm from '@/components/LessonForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const lesson = await prisma.lesson.findUnique({
        where: { id }
    })

    if (!lesson) notFound()

    return (
        <div className="max-w-2xl mx-auto">
            <LessonForm lesson={lesson} />
        </div>
    )
}
