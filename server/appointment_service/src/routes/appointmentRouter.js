import { createAppointments, getAppointments, bookAppointment, getSlotDetails, cancelAppointment, removeAppointment } from '../controllers/appointmentController.js';
import mqttUtils from 'shared-mqtt'
const { subscribe, publish } = mqttUtils;
import { MQTT_TOPICS } from '../../../../shared/mqtt/mqttTopics.js';

const mqttRouter = async () => {

    // Utility function to handle subscriptions
    const handleSubscription = async (topic, handler) => {
        await subscribe(topic, async (message) => {
            try {
                console.log(`${topic} Request:`, message);
                const response = await handler(message);
                publish(topic.replace('.REQUEST', `.RESPONSE(${message.clientId})`), response);
            } catch (error) {
                console.error(`Error caught during publishing for ${topic}:`, error);
            }
        });
    };

    // Dentist Topics
    await handleSubscription(MQTT_TOPICS.APPOINTMENT.RETREIVE.MANY.REQUEST, getAppointments);
    await handleSubscription(MQTT_TOPICS.APPOINTMENT.RETREIVE.ONE.REQUEST, getSlotDetails);
    await handleSubscription(MQTT_TOPICS.APPOINTMENT.CREATE.REQUEST, createAppointments);
    await handleSubscription(MQTT_TOPICS.APPOINTMENT.CANCEL.REQUEST, cancelAppointment);
    await handleSubscription(MQTT_TOPICS.APPOINTMENT.DELETE.REQUEST, removeAppointment);

    // Patient Topics
    await handleSubscription(MQTT_TOPICS.APPOINTMENT.RETREIVE.MANY.REQUEST, getAppointments);
    await handleSubscription(MQTT_TOPICS.APPOINTMENT.BOOK.REQUEST, bookAppointment);

}

export default mqttRouter;