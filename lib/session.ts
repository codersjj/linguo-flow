import { cookies, headers } from 'next/headers'
import { auth } from '@/lib/auth'

/**
 * 获取当前 session
 * 支持 Better Auth session 和 guest 模式
 */
export async function getSession() {
  const cookieStore = await cookies()

  // 检查 guest 模式
  const guestMode = cookieStore.get('guest-mode')
  if (guestMode) {
    return { user: null, isGuest: true }
  }

  // 获取 Better Auth session
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return null
    }

    return {
      user: session.user,
      session: session.session,
      isGuest: false
    }
  } catch (error) {
    console.error('Failed to get session:', error)
    return null
  }
}

/**
 * 检查用户是否已登录
 */
export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.user || !!session?.isGuest
}

/**
 * 获取当前用户 ID
 */
export async function getUserId() {
  const session = await getSession()
  return session?.user?.id || null
}