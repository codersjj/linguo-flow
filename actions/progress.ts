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

        // Log activity
        await prisma.studyActivity.create({
          data: {
            userId,
            lessonId,
            activityType: 'REVIEW',
            createdAt: today
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

      // Log activity
      await prisma.studyActivity.create({
        data: {
          userId,
          lessonId,
          activityType: 'COMPLETE',
          createdAt: today
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
    const today = new Date()
    const todayString = today.toDateString()

    console.log(`[undoLessonComplete] Processing for user ${userId}, lesson ${lessonId}`)

    const existing = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    })

    if (!existing) {
      return { success: true } // Nothing to undo
    }

    // Only allow undo if reviewed today
    if (new Date(existing.lastReviewedDate).toDateString() !== todayString) {
      return { success: true } // Can't undo past reviews
    }

    // Delete today's studyActivity to maintain data consistency
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    await prisma.studyActivity.deleteMany({
      where: {
        userId,
        lessonId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    if (existing.reviewCount <= 1) {
      // Delete if it was the first time
      await prisma.progress.delete({ where: { id: existing.id } })
    } else {
      // Decrement if it was a review
      // Find the previous review date from studyActivity
      const previousActivity = await prisma.studyActivity.findFirst({
        where: {
          userId,
          lessonId,
          createdAt: {
            lt: startOfDay // Before today
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Use the previous activity date, or fall back to yesterday if not found
      const previousDate = previousActivity
        ? previousActivity.createdAt
        : new Date(new Date().setDate(new Date().getDate() - 1))

      await prisma.progress.update({
        where: { id: existing.id },
        data: {
          reviewCount: { decrement: 1 },
          lastReviewedDate: previousDate
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
