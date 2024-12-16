import express from 'express';
import { connectMQTT, subscribe } from '../shared/mqtt/mqttClient.js';

const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883';
const PORT = process.env.PORT || 3003;

const MQTT_OPTIONS = {
    clientId: 'monitoringTool',
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    clean: true
};

let metrics = {
    connectedClients: 0,
    disconnectedClients: 0,
    messagesSent: 0,
    messagesReceived: 0
};

const topicsToMonitor = [
    '$SYS/broker/clients/total',
    '$SYS/broker/messages/sent',
    '$SYS/broker/messages/received'
];

const app = express()

const updateMetrics = (topic, message) => {
    const value = parseInt(message, 10);

    if (topic === '$SYS/broker/clients/total'){
        metrics.connectedClients = value;
        // console.log('This is ', value);
    } else if (topic === '$SYS/broker/clients/disconnected'){
        metrics.disconnectedClients = value;
        // console.log('This is ', value);
    } else if (topic === '$SYS/broker/messages/sent') {
        metrics.messagesSent = value;
        // console.log('This is ', value);
    } else if (topic === '$SYS/broker/messages/received') {
        metrics.messagesReceived = value;
        // console.log('This is ', value);
    }
}

const startTool = async () => {
    try {

        await connectMQTT(MQTT_URI ,MQTT_OPTIONS);

        for (const topic of topicsToMonitor) {
            await subscribe(topic, (message) => {
                console.log(`Topic: ${topic}, Message: ${message}`);
                updateMetrics(topic, message); // Update metrics per topic
                displayMetricsMenu(); // Refresh the metrics menu
            });
            console.log(`Subscribed to: ${topic}`);
        }

        app.listen(PORT, () => {
            console.log(`Monitoring service is running on port ${PORT}`);
        });
    
    } catch (error) {
        console.error('Error starting the monitoring service:', error);
    }
};

startTool();
