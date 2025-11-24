'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function markLessonComplete(lessonId: string) {
  const session = await getSession()
  if (!session || !session.user) return { error: 'Unauthorized' }

  const userId = session.user.id
  const today = new Date()
  
  // Logic: Upsert progress
  // If exists, check date. If reviewed today, ignore. If not, increment review count.
  // If not exists, create.
  
  const existing = await prisma.progress.findUnique({
    where: {
      userId_lessonId: { userId, lessonId }
    }
  })

  if (existing) {
    const lastDate = new Date(existing.lastReviewedDate).toDateString()
    const todayDate = today.toDateString()

    if (lastDate !== todayDate) {
       await prisma.progress.update({
         where: { id: existing.id },
         data: {
           reviewCount: { increment: 1 },
           lastReviewedDate: today
         }
       })
    }
  } else {
    await prisma.progress.create({
      data: {
        userId,
        lessonId,
        isCompleted: true,
        lastReviewedDate: today,
        reviewCount: 1
      }
    })
  }

  revalidatePath(`/lesson/${lessonId}`)
  revalidatePath('/')
}

export async function undoLessonComplete(lessonId: string) {
  const session = await getSession()
  if (!session || !session.user) return { error: 'Unauthorized' }

  const userId = session.user.id
  const today = new Date().toDateString()

  const existing = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId, lessonId } }
  })

  if (!existing) return

  // Only allow undo if reviewed today
  if (new Date(existing.lastReviewedDate).toDateString() !== today) return

  if (existing.reviewCount <= 1) {
    // Delete if it was the first time
    await prisma.progress.delete({ where: { id: existing.id } })
  } else {
    // Decrement if it was a review
    // Set date back to yesterday approx (for logic consistency)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    await prisma.progress.update({
      where: { id: existing.id },
      data: {
        reviewCount: { decrement: 1 },
        lastReviewedDate: yesterday
      }
    })
  }

  revalidatePath(`/lesson/${lessonId}`)
  revalidatePath('/')
}
