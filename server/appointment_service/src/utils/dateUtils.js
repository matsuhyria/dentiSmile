// negative if the first date is earlier
// positive if the second date is earlier
// 0 if both dates are exactly the same
const compareIsoDates = (stringDate1, stringDdate2) => {
    return new Date(stringDate1).valueOf() - new Date(stringDdate2).valueOf();
};

const generateTimeSlots = (startIsoDate, endIsoDate, dentistId) => {
    const start = new Date(startIsoDate);
    const end = new Date(endIsoDate);

    const slots = [];

    while (start < end) {
        const endSlotTime = new Date(start);
        endSlotTime.setHours(start.getHours() + 1);

        const startSlot = start.toISOString;
        const endSlot = endSlotTime.toISOString;

        slots.push({
            startTime: startSlot,
            endTime: endSlot,
            dentistId: dentistId
        });

        start.setHours(start.getHours() + 1);
    }
    return slots;
};

export { compareIsoDates, generateTimeSlots };