import AppointmentSlot from '../models/appointmentSlot.js';
import { generateSingleDaySlots, generateMultiDaySlots, isValidIsoDate } from '../utils/dateUtils.js';
import { publishAllNotifications } from '../routes/appointmentRouter.js';


export const bookAppointment = async (message) => {
    try {
        const { patientId, appointmentId } = JSON.parse(message);
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

export const createAppointments = async (message) => {
    try {
        const { clinicName, clinicId, dentistId, startTime, endTime, duration } = JSON.parse(message);

        const additionalParams = { clinicName, clinicId, dentistId };

        if (!isValidIsoDate(startTime) || !isValidIsoDate(endTime)) {
            return { status: { code: 400, message: 'Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ) or (YYYY-MM-DDTHH:mm)' } };
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start < new Date() || end < new Date()) {
            return { status: { code: 400, message: 'Dates cannot be in the past' } };
        }

        // TO-DO: check dentistId validity?
        const existingSlots = await AppointmentSlot.find({
            dentistId,
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });

        if (existingSlots.length > 0) {
            return { status: { code: 400, message: 'Slots for this timeframe already exist' } };
        }

        const isSingleDay = (end - start) < (24 * 60 * 60 * 1000);
        const slots = isSingleDay
            ? generateSingleDaySlots(start, end, duration, additionalParams)
            : generateMultiDaySlots(start, end, duration, additionalParams);

        if (slots.length < 1) return { status: { code: 400, message: 'Appointment duration invalid' } };

        await AppointmentSlot.insertMany(slots);

        // don't need to await here
        publishAllNotifications(slots);
        return { status: { code: 200, message: 'Appointment slots created successfully' } };
    } catch (error) {
        console.log(error);
        return { status: { code: 500, message: 'Error creating appointment slots' } };
    }
};

export const cancelAppointment = async (message) => {
    try {
        const { appointmentId } = JSON.parse(message);

        const appointment = await AppointmentSlot.findById(appointmentId);

        if (!appointment) {
            return { status: { code: 400, message: 'Appointment does not exist' } };
        }

        if (appointment.status === 'available' && appointment.patientId === null) {
            return { status: { code: 400, message: 'Appointment is already cancelled' } };
        }

        appointment.status = 'available';
        appointment.patientId = null;
        await appointment.save();

        return { status: { code: 200, message: 'Appointment cancelled successfully' }, data: appointment };
    } catch (error) {
        console.error(error);
        return { status: { code: 500, message: 'Error cancelling appointment' } };
    }
};

export const removeAppointment = async (message) => {
    try {
        const { appointmentId } = JSON.parse(message);
        const appointment = await AppointmentSlot.findByIdAndDelete(appointmentId);
        if (!appointment) {
            return { status: { code: 404, message: 'Appointment not found' } };
        }
        return { status: { code: 200, message: 'Appointment removed successfully' }, data: appointment };
    } catch (error) {
        console.log(error);
        return { status: { code: 500, message: 'Error removing appointment' } };
    }
};

export const getAppointmentsByClinic = async (message) => {
    try {
        const { clinicId } = JSON.parse(message);

        const appointments = await AppointmentSlot.find({ clinicId });

        if (appointments.length < 1) {
            return { status: { code: 404, message: "Appointments not found" } };
        }

        return { status: { code: 200, message: "Appointments retrieved successfully" }, data: appointments };
    } catch (error) {
        console.log(error);
        return { status: { code: 500, message: 'Error fetching appointments' } };
    }
};

export const getAppointmentsByDentist = async (message) => {
    try {
        // Finds appointments for a specific dentist within the given timeframe
        // Dentist, starting date and ending date will be passed in as query parameters
        const { dentistId, startingDate, endingDate } = JSON.parse(message);

        if (!dentistId || !startingDate || !endingDate) {
            return { status: { code: 400, message: 'Missing required fields. Expected query format: ?dentistId=abcd&startingDate=YYYY-MM-DD&endingDate=YYYY-MM-DD' } };
        }

        const appointments = await AppointmentSlot.find({
            dentistId: dentistId,
            startTime: {
                $gte: new Date(startingDate),
                $lte: new Date(endingDate)
            }
        });
        return { status: { code: 200, message: "Appointments retrieved successfully" }, data: appointments };
    } catch (error) {
        console.log(error);
        return { status: { code: 500, message: 'Error fetching appointments' } };
    }
};

export const getAppointmentById = async (message) => {
    try {
        const { appointmentId } = JSON.parse(message);
        const slot = await AppointmentSlot.findById(appointmentId);
        if (!slot) {
            return { status: { code: 404, message: 'Appointment not found' } };
        }
        return { status: { code: 200, message: 'Appointment retrieved successfully' }, data: slot };
    } catch (error) {
        return { status: { code: 500, message: 'Error fetching slot details' } };
    }
};