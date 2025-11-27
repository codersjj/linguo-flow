import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { ClientLayout } from '@/components/ClientLayout'
import { sortLessons } from '@/lib/sortLessons'
import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('🏠 RootLayout: Getting session...')
  const session = await getSession()
  console.log('🏠 RootLayout: Session result:', session)

  const initialUser = session?.user ? { ...session.user, isGuest: false } : null
  console.log('🏠 RootLayout: initialUser:', initialUser)

  const lessonsData = await prisma.lesson.findMany()
  const lessons = sortLessons(lessonsData)

  let progressMap: any = {}
  let streak = 0
  let longestStreak = 0
  let totalActiveDays = 0

  if (session?.user?.id) {
    console.log('📊 Loading progress for user:', session.user.id)
    const progressList = await prisma.progress.findMany({
      where: { userId: session.user.id }
    })
    console.log('📊 Found progress items:', progressList.length)
    progressMap = progressList.reduce((acc, p) => {
      acc[p.lessonId] = { ...p, lastReviewedDate: p.lastReviewedDate.toISOString() }
      return acc
    }, {} as any)

    // Calculate Streak & Active Days using StudyActivity
    const activities = await prisma.studyActivity.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    })

    const uniqueDates = Array.from(new Set(
      activities.map((a: any) => new Date(a.createdAt).toDateString())
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    totalActiveDays = uniqueDates.length

    // Calculate current streak
    if (uniqueDates.length > 0) {
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        let currentStreak = 0
        let currentDate = new Date(uniqueDates[0])

        for (const date of uniqueDates) {
          if (date === currentDate.toDateString()) {
            currentStreak++
            currentDate.setDate(currentDate.getDate() - 1)
          } else {
            break
          }
        }
        streak = currentStreak
      }
    }

    // Calculate longest streak
    if (uniqueDates.length > 0) {
      // Sort dates from oldest to newest for longest streak calculation
      const sortedDates = [...uniqueDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

      let currentStreakCount = 1
      longestStreak = 1

      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1])
        const currDate = new Date(sortedDates[i])

        const diffTime = currDate.getTime() - prevDate.getTime()
        const diffDays = Math.round(diffTime / 86400000)

        if (diffDays === 1) {
          currentStreakCount++
          longestStreak = Math.max(longestStreak, currentStreakCount)
        } else {
          currentStreakCount = 1
        }
      }
    }

  } else {
    console.log('⚠️ No user ID, skipping progress load')
  }

  return (
    <html lang="en">
      <body>
        <ClientLayout
          initialUser={initialUser}
          initialLessons={lessons as any}
          initialProgress={progressMap}
          initialStreak={streak}
          initialLongestStreak={longestStreak}
          initialTotalActiveDays={totalActiveDays}
        >
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
