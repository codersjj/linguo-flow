import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { ClientLayout } from '@/components/ClientLayout'
import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const initialUser = session?.user ? { ...session.user, isGuest: false } : null
  const lessons = await prisma.lesson.findMany()

  // Cast or transform data to match types if necessary
  // Prisma Lesson type matches our Lesson interface mostly, except for Enums which are strings in interface but Enums in Prisma
  // We might need to cast or map.
  // Actually, in types/index.ts, Stage and Type are string unions. Prisma generates Enums.
  // They should be compatible if the values match.

  return (
    <html lang="en">
      <body>
        <ClientLayout
          initialUser={initialUser}
          initialLessons={lessons as any}
        >
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
