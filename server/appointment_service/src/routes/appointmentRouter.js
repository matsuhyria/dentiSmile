import { getAppointmentsByClinic, createAppointments, getAppointmentsByDentist, bookAppointment, getAppointmentById, cancelAppointment, removeAppointment, getAppointmentsByPatientId } from '../controllers/appointmentController.js';
import mqttUtils from 'shared-mqtt'
const { handleEndpoint, MQTT_TOPICS, publish } = mqttUtils;

export const publishAllNotifications = async (slots) => {
    const groupedByDay = [...new Set(slots.map(slot => {
        const startDate = new Date(slot.startTime);
        return startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }))];

    for (const day of groupedByDay) {
        await publishNotification(day);
    }
};

const publishNotification = async (day) => {
    const notificationEvent = {
        notification: `New appointment slots are now available on ${day}`
    };

    try {
        await publish(MQTT_TOPICS.NOTIFICATION.APPOINTMENT.CREATE, notificationEvent);
    } catch (error) {
        console.error('Error publishing notification:', error);
    }
};

export const initializeRoutes = async () => {
    const { CREATE, RETRIEVE, BOOK, CANCEL, DELETE, CLINIC, PATIENT } = MQTT_TOPICS.APPOINTMENT;

    await handleEndpoint(CLINIC.RETRIEVE.REQUEST, getAppointmentsByClinic, CLINIC.RETRIEVE.RESPONSE);
    await handleEndpoint(RETRIEVE.MANY.REQUEST, getAppointmentsByDentist, RETRIEVE.MANY.RESPONSE);
    await handleEndpoint(RETRIEVE.ONE.REQUEST, getAppointmentById, RETRIEVE.ONE.RESPONSE);
    await handleEndpoint(PATIENT.RETRIEVE.REQUEST, getAppointmentsByPatientId, PATIENT.RETRIEVE.RESPONSE);
    await handleEndpoint(CREATE.REQUEST, createAppointments, CREATE.RESPONSE);
    await handleEndpoint(CANCEL.REQUEST, cancelAppointment, CANCEL.RESPONSE);
    await handleEndpoint(DELETE.REQUEST, removeAppointment, DELETE.RESPONSE);
    await handleEndpoint(BOOK.REQUEST, bookAppointment, BOOK.RESPONSE);
}
