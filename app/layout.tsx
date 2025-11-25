import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { ClientLayout } from '@/components/ClientLayout'
import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const initialUser = session?.user ? { ...session.user, isGuest: false } : null
  const lessons = await prisma.lesson.findMany()

  let progressMap: any = {}
  if (session?.user?.id) {
    const progressList = await prisma.progress.findMany({
      where: { userId: session.user.id }
    })
    progressMap = progressList.reduce((acc, p) => {
      acc[p.lessonId] = { ...p, lastReviewedDate: p.lastReviewedDate.toISOString() }
      return acc
    }, {} as any)
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
