import mqttUtils from 'shared-mqtt';
// import { register, login } from '../controllers/autController.js';

const { handleEndpoint, MQTT_TOPICS } = mqttUtils;

export const initializeRoutes = async () => {
    // const { REGISTER, LOGIN } = MQTT_TOPICS.NOTIFICATION;

    // await handleEndpoint(REGISTER.REQUEST, register, REGISTER.RESPONSE);
    // await handleEndpoint(LOGIN.REQUEST, login, LOGIN.RESPONSE);
};