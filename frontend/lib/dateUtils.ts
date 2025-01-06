export interface ParsedDateTime {
    dateKey: string
    timeStr: string
}

export const parseDateTime = (dateTimeStr: string | Date): ParsedDateTime => {
    const d = new Date(dateTimeStr)

    const dateKey = d.toLocaleDateString('en-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })

    const timeStr = d.toLocaleTimeString('en-SE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
    })

    return { dateKey, timeStr }
}
