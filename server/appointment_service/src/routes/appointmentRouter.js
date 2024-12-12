import { createAppointments, getAppointments, bookAppointment, getSlotDetails, cancelAppointment, removeAppointment } from '../controllers/appointmentController.js';
import mqttUtils from 'shared-mqtt'
const { handleEndpoint, MQTT_TOPICS, subscribe, publish } = mqttUtils;

const publishNotification = async (createdSlots) => {
    const notificationEvent = {
        message: 'New appointment slots are now available',
        slots: createdSlots.map(slot => ({
            slotId: slot._id,
        })),
    };

    try {
        await publish(MQTT_TOPICS.NOTIFICATION.APPOINTMENT.CREATE.REQUEST, notificationEvent);
    } catch (error) {
        console.error('Error publishing notification:', error);
    }
};

export const initializeRoutes = async () => {
    const { CREATE, RETRIEVE, BOOK, CANCEL, DELETE } = MQTT_TOPICS.APPOINTMENT;

    await handleEndpoint(RETRIEVE.MANY.REQUEST, getAppointments, RETRIEVE.MANY.RESPONSE);
    await handleEndpoint(RETRIEVE.ONE.REQUEST, getSlotDetails, RETRIEVE.ONE.RESPONSE);
    await handleEndpoint(CREATE.REQUEST, createAppointments, CREATE.RESPONSE);
    await handleEndpoint(CANCEL.REQUEST, cancelAppointment, CANCEL.RESPONSE);
    await handleEndpoint(DELETE.REQUEST, removeAppointment, DELETE.RESPONSE);
    await handleEndpoint(BOOK.REQUEST, bookAppointment, BOOK.RESPONSE);
}

export { publishNotification };