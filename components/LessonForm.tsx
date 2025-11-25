'use client'
import { useActionState, useEffect, useTransition } from 'react'
import { createLesson, updateLesson } from '@/actions/admin'
import { uploadFile } from '@/actions/upload'
import { useState } from 'react'
import { SubmitButton } from '@/components/ui/SubmitButton'

export default function LessonForm({ lesson }: { lesson?: any }) {
    const [uploading, setUploading] = useState(false)
    const [isPending, startTransition] = useTransition()

    // 保存待上传的文件
    const [pendingFiles, setPendingFiles] = useState<{
        thumbnail?: File
        mediaUrl?: File
    }>({})

    // 保存预览 URL
    const [previewUrls, setPreviewUrls] = useState<{
        thumbnail?: string
        mediaUrl?: string
    }>({})

    // 使用 useActionState 处理表单状态
    const [state, formAction] = useActionState(
        lesson ? updateLesson.bind(null, lesson.id) : createLesson,
        null
    )

    // 清理预览 URL,避免内存泄漏
    useEffect(() => {
        return () => {
            Object.values(previewUrls).forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url)
                }
            })
        }
    }, [previewUrls])

    // 文件选择时只保存到 state 并创建预览
    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'mediaUrl') {
        const file = e.target.files?.[0]
        if (!file) return

        // 保存文件到 state
        setPendingFiles(prev => ({ ...prev, [field]: file }))

        // 创建预览 URL
        const previewUrl = URL.createObjectURL(file)
        setPreviewUrls(prev => {
            // 清理旧的预览 URL
            if (prev[field] && prev[field]!.startsWith('blob:')) {
                URL.revokeObjectURL(prev[field]!)
            }
            return { ...prev, [field]: previewUrl }
        })

        // 更新 input 显示预览 URL
        const input = document.getElementById(field) as HTMLInputElement
        if (input) input.value = previewUrl
    }

    // 表单提交处理
    async function handleSubmit(formData: FormData) {
        setUploading(true)

        try {
            // 先上传所有待上传的文件
            if (pendingFiles.thumbnail) {
                const thumbnailFormData = new FormData()
                thumbnailFormData.append('file', pendingFiles.thumbnail)
                const thumbnailUrl = await uploadFile(thumbnailFormData)
                formData.set('thumbnail', thumbnailUrl)
            } else if (!formData.get('thumbnail') || (formData.get('thumbnail') as string).startsWith('blob:')) {
                // 如果是预览 URL 或为空,使用原有的值
                formData.set('thumbnail', lesson?.thumbnail || '')
            }

            if (pendingFiles.mediaUrl) {
                const mediaFormData = new FormData()
                mediaFormData.append('file', pendingFiles.mediaUrl)
                const mediaUrl = await uploadFile(mediaFormData)
                formData.set('mediaUrl', mediaUrl)
            } else if (!formData.get('mediaUrl') || (formData.get('mediaUrl') as string).startsWith('blob:')) {
                // 如果是预览 URL 或为空,使用原有的值
                formData.set('mediaUrl', lesson?.mediaUrl || '')
            }

            // 使用 startTransition 来调用 formAction
            startTransition(() => {
                formAction(formData)
            })

            // 清理待上传文件
            setPendingFiles({})
        } catch (error) {
            console.error(error)
            alert('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    return (
        <form action={formAction} onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleSubmit(formData)
        }} className="space-y-8 divide-y divide-gray-200">
            {/* 显示错误信息 */}
            {state?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {state.error}
                </div>
            )}

            <div className="space-y-8 divide-y divide-gray-200">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{lesson ? 'Edit Lesson' : 'New Lesson'}</h3>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <div className="mt-1">
                                <input type="text" name="title" id="title" defaultValue={lesson?.title} required className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <div className="mt-1">
                                <textarea id="description" name="description" rows={3} defaultValue={lesson?.description} required className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2" />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="stage" className="block text-sm font-medium text-gray-700">Stage</label>
                            <div className="mt-1">
                                <select id="stage" name="stage" defaultValue={lesson?.stage} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border">
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="movies">Movies</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                            <div className="mt-1">
                                <select id="type" name="type" defaultValue={lesson?.type} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border">
                                    <option value="audio">Audio</option>
                                    <option value="video">Video</option>
                                    <option value="mixed">Mixed</option>
                                    <option value="text">Text</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                            <div className="mt-1">
                                <input type="text" name="duration" id="duration" defaultValue={lesson?.duration} required className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                            <div className="mt-1 flex gap-2">
                                <input type="text" name="thumbnail" id="thumbnail" defaultValue={lesson?.thumbnail} required className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                                <input type="file" onChange={(e) => handleFileSelect(e, 'thumbnail')} accept="image/*" className="hidden" id="thumbnail-upload" />
                                <label htmlFor="thumbnail-upload" className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">Upload</label>
                            </div>
                            {pendingFiles.thumbnail && (
                                <p className="mt-1 text-xs text-indigo-600">
                                    ✓ Selected: {pendingFiles.thumbnail.name} (will upload on save)
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700">Media URL</label>
                            <div className="mt-1 flex gap-2">
                                <input type="text" name="mediaUrl" id="mediaUrl" defaultValue={lesson?.mediaUrl} required className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                                <input type="file" onChange={(e) => handleFileSelect(e, 'mediaUrl')} accept="audio/*,video/*" className="hidden" id="media-upload" />
                                <label htmlFor="media-upload" className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">Upload</label>
                            </div>
                            {pendingFiles.mediaUrl && (
                                <p className="mt-1 text-xs text-indigo-600">
                                    ✓ Selected: {pendingFiles.mediaUrl.name} (will upload on save)
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="transcript" className="block text-sm font-medium text-gray-700">Transcript</label>
                            <div className="mt-1">
                                <textarea id="transcript" name="transcript" rows={5} defaultValue={lesson?.transcript} required className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2" />
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="textContent" className="block text-sm font-medium text-gray-700">Text Content (for Text type)</label>
                            <div className="mt-1">
                                <textarea id="textContent" name="textContent" rows={5} defaultValue={lesson?.textContent} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-5">
                <div className="flex justify-end">
                    <SubmitButton className="ml-3 cursor-pointer" disabled={uploading || isPending}>
                        {uploading ? 'Uploading...' : isPending ? 'Saving...' : 'Save'}
                    </SubmitButton>
                </div>
            </div>
        </form>
    )
}