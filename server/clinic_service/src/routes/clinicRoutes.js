import mqttUtils from 'shared-mqtt';
import { create, update, remove, retrieveAll, retreieveOne, addDentist } from '../controllers/clinicController.js';

const { handleEndpoint, MQTT_TOPICS } = mqttUtils;

export const initializeRoutes = async () => {
    const { CREATE, UPDATE, REMOVE, RETRIEVE } = MQTT_TOPICS.CLINIC;

    await handleEndpoint(CREATE.REQUEST, create, CREATE.RESPONSE);
    await handleEndpoint(UPDATE.REQUEST, update, UPDATE.RESPONSE);
    await handleEndpoint(REMOVE.REQUEST, remove, REMOVE.RESPONSE);
    await handleEndpoint(RETRIEVE.MANY.REQUEST, retrieveAll, RETRIEVE.MANY.RESPONSE);
    await handleEndpoint(RETRIEVE.ONE.REQUEST, retreieveOne, RETRIEVE.ONE.RESPONSE);
    // TO-DO: add callback function
    //await handleEndpoint(RETRIEVE.REQUEST, addDentist, RETRIEVE.RESPONSE);
};