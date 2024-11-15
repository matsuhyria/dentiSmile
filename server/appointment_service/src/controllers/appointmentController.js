import AppointmentSlot from '../models/appointmentSlot.js';
import { compareIsoDates, generateTimeSlots } from '../utils/dateUtils.js';

const createAppointment = async (req, res) => {
    const { dentistId, startTime, endTime } = req.body;

    // dentistId presence is checked by the database
    if (!startTime || !endTime) return res.status(400).json({ message: 'Times cannot be null' });

    if (compareIsoDates(startTime, endTime) >= 0) return res.status(400).json({ message: 'Invalid time range' });

    const slots = generateTimeSlots(startTime, endTime, dentistId);
    console.log(slots);

    try {
        await AppointmentSlot.insertMany(slots);
        return res.status(200).json({ message: 'Availability slots pubslished successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating availability slots' });
    }
};

export { createAppointment };