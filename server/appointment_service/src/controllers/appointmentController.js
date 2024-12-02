import AppointmentSlot from '../models/appointmentSlot.js';
import { generateSingleDaySlots, generateMultiDaySlots, isValidIsoDate } from '../utils/dateUtils.js';

//appointment/book
const bookAppointment = async (message) => {
    const { patientId, appointmentId } = message.data;

    try {
        const slot = await AppointmentSlot.findById(appointmentId);
        if (!slot) {
            return { status: { code: 404, message: 'Appointment slot not found' } };
        }

        if (slot.status !== 'available') {
            return { status: { code: 400, message: 'Appointment slot is not available' } };
        }

        slot.status = 'booked';
        slot.patientId = patientId;
        await slot.save();

        return { status: { code: 200, message: 'Appointment slot booked successfully' }, slot };
    } catch (error) {
        console.error(error);
        return { status: { code: 500, message: 'Error booking appointment' } };
    }
};

//appointments/details/{slotId}
const getSlotDetails = async (message) => {
    try {
        const { appointmentId } = message.data;
        const slot = await AppointmentSlot.findById(appointmentId);
        if (!slot) {
            return { status: { code: 404, message: 'Slot not found' } };
        }
        return { status: { code: 200, message: 'Slot details retrieved successfully' }, slot };
    } catch (error) {
        return { status: { code: 500, message: 'Error fetching slot details' } };
    }
};

const createAppointments = async (message) => {
    const { dentistId, startTime, endTime, rangeMinutes, isSingleDay } = message.data;

    if (!isValidIsoDate(startTime) || !isValidIsoDate(endTime)) {
        return { status: { code: 400, message: 'Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ) or (YYYY-MM-DDTHH:mm)' } };
    }

    // ensure timezone when the date does not include it
    const start = new Date(startTime).toISOString();
    const end = new Date(endTime).toISOString();

    if (start < new Date() || end < new Date()) {
        return { status: { code: 400, message: 'Dates cannot be in the past' } };
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
            return { status: { code: 400, message: 'Slots for this timeframe already exist' } };
        }

        const slots = isSingleDay
            ? generateSingleDaySlots(dentistId, start, end, rangeMinutes)
            : generateMultiDaySlots(dentistId, start, end, rangeMinutes);

        if (slots.length < 1) return { status: { code: 400, message: 'Appointment duration invalid' } };

        await AppointmentSlot.insertMany(slots);
        return { status: { code: 200, message: 'Appointment slots created successfully' } };
    } catch (error) {
        console.log(error);
        return { status: { code: 500, message: 'Error creating appointment slots' } };
    }
};

const getAppointments = async (message) => {
    try {
        // Finds appointments for a specific dentist within the given timeframe
        // Dentist, starting date and ending date will be passed in as query parameters
        const { dentistId, startingDate, endingDate } = message.data;

        if (!dentistId || !startingDate || !endingDate) {
            return { status: { code: 400, message: 'Missing required fields. Expected query format: ?dentistId=abcd&startingDate=YYYY-MM-DD&endingDate=YYYY-MM-DD'} };
        }

        const appointments = await AppointmentSlot.find({
            dentistId: dentistId
        });
        return { status: { code:200, message: "Appointments retrieved successfully" }, data: appointments };
    } catch (error) {
        console.log(error);
        return { status: {code: 500, message: 'Error fetching appointments' }};
    }
};

const cancelAppointment = async (message) => {
    try {
        const { appointmentId } = message.data;
        const document = await AppointmentSlot.findById(appointmentId);
        if (!document) {
            return { status: {code: 400, message: 'Appointment does not exist'} };
        }
        if (document.status === 'canceled' && document.patientId !== null) {
            return { status: {code: 400, message: 'Appointment is already cancelled'} };
        }
        document.status = 'canceled';
        document.patientId = null;
        await document.save();

        return { status: {code: 200, message: 'Appointment cancelled successfully'}, data: document };
    } catch (error) {
        console.error(error);
        return { status: {code: 500, message: 'Error cancelling appointment'} };
    }
};

const removeAppointment = async (message) => {
    try {
        const { appointmentId } = message.data;
        const appointment = await AppointmentSlot.findByIdAndDelete(appointmentId);
        if (!appointment) {
            return { status: { code: 404, message: 'Appointment not found'} };
        }
        return { status: { code: 200, message: 'Appointment removed successfully' }, data: appointment };
    } catch (error) {
        console.log(error);
        return { status: { code: 500, message: 'Error removing appointment'} };
    }
};

export { createAppointments, getAppointments, bookAppointment, getSlotDetails, cancelAppointment, removeAppointment };
