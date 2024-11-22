import amqp from 'amqplib';

const connectMQTT = async (URIpath) => {
    try {
        const connection = await amqp.connect(URIpath);
        const channel = await connection.createChannel();
        console.log('MQTT connected');
        return { connection, channel };
    } catch (error) {
        console.error('MQTT connection error: ', error);
        process.exit(1);
    };
};

// sets up an exchange topic
const setupExchangeTopicQueue = async (channel, exchangeName, queueName, routingKey) => {
    try {
        await channel.assertQueue(queueName, { durable: true });
        console.log('Queue asserted ', queueName);

        await channel.assertExchange(exchangeName, 'topic', { durable: true });
        console.log('Exchange asserted ', exchangeName);

        await channel.bindQueue(queueName, exchangeName, routingKey);
        console.log(`Queue ${queueName} bound to exchange ${exchangeName} with key ${routingKey}`);
    } catch (error) {
        console.error('Error asserting queue ', error);
    }
};

const subscribeToQueue = async (channel, queueName, handler) => {
    try {
        await channel.consume(queueName, async (message) => {
            if (message) {
                console.log(`Message received from queue ${queueName}: ${message.content.toString()}`);
                await handler(message.content.toString());
                channel.ack(message);
            }
        });
        console.log(`Subscribed to queue: ${queueName}`);
    } catch (error) {
        console.error('Error subscribing to queue:', error);
    }
};

const publishMessage = async (channel, exchangeName, routingKey, message) => {
    try {
        const payload = typeof message === 'string' ? message : JSON.stringify(message);
        channel.publish(exchangeName, routingKey, Buffer.from(payload), { persistent: true });
        console.log(`Message published to exchange ${exchangeName} with key ${routingKey}: ${payload}`);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
};

const closeMQTT = async (connection, channel) => {
    try {
        if (channel) await channel.close();
        if (connection) await connection.close();
        console.log('MQTT connection and channel closed.');
    } catch (error) {
        console.error('Error closing MQTT connection:', error);
    }
};

export { connectMQTT, setupExchangeTopicQueue, subscribeToQueue, publishMessage, closeMQTT };