// negative if the first date is earlier
// positive if the second date is earlier
// 0 if both dates are exactly the same
const compareIsoDates = (stringDate1, stringDdate2) => {
    return new Date(stringDate1).valueOf() - new Date(stringDdate2).valueOf();
};

const compareDates = (stringDate1, stringDdate2) => {
    return stringDate1.valueOf() - stringDdate2.valueOf();
};

const generateTimeSlots = (startIsoDate, endIsoDate, dentistId) => {
    const start = new Date(startIsoDate);
    const end = new Date(endIsoDate);

    const slots = [];

    while (compareDates(start, end) < 0) {
        const curr = new Date(start);
        curr.setUTCHours(8, 0, 0, 0);

        for (let hour = 8; hour < 16; hour++) {
            const startSlotTime = new Date(curr);
            startSlotTime.setUTCHours(hour, 0, 0, 0);

            const endSlotTime = new Date(curr);
            endSlotTime.setUTCHours(hour + 1, 0, 0, 0);

            slots.push({
                dentistId: dentistId,
                startTime: startSlotTime.toISOString(),
                endTime: endSlotTime.toISOString()
            });
        }

        // Increment day
        start.setUTCDate(start.getUTCDate() + 1);
    }
    return slots;
};

export { compareIsoDates, generateTimeSlots };