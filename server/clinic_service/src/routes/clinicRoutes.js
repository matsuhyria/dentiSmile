import mqttUtils from 'shared-mqtt';
import { create, update, remove } from '../controllers/clinicController.js';

const { handleEndpoint, MQTT_TOPICS } = mqttUtils;

export const initializeRoutes = async () => {
    const { CREATE, UPDATE, REMOVE } = MQTT_TOPICS.CLINIC;

    await handleEndpoint(CREATE.REQUEST, create, CREATE.RESPONSE);
    await handleEndpoint(UPDATE.REQUEST, update, UPDATE.RESPONSE);
    await handleEndpoint(REMOVE.REQUEST, remove, REMOVE.RESPONSE);
};