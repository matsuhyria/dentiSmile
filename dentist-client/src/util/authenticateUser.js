import { publish, subscribe, unsubscribe } from '../../../shared/mqtt/mqtt.js'
import { MQTT_TOPICS } from '../../../shared/mqtt/mqttTopics.js'
import { getClientId } from './clientId.js'

// Failure conditions can be handled by reject instead
export const loginSequence = async (username, password) => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            unsubscribe(MQTT_TOPICS.AUTHENTICATION.LOGIN.RESPONSE(getClientId()));
            resolve({ status: false, message: 'Login request timed out' });
        }, 10000);

        subscribe(MQTT_TOPICS.AUTHENTICATION.LOGIN.RESPONSE(getClientId()), (message) => {
            clearTimeout(timeout);
            unsubscribe(MQTT_TOPICS.AUTHENTICATION.LOGIN.RESPONSE(getClientId()));

            // Validate response
            if (message.status.code === 200) {
                resolve({ status: true });
            } else {
                resolve({ status: false, message: message.status.message });
            }
        });
        loginRequest(username, password).catch((error) => { console.log(error); });
    });
};

const loginRequest = async (username, password) => {
    await publish(MQTT_TOPICS.AUTHENTICATION.LOGIN.REQUEST, { "username":username, "password":password, clientId: getClientId() })
}