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
        >
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
