type LessonWithTitle = {
    title: string
    stage?: string
    [key: string]: any
}

/**
 * Sort lessons with stage priority and numeric ordering for titles.
 * 
 * Sorting order:
 * 1. By stage: intermediate → advanced → movies
 * 2. By title (for lessons with same stage):
 *    - "Lesson 1-1" comes before "Lesson 1-2"
 *    - "Lesson 3" (treated as "Lesson 3-0") comes before "Lesson 3-1"
 *    - "Lesson 9-2" comes before "Lesson 10-1"
 *    - "Lesson 13-2" comes before "Lesson 13-12"
 *    - When lesson numbers are identical, sort alphabetically by full title
 * 
 * Non-"Lesson" titles are sorted alphabetically within their stage.
 */
export function sortLessons<T extends LessonWithTitle>(lessons: T[]): T[] {
    // Define stage order
    const stageOrder: Record<string, number> = {
        'intermediate': 1,
        'advanced': 2,
        'movies': 3
    }

    return [...lessons].sort((a, b) => {
        // First, compare by stage
        const aStageOrder = a.stage ? (stageOrder[a.stage] || 999) : 999
        const bStageOrder = b.stage ? (stageOrder[b.stage] || 999) : 999

        if (aStageOrder !== bStageOrder) {
            return aStageOrder - bStageOrder
        }

        // If stages are the same, compare by title
        const aTitle = a.title
        const bTitle = b.title

        // Check if both titles start with "Lesson"
        const aIsLesson = aTitle.startsWith('Lesson ')
        const bIsLesson = bTitle.startsWith('Lesson ')

        // If both are "Lesson" format, extract and compare numbers
        if (aIsLesson && bIsLesson) {
            // Match both "Lesson X" and "Lesson X-Y" formats
            const aMatch = aTitle.match(/Lesson (\d+)(?:-(\d+))?/)
            const bMatch = bTitle.match(/Lesson (\d+)(?:-(\d+))?/)

            if (aMatch && bMatch) {
                const aNum1 = parseInt(aMatch[1])
                const bNum1 = parseInt(bMatch[1])
                // If no second number, treat as 0
                const aNum2 = aMatch[2] ? parseInt(aMatch[2]) : 0
                const bNum2 = bMatch[2] ? parseInt(bMatch[2]) : 0

                // First compare the first number
                if (aNum1 !== bNum1) {
                    return aNum1 - bNum1
                }
                // If first numbers are equal, compare the second number
                if (aNum2 !== bNum2) {
                    return aNum2 - bNum2
                }
                // If both numbers are equal, fall back to alphabetical sorting
                return aTitle.localeCompare(bTitle)
            }
        }

        // If only one starts with "Lesson", put it first
        if (aIsLesson && !bIsLesson) return -1
        if (!aIsLesson && bIsLesson) return 1

        // Otherwise, use alphabetical sorting
        return aTitle.localeCompare(bTitle)
    })
}
