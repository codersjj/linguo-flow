'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function markLessonComplete(lessonId: string) {
  try {
    const session = await getSession()

    if (!session || !session.user) {
      console.error('[markLessonComplete] Unauthorized: No session or user found')
      return { error: 'Unauthorized', code: 401 }
    }

    if (session.user.id === 'guest') {
      console.error('[markLessonComplete] Guest mode not supported for server action')
      return { error: 'Guest mode', code: 403 }
    }

    const userId = session.user.id
    const today = new Date()

    console.log(`[markLessonComplete] Processing for user ${userId}, lesson ${lessonId}`)

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
    return { success: true }
  } catch (error) {
    console.error('[markLessonComplete] Error:', error)
    return { error: 'Internal Server Error', code: 500 }
  }
}

export async function undoLessonComplete(lessonId: string) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      console.error('[undoLessonComplete] Unauthorized: No session or user found')
      return { error: 'Unauthorized', code: 401 }
    }

    if (session.user.id === 'guest') {
      console.error('[undoLessonComplete] Guest mode not supported for server action')
      return { error: 'Guest mode', code: 403 }
    }

    const userId = session.user.id
    const today = new Date().toDateString()

    console.log(`[undoLessonComplete] Processing for user ${userId}, lesson ${lessonId}`)

    const existing = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    })

    if (!existing) {
      return { success: true } // Nothing to undo
    }

    // Only allow undo if reviewed today
    if (new Date(existing.lastReviewedDate).toDateString() !== today) {
      return { success: true } // Can't undo past reviews
    }

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
    return { success: true }
  } catch (error) {
    console.error('[undoLessonComplete] Error:', error)
    return { error: 'Internal Server Error', code: 500 }
  }
}
