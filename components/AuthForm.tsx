'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { enableGuestAccess, clearGuestMode } from '@/actions/auth'
import { BookOpen, Shield, Zap, AlertCircle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AuthForm() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isVerification, setIsVerification] = useState(false)
    const [pendingEmail, setPendingEmail] = useState('')
    const [otpValue, setOtpValue] = useState('')

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const otp = formData.get('otp') as string

        try {
            const { data, error } = await authClient.emailOtp.verifyEmail({
                email: pendingEmail,
                otp,
            })

            if (error) {
                setError(error.message || '验证失败,请重试')
            } else {
                setSuccess('验证成功!正在跳转...')
                await clearGuestMode()
                window.location.href = '/'
            }
        } catch (err: any) {
            setError(err.message || '发生错误,请重试')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        setError(null)
        setSuccess('正在发送...')
        try {
            await authClient.emailOtp.sendVerificationOtp({
                email: pendingEmail,
                type: "email-verification"
            })
            setSuccess('验证码已重新发送!')
        } catch (err: any) {
            setError(err.message || '发送失败,请重试')
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const name = formData.get('name') as string

        try {
            if (isLogin) {
                // Login
                const { data, error: loginError } = await authClient.signIn.email({
                    email,
                    password,
                })

                if (loginError) {
                    if (loginError.status === 403) {
                        // 邮箱未验证，自动切换到验证界面
                        setPendingEmail(email)
                        setIsVerification(true)
                        setSuccess('您的邮箱尚未验证。验证码已发送至您的邮箱。')
                        setIsLoading(false)

                        // 自动重发验证码
                        try {
                            await authClient.emailOtp.sendVerificationOtp({
                                email,
                                type: "email-verification"
                            })
                        } catch (err: any) {
                            setError('验证码发送失败，请点击"重新发送"按钮')
                        }
                    } else {
                        setError(loginError.message || '登录失败,请检查您的邮箱和密码')
                    }
                } else {
                    // 清除 guest mode cookie
                    await clearGuestMode()
                    // 使用 window.location 强制完整页面刷新,确保 session 正确加载
                    window.location.href = '/'
                }
            } else {
                // Register
                const { data, error: registerError } = await authClient.signUp.email({
                    email,
                    password,
                    name,
                })

                if (registerError) {
                    setError(registerError.message || '注册失败,请重试')
                } else {
                    setPendingEmail(email)
                    setIsVerification(true)
                    setSuccess('注册成功! 验证码已发送至您的邮箱。')
                    setIsLoading(false)

                    await authClient.emailOtp.sendVerificationOtp({
                        email,
                        type: "email-verification"
                    })
                }
            }
        } catch (err: any) {
            setError(err.message || '发生错误,请重试')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGuestLogin = async () => {
        await enableGuestAccess()
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <span className="text-white font-bold text-3xl">L</span>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-slate-900">
                    {isVerification ? 'Verify your email' : (isLogin ? 'Welcome back' : 'Start your journey')}
                </h2>
                {!isVerification && (
                    <p className="mt-2 text-center text-sm text-slate-600">
                        {isLogin ? 'New here? ' : 'Already have an account? '}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError(null)
                                setSuccess(null)
                            }}
                            className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        >
                            {isLogin ? 'Create an account' : 'Sign in'}
                        </button>
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-lg sm:px-10 border border-slate-100">
                    {isVerification ? (
                        <form key="verification-form" onSubmit={handleVerify} className="space-y-6">
                            {error && (
                                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {success && (
                                <div className="rounded-md bg-green-50 p-4 border border-green-200">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">{success}</h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                                    Verification Code
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        autoComplete="one-time-code"
                                        required
                                        value={otpValue}
                                        onChange={(e) => setOtpValue(e.target.value)}
                                        placeholder="Enter the code sent to your email"
                                        className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 cursor-pointer"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Email'}
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isLoading}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                                >
                                    Resend Code
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsVerification(false)
                                        setIsLogin(true)
                                        setError(null)
                                        setSuccess(null)
                                    }}
                                    className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form key={isLogin ? 'login-form' : 'register-form'} onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {success && (
                                <div className="rounded-md bg-green-50 p-4 border border-green-200">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">{success}</h3>
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
                                {isLogin && (
                                    <div className="mt-2 text-right">
                                        <a
                                            href="/auth/forgot-password"
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 cursor-pointer"
                                >
                                    {isLoading ? 'Processing...' : isLogin ? 'Sign in' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}

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
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
