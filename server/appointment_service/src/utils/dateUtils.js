const addUTCMinutes = (date, minutes) => {
    const newDate = new Date(date);
    newDate.setUTCMinutes(newDate.getUTCMinutes() + minutes);
    return newDate;
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
const generateSlots = (dentistId, startDateISO, endDateISO, minutes = 60) => {
    const slots = [];

    const end = new Date(endDateISO);

    let currStart = new Date(startDateISO);
    let currEnd = new Date(endDateISO);

    while (currStart < end) {
        currEnd = addUTCMinutes(currStart, minutes);

        if (currEnd > end) {
            return slots;
        }

        slots.push({
            dentistId: dentistId,
            startTime: currStart.toISOString(),
            endTime: currEnd.toISOString()
        });

        currStart = addUTCMinutes(currStart, minutes);
    }
    return slots;
};

/**
 * Helper function that generates repeated time slots for a dentist between the specified start and end dates.
 * The function creates slots for the same time every day between the given date range.
 * Params and returns definition is the same as for the function above (generateSlots())
 * 
 * The function does not handle cases where the specified times (startDateISO and endDateISO) cannot fit into
 * the same time range across multiple days.
 * For example:
 *  startDateISO '2024-11-21T22:00:00.000Z' 
 *  endDateISO is '2024-11-22T02:00:00.000Z',
 *  the function will return an empty array.
 * 
 * To handle such cases use generateSlots() 
 **/
const generateRepeatedTimeSlots = (dentistId, startDateISO, endDateISO, minutes = 60) => {
    const slots = [];

    const end = new Date(endDateISO);

    const endHour = end.getUTCHours();
    const endMinutes = end.getUTCMinutes();

    let currStart = new Date(startDateISO);
    let currEnd = new Date(startDateISO);
    currEnd.setUTCHours(endHour, endMinutes, 0, 0);

    while (currStart <= end) {
        const dailySlots = generateSlots(dentistId, currStart.toISOString(), currEnd.toISOString(), minutes);

        slots.push(...dailySlots);

        currStart.setUTCDate(currStart.getUTCDate() + 1);
        currEnd.setUTCDate(currEnd.getUTCDate() + 1);
    }

    return slots;
};


const dentistId = '303';
const startDateISO = '2024-11-21T22:00:00.000Z';
const endDateISO = '2024-11-22T02:00:00.000Z';
const slots = generateRepeatedTimeSlots(dentistId, startDateISO, endDateISO, 60);
console.log(slots);

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

export { generateSlots, generateRepeatedTimeSlots, isValidIsoDate };