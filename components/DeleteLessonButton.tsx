'use client'

import { deleteLesson } from '@/actions/admin'
import { useState } from 'react'

interface DeleteLessonButtonProps {
    lessonId: string
    lessonTitle: string
}

export default function DeleteLessonButton({ lessonId, lessonTitle }: DeleteLessonButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${lessonTitle}"? This action cannot be undone.`
        )

        if (!confirmed) return

        setIsDeleting(true)
        try {
            await deleteLesson(lessonId)
        } catch (error) {
            console.error('Failed to delete lesson:', error)
            alert('Failed to delete lesson. Please try again.')
            setIsDeleting(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    )
}
