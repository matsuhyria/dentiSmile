import mqttUtils from 'shared-mqtt';
import { register } from '../controllers/authController.js';

const { handleEndpoint, MQTT_TOPICS } = mqttUtils;

export const initializeRoutes = async () => {
    await handleEndpoint(MQTT_TOPICS.AUTHENTICATION.REGISTER.REQUEST, register, MQTT_TOPICS.AUTHENTICATION.REGISTER.RESPONSE);
};