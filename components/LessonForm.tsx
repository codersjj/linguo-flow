'use client'
import { createLesson, updateLesson } from '@/actions/admin'
import { uploadFile } from '@/actions/upload'
import { useState } from 'react'

export default function LessonForm({ lesson }: { lesson?: any }) {
    const [uploading, setUploading] = useState(false)

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, field: string) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const url = await uploadFile(formData)
            const input = document.getElementById(field) as HTMLInputElement
            if (input) input.value = url
        } catch (error) {
            console.error(error)
            alert('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const action = lesson ? updateLesson.bind(null, lesson.id) : createLesson

    return (
        <form action={action} className="space-y-8 divide-y divide-gray-200">
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
                                <input type="file" onChange={(e) => handleUpload(e, 'thumbnail')} className="hidden" id="thumbnail-upload" />
                                <label htmlFor="thumbnail-upload" className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">Upload</label>
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700">Media URL</label>
                            <div className="mt-1 flex gap-2">
                                <input type="text" name="mediaUrl" id="mediaUrl" defaultValue={lesson?.mediaUrl} required className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                                <input type="file" onChange={(e) => handleUpload(e, 'mediaUrl')} className="hidden" id="media-upload" />
                                <label htmlFor="media-upload" className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">Upload</label>
                            </div>
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
                    <button type="submit" disabled={uploading} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {uploading ? 'Uploading...' : 'Save'}
                    </button>
                </div>
            </div>
        </form>
    )
}
