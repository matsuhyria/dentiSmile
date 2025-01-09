import mqttUtils from 'shared-mqtt';
import { subscribeToDate, getSubscriptionsByPatient, removeSubscription } from '../controllers/subscriptionController.js';
import { notifyAppointmentCanceled, notifyAppointmentBooked, notifyAvailableSlots } from '../controllers/notificationController.js';
const { handleEndpoint, MQTT_TOPICS, subscribe } = mqttUtils;

export const initializeRoutes = async () => {
    const { SUBSCRIPTION, EVENT } = MQTT_TOPICS.NOTIFICATION;

    await handleEndpoint(SUBSCRIPTION.CREATE.REQUEST, subscribeToDate, SUBSCRIPTION.CREATE.RESPONSE);
    await handleEndpoint(SUBSCRIPTION.RETRIEVE.REQUEST, getSubscriptionsByPatient, SUBSCRIPTION.RETRIEVE.RESPONSE);
    await handleEndpoint(SUBSCRIPTION.CANCEL.REQUEST, removeSubscription, SUBSCRIPTION.CANCEL.RESPONSE);

    await subscribe(EVENT.AVAILABILITY, notifyAvailableSlots);
    await subscribe(EVENT.APPOINTMENT.CANCELED, notifyAppointmentCanceled);
    await subscribe(EVENT.APPOINTMENT.BOOKED, notifyAppointmentBooked);
};