import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/AuthForm'

export default async function AuthPage() {
  const session = await getSession()
  if (session?.user) {
    redirect('/')
  }

  return <AuthForm />
}
