import { handleEndpoint } from '../../../../shared/mqtt/mqtt.js';
import { MQTT_TOPICS } from '../../../../shared/mqtt/mqttTopics.js';
import { register } from '../controllers/authController.js';

export const initializeRoutes = async () => {
    await handleEndpoint(MQTT_TOPICS.AUTHENTICATION.REGISTER.REQUEST, register, MQTT_TOPICS.AUTHENTICATION.REGISTER.RESPONSE);
};