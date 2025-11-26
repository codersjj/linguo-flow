'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

/**
 * 清除 guest 模式 cookie
 * 在用户登录后调用,确保不会被误认为 guest
 */
export async function clearGuestMode() {
  const cookieStore = await cookies()
  cookieStore.delete('guest-mode')
}

/**
 * 启用访客模式
 * Better Auth 不管理 guest 模式,所以保留自定义实现
 */
export async function enableGuestAccess() {
  const cookieStore = await cookies()
  cookieStore.set('guest-mode', 'true', { httpOnly: true })
  redirect('/')
}

/**
 * 登出
 * 清除 Better Auth session 和旧的 JWT session
 */
export async function logout() {
  const cookieStore = await cookies()

  // 清除 Better Auth session cookie, both HTTP (local) and HTTPS (production)
  cookieStore.delete('better-auth.session_token')
  cookieStore.delete('__Secure-better-auth.session_token')

  // 清除旧的 JWT session (兼容性)
  cookieStore.delete('session')

  return { success: true }
}

/**
 * 获取当前用户 session
 * 支持 Better Auth session 和 guest 模式
 */
export async function getCurrentUser() {
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

    return {
      user: session?.user || null,
      isGuest: false,
      session: session?.session || null
    }
  } catch (error) {
    console.error('Failed to get session:', error)
    return { user: null, isGuest: false }
  }
}
