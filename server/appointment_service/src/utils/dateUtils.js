import moment from 'moment';

// negative if the first date is earlier
// positive if the second date is earlier
// 0 if both dates are exactly the same
const compareIsoDates = (startDateISO, endDateISO) => {
    const start = moment(startDateISO);
    const end = moment(endDateISO);
    if (start.isBefore(end)) {
        return -1;
    } else if (end.isAfter(start)) {
        return 1;
    } else {
        return 0;
    }
};

/**
 * Generates time slots for a dentist between the specified start and end times.
 *
 * @param {number} dentistId - The unique identifier of the dentist for whom the slots are being generated.
 * @param {string} startDateISO - The ISO string representing the start time for generating slots.
 * @param {string} endDateISO - The ISO string representing the end time for generating slots.
 * @param {number} [minutes=60] - The duration of each time slot in minutes. Defaults to 60 minutes (1 hour) if not provided.
 *
 * @returns {Array} - An array of time slot objects, each containing a `startTime`, `endTime`, and `dentistId`.
 **/
const generateTimeSlots = (dentistId, startDateISO, endDateISO, minutes = 60) => {
    const start = moment(startDateISO);
    const end = moment(endDateISO);

    const slots = [];

    let currStart = start.clone();
    let currEnd = end.clone();

    while (currStart.isBefore(end)) {
        // currStart.clone() to not modify the original currStart
        currEnd = currStart.clone().add(minutes, 'minutes');

        if (currEnd.isAfter(end)) {
            return slots;
        }

        slots.push({
            dentistId: dentistId,
            startTime: currStart.toISOString(),
            endTime: currEnd.toISOString()
        });

        currStart.add(minutes, 'minutes');
    }
    return slots;
};

/**
 * Helper function that generates repeated time slots for a dentist between the specified start and end dates.
 * The function creates slots for the same time every day between the given date range.
 * Params and returns definition is the same as for the function above
 **/
const generateRepeatedTimeSlots = (dentistId, startDateISO, endDateISO, minutes = 60) => {
    const slots = [];

    const end = moment(endDateISO);

    let currStart = moment(startDateISO).clone();

    const endHour = end.hours();
    const endMinutes = end.minutes();
    let currEnd = currStart.clone().set({ hour: endHour, minute: endMinutes, second: 0, millisecond: 0 });

    while (currStart.isSameOrBefore(end, 'day')) {
        const dailySlots = generateTimeSlots(dentistId, currStart.toISOString(), currEnd.toISOString(), minutes);

        slots.push(...dailySlots);

        currStart.add(1, 'days');
        currEnd.add(1, 'days');
    }
    return slots;
};

const isValidIsoDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}.\d{3}Z)?$/;
    if (!regex.test(date)) {
        return false;
    }

    const inputDate = date.endsWith('Z') ? date : date + 'Z';
    const parsedDate = new Date(inputDate);

    if (isNaN(parsedDate.getTime())) {
        return false;
    }

    const [datePart, timePart] = date.split('T');

    const [year, month, day] = datePart.split('-').map(Number);

    if (parsedDate.getUTCFullYear() !== year ||
        parsedDate.getUTCMonth() + 1 !== month || // getUTCMonth() returns a number 0 - 11
        parsedDate.getUTCDate() !== day) {
        return false;
    }

    const [time, ms] = timePart.replace('Z', '').split('.');

    const [hour, minute, second = 0] = time.split(':').map(Number);

    if (parsedDate.getUTCHours() !== hour ||
        parsedDate.getUTCMinutes() !== minute ||
        parsedDate.getUTCSeconds() !== second) {
        return false;
    }

    if (ms && parsedDate.getUTCMilliseconds() !== Number(ms)) {
        return false;
    }

    return true;
}


export { compareIsoDates, generateTimeSlots, generateRepeatedTimeSlots, isValidIsoDate };