'use server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function uploadFile(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) {
        throw new Error('No file uploaded')
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = `${uuidv4()}-${file.name}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')

    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        // Ignore if exists
    }

    const path = join(uploadDir, fileName)

    await writeFile(path, buffer)
    return `/uploads/${fileName}`
}
