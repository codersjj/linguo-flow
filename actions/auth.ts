'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { encrypt } from '@/lib/session'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function register(prevState: { error?: string; success?: boolean } | undefined, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = RegisterSchema.safeParse(data)

  if (!parsed.success) {
    return { error: 'Invalid data' }
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: 'User already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name } })

  const cookieStore = await cookies()
  cookieStore.set('session', session, { expires, httpOnly: true })

  return { success: true }
}

export async function login(prevState: { error?: string; success?: boolean } | undefined, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = LoginSchema.safeParse(data)

  if (!parsed.success) {
    return { error: 'Invalid inputs' }
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Invalid credentials' }
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name } })

  const cookieStore = await cookies()
  cookieStore.set('session', session, { expires, httpOnly: true })

  return { success: true }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
  return { success: true }
}
