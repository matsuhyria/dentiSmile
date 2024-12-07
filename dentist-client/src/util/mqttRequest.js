import { publish, subscribe, unsubscribe } from '../../../shared/mqtt/mqtt.js'
import { getClientId } from './clientId.js'

// Failure conditions can be handled by reject instead
export const mqttRequestResponse = async (payload, topic) => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            unsubscribe(topic.RESPONSE(getClientId()));
            resolve({ status: false, message: 'Request timed out' });
        }, 10000);

        subscribe(topic.RESPONSE(getClientId()), (message) => {
            clearTimeout(timeout);
            unsubscribe(topic.RESPONSE(getClientId()));
            resolve(message);
        }).then(() => {
            request(topic.REQUEST, payload).catch((error) => { console.log(error); });
        });
    });
};

// Every request will send the clientId to the server
const request = async (topic, payload) => {
    await publish(topic, { ...payload, clientId: getClientId() })
}