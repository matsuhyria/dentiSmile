import AppointmentSlot from '../models/appointmentSlot.js';
import { generateSingleDaySlots, generateMultiDaySlots, isValidIsoDate } from '../utils/dateUtils.js';

const createAppointments = async (req, res) => {
    const { dentistId, startTime, endTime, rangeMinutes, isSingleDay } = req.body;

    if (!isValidIsoDate(startTime) || !isValidIsoDate(endTime)) {
        return res.status(400).json({ message: 'Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ) or (YYYY-MM-DDTHH:mm)' });
    }

    // ensure timezone when the date does not include it
    const start = new Date(startTime).toISOString();
    const end = new Date(endTime).toISOString();

    if (start < new Date() || end < new Date()) {
        return res.status(400).json({ message: 'Dates cannot be in the past' });
    }

    try {
        const existingSlots = await AppointmentSlot.find({
            dentistId,
            $or: [
                { startTime: { $lt: start }, endTime: { $gt: end } },
                { startTime: { $gte: start }, endTime: { $lte: end } }
            ]
        });

        if (existingSlots.length > 0) {
            return res.status(400).json({ message: 'Slots for this timeframe already exist' });
        }

        const slots = isSingleDay
            ? generateSingleDaySlots(dentistId, start, end, rangeMinutes)
            : generateMultiDaySlots(dentistId, start, end, rangeMinutes);

        if (slots.length < 1) return res.status(400).json({ message: 'Appointment duration invalid' });

        await AppointmentSlot.insertMany(slots);
        return res.status(200).json({ message: 'Appointment slots pubslished successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating appointment slots' });
    }
};

export { createAppointments };