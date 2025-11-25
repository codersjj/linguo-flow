'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
    children: React.ReactNode
    className?: string
    disabled?: boolean
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    children,
    className = '',
    disabled
}) => {
    const { pending } = useFormStatus()
    const isDisabled = pending || disabled

    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full"
    const primaryStyles = "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:hover:bg-indigo-600"
    const sizeStyles = "px-4 py-2 text-base"
    const loadingStyles = isDisabled ? "relative" : ""

    return (
        <button
            type="submit"
            disabled={isDisabled}
            className={`${baseStyles} ${primaryStyles} ${sizeStyles} ${loadingStyles} ${className}`}
        >
            {pending && (
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            <span className={pending ? "opacity-70" : ""}>
                {pending ? 'Processing...' : children}
            </span>
        </button>
    )
}
