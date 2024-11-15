import AppointmentSlot from '../models/appointmentSlot.js';
import { compareIsoDates, generateTimeSlots } from '../utils/dateUtils.js';

const createAppointment = async (req, res) => {
    const { dentistId, startDay, endDay, startHour, endHour } = req.body;

    // dentistId presence is checked by the database
    if (!startDay || !endDay) return res.status(400).json({ message: 'Days cannot be null' });

    const currentTime = new Date().toISOString();
    if (compareIsoDates(startDay, currentTime) < 0 || compareIsoDates(endDay, currentTime) < 0) {
        return res.status(400).json({ message: 'Days cannot be in the past' });
    }

    // endDay cannot be less or equal startDay
    if (compareIsoDates(startDay, endDay) >= 0) return res.status(400).json({ message: 'Invalid days range' });

    try {
        const existingSlots = await AppointmentSlot.find({
            dentistId,
            $or: [
                { startDay: { $gte: startDay, $lt: endDay } }, // example: existing: "10.00-11.00", new: "9.30-10.30"
                { endDay: { $gt: startDay, $lte: endDay } }, // example: existing: "10.00-11.00", new: "10.30-11.30"
                { startDay: { $lt: startDay }, endDay: { $gt: endDay } } // example: existing: "09.00-12.00", new: "10.00"
            ]
        });

        if (existingSlots.length > 0) {
            return res.status(400).json({ message: 'Slots for this timeframe already exist' });
        }

        // no effect if startHour or endHour is undefined
        const slots = generateTimeSlots(dentistId, startDay, endDay, startHour, endHour);

        await AppointmentSlot.insertMany(slots);
        return res.status(200).json({ message: 'Appointment slots pubslished successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating appointment slots' });
    }
};

export { createAppointment };