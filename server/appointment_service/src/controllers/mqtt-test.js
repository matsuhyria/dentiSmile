import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log('Connected to RabbitMQTT broker');

    client.subscribe('test/topic', (err) => {
        if (!err) {
            console.log('Subscribed to test/topic');
            client.publish('test/topic', 'Hello from MQTT test');
        }
    });
});

client.on('message', (topic, message) => {
    console.log(`Received message from ${topic}: ${message.toString()}`);
});

client.on('error', (error) => {
    console.error('Mqtt client error:', error);
});