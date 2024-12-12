import mqttUtils from 'shared-mqtt';
import { create } from '../controllers/clinicController.js';

const { handleEndpoint, MQTT_TOPICS } = mqttUtils;

export const initializeRoutes = async () => {
    const { CREATE } = MQTT_TOPICS.CLINIC;

    await handleEndpoint(CREATE.REQUEST, create, CREATE.RESPONSE);
};