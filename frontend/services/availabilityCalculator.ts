import { timeToMinutes, minutesToTime } from '@/lib/utils';

interface Interval {
    start: string;
    end: string;
}

interface Appointment {
    start: string; // 'HH:MM'
    duration: number; // in minutes
}

export function calculateAvailability(
    openHours: Interval[],
    appointments: Appointment[],
    requestedDuration: number
): string[] {
    const availableTimes: string[] = [];

    const openRanges = openHours.map((interval) => ({
        start: timeToMinutes(interval.start),
        end: timeToMinutes(interval.end)
    }));

    let freeIntervals = [...openRanges];

    // Subtract appointments from free intervals
    for (const appt of appointments) {
        const apptStart = timeToMinutes(appt.start);
        const apptEnd = apptStart + appt.duration;

        freeIntervals = freeIntervals.flatMap((interval) => {
            if (apptEnd <= interval.start || apptStart >= interval.end) {
                return [interval]; // no overlap
            } else {
                const intervals = [];
                if (apptStart > interval.start) {
                    intervals.push({ start: interval.start, end: apptStart });
                }
                if (apptEnd < interval.end) {
                    intervals.push({ start: apptEnd, end: interval.end });
                }
                return intervals;
            }
        });
    }

    const increment = 15;
    for (const interval of freeIntervals) {
        let slotStart = interval.start;
        while (slotStart + requestedDuration <= interval.end) {
            availableTimes.push(minutesToTime(slotStart));
            slotStart += increment;
        }
    }

    return availableTimes;
}
