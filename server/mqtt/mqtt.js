import { connectAsync } from 'mqtt';

const connectMQTT = async (MQTT_URI, options = {}) => {
    try {
        const client = await connectAsync(MQTT_URI, options);
        console.log('MQTT connected successfully');
        return client;
    } catch (error) {
        console.error('Error connecting MQTT', error);
        throw error;
    }
};

const publish = async (client, topic, message, options = {}) => {
    try {
        await client.publishAsync(topic, message, options);
        console.log(`Message published to topic "${topic}": ${message}`);
    } catch (error) {
        console.error(`Error publishing to topic "${topic}":`, error);
        throw error;
    }
};

const subscribe = async (client, topic, callback, options = {}) => {
    try {
        await client.subscribeAsync(topic, options);
        console.log(`Subscribed to topic "${topic}"`);

        client.on('message', (receivedTopic, message) => {
            if (receivedTopic === topic) {
                callback(message.toString());
            }
        });
    } catch (error) {
        console.error(`Error subscribing to topic "${topic}":`, error);
        throw error;
    }
};

const disconnectMQTT = async (client, options = {}) => {
    try {
        await client.endAsync(options);
        console.log('MQTT client disconnected');
    } catch (error) {
        console.error('Error disconnecting MQTT client:', error);
        throw error;
    }
};

module.exports = {
    connectMQTT,
    publish,
    subscribe,
    disconnectMQTT,
};