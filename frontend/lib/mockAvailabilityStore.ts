// monthlyAvailability: { [YYYY-MM-DD]: number } indicating how many slots available that day
// dailySlots: { [YYYY-MM-DD]: string[] } times available that day

export function getMonthlyAvailability(
    clinicId: string,
    reasonId: string,
    duration: number
): { [date: string]: number } {
    // Mock logic: random availability. For simplicity, let's say this month has availability on weekdays
    // We'll pick today's month and year:
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const availability: { [date: string]: number } = {};
    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const day = dateObj.getDay();
        // If weekday and reason duration < 60, have more slots, else fewer
        if (day > 0 && day < 6) {
            availability[dateObj.toISOString().split('T')[0]] =
                duration > 45 ? 2 : 5;
        } else {
            availability[dateObj.toISOString().split('T')[0]] = 0;
        }
    }

    return availability;
}

export function getDailyTimes(
    clinicId: string,
    reasonId: string,
    duration: number
): string[] {
    // If date has availability, return mock times:
    // Fewer slots if duration > 45
    if (duration > 45) {
        return ['09:00', '13:00'];
    } else {
        return ['09:00', '10:00', '11:00', '14:00', '15:30'];
    }
}
