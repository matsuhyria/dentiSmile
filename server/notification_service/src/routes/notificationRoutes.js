import mqttUtils from 'shared-mqtt';
import { subscribeToDate, getSubscriptions, removeSubscription } from '../controllers/notificationController.js';

const { handleEndpoint, MQTT_TOPICS } = mqttUtils;

export const initializeRoutes = async () => {
    const { SUBSCRIPTION } = MQTT_TOPICS.NOTIFICATION;

    await handleEndpoint(SUBSCRIPTION.CREATE.REQUEST, subscribeToDate, SUBSCRIPTION.CREATE.RESPONSE);
    await handleEndpoint(SUBSCRIPTION.RETRIEVE.REQUEST, getSubscriptions, SUBSCRIPTION.RETRIEVE.RESPONSE);
    await handleEndpoint(SUBSCRIPTION.CANCEL.REQUEST, removeSubscription, SUBSCRIPTION.CANCEL.RESPONSE);
};