'use client'

import { useState, useActionState } from 'react'
import { register, login } from '@/actions/auth'

import { SubmitButton } from '@/components/ui/SubmitButton'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loginState, loginAction] = useActionState(login, undefined)
  const [registerState, registerAction] = useActionState(register, undefined)


  const currentAction = isLogin ? loginAction : registerAction
  const currentState = isLogin ? loginState : registerState



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          {isLogin ? 'Sign in to your account' : 'Create new account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form action={currentAction} className="space-y-6">
            {currentState?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {currentState.error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input name="name" type="text" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input name="email" type="email" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input name="password" type="password" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
            </div>

            <SubmitButton className='cursor-pointer'>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </SubmitButton>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

