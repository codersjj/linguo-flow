'use client'

import { useState, useActionState } from 'react'
import { register, login } from '@/actions/auth'
import { BookOpen, Shield, Zap, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { SubmitButton } from '@/components/ui/SubmitButton'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loginState, loginAction, isLoginPending] = useActionState(login, undefined)
  const [registerState, registerAction, isRegisterPending] = useActionState(register, undefined)

  const currentAction = isLogin ? loginAction : registerAction
  const currentState = isLogin ? loginState : registerState
  const isPending = isLogin ? isLoginPending : isRegisterPending

  const handleGuestLogin = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <span className="text-white font-bold text-3xl">L</span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          {isLogin ? 'Welcome back' : 'Start your journey'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isLogin ? 'New here? ' : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-lg sm:px-10 border border-slate-100">
          <form action={currentAction} className="space-y-6">
            {currentState?.error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{currentState.error}</h3>
                  </div>
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="animate-in slide-in-from-top-4 fade-in">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <SubmitButton
                className="w-full justify-center shadow-lg shadow-indigo-200"
                disabled={isPending}
              >
                {isLogin ? 'Sign in' : 'Create Account'}
              </SubmitButton>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue without saving</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGuestLogin}
                className="w-full flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue as Guest
              </button>
              <p className="mt-2 text-xs text-center text-slate-400">
                *Guest progress will not be saved after closing the browser.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
            <BookOpen size={24} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Structured Curriculum</h3>
          <p className="mt-2 text-base text-slate-500">From intermediate phrases to movie dialogues.</p>
        </div>
        <div className="p-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Smart Review</h3>
          <p className="mt-2 text-base text-slate-500">Daily progress tracking with spaced repetition logic.</p>
        </div>
        <div className="p-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
            <Shield size={24} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Privacy Focused</h3>
          <p className="mt-2 text-base text-slate-500">Your data stays in your browser (Guest mode).</p>
        </div>
      </div>
    </div>
  )
}

