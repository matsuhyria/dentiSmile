import mqttUtils from 'shared-mqtt'
import { getAppointmentsByClinic, createAppointments, getAppointmentsByDentist, bookAppointment, getAppointmentById, cancelAppointment, removeAppointment, lockAppointment, unlockAppointment, getAppointmentsByPatientId } from '../controllers/appointmentController.js';
const { handleEndpoint, MQTT_TOPICS } = mqttUtils;

export const initializeRoutes = async () => {
    const { CREATE, RETRIEVE, BOOK, CANCEL, DELETE, CLINIC, PATIENT, LOCK, UNLOCK } = MQTT_TOPICS.APPOINTMENT;

    await handleEndpoint(CLINIC.RETRIEVE.REQUEST, getAppointmentsByClinic, CLINIC.RETRIEVE.RESPONSE);
    await handleEndpoint(RETRIEVE.MANY.REQUEST, getAppointmentsByDentist, RETRIEVE.MANY.RESPONSE);
    await handleEndpoint(RETRIEVE.ONE.REQUEST, getAppointmentById, RETRIEVE.ONE.RESPONSE);
    await handleEndpoint(PATIENT.RETRIEVE.REQUEST, getAppointmentsByPatientId, PATIENT.RETRIEVE.RESPONSE);
    await handleEndpoint(CREATE.REQUEST, createAppointments, CREATE.RESPONSE);
    await handleEndpoint(CANCEL.REQUEST, cancelAppointment, CANCEL.RESPONSE);
    await handleEndpoint(DELETE.REQUEST, removeAppointment, DELETE.RESPONSE);
    await handleEndpoint(BOOK.REQUEST, bookAppointment, BOOK.RESPONSE);
    await handleEndpoint(LOCK.REQUEST, lockAppointment, LOCK.RESPONSE);
    await handleEndpoint(UNLOCK.REQUEST, unlockAppointment, UNLOCK.RESPONSE);
}
